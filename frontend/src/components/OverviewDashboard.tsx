'use client';

import React from 'react';
import { TrendingUp, Flag, Trophy, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import LapEvolutionChart from './LapEvolutionChart';

export default function OverviewDashboard() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        <div className="bg-[#111] border border-white/10 rounded-sm p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Next Race</span>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-sm border border-blue-500/20">ROUND 15</span>
          </div>
          <div className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Azerbaijan GP</div>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-gray-500">
            <Flag className="w-3 h-3 text-gray-600" />
            <span>Baku City Circuit</span>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-sm p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Driver Leader</span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-sm border border-emerald-500/20 flex items-center space-x-1">
              <ChevronUp className="w-3 h-3" />
              <span>+18 PTS</span>
            </span>
          </div>
          <div className="text-xl font-bold text-white mb-1 uppercase tracking-wide">A. Antonelli</div>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-gray-500">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span>Mercedes AMG (292 pts)</span>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-sm p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Team Leader</span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-sm border border-emerald-500/20 flex items-center space-x-1">
              <ChevronUp className="w-3 h-3" />
              <span>+145 PTS</span>
            </span>
          </div>
          <div className="text-xl font-bold text-white mb-1 uppercase tracking-wide">Mercedes AMG</div>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-gray-500">
            <ShieldCheck className="w-3 h-3 text-red-500" />
            <span>503 TOTAL POINTS</span>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-sm p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live SSE Status</span>
            <span className="text-[10px] font-mono bg-gray-500/10 text-gray-400 px-1.5 py-0.5 rounded-sm border border-gray-500/20">OFFLINE</span>
          </div>
          <div className="text-xl font-bold text-white mb-1 uppercase tracking-wide">0 MSG/S</div>
          <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase text-gray-500">
            <TrendingUp className="w-3 h-3 text-gray-600" />
            <span>RABBITMQ IDLE</span>
          </div>
        </div>

      </div>

      {/* Main Chart Area (Mimicking Technical Telemetry) */}
      <div className="grid grid-cols-1 gap-4">
        <LapEvolutionChart />
      </div>

    </div>
  );
}
