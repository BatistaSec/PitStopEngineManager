'use client';

import React from 'react';
import { TrendingUp, Flag, Trophy, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';
import LapEvolutionChart from './LapEvolutionChart';

export default function OverviewDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        <div className="bg-[#0b0d12] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400">Next Race</span>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">ROUND 15</span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">Azerbaijan GP</div>
          <div className="flex items-center space-x-1.5 text-xs">
            <Flag className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500">Baku City Circuit</span>
          </div>
        </div>

        <div className="bg-[#0b0d12] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full group-hover:bg-yellow-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400">Driver Leader</span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
              <ChevronUp className="w-3 h-3" />
              <span>+18 Pts</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">A. Antonelli</div>
          <div className="flex items-center space-x-1.5 text-xs">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-gray-500">Mercedes AMG (292 pts)</span>
          </div>
        </div>

        <div className="bg-[#0b0d12] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full group-hover:bg-red-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400">Team Leader</span>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
              <ChevronUp className="w-3 h-3" />
              <span>+145 Pts</span>
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">Mercedes AMG</div>
          <div className="flex items-center space-x-1.5 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            <span className="text-gray-500">503 Total Points</span>
          </div>
        </div>

        <div className="bg-[#0b0d12] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full group-hover:bg-cyan-500/20 transition-colors" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400">Live SSE Status</span>
            <span className="text-[10px] font-mono bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded border border-gray-500/20">OFFLINE</span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">0 msg/s</div>
          <div className="flex items-center space-x-1.5 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500">RabbitMQ connection idle</span>
          </div>
        </div>

      </div>

      {/* Main Chart Area (Mimicking Cobalt's big Income/Expenses chart) */}
      <div className="grid grid-cols-1 gap-6">
        <LapEvolutionChart />
      </div>

    </div>
  );
}
