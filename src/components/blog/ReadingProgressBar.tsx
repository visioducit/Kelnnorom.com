import { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  onComplete?: () => void;
}

export function ReadingProgressBar({ onComplete }: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentScroll = window.scrollY;
      const pct = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setProgress(pct);

      if (pct >= 85 && !hasCompleted) {
        setHasCompleted(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasCompleted, onComplete]);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/10 backdrop-blur-xs">
      <div
        className="h-full bg-gradient-to-r from-[var(--accent-gold)] to-amber-300 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
