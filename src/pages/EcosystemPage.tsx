import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { professionalContacts } from '@/content/site-data';
import { Button } from '@/components/ui/Button';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const filterCategories = ['ALL', 'Leadership Ecosystem', 'Collaborator'] as const;

function EcosystemPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredContacts = professionalContacts.filter((contact) => {
    if (selectedFilter === 'ALL') return true;
    return contact.relationshipType === selectedFilter;
  });

  return (
    <>
      <Seo
        config={{
          title: 'Executive Network & Founders Ecosystem | Kel Nnorom',
          description:
            'A 15+ year network of high-caliber founders, executive leaders, technical specialists, and operating collaborators across African tech and global markets.',
          canonical: 'https://www.kelnnorom.com/ecosystem',
          keywords: [
            'Kel Nnorom Ecosystem',
            'African Tech Founders Network',
            'Executive Collaboration Network',
            'Venture Operations Leaders',
            'IROKO Tech Network',
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
                  Professional Ecosystem
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                Built in Collaboration. <br />
                <span className="text-[var(--accent-gold)]">A Network of Founders & Specialists.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                No complex system is built in isolation. Over 15+ years, Kel has worked alongside visionary tech founders, executive leaders, and specialized engineering collaborators across media streaming, fintech, PR, logistics, and supply chain.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Relationships
                </span>
                <span>•</span>
                <span>Founders & Executives</span>
                <span>•</span>
                <span>Specialized Collaborators</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-[var(--border)] bg-[var(--surface)] sticky top-16 z-20 backdrop-blur-md bg-opacity-95">
          <div className="max-w-content mx-auto container-px flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-[var(--muted)] shrink-0 mr-1" />
              {filterCategories.map((cat) => {
                const isSelected = selectedFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-gold)] text-white shadow-sm'
                        : 'bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {cat === 'ALL' ? 'ALL RELATIONSHIPS' : cat.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-[var(--muted)] hidden sm:inline">
              {filteredContacts.length} Verified Network Members
            </span>
          </div>
        </section>

        {/* Professional Network Grid */}
        <section className="py-16 md:py-24 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact, idx) => {
                const isLeadership = contact.relationshipType === 'Leadership Ecosystem';
                return (
                  <article
                    key={idx}
                    className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all duration-300 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                            isLeadership
                              ? 'bg-[var(--accent-gold)]/15 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                              : 'bg-[var(--accent-tech)]/15 border-[var(--accent-tech)]/40 text-[var(--accent-tech)]'
                          }`}
                        >
                          {contact.relationshipType}
                        </span>

                        {contact.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--success)]">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-1">
                        {contact.name}
                      </h2>

                      {contact.organization && (
                        <div className="text-xs font-semibold text-[var(--accent-gold)] flex items-center gap-1.5 mb-2">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{contact.organization}</span>
                        </div>
                      )}

                      {contact.role && (
                        <div className="text-xs font-mono text-[var(--muted)] mb-4">
                          Specialization: <span className="text-[var(--foreground)] font-medium">{contact.role}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] font-mono text-[var(--muted)] flex items-center justify-between">
                      <span>Operational Intersection</span>
                      <Link
                        to="/experience"
                        className="text-[var(--accent-gold)] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>History</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Operating Context Banner */}
        <section className="py-16 md:py-20 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="p-8 md:p-12 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-xs font-mono uppercase text-[var(--accent-gold)] font-bold mb-2">
                  Founder Trust
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  High-Stakes Operating Autonomy
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Trusted by high-growth founders to manage digital platforms, content security, and physical fleet operations with strict fiduciary discipline.
                </p>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-[var(--accent-tech)] font-bold mb-2">
                  Technical Synergy
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  Cross-Disciplinary Translation
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Deeply fluent in technical architectures (Ruby, Node, SEO, UI/UX) to translate engineering capabilities into bottom-line commercial outcomes.
                </p>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-[var(--muted)] font-bold mb-2">
                  Vendor Governance
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                  Ecosystem Management
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Direct management of complex multi-stakeholder ecosystems including logistics contractors, telecom aggregators, and enterprise software vendors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Global Bottom CTA */}
        <section className="py-20 bg-[var(--background)]">
          <div className="max-w-content mx-auto container-px text-center">
            <div className="max-w-2xl mx-auto">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                Join the Network
              </div>
              <h2 className="text-3xl font-extrabold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-4">
                Let&apos;s build something together.
              </h2>
              <p className="body-text text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8">
                Connect for strategic advisory, joint operational ventures, or executive leadership collaboration.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button to="/contact" variant="primary">
                  Connect with Kel
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

export default EcosystemPage;
