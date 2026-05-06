import React, { useState } from 'react';
import { FocusOverlay } from './components/FocusOverlay';
import { motion } from 'motion/react';

export default function App() {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const cinematicEase = [0.22, 1, 0.36, 1];

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-between text-[#F5F5F5] selection:bg-zinc-800 overflow-hidden relative font-sans">
      {/* Background Layers */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-grain pointer-events-none z-0" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: cinematicEase }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04)_0%,_transparent_70%)] pointer-events-none z-0" 
      />
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,1)] pointer-events-none z-0" />

      <div /> {/* Top Spacer */}

      <div className="max-w-xl w-full px-8 flex flex-col items-center text-center space-y-16 z-10">
        <div className="flex flex-col items-center relative">
          {/* Subtle horizontal light beam sweep */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1.5, 0], opacity: [0, 0.15, 0] }}
            transition={{ delay: 0.5, duration: 2.5, ease: cinematicEase }}
            className="absolute top-[40%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] z-0 pointer-events-none"
          />

          <div className="flex items-center space-x-2 md:space-x-4 mb-4 relative z-10">
            {[
              { char: 'V', x: -30, y: 0, delay: 0.35 },
              { char: 'O', x: 0, y: 30, delay: 0.5 },
              { char: 'I', x: 0, y: -30, delay: 0.65 },
              { char: 'D', x: 30, y: 0, delay: 0.8 }
            ].map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: item.x, y: item.y, filter: 'blur(12px)', scale: 0.96 }}
                animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)', scale: 1 }}
                transition={{ 
                  delay: item.delay, 
                  duration: 0.8, 
                  ease: cinematicEase,
                }}
                className="text-[60px] md:text-[130px] font-display font-light tracking-[0.02em] text-white selection:text-[#C29F6B] drop-shadow-[0_15px_40px_rgba(255,255,255,0.05)] leading-none inline-block"
              >
                {item.char}
              </motion.span>
            ))}
          </div>
          
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "160px", opacity: 0.3 }}
            transition={{ delay: 1.5, duration: 1.2, ease: cinematicEase }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#C29F6B] to-transparent mb-10"
          />

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 2, duration: 1, ease: cinematicEase }}
            className="text-[#D1D5DB] text-[10px] md:text-[12px] font-light tracking-[0.6em] uppercase"
          >
            Focus. Discipline. Legacy.
          </motion.p>
        </div>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1.2, ease: cinematicEase }}
          onClick={() => setIsFocusMode(true)}
          className="group relative px-16 py-6 bg-transparent text-[#C29F6B] font-light uppercase tracking-[0.4em] text-[10px] border border-[#C1A06B]/20 rounded-full transition-all duration-700 hover:border-[#C1A06B]/60 hover:shadow-[0_0_50px_rgba(193,160,107,0.2)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
          <span className="relative z-10 transition-colors duration-500 group-hover:text-[#F1E0C5]">Enter Executive Mode</span>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 2.2, duration: 2 }}
        className="pb-12 text-center space-y-1.5 z-10"
      >
        <p className="text-[#F5F5F5] text-[9px] tracking-[0.5em] uppercase font-light">2026 VOID</p>
        <p className="footer-signature-animation text-[#F5F5F5] text-[8px] tracking-[0.3em] font-light">Created by Leonardo Assunção</p>
      </motion.footer>

      {isFocusMode && <FocusOverlay onClose={() => setIsFocusMode(false)} />}
    </div>
  );
}
