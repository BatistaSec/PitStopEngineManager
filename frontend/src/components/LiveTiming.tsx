'use client';

import React, { useMemo } from 'react';
import { useLiveStream } from '../lib/useLiveStream';
import { Wifi, WifiOff, Clock, Flag, AlertTriangle } from 'lucide-react';

interface TimingEntry {
  position: number;
  number: string;
  code: string;
  driver: string;
  team: string;
  gap: string;
  interval: string;
  lastLap: string;
  bestLap: string;
  s1: string;
  s1Color: string;
  s2: string;
  s2Color: string;
  s3: string;
  s3Color: string;
  tyre: string;
  tyreAge: number;
  pits: number;
  status: string;
}

interface LiveTimingData {
  timestamp: number;
  currentLap: number;
  totalLaps: number;
  trackStatus: string;
  sessionTime: string;
  timing: TimingEntry[];
}

const TYRE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  SOFT: { bg: 'bg-red-600', text: 'text-red-300', label: 'S' },
  MEDIUM: { bg: 'bg-yellow-500', text: 'text-yellow-300', label: 'M' },
  HARD: { bg: 'bg-white', text: 'text-white', label: 'H' },
  INTERMEDIATE: { bg: 'bg-green-500', text: 'text-green-300', label: 'I' },
  WET: { bg: 'bg-blue-500', text: 'text-blue-300', label: 'W' },
};

const SECTOR_COLORS: Record<string, string> = {
  PURPLE: 'text-purple-400 bg-purple-500/15',
  GREEN: 'text-emerald-400 bg-emerald-500/15',
  YELLOW: 'text-yellow-300 bg-yellow-500/10',
};

const TRACK_STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  GREEN: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', icon: <Flag className="w-3 h-3" />, label: 'GREEN FLAG' },
  YELLOW: { bg: 'bg-yellow-500/15 border-yellow-500/30', text: 'text-yellow-400', icon: <AlertTriangle className="w-3 h-3" />, label: 'YELLOW FLAG' },
  VSC: { bg: 'bg-yellow-500/20 border-yellow-400/40', text: 'text-yellow-300', icon: <AlertTriangle className="w-3 h-3" />, label: 'VIRTUAL SAFETY CAR' },
  SC: { bg: 'bg-orange-500/20 border-orange-400/40', text: 'text-orange-300', icon: <AlertTriangle className="w-3 h-3" />, label: 'SAFETY CAR' },
};

const TEAM_COLORS: Record<string, string> = {
  'Red Bull Racing': 'border-l-[#3671C6]',
  'McLaren F1 Team': 'border-l-[#FF8000]',
  'Scuderia Ferrari': 'border-l-[#E8002D]',
  'Mercedes AMG': 'border-l-[#27F4D2]',
  'Aston Martin': 'border-l-[#229971]',
  'Williams': 'border-l-[#64C4FF]',
  'Alpine': 'border-l-[#FF87BC]',
  'Audi': 'border-l-[#F50537]',
  'RB F1 Team': 'border-l-[#6692FF]',
  'Haas': 'border-l-[#B6BABD]',
  'Cadillac': 'border-l-[#FFD700]',
};

interface LiveTimingProps {
  isEnabled?: boolean;
}

