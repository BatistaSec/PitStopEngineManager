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
import { Search, Bell, User } from 'lucide-react';
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
    <div className="min-h-screen flex bg-[#050505] text-gray-100 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen transition-all">
        
        {/* Topbar (Cobalt Style) */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-[#0b0d12] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white/20 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 ml-4">
            <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            {!token ? (
              <button onClick={() => setIsAuthOpen(true)} className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsAuthOpen(true)}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 border border-red-500/30 flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/20">
                  {username?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 lg:p-8 w-full max-w-7xl mx-auto space-y-6">
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'livetiming' && <LiveTiming />}
          {activeTab === 'lapevolution' && <OverviewDashboard />} {/* Reusing the Overview for Lap Chart as it houses it beautifully */}
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
