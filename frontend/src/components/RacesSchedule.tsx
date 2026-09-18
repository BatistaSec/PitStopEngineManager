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
  { id: 1, season: 2026, round: 1, name: 'Australian GP', date: '2026-03-08', circuitName: 'Albert Park', completed: true },
  { id: 2, season: 2026, round: 2, name: 'Chinese GP', date: '2026-03-15', circuitName: 'Shanghai', completed: true },
  { id: 3, season: 2026, round: 3, name: 'Japanese GP', date: '2026-03-29', circuitName: 'Suzuka', completed: true },
  { id: 4, season: 2026, round: 4, name: 'Miami GP', date: '2026-05-03', circuitName: 'Miami', completed: true },
  { id: 5, season: 2026, round: 5, name: 'Canadian GP', date: '2026-05-24', circuitName: 'Montreal', completed: true },
  { id: 6, season: 2026, round: 6, name: 'Monaco GP', date: '2026-06-07', circuitName: 'Monte Carlo', completed: true },
  { id: 7, season: 2026, round: 7, name: 'Spanish GP', date: '2026-06-14', circuitName: 'Barcelona', completed: true },
  { id: 8, season: 2026, round: 8, name: 'Austrian GP', date: '2026-06-28', circuitName: 'Red Bull Ring', completed: true },
  { id: 9, season: 2026, round: 9, name: 'British GP', date: '2026-07-05', circuitName: 'Silverstone', completed: true },
  { id: 10, season: 2026, round: 10, name: 'Belgian GP', date: '2026-07-19', circuitName: 'Spa-Francorchamps', completed: true },
  { id: 11, season: 2026, round: 11, name: 'Hungarian GP', date: '2026-07-26', circuitName: 'Hungaroring', completed: true },
  { id: 12, season: 2026, round: 12, name: 'Dutch GP', date: '2026-08-23', circuitName: 'Zandvoort', completed: true },
  { id: 13, season: 2026, round: 13, name: 'Italian GP', date: '2026-09-06', circuitName: 'Monza', completed: true },
  { id: 14, season: 2026, round: 14, name: 'Spanish GP (Madrid)', date: '2026-09-13', circuitName: 'Madrid', completed: true },
  { id: 15, season: 2026, round: 15, name: 'Azerbaijan GP', date: '2026-09-26', circuitName: 'Baku', completed: false },
  { id: 16, season: 2026, round: 16, name: 'Malaysia GP', date: '2026-10-04', circuitName: 'Sepang', completed: false },
  { id: 17, season: 2026, round: 17, name: 'Singapore GP', date: '2026-10-11', circuitName: 'Marina Bay', completed: false },
  { id: 18, season: 2026, round: 18, name: 'United States GP', date: '2026-10-25', circuitName: 'COTA', completed: false },
  { id: 19, season: 2026, round: 19, name: 'Mexico City GP', date: '2026-11-01', circuitName: 'Hermanos Rodríguez', completed: false },
  { id: 20, season: 2026, round: 20, name: 'Brazilian GP', date: '2026-11-08', circuitName: 'Interlagos', completed: false },
  { id: 21, season: 2026, round: 21, name: 'Las Vegas GP', date: '2026-11-22', circuitName: 'Las Vegas Strip', completed: false },
  { id: 22, season: 2026, round: 22, name: 'Qatar GP', date: '2026-11-29', circuitName: 'Losail', completed: false },
  { id: 23, season: 2026, round: 23, name: 'Abu Dhabi GP', date: '2026-12-06', circuitName: 'Yas Marina', completed: false },
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
