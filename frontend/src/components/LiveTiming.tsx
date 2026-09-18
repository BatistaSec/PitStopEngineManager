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
  GREEN: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', icon: <Flag className="w-3.5 h-3.5" />, label: 'GREEN FLAG' },
  YELLOW: { bg: 'bg-yellow-500/15 border-yellow-500/30', text: 'text-yellow-400', icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'YELLOW FLAG' },
  VSC: { bg: 'bg-yellow-500/20 border-yellow-400/40', text: 'text-yellow-300', icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'VIRTUAL SAFETY CAR' },
  SC: { bg: 'bg-orange-500/20 border-orange-400/40', text: 'text-orange-300', icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'SAFETY CAR' },
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

export default function LiveTiming() {
  const { data, isConnected, error } = useLiveStream<LiveTimingData>({
    endpoint: '/livetiming/stream',
    eventName: 'livetiming',
    enabled: true,
  });

  const trackStatus = useMemo(() => {
    if (!data) return TRACK_STATUS_STYLES.GREEN;
    return TRACK_STATUS_STYLES[data.trackStatus] || TRACK_STATUS_STYLES.GREEN;
  }, [data?.trackStatus]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#141722] rounded-2xl p-4 border border-white/10">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span>LIVE TIMING</span>
          </h2>
          {data && (
            <div className={`flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-xl border ${trackStatus.bg} ${trackStatus.text}`}>
              {trackStatus.icon}
              <span>{trackStatus.label}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          {data && (
            <>
              <span className="text-gray-400">
                LAP <span className="text-white font-bold">{data.currentLap}</span>/{data.totalLaps}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400">{data.sessionTime}</span>
            </>
          )}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border ${
            isConnected
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isConnected ? 'SSE LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono px-4 py-2 rounded-xl">
          {error}
        </div>
      )}

      {/* Timing Table */}
      <div className="bg-[#141722] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-[#1a1d2e] text-gray-400 uppercase tracking-wider">
                <th className="px-3 py-3 text-left w-10">POS</th>
                <th className="px-2 py-3 text-left w-10">N°</th>
                <th className="px-3 py-3 text-left min-w-[140px]">DRIVER</th>
                <th className="px-3 py-3 text-left hidden lg:table-cell">TEAM</th>
                <th className="px-3 py-3 text-right">GAP</th>
                <th className="px-3 py-3 text-right">INT</th>
                <th className="px-3 py-3 text-right">LAST LAP</th>
                <th className="px-3 py-3 text-right hidden md:table-cell">BEST</th>
                <th className="px-2 py-3 text-center hidden xl:table-cell">S1</th>
                <th className="px-2 py-3 text-center hidden xl:table-cell">S2</th>
                <th className="px-2 py-3 text-center hidden xl:table-cell">S3</th>
                <th className="px-2 py-3 text-center">TYRE</th>
                <th className="px-2 py-3 text-center hidden sm:table-cell">PITS</th>
                <th className="px-2 py-3 text-center hidden sm:table-cell">STS</th>
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
                    <td className="px-3 py-2.5">
                      <span className={`font-bold text-sm ${
                        isPodium ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        P{entry.position}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-gray-500">{entry.number}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-cyan-400 font-bold">{entry.code}</span>
                        <span className="text-gray-300 hidden sm:inline">{entry.driver.split(' ').slice(-1)[0]}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 hidden lg:table-cell text-[11px]">{entry.team}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={isLeader ? 'text-yellow-400 font-bold' : 'text-red-400'}>
                        {entry.gap}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-gray-400">{entry.interval}</td>
                    <td className="px-3 py-2.5 text-right text-white font-semibold">{entry.lastLap}</td>
                    <td className="px-3 py-2.5 text-right text-purple-400 hidden md:table-cell">{entry.bestLap}</td>
                    {['s1', 's2', 's3'].map((sector) => (
                      <td key={sector} className="px-2 py-2.5 text-center hidden xl:table-cell">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          SECTOR_COLORS[entry[`${sector}Color` as keyof TimingEntry] as string] || SECTOR_COLORS.YELLOW
                        }`}>
                          {entry[sector as keyof TimingEntry]}
                        </span>
                      </td>
                    ))}
                    <td className="px-2 py-2.5 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className={`w-4 h-4 rounded-full ${tyre.bg} flex items-center justify-center text-[9px] font-bold text-black`}>
                          {tyre.label}
                        </span>
                        <span className="text-gray-500 text-[10px]">{entry.tyreAge}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-400 hidden sm:table-cell">{entry.pits}</td>
                    <td className="px-2 py-2.5 text-center hidden sm:table-cell">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
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
              {(!data || data.timing.length === 0) && (
                <tr>
                  <td colSpan={14} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Clock className="w-8 h-8 animate-pulse" />
                      <span>Aguardando dados do Live Timing via SSE...</span>
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
