'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { apiFetch } from '../lib/api';

interface Race {
  id: number;
  season: number;
  round: number;
  name: string;
  date: string;
  circuitName: string;
  completed: boolean;
}



export default function RacesSchedule() {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    async function loadRaces() {
      try {
        const data = await apiFetch<Race[]>('/races?season=2026');
        if (data && data.length > 0) {
          setRaces(data);
        }
      } catch {
        // Empty catch block
      }
    }
    loadRaces();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#141722] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-bold text-white">Calendário Oficial de Corridas F1 2026</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => (
          <div
            key={race.id}
            className={`p-5 rounded-2xl border transition-all ${
              race.completed
                ? 'bg-[#141722]/80 border-white/10 hover:border-white/20'
                : 'bg-gradient-to-br from-[#181c2b] to-[#141722] border-red-500/30 hover:border-red-500/60 shadow-lg shadow-red-600/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                ROUND {race.round}
              </span>
              {race.completed ? (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CONCLUÍDO</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[11px] font-mono text-yellow-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>EM BREVE</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-extrabold text-white mb-1">{race.name}</h3>

            <div className="flex items-center space-x-1.5 text-xs text-gray-400 mb-3">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{race.circuitName || 'Circuito Oficial'}</span>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Data:</span>
              <span className="text-white font-bold">{race.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
