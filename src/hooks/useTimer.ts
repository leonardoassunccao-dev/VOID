import { useState, useEffect, useRef, useCallback } from 'react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_TIMES: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function useTimer(isActive: boolean, initialMode: TimerMode = 'focus') {
  const [mode, setMode] = useState<TimerMode>(initialMode);
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES[initialMode]);
  const [isFinished, setIsFinished] = useState(false);
  const lastTickRef = useRef<number | null>(null);

  const resetTimer = useCallback((newMode?: TimerMode) => {
    const targetMode = newMode || mode;
    setMode(targetMode);
    setTimeLeft(MODE_TIMES[targetMode]);
    setIsFinished(false);
    lastTickRef.current = null;
  }, [mode]);

  useEffect(() => {
    if (!isActive) {
      lastTickRef.current = null;
      return;
    }

    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    lastTickRef.current = Date.now();
    
    const interval = setInterval(() => {
      const now = Date.now();
      const delta = lastTickRef.current ? Math.floor((now - lastTickRef.current) / 1000) : 0;
      
      if (delta >= 1) {
        setTimeLeft((prev) => {
          const next = prev - delta;
          return next < 0 ? 0 : next;
        });
        lastTickRef.current = now;
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTimeParts = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  return { 
    timeLeft, 
    timeParts: formatTimeParts(timeLeft), 
    mode, 
    setMode: resetTimer, 
    isFinished,
    reset: () => resetTimer()
  };
}
