'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { GitCompare, Flame, Zap, Award } from 'lucide-react';
import { useLiveStream } from '../lib/useLiveStream';

const DRIVER_OPTIONS = [
  { code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: '#3671C6' },
  { code: 'LEC', name: 'Charles Leclerc', team: 'Scuderia Ferrari', color: '#E8002D' },
  { code: 'NOR', name: 'Lando Norris', team: 'McLaren F1 Team', color: '#FF8000' },
  { code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes AMG', color: '#6CD3BF' },
];

interface ComparisonPoint {
  sector: string;
  driver1Speed: number;
  driver2Speed: number;
  driver1Brake: number;
  driver2Brake: number;
}

export default function DriverComparison() {
  const [driver1, setDriver1] = useState(DRIVER_OPTIONS[0]); // VER
  const [driver2, setDriver2] = useState(DRIVER_OPTIONS[1]); // LEC
  const [chartData, setChartData] = useState<ComparisonPoint[]>([]);

  const { data: telemetryFeed } = useLiveStream<any[]>({
    endpoint: '/telemetry/stream',
    eventName: 'telemetry',
    enabled: true,
  });

  useEffect(() => {
    if (telemetryFeed && Array.isArray(telemetryFeed)) {
      const d1Data = telemetryFeed.find((d: any) => d.driverCode === driver1.code);
      const d2Data = telemetryFeed.find((d: any) => d.driverCode === driver2.code);

      const d1Speed = d1Data ? d1Data.speed : Math.floor(Math.random() * 80) + 240;
      const d2Speed = d2Data ? d2Data.speed : Math.floor(Math.random() * 80) + 235;

      const d1Brake = d1Data ? d1Data.brakeTemp : 650;
      const d2Brake = d2Data ? d2Data.brakeTemp : 680;

      setChartData((prev) => {
        const nextTime = `P${prev.length + 1}`;
        const newPoint: ComparisonPoint = {
          sector: nextTime,
          driver1Speed: d1Speed,
          driver2Speed: d2Speed,
          driver1Brake: d1Brake,
          driver2Brake: d2Brake,
        };
        return [...prev, newPoint].slice(-15);
      });
    }
  }, [telemetryFeed, driver1, driver2]);

  return (
    <div className="bg-[#111] p-5 rounded-2xl border border-white/10 space-y-6">
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <GitCompare className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Comparador de Telemetria Piloto x Piloto</h3>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">Sobreposição de dados de aceleração e frenagem em curva</p>
          </div>
        </div>

        {/* Selector Boxes */}
        <div className="flex items-center space-x-3">
          {/* Driver 1 Select */}
          <select
            value={driver1.code}
            onChange={(e) => setDriver1(DRIVER_OPTIONS.find((d) => d.code === e.target.value) || driver1)}
            className="bg-[#1a1d29] border border-white/10 text-white font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
          >
            {DRIVER_OPTIONS.map((d) => (
              <option key={d.code} value={d.code} disabled={d.code === driver2.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-gray-500 font-mono">VS</span>

          {/* Driver 2 Select */}
          <select
            value={driver2.code}
            onChange={(e) => setDriver2(DRIVER_OPTIONS.find((d) => d.code === e.target.value) || driver2)}
            className="bg-[#1a1d29] border border-white/10 text-white font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
          >
            {DRIVER_OPTIONS.map((d) => (
              <option key={d.code} value={d.code} disabled={d.code === driver1.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Head to Head */}
        <div className="bg-[#08090d] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 uppercase">Velocidade (KM/H)</span>
            <div className="flex items-center space-x-4">
              <span className="font-bold" style={{ color: driver1.color }}>{driver1.code}</span>
              <span className="text-gray-600">vs</span>
              <span className="font-bold" style={{ color: driver2.color }}>{driver2.code}</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="sector" stroke="#555" fontSize={10} />
                <YAxis stroke="#555" fontSize={10} domain={[160, 350]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '11px' }} />
                <Line type="monotone" dataKey="driver1Speed" name={driver1.code} stroke={driver1.color} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="driver2Speed" name={driver2.code} stroke={driver2.color} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brake Temp Head to Head */}
        <div className="bg-[#08090d] p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-gray-400 uppercase">Temperatura Freios (°C)</span>
            <div className="flex items-center space-x-4">
              <span className="font-bold" style={{ color: driver1.color }}>{driver1.code}</span>
              <span className="text-gray-600">vs</span>
              <span className="font-bold" style={{ color: driver2.color }}>{driver2.code}</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="sector" stroke="#555" fontSize={10} />
                <YAxis stroke="#555" fontSize={10} domain={[400, 900]} />
                <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '11px' }} />
                <Line type="monotone" dataKey="driver1Brake" name={driver1.code} stroke={driver1.color} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="driver2Brake" name={driver2.code} stroke={driver2.color} strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
