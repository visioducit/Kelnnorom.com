import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { philosophyStages, systemNodes } from '@/content/site-data';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Workflow,
} from 'lucide-react';

const systemTenets = [
  {
    title: 'A website is a system.',
    description: 'Not merely pages and visual markup, but a conversion engine, content delivery network, and user trust mechanism.',
  },
  {
    title: 'A logistics network is a system.',
    description: 'Asset utilization, driver incentives, predictive route topography, maintenance schedules, and customer ETA promises.',
  },
  {
    title: 'A supply chain is a system.',
    description: 'Inventory turn rates, supplier lead constraints, buffer thresholds, and working capital optimization.',
  },
  {
    title: 'A content operation is a system.',
    description: 'Metadata taxonomies, encoding pipelines, search discoverability, copyright governance, and audience retention loops.',
  },
  {
    title: 'A fleet is a system.',
    description: 'Telemetry monitoring, fuel consumption integrity, preventive servicing cycles, and operator safety protocols.',
  },
  {
    title: 'A marketing campaign is a system.',
    description: 'Acquisition economics, attribution modeling, funnel velocity, and unit margin preservation.',
  },
  {
    title: 'A business is a system.',
    description: 'The holistic convergence of people, cash flow, technology, physical constraints, and customer value delivery.',
  },
];

function PhilosophyPage() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activeSystemNode, setActiveSystemNode] = useState<string | null>(null);

  const selectedStageData = philosophyStages[activeStage];

  return (
    <>
      <Seo
        config={{
          title: 'Systems-First Operating Philosophy | Kel Nnorom Methodology',
          description:
            "I don't manage tasks. I architect compounding systems. Explore the 6-stage operational execution framework: Understand, Map, Build, Optimize, Measure, Scale.",
          canonical: 'https://www.kelnnorom.com/philosophy',
          keywords: [
            'Operating Philosophy',
            'Systems Architecture',
            'Operational Execution Framework',
            'Business Systems Thinking',
            'Kel Nnorom Philosophy',
            'First-Principles Operations',
          ],
        }}
      />

      <div className="w-full">
        {/* Signature Hero Section */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-gold)]">
                  Operating Philosophy
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                I Don&apos;t Manage Tasks. <br />
                <span className="text-[var(--accent-gold)]">I Manage Systems.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                Most operational failure occurs not because people fail to perform individual tasks, but because the systemic interconnections between people, technology, data, and commercial incentives are broken or unmeasured.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 6-Stage Framework
                </span>
                <span>•</span>
                <span>Systemic First Principles</span>
                <span>•</span>
                <span>Documented Outcomes</span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 THE "EVERYTHING IS A SYSTEM" MANIFESTO GRID */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                First Principles
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                Deconstructing Operational Complexities
              </h2>
              <p className="body-text text-xs sm:text-sm text-[var(--muted)]">
                My job is to understand the moving parts, identify the bottlenecks, connect the right people and technology, establish measurable performance, and continuously improve the system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemTenets.map((tenet, idx) => {
                const isAnchor = idx === systemTenets.length - 1;
                return (
                  <div
                    key={idx}
                    className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
                      isAnchor
                        ? 'md:col-span-2 lg:col-span-3 bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-md'
                        : 'bg-[var(--surface-elevated)] border-[var(--border)] hover:border-[var(--accent-gold)]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono font-bold text-[var(--accent-gold)] uppercase">
                        SYSTEM 0{idx + 1}
                      </span>
                      {isAnchor && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[var(--accent-gold)] text-white font-bold">
                          Core Visual Anchor
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-2 ${
                        isAnchor ? 'text-xl sm:text-2xl text-[var(--accent-gold)]' : 'text-lg'
                      }`}
                    >
                      {tenet.title}
                    </h3>
                    <p className="body-text text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                      {tenet.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 02 THE 6-STAGE OPERATIONAL EXECUTION ENGINE */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold mb-2 flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5" />
                Execution Methodology
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                The 6-Stage Operational Framework
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                From initial diagnostic immersion to automated, repeatable scaling. Every intervention follows a structured, non-linear progression.
              </p>
            </div>

            {/* Stage Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
              {philosophyStages.map((stage, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={stage.number}
                    onClick={() => setActiveStage(idx)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-md'
                        : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent-gold)]/40 text-[var(--muted)]'
                    }`}
                  >
                    <div
                      className={`text-xs font-mono font-bold mb-1 ${
                        isActive ? 'text-[var(--accent-gold)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      STAGE {stage.number}
                    </div>
                    <div
                      className={`text-base font-bold font-['Inter_Tight',sans-serif] ${
                        isActive ? 'text-[var(--foreground)]' : 'text-[var(--muted)]'
                      }`}
                    >
                      {stage.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Deep Dive Display */}
            {selectedStageData && (
              <div className="p-8 md:p-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[var(--border)] mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase">
                        STAGE {selectedStageData.number} DEEP DIVE
                      </span>
                      <span className="text-[var(--border)]">•</span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        Systemic Progression
                      </span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-2">
                      {selectedStageData.number}. {selectedStageData.title}
                    </h3>
                    <p className="body-text text-sm sm:text-base text-[var(--muted)]">
                      Core operational focus areas and diagnostic checklists executed during this phase.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button to="/work" variant="secondary">
                      View Matching Case Studies
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {selectedStageData.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-start gap-2.5 text-xs font-medium text-[var(--foreground)]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 03 INTERACTIVE SYSTEM TOPOLOGY */}
        <section className="py-16 md:py-24 border-b border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Operational Interconnection
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                The 6-Node System Topology
              </h2>
              <p className="body-text text-xs sm:text-sm text-[var(--muted)]">
                Every enterprise functions across six primary operational nodes. Click any node below to inspect real-world implementation contexts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemNodes.map((node) => {
                const isSelected = activeSystemNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveSystemNode(isSelected ? null : node.id)}
                    className={`p-6 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] shadow-md'
                        : 'bg-[var(--surface-elevated)] border-[var(--border)] hover:border-[var(--accent-gold)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-[var(--accent-gold)]">
                        NODE: {node.label}
                      </span>
                      <Activity className="w-4 h-4 text-[var(--accent-tech)]" />
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] font-medium mb-4 leading-relaxed">
                      {node.description}
                    </p>

                    <div className="pt-3 border-t border-[var(--border)]">
                      <div className="text-[10px] font-mono uppercase text-[var(--muted)] mb-2">
                        Real-world Environments:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {node.experiences.map((exp, eIdx) => (
                          <span
                            key={eIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Global Bottom CTA */}
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Operational Advisory
              </div>
              <h2 className="text-3xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                Let&apos;s evaluate the systems driving your business.
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                Identify systemic bottlenecks, streamline operational handoffs, and institute measurable performance indicators.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button to="/contact" variant="primary">
                  Discuss an Operating Challenge
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/work" variant="secondary">
                  Explore Documented Work
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default PhilosophyPage;
