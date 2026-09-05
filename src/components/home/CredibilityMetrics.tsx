import { useCms } from '@/lib/cms-store';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export function CredibilityMetrics() {
  const { state } = useCms();
  const metricsList = state.metrics;

  return (
    <section id="credibility-metrics" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--surface)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="eyebrow mb-2 text-[var(--accent-gold)] font-mono">Operating Range</div>
            <h2 className="headline-section text-[var(--foreground)]">
              A Career Built Across Systems.
            </h2>
          </div>
          <p className="body-text text-sm md:text-base text-[var(--muted)] max-w-md">
            All metrics reflect documented outcomes across commercial, technological, media, and physical distribution environments.
          </p>
        </div>

        {/* Editorial Staggered Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {metricsList.map((metric, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent-gold-soft)] group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Metric #{String(idx + 1).padStart(2, '0')}
                </span>
                {metric.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--success)]">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Inter_Tight',sans-serif] tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors tabular-nums">
                  {metric.value}
                </div>
                <div className="text-xs md:text-sm text-[var(--muted)] font-medium mt-2 line-clamp-2">
                  {metric.label}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-tech)] font-medium">
                  <TrendingUp className="w-3 h-3" /> Measured Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
