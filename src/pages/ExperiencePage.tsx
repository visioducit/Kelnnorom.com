import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { useCms } from '@/lib/cms-store';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Building2,
  Layers,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

const industryFilters = [
  'ALL',
  'Supply Chain',
  'Logistics',
  'Digital Media',
  'Fintech',
  'Consulting',
  'Retail',
] as const;

function ExperiencePage() {
  const { state } = useCms();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [activeEraId, setActiveEraId] = useState<string | null>(null);

  const filteredExperiences = state.experiences.filter((exp) => {
    if (selectedIndustry === 'ALL') return true;
    return exp.industry.some((ind) => ind.toLowerCase().includes(selectedIndustry.toLowerCase()));
  });

  return (
    <>
      <Seo
        config={{
          title: 'Career Trajectory & Track Record | Kel Nnorom Experience',
          description:
            'A 15+ year operational leadership trajectory through digital media empires, fintech scale-ups, distribution logistics, and enterprise turnarounds.',
          canonical: 'https://www.kelnnorom.com/experience',
          keywords: [
            'Kel Nnorom Career',
            'Operations Leadership Experience',
            'Logistics Director Track Record',
            'IROKO Operations Leadership',
            'Cross-Functional Executive Career',
            'Supply Chain Trajectory',
          ],
        }}
      />

      <div className="w-full">
        {/* Hero Section */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-gold)]">
                  Career Chronology & Systems Trajectory
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                From Content to Commerce. <br />
                <span className="text-[var(--accent-gold)]">A Career of Increasing Complexity.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                Kel&apos;s career trajectory reflects a deliberate compounding of operational capability. 
                From front-line sales execution and digital media metadata to high-frequency fintech onboarding, fleet dispatch, and multi-category supply chain optimization.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 15+ Years Documented
                </span>
                <span>•</span>
                <span>6 Operating Eras</span>
                <span>•</span>
                <span>Multi-million ₦ P&L Experience</span>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Era Progression Bar */}
        <section className="py-6 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 sm:pb-0 no-scrollbar text-xs font-mono">
              <span className="text-[var(--muted)] uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--accent-gold)]" /> Operating Eras:
              </span>
              {state.experiences.map((exp) => (
                <button
                  key={exp.id}
                  onClick={() => {
                    setActiveEraId(exp.id);
                    const el = document.getElementById(`experience-${exp.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-3 py-1.5 rounded-lg border shrink-0 transition-all cursor-pointer ${
                    activeEraId === exp.id
                      ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)] font-bold'
                      : 'bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {exp.startDate}–{exp.endDate || 'Now'}: {exp.company}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-20 backdrop-blur-md bg-opacity-95">
          <div className="max-w-content mx-auto container-px flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-[var(--muted)] shrink-0 mr-1" />
              {industryFilters.map((ind) => {
                const isSelected = selectedIndustry === ind;
                return (
                  <button
                    key={ind}
                    onClick={() => setSelectedIndustry(ind)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-gold)] text-white shadow-sm'
                        : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent-gold-soft)]'
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-[var(--muted)] hidden sm:inline">
              Showing {filteredExperiences.length} of {state.experiences.length} Chapters
            </span>
          </div>
        </section>

        {/* Chronological Timeline Stream */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="relative pl-6 md:pl-10 border-l-2 border-[var(--border)] space-y-16">
              {filteredExperiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  id={`experience-${exp.id}`}
                  className="relative group"
                >
                  {/* Timeline node marker */}
                  <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] flex items-center justify-center text-[var(--accent-gold)] shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
                  </div>

                  {/* Main Role Content Card */}
                  <div className="p-6 md:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all duration-300 shadow-sm">
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)] mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">
                            CHAPTER #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[var(--border)]">•</span>
                          <span className="text-xs font-mono text-[var(--muted)] uppercase">
                            {exp.eraPeriod}
                          </span>
                          {exp.verified && (
                            <>
                              <span className="text-[var(--border)]">•</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--success)]">
                                <CheckCircle2 className="w-3 h-3" /> Verified
                              </span>
                            </>
                          )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                          {exp.role}
                        </h2>
                      </div>

                      <div className="sm:text-right">
                        <div className="text-lg font-bold text-[var(--foreground)] flex sm:justify-end items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[var(--accent-gold)]" />
                          <span>{exp.company}</span>
                        </div>
                        <div className="flex flex-wrap sm:justify-end gap-1 mt-1">
                          {exp.industry.map((ind) => (
                            <span
                              key={ind}
                              className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)]"
                            >
                              {ind}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Operational Scope & Key Focus Levers */}
                    <div className="mb-6">
                      <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold mb-2.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[var(--accent-tech)]" />
                        Operational Focus & Core Levers:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exp.focus.map((f, fIdx) => (
                          <span
                            key={fIdx}
                            className="px-2.5 py-1 rounded-md text-xs bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)] font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Responsibilities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 pt-6 border-t border-[var(--border)]">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-bold mb-3">
                          Execution Scope & Responsibilities:
                        </h3>
                        <div className="space-y-2">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <div key={rIdx} className="flex items-start gap-2 text-xs text-[var(--muted)] leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tech)] mt-1.5 shrink-0" />
                              <span className="text-[var(--foreground)]">{resp}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documented Achievements */}
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-3 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                          Documented Impact & Outcomes:
                        </h3>
                        <div className="space-y-2">
                          {exp.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 text-xs text-[var(--foreground)] leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-gold)] mt-0.5 shrink-0" />
                              <span className="font-medium">{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Systems Deployed (if any) */}
                    {exp.systems && exp.systems.length > 0 && (
                      <div className="my-6 pt-6 border-t border-[var(--border)]">
                        <div className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-bold mb-2 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-[var(--accent-tech)]" />
                          Systems & Platforms Operated:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.systems.map((sys, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded text-xs bg-[var(--surface-elevated)] border border-[var(--border)] font-mono text-[var(--foreground)]"
                            >
                              {sys}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Capabilities Developed Tags */}
                    <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-[var(--muted)] mr-1">
                          Capabilities Built:
                        </span>
                        {exp.capabilities.map((cap, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-0.5 rounded text-[11px] bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)]"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      <Link
                        to="/work"
                        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] hover:underline"
                      >
                        <span>Related Case Studies</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="p-8 md:p-12 rounded-2xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)]/40 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                  Leadership & Advisory
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                  Put 15+ years of operational compound leverage to work.
                </h2>
                <p className="body-text text-xs sm:text-sm text-[var(--muted)]">
                  Available for board advisory, operational turnarounds, supply chain distribution optimization, and fractional executive leadership.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button to="/contact" variant="primary">
                  Start a Conversation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/capabilities" variant="secondary">
                  Explore Capabilities
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ExperiencePage;
