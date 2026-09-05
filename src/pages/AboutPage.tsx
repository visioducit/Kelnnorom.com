import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const valueDrivers = [
  {
    discipline: 'Digital Operations',
    description: 'Scaling web properties, CMS pipelines, SEO authority, and audience monetization systems under high traffic constraints.',
  },
  {
    discipline: 'Commercial Strategy',
    description: 'Aligning operating levers with revenue metrics, unit economics, P&L sustainability, and CAC/LTV balance.',
  },
  {
    discipline: 'Technology & Systems',
    description: 'Deploying ERP, TMS, WMS, GPS fleet tracking, and automated reporting pipelines that bridge software with human execution.',
  },
  {
    discipline: 'Logistics & Supply Chain',
    description: 'Multi-hub warehousing, fleet dispatch, route optimization, fuel leakage control, and SLA-backed delivery performance.',
  },
  {
    discipline: 'Cross-Functional Leadership',
    description: 'Leading multidisciplinary teams across software developers, UI/UX designers, editors, warehouse clerks, and dispatch drivers.',
  },
  {
    discipline: 'Turnaround Execution',
    description: 'Diagnosing root-cause operational friction, eliminating cost leaks, and establishing measurable KPIs in distressed environments.',
  },
];

const operatingBeliefs = [
  { text: 'Good operations create leverage.', sub: 'Without robust workflows, commercial success breeds organizational chaos.' },
  { text: 'Good data creates clarity.', sub: 'What is unmeasured cannot be optimized or held accountable.' },
  { text: 'Good systems create scale.', sub: 'Processes that depend on superhuman individual memory inevitably fail at volume.' },
  { text: 'Good people create execution.', sub: 'Empowered, well-directed operators convert blueprints into daily reality.' },
  { text: 'Good technology amplifies all four.', sub: 'Software is not a replacement for operational discipline; it is an accelerant.' },
];

function AboutPage() {
  return (
    <>
      <Seo
        config={{
          title: 'About Kel Nnorom | Executive Operations & Growth Strategist Profile',
          description:
            'Discover Kel Nnorom: Cross-functional operations, growth strategist, and turnaround leader with deep expertise across digital platforms, logistics systems, technology, and monetization.',
          canonical: 'https://www.kelnnorom.com/about',
          keywords: [
            'About Kel Nnorom',
            'Kel Nnorom Biography',
            'Operations Turnaround Strategist',
            'Digital Operations Samurai',
            'Cross-Functional Executive',
            'Supply Chain Leader Lagos',
            'Enterprise Growth Strategist',
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
                  Who I Am & Operating Mandate
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                A Cross-Functional Operator With a <br />
                <span className="text-[var(--accent-gold)]">Wide Operating Range.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                I work at the intersection of operations, technology, data, digital systems, and commercial performance. 
                My career has moved across environments that look completely different on paper—from hospitality and media to fintech, digital infrastructure, consulting, logistics, and supply chain.
              </p>

              <div className="p-4 rounded-xl bg-[var(--surface)] border-l-4 border-[var(--accent-gold)] border border-[var(--border)] text-sm font-semibold text-[var(--foreground)]">
                The common thread has always been the same: understand the system, improve the operation, and make performance measurable.
              </div>
            </div>
          </div>
        </section>

        {/* 01 WHAT I DO & HOW I WORK */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* What I Do */}
              <div className="lg:col-span-6 space-y-6">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                  Core Mission
                </div>
                <h2 className="text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                  What I Do
                </h2>
                <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  I turn complex, volatile operating environments into structured, predictable, and measurable systems. 
                  Whether restructuring a logistics dispatch network or engineering a digital media CMS pipeline, I identify the critical bottlenecks and build the systems required to sustain growth.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                    <div className="text-2xl font-bold font-mono text-[var(--accent-gold)]">15+</div>
                    <div className="text-xs font-medium text-[var(--muted)] mt-1">Years Operating Exposure</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
                    <div className="text-2xl font-bold font-mono text-[var(--accent-tech)]">20+</div>
                    <div className="text-xs font-medium text-[var(--muted)] mt-1">Digital Platforms Scaled</div>
                  </div>
                </div>
              </div>

              {/* How I Work */}
              <div className="lg:col-span-6 space-y-6">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold">
                  Operating Principles
                </div>
                <h2 className="text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                  How I Work
                </h2>

                <div className="space-y-3">
                  {[
                    { label: 'Analytical', desc: 'Grounded in data, empirical observation, and unit economics.' },
                    { label: 'Practical', desc: 'Focused on real-world frontline feasibility, not ivory-tower theory.' },
                    { label: 'Commercially Aware', desc: 'Every operational efficiency must ultimately protect margin or accelerate revenue.' },
                    { label: 'Technology-Enabled', desc: 'Leveraging software and automation to remove human failure points.' },
                    { label: 'Outcome-Focused', desc: 'Measured strictly by verifiable business and efficiency results.' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-start gap-3"
                    >
                      <span className="p-1 rounded bg-[var(--surface)] text-[var(--accent-gold)] font-mono text-xs font-bold shrink-0">
                        0{idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-[var(--foreground)]">{p.label}</div>
                        <div className="text-xs text-[var(--muted)] mt-0.5">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 WHERE I CREATE VALUE */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Value Creation
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                Where I Create Value
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Interlocking competencies built to solve multifaceted operational challenges across modern enterprise operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {valueDrivers.map((vd, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all duration-300 shadow-sm"
                >
                  <div className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase mb-2">
                    DISCIPLINE 0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-2">
                    {vd.discipline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {vd.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 WHAT I BELIEVE (THE CORE 5 BELIEFS) */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Convictions
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                What I Believe
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Foundational operating philosophy governing every system design, workflow architecture, and team intervention.
              </p>
            </div>

            <div className="space-y-4">
              {operatingBeliefs.map((belief, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--accent-gold)] font-mono text-sm font-bold shrink-0">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="text-lg sm:text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                        {belief.text}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--muted)] mt-1">
                        {belief.sub}
                      </div>
                    </div>
                  </div>

                  <CheckCircle2 className="w-5 h-5 text-[var(--accent-gold)] shrink-0 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 HERITAGE & CLOSING SIGNATURE */}
        <section className="py-16 md:py-24 bg-[var(--background)] border-b border-[var(--border)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold">
                  Operating Heritage
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4 uppercase tracking-wider">
                FORMERLY KNOWN AS THE &ldquo;DIGITAL OPERATIONS SAMURAI.&rdquo;
              </h2>

              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8 max-w-xl mx-auto">
                The identity reflected an earlier chapter of intense, high-cadence digital turnaround execution. While the scope of operations has expanded to encompass physical supply chains and commercial P&L structures, the uncompromising discipline of the operating principle remains.
              </p>

              <div className="pt-6 border-t border-[var(--border)] flex flex-col items-center justify-center">
                <p className="text-lg sm:text-xl font-serif italic text-[var(--accent-gold)] font-semibold mb-1">
                  &ldquo;...by all means, dream always.&rdquo;
                </p>
                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
                  — Kel Nnorom
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Bottom CTA */}
        <section className="py-20 bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Operational Inquiries
              </div>
              <h2 className="text-3xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                Ready to collaborate?
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                Available for advisory roles, fractional operating leadership, and strategic logistics optimization.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button to="/contact" variant="primary">
                  Start a Conversation
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/work" variant="secondary">
                  Review Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutPage;
