import React, { useEffect, useRef, useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { AdPlacementPosition, AdCampaign } from '@/types/ads';
import { ExternalLink, Sparkles, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogAdUnitProps {
  placement: AdPlacementPosition;
  category?: string;
  postSlug?: string;
  className?: string;
  customFallback?: React.ReactNode;
}

export const BlogAdUnit: React.FC<BlogAdUnitProps> = ({
  placement,
  category,
  postSlug,
  className = '',
  customFallback = null,
}) => {
  const { getServedAd, trackAdImpression, trackAdClick } = useCms();
  const [ad, setAd] = useState<AdCampaign | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [hasImpressionFired, setHasImpressionFired] = useState(false);
  const unitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const served = getServedAd(placement, category, postSlug);
    setAd(served);
    setHasImpressionFired(false);
    setDismissed(false);
  }, [placement, category, postSlug, getServedAd]);

  useEffect(() => {
    if (!ad || hasImpressionFired) return;

    const currentRef = unitRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasImpressionFired) {
          trackAdImpression(ad.id, placement, postSlug);
          setHasImpressionFired(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [ad, hasImpressionFired, placement, postSlug, trackAdImpression]);

  if (dismissed || !ad) {
    return customFallback ? <>{customFallback}</> : null;
  }

  const handleClick = () => {
    trackAdClick(ad.id, placement, postSlug);
  };

  // 1. Header Top Announcement Bar
  if (placement === 'header_top_banner') {
    return (
      <div
        ref={unitRef}
        id={`ad-banner-${ad.id}`}
        className={`relative bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border-b border-primary-500/20 py-2.5 px-4 text-xs ${className}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-accent-500/20 text-accent-400 border border-accent-500/30 shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              {ad.badgeText || 'SPONSORED'}
            </span>
            <p className="font-medium text-slate-200 truncate">
              <span className="text-white font-semibold">{ad.advertiser}:</span> {ad.headline}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {ad.ctaUrl.startsWith('/') ? (
              <Link
                to={ad.ctaUrl}
                onClick={handleClick}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold rounded text-xs transition-colors shadow-sm"
              >
                {ad.ctaText || 'Learn More'}
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-navy-950 font-semibold rounded text-xs transition-colors shadow-sm"
              >
                {ad.ctaText || 'Learn More'}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="text-slate-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Feed Card (Inside Blog Listing Grid)
  if (placement === 'feed_card') {
    return (
      <div
        ref={unitRef}
        id={`ad-feed-card-${ad.id}`}
        className={`group relative flex flex-col justify-between bg-gradient-to-br from-slate-900 via-navy-950 to-slate-950 text-white rounded-xl border border-primary-500/30 p-6 shadow-xl transition-all duration-300 hover:border-accent-500/50 hover:shadow-2xl hover:shadow-accent-500/10 ${className}`}
      >
        <div>
          {/* Sponsor Tag Header */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              {ad.companyLogoUrl ? (
                <img
                  src={ad.companyLogoUrl}
                  alt={ad.advertiser}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center text-[10px] font-bold text-accent-400">
                  {ad.advertiser.charAt(0)}
                </div>
              )}
              <span className="text-xs font-mono font-medium text-slate-300 tracking-wide uppercase">
                {ad.advertiser}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-accent-500/15 text-accent-400 border border-accent-500/30">
              {ad.badgeText || 'PARTNER SPOTLIGHT'}
            </span>
          </div>

          {/* Ad Image if present */}
          {ad.imageUrl && (
            <div className="relative mb-4 overflow-hidden rounded-lg aspect-video max-h-44 bg-navy-900/60 border border-white/10">
              <img
                src={ad.imageUrl}
                alt={ad.headline}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
            </div>
          )}

          {/* Headline */}
          <h3 className="text-lg font-serif font-bold text-white mb-2.5 leading-snug group-hover:text-accent-300 transition-colors">
            {ad.headline}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
            {ad.description}
          </p>
        </div>

        {/* CTA footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Verified Sponsor
          </span>
          {ad.ctaUrl.startsWith('/') ? (
            <Link
              to={ad.ctaUrl}
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-lg text-xs transition-all shadow-md active:scale-95"
            >
              {ad.ctaText || 'Access Briefing'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <a
              href={ad.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-lg text-xs transition-all shadow-md active:scale-95"
            >
              {ad.ctaText || 'Access Resource'}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // 3. In-Article Inline Native Callout (situated inside essay reading flow)
  if (placement === 'in_article_inline') {
    return (
      <div
        ref={unitRef}
        id={`ad-inline-${ad.id}`}
        className={`my-10 p-6 md:p-8 rounded-xl bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 border border-accent-500/30 text-white shadow-xl relative overflow-hidden not-prose ${className}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-accent-500/20 text-accent-400 border border-accent-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                {ad.badgeText || 'STRATEGIC BRIEFING'}
              </span>
              <span className="text-xs font-mono text-slate-400">Sponsored by {ad.advertiser}</span>
            </div>

            <h4 className="text-xl font-serif font-bold text-white mb-2 leading-snug">
              {ad.headline}
            </h4>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {ad.description}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {ad.ctaUrl.startsWith('/') ? (
              <Link
                to={ad.ctaUrl}
                onClick={handleClick}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-lg text-sm transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                {ad.ctaText || 'Download Framework'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-lg text-sm transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                {ad.ctaText || 'Explore Platform'}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Sticky Sidebar Widget (in Article Detail Page)
  if (placement === 'sidebar_sticky') {
    return (
      <div
        ref={unitRef}
        id={`ad-sidebar-${ad.id}`}
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-md ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
            {ad.badgeText || 'PARTNER RESOURCE'}
          </span>
          <span className="text-[10px] font-mono text-slate-400">{ad.advertiser}</span>
        </div>

        {ad.imageUrl && (
          <div className="relative mb-3.5 overflow-hidden rounded-lg aspect-[16/9] bg-slate-100 dark:bg-slate-800">
            <img
              src={ad.imageUrl}
              alt={ad.headline}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h5 className="font-serif font-bold text-slate-900 dark:text-white text-sm mb-2 leading-snug">
          {ad.headline}
        </h5>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {ad.description}
        </p>

        {ad.ctaUrl.startsWith('/') ? (
          <Link
            to={ad.ctaUrl}
            onClick={handleClick}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-navy-950 hover:bg-navy-900 text-white dark:bg-accent-500 dark:hover:bg-accent-600 dark:text-navy-950 font-semibold rounded-lg text-xs transition-colors"
          >
            {ad.ctaText || 'Learn More'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <a
            href={ad.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-navy-950 hover:bg-navy-900 text-white dark:bg-accent-500 dark:hover:bg-accent-600 dark:text-navy-950 font-semibold rounded-lg text-xs transition-colors"
          >
            {ad.ctaText || 'Learn More'}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    );
  }

  // 5. In-Article Bottom Conversion Unit
  if (placement === 'in_article_bottom') {
    return (
      <div
        ref={unitRef}
        id={`ad-bottom-${ad.id}`}
        className={`my-12 p-8 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-primary-500/40 text-white shadow-2xl relative overflow-hidden not-prose ${className}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-accent-500/20 text-accent-400 border border-accent-500/30">
              <Sparkles className="w-3 h-3" />
              {ad.badgeText || 'EXECUTIVE ADVISORY'}
            </div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
              {ad.headline}
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
              {ad.description}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {ad.ctaUrl.startsWith('/') ? (
              <Link
                to={ad.ctaUrl}
                onClick={handleClick}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-xl text-base transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                {ad.ctaText || 'Schedule Briefing'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-xl text-base transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                {ad.ctaText || 'Visit Sponsor'}
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback default format
  return null;
};
