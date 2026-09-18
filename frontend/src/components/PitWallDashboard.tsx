'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import LiveTiming from './LiveTiming';
import StandingsTable from './StandingsTable';
import RacesSchedule from './RacesSchedule';
import TeamsDriversManager from './TeamsDriversManager';
import { Activity, Cpu } from 'lucide-react';

// Lazy-load heavy chart components to improve initial load
const PitWallTelemetry = dynamic(() => import('./PitWallTelemetry'), { ssr: false });
const LapEvolutionChart = dynamic(() => import('./LapEvolutionChart'), { ssr: false });

export type DashboardTab = 'livetiming' | 'lapevolution' | 'pitwall' | 'management' | 'standings' | 'races';

export default function PitWallDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('livetiming');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d12]">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as DashboardTab)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner Quick Info */}
        <div className="bg-gradient-to-r from-red-950/40 via-[#141722] to-blue-950/40 p-4 sm:p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center justify-center md:justify-start space-x-2">
              <span>Pit Wall Monitor & Control Center</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-mono">
              Live Timing SSE • Telemetria de Alta Frequência • Gestão F1 • Eventos RabbitMQ • JWT Auth
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
              <Cpu className="w-4 h-4" />
              <span>SPRING BOOT CORE</span>
            </div>
            <div className="flex items-center space-x-1.5 text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
              <Activity className="w-4 h-4" />
              <span>SSE STREAM</span>
            </div>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'livetiming' && <LiveTiming />}
        {activeTab === 'lapevolution' && <LapEvolutionChart />}
        {activeTab === 'pitwall' && <PitWallTelemetry />}
        {activeTab === 'management' && <TeamsDriversManager />}
        {activeTab === 'standings' && <StandingsTable />}
        {activeTab === 'races' && <RacesSchedule />}
      </main>

      {/* Auth & Admin Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0d0f17] py-6 px-4 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PitStopEngine © 2026 — Plataforma Distribuída de Telemetria & Gestão F1</span>
          <span className="text-gray-400">Desenvolvido por BatistaSec</span>
        </div>
      </footer>
    </div>
  );
}
