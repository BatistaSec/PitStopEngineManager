'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';

// Simulated lap time data for the 2026 grid
const DRIVER_CONFIGS = [
  { code: 'VER', name: 'Max Verstappen', team: 'Red Bull Racing', color: '#3b82f6', basePace: 81.2 },
  { code: 'NOR', name: 'Lando Norris', team: 'McLaren', color: '#f97316', basePace: 81.4 },
  { code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', color: '#dc2626', basePace: 81.5 },
  { code: 'HAM', name: 'Lewis Hamilton', team: 'Ferrari', color: '#f59e0b', basePace: 81.7 },
  { code: 'RUS', name: 'George Russell', team: 'Mercedes', color: '#2dd4bf', basePace: 81.8 },
  { code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', color: '#fb923c', basePace: 81.6 },
  { code: 'ALO', name: 'Fernando Alonso', team: 'Aston Martin', color: '#22c55e', basePace: 82.1 },
  { code: 'SAI', name: 'Carlos Sainz', team: 'Williams', color: '#60a5fa', basePace: 82.0 },
];

function generateLapData(totalLaps: number) {
  const data = [];
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  for (let lap = 1; lap <= totalLaps; lap++) {
    const entry: Record<string, number> = { lap };

    for (const driver of DRIVER_CONFIGS) {
      const rand = rng(lap * 1000 + driver.basePace * 100);

      // Simulate realistic F1 race lap time evolution
      let lapTime = driver.basePace;

      // Lap 1 is always slower (traffic, cold tyres)
      if (lap === 1) lapTime += 3.0 + rand() * 2.0;
      // Tyre degradation curve (gets worse towards pit window)
      else if (lap < 15) lapTime += rand() * 0.6;
      else if (lap < 25) lapTime += 0.3 + rand() * 0.8; // medium deg
      else if (lap < 35) lapTime += rand() * 0.5; // fresh tyres after pit
      else lapTime += 0.4 + rand() * 1.0; // second stint deg

      // Pit stops create outliers (~25s loss)
      if ((driver.code === 'VER' && lap === 22) ||
          (driver.code === 'NOR' && lap === 24) ||
          (driver.code === 'LEC' && lap === 20) ||
          (driver.code === 'HAM' && lap === 26) ||
          (driver.code === 'RUS' && lap === 23) ||
          (driver.code === 'PIA' && lap === 21) ||
          (driver.code === 'ALO' && lap === 25) ||
          (driver.code === 'SAI' && lap === 19)) {
        lapTime += 22 + rand() * 3;
      }

      // Safety car laps (laps 30-32)
      if (lap >= 30 && lap <= 32) lapTime += 12 + rand() * 2;

      entry[driver.code] = parseFloat(lapTime.toFixed(3));
    }

    data.push(entry);
  }

  return data;
}

export default function LapEvolutionChart() {
  const [activeDrivers, setActiveDrivers] = useState<Set<string>>(
    new Set(['VER', 'NOR', 'LEC', 'HAM'])
  );
  const [totalLaps] = useState(50);

  const lapData = useMemo(() => generateLapData(totalLaps), [totalLaps]);

  const toggleDriver = (code: string) => {
    setActiveDrivers((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        if (next.size > 1) next.delete(code); // Keep at least 1 selected
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const selectAll = () => setActiveDrivers(new Set(DRIVER_CONFIGS.map((d) => d.code)));
  const selectNone = () => setActiveDrivers(new Set([DRIVER_CONFIGS[0].code]));

  // Calculate Y-axis domain excluding pit stop outliers
  const yDomain = useMemo(() => {
    const allTimes: number[] = [];
    for (const entry of lapData) {
      for (const driver of DRIVER_CONFIGS) {
        if (activeDrivers.has(driver.code)) {
          const time = entry[driver.code] as number;
          if (time < 100) allTimes.push(time); // Exclude pit lap outliers
        }
      }
    }
    if (allTimes.length === 0) return [78, 90];
    const min = Math.floor(Math.min(...allTimes) - 0.5);
    const max = Math.ceil(Math.max(...allTimes) + 0.5);
    return [min, max];
  }, [lapData, activeDrivers]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#141722] rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-lg font-extrabold text-white">LAP EVOLUTION</h2>
            <p className="text-[10px] text-gray-500 font-mono">PACE COMPARISON • {totalLaps} LAPS • PIT STOPS VISIBLE</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={selectAll}
            className="flex items-center space-x-1 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
          >
            <Eye className="w-3 h-3" />
            <span>ALL</span>
          </button>
          <button
            onClick={selectNone}
            className="flex items-center space-x-1 text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
          >
            <EyeOff className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Driver Toggle Chips */}
      <div className="flex flex-wrap gap-2">
        {DRIVER_CONFIGS.map((driver) => {
          const isActive = activeDrivers.has(driver.code);
          return (
            <button
              key={driver.code}
              onClick={() => toggleDriver(driver.code)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
                isActive
                  ? 'border-white/20 bg-white/10 text-white shadow-lg'
                  : 'border-white/5 bg-white/[0.02] text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: isActive ? driver.color : '#555' }}
              />
              <span>{driver.code}</span>
              <span className="text-[10px] text-gray-500 hidden sm:inline">{driver.team}</span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-[#141722] rounded-2xl p-4 sm:p-6 border border-white/10">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={lapData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2132" />
            <XAxis
              dataKey="lap"
              stroke="#4a5568"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              label={{ value: 'Volta', position: 'insideBottom', offset: -2, style: { fill: '#6b7280', fontSize: 11 } }}
            />
            <YAxis
              domain={yDomain as [number, number]}
              stroke="#4a5568"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              label={{ value: 'Tempo (s)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 11 } }}
              tickFormatter={(value: number) => {
                const mins = Math.floor(value / 60);
                const secs = (value % 60).toFixed(0);
                return mins > 0 ? `${mins}:${secs.padStart(2, '0')}` : `${value}`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1d2e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
              labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
              labelFormatter={(label) => `Volta ${label}`}
              formatter={(value: number, name: string) => {
                const mins = Math.floor(value / 60);
                const secs = (value % 60).toFixed(3);
                const formatted = mins > 0 ? `${mins}:${secs.padStart(6, '0')}` : `${value.toFixed(3)}s`;
                return [formatted, name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
            />
            {DRIVER_CONFIGS.filter((d) => activeDrivers.has(d.code)).map((driver) => (
              <Line
                key={driver.code}
                type="monotone"
                dataKey={driver.code}
                name={driver.code}
                stroke={driver.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
