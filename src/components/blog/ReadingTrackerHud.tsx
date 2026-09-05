import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Gauge,
  Maximize2,
  Minimize2,
  CheckCircle,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { useCms } from '@/lib/cms-store';

interface ReadingTrackerHudProps {
  slug: string;
  wordCount: number;
  onZenModeToggle?: (isZen: boolean) => void;
  onComplete?: () => void;
}

export type ReadingPace = 'skim' | 'standard' | 'deep';

export function ReadingTrackerHud({
  slug,
  wordCount = 1000,
  onZenModeToggle,
  onComplete,
}: ReadingTrackerHudProps) {
  const { recordReadingSession, recordReadComplete } = useCms();

  const [activeSeconds, setActiveSeconds] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxScrollDepth, setMaxScrollDepth] = useState(0);
  const [pace, setPace] = useState<ReadingPace>('standard');
  const [isZenMode, setIsZenMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedTriggered, setCompletedTriggered] = useState(false);

  const isTabActiveRef = useRef(true);
  const activeSecondsRef = useRef(0);
  const maxScrollRef = useRef(0);

  // Speed coefficients (words per minute)
  const paceWpm: Record<ReadingPace, number> = {
    skim: 320,
    standard: 220,
    deep: 150,
  };

  const totalEstimatedSeconds = Math.max(30, Math.round((wordCount / paceWpm[pace]) * 60));
  const remainingSeconds = Math.max(
    0,
    Math.round(totalEstimatedSeconds * (1 - scrollProgress / 100))
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  // Visibility and Active Focus Tracking
  useEffect(() => {
    const handleVisibility = () => {
      isTabActiveRef.current = document.visibilityState === 'visible';
    };
    const handleFocus = () => {
      isTabActiveRef.current = true;
    };
    const handleBlur = () => {
      isTabActiveRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    const interval = setInterval(() => {
      if (isTabActiveRef.current) {
        setActiveSeconds((prev) => {
          const next = prev + 1;
          activeSecondsRef.current = next;
          return next;
        });
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      clearInterval(interval);
    };
  }, []);

  // Scroll Tracking & Completion Trigger
  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const currentScroll = window.scrollY;
    const pct = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));

    setScrollProgress(pct);
    if (pct > maxScrollRef.current) {
      maxScrollRef.current = pct;
      setMaxScrollDepth(pct);
    }

    if (pct >= 85 && !completedTriggered) {
      setCompletedTriggered(true);
      recordReadComplete(slug, document.title || slug);
      if (onComplete) onComplete();
    }
  }, [completedTriggered, onComplete, recordReadComplete, slug]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Telemetry commit on unmount / page leave
  useEffect(() => {
    const commitSession = () => {
      if (activeSecondsRef.current > 5) {
        recordReadingSession(slug, activeSecondsRef.current, maxScrollRef.current);
      }
    };

    window.addEventListener('beforeunload', commitSession);
    return () => {
      window.removeEventListener('beforeunload', commitSession);
      commitSession();
    };
  }, [slug, recordReadingSession]);

  const toggleZen = () => {
    const next = !isZenMode;
    setIsZenMode(next);
    if (onZenModeToggle) onZenModeToggle(next);
  };

  return (
    <>
      {/* Top Scroll Indicator Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-black/10 backdrop-blur-xs">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent-gold)] via-amber-400 to-amber-200 transition-all duration-150 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Active Reading Telemetry HUD Pill */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
        <div className="bg-[var(--surface-elevated)]/95 backdrop-blur-md border border-[var(--border)] rounded-2xl shadow-xl transition-all duration-200 overflow-hidden text-[var(--foreground)]">
          {/* Collapsed/Primary Pill Bar */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 select-none">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--accent-gold)] font-bold">
              <Activity size={14} className="animate-pulse text-[var(--accent-gold)]" />
              <span>{scrollProgress}% Read</span>
            </div>

            <div className="h-3 w-px bg-[var(--border)]" />

            <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--muted)]">
              <Clock size={12} />
              <span>
                {remainingSeconds === 0 ? 'Completed' : `~${formatTime(remainingSeconds)} left`}
              </span>
            </div>

            <div className="h-3 w-px bg-[var(--border)]" />

            {/* Zen Mode Switch */}
            <button
              onClick={toggleZen}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isZenMode
                  ? 'bg-[var(--accent-gold)] text-black font-bold'
                  : 'hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
              title={isZenMode ? 'Exit Zen Focus Mode' : 'Enter Zen Focus Mode (Distraction-Free)'}
              aria-label="Toggle Zen Focus Mode"
            >
              {isZenMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            {/* Expand Controls Drawer Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="Adjust Reading Speed & Telemetry"
              aria-label="Reading Options"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Expanded Drawer Details */}
          {isExpanded && (
            <div className="p-3.5 border-t border-[var(--border)] bg-[var(--surface)]/90 space-y-3 min-w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-150">
              {/* Reading Pace Selector */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-[var(--muted)] mb-1.5">
                  <span className="flex items-center gap-1">
                    <Gauge size={11} className="text-[var(--accent-gold)]" />
                    Reading Pace
                  </span>
                  <span className="text-[var(--accent-gold)]">{paceWpm[pace]} WPM</span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-[var(--surface-elevated)] p-1 rounded-xl border border-[var(--border)]">
                  {(['skim', 'standard', 'deep'] as ReadingPace[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPace(p)}
                      className={`py-1 text-[10px] font-mono font-bold capitalize rounded-lg transition-all cursor-pointer ${
                        pace === p
                          ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Granular Active Telemetry Stats */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[var(--muted)] bg-[var(--surface-elevated)] p-2 rounded-xl border border-[var(--border)]">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)]">Active Time</span>
                  <strong className="text-xs text-[var(--foreground)]">{formatTime(activeSeconds)}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)]">Est. Length</span>
                  <strong className="text-xs text-[var(--foreground)]">{formatTime(totalEstimatedSeconds)}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)]">Word Count</span>
                  <strong className="text-xs text-[var(--foreground)]">{wordCount.toLocaleString()}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[var(--muted)]">Max Scroll</span>
                  <strong className="text-xs text-[var(--foreground)]">{maxScrollDepth}%</strong>
                </div>
              </div>

              {completedTriggered && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                  <CheckCircle size={13} />
                  <span>Briefing Completed & Logged</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
