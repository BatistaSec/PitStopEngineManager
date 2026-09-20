'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';
import { Users, Car, Plus, Pencil, Trash2, X, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface TeamDTO {
  id?: number;
  name: string;
  country: string;
  baseLocation: string;
  powerUnit: string;
}

interface DriverDTO {
  id?: number;
  code: string;
  permanentNumber: number;
  firstName: string;
  lastName: string;
  nationality: string;
  teamId: number;
  teamName?: string;
}

type ManagerTab = 'teams' | 'drivers';
type ModalMode = 'create' | 'edit';

const EMPTY_TEAM: TeamDTO = { name: '', country: '', baseLocation: '', powerUnit: '' };
const EMPTY_DRIVER: DriverDTO = { code: '', permanentNumber: 0, firstName: '', lastName: '', nationality: '', teamId: 0 };

export default function TeamsDriversManager() {
  const [tab, setTab] = useState<ManagerTab>('teams');

  // Teams state
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Drivers state
  const [drivers, setDrivers] = useState<DriverDTO[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingTeam, setEditingTeam] = useState<TeamDTO>(EMPTY_TEAM);
  const [editingDriver, setEditingDriver] = useState<DriverDTO>(EMPTY_DRIVER);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ---- Data Fetching ----
  const fetchTeams = useCallback(async () => {
    setLoadingTeams(true);
    try {
      const data = await apiFetch<TeamDTO[]>('/teams');
      setTeams(data);
    } catch {
      setTeams([]);
    } finally {
      setLoadingTeams(false);
    }
  }, []);

  const fetchDrivers = useCallback(async () => {
    setLoadingDrivers(true);
    try {
      const data = await apiFetch<DriverDTO[]>('/drivers');
      setDrivers(data);
    } catch {
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
    fetchDrivers();
  }, [fetchTeams, fetchDrivers]);

  // ---- CRUD Actions ----
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const openCreateModal = () => {
    setModalMode('create');
    if (tab === 'teams') setEditingTeam({ ...EMPTY_TEAM });
    else setEditingDriver({ ...EMPTY_DRIVER });
    setIsModalOpen(true);
  };

  const openEditModal = (item: TeamDTO | DriverDTO) => {
    setModalMode('edit');
    if (tab === 'teams') setEditingTeam({ ...(item as TeamDTO) });
    else setEditingDriver({ ...(item as DriverDTO) });
    setIsModalOpen(true);
  };

  const handleSaveTeam = async () => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await apiFetch<TeamDTO>('/teams', { method: 'POST', body: JSON.stringify(editingTeam) });
        showFeedback('success', `Escuderia "${editingTeam.name}" criada com sucesso!`);
      } else {
        await apiFetch<TeamDTO>(`/teams/${editingTeam.id}`, { method: 'PUT', body: JSON.stringify(editingTeam) });
        showFeedback('success', `Escuderia "${editingTeam.name}" atualizada com sucesso!`);
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao salvar escuderia');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDriver = async () => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await apiFetch<DriverDTO>('/drivers', { method: 'POST', body: JSON.stringify(editingDriver) });
        showFeedback('success', `Piloto "${editingDriver.firstName} ${editingDriver.lastName}" criado!`);
      } else {
        await apiFetch<DriverDTO>(`/drivers/${editingDriver.id}`, { method: 'PUT', body: JSON.stringify(editingDriver) });
        showFeedback('success', `Piloto "${editingDriver.firstName} ${editingDriver.lastName}" atualizado!`);
      }
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao salvar piloto');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeam = async (team: TeamDTO) => {
    if (!confirm(`Deseja remover a escuderia "${team.name}"?`)) return;
    try {
      await apiFetch(`/teams/${team.id}`, { method: 'DELETE' });
      showFeedback('success', `Escuderia "${team.name}" removida!`);
      fetchTeams();
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao remover escuderia');
    }
  };

  const handleDeleteDriver = async (driver: DriverDTO) => {
    if (!confirm(`Deseja remover o piloto "${driver.firstName} ${driver.lastName}"?`)) return;
    try {
      await apiFetch(`/drivers/${driver.id}`, { method: 'DELETE' });
      showFeedback('success', `Piloto "${driver.firstName} ${driver.lastName}" removido!`);
      fetchDrivers();
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Erro ao remover piloto');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#111] rounded-sm p-3 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Users className="w-4 h-4 text-gray-400" />
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">TEAM & DRIVER MANAGEMENT</h2>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">CRUD VIA REST API</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-[#0a0a0a] rounded-sm border border-white/10 p-0.5">
            <button
              onClick={() => setTab('teams')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-sm text-[10px] font-mono uppercase transition-all ${
                tab === 'teams' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Car className="w-3 h-3" />
              <span>TEAMS ({teams.length})</span>
            </button>
            <button
              onClick={() => setTab('drivers')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-sm text-[10px] font-mono uppercase transition-all ${
                tab === 'drivers' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>DRIVERS ({drivers.length})</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-sm bg-white hover:bg-gray-200 text-black text-[10px] font-mono font-bold transition-all uppercase"
          >
            <Plus className="w-3 h-3" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-sm text-[10px] font-mono border uppercase tracking-wider transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Teams Table */}
      {tab === 'teams' && (
        <div className="bg-[#111] rounded-sm border border-white/10 overflow-hidden">
          {loadingTeams ? (
            <div className="flex items-center justify-center py-16 text-gray-500 uppercase tracking-widest text-[10px]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="font-mono">LOADING TEAMS...</span>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3 uppercase tracking-widest text-[10px]">
              <Car className="w-8 h-8 opacity-50" />
              <span className="font-mono">NO TEAMS FOUND. CLICK "ADD NEW" TO START.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] text-gray-500 text-[10px] uppercase tracking-widest font-mono border-b border-white/10">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">TEAM NAME</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">COUNTRY</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">BASE</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">PU</th>
                    <th className="px-4 py-3 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 text-gray-600 font-mono text-[10px]">{team.id}</td>
                      <td className="px-4 py-2.5 text-white font-medium uppercase tracking-wide text-xs">{team.name}</td>
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-[10px] uppercase hidden sm:table-cell">{team.country}</td>
                      <td className="px-4 py-2.5 text-gray-500 hidden md:table-cell font-mono text-[10px] uppercase">{team.baseLocation}</td>
                      <td className="px-4 py-2.5 text-cyan-500 font-mono text-[10px] uppercase hidden lg:table-cell">{team.powerUnit}</td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => openEditModal(team)} className="p-1 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteTeam(team)} className="p-1 rounded-sm bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Drivers Table */}
      {tab === 'drivers' && (
        <div className="bg-[#111] rounded-sm border border-white/10 overflow-hidden">
          {loadingDrivers ? (
            <div className="flex items-center justify-center py-16 text-gray-500 uppercase tracking-widest text-[10px]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="font-mono">LOADING DRIVERS...</span>
            </div>
          ) : drivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3 uppercase tracking-widest text-[10px]">
              <Users className="w-8 h-8 opacity-50" />
              <span className="font-mono">NO DRIVERS FOUND. CLICK "ADD NEW" TO START.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] text-gray-500 text-[10px] uppercase tracking-widest font-mono border-b border-white/10">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">CODE</th>
                    <th className="px-4 py-3 text-left">NAME</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">NAT</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">TEAM</th>
                    <th className="px-4 py-3 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-[10px]">{driver.permanentNumber}</td>
                      <td className="px-4 py-2.5 text-cyan-500 font-bold font-mono text-[10px]">{driver.code}</td>
                      <td className="px-4 py-2.5 text-white font-medium uppercase tracking-wide text-xs">{driver.firstName} {driver.lastName}</td>
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-[10px] uppercase hidden sm:table-cell">{driver.nationality}</td>
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-[10px] uppercase hidden md:table-cell">{driver.teamName || `ID: ${driver.teamId}`}</td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => openEditModal(driver)} className="p-1 rounded-sm bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteDriver(driver)} className="p-1 rounded-sm bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-sm w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {modalMode === 'create' ? 'ADD' : 'EDIT'} {tab === 'teams' ? 'TEAM' : 'DRIVER'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {tab === 'teams' ? (
                <>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Team Name</label>
                    <input
                      type="text" value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                      placeholder="e.g. Red Bull Racing"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Country</label>
                      <input
                        type="text" value={editingTeam.country}
                        onChange={(e) => setEditingTeam({ ...editingTeam, country: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                        placeholder="e.g. Austria"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Power Unit</label>
                      <input
                        type="text" value={editingTeam.powerUnit}
                        onChange={(e) => setEditingTeam({ ...editingTeam, powerUnit: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                        placeholder="e.g. Honda RBPT"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Base</label>
                    <input
                      type="text" value={editingTeam.baseLocation}
                      onChange={(e) => setEditingTeam({ ...editingTeam, baseLocation: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                      placeholder="e.g. Milton Keynes, UK"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">First Name</label>
                      <input
                        type="text" value={editingDriver.firstName}
                        onChange={(e) => setEditingDriver({ ...editingDriver, firstName: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                        placeholder="e.g. Max"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text" value={editingDriver.lastName}
                        onChange={(e) => setEditingDriver({ ...editingDriver, lastName: e.target.value })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                        placeholder="e.g. Verstappen"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Code</label>
                      <input
                        type="text" value={editingDriver.code} maxLength={3}
                        onChange={(e) => setEditingDriver({ ...editingDriver, code: e.target.value.toUpperCase() })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono uppercase"
                        placeholder="VER"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Number</label>
                      <input
                        type="number" value={editingDriver.permanentNumber || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, permanentNumber: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Team</label>
                      <select
                        value={editingDriver.teamId || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, teamId: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-gray-300 text-xs outline-none focus:border-white/30 transition-all font-mono"
                      >
                        <option value="">SELECT...</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 font-mono mb-1.5 uppercase tracking-wider">Nationality</label>
                    <input
                      type="text" value={editingDriver.nationality}
                      onChange={(e) => setEditingDriver({ ...editingDriver, nationality: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-sm px-3 py-2 text-white text-xs outline-none focus:border-white/30 transition-all font-mono"
                      placeholder="e.g. Dutch"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-2 p-4 border-t border-white/10 bg-[#0a0a0a]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-sm bg-transparent hover:bg-white/5 text-gray-400 text-[10px] font-mono font-semibold border border-transparent hover:border-white/10 transition-all uppercase"
              >
                Cancel
              </button>
              <button
                onClick={tab === 'teams' ? handleSaveTeam : handleSaveDriver}
                disabled={saving}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-sm bg-white hover:bg-gray-200 text-black text-[10px] font-mono font-bold transition-all disabled:opacity-50 uppercase"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saving ? 'SAVING...' : 'SAVE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
