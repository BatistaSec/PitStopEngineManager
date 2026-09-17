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
      <div className="bg-[#141722] rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-lg font-extrabold text-white">GESTÃO DE PILOTOS & EQUIPES</h2>
            <p className="text-[10px] text-gray-500 font-mono">CRUD COMPLETO VIA REST API</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-0.5">
            <button
              onClick={() => setTab('teams')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'teams' ? 'bg-[#e10600] text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Equipes ({teams.length})</span>
            </button>
            <button
              onClick={() => setTab('drivers')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === 'drivers' ? 'bg-[#e10600] text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Pilotos ({drivers.length})</span>
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-mono border transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Teams Table */}
      {tab === 'teams' && (
        <div className="bg-[#141722] rounded-2xl border border-white/10 overflow-hidden">
          {loadingTeams ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="font-mono text-sm">Carregando equipes...</span>
            </div>
          ) : teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3">
              <Car className="w-10 h-10" />
              <span className="font-mono text-sm">Nenhuma escuderia cadastrada. Clique em &quot;Adicionar&quot; para começar.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a1d2e] text-gray-400 text-xs uppercase tracking-wider font-mono">
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">País</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Base</th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell">Power Unit</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{team.id}</td>
                      <td className="px-4 py-3 text-white font-semibold">{team.name}</td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{team.country}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{team.baseLocation}</td>
                      <td className="px-4 py-3 text-cyan-400 font-mono text-xs hidden lg:table-cell">{team.powerUnit}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => openEditModal(team)} className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all" title="Editar">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteTeam(team)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all" title="Remover">
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
        <div className="bg-[#141722] rounded-2xl border border-white/10 overflow-hidden">
          {loadingDrivers ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="font-mono text-sm">Carregando pilotos...</span>
            </div>
          ) : drivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3">
              <Users className="w-10 h-10" />
              <span className="font-mono text-sm">Nenhum piloto cadastrado. Clique em &quot;Adicionar&quot; para começar.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a1d2e] text-gray-400 text-xs uppercase tracking-wider font-mono">
                    <th className="px-4 py-3 text-left">N°</th>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Nacionalidade</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Equipe</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-yellow-400 font-bold font-mono">{driver.permanentNumber}</td>
                      <td className="px-4 py-3 text-cyan-400 font-bold font-mono">{driver.code}</td>
                      <td className="px-4 py-3 text-white font-semibold">{driver.firstName} {driver.lastName}</td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{driver.nationality}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell text-xs">{driver.teamName || `ID: ${driver.teamId}`}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button onClick={() => openEditModal(driver)} className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all" title="Editar">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteDriver(driver)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all" title="Remover">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#141722] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {modalMode === 'create' ? 'Adicionar' : 'Editar'} {tab === 'teams' ? 'Escuderia' : 'Piloto'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {tab === 'teams' ? (
                <>
                  <div>
                    <label className="block text-xs text-gray-400 font-mono mb-1.5">Nome da Escuderia</label>
                    <input
                      type="text" value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                      placeholder="Ex: Red Bull Racing"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">País</label>
                      <input
                        type="text" value={editingTeam.country}
                        onChange={(e) => setEditingTeam({ ...editingTeam, country: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                        placeholder="Ex: Austria"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">Power Unit</label>
                      <input
                        type="text" value={editingTeam.powerUnit}
                        onChange={(e) => setEditingTeam({ ...editingTeam, powerUnit: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                        placeholder="Ex: Honda RBPT"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-mono mb-1.5">Base</label>
                    <input
                      type="text" value={editingTeam.baseLocation}
                      onChange={(e) => setEditingTeam({ ...editingTeam, baseLocation: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                      placeholder="Ex: Milton Keynes, UK"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">Primeiro Nome</label>
                      <input
                        type="text" value={editingDriver.firstName}
                        onChange={(e) => setEditingDriver({ ...editingDriver, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                        placeholder="Ex: Max"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">Sobrenome</label>
                      <input
                        type="text" value={editingDriver.lastName}
                        onChange={(e) => setEditingDriver({ ...editingDriver, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                        placeholder="Ex: Verstappen"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">Código</label>
                      <input
                        type="text" value={editingDriver.code} maxLength={3}
                        onChange={(e) => setEditingDriver({ ...editingDriver, code: e.target.value.toUpperCase() })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono uppercase"
                        placeholder="VER"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">Número</label>
                      <input
                        type="number" value={editingDriver.permanentNumber || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, permanentNumber: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 font-mono mb-1.5">Equipe ID</label>
                      <select
                        value={editingDriver.teamId || ''}
                        onChange={(e) => setEditingDriver({ ...editingDriver, teamId: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                      >
                        <option value="" className="bg-[#141722]">Selecionar...</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id} className="bg-[#141722]">{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 font-mono mb-1.5">Nacionalidade</label>
                    <input
                      type="text" value={editingDriver.nationality}
                      onChange={(e) => setEditingDriver({ ...editingDriver, nationality: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                      placeholder="Ex: Dutch"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-white/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-semibold border border-white/10 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={tab === 'teams' ? handleSaveTeam : handleSaveDriver}
                disabled={saving}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
