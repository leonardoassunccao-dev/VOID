import React, { useState } from 'react';
import { FocusOverlay } from './components/FocusOverlay';

export default function App() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-between text-[#F5F5F5] selection:bg-zinc-800 overflow-hidden relative font-sans">
      {/* Background Layers - Static */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-0 opacity-[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)] pointer-events-none z-0" />
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-0" />

      <div /> {/* Top Spacer */}

      <div className="max-w-xl w-full px-8 flex flex-col items-center text-center space-y-16 z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-[60px] md:text-[130px] font-display font-light tracking-[0.05em] text-white drop-shadow-[0_15px_40px_rgba(255,255,255,0.08)] leading-[1.1]">
            VOID
          </h1>
          
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C29F6B] to-transparent mt-4 mb-12 w-[160px] opacity-30" />

          <p className="text-[#D1D5DB] text-[10px] md:text-[12px] font-light tracking-[0.6em] uppercase opacity-40">
            Focus. Discipline. Legacy.
          </p>
        </div>
        
        <button
          onClick={() => setIsFocusMode(true)}
          className="group relative px-16 py-6 bg-transparent text-[#C29F6B] font-light uppercase tracking-[0.4em] text-[10px] border border-[#C1A06B]/20 rounded-full transition-all duration-700 hover:border-[#C1A06B]/60 hover:shadow-[0_0_50px_rgba(193,160,107,0.2)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10 hover:text-[#F1E0C5] transition-colors duration-500">Enter Executive Mode</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="pb-12 text-center space-y-1.5 z-10 opacity-[0.08]">
        <p className="text-[#F5F5F5] text-[9px] tracking-[0.5em] uppercase font-light">2026 VOID</p>
        <p className="text-[#F5F5F5] text-[8px] tracking-[0.3em] font-light">Created by Leonardo Assunção</p>
      </footer>

      {isFocusMode && <FocusOverlay onClose={() => setIsFocusMode(false)} />}
    </div>
  );
}
