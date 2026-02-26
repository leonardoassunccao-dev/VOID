import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  value: string;
  label?: string;
}

export function FlipCard({ value }: Props) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-20 h-28 md:w-32 md:h-44 bg-[#1C1C1C] rounded-[12px] shadow-2xl overflow-hidden flex flex-col">
        {/* Top Half */}
        <div className="absolute inset-0 flex flex-col">
          <div className="h-1/2 w-full border-b border-black/20" />
          <div className="h-1/2 w-full bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Numbers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="text-[#EAEAEA] font-bold tabular-nums leading-none select-none"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)' }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Middle Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40 z-10" />
      </div>
    </div>
  );
}
