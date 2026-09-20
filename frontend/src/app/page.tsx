import Link from 'next/link';
import { Activity, Lock, Database, Radio, CheckSquare, LineChart, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-gray-800 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#0a0a0a]" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">PitStopEngine Workspace</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#architecture" className="text-xs font-mono hover:text-white transition-colors uppercase tracking-wider">Architecture</a>
          <a href="#telemetry" className="text-xs font-mono hover:text-white transition-colors uppercase tracking-wider">Telemetry</a>
          <Link 
            href="/dashboard"
            className="border border-white/20 text-white px-4 py-1.5 text-xs font-mono hover:bg-white hover:text-black transition-colors"
          >
            LOGIN TO DASHBOARD
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-24 pb-32">
        {/* Header / Hero */}
        <header className="mb-20">
          <div className="inline-flex items-center space-x-2 bg-[#111] border border-white/10 px-3 py-1 mb-6 rounded-sm">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">System Online - v2.1.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
            High-Fidelity Race Telemetry & Data Modeling
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl font-mono leading-relaxed">
            A distributed architecture for real-time Formula 1 session management. 
            Process live timing, track track evolution, and monitor race pace differentials with sub-millisecond latency.
          </p>
        </header>

        {/* Feature Grid - Technical */}
        <section id="architecture" className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          <div className="bg-[#0a0a0a] p-8">
            <Database className="w-5 h-5 text-gray-400 mb-4" />
            <h3 className="text-white font-medium mb-2">Relational Data Persistence</h3>
            <p className="text-sm text-gray-500 font-mono leading-relaxed">
              JPA & Hibernate backed by PostgreSQL for immutable records of teams, drivers, and historical race schedules.
            </p>
          </div>
          <div className="bg-[#0a0a0a] p-8">
            <Radio className="w-5 h-5 text-gray-400 mb-4" />
            <h3 className="text-white font-medium mb-2">Event-Driven Telemetry</h3>
            <p className="text-sm text-gray-500 font-mono leading-relaxed">
              Asynchronous messaging powered by RabbitMQ to process live timing sectors and emit Server-Sent Events (SSE) to the dashboard.
            </p>
          </div>
          <div className="bg-[#0a0a0a] p-8">
            <CheckSquare className="w-5 h-5 text-gray-400 mb-4" />
            <h3 className="text-white font-medium mb-2">Role-Based Access Control</h3>
            <p className="text-sm text-gray-500 font-mono leading-relaxed">
              Spring Security JWT implementation ensuring strict segregation of duties between read-only analysts and write-access engineers.
            </p>
          </div>
          <div className="bg-[#0a0a0a] p-8">
            <LineChart className="w-5 h-5 text-gray-400 mb-4" />
            <h3 className="text-white font-medium mb-2">Predictive Pace Modeling</h3>
            <p className="text-sm text-gray-500 font-mono leading-relaxed">
              Analyze tyre degradation curves and forecast optimal pit stop windows based on live track evolution algorithms.
            </p>
          </div>
        </section>

        {/* Terminal/Code Preview */}
        <section id="telemetry" className="mt-32">
          <div className="border border-white/10 bg-[#111] rounded-sm overflow-hidden">
            <div className="border-b border-white/10 bg-[#1a1a1a] px-4 py-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live Feed: /api/v1/telemetry/stream</span>
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="p-6 font-mono text-xs md:text-sm text-gray-400 overflow-x-auto leading-loose">
              <div className="flex"><span className="text-green-400 w-24">00:00:01</span><span className="text-blue-400">INFO</span><span className="ml-4">Connected to AMQP broker. Awaiting session start...</span></div>
              <div className="flex"><span className="text-green-400 w-24">00:00:03</span><span className="text-yellow-400">WARN</span><span className="ml-4">Track Temperature decreasing: 38.2°C</span></div>
              <div className="flex"><span className="text-green-400 w-24">00:00:04</span><span className="text-blue-400">INFO</span><span className="ml-4 text-white">Event received: NEW_LAP {`{ driverId: 1, sector1: 28.452, tyre: 'SOFT' }`}</span></div>
              <div className="flex"><span className="text-green-400 w-24">00:00:04</span><span className="text-blue-400">INFO</span><span className="ml-4 text-purple-400">Personal Best Sector detected.</span></div>
              <div className="flex"><span className="text-green-400 w-24">00:00:05</span><span className="text-blue-400">INFO</span><span className="ml-4">Broadcasting SSE payload to active subscribers...</span></div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-32 border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">Access the Pit Wall</h2>
            <p className="text-sm font-mono text-gray-500">Authorized personnel only.</p>
          </div>
          <Link 
            href="/dashboard"
            className="mt-6 md:mt-0 flex items-center space-x-2 bg-white text-black px-6 py-3 text-sm font-mono hover:bg-gray-200 transition-colors"
          >
            <span>INITIALIZE DASHBOARD</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center bg-[#050505]">
        <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          SYSTEM BUILD 2026.4.1 | PitStopEngine Core
        </p>
      </footer>
    </div>
  );
}
