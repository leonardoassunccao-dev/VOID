import { useState, useEffect, useCallback, useRef } from 'react';

export function useFullscreen(onExit: () => void) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const onExitRef = useRef(onExit);
  const pushedStateRef = useRef(false);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  const enterFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen API not supported or blocked", err);
    }
    setIsFullscreen(true);
    
    // Push state for mobile back button interception
    window.history.pushState({ focus: true }, '');
    pushedStateRef.current = true;
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Exit fullscreen failed", err);
    }
    
    setIsFullscreen(false);
    onExitRef.current();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        // User exited via ESC
        if (pushedStateRef.current) {
          window.history.back();
          pushedStateRef.current = false;
        }
        setIsFullscreen(false);
        onExitRef.current();
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isFullscreen) {
        pushedStateRef.current = false;
        exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFullscreen, exitFullscreen]);

  // Expose a method to exit that also goes back in history
  const manualExit = useCallback(() => {
    if (pushedStateRef.current) {
      window.history.back();
      pushedStateRef.current = false;
    }
    exitFullscreen();
  }, [exitFullscreen]);

  return { isFullscreen, enterFullscreen, exitFullscreen: manualExit };
}
