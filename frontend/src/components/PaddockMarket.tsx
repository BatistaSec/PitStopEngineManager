'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, MessageSquare, Flame, AlertCircle, Award, UserCheck, ShieldCheck, Newspaper, ExternalLink, RefreshCw, Radio } from 'lucide-react';

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

interface LiveNewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
  source: string;
}

export default function PaddockMarket() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CONFIRMED' | 'EXPIRING SOON' | 'RUMORED EXIT'>('ALL');
  const [contracts, setContracts] = useState<DriverContract[]>([]);
  const [news, setNews] = useState<LiveNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isLiveFeed, setIsLiveFeed] = useState(false);

  const fetchPaddockData = async () => {
    setLoadingNews(true);
    try {
      // 1. Fetch real news from Live RSS API
      const newsRes = await fetch('http://localhost:8000/api/v1/paddock/news');
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        if (newsData.items && newsData.items.length > 0) {
          setNews(newsData.items);
          setIsLiveFeed(true);
        }
      }

      // 2. Fetch real contracts from API
      const contractsRes = await fetch('http://localhost:8000/api/v1/paddock/contracts');
      if (contractsRes.ok) {
        const contractsData = await contractsRes.json();
        setContracts(contractsData);
      }
    } catch (err) {
      console.error('Erro ao conectar a API do Paddock:', err);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchPaddockData();
  }, []);

  const filteredContracts = contracts.filter((c) => {
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

        {/* Press Conferences & Live News Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="bg-[#111] p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Newspaper className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Feed de Imprensa F1 ao Vivo</h3>
              </div>
              <p className="text-[11px] text-gray-400">Coletivas e últimas notícias oficiais (Live RSS BBC/FIA)</p>
            </div>
            <button onClick={fetchPaddockData} className="p-1.5 text-gray-500 hover:text-white bg-white/5 rounded-lg transition-all" title="Atualizar Notícias">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingNews ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingNews ? (
            <div className="bg-[#111] p-8 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="text-xs font-mono text-gray-400 uppercase">Conectando ao Feed da FIA/BBC...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((item, idx) => (
                <div key={idx} className="bg-[#111] p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span className="text-cyan-400 font-bold uppercase flex items-center space-x-1">
                      <Radio className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                      <span>{item.source}</span>
                    </span>
                    <span className="text-[9px]">{item.pubDate ? item.pubDate.split(' ').slice(0, 4).join(' ') : 'Hoje'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 italic bg-black/40 p-2.5 rounded-lg border border-white/5 line-clamp-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-end text-[9px] font-mono text-gray-500 pt-1">
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition-colors">
                        <span>Ler Notícia Oficial</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
