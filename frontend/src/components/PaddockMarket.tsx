'use client';

import React, { useState } from 'react';
import { DollarSign, Calendar, MessageSquare, Flame, AlertCircle, Award, UserCheck, ShieldCheck, Newspaper, ExternalLink } from 'lucide-react';

interface DriverContract {
  id: number;
  driverCode: string;
  driverName: string;
  team: string;
  teamColor: string;
  contractUntil: number;
  annualSalary: string;
  buyoutClause: string;
  status: 'CONFIRMED' | 'NEGOTIATING' | 'EXPIRING SOON' | 'RUMORED EXIT';
  notes: string;
}

interface PressConferenceQuote {
  id: number;
  speaker: string;
  role: string;
  team: string;
  date: string;
  headline: string;
  quote: string;
  category: 'PRE-RACE' | 'CONTRACT' | 'TECH' | 'CONTROVERSY';
}

const CONTRACTS_DATA: DriverContract[] = [
  {
    id: 1,
    driverCode: 'VER',
    driverName: 'Max Verstappen',
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    contractUntil: 2028,
    annualSalary: '$55,000,000',
    buyoutClause: '$120,000,000',
    status: 'CONFIRMED',
    notes: 'Cláusula de saída atrelada ao desempenho do motor Ford em 2026.'
  },
  {
    id: 2,
    driverCode: 'HAM',
    driverName: 'Lewis Hamilton',
    team: 'Scuderia Ferrari',
    teamColor: '#E8002D',
    contractUntil: 2026,
    annualSalary: '$50,000,000',
    buyoutClause: 'N/A (Ano Final)',
    status: 'CONFIRMED',
    notes: 'Contrato multi-anual assinado com opção de extensão para embaixador da marca.'
  },
  {
    id: 3,
    driverCode: 'LEC',
    driverName: 'Charles Leclerc',
    team: 'Scuderia Ferrari',
    teamColor: '#E8002D',
    contractUntil: 2029,
    annualSalary: '$34,000,000',
    buyoutClause: '$80,000,000',
    status: 'CONFIRMED',
    notes: 'Vínculo longo renovado com bônus de vitórias progressivo.'
  },
  {
    id: 4,
    driverCode: 'NOR',
    driverName: 'Lando Norris',
    team: 'McLaren F1 Team',
    teamColor: '#FF8000',
    contractUntil: 2027,
    annualSalary: '$25,000,000',
    buyoutClause: '$65,000,000',
    status: 'CONFIRMED',
    notes: 'Sem cláusula de saída imediata para equipes rivais.'
  },
  {
    id: 5,
    driverCode: 'RUS',
    driverName: 'George Russell',
    team: 'Mercedes AMG',
    teamColor: '#27F4D2',
    contractUntil: 2026,
    annualSalary: '$18,000,000',
    buyoutClause: 'Em renegociação',
    status: 'EXPIRING SOON',
    notes: 'Conversas ativas para renovação estendida até 2028.'
  },
  {
    id: 6,
    driverCode: 'ANT',
    driverName: 'Andrea Kimi Antonelli',
    team: 'Mercedes AMG',
    teamColor: '#27F4D2',
    contractUntil: 2026,
    annualSalary: '$6,000,000',
    buyoutClause: 'N/A (Rookie Contract)',
    status: 'NEGOTIATING',
    notes: 'Mercedes estuda extensão de longo prazo dependendo da pontuação da temporada.'
  },
  {
    id: 7,
    driverCode: 'PIA',
    driverName: 'Oscar Piastri',
    team: 'McLaren F1 Team',
    teamColor: '#FF8000',
    contractUntil: 2026,
    annualSalary: '$12,000,000',
    buyoutClause: '$45,000,000',
    status: 'RUMORED EXIT',
    notes: 'Especulações no paddock apontam forte interesse da Red Bull para ocupar vaga em 2027.'
  }
];

