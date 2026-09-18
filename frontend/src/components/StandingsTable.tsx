'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Award, Shield, RefreshCw } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface DriverStanding {
  rank: number;
  driverId: number;
  driverCode: string;
  driverName: string;
  permanentNumber: number;
  teamName: string;
  totalPoints: number;
  wins: number;
  podiums: number;
}

interface TeamStanding {
  rank: number;
  teamId: number;
  teamName: string;
  country: string;
  totalPoints: number;
  wins: number;
  podiums: number;
}



const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': 'border-l-[#3671C6]',
  'McLaren F1 Team': 'border-l-[#FF8000]',
  'Scuderia Ferrari': 'border-l-[#E8002D]',
  'Mercedes AMG': 'border-l-[#27F4D2]',
  'Aston Martin': 'border-l-[#229971]',
  'Williams': 'border-l-[#64C4FF]',
  'Alpine': 'border-l-[#FF87BC]',
  'Audi': 'border-l-[#F50537]', // Audi Red
  'RB F1 Team': 'border-l-[#6692FF]',
  'Haas': 'border-l-[#B6BABD]',
  'Cadillac': 'border-l-[#FFD700]', // Cadillac Gold
};

export default function StandingsTable() {
  const [view, setView] = useState<'drivers' | 'teams'>('drivers');
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [teams, setTeams] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const fetchStandings = async () => {
    setLoading(true);
    try {
      if (view === 'drivers') {
        const data = await apiFetch<DriverStanding[]>('/standings/drivers?season=2026');
        if (data && data.length > 0) {
          setDrivers(data);
          setIsLiveApi(true);
        }
      } else {
        const data = await apiFetch<TeamStanding[]>('/standings/teams?season=2026');
        if (data && data.length > 0) {
          setTeams(data);
          setIsLiveApi(true);
        }
      }
    } catch {
      setIsLiveApi(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [view]);

  return (
    <div className="space-y-6">
      {/* Sub Header & Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141722] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h2 className="text-base font-bold text-white">Classificação Oficial F1 2026</h2>
          {isLiveApi && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              CONECTADO À API REST
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 bg-black/30 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setView('drivers')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'drivers' ? 'bg-[#e10600] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Pilotos</span>
          </button>
          <button
            onClick={() => setView('teams')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              view === 'teams' ? 'bg-[#e10600] text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Construtores</span>
          </button>
          <button
            onClick={fetchStandings}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            title="Atualizar"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-[#141722] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {view === 'drivers' ? (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1c202e] text-xs font-mono uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-5 py-4 w-12">Pos</th>
                  <th className="px-5 py-4">Piloto</th>
                  <th className="px-5 py-4">Nº</th>
                  <th className="px-5 py-4">Escuderia</th>
                  <th className="px-5 py-4 text-center">Vitórias</th>
                  <th className="px-5 py-4 text-center">Pódios</th>
                  <th className="px-5 py-4 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drivers.map((driver) => {
                  const tColor = TEAM_COLORS[driver.teamName] || 'border-l-gray-600';
                  return (
                    <tr key={driver.driverId} className={`hover:bg-white/5 transition-colors border-l-2 ${tColor}`}>
                      <td className="px-5 py-4 font-mono font-bold">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold ${
                          driver.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          driver.rank === 2 ? 'bg-gray-300/20 text-gray-200 border border-gray-300/30' :
                          driver.rank === 3 ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-gray-400'
                        }`}>
                          {driver.rank}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-white flex items-center space-x-2">
                        <span className="font-mono text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{driver.driverCode}</span>
                        <span>{driver.driverName}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-red-400 font-bold">#{driver.permanentNumber}</td>
                      <td className="px-5 py-4 text-gray-300">{driver.teamName}</td>
                      <td className="px-5 py-4 text-center font-mono">{driver.wins}</td>
                      <td className="px-5 py-4 text-center font-mono">{driver.podiums}</td>
                      <td className="px-5 py-4 text-right font-mono font-extrabold text-white text-base">
                        {driver.totalPoints} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1c202e] text-xs font-mono uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-5 py-4 w-12">Pos</th>
                  <th className="px-5 py-4">Escuderia</th>
                  <th className="px-5 py-4">País</th>
                  <th className="px-5 py-4 text-center">Vitórias</th>
                  <th className="px-5 py-4 text-center">Pódios</th>
                  <th className="px-5 py-4 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams.map((team) => {
                  const tColor = TEAM_COLORS[team.teamName] || 'border-l-gray-600';
                  return (
                    <tr key={team.teamId} className={`hover:bg-white/5 transition-colors border-l-2 ${tColor}`}>
                      <td className="px-5 py-4 font-mono font-bold">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-extrabold ${
                          team.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          team.rank === 2 ? 'bg-gray-300/20 text-gray-200 border border-gray-300/30' :
                          team.rank === 3 ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30' : 'text-gray-400'
                        }`}>
                          {team.rank}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-white">{team.teamName}</td>
                      <td className="px-5 py-4 text-gray-400 font-mono text-xs">{team.country}</td>
                      <td className="px-5 py-4 text-center font-mono">{team.wins}</td>
                      <td className="px-5 py-4 text-center font-mono">{team.podiums}</td>
                      <td className="px-5 py-4 text-right font-mono font-extrabold text-white text-base">
                        {team.totalPoints} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
