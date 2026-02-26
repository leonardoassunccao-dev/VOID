import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QUOTES, Quote } from '../constants/quotes';

interface Props {
  elapsedSeconds: number;
}

export function MotivationalText({ elapsedSeconds }: Props) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [shuffledQuotes, setShuffledQuotes] = useState<Quote[]>([]);
  const lastPeriodRef = useRef(0);

  useEffect(() => {
    // Shuffle quotes on mount
    const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
    setShuffledQuotes(shuffled);
  }, []);

  useEffect(() => {
    // Change every 5 minutes (300 seconds)
    const period = Math.floor(elapsedSeconds / 300);
    
    if (period > lastPeriodRef.current && shuffledQuotes.length > 0) {
      lastPeriodRef.current = period;
      setQuoteIndex((prev) => (prev + 1) % shuffledQuotes.length);
      
      // Vibrate on mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
  }, [elapsedSeconds, shuffledQuotes]);

  if (shuffledQuotes.length === 0) return null;

  const currentQuote = shuffledQuotes[quoteIndex];

  return (
    <div className="h-32 flex flex-col items-center justify-center text-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="space-y-3"
        >
          <p className="text-[#EAEAEA] text-lg md:text-xl font-medium tracking-wide leading-relaxed max-w-2xl">
            “{currentQuote.text}”
          </p>
          <p className="text-zinc-600 text-xs md:text-sm tracking-[0.2em] uppercase font-bold">
            {currentQuote.author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
