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
    <div className="space-y-4">
      {/* Sub Header & Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111] p-3 rounded-sm border border-white/10">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">FIA Official Standings 2026</h2>
          {isLiveApi && (
            <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded-sm border border-green-500/20">
              API CONNECTED
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-[#0a0a0a] border border-white/10 rounded-sm p-0.5">
            <button
              onClick={() => setView('drivers')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-sm text-[10px] font-mono uppercase transition-all ${
                view === 'drivers' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Drivers</span>
            </button>
            <button
              onClick={() => setView('teams')}
              className={`flex items-center space-x-2 px-3 py-1 rounded-sm text-[10px] font-mono uppercase transition-all ${
                view === 'teams' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Constructors</span>
            </button>
          </div>
          <button
            onClick={fetchStandings}
            className="p-1 text-gray-500 hover:text-white transition-colors border border-white/10 rounded-sm bg-[#0a0a0a]"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-[#111] rounded-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          {view === 'drivers' ? (
            <table className="w-full text-left text-sm text-gray-300 border-collapse">
              <thead className="bg-[#1a1a1a] text-[10px] font-mono uppercase text-gray-500 border-b border-white/10 tracking-widest">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">Pos</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Num</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3 text-center">Wins</th>
                  <th className="px-4 py-3 text-center">Podiums</th>
                  <th className="px-4 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {drivers.map((driver) => {
                  const tColor = TEAM_COLORS[driver.teamName] || 'border-l-gray-600';
                  return (
                    <tr key={driver.driverId} className={`hover:bg-white/5 transition-colors border-l-2 ${tColor}`}>
                      <td className="px-4 py-2 text-center font-mono text-xs">
                        {driver.rank === 1 ? <span className="text-yellow-500 font-bold">01</span> :
                         driver.rank === 2 ? <span className="text-gray-300 font-bold">02</span> :
                         driver.rank === 3 ? <span className="text-amber-600 font-bold">03</span> : 
                         <span className="text-gray-500">{driver.rank.toString().padStart(2, '0')}</span>}
                      </td>
                      <td className="px-4 py-2 font-medium text-white flex items-center space-x-3">
                        <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded-sm text-gray-400">{driver.driverCode}</span>
                        <span className="text-xs uppercase tracking-wide">{driver.driverName}</span>
                      </td>
                      <td className="px-4 py-2 font-mono text-[10px] text-gray-500">#{driver.permanentNumber}</td>
                      <td className="px-4 py-2 text-gray-400 text-xs uppercase tracking-wide">{driver.teamName}</td>
                      <td className="px-4 py-2 text-center font-mono text-xs text-gray-500">{driver.wins}</td>
                      <td className="px-4 py-2 text-center font-mono text-xs text-gray-500">{driver.podiums}</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-white text-sm">
                        {driver.totalPoints.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm text-gray-300 border-collapse">
              <thead className="bg-[#1a1a1a] text-[10px] font-mono uppercase text-gray-500 border-b border-white/10 tracking-widest">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">Pos</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Base</th>
                  <th className="px-4 py-3 text-center">Wins</th>
                  <th className="px-4 py-3 text-center">Podiums</th>
                  <th className="px-4 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams.map((team) => {
                  const tColor = TEAM_COLORS[team.teamName] || 'border-l-gray-600';
                  return (
                    <tr key={team.teamId} className={`hover:bg-white/5 transition-colors border-l-2 ${tColor}`}>
                      <td className="px-4 py-2 text-center font-mono text-xs">
                        {team.rank === 1 ? <span className="text-yellow-500 font-bold">01</span> :
                         team.rank === 2 ? <span className="text-gray-300 font-bold">02</span> :
                         team.rank === 3 ? <span className="text-amber-600 font-bold">03</span> : 
                         <span className="text-gray-500">{team.rank.toString().padStart(2, '0')}</span>}
                      </td>
                      <td className="px-4 py-2 font-medium text-white text-xs uppercase tracking-wide">{team.teamName}</td>
                      <td className="px-4 py-2 text-gray-500 font-mono text-[10px] uppercase tracking-wide">{team.country}</td>
                      <td className="px-4 py-2 text-center font-mono text-xs text-gray-500">{team.wins}</td>
                      <td className="px-4 py-2 text-center font-mono text-xs text-gray-500">{team.podiums}</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-white text-sm">
                        {team.totalPoints.toFixed(1)}
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
