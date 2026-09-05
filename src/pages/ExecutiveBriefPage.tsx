import { Seo } from '@/components/Seo';
import { capabilities } from '@/content/site-data';
import { caseStudies } from '@/content/case-studies';
import { Button } from '@/components/ui/Button';
import {
  Printer,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

function ExecutiveBriefPage() {
  const handlePrint = () => {
    window.print();
  };

  const topCases = caseStudies.slice(0, 3);

  return (
    <>
      <Seo
        config={{
          title: 'Executive Brief & Leadership Dossier | Kel Nnorom',
          description:
            'The 60-second executive summary: positioning, verified metrics, strongest case studies, core capability matrix, and career architecture.',
          canonical: 'https://www.kelnnorom.com/executive-brief',
          keywords: [
            'Kel Nnorom Executive Brief',
            'Operations Leadership Dossier',
            'Executive One-Pager',
            'Turnaround Track Record Summary',
            'Kel Nnorom PDF Brief',
          ],
        }}
      />

      {/* Print Controls Floating Bar */}
      <div className="print:hidden sticky top-16 z-30 bg-[var(--surface-elevated)] border-b border-[var(--border)] py-3 backdrop-blur-md bg-opacity-95">
        <div className="max-w-content mx-auto container-px flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-bold">
              60-Second Executive Briefing
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              id="print-executive-brief-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>Print / Save as PDF</span>
            </button>
            <Button to="/contact" variant="primary" className="py-1.5 text-xs">
              Discuss Mandate
            </Button>
          </div>
        </div>
      </div>

      {/* Executive Brief Document Layout */}
      <div className="w-full bg-[var(--background)] py-12 md:py-20 print:py-0 print:bg-white print:text-black">
        <div className="max-w-4xl mx-auto container-px print:px-0 space-y-12">
          {/* SECTION 1: HEADER & POSITIONING */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] print:border-none print:p-0 print:bg-transparent shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                  EXECUTIVE PROFILE & PORTFOLIO BRIEF
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] print:text-black mt-1">
                  KEL NNOROM
                </h1>
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-tech)] mt-1">
                  Cross-Functional Operations & Growth Strategist
                </p>
              </div>

              <div className="text-left sm:text-right text-xs font-mono text-[var(--muted)] space-y-1">
                <div>contact@kelnnorom.com</div>
                <div>linkedin.com/in/kelnnorom</div>
                <div>kelnnorom.com</div>
              </div>
            </div>

            {/* Positioning Statement */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-bold">
                Executive Positioning
              </h2>
              <p className="text-xl sm:text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] print:text-black leading-snug">
                &ldquo;I turn complex, volatile operating environments into structured, measurable, and scalable systems.&rdquo;
              </p>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] print:text-gray-700 leading-relaxed">
                Operating across the intersection of business operations, physical logistics, digital infrastructure, data analytics, and commercial P&L management. 15+ years of verified turnarounds across Nigeria and emerging African digital markets.
              </p>
            </div>
          </div>

          {/* SECTION 2: STRONGEST VERIFIED METRICS */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] print:border-none print:p-0 print:bg-transparent shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Verified Operating Impact
              </h2>
              <span className="text-[11px] font-mono text-[var(--muted)]">100% Documented</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: '15+', label: 'Years Experience', sub: 'Cross-industry progression' },
                { value: '20+', label: 'Web Platforms', sub: 'Scaled & managed' },
                { value: '20%+', label: 'Operational Growth', sub: 'Documented efficiency' },
                { value: '>95%', label: 'OTIF Performance', sub: 'Dispatch SLA rate' },
                { value: '-20%', label: 'Cost-per-Delivery', sub: 'Route optimization' },
                { value: '-25%', label: 'Fuel Expense', sub: 'Telemetry control' },
                { value: '+35%', label: 'Efficiency Gain', sub: 'Workflow redesign' },
                { value: '₦ Multi-M', label: 'P&L Exposure', sub: 'Commercial discipline' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] print:bg-gray-50"
                >
                  <div className="text-2xl font-bold font-mono text-[var(--accent-gold)] print:text-black">
                    {m.value}
                  </div>
                  <div className="text-xs font-bold text-[var(--foreground)] print:text-black mt-1">
                    {m.label}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: TOP 3 REPRESENTATIVE CASE STUDIES */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] print:border-none print:p-0 print:bg-transparent shadow-sm">
            <div className="pb-4 border-b border-[var(--border)] mb-6">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                Representative Case Studies
              </h2>
            </div>

            <div className="space-y-6">
              {topCases.map((study) => (
                <div
                  key={study.slug}
                  className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] print:bg-gray-50"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--muted)] font-mono mb-2">
                    <span className="font-bold text-[var(--foreground)] print:text-black">{study.company}</span>
                    <span>{study.year}</span>
                  </div>
                  <h3 className="text-lg font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] print:text-black mb-2">
                    {study.title}
                  </h3>
                  <p className="text-xs text-[var(--muted)] print:text-gray-700 leading-relaxed mb-3">
                    {study.challenge}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--accent-gold)] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{study.outcomes[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: CAPABILITY CLUSTERS & DOMAINS */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] print:border-none print:p-0 print:bg-transparent shadow-sm">
            <div className="pb-4 border-b border-[var(--border)] mb-6">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                Capability Matrix & Operating Range
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {capabilities.slice(0, 6).map((cap) => (
                <div key={cap.category}>
                  <h3 className="text-xs font-mono uppercase text-[var(--foreground)] font-bold mb-2">
                    {cap.category}
                  </h3>
                  <div className="space-y-1">
                    {cap.items.slice(0, 4).map((it, idx) => (
                      <div key={idx} className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent-gold)]" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: CONTACT & ADVISORY AVAILABILITY */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] text-center print:border-black shadow-sm">
            <h2 className="text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] print:text-black mb-2">
              Available for Strategic Advisory & Operational Mandates
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] print:text-gray-700 max-w-lg mx-auto mb-6">
              Logistics optimization, supply chain restructuring, digital platform turnaround, and fractional operating leadership.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
              <Button to="/contact" variant="primary">
                Discuss an Operating Challenge
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button to="/work" variant="secondary">
                View Full Work Archive
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExecutiveBriefPage;
