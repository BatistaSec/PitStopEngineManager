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
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#111] p-3 rounded-sm border border-white/10">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">FIA Official Race Calendar 2026</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {races.map((race) => (
          <div
            key={race.id}
            className={`p-4 rounded-sm border transition-all ${
              race.completed
                ? 'bg-[#111] border-white/10 hover:border-white/20'
                : 'bg-[#1a1a1a] border-red-500/30 hover:border-red-500/60 shadow-lg shadow-red-900/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-sm border border-red-500/20">
                ROUND {race.round.toString().padStart(2, '0')}
              </span>
              {race.completed ? (
                <span className="flex items-center space-x-1 text-[10px] font-mono text-green-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>COMPLETED</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[10px] font-mono text-yellow-400">
                  <Clock className="w-3 h-3" />
                  <span>UPCOMING</span>
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wide">{race.name}</h3>

            <div className="flex items-center space-x-1.5 text-xs text-gray-400 mb-3 font-mono">
              <MapPin className="w-3 h-3 text-gray-500" />
              <span>{race.circuitName || 'Official Circuit'}</span>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-wider">
              <span>Date:</span>
              <span className="text-white font-bold">{race.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
