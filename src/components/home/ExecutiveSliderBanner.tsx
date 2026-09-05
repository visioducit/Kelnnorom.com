import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { useCms } from '@/lib/cms-store';
import { cn } from '@/lib/utils';

export function ExecutiveSliderBanner() {
  const { state } = useCms();
  const activeBanners = state.sliderBanners
    .filter((b) => b.active)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalSlides = activeBanners.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay effect
  useEffect(() => {
    if (isPlaying && !isHovered && totalSlides > 1) {
      timerRef.current = window.setInterval(() => {
        nextSlide();
      }, 6000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isHovered, nextSlide, totalSlides, currentIndex]);

  if (totalSlides === 0) return null;

  const currentSlide = activeBanners[currentIndex];

  return (
    <section
      className="relative border-b border-[var(--border)] bg-[var(--background)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Executive Operating Portfolio Showcase"
    >
      {/* Background Image Stage with Gradient Vignette */}
      <div className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Image Transition */}
        {activeBanners.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            )}
            style={{
              backgroundImage: `url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Multi-layered darkened overlay for readability */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0d121fe6] to-[#0a0d14bf]"
              style={{
                backgroundColor: 'rgba(10, 13, 20, 0.88)',
                backdropFilter: 'blur(2px)',
              }}
            />
            {/* Tech grid texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-10 max-w-content mx-auto container-px py-12 lg:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Main Pitch & Metadata */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              {/* Badge & Slide Counter */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)]/90 border border-[var(--accent-gold)]/40 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                    {currentSlide.eyebrow}
                  </span>
                </div>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[var(--surface-elevated)]/80 text-[var(--muted)] border border-[var(--border)]">
                  {currentSlide.badgeText}
                </span>

                <span className="text-xs font-mono text-[var(--muted)] ml-auto hidden sm:inline-block">
                  0{currentIndex + 1} / 0{totalSlides}
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.12] mb-4">
                {currentSlide.title}{' '}
                <span className="text-[var(--accent-gold)] block sm:inline">
                  — {currentSlide.headlineHighlight}
                </span>
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-3xl mb-6">
                {currentSlide.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {currentSlide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-slate-200 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={currentSlide.primaryCtaLink}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--accent-gold)]/20"
                >
                  <span>{currentSlide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {currentSlide.secondaryCtaLink && (
                  <Link
                    to={currentSlide.secondaryCtaLink}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
                  >
                    <span>{currentSlide.secondaryCtaText}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Signature Metric Card */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="relative p-6 sm:p-8 rounded-xl bg-gradient-to-b from-[#161c2d]/90 to-[#0f1422]/95 border border-[var(--accent-gold)]/30 backdrop-blur-md shadow-2xl">
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-xl pointer-events-none">
                  <div className="absolute transform rotate-45 bg-[var(--accent-gold)]/20 text-center text-[9px] font-bold py-1 right-[-35px] top-[18px] w-[120px] border-b border-[var(--accent-gold)]/30" />
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)] mb-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>Key Operating Outcome</span>
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 font-mono">
                  {currentSlide.metricValue}
                </div>

                <div className="text-sm font-semibold text-slate-200 mb-1">
                  {currentSlide.metricLabel}
                </div>

                {currentSlide.metricContext && (
                  <div className="text-xs text-slate-400 font-mono border-t border-white/10 pt-3 mt-3">
                    {currentSlide.metricContext}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Verified System Record
                  </span>
                  <Link
                    to="/executive-brief"
                    className="text-[var(--accent-gold)] hover:underline font-medium"
                  >
                    View Brief →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls & Navigation Strip */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Quick-select Thumbnail / Pillar Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {activeBanners.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'text-left px-3 py-2 rounded-lg text-xs transition-all border shrink-0',
                    index === currentIndex
                      ? 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] font-bold shadow-md'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                  )}
                  aria-label={`Switch to slide ${index + 1}: ${slide.title}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] opacity-75">0{index + 1}</span>
                    <span className="truncate max-w-[130px] sm:max-w-[180px]">{slide.category}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Slider Playback & Arrow Controls */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Play/Pause Button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                title={isPlaying ? 'Pause auto-slider' : 'Start auto-slider'}
                aria-label={isPlaying ? 'Pause slider' : 'Play slider'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {/* Prev Button */}
              <button
                onClick={prevSlide}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[var(--accent-gold)] transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5 px-2">
                {activeBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === currentIndex
                        ? 'w-6 bg-[var(--accent-gold)]'
                        : 'w-2 bg-white/30 hover:bg-white/50'
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-[var(--accent-gold)] transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Admin quick customize button */}
              <Link
                to="/admin/sliders"
                className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-[var(--accent-gold)] ml-3 pl-3 border-l border-white/10 transition-colors"
                title="CMS Slider Controls"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>CMS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
