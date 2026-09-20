'use client';

import React from 'react';
import { LayoutDashboard, Clock, TrendingUp, Activity, Wrench, Trophy, Calendar, Settings, LogOut, ChevronRight, ActivitySquare, X } from 'lucide-react';
import { DashboardTab } from './PitWallDashboard';
import { getAuthToken, logout } from '../lib/api';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'INSIGHTS', icon: LayoutDashboard },
  { id: 'livetiming', label: 'LIVE TIMING', icon: Clock },
  { id: 'lapevolution', label: 'LAP CHART', icon: TrendingUp },
  { id: 'pitwall', label: 'TELEMETRY', icon: Activity },
  { id: 'paddock', label: 'PADDOCK MARKET', icon: ActivitySquare },
  { id: 'standings', label: 'CLASSIFICATIONS', icon: Trophy },
  { id: 'races', label: 'CALENDAR', icon: Calendar },
  { id: 'management', label: 'TEAM MGMT', icon: Wrench },
];

export default function Sidebar({ activeTab, setActiveTab, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const token = getAuthToken();
  const username = typeof window !== 'undefined' ? localStorage.getItem('pitstop_username') : null;
  const role = typeof window !== 'undefined' ? localStorage.getItem('pitstop_role') : null;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleTabClick = (tabId: DashboardTab) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Logo Area */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <ActivitySquare className="w-5 h-5 text-green-500" />
          <span className="text-sm font-semibold tracking-tight text-white uppercase font-mono">PitStopEngine</span>
        </div>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-[10px] font-mono text-gray-600 mb-4 px-2 uppercase tracking-widest">Workspace Menu</div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as DashboardTab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-sm transition-all group ${
                isActive 
                  ? 'bg-white/10 text-white border-l-2 border-l-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="text-xs font-mono">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions & User Profile */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all group border-l-2 border-l-transparent">
          <Settings className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
          <span className="text-xs font-mono">SETTINGS</span>
        </button>

        {token ? (
          <div className="w-full flex items-center justify-between px-3 py-3 rounded-sm bg-[#111] border border-white/10 mt-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-sm bg-gray-800 flex items-center justify-center text-white text-xs font-mono font-bold">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-mono font-bold text-white uppercase">{username}</span>
                <span className="block text-[9px] text-gray-500 font-mono uppercase">{role === 'ROLE_ADMIN' ? 'Admin' : 'User'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors p-1" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="w-64 border-r border-white/5 hidden md:flex flex-col h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="relative w-72 max-w-[80vw] border-r border-white/10 z-10 h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
