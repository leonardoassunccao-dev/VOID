import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTimer, TimerMode } from '../hooks/useTimer';
import { useFullscreen } from '../hooks/useFullscreen';
import { FlipCard } from './FlipCard';
import { MotivationalText } from './MotivationalText';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onClose: () => void;
}

export function FocusOverlay({ onClose }: Props) {
  const [isActive, setIsActive] = useState(true);
  const { timeLeft, timeParts, mode, setMode, isFinished, reset } = useTimer(isActive);
  const { enterFullscreen, exitFullscreen } = useFullscreen(onClose);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  // Track elapsed seconds for quote rotation (independent of countdown)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Sound generation using Web Audio API
  const playFinishSound = useCallback(() => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5); // A5

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  }, []);

  useEffect(() => {
    if (isFinished) {
      playFinishSound();
      setIsActive(false);
    }
  }, [isFinished, playFinishSound]);

  useEffect(() => {
    enterFullscreen();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [enterFullscreen]);

  useEffect(() => {
    const resetIdleTimer = () => {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 3000);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const handleTouchStart = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) exitFullscreen();
    lastTapRef.current = now;
  };

  const modes: { id: TimerMode; label: string }[] = [
    { id: 'focus', label: 'Focus' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#0B0B0B] flex flex-col items-center justify-between select-none transition-opacity duration-700 ${isIdle ? 'cursor-none' : 'cursor-default'}`}
      onTouchStart={handleTouchStart}
      onDoubleClick={exitFullscreen}
    >
      {/* Header / Exit Hint */}
      <div className={`pt-8 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <button 
          onClick={exitFullscreen}
          className="text-zinc-600 hover:text-zinc-400 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          Sair do Vazio
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center space-y-8 md:space-y-12 w-full max-w-4xl">
        {/* Flip Clock */}
        <div className="flex items-center space-x-3 md:space-x-6">
          <FlipCard value={timeParts.hours} />
          <span className="text-[#EAEAEA] text-4xl md:text-6xl font-light opacity-30 pb-4">:</span>
          <FlipCard value={timeParts.minutes} />
          <span className="text-[#EAEAEA] text-4xl md:text-6xl font-light opacity-30 pb-4">:</span>
          <FlipCard value={timeParts.seconds} />
        </div>

        {/* Motivational Text */}
        <MotivationalText elapsedSeconds={elapsedSeconds} />

        {/* Controls */}
        <div className={`flex flex-col items-center space-y-8 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex space-x-4">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id);
                  setElapsedSeconds(0);
                }}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 rounded-full border ${
                  mode === m.id 
                    ? 'bg-[#EAEAEA] text-black border-[#EAEAEA]' 
                    : 'text-zinc-500 border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsActive(!isActive)}
              className="w-16 h-16 rounded-full bg-[#1C1C1C] flex items-center justify-center group hover:bg-[#252525] transition-all duration-300 shadow-lg"
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] ${isActive ? 'border-l-zinc-400' : 'border-l-[#EAEAEA]'} ${isActive ? 'hidden' : 'block'} ml-1`}
              />
              {isActive && (
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-4 bg-[#EAEAEA] rounded-full" />
                  <div className="w-1.5 h-4 bg-[#EAEAEA] rounded-full" />
                </div>
              )}
            </button>
            
            <button
              onClick={() => {
                reset();
                setElapsedSeconds(0);
              }}
              className="text-zinc-600 hover:text-zinc-400 text-[10px] tracking-widest uppercase transition-colors"
            >
              Resetar
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`pb-8 text-center space-y-1 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase">2026 VOID</p>
        <p className="text-zinc-800 text-[9px] tracking-widest">criado por Leonardo Assunção</p>
      </footer>
    </div>
  );
}


