import { useState } from 'react';
import { careerFlow } from '@/content/site-data';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const careerMilestones = [
  {
    period: '2009–2011',
    phase: 'Commercial Foundations',
    company: 'Tastee Fried Chicken',
    skills: ['Sales execution', 'Frontline profitability', 'Quality control', 'Operational audit', 'Customer service'],
    insight: 'Mastered frontline unit economics and process discipline directly where commercial exchange happens.',
  },
  {
    period: '2011–2014',
    phase: 'Digital Content & Media Systems',
    company: 'iROKO Partners',
    skills: ['Content operations', 'Metadata engineering', 'Analytics & telemetry', 'Team leadership (11+)', 'Artiste relations', 'Revenue reconciliation'],
    insight: 'Built and scaled content operations for one of Africa’s pioneering streaming platforms.',
  },
  {
    period: '2015–2016',
    phase: 'Business, Fintech & Digital Operations',
    company: 'TopCheck / Carsinyankee',
    skills: ['Fintech digitization', 'Insurance partner onboarding', 'SEO & web analytics', 'Market research', 'Digital customer acquisition'],
    insight: 'Navigated complex regulatory environments and digitized consumer financial product journeys.',
  },
  {
    period: '2016–2018',
    phase: 'Digital Infrastructure & Monetization',
    company: 'BHM Group / ID Africa / NET',
    skills: ['20+ web platforms', '6 dedicated servers', 'Programmatic ad-tech', 'Search engine optimization', 'Multi-channel monetization'],
    insight: 'Integrated audience development, advertising technology, server uptime, and commercial media monetization.',
  },
  {
    period: '2018–Present',
    phase: 'Consulting, Digital Assets & Fleet Systems',
    company: 'ZedOut Limited',
    skills: ['Digital asset management', 'Search authority & PR', 'Fleet operations', 'Driver compliance & tracking', 'Vendor procurement', 'P&L management'],
    insight: 'Bridged digital asset protection with physical e-hailing fleet operations, compliance, and asset yields.',
  },
  {
    period: '2025',
    phase: 'Supply Chain & Multi-Category Distribution',
    company: 'Official Shoppers Warehouse',
    skills: ['TMS deployment', 'GPS fleet telemetry', 'Route optimization', '15+ logistics personnel', '20%+ growth', '25% fuel savings', '>95% OTIF'],
    insight: 'Engineered comprehensive supply-chain turnaround across FMCG, electronics, beverages, and homewares.',
  },
];

export function CareerEvolution() {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(5); // Default to latest

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-2 text-[var(--accent-gold)]">Career Architecture</div>
          <h2 className="headline-section text-[var(--foreground)] mb-6">
            From Content to Commerce.
          </h2>
          <p className="body-text text-base md:text-lg text-[var(--muted)] leading-relaxed">
            Kel&apos;s career looks unconventional when viewed as a conventional list of job titles. 
            It becomes profoundly coherent when understood as a steady progression through increasingly complex operating systems.
          </p>
          <div className="mt-4 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs md:text-sm text-[var(--foreground)]">
            <span className="font-bold text-[var(--accent-gold)] uppercase tracking-wider block mb-1">
              The Operating Instinct:
            </span>
            Different industries. Different technologies. Different operating environments. Same underlying instinct: <strong className="text-[var(--foreground)]">Make the system work better.</strong>
          </div>
        </div>

        {/* Compounding Capability Visual Flow */}
        <div className="mb-16 p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[var(--border)]">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
              A Career That Compounds
            </span>
            <span className="text-[11px] text-[var(--muted)]">
              Horizontal Capability Progression
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {careerFlow.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                  idx === careerFlow.length - 1
                    ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)] font-bold'
                    : 'bg-[var(--surface-elevated)] text-[var(--foreground)] border-[var(--border)]'
                }`}>
                  {step}
                </span>
                {idx < careerFlow.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chronological Milestone Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Milestone List */}
          <div className="lg:col-span-6 space-y-3">
            {careerMilestones.map((m, idx) => {
              const isSelected = selectedMilestone === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedMilestone(idx)}
                  className={`w-full p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-elevated)] border-[var(--accent-gold)] shadow-md ring-1 ring-[var(--accent-gold)]/20'
                      : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent-tech)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                      <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">
                        {m.period}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--muted)]">
                      {m.company}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-[var(--foreground)]">
                    {m.phase}
                  </h3>

                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">
                    {m.insight}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Milestone Deep-Dive */}
          <div className="lg:col-span-6 sticky top-28 p-6 md:p-8 rounded-xl bg-[var(--surface-elevated)] border-2 border-[var(--border)] shadow-md">
            {careerMilestones[selectedMilestone] && (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                    {careerMilestones[selectedMilestone].period} Chapter
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]">
                    {careerMilestones[selectedMilestone].company}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-3">
                  {careerMilestones[selectedMilestone].phase}
                </h3>

                <p className="body-text text-sm md:text-base text-[var(--muted)] leading-relaxed mb-6">
                  {careerMilestones[selectedMilestone].insight}
                </p>

                <div className="pt-6 border-t border-[var(--border)]">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold mb-3">
                    Key Systems & Operational Levers:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {careerMilestones[selectedMilestone].skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1.5 text-xs rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between">
                  <Link
                    to="/experience"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--accent-gold)] hover:underline"
                  >
                    <span>View Complete Chronology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
