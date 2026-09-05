import { Link } from 'react-router-dom';
import { useCms } from '@/lib/cms-store';
import { insightCategories } from '@/content/insights';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FeaturedInsights() {
  const { state } = useCms();
  const publishedInsights = (state.insights || []).filter((i) => i.published !== false);

  return (
    <section id="blog" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-2 text-[var(--accent-gold)]">Perspectives & Blog</div>
            <h2 className="headline-section text-[var(--foreground)] mb-4">
              Thinking About Systems.
            </h2>
            <p className="body-text text-base md:text-lg text-[var(--muted)]">
              Thinking about operations, digital systems, growth, technology and the mechanics behind performance.
            </p>
          </div>
          <Button to="/insights" variant="secondary">
            View All Blog Insights
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-[var(--border)]">
          <span className="text-[11px] font-mono uppercase text-[var(--muted)] mr-2">
            Coverage Domains:
          </span>
          {insightCategories.slice(0, 7).map((cat) => (
            <span
              key={cat}
              className="px-2.5 py-1 text-xs rounded-full bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Content / Elegant Empty State */}
        {publishedInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedInsights.map((insight) => (
              <Link
                key={insight.slug}
                to={`/insights/${insight.slug}`}
                className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
                    <span className="text-[var(--accent-gold)] font-medium font-mono">{insight.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {insight.readingTime || '5 min read'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)] line-clamp-3">
                    {insight.excerpt}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)] text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 md:p-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] border border-[var(--accent-gold-soft)]/40 flex items-center justify-center text-[var(--accent-gold)] mx-auto mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-2">
              The Archive Is Being Built.
            </h3>
            <p className="body-text text-xs md:text-sm text-[var(--muted)] leading-relaxed mb-6">
              Executive essays and operational frameworks on turning digital systems, business operations, and supply-chain logistics into measurable business value are forthcoming.
            </p>
            <Button to="/executive-brief" variant="secondary">
              Review Executive Profile Instead
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
