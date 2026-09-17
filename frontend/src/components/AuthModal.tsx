'use client';

import React, { useState } from 'react';
import { X, Lock, UserPlus, LogIn, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { apiFetch, setAuthToken } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ROLE_USER' | 'ROLE_ADMIN'>('ROLE_ADMIN');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'register') {
        const res = await apiFetch<{ accessToken: string; username: string; role: string }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ username, email, password, role }),
        });
        setAuthToken(res.accessToken, res.username, res.role);
        setMessage({ type: 'success', text: `Conta criada com sucesso! Logado como ${res.username} (${res.role})` });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        const res = await apiFetch<{ accessToken: string; username: string; role: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });
        setAuthToken(res.accessToken, res.username, res.role);
        setMessage({ type: 'success', text: `Autenticado com sucesso como ${res.username} (${res.role})` });
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Falha na autenticação. Verifique os dados.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#141722] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">
              {mode === 'login' ? 'Entrar no PitStopEngine' : 'Criar Nova Conta'}
            </h2>
            <p className="text-xs text-gray-400 font-mono">Autenticação com JWT Bearer Token</p>
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center space-x-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Nome de Usuário</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin_f1"
              className="w-full bg-[#1c202e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pitstopengine.com"
                className="w-full bg-[#1c202e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1c202e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">Perfil de Acesso</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#1c202e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="ROLE_ADMIN">ROLE_ADMIN (Acesso Total + Criação)</option>
                <option value="ROLE_USER">ROLE_USER (Leitura de Telemetria)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setMessage(null);
            }}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {mode === 'login' ? 'Não tem uma conta? Clique para Registrar' : 'Já possui conta? Clique para Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
