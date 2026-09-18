import Link from 'next/link';
import { Trophy, Activity, Lock, RefreshCw, ChevronRight, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Activity className="w-6 h-6 text-red-500" />
          <span className="text-xl font-extrabold tracking-tight">PitStopEngine</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <Link 
          href="/dashboard"
          className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors flex items-center space-x-1"
        >
          <span>Open Dashboard</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <span className="text-xs font-mono text-gray-300">Live Telemetry & SSE Streaming</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
          Unleash the power of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
            intuitive telemetry
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Say goodbye to outdated timing tools. Every team principal, regardless of background, can now manage their race like a pro. Simple. Intuitive. And never boring.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="group flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-8 py-4 rounded-full text-white font-bold transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)]"
          >
            <span>Launch the Wall</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="text-gray-400 hover:text-white px-8 py-4 font-semibold transition-colors">
            Learn more ↓
          </a>
        </div>

        {/* Hero Mockup Image / Dashboard Preview */}
        <div className="mt-20 relative mx-auto max-w-5xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="bg-[#0b0d12] border border-white/10 rounded-[2rem] p-3 md:p-6 shadow-2xl overflow-hidden relative backdrop-blur-xl">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            {/* Fake Dashboard Grid inside Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-70 pointer-events-none">
              <div className="col-span-2 h-64 bg-[#141722] rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                {/* Fake Chart Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <svg className="w-full h-full text-red-500/70 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points="0,80 20,60 40,70 60,30 80,40 100,20" fill="none" stroke="currentColor" strokeWidth="2" />
                  <polyline points="0,90 20,85 40,88 60,70 80,75 100,50" fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
              </div>
              <div className="col-span-1 h-64 bg-[#141722] rounded-xl border border-white/5 p-5 space-y-4">
                <div className="h-10 bg-white/5 rounded-lg w-full flex items-center px-4"><div className="w-4 h-4 bg-yellow-500/50 rounded-full"/></div>
                <div className="h-10 bg-white/5 rounded-lg w-3/4 flex items-center px-4"><div className="w-4 h-4 bg-gray-500/50 rounded-full"/></div>
                <div className="h-10 bg-white/5 rounded-lg w-5/6 flex items-center px-4"><div className="w-4 h-4 bg-orange-500/50 rounded-full"/></div>
                <div className="h-10 bg-white/5 rounded-lg w-full flex items-center px-4"><div className="w-4 h-4 bg-red-500/50 rounded-full"/></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section Headers */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Who said telemetry <br />has to be boring?</h2>
          </div>
          <div className="max-w-md">
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              With PitStopEngine, managing your race data is effortless, empowering, and anything but boring. Our intuitive platform brings clarity to your race pace, simplifies strategy decisions, and puts the power of advanced data modeling right at your fingertips. 
              <br /><br />
              <strong className="text-white">Say no to spreadsheets and tools designed in the 90s.</strong>
            </p>
          </div>
        </div>

        <div className="mb-12">
           <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Everything you need. <br />Nothing you don't.</h2>
           <p className="text-gray-400 text-sm md:text-base">Race management and visibility in one place. Experience a <strong className="text-white">flexible toolkit</strong> that makes every session feel like a breeze.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">
          {/* Feature 1 */}
          <div className="md:col-span-1 row-span-1 bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20">
               <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Insights at your fingertips</h3>
            <p className="text-sm text-gray-400 mt-auto leading-relaxed">All your data and standings in one place to provide quick answers and make decisions instantly.</p>
          </div>

          {/* Feature 2 (Wide) */}
          <div className="md:col-span-2 row-span-1 bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col relative overflow-hidden shadow-xl group">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none group-hover:from-red-600/20 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Manage in real time</h3>
            <p className="text-sm text-gray-400 max-w-sm mt-auto leading-relaxed">Have full control of your driver telemetry on the go. Lap evolution charts and pace differentials rendered at 60fps.</p>
          </div>

          {/* Feature 3 (Wide) */}
          <div className="md:col-span-2 row-span-1 bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col relative overflow-hidden shadow-xl group">
             <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none group-hover:from-blue-600/20 transition-colors" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
              <RefreshCw className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Important business alerts</h3>
            <p className="text-sm text-gray-400 max-w-sm mt-auto leading-relaxed">Choose the alerts you need and receive them via SSE. Yellow flags, Safety Cars, and sector updates in real-time.</p>
          </div>

          {/* Feature 4 */}
          <div className="md:col-span-1 row-span-1 bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col shadow-xl">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">You're in control</h3>
            <p className="text-sm text-gray-400 mt-auto leading-relaxed">Lightning fast Spring Boot backend with full JWT Role-Based access control.</p>
          </div>
        </div>
      </section>

      {/* Meet Genius Section (AI Teaser) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
         <div className="mb-12">
           <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Genius</span></h2>
           <p className="text-gray-400 text-sm md:text-base max-w-2xl">Our AI-driven assistant is designed to decode complex telemetry figures and <strong className="text-white">illuminate key trends</strong> in your race pace.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[250px]">
           <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col shadow-xl">
             <h3 className="text-xl font-bold mb-2">Smart forecasting</h3>
             <p className="text-sm text-gray-400">Harness the power of predictive analytics to map out the tyre degradation future of your drivers.</p>
           </div>
           <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-colors flex flex-col shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />
             <h3 className="text-xl font-bold mb-2">Chat with Genius</h3>
             <p className="text-sm text-gray-400">Just ask. With Genius by your side, navigating the race strategy becomes intuitive and effortless.</p>
           </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 w-full bg-gradient-to-b from-transparent to-[#0a0a0a] py-32 text-center border-t border-white/5">
        <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none" />
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8">See where telemetry automation can <br className="hidden md:block" /> take your business.</h2>
        <p className="text-gray-400 mb-10">The first F1 tool you'll love. And the last one you'll ever need.</p>
        <Link 
          href="/dashboard"
          className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)]"
        >
          <span>Join the waitlist</span>
        </Link>
      </section>

      <footer className="text-center py-8 text-xs text-gray-600 border-t border-white/5 bg-[#050505] relative z-10">
        <p>© 2026 BatistaSec Technologies Inc. PitStopEngine is a project. All rights reserved.</p>
      </footer>
    </div>
  );
}