const PRESS_QUOTES: PressConferenceQuote[] = [
  {
    id: 1,
    speaker: 'Max Verstappen',
    role: 'Piloto',
    team: 'Red Bull Racing',
    date: '2026-09-18',
    headline: 'Verstappen comenta sobre nova unidade de potência 2026 e seu futuro',
    quote: '"O nosso foco principal está na entrega de energia nas retas. O contrato com a Red Bull vai até 2028, mas na Fórmula 1 tudo depende da competitividade do carro a cada domingo."',
    category: 'CONTRACT'
  },
  {
    id: 2,
    speaker: 'Toto Wolff',
    role: 'Chefe de Equipe',
    team: 'Mercedes AMG',
    date: '2026-09-19',
    headline: 'Toto Wolff detalha conversas de renovação com Russell e futuro da dupla',
    quote: '"George é a nossa base e o Kimi é o futuro brilhante que acompanhamos desde o kart. O mercado de pilotos para 2027 estará movimentado, mas nossa prioridade é a estabilidade."',
    category: 'PRE-RACE'
  },
  {
    id: 3,
    speaker: 'Lewis Hamilton',
    role: 'Piloto',
    team: 'Scuderia Ferrari',
    date: '2026-09-19',
    headline: 'Hamilton revela adaptação à cultura e metodologias da Ferrari em Maranello',
    quote: '"Vestir vermelho é um sentimento inexplicável. A pressão é imensa, mas a paixão da equipe nos impulsiona a buscar cada décimo de segundo no simulador."',
    category: 'TECH'
  }
];

export default function PaddockMarket() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CONFIRMED' | 'EXPIRING SOON' | 'RUMORED EXIT'>('ALL');

  const filteredContracts = CONTRACTS_DATA.filter((c) => {
    if (selectedFilter === 'ALL') return true;
    return c.status === selectedFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-[#141722] to-gray-900 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-[10px] font-bold uppercase border border-purple-500/30">
              FIA PADDOCK & INSIDER MARKET
            </span>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Mercado de Pilotos & Contratos F1</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Matriz de salários anuais, validade de vínculos contratuais, cláusulas de rescisão e coletivas de imprensa da FIA.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-gray-400 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Teto Orçamentário Cap: <strong className="text-white">$135M/ano</strong></span>
        </div>
      </div>

      {/* Grid: Contracts Table & Market Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Driver Contract Matrix (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-[#111] p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Matriz de Contratos & Salários</h3>
            </div>

            {/* Status Filters */}
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              {(['ALL', 'CONFIRMED', 'EXPIRING SOON', 'RUMORED EXIT'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold transition-all border ${
                    selectedFilter === filter
                      ? 'bg-white/10 text-white border-white/30'
                      : 'bg-transparent text-gray-500 border-transparent hover:text-white'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] text-gray-500 uppercase tracking-widest border-b border-white/10 text-[10px]">
                    <th className="px-4 py-3">Piloto / Equipe</th>
                    <th className="px-4 py-3 text-center">Vínculo Até</th>
                    <th className="px-4 py-3 text-right">Salário Anual</th>
                    <th className="px-4 py-3 text-right hidden sm:table-cell">Cláusula Rescisão</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: contract.teamColor }}></span>
                          <div>
                            <span className="font-bold text-white block">{contract.driverName} ({contract.driverCode})</span>
                            <span className="text-[10px] text-gray-500 uppercase">{contract.team}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold border ${
                          contract.contractUntil <= 2026 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {contract.contractUntil}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-400">{contract.annualSalary}</td>
                      <td className="px-4 py-3 text-right text-gray-400 text-[10px] hidden sm:table-cell">{contract.buyoutClause}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          contract.status === 'CONFIRMED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          contract.status === 'EXPIRING SOON' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                          contract.status === 'RUMORED EXIT' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                          'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Press Conferences & Rumors Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="bg-[#111] p-4 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2 mb-3">
              <Newspaper className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Coletiva de Imprensa FIA</h3>
            </div>
            <p className="text-[11px] text-gray-400">Transcrições e declarações oficiais direto do Paddock.</p>
          </div>

          <div className="space-y-3">
            {PRESS_QUOTES.map((item) => (
              <div key={item.id} className="bg-[#111] p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span className="text-cyan-400 font-bold uppercase">{item.speaker} ({item.team})</span>
                  <span>{item.date}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{item.headline}</h4>
                <p className="text-[11px] text-gray-400 italic bg-black/40 p-2.5 rounded-lg border border-white/5">
                  {item.quote}
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">{item.category}</span>
                  <span className="flex items-center space-x-1 text-gray-400 hover:text-white cursor-pointer">
                    <span>Transcrição Completa</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
