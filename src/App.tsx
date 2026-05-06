import React, { useState } from 'react';
import { FocusOverlay } from './components/FocusOverlay';
import { motion } from 'motion/react';

export default function App() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-between text-[#EAEAEA] selection:bg-zinc-800 overflow-hidden relative font-sans">
      {/* Subtle Vertical Gradient & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />

      <div /> {/* Spacer for vertical centering */}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-12 z-10"
      >
        <div className="space-y-4 flex flex-col items-center">
          <h1 className="text-7xl md:text-8xl font-bold tracking-[0.25em] text-[#EAEAEA] font-display">VOID</h1>
          <div className="w-24 h-[1px] bg-[#BFA76F] opacity-60" />
          <p className="text-[#9CA3AF] text-xs md:text-sm font-light tracking-[0.1em]">
            Control. Discipline. Legacy.
          </p>
        </div>
        
        <button
          onClick={() => setIsFocusMode(true)}
          className="group relative px-10 py-4 bg-[#1A1A1D] text-[#BFA76F] font-medium uppercase tracking-[0.15em] text-xs border border-[#BFA76F]/30 rounded-[10px] transition-all duration-500 hover:border-[#BFA76F] hover:shadow-[0_0_20px_rgba(191,167,111,0.15)]"
        >
          Enter Executive Mode
        </button>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.2, duration: 2 }}
        className="pb-10 text-center space-y-1 z-10"
      >
        <p className="text-[#BFA76F] text-[10px] tracking-[0.3em] uppercase">2026 VOID</p>
        <p className="text-[#BFA76F] text-[9px] tracking-widest">Created by Leonardo Assunção</p>
      </motion.footer>

      {isFocusMode && <FocusOverlay onClose={() => setIsFocusMode(false)} />}
    </div>
  );
}
