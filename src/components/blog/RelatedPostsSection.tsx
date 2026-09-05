import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Eye,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';
import type { Insight } from '@/types/content';
import { getRelatedInsights, type RecommendedPostMatch } from '@/lib/blog-recommendations';

interface RelatedPostsSectionProps {
  currentInsight: Insight;
  allInsights: Insight[];
}

export function RelatedPostsSection({
  currentInsight,
  allInsights,
}: RelatedPostsSectionProps) {
  const recommendations: RecommendedPostMatch[] = getRelatedInsights(
    currentInsight,
    allInsights,
    3
  );

  const [previewInsight, setPreviewInsight] = useState<Insight | null>(null);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kel_nnorom_reading_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('kel_nnorom_reading_queue', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  if (recommendations.length === 0) return null;

  return (
    <>
      <div className="my-14 pt-10 border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-gold)] mb-1">
              <Sparkles size={13} className="text-[var(--accent-gold)]" />
              <span>THEMATIC CONTINUATION</span>
            </div>
            <h3 className="text-2xl font-bold font-['Inter_Tight',sans-serif] tracking-tight text-[var(--foreground)]">
              Recommended Executive Briefings
            </h3>
          </div>
          <Link
            to="/insights"
            className="text-xs font-mono text-[var(--accent-gold)] hover:underline flex items-center gap-1 font-bold shrink-0"
          >
            <span>Explore All Perspectives</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map(({ insight, matchPercentage, matchReasons }) => {
            const isBookmarked = bookmarkedSlugs.includes(insight.slug);

            return (
              <div
                key={insight.slug}
                className="group relative rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
              >
                <div className="p-6 flex flex-col flex-1">
                  {/* Match Relevancy Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 text-[var(--accent-gold)] text-[10px] font-mono font-bold">
                      <Compass size={11} />
                      <span>{matchPercentage}% Match</span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(insight.slug, e)}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-[var(--accent-gold)] bg-[var(--accent-gold)]/10'
                          : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
                      }`}
                      title={isBookmarked ? 'Saved to Reading Queue' : 'Save to Reading Queue'}
                      aria-label="Bookmark post"
                    >
                      {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    </button>
                  </div>

                  {/* Primary Topic Reason */}
                  <div className="text-[10px] font-mono text-[var(--muted)] uppercase font-semibold mb-2">
                    {matchReasons[0] || insight.category}
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-2.5 line-clamp-2 leading-snug">
                    <Link to={`/insights/${insight.slug}`} className="focus:outline-none">
                      {insight.title}
                    </Link>
                  </h4>

                  {/* Excerpt */}
                  <p className="text-xs text-[var(--muted)] line-clamp-3 leading-relaxed mb-4 flex-1">
                    {insight.excerpt}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--muted)] pt-3 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {insight.readingTime || '5 min read'}
                    </span>
                    <span>•</span>
                    <span className="truncate">{insight.category}</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-3 bg-[var(--surface)] border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewInsight(insight)}
                    className="text-[11px] font-mono text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye size={12} />
                    <span>Quick Preview</span>
                  </button>

                  <Link
                    to={`/insights/${insight.slug}`}
                    className="text-[11px] font-mono text-[var(--accent-gold)] font-bold flex items-center gap-1 hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Briefing</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Preview Modal Drawer */}
      {previewInsight && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setPreviewInsight(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 sm:p-8 text-[var(--foreground)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewInsight(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] mb-2">
              <Layers size={13} />
              <span>Executive Summary Preview</span>
            </div>

            <h3 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3 leading-snug">
              {previewInsight.title}
            </h3>

            <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)] mb-5 pb-4 border-b border-[var(--border)]">
              <span className="text-[var(--accent-gold)]">{previewInsight.category}</span>
              <span>•</span>
              <span>{previewInsight.readingTime || '5 min read'}</span>
              <span>•</span>
              <span>By {previewInsight.author}</span>
            </div>

            <div className="space-y-4 text-xs text-[var(--foreground)]/90 leading-relaxed">
              <p className="font-semibold text-sm text-[var(--foreground)]">
                {previewInsight.excerpt}
              </p>

              {previewInsight.body && (
                <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--muted)] line-clamp-6">
                  {previewInsight.body.replace(/[#*`_]/g, '').substring(0, 450)}...
                </div>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <button
                onClick={() => setPreviewInsight(null)}
                className="px-4 py-2 rounded-xl bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Close Preview
              </button>

              <Link
                to={`/insights/${previewInsight.slug}`}
                onClick={() => setPreviewInsight(null)}
                className="px-5 py-2 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-sm"
              >
                <span>Read Complete Briefing</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
