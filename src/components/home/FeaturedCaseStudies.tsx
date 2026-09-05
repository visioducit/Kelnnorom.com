import { Link } from 'react-router-dom';
import { useCms } from '@/lib/cms-store';
import { ArrowRight, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FeaturedCaseStudies() {
  const { state } = useCms();
  const featuredStudies = state.caseStudies.filter((c) => c.featured);
  const displayStudies = featuredStudies.length > 0 ? featuredStudies : state.caseStudies.slice(0, 3);

  return (
    <section id="featured-case-studies" className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--surface)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-2 text-[var(--accent-gold)]">Selected Work</div>
            <h2 className="headline-section text-[var(--foreground)] mb-4">
              Systems. Interventions. Outcomes.
            </h2>
            <p className="body-text text-base md:text-lg text-[var(--muted)]">
              The strongest evidence of an operator is not a list of responsibilities. 
              It is what changed after they entered the system.
            </p>
          </div>
          <Button to="/work" variant="secondary">
            View All Projects
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-8">
          {displayStudies.map((study, idx) => (
            <div
              key={study.slug}
              className="p-6 md:p-10 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent-gold)] group shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Narrative */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    {/* Header line */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">
                        CASE #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[var(--border)]">•</span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {study.company}
                      </span>
                      <span className="text-[var(--border)]">•</span>
                      <span className="text-xs text-[var(--muted)]">
                        {study.year}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-3">
                      {study.title}
                    </h3>

                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-tech)] mb-4">
                      {study.tagline}
                    </p>

                    <p className="body-text text-sm md:text-base text-[var(--muted)] leading-relaxed mb-6">
                      {study.challenge}
                    </p>
                  </div>

                  {/* System Flow Diagram */}
                  {study.flow && study.flow.length > 0 && (
                    <div className="my-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-2.5 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[var(--accent-tech)]" />
                        System Intervention Pipeline
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        {study.flow.map((node, nIdx) => (
                          <div key={nIdx} className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)] font-mono text-[11px] text-[var(--foreground)]">
                              {node}
                            </span>
                            {nIdx < (study.flow?.length || 0) - 1 && (
                              <span className="text-[var(--muted)] text-xs">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {study.categories.map((cat, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 text-[11px] rounded bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Outcomes & CTA */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[var(--surface)] p-6 md:p-8 rounded-xl border border-[var(--border)]">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-4 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[var(--accent-gold)]" />
                      Documented Outcomes & Impact
                    </h4>

                    {/* Metrics Callout */}
                    {study.metrics && study.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {study.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]"
                          >
                            <div className="text-xl md:text-2xl font-bold text-[var(--accent-gold)] font-mono">
                              {m.value}
                            </div>
                            <div className="text-[11px] text-[var(--muted)] mt-1 font-medium line-clamp-2">
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Outcome Text */}
                    <div className="space-y-2 mb-6">
                      {study.outcomes.map((outcome, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-2 text-xs text-[var(--foreground)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/work/${study.slug}`}
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors"
                  >
                    <span>Read Complete Operating Case</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
