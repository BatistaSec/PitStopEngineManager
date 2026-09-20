'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Navigation, Radio, Play, Pause, Zap } from 'lucide-react';
import { useLiveStream } from '../lib/useLiveStream';

interface DriverPosition {
  driverCode: string;
  speed: number;
  color: string;
  progress: number; // 0 to 100% of lap
}

const DRIVER_COLORS: Record<string, string> = {
  VER: '#3671C6',
  LEC: '#E8002D',
  NOR: '#FF8000',
  HAM: '#6CD3BF',
};

// Bahrain International Circuit SVG Path Coordinates
const CIRCUIT_PATH_D = "M 150 400 L 200 120 Q 250 80 320 100 L 500 150 Q 560 170 580 220 L 590 350 Q 590 400 520 420 L 420 440 L 350 320 L 280 430 L 150 400 Z";

export default function LiveTrackMap() {
  const [positions, setPositions] = useState<Record<string, DriverPosition>>({
    VER: { driverCode: 'VER', speed: 0, color: '#3671C6', progress: 15 },
    LEC: { driverCode: 'LEC', speed: 0, color: '#E8002D', progress: 32 },
    NOR: { driverCode: 'NOR', speed: 0, color: '#FF8000', progress: 54 },
    HAM: { driverCode: 'HAM', speed: 0, color: '#6CD3BF', progress: 78 },
  });

  const { data: telemetryFeed } = useLiveStream<any[]>({
    endpoint: '/telemetry/stream',
    eventName: 'telemetry',
    enabled: true,
  });

  useEffect(() => {
    if (telemetryFeed && Array.isArray(telemetryFeed)) {
      setPositions((prev) => {
        const next = { ...prev };
        telemetryFeed.forEach((d: any) => {
          if (d.driverCode && next[d.driverCode]) {
            const currentProg = next[d.driverCode].progress;
            const deltaProg = Math.max(0.2, (d.speed || 150) / 1200);
            next[d.driverCode] = {
              ...next[d.driverCode],
              speed: d.speed,
              progress: (currentProg + deltaProg) % 100,
            };
          }
        });
        return next;
      });
    }
  }, [telemetryFeed]);

  // Interpolate SVG path coordinates for progress 0-100%
  const getCoordinatesForProgress = (progPercent: number) => {
    // Standard parametric points along Sakhir layout
    const rad = (progPercent / 100) * 2 * Math.PI;
    const cx = 360;
    const cy = 260;
    const rx = 200;
    const ry = 140;
    
    // Deformed oval reflecting Sakhir's outer loop
    const x = cx + rx * Math.cos(rad) + 30 * Math.sin(2 * rad);
    const y = cy + ry * Math.sin(rad) + 20 * Math.cos(3 * rad);
    return { x, y };
  };

  return (
    <div className="bg-[#111] p-5 rounded-2xl border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center space-x-3">
          <Navigation className="w-5 h-5 text-green-500 animate-spin-slow" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded uppercase font-bold border border-green-500/20">
                LIVE GPS TRACKING
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Circuito de Sakhir (Bahrain GP)</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">Posicionamento espacial ao vivo dos pilotos na pista</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-mono text-gray-400">
          <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            <span>LENGTH: 5.412 KM</span>
          </div>
        </div>
      </div>

      {/* SVG Circuit Canvas Area */}
      <div className="relative w-full h-80 bg-[#08090d] rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
        
        {/* Track Details Overlay */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-gray-500 space-y-1">
          <div>TURN 1: <span className="text-white">HAIRPIN</span></div>
          <div>SECTOR 2: <span className="text-white">BACK STRAIGHT</span></div>
        </div>

        <svg viewBox="0 0 720 520" className="w-full h-full max-h-80 select-none">
          {/* Track Outer Glow */}
          <path
            d={CIRCUIT_PATH_D}
            fill="none"
            stroke="#1a2035"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main Asphalt Path */}
          <path
            d={CIRCUIT_PATH_D}
            fill="none"
            stroke="#262c40"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Racing Line Apex */}
          <path
            d={CIRCUIT_PATH_D}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.4"
          />

          {/* Driver Markers moving along the circuit */}
          {Object.values(positions).map((driver) => {
            const coords = getCoordinatesForProgress(driver.progress);
            return (
              <g key={driver.driverCode} className="transition-all duration-300 ease-linear">
                {/* Driver Pulsing Ring */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="14"
                  fill={driver.color}
                  opacity="0.25"
                  className="animate-ping"
                />
                {/* Driver Dot Base */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="10"
                  fill="#0a0a0a"
                  stroke={driver.color}
                  strokeWidth="3"
                />
                {/* Driver Code Text */}
                <text
                  x={coords.x}
                  y={coords.y + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {driver.driverCode}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Panel */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-black/70 p-2 rounded-lg border border-white/10 backdrop-blur-md">
          {Object.values(positions).map((d) => (
            <div key={d.driverCode} className="flex items-center space-x-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
              <span className="text-white font-bold">{d.driverCode}</span>
              <span className="text-gray-400">{d.speed}km/h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
