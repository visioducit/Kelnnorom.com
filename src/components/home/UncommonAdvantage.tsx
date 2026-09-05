import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';

const siloedDisciplines = [
  { name: 'Marketing & SEO', siloRisk: 'Generates traffic without operational fulfillment capability.' },
  { name: 'Technology & Dev', siloRisk: 'Builds complex tools disconnected from commercial P&L.' },
  { name: 'Operations & Fleet', siloRisk: 'Optimizes routes without real-time customer data feeds.' },
  { name: 'Analytics & BI', siloRisk: 'Reports retrospective KPIs without execution levers.' },
  { name: 'Monetization', siloRisk: 'Pressures ad yield while degrading user retention.' },
];

export function UncommonAdvantage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-2 text-[var(--accent-gold)]">Why Kel</div>
          <h2 className="headline-section text-[var(--foreground)] mb-6">
            The Uncommon Advantage
          </h2>
          <p className="body-text text-base md:text-lg text-[var(--muted)] leading-relaxed">
            Most professionals specialize vertically within a single departmental silo. 
            Kel&apos;s career developed horizontally across interconnected business, technical, and physical systems.
          </p>
          <p className="body-text text-sm md:text-base text-[var(--muted)] mt-4">
            The differentiator is not merely knowing SEO, logistics, analytics, monetization, technology, or supply-chain operations in isolation. 
            It is understanding precisely how those disciplines interact—and knowing how to make the system perform as a coherent whole.
          </p>
        </div>

        {/* Visual Architecture Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: The Vertical Specialist (Silos) */}
          <div className="lg:col-span-5 p-6 md:p-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--danger)] font-bold flex items-center gap-1.5">
                  <X className="w-4 h-4 text-[var(--danger)]" /> Conventional Specialist
                </span>
                <span className="text-[11px] text-[var(--muted)]">Isolated Verticals</span>
              </div>
              <p className="text-xs text-[var(--muted)] mb-6">
                Departmental specialization creates isolated execution bubbles, handoff friction, and blind spots across revenue and logistics.
              </p>

              <div className="space-y-3">
                {siloedDisciplines.map((d, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs transition-colors"
                  >
                    <div className="font-semibold text-[var(--foreground)] flex items-center justify-between">
                      <span>{d.name}</span>
                      <span className="text-[10px] text-[var(--danger)] uppercase font-mono">Siloed</span>
                    </div>
                    {hoveredIndex === i && (
                      <p className="text-[11px] text-[var(--muted)] mt-1.5 pt-1.5 border-t border-[var(--border)]">
                        {d.siloRisk}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] italic">
              Result: Uncoordinated bottlenecks and missed compound growth.
            </div>
          </div>

          {/* Center Connector (Desktop) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] border border-[var(--accent-gold)] flex items-center justify-center text-[var(--accent-gold)] shadow-md mb-2">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase text-[var(--accent-gold)] font-semibold">
              Cross-Functional Synthesis
            </span>
          </div>

          {/* Right: The Integrated Operator (Kel Nnorom) */}
          <div className="lg:col-span-5 p-6 md:p-8 rounded-xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)] flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[var(--accent-gold)]" /> Kel Nnorom
                </span>
                <span className="text-[11px] font-semibold text-[var(--accent-gold)]">Integrated Operator</span>
              </div>

              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                Understands How the Entire System Interacts
              </h3>
              <p className="text-xs text-[var(--muted)] mb-6">
                Synchronizes technical infrastructure, digital marketing, supply chain distribution, and commercial metrics into a unified operating engine.
              </p>

              <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-3">
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0" />
                  <span className="text-[var(--foreground)]">
                    <strong className="font-semibold text-[var(--accent-gold)]">Digital to Physical:</strong> Bridges web analytics and SEO directly with last-mile fleet logistics and warehouse TMS.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tech)] mt-1.5 shrink-0" />
                  <span className="text-[var(--foreground)]">
                    <strong className="font-semibold text-[var(--accent-tech)]">Data to P&L:</strong> Converts operational telemetry (fuel, OTIF, ad CPMs) into bottom-line EBITDA improvements.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] mt-1.5 shrink-0" />
                  <span className="text-[var(--foreground)]">
                    <strong className="font-semibold text-[var(--success)]">People & Systems:</strong> Aligns developers, editorial teams, and logistics personnel behind shared quantitative KPIs.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] text-xs font-medium text-[var(--accent-gold)]">
              Result: Measurable cost reduction, higher OTIF, and scalable operational leverage.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
