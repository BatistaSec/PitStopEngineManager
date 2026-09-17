'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Gauge, Flame, Zap, Disc, Play, Pause, RefreshCw } from 'lucide-react';

interface TelemetryPoint {
  time: string;
  speed: number;
  rpm: number;
  brakeTemp: number;
  ers: number;
  tyreWear: number;
}

const DRIVERS = [
  { id: 1, name: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', color: '#3671C6', number: 1 },
  { id: 2, name: 'Charles Leclerc', code: 'LEC', team: 'Scuderia Ferrari', color: '#E8002D', number: 16 },
  { id: 3, name: 'Lando Norris', code: 'NOR', team: 'McLaren F1 Team', color: '#FF8000', number: 4 },
  { id: 4, name: 'Lewis Hamilton', code: 'HAM', team: 'Mercedes AMG', color: '#6CD3BF', number: 44 },
];

export default function PitWallTelemetry() {
  const [selectedDriver, setSelectedDriver] = useState(DRIVERS[0]);
  const [isLive, setIsLive] = useState(true);
  const [telemetryData, setTelemetryData] = useState<TelemetryPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    speed: 312,
    rpm: 11800,
    brakeTemp: 780,
    ers: 84,
    gear: 7,
    tyreWear: 18,
  });

  // Generate initial telemetric lap dataset
  useEffect(() => {
    const initial: TelemetryPoint[] = [];
    for (let i = 0; i < 20; i++) {
      initial.push({
        time: `${i * 2}s`,
        speed: 180 + Math.floor(Math.sin(i / 2) * 140) + Math.floor(Math.random() * 15),
        rpm: 9000 + Math.floor(Math.sin(i / 2) * 3200),
        brakeTemp: 500 + Math.floor(Math.random() * 350),
        ers: Math.max(10, 100 - i * 4),
        tyreWear: Math.min(100, Math.floor(i * 1.5)),
      });
    }
    setTelemetryData(initial);
  }, [selectedDriver]);

  // Live telemetry streaming loop
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newSpeed = 200 + Math.floor(Math.random() * 140);
      const newRpm = 9500 + Math.floor(Math.random() * 2800);
      const newBrakeTemp = 600 + Math.floor(Math.random() * 300);
      const newErs = Math.max(5, Math.floor(Math.random() * 95));
      const newGear = newSpeed > 300 ? 8 : newSpeed > 260 ? 7 : newSpeed > 220 ? 6 : 5;

      setCurrentMetrics({
        speed: newSpeed,
        rpm: newRpm,
        brakeTemp: newBrakeTemp,
        ers: newErs,
        gear: newGear,
        tyreWear: Math.floor(Math.random() * 25) + 10,
      });

      setTelemetryData((prev) => {
        const nextTime = `${prev.length * 2}s`;
        const newPoint: TelemetryPoint = {
          time: nextTime,
          speed: newSpeed,
          rpm: newRpm,
          brakeTemp: newBrakeTemp,
          ers: newErs,
          tyreWear: Math.floor(Math.random() * 25) + 10,
        };
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      {/* Driver Selector & Stream Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141722] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Piloto em Pista:</span>
          {DRIVERS.map((driver) => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedDriver.id === driver.id
                  ? 'bg-white/10 text-white border-white/30 shadow-md'
                  : 'bg-transparent text-gray-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: driver.color }}></span>
              <span>{driver.code}</span>
              <span className="text-[10px] opacity-60">#{driver.number}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'STREAMING AO VIVO' : 'PAUSADO'}</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry Gauges / Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Speed */}
        <div className="bg-[#141722] p-4 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Velocidade</span>
            <Gauge className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{currentMetrics.speed}</span>
            <span className="text-xs font-mono text-gray-400">KM/H</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-500 to-red-600 h-full transition-all duration-500"
              style={{ width: `${(currentMetrics.speed / 360) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* RPM & Gear */}
        <div className="bg-[#141722] p-4 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">RPM / Marcha</span>
            <span className="text-xs font-bold text-red-400 font-mono">M{currentMetrics.gear}</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{currentMetrics.rpm}</span>
            <span className="text-xs font-mono text-gray-400">RPM</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-emerald-400 to-red-500 h-full transition-all duration-500"
              style={{ width: `${(currentMetrics.rpm / 13000) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Brake Temp */}
        <div className="bg-[#141722] p-4 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Temp. Freios</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{currentMetrics.brakeTemp}</span>
            <span className="text-xs font-mono text-gray-400">°C</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-600 h-full transition-all duration-500"
              style={{ width: `${(currentMetrics.brakeTemp / 1000) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* ERS Level */}
        <div className="bg-[#141722] p-4 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Nível ERS</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{currentMetrics.ers}</span>
            <span className="text-xs font-mono text-gray-400">%</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-500"
              style={{ width: `${currentMetrics.ers}%` }}
            ></div>
          </div>
        </div>

        {/* Tyre Wear */}
        <div className="bg-[#141722] p-4 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Desgaste Pneus</span>
            <Disc className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight">{currentMetrics.tyreWear}</span>
            <span className="text-xs font-mono text-gray-400">%</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all duration-500"
              style={{ width: `${currentMetrics.tyreWear}%` }}
            ></div>
          </div>
        </div>

        {/* Team Card */}
        <div className="bg-[#141722] p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Escuderia</span>
          <div>
            <span className="text-sm font-bold text-white block truncate">{selectedDriver.team}</span>
            <span className="text-[10px] text-gray-400 font-mono block">CAR #{selectedDriver.number}</span>
          </div>
        </div>
      </div>

      {/* Real-time Recharts Area Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speed Telemetry Chart */}
        <div className="bg-[#141722] p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedDriver.color }}></span>
                <span>Telemetria de Velocidade (KM/H)</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">Curva de aceleração em tempo real</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {currentMetrics.speed} km/h
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedDriver.color} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={selectedDriver.color} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[120, 360]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1d29', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="speed" stroke={selectedDriver.color} strokeWidth={2.5} fillOpacity={1} fill="url(#speedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RPM & Brake Temp Chart */}
        <div className="bg-[#141722] p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Rotação do Motor (RPM) & Freios (°C)</h3>
              <p className="text-[11px] text-gray-400 font-mono">Correlação de freio e motor em curva</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} domain={[8000, 13000]} />
                <YAxis yAxisId="right" orientation="right" stroke="#f97316" fontSize={11} domain={[400, 1100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1d29', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="rpm" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="brakeTemp" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
