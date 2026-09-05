import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { capabilities, operatingStackRows } from '@/content/site-data';
import { Button } from '@/components/ui/Button';
import {
  Layers,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Truck,
  Users,
  Compass,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const capabilityIcons: Record<string, typeof Layers> = {
  Operations: Compass,
  Digital: Cpu,
  Data: Database,
  Commercial: TrendingUp,
  Technology: Cpu,
  Logistics: Truck,
  Leadership: Users,
};

const capabilityDescriptions: Record<string, string> = {
  Operations:
    'Designing, stabilizing, and running the internal architectures and execution workflows that deliver business value predictably.',
  Digital:
    'Structuring digital platforms, content pipelines, web operations, and online reputations to maximize audience discoverability and conversion.',
  Data:
    'Translating raw operational streams and telemetry into actionable KPI dashboards, decision matrices, and performance visibility.',
  Commercial:
    'Connecting operating discipline with P&L health, revenue monetization, ad tech efficiency, and customer lifetime value.',
  Technology:
    'Deploying and orchestrating enterprise software systems (ERP, WMS, TMS, CMS, Ad Tech) that bridge digital automation with physical execution.',
  Logistics:
    'Optimizing fleet assets, route dispatch, fuel accountability, warehouse throughput, and last-mile delivery across complex regional terrains.',
  Leadership:
    'Leading cross-functional personnel, managing high-stakes vendor ecosystems, and aligning technical, operational, and commercial teams.',
};

function CapabilitiesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = capabilities.filter((cat) => {
    const matchesTab = activeCategory === 'ALL' || cat.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      cat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.items.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <Seo
        config={{
          title: 'Capabilities & Systems Architecture | Kel Nnorom Operations Matrix',
          description:
            'Explore the full cross-functional capabilities matrix of Kel Nnorom: Enterprise Operations, Supply Chain Telemetry, Digital Architecture, Commercial Yield, and Technology Deployment.',
          canonical: 'https://www.kelnnorom.com/capabilities',
          keywords: [
            'Operations Capabilities',
            'Systems Architecture',
            'Supply Chain Optimization',
            'Fleet Logistics Telemetry',
            'Digital Transformation Strategy',
            'Commercial Strategy Consulting',
            'Data Architecture Operations',
          ],
        }}
      />

      <div className="w-full">
        {/* Page Hero Header */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-gold)]">
                  Operating Capability Matrix
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                Full-Spectrum Capabilities. <br />
                <span className="text-[var(--accent-gold)]">Built for Complex Operating Realities.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                Capabilities are not abstract skills. They are structured competencies honed over 15+ years of resolving operational bottlenecks across digital media, fintech, consulting, and supply chain distribution.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 7 Core Disciplines
                </span>
                <span>•</span>
                <span>45+ Documented Competencies</span>
                <span>•</span>
                <span>Zero Hypothetical Tooling</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-6 border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-20 backdrop-blur-md bg-opacity-95">
          <div className="max-w-content mx-auto container-px">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                <button
                  onClick={() => setActiveCategory('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === 'ALL'
                      ? 'bg-[var(--accent-gold)] text-white shadow-sm'
                      : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  ALL DISCIPLINES
                </button>
                {capabilities.map((cat) => {
                  const isSelected = activeCategory === cat.category;
                  return (
                    <button
                      key={cat.category}
                      onClick={() => setActiveCategory(cat.category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-gold)] text-white shadow-sm'
                          : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {cat.category}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search capabilities, tools..."
                  className="w-full pl-8 pr-3.5 py-1.5 text-xs rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7 Core Capability Modules */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="space-y-12">
              {filteredCategories.map((capGroup, idx) => {
                const IconComponent = capabilityIcons[capGroup.category] || Layers;
                return (
                  <article
                    key={capGroup.category}
                    id={`capability-group-${capGroup.category.toLowerCase()}`}
                    className="p-6 md:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all duration-300 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[var(--border)]">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent-gold)]">
                            <IconComponent className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-mono font-bold text-[var(--accent-gold)] uppercase tracking-wider">
                            DOMAIN 0{idx + 1}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-2">
                          {capGroup.category} Architecture
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                          {capabilityDescriptions[capGroup.category]}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to="/work"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--accent-gold)] hover:underline"
                        >
                          <span>View Real-World Cases</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Competency Tags Matrix */}
                    <div className="pt-6">
                      <div className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-bold mb-4">
                        Verified Execution Competencies:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {capGroup.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center gap-2.5 text-xs font-medium text-[var(--foreground)]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Operating Stack Cross-Matrix Overview */}
        <section className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="max-w-3xl mb-10">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                System Depth
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                Full-Stack Operational Coverage
              </h2>
              <p className="body-text text-xs sm:text-sm text-[var(--muted)]">
                Most operators specialize in either purely digital software workflows OR physical warehouse dispatch. Kel operates continuously across both boundaries.
              </p>
            </div>

            {/* Operating Stack Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                    <th className="p-4 font-mono font-bold uppercase text-[var(--muted)]">Operational Layer</th>
                    <th className="p-4 font-mono font-bold uppercase text-center text-[var(--muted)]">Digital</th>
                    <th className="p-4 font-mono font-bold uppercase text-center text-[var(--muted)]">Commercial</th>
                    <th className="p-4 font-mono font-bold uppercase text-center text-[var(--muted)]">Physical</th>
                    <th className="p-4 font-mono font-bold uppercase text-center text-[var(--muted)]">People</th>
                    <th className="p-4 font-mono font-bold uppercase text-center text-[var(--muted)]">Technology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {operatingStackRows.map((row) => (
                    <tr key={row.layer} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="p-4 font-semibold text-[var(--foreground)]">{row.layer}</td>
                      {(['DIGITAL', 'COMMERCIAL', 'PHYSICAL', 'PEOPLE', 'TECHNOLOGY'] as const).map((col) => {
                        const level = row.domains[col];
                        let badgeClass = 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]';
                        if (level === 'deep') badgeClass = 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-[var(--accent-gold)] font-bold';
                        if (level === 'strong') badgeClass = 'bg-[var(--accent-tech)]/15 text-[var(--accent-tech)] border-[var(--accent-tech)]/40 font-medium';
                        if (level === 'supporting') badgeClass = 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]';

                        return (
                          <td key={col} className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono uppercase border ${badgeClass}`}>
                              {level}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Global Bottom CTA */}
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Operational Partnership
              </div>
              <h2 className="text-3xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                Have an operational mandate in mind?
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                Explore how these capabilities translate into tangible financial and efficiency outcomes for your business.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button to="/contact" variant="primary">
                  Discuss an Operating Mandate
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

export default CapabilitiesPage;
