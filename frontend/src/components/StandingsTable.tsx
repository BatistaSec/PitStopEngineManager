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

const MOCK_DRIVERS: DriverStanding[] = [
  { rank: 1, driverId: 1, driverCode: 'ANT', driverName: 'Andrea Kimi Antonelli', permanentNumber: 12, teamName: 'Mercedes AMG', totalPoints: 292, wins: 8, podiums: 11 },
  { rank: 2, driverId: 2, driverCode: 'RUS', driverName: 'George Russell', permanentNumber: 63, teamName: 'Mercedes AMG', totalPoints: 211, wins: 2, podiums: 8 },
  { rank: 3, driverId: 3, driverCode: 'HAM', driverName: 'Lewis Hamilton', permanentNumber: 44, teamName: 'Scuderia Ferrari', totalPoints: 191, wins: 1, podiums: 6 },
  { rank: 4, driverId: 4, driverCode: 'NOR', driverName: 'Lando Norris', permanentNumber: 4, teamName: 'McLaren F1 Team', totalPoints: 186, wins: 2, podiums: 5 },
  { rank: 5, driverId: 5, driverCode: 'LEC', driverName: 'Charles Leclerc', permanentNumber: 16, teamName: 'Scuderia Ferrari', totalPoints: 167, wins: 1, podiums: 5 },
  { rank: 6, driverId: 6, driverCode: 'VER', driverName: 'Max Verstappen', permanentNumber: 1, teamName: 'Red Bull Racing', totalPoints: 145, wins: 0, podiums: 4 },
  { rank: 7, driverId: 7, driverCode: 'PIA', driverName: 'Oscar Piastri', permanentNumber: 81, teamName: 'McLaren F1 Team', totalPoints: 120, wins: 0, podiums: 2 },
  { rank: 8, driverId: 8, driverCode: 'HAD', driverName: 'Isack Hadjar', permanentNumber: 17, teamName: 'Red Bull Racing', totalPoints: 85, wins: 0, podiums: 1 },
  { rank: 9, driverId: 9, driverCode: 'LAW', driverName: 'Liam Lawson', permanentNumber: 30, teamName: 'RB F1 Team', totalPoints: 59, wins: 0, podiums: 0 },
  { rank: 10, driverId: 10, driverCode: 'GAS', driverName: 'Pierre Gasly', permanentNumber: 10, teamName: 'Alpine', totalPoints: 41, wins: 0, podiums: 0 },
  { rank: 11, driverId: 11, driverCode: 'DOO', driverName: 'Jack Doohan', permanentNumber: 7, teamName: 'Alpine', totalPoints: 27, wins: 0, podiums: 0 },
  { rank: 12, driverId: 12, driverCode: 'TSU', driverName: 'Yuki Tsunoda', permanentNumber: 22, teamName: 'RB F1 Team', totalPoints: 18, wins: 0, podiums: 0 },
  { rank: 13, driverId: 13, driverCode: 'HUL', driverName: 'Nico Hülkenberg', permanentNumber: 27, teamName: 'Audi', totalPoints: 15, wins: 0, podiums: 0 },
  { rank: 14, driverId: 14, driverCode: 'OCO', driverName: 'Esteban Ocon', permanentNumber: 31, teamName: 'Haas', totalPoints: 12, wins: 0, podiums: 0 },
  { rank: 15, driverId: 15, driverCode: 'BEA', driverName: 'Oliver Bearman', permanentNumber: 87, teamName: 'Haas', totalPoints: 9, wins: 0, podiums: 0 },
  { rank: 16, driverId: 16, driverCode: 'ALB', driverName: 'Alexander Albon', permanentNumber: 23, teamName: 'Williams', totalPoints: 8, wins: 0, podiums: 0 },
  { rank: 17, driverId: 17, driverCode: 'SAI', driverName: 'Carlos Sainz', permanentNumber: 55, teamName: 'Williams', totalPoints: 3, wins: 0, podiums: 0 },
  { rank: 18, driverId: 18, driverCode: 'ALO', driverName: 'Fernando Alonso', permanentNumber: 14, teamName: 'Aston Martin', totalPoints: 3, wins: 0, podiums: 0 },
  { rank: 19, driverId: 19, driverCode: 'BOR', driverName: 'Gabriel Bortoleto', permanentNumber: 5, teamName: 'Audi', totalPoints: 2, wins: 0, podiums: 0 },
  { rank: 20, driverId: 20, driverCode: 'STR', driverName: 'Lance Stroll', permanentNumber: 18, teamName: 'Aston Martin', totalPoints: 0, wins: 0, podiums: 0 },
  { rank: 21, driverId: 21, driverCode: 'HER', driverName: 'Colton Herta', permanentNumber: 26, teamName: 'Cadillac', totalPoints: 0, wins: 0, podiums: 0 },
  { rank: 22, driverId: 22, driverCode: 'OWA', driverName: 'Pato O\'Ward', permanentNumber: 28, teamName: 'Cadillac', totalPoints: 0, wins: 0, podiums: 0 },
];

const MOCK_TEAMS: TeamStanding[] = [
  { rank: 1, teamId: 1, teamName: 'Mercedes AMG', country: 'Germany', totalPoints: 503, wins: 10, podiums: 19 },
  { rank: 2, teamId: 2, teamName: 'Scuderia Ferrari', country: 'Italy', totalPoints: 358, wins: 2, podiums: 11 },
  { rank: 3, teamId: 3, teamName: 'McLaren F1 Team', country: 'United Kingdom', totalPoints: 306, wins: 2, podiums: 7 },
  { rank: 4, teamId: 4, teamName: 'Red Bull Racing', country: 'Austria', totalPoints: 230, wins: 0, podiums: 5 },
  { rank: 5, teamId: 5, teamName: 'RB F1 Team', country: 'Italy', totalPoints: 77, wins: 0, podiums: 0 },
  { rank: 6, teamId: 6, teamName: 'Alpine', country: 'France', totalPoints: 68, wins: 0, podiums: 0 },
  { rank: 7, teamId: 7, teamName: 'Haas', country: 'United States', totalPoints: 21, wins: 0, podiums: 0 },
  { rank: 8, teamId: 8, teamName: 'Audi', country: 'Germany', totalPoints: 17, wins: 0, podiums: 0 },
  { rank: 9, teamId: 9, teamName: 'Williams', country: 'United Kingdom', totalPoints: 11, wins: 0, podiums: 0 },
  { rank: 10, teamId: 10, teamName: 'Aston Martin', country: 'United Kingdom', totalPoints: 3, wins: 0, podiums: 0 },
  { rank: 11, teamId: 11, teamName: 'Cadillac', country: 'United States', totalPoints: 0, wins: 0, podiums: 0 },
];

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
  const [drivers, setDrivers] = useState<DriverStanding[]>(MOCK_DRIVERS);
  const [teams, setTeams] = useState<TeamStanding[]>(MOCK_TEAMS);
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
