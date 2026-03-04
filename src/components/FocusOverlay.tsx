import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTimer, TimerMode } from '../hooks/useTimer';
import { useFullscreen } from '../hooks/useFullscreen';
import { FlipCard } from './FlipCard';
import { MotivationalText } from './MotivationalText';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Volume2, Bell, Smartphone, X, RotateCcw, Coffee } from 'lucide-react';
import { initAudioUnlock, playEndTone } from '../services/audioService';

interface Props {
  onClose: () => void;
}

export function FocusOverlay({ onClose }: Props) {
  const [isActive, setIsActive] = useState(false);
  const { timeLeft, timeParts, mode, setMode, isFinished, reset } = useTimer(isActive);
  const { enterFullscreen, exitFullscreen } = useFullscreen(onClose);
  const [isIdle, setIsIdle] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const didAlertThisRun = useRef(false);
  const audioUnlocked = useRef(false);

  // Track elapsed seconds for quote rotation
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

  const handleStart = useCallback(() => {
    if (!audioUnlocked.current) {
      initAudioUnlock();
      audioUnlocked.current = true;
    }
    setIsActive(true);
    setSessionCompleted(false);
    didAlertThisRun.current = false;
  }, []);

  const handleReset = useCallback(() => {
    reset();
    setIsActive(false);
    setSessionCompleted(false);
    didAlertThisRun.current = false;
    setElapsedSeconds(0);
  }, [reset]);

  const handleModeChange = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setSessionCompleted(false);
    didAlertThisRun.current = false;
    setElapsedSeconds(0);
  }, [setMode]);

  useEffect(() => {
    if (isFinished && !didAlertThisRun.current) {
      didAlertThisRun.current = true;
      setSessionCompleted(true);
      setIsActive(false);

      if (soundEnabled) {
        playEndTone(volume);
      }

      if (vibrateEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([250, 100, 250]);
      }
    }
  }, [isFinished, soundEnabled, volume, vibrateEnabled]);

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
    { id: 'shortBreak', label: 'Short' },
    { id: 'longBreak', label: 'Long' },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#0B0B0B] flex flex-col items-center justify-between select-none transition-opacity duration-700 ${isIdle ? 'cursor-none' : 'cursor-default'}`}
      onTouchStart={handleTouchStart}
      onDoubleClick={exitFullscreen}
    >
      {/* Header */}
      <div className={`w-full px-8 pt-8 flex justify-between items-center transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <button 
          onClick={exitFullscreen}
          className="text-zinc-600 hover:text-zinc-400 text-[10px] tracking-[0.2em] uppercase transition-colors"
        >
          Sair do Vazio
        </button>
        
        <button 
          onClick={() => setShowSettings(true)}
          className="text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center space-y-8 md:space-y-12 w-full max-w-4xl relative">
        {/* Session Completed Toast */}
        <AnimatePresence>
          {sessionCompleted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 bg-[#1C1C1C] border border-zinc-800 p-1 rounded-2xl flex flex-col items-center shadow-2xl z-20 min-w-[200px]"
            >
              <div className="px-4 py-3 flex items-center space-x-3 w-full border-b border-zinc-800/50">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" />
                <span className="text-zinc-300 text-xs font-medium tracking-widest uppercase">Sessão concluída</span>
              </div>
              <div className="flex w-full">
                <button 
                  onClick={handleReset}
                  className="flex-1 py-3 text-[10px] tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors border-r border-zinc-800/50 flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={10} />
                  <span>Reiniciar</span>
                </button>
                <button 
                  onClick={() => handleModeChange('shortBreak')}
                  className="flex-1 py-3 text-[10px] tracking-widest uppercase text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <Coffee size={10} />
                  <span>Pausa</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <div className="flex space-x-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`px-4 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-300 rounded-full border ${
                  mode === m.id 
                    ? 'bg-[#EAEAEA] text-black border-[#EAEAEA]' 
                    : 'text-zinc-500 border-zinc-900 hover:border-zinc-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={() => isActive ? setIsActive(false) : handleStart()}
              className="w-16 h-16 rounded-full bg-[#1C1C1C] flex items-center justify-center group hover:bg-[#252525] transition-all duration-300 shadow-lg border border-zinc-800/50"
            >
              <AnimatePresence mode="wait">
                {!isActive ? (
                  <motion.div
                    key="play"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-[#EAEAEA] ml-1"
                  />
                ) : (
                  <motion.div
                    key="pause"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex space-x-1.5"
                  >
                    <div className="w-1.5 h-4 bg-[#EAEAEA] rounded-full" />
                    <div className="w-1.5 h-4 bg-[#EAEAEA] rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            
            <button
              onClick={handleReset}
              className="text-zinc-600 hover:text-zinc-400 text-[10px] tracking-widest uppercase transition-colors flex items-center space-x-2"
            >
              <RotateCcw size={12} />
              <span>Resetar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#141414] border border-zinc-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-zinc-300 text-xs tracking-[0.2em] uppercase font-bold">Configurações</h3>
                <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell size={16} className="text-zinc-500" />
                    <span className="text-zinc-400 text-sm">Som ao finalizar</span>
                  </div>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${soundEnabled ? 'bg-zinc-300' : 'bg-zinc-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${soundEnabled ? 'right-1 bg-black' : 'left-1 bg-zinc-600'}`} />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Volume2 size={16} className="text-zinc-500" />
                      <span className="text-zinc-400 text-sm">Volume</span>
                    </div>
                    <span className="text-zinc-600 text-xs">{Math.round(volume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                  />
                </div>

                {/* Vibrate Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone size={16} className="text-zinc-500" />
                    <span className="text-zinc-400 text-sm">Vibrar ao finalizar</span>
                  </div>
                  <button 
                    onClick={() => setVibrateEnabled(!vibrateEnabled)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${vibrateEnabled ? 'bg-zinc-300' : 'bg-zinc-800'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${vibrateEnabled ? 'right-1 bg-black' : 'left-1 bg-zinc-600'}`} />
                  </button>
                </div>
              </div>

              <div className="p-6 bg-zinc-900/50 border-t border-zinc-800">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs tracking-widest uppercase rounded-xl transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`pb-8 text-center space-y-1 transition-opacity duration-500 ${isIdle ? 'opacity-0' : 'opacity-100'}`}>
        <p className="text-zinc-700 text-[10px] tracking-[0.3em] uppercase">2026 VOID</p>
        <p className="text-zinc-800 text-[9px] tracking-widest">criado por Leonardo Assunção</p>
      </footer>
    </div>
  );
}



