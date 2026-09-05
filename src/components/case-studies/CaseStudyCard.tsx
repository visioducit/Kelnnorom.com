import { Link } from 'react-router-dom';
import type { CaseStudy } from '@/types/content';
import { ArrowUpRight, TrendingUp, Cpu, Activity, ShieldCheck } from 'lucide-react';

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
}

export function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  return (
    <article
      id={`case-card-${study.slug}`}
      className="p-6 md:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] transition-all duration-300 hover:border-[var(--accent-gold)] hover:shadow-lg group flex flex-col justify-between"
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border)] mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">
              CASE #{String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[var(--border)]">•</span>
            <span className="text-xs font-semibold text-[var(--foreground)]">
              {study.company}
            </span>
            {study.year && (
              <>
                <span className="text-[var(--border)]">•</span>
                <span className="text-xs font-mono text-[var(--muted)]">{study.year}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {study.categories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1 rounded text-[10px] font-mono uppercase bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)]"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Title & Tagline */}
        <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-3 leading-tight">
          <Link to={`/work/${study.slug}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)] rounded">
            {study.title}
          </Link>
        </h2>

        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent-tech)] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{study.tagline}</span>
        </div>

        <p className="body-text text-sm md:text-base text-[var(--muted)] leading-relaxed mb-6">
          {study.challenge}
        </p>

        {/* System Diagram Flow */}
        {study.flow && study.flow.length > 0 && (
          <div className="my-5 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-2.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--accent-tech)]" />
              Intervention Flow:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {study.flow.map((node, nIdx) => (
                <div key={nIdx} className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] font-mono text-[11px] text-[var(--foreground)] font-medium">
                    {node}
                  </span>
                  {nIdx < (study.flow?.length ?? 0) - 1 && (
                    <span className="text-[var(--muted)] text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics Grid if Available */}
        {study.metrics && study.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 my-5">
            {study.metrics.map((m, mIdx) => (
              <div
                key={mIdx}
                className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)]"
              >
                <div className="text-xl font-bold text-[var(--accent-gold)] font-mono">
                  {m.value}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-1 font-medium leading-snug">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Systems & Technology Stack */}
        {study.systems && study.systems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 my-4">
            <span className="text-[10px] font-mono uppercase text-[var(--muted)] flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[var(--accent-tech)]" /> Systems:
            </span>
            {study.systems.map((sys, sIdx) => (
              <span
                key={sIdx}
                className="px-2 py-0.5 rounded text-[11px] bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)]"
              >
                {sys}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Outcomes Summary & Link */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-[var(--muted)] flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span className="line-clamp-1 font-medium text-[var(--foreground)]">
            {study.outcomes[0]}
          </span>
        </div>

        <Link
          to={`/work/${study.slug}`}
          id={`view-case-${study.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] hover:underline shrink-0"
        >
          <span>View Deep-Dive Brief</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
