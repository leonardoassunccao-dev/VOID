import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  value: string;
  isGigantic?: boolean;
}

export function FlipCard({ value, isGigantic = false }: Props) {
  return (
    <div className="relative flex flex-col items-center group transition-all duration-1000">
      <div 
        className={`relative ${
          isGigantic 
            ? 'w-[clamp(120px,18vw,320px)] h-[clamp(150px,23vw,400px)]' 
            : 'w-24 h-34 md:w-40 md:h-56'
        } bg-[#0A0A0A] rounded-[16px] md:rounded-[24px] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/10 transition-all duration-1000`}
      >
        {/* Reflection/Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-20" />
        
        {/* Top Half Shade */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-10" />
        
        {/* Bottom Half Shade */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />

        {/* Numbers Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: '10%', rotateX: -90, opacity: 0, filter: 'blur(12px)' }}
              animate={{ y: '0%', rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-10%', rotateX: 90, opacity: 0, filter: 'blur(12px)' }}
              transition={{ 
                duration: 0.8, 
                ease: [0.19, 1, 0.22, 1] 
              }}
              className="text-[#F5F5F5] font-bold tabular-nums leading-none select-none drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] text-center flex items-center justify-center"
              style={{ 
                fontSize: isGigantic 
                  ? 'clamp(3rem, 10.5vw, 12rem)' 
                  : 'clamp(2.5rem, 8vw, 5.5rem)',
                width: '100%',
                height: '100%'
              }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Middle Line Separator */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.03)] z-30" />
      </div>
    </div>
  );
}
