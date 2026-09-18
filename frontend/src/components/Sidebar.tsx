'use client';

import React from 'react';
import { LayoutDashboard, Clock, TrendingUp, Activity, Wrench, Trophy, Calendar, Settings, LogOut, ChevronRight, ActivitySquare } from 'lucide-react';
import { DashboardTab } from './PitWallDashboard';
import { getAuthToken, logout } from '../lib/api';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Insights', icon: LayoutDashboard },
  { id: 'livetiming', label: 'Live Timing', icon: Clock },
  { id: 'lapevolution', label: 'Lap Chart', icon: TrendingUp },
  { id: 'pitwall', label: 'Telemetry', icon: Activity },
  { id: 'standings', label: 'Classifications', icon: Trophy },
  { id: 'races', label: 'Calendar', icon: Calendar },
  { id: 'management', label: 'Team Mgmt', icon: Wrench },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const token = getAuthToken();
  const username = typeof window !== 'undefined' ? localStorage.getItem('pitstop_username') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('pitstop_role') : null;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-[#050505] border-r border-white/5 hidden md:flex flex-col h-screen fixed left-0 top-0">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <ActivitySquare className="w-6 h-6 text-red-500" />
          <span className="text-lg font-extrabold tracking-tight text-white">PitStopEngine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-xs font-mono text-gray-500 mb-4 px-2 uppercase tracking-wider">Main Menu</div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-white/10 text-white shadow-sm border border-white/5' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-gray-500" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions & User Profile */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group border border-transparent">
          <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          <span className="text-sm font-semibold">Settings</span>
        </button>

        {token ? (
          <div className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-white/5 border border-white/5 mt-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-red-900 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-white">{username}</span>
                <span className="block text-[10px] text-gray-500 font-mono">{role === 'ROLE_ADMIN' ? 'Admin' : 'User'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
