'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import AuthModal from './AuthModal';
import LiveTiming from './LiveTiming';
import StandingsTable from './StandingsTable';
import RacesSchedule from './RacesSchedule';
import TeamsDriversManager from './TeamsDriversManager';
import OverviewDashboard from './OverviewDashboard';
import { Search, Bell, MonitorPlay } from 'lucide-react';
import { getAuthToken } from '../lib/api';

// Lazy-load heavy chart components to improve initial load
const PitWallTelemetry = dynamic(() => import('./PitWallTelemetry'), { ssr: false });

export type DashboardTab = 'overview' | 'livetiming' | 'lapevolution' | 'pitwall' | 'management' | 'standings' | 'races';

export default function PitWallDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const token = getAuthToken();
  const username = typeof window !== 'undefined' ? localStorage.getItem('pitstop_username') : null;

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-gray-300 font-sans selection:bg-gray-800 selection:text-white">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen bg-[#0a0a0a]">
        
        {/* Topbar (Technical Style) */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-40">
          <div className="flex-1 max-w-lg flex items-center space-x-4">
            <MonitorPlay className="w-4 h-4 text-green-500 animate-pulse" />
            <div className="relative group w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Query telemetry, drivers or events..." 
                className="w-full bg-[#111] border border-white/10 rounded-sm py-1.5 pl-8 pr-3 text-xs font-mono focus:outline-none focus:border-white/30 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-4">
            <button className="w-8 h-8 rounded-sm bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell className="w-3.5 h-3.5" />
            </button>
            {!token ? (
              <button onClick={() => setIsAuthOpen(true)} className="flex items-center space-x-2 bg-white text-black px-4 py-1.5 rounded-sm text-xs font-mono font-bold hover:bg-gray-200 transition-colors">
                <span>AUTHENTICATE</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-sm border border-transparent hover:border-white/10 transition-colors" onClick={() => setIsAuthOpen(true)}>
                <div className="w-6 h-6 rounded-sm bg-[#111] border border-white/10 flex items-center justify-center text-white text-xs font-mono font-bold">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-mono text-gray-400 uppercase">{username}</span>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 w-full mx-auto space-y-6">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'livetiming' && <LiveTiming />}
          {activeTab === 'lapevolution' && <OverviewDashboard />}
          {activeTab === 'pitwall' && <PitWallTelemetry />}
          {activeTab === 'management' && <TeamsDriversManager />}
          {activeTab === 'standings' && <StandingsTable />}
          {activeTab === 'races' && <RacesSchedule />}
        </main>
        
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
