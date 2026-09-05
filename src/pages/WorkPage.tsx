import { useState, useMemo } from 'react';
import { Seo } from '@/components/Seo';
import { useCms } from '@/lib/cms-store';
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard';
import { Button } from '@/components/ui/Button';
import { Filter, ArrowRight, Layers, Sparkles } from 'lucide-react';

const filterCategories = [
  'ALL',
  'Digital Operations',
  'Logistics',
  'Supply Chain',
  'Fintech',
  'Monetization',
  'Infrastructure',
  'SEO',
] as const;

function WorkPage() {
  const { state } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStudies = useMemo(() => {
    return state.caseStudies.filter((study) => {
      const matchesCat =
        selectedCategory === 'ALL' ||
        study.categories.includes(selectedCategory) ||
        study.industry.includes(selectedCategory);

      const matchesSearch =
        searchQuery.trim() === '' ||
        study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.challenge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCat && matchesSearch;
    });
  }, [state.caseStudies, selectedCategory, searchQuery]);

  return (
    <>
      <Seo
        config={{
          title: 'Case Studies & Operational Track Record | Kel Nnorom Work',
          description:
            'In-depth operational case studies: Digital media scaling (50M+ views), fintech distribution, fleet turnaround, and supply chain telemetry across Africa and global markets.',
          canonical: 'https://www.kelnnorom.com/work',
          keywords: [
            'Operational Case Studies',
            'Kel Nnorom Work',
            'Digital Media Scale Case Study',
            'IROKO Digital Content Engine',
            'Logistics Turnaround Case Study',
            'TopCheck Fintech Operations',
            'Supply Chain Transformation',
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
                  Selected Work & Operating Case Studies
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                Systems. Interventions. <span className="text-[var(--accent-gold)]">Documented Outcomes.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                The strongest evidence of an operator is not a list of responsibilities. It is what changed after they entered the system. 
                Explore 5 verified case studies across digital infrastructure, media streaming, logistics supply chains, fintech operations, and digital monetization.
              </p>

              <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-tech)] font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> 100% Verified Outcomes
                </span>
                <span>•</span>
                <span>Zero Speculative Metrics</span>
                <span>•</span>
                <span>Cross-Functional Range</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-8 border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-20 backdrop-blur-md bg-opacity-95">
          <div className="max-w-content mx-auto container-px">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <Filter className="w-4 h-4 text-[var(--muted)] shrink-0 mr-1" />
                {filterCategories.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      id={`filter-tab-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-gold)] text-white shadow-sm'
                          : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent-gold-soft)]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="w-full md:w-64">
                <input
                  type="text"
                  id="work-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search systems, roles, tools..."
                  className="w-full px-3.5 py-1.5 text-xs rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies List */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            {filteredStudies.length > 0 ? (
              <div className="space-y-10">
                {filteredStudies.map((study, idx) => (
                  <CaseStudyCard key={study.slug} study={study} index={idx} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[var(--surface)] border border-[var(--border)] max-w-xl mx-auto">
                <Layers className="w-8 h-8 text-[var(--muted)] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  No matching case studies found
                </h3>
                <p className="text-xs text-[var(--muted)] mb-6">
                  Try adjusting your filter or search query to view related operational cases.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-semibold text-[var(--accent-gold)]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Global Bottom Work Consultation CTA */}
        <section className="py-20 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="p-8 md:p-12 rounded-2xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)]/40 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                  Operational Mandates
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                  Have a system in need of optimization?
                </h2>
                <p className="body-text text-xs sm:text-sm text-[var(--muted)]">
                  Whether turning around a logistics fleet, streamlining digital platforms, or integrating data pipelines, let&apos;s evaluate the operational levers.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button to="/contact" variant="primary">
                  Discuss an Operating Challenge
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/executive-brief" variant="secondary">
                  Executive Brief
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default WorkPage;