export default function LiveTiming({ isEnabled = true }: LiveTimingProps) {
  const { data, isConnected, error } = useLiveStream<LiveTimingData>({
    endpoint: '/livetiming/stream',
    eventName: 'livetiming',
    enabled: isEnabled,
  });

  const trackStatus = useMemo(() => {
    if (!data) return TRACK_STATUS_STYLES.GREEN;
    return TRACK_STATUS_STYLES[data.trackStatus] || TRACK_STATUS_STYLES.GREEN;
  }, [data?.trackStatus]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111] rounded-sm p-3 border border-white/10">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>LIVE TIMING TOWER</span>
          </h2>
          {data && (
            <div className={`flex items-center space-x-1.5 text-[10px] font-mono px-2 py-1 rounded-sm border uppercase ${trackStatus.bg} ${trackStatus.text}`}>
              {trackStatus.icon}
              <span>{trackStatus.label}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 text-[10px] uppercase font-mono">
          {data && (
            <>
              <span className="text-gray-500">
                LAP <span className="text-white font-bold">{data.currentLap}</span>/{data.totalLaps}
              </span>
              <span className="text-gray-700">|</span>
              <span className="text-gray-500">{data.sessionTime}</span>
            </>
          )}
          <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-sm border uppercase ${
            isConnected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isConnected ? 'SSE CONNECTED' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono px-4 py-2 rounded-sm uppercase tracking-wide">
          {error}
        </div>
      )}

      {/* Timing Table */}
      <div className="bg-[#111] rounded-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-[11px] font-mono border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] text-gray-500 uppercase tracking-widest border-b border-white/10">
                <th className="px-3 py-2 text-center w-10">P</th>
                <th className="px-2 py-2 text-center w-10">#</th>
                <th className="px-3 py-2 text-left min-w-[140px]">DRIVER</th>
                <th className="px-3 py-2 text-left hidden lg:table-cell">TEAM</th>
                <th className="px-3 py-2 text-right">GAP</th>
                <th className="px-3 py-2 text-right">INT</th>
                <th className="px-3 py-2 text-right">LAST</th>
                <th className="px-3 py-2 text-right hidden md:table-cell">BEST</th>
                <th className="px-2 py-2 text-center hidden xl:table-cell">S1</th>
                <th className="px-2 py-2 text-center hidden xl:table-cell">S2</th>
                <th className="px-2 py-2 text-center hidden xl:table-cell">S3</th>
                <th className="px-2 py-2 text-center">TYRE</th>
                <th className="px-2 py-2 text-center hidden sm:table-cell">PIT</th>
                <th className="px-2 py-2 text-center hidden sm:table-cell">STS</th>
              </tr>
            </thead>
            <tbody>
              {(data?.timing || []).map((entry, idx) => {
                const teamColor = TEAM_COLORS[entry.team] || 'border-l-gray-600';
                const tyre = TYRE_COLORS[entry.tyre] || TYRE_COLORS.MEDIUM;
                const isLeader = entry.position === 1;
                const isPodium = entry.position <= 3;

                return (
                  <tr
                    key={entry.code}
                    className={`border-b border-white/5 transition-colors hover:bg-white/5 border-l-2 ${teamColor} ${
                      isLeader ? 'bg-yellow-500/5' : ''
                    }`}
                  >
                    <td className="px-3 py-1.5 text-center">
                      <span className={`font-bold ${
                        isPodium ? 'text-yellow-500' : 'text-gray-400'
                      }`}>
                        {entry.position.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-600">{entry.number}</td>
                    <td className="px-3 py-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-cyan-500 font-bold">{entry.code}</span>
                        <span className="text-gray-400 hidden sm:inline uppercase tracking-wider">{entry.driver.split(' ').slice(-1)[0]}</span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-gray-500 hidden lg:table-cell uppercase tracking-wider text-[9px]">{entry.team}</td>
                    <td className="px-3 py-1.5 text-right">
                      <span className={isLeader ? 'text-yellow-500 font-bold' : 'text-gray-300'}>
                        {entry.gap}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right text-gray-500">{entry.interval}</td>
                    <td className="px-3 py-1.5 text-right text-white font-semibold">{entry.lastLap}</td>
                    <td className="px-3 py-1.5 text-right text-purple-400 hidden md:table-cell">{entry.bestLap}</td>
                    {['s1', 's2', 's3'].map((sector) => (
                      <td key={sector} className="px-2 py-1.5 text-center hidden xl:table-cell">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] uppercase tracking-wider ${
                          SECTOR_COLORS[entry[`${sector}Color` as keyof TimingEntry] as string] || SECTOR_COLORS.YELLOW
                        }`}>
                          {entry[sector as keyof TimingEntry]}
                        </span>
                      </td>
                    ))}
                    <td className="px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className={`w-3.5 h-3.5 rounded-sm ${tyre.bg} flex items-center justify-center text-[9px] font-bold text-black`}>
                          {tyre.label}
                        </span>
                        <span className="text-gray-500 text-[9px]">{entry.tyreAge}L</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-500 hidden sm:table-cell">{entry.pits}</td>
                    <td className="px-2 py-1.5 text-center hidden sm:table-cell">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                        entry.status === 'TRACK' ? 'bg-emerald-500/15 text-emerald-400' :
                        entry.status === 'PIT' ? 'bg-yellow-500/15 text-yellow-400' :
                        'bg-red-500/15 text-red-400'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!data || !data.timing || data.timing.length === 0) && (
                <tr>
                  <td colSpan={14} className="text-center py-16 text-gray-500 uppercase tracking-widest text-xs">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center border border-white/10">
                        <Clock className="w-5 h-5 text-gray-500 animate-pulse" />
                      </div>
                      <span className="font-bold text-gray-400">NENHUMA CORRIDA EM ANDAMENTO NO MOMENTO</span>
                      <span className="text-[10px] text-gray-600 lowercase font-mono">
                        os dados da pista e a tabela de tempos de voltas serão exibidos automaticamente assim que a transmissão iniciar
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
