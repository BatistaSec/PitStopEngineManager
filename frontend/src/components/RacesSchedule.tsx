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

const MOCK_RACES: Race[] = [
  { id: 1, season: 2026, round: 1, name: 'GP do Bahrein', date: '2026-03-02', circuitName: 'Bahrain International Circuit', completed: true },
  { id: 2, season: 2026, round: 2, name: 'GP da Arábia Saudita', date: '2026-03-09', circuitName: 'Jeddah Corniche Circuit', completed: true },
  { id: 3, season: 2026, round: 3, name: 'GP da Austrália', date: '2026-03-23', circuitName: 'Albert Park Circuit', completed: true },
  { id: 4, season: 2026, round: 4, name: 'GP do Japão', date: '2026-04-06', circuitName: 'Suzuka International Racing Course', completed: true },
  { id: 5, season: 2026, round: 5, name: 'GP de Mônaco', date: '2026-05-25', circuitName: 'Circuit de Monaco', completed: true },
  { id: 6, season: 2026, round: 6, name: 'GP de Silverstone (Reino Unido)', date: '2026-07-06', circuitName: 'Silverstone Circuit', completed: true },
  { id: 7, season: 2026, round: 7, name: 'GP de Spa-Francorchamps (Bélgica)', date: '2026-07-27', circuitName: 'Circuit de Spa-Francorchamps', completed: false },
  { id: 8, season: 2026, round: 8, name: 'GP de Monza (Itália)', date: '2026-09-07', circuitName: 'Autodromo Nazionale Monza', completed: false },
  { id: 9, season: 2026, round: 9, name: 'GP de São Paulo (Brasil)', date: '2026-11-08', circuitName: 'Autódromo José Carlos Pace (Interlagos)', completed: false },
  { id: 10, season: 2026, round: 10, name: 'GP de Abu Dhabi', date: '2026-11-29', circuitName: 'Yas Marina Circuit', completed: false },
];

export default function RacesSchedule() {
  const [races, setRaces] = useState<Race[]>(MOCK_RACES);

  useEffect(() => {
    async function loadRaces() {
      try {
        const data = await apiFetch<Race[]>('/races?season=2026');
        if (data && data.length > 0) {
          setRaces(data);
        }
      } catch {
        // Fallback to MOCK_RACES
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
