'use client';

import React from 'react';
import { Flag, Activity, Trophy, Calendar, Lock, User, LogOut, Clock, TrendingUp, Users, Wrench } from 'lucide-react';
import { getAuthToken, logout } from '../lib/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

const TABS = [
  { id: 'livetiming', label: 'Live Timing', icon: Clock },
  { id: 'lapevolution', label: 'Lap Chart', icon: TrendingUp },
  { id: 'pitwall', label: 'Telemetria', icon: Activity },
  { id: 'management', label: 'Gestão', icon: Wrench },
  { id: 'standings', label: 'Classificação', icon: Trophy },
  { id: 'races', label: 'Corridas', icon: Calendar },
];

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }: NavbarProps) {
  const token = getAuthToken();
  const username = typeof window !== 'undefined' ? localStorage.getItem('pitstop_username') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('pitstop_role') : null;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <header className="bg-[#12151e]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo & Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('livetiming')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e10600] to-red-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-gray-200 to-red-500 bg-clip-text text-transparent">
                PITSTOP<span className="text-[#e10600]">ENGINE</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-mono tracking-widest uppercase">F1 Telemetry & Control</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">PIT WALL LIVE</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === id
                  ? 'bg-[#e10600] text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* User Auth Action */}
        <div className="flex items-center space-x-3">
          {token ? (
            <div className="flex items-center space-x-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-xs font-semibold text-white">{username}</span>
                <span className="block text-[9px] text-red-400 font-mono">{role || 'USER'}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Sair"
                className="text-gray-400 hover:text-red-400 p-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Entrar / Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
