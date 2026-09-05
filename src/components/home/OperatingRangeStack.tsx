import { useState } from 'react';
import { ChevronRight, ArrowDown } from 'lucide-react';

interface LayerDetail {
  name: string;
  category: string;
  summary: string;
  verifiedContext: string[];
}

const operatingStackLayers: LayerDetail[] = [
  {
    name: 'Customer',
    category: 'Commercial Discovery',
    summary: 'Understanding customer journeys, purchase behavior, and onboarding friction across digital and physical touchpoints.',
    verifiedContext: ['Tastee Fried Chicken (Frontline execution)', 'TopCheck (Insurance applicant journey)', 'iROKO (Subscriber content discovery)'],
  },
  {
    name: 'Commercial',
    category: 'Monetization & Strategy',
    summary: 'Connecting product delivery with pricing strategy, margin protection, and revenue reconciliation.',
    verifiedContext: ['Tastee Fried Chicken (Profitability & sales reporting)', 'TopCheck (Financial partner onboarding)', 'ZedOut (Corporate contracts & fleet yields)'],
  },
  {
    name: 'Digital',
    category: 'Web, SEO & Digital Assets',
    summary: 'Building organic search equity, high-intent traffic acquisition, and digital asset authority.',
    verifiedContext: ['BHM / ID Africa / NET (20+ web platforms)', 'TopCheck (SEO & content marketing)', 'ZedOut (Online reputation & digital assets)'],
  },
  {
    name: 'Technology',
    category: 'Software, Architecture & Tools',
    summary: 'Deploying and integrating ERP, CMS, TMS, WMS, and ad-tech architectures.',
    verifiedContext: ['BHM Group (6 Linux servers & web stack)', 'TopCheck (Fintech comparison engine)', 'Official Shoppers Warehouse (TMS & GPS tracking)'],
  },
  {
    name: 'Data',
    category: 'Telemetry & KPI Systems',
    summary: 'Designing data pipelines, performance reporting, and actionable executive telemetry.',
    verifiedContext: ['iROKO (Content performance & metadata analytics)', 'BHM / NET (Traffic & programmatic ad yields)', 'Official Shoppers Warehouse (Logistics KPIs & fuel analysis)'],
  },
  {
    name: 'People',
    category: 'Team Leadership & Coordination',
    summary: 'Recruiting, mentoring, and directing cross-functional teams, external vendors, and field personnel.',
    verifiedContext: ['iROKO (11+ content operations specialists)', 'Official Shoppers Warehouse (15+ logistics personnel & drivers)', 'BHM Group (Developers & agency partners)'],
  },
  {
    name: 'Operations',
    category: 'Workflow & Process Engineering',
    summary: 'Establishing standardized operating procedures (SOPs), quality assurance, and bottleneck elimination.',
    verifiedContext: ['Tastee Fried Chicken (Operational audit compliance)', 'TopCheck (Insurance digitization workflows)', 'Official Shoppers Warehouse (Distribution SOPs)'],
  },
  {
    name: 'Infrastructure',
    category: 'Platforms, Servers & Warehouses',
    summary: 'Managing physical and digital infrastructure for high uptime, physical throughput, and security.',
    verifiedContext: ['BHM / NET (Dedicated web hosting servers)', 'Official Shoppers Warehouse (Multi-category distribution facility)', 'ZedOut (Fleet vehicle asset management)'],
  },
  {
    name: 'Logistics',
    category: 'Fleet, Routing & Supply Chain',
    summary: 'Optimizing route planning, fuel consumption, delivery speed, and OTIF dispatch performance.',
    verifiedContext: ['ZedOut (E-hailing & vehicle dispatch operations)', 'Official Shoppers Warehouse (FMCG, electronics & beverage distribution)'],
  },
  {
    name: 'Revenue',
    category: 'Bottom-Line Financial Performance',
    summary: 'Driving top-line growth while aggressively engineering unit cost reductions and margin expansion.',
    verifiedContext: ['Official Shoppers Warehouse (20% lower cost/delivery, 25% lower fuel expense)', 'BHM / NET (Digital ad monetization)', 'ZedOut (Ecosystem revenue growth)'],
  },
];

export function OperatingRangeStack() {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(4); // Default to Data
  const currentLayer = operatingStackLayers[selectedLayerIndex];

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--surface)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-2 text-[var(--accent-gold)]">The Operating Range</div>
          <h2 className="headline-section text-[var(--foreground)] mb-6">
            One Operator. Many Systems.
          </h2>
          <p className="body-text text-base md:text-lg text-[var(--muted)] leading-relaxed">
            Across different industries, the operating environment changes. The underlying problem often does not: 
            How do you make people, processes, technology, data, and commercial objectives work together seamlessly?
          </p>
          <div className="inline-block mt-4 px-3 py-1.5 rounded-md bg-[var(--surface-elevated)] border border-[var(--accent-gold-soft)]/40 text-xs font-semibold text-[var(--accent-gold)]">
            &ldquo;The wider the operating range, the more connections become visible.&rdquo;
          </div>
        </div>

        {/* Interactive Operating Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 10-Layer Interactive Stack */}
          <div className="lg:col-span-6 space-y-2 select-none">
            {operatingStackLayers.map((layer, index) => {
              const isSelected = selectedLayerIndex === index;
              return (
                <div key={layer.name}>
                  <button
                    onClick={() => setSelectedLayerIndex(index)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--surface-elevated)] border-[var(--accent-gold)] text-[var(--foreground)] shadow-md translate-x-2 ring-1 ring-[var(--accent-gold)]/20'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent-tech)]'
                    }`}
                    aria-label={`Select ${layer.name} operating layer`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[var(--muted)] w-5">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-xs md:text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-[var(--accent-gold)]' : ''}`}>
                        {layer.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
                        {layer.category}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[var(--accent-gold)] rotate-90' : 'text-[var(--muted)]'}`} />
                    </div>
                  </button>

                  {/* Flow Arrow between layers */}
                  {index < operatingStackLayers.length - 1 && (
                    <div className="flex justify-center py-0.5 opacity-30 text-[var(--muted)]">
                      <ArrowDown className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Layer Inspector Detail View */}
          <div className="lg:col-span-6 sticky top-28 p-6 md:p-8 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-gold)]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                  Layer #{String(selectedLayerIndex + 1).padStart(2, '0')}: {currentLayer.name}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] font-medium">
                {currentLayer.category}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] mb-4">
              Integrated Operating Scope
            </h3>

            <p className="body-text text-sm md:text-base text-[var(--muted)] leading-relaxed mb-6">
              {currentLayer.summary}
            </p>

            <div className="pt-6 border-t border-[var(--border)]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold mb-4">
                Verified Chronological Application:
              </h4>

              <div className="space-y-2.5">
                {currentLayer.verifiedContext.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tech)] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)]">
              <span>Interactive Layer Matrix</span>
              <span className="text-[var(--accent-gold)] font-medium">10 / 10 Cohesive Dimensions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
