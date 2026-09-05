import { useParams, Link, Navigate } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { useCms } from '@/lib/cms-store';
import { Button } from '@/components/ui/Button';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu,
  Layers,
  CheckCircle2,
  Calendar,
  Building2,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useCms();
  const [copied, setCopied] = useState(false);

  const caseStudy = slug
    ? state.caseStudies.find((c) => c.slug === slug)
    : undefined;

  if (!caseStudy) {
    return <Navigate to="/work" replace />;
  }

  // Related studies
  const relatedCaseStudies = (caseStudy.relatedSlugs || [])
    .map((rSlug) => state.caseStudies.find((c) => c.slug === rSlug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  // If no explicit related or less than 2, fill with others
  const displayRelated = relatedCaseStudies.length > 0 
    ? relatedCaseStudies 
    : state.caseStudies.filter((c) => c.slug !== caseStudy.slug).slice(0, 2);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Seo
        config={{
          title: `${caseStudy.title} | Operations Case Study — Kel Nnorom`,
          description: `${caseStudy.tagline}. ${caseStudy.challenge.substring(0, 140)}...`,
          canonical: `https://www.kelnnorom.com/work/${caseStudy.slug}`,
          type: 'article',
          keywords: [
            caseStudy.title,
            caseStudy.company,
            ...(Array.isArray(caseStudy.industry) ? caseStudy.industry : [caseStudy.industry]),
            ...caseStudy.categories,
            'Kel Nnorom Case Study',
            'Operations Turnaround',
          ],
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: caseStudy.title,
              description: caseStudy.tagline,
              author: {
                '@type': 'Person',
                name: 'Kel Nnorom',
                url: 'https://www.kelnnorom.com',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Kel Nnorom Executive Practice',
                logo: 'https://www.kelnnorom.com/favicon.png',
              },
              mainEntityOfPage: `https://www.kelnnorom.com/work/${caseStudy.slug}`,
            },
          ],
        }}
      />

      <div className="w-full">
        {/* Navigation Breadcrumb */}
        <section className="pt-8 pb-6 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px flex items-center justify-between">
            <Link
              to="/work"
              id="back-to-work-link"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-gold)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Work</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                id="share-case-study-button"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Brief'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 01 CASE STUDY HERO */}
        <section className="py-14 md:py-20 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8">
                {/* Eyebrow & Category Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                    OPERATIONAL CASE STUDY
                  </span>
                  <span className="text-[var(--border)]">•</span>
                  {caseStudy.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Main Case Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.08] mb-4">
                  {caseStudy.title}
                </h1>

                {/* Tagline / Interdisciplinary intersection */}
                <div className="text-sm sm:text-base font-semibold uppercase tracking-wider text-[var(--accent-tech)] mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-tech)]" />
                  <span>{caseStudy.tagline}</span>
                </div>

                <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed">
                  {caseStudy.challenge}
                </p>
              </div>

              {/* Sidebar Metadata Box */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-sm">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[var(--muted)] mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Organization / Client
                  </div>
                  <div className="text-sm font-bold text-[var(--foreground)]">
                    {caseStudy.company}
                  </div>
                </div>

                {caseStudy.year && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <div className="text-[10px] font-mono uppercase text-[var(--muted)] mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Timeline Era
                    </div>
                    <div className="text-sm font-semibold text-[var(--foreground)] font-mono">
                      {caseStudy.year}
                    </div>
                  </div>
                )}

                {caseStudy.role && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <div className="text-[10px] font-mono uppercase text-[var(--muted)] mb-1 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Operating Mandate
                    </div>
                    <div className="text-xs font-semibold text-[var(--foreground)]">
                      {caseStudy.role}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-[10px] font-mono uppercase text-[var(--muted)] mb-1">
                    Industry Domains
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {caseStudy.industry.map((ind) => (
                      <span
                        key={ind}
                        className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)]"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 SYSTEM INTERVENTION PIPELINE DIAGRAM */}
        {caseStudy.flow && caseStudy.flow.length > 0 && (
          <section className="py-12 border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="max-w-content mx-auto container-px">
              <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--accent-tech)]" />
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold">
                      System Intervention Pipeline
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--muted)]">
                    Sequential Operational Levers
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  {caseStudy.flow.map((node, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col">
                        <span className="text-[10px] font-mono text-[var(--muted)] mb-0.5">
                          Step 0{idx + 1}
                        </span>
                        <span className="font-bold text-xs sm:text-sm font-mono text-[var(--foreground)]">
                          {node}
                        </span>
                      </div>
                      {idx < (caseStudy.flow?.length ?? 0) - 1 && (
                        <span className="text-[var(--accent-gold)] font-bold text-sm hidden sm:inline">
                          →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 03 DEEP DIVE: ENVIRONMENT, INTERVENTIONS & MEASURED IMPACT */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Scope & Interventions */}
              <div className="lg:col-span-7 space-y-12">
                {/* Operating Environment */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-3">
                    01. Operating Environment
                  </div>
                  <h2 className="text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                    The Context & Initial Conditions
                  </h2>
                  <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-4">
                    Entering the operating environment required untangling multiple interconnected variables:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {caseStudy.environment.map((envItem, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--foreground)] flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] shrink-0" />
                        <span>{envItem}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Interventions */}
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold mb-3">
                    02. Operational Interventions
                  </div>
                  <h2 className="text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                    Execution Levers & Process Restructuring
                  </h2>
                  <div className="space-y-3">
                    {caseStudy.intervention.map((intItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-start gap-3"
                      >
                        <span className="p-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent-tech)] font-mono text-[10px] font-bold">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="text-xs sm:text-sm font-medium text-[var(--foreground)]">
                          {intItem}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Systems & Technology Deployed */}
                {caseStudy.systems && caseStudy.systems.length > 0 && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-3 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[var(--accent-tech)]" />
                      03. Systems & Technology Architecture
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.systems.map((sys, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] font-medium"
                        >
                          {sys}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Outcomes, Metrics & Capabilities */}
              <div className="lg:col-span-5 space-y-8 sticky top-24">
                {/* Outcomes Card */}
                <div className="p-6 md:p-8 rounded-2xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-md">
                  <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)] mb-6">
                    <TrendingUp className="w-4 h-4 text-[var(--accent-gold)]" />
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                      Documented Outcomes & Impact
                    </h3>
                  </div>

                  {/* Quantitative Metrics Grid if Available */}
                  {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {caseStudy.metrics.map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between"
                        >
                          <div>
                            <div className="text-2xl font-bold font-mono text-[var(--accent-gold)]">
                              {metric.value}
                            </div>
                            <div className="text-xs font-semibold text-[var(--foreground)] mt-0.5">
                              {metric.label}
                            </div>
                          </div>
                          {metric.context && (
                            <span className="text-[10px] font-mono text-[var(--muted)] px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                              {metric.context}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Qualitative Narrative Outcomes */}
                  <div className="space-y-3">
                    {caseStudy.outcomes.map((outItem, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--foreground)] font-medium leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                        <span>{outItem}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border)] text-[11px] font-mono text-[var(--muted)]">
                    Verified Operating Transformation
                  </div>
                </div>

                {/* Capabilities Demonstrated */}
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-bold mb-4">
                    Demonstrated Capabilities:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.capabilities.map((cap, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-md text-xs bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)]"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 RELATED CASE STUDIES */}
        <section className="py-16 md:py-20 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
              <div>
                <div className="text-xs font-mono uppercase text-[var(--accent-gold)] font-bold">
                  Adjacent Systems
                </div>
                <h3 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                  Related Case Studies
                </h3>
              </div>

              <Link
                to="/work"
                className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-gold)] flex items-center gap-1"
              >
                <span>View Full Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayRelated.map((relStudy) => (
                <Link
                  key={relStudy.slug}
                  to={`/work/${relStudy.slug}`}
                  className="p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2 font-mono">
                      <span>{relStudy.company}</span>
                      <span>{relStudy.year}</span>
                    </div>
                    <h4 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-2">
                      {relStudy.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] line-clamp-2">
                      {relStudy.challenge}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs font-bold text-[var(--accent-gold)] flex items-center gap-1">
                    <span>Read Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 05 BOTTOM CTA */}
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Operational Partnership
              </div>
              <h2 className="text-3xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                Ready to evaluate your operating system?
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                Available for advisory engagements, logistics optimization, digital platform infrastructure, and fractional operating leadership.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button to="/contact" variant="primary">
                  Discuss an Operating Challenge
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/executive-brief" variant="secondary">
                  60-Second Executive Brief
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default CaseStudyPage;
