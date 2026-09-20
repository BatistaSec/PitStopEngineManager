'use client';

import React, { useState } from 'react';
import { Sun, CloudRain, CloudLightning, Volume2, VolumeX, Radio, Thermometer, Droplets } from 'lucide-react';

export type WeatherMode = 'DRY' | 'INTERMEDIATE' | 'WET';

interface WeatherSimulatorProps {
  onWeatherChange?: (mode: WeatherMode, temp: number) => void;
}

export default function WeatherSimulator({ onWeatherChange }: WeatherSimulatorProps) {
  const [mode, setMode] = useState<WeatherMode>('DRY');
  const [trackTemp, setTrackTemp] = useState<number>(32);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [radioMsg, setRadioMsg] = useState<string>('RADIO SILENT - MONITORING');

  const playPitRadio = (message: string) => {
    setRadioMsg(message);
    if (isAudioMuted || typeof window === 'undefined') return;

    // 1. Play realistic F1 Pit Radio Beep using Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz pitch
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Audio context fallbacks
    }

    // 2. Web Speech API Voice synthesis for authentic F1 pit wall radio feel
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous voice
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleModeSelect = (newMode: WeatherMode) => {
    setMode(newMode);
    let newTemp = 32;
    let radioText = 'Conditions clear, push now!';

    if (newMode === 'INTERMEDIATE') {
      newTemp = 24;
      radioText = 'Rain expected in 5 minutes! Prepare intermediate compound!';
    } else if (newMode === 'WET') {
      newTemp = 19;
      radioText = 'Heavy rain on track! Safety Car deployed, stay alert!';
    }

    setTrackTemp(newTemp);
    playPitRadio(radioText);
    if (onWeatherChange) onWeatherChange(newMode, newTemp);
  };

  return (
    <div className="bg-[#111] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Weather Selector */}
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider hidden md:inline">Clima da Pista:</span>
        <div className="flex bg-[#0a0a0a] border border-white/10 rounded-xl p-1 w-full sm:w-auto justify-between">
          <button
            onClick={() => handleModeSelect('DRY')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'DRY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>DRY</span>
          </button>
          <button
            onClick={() => handleModeSelect('INTERMEDIATE')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'INTERMEDIATE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>INTER</span>
          </button>
          <button
            onClick={() => handleModeSelect('WET')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              mode === 'WET' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5" />
            <span>WET</span>
          </button>
        </div>
      </div>

      {/* Temperature & Moisture Metrics */}
      <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
        <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          <Thermometer className="w-3.5 h-3.5 text-red-400" />
          <span>TEMP: <strong className="text-white">{trackTemp}°C</strong></span>
        </div>
        <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 hidden lg:flex">
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>UMIDADE: <strong className="text-white">{mode === 'DRY' ? '12%' : mode === 'INTERMEDIATE' ? '55%' : '92%'}</strong></span>
        </div>
      </div>

      {/* Pit Radio Controls */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
        <div className="flex items-center space-x-2 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl">
          <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="text-[10px] font-mono text-purple-200 truncate max-w-[180px] sm:max-w-[220px]">
            {radioMsg}
          </span>
        </div>

        <button
          onClick={() => {
            const nextState = !isAudioMuted;
            setIsAudioMuted(nextState);
            if (!nextState) playPitRadio('Pit radio unmuted, loud and clear!');
          }}
          className={`p-2 rounded-xl border transition-all ${
            isAudioMuted ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}
          title={isAudioMuted ? 'Ativar Rádio do Engenheiro' : 'Mutar Rádio do Engenheiro'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
