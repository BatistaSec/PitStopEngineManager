'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Gauge, Flame, Zap, Disc, Play, Pause } from 'lucide-react';
import { useLiveStream } from '../lib/useLiveStream';

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

interface PitWallTelemetryProps {
  isEnabled?: boolean;
}

export default function PitWallTelemetry({ isEnabled = true }: PitWallTelemetryProps) {
  const [selectedDriver, setSelectedDriver] = useState(DRIVERS[0]);
  const [telemetryData, setTelemetryData] = useState<TelemetryPoint[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    speed: 0,
    rpm: 0,
    brakeTemp: 0,
    ers: 0,
    gear: 0,
    tyreWear: 0,
  });

  const [aiPrediction, setAiPrediction] = useState<{ recommended_pit_lap: number; laps_remaining_until_pit: number } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Consume REAL SSE telemetry feed
  const { data: telemetryFeed } = useLiveStream<any[]>({
    endpoint: '/telemetry/stream',
    eventName: 'telemetry',
    enabled: isEnabled,
  });

  useEffect(() => {
    if (!isEnabled) {
      setCurrentMetrics({
        speed: 0,
        rpm: 0,
        brakeTemp: 0,
        ers: 0,
        gear: 0,
        tyreWear: 0,
      });
      setTelemetryData([]);
      return;
    }
    if (telemetryFeed && Array.isArray(telemetryFeed)) {
      const driverData = telemetryFeed.find((d: any) => d.driverCode === selectedDriver.code);
      if (driverData) {
        const newSpeed = driverData.speed;
        const newGear = newSpeed > 300 ? 8 : newSpeed > 260 ? 7 : newSpeed > 220 ? 6 : 5;
        
        setCurrentMetrics({
          speed: newSpeed,
          rpm: driverData.engineRpm,
          brakeTemp: driverData.brakeTemp,
          ers: driverData.ersLevel,
          gear: newGear,
          tyreWear: Math.floor(Math.random() * 25) + 10, // AI predict placeholder for gauge
        });

        setTelemetryData((prev) => {
          const nextTime = `${prev.length}s`;
          const newPoint = {
            time: nextTime,
            speed: newSpeed,
            rpm: driverData.engineRpm,
            brakeTemp: driverData.brakeTemp,
            ers: driverData.ersLevel,
            tyreWear: 15,
          };
          const updated = [...prev, newPoint].slice(-20); // Keep last 20 points
          return updated;
        });
      }
    }
  }, [telemetryFeed, selectedDriver]);

  const handlePredictStrategy = async () => {
    setIsPredicting(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/predict/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_compound: 'SOFT',
          current_laps: 15,
          track_temperature: 30.5,
          total_laps: 57
        })
      });
      if (!res.ok) throw new Error('Servidor de IA indisponível no momento');
      const data = await res.json();
      setAiPrediction(data);
    } catch (err: any) {
      console.error(err);
      alert('Aviso da IA: Não foi possível conectar ao motor em http://localhost:8000. Verifique se o backend Python (FastAPI) está rodando.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Simulação de Corrida Histórica Real */}
      <div className="bg-gradient-to-r from-red-950/40 via-purple-900/30 to-blue-950/40 p-4 rounded-2xl border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold uppercase border border-red-500/30">
                REPLAY AO VIVO (FASTF1)
              </span>
              <h3 className="text-sm font-bold text-white">F1 2023 - GP do Bahrain (Sakhir)</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Hoje não há corrida oficial ao vivo. O sistema está reproduzindo o replay da telemetria real milissegundo a milissegundo.
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-gray-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          <span className="text-gray-500">Pista:</span> <span className="text-white font-bold">Bahrain International Circuit</span>
        </div>
      </div>

      {/* Driver Selector & Stream Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141722] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
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
            <span className="text-xs font-bold text-red-400 font-mono">
              {currentMetrics.gear > 0 ? `M${currentMetrics.gear}` : 'N'}
            </span>
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

          <div className="h-64 w-full relative">
            {telemetryData.length === 0 && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0c14]/80 rounded-xl border border-dashed border-white/10 backdrop-blur-sm">
                <Gauge className="w-8 h-8 text-gray-600 animate-pulse mb-2" />
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Aguardando dados de velocidade ao vivo...</span>
                <span className="text-[10px] text-gray-600 mt-1">Inicie o simulador Python para iniciar a telemetria</span>
              </div>
            )}
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

          <div className="h-64 w-full relative">
            {telemetryData.length === 0 && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0c14]/80 rounded-xl border border-dashed border-white/10 backdrop-blur-sm">
                <Flame className="w-8 h-8 text-gray-600 animate-pulse mb-2" />
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Aguardando curva de motor e freios...</span>
                <span className="text-[10px] text-gray-600 mt-1">Conexão SSE aberta aguardando pacotes de dados</span>
              </div>
            )}
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
        {/* AI Strategy Engine Card */}
        <div className="bg-[#141722] p-5 rounded-2xl border border-purple-500/30 relative overflow-hidden group col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>AI Predictive Strategy</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">Trained on Real Bahrain 2023 FastF1 Data</p>
            </div>
            <button 
              onClick={handlePredictStrategy} 
              disabled={isPredicting}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              {isPredicting ? 'PREDICTING...' : 'RUN AI ANALYSIS'}
            </button>
          </div>
          {aiPrediction ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 bg-purple-900/20 border border-purple-500/20 rounded-xl">
               <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Recommended Box Lap</span>
                  <span className="text-2xl font-bold text-purple-400">LAP {aiPrediction.recommended_pit_lap}</span>
               </div>
               <div className="flex flex-col sm:border-l sm:border-white/10 sm:pl-6">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Laps Remaining (Current Stint)</span>
                  <span className="text-2xl font-bold text-white">{aiPrediction.laps_remaining_until_pit} LAPS</span>
               </div>
               <div className="flex flex-col sm:border-l sm:border-white/10 sm:pl-6">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Action</span>
                  <span className={`text-lg font-bold uppercase tracking-wider ${aiPrediction.laps_remaining_until_pit <= 3 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                    {aiPrediction.laps_remaining_until_pit <= 3 ? 'BOX BOX BOX' : 'STAY OUT'}
                  </span>
               </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 bg-[#0a0c14] rounded-xl border border-white/5">
              <span className="text-xs text-gray-500 font-mono uppercase">Awaiting AI execution trigger</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
