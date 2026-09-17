'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PitWallTelemetry from '../components/PitWallTelemetry';
import StandingsTable from '../components/StandingsTable';
import RacesSchedule from '../components/RacesSchedule';
import AuthModal from '../components/AuthModal';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('pitwall');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d12]">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner Quick Info */}
        <div className="bg-gradient-to-r from-red-950/40 via-[#141722] to-blue-950/40 p-4 sm:p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center justify-center md:justify-start space-x-2">
              <span>Pit Wall Monitor & Control Center</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-mono">
              Monitoramento de Telemetria de Alta Frequência • Gestão F1 • Eventos RabbitMQ • JWT Auth
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
              <Cpu className="w-4 h-4" />
              <span>SPRING BOOT CORE</span>
            </div>
            <div className="flex items-center space-x-1.5 text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
              <Activity className="w-4 h-4" />
              <span>RABBITMQ ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'pitwall' && <PitWallTelemetry />}
        {activeTab === 'standings' && <StandingsTable />}
        {activeTab === 'races' && <RacesSchedule />}
      </main>

      {/* Auth & Admin Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0d0f17] py-6 px-4 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PitStopEngine © 2026 — Plataforma Distribuída de Telemetria & Gestão F1</span>
          <span className="flex items-center space-x-1 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Desenvolvido por BatistaSec</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
