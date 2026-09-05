import { professionalContacts } from '@/content/site-data';
import { Users, Briefcase, Code } from 'lucide-react';

export function ProfessionalEcosystem() {
  const leadership = professionalContacts.filter((c) => c.relationshipType === 'Leadership Ecosystem');
  const collaborators = professionalContacts.filter((c) => c.relationshipType === 'Collaborator');

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--surface)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-2 text-[var(--accent-gold)]">Professional Ecosystem</div>
          <h2 className="headline-section text-[var(--foreground)] mb-4">
            Built in Collaboration.
          </h2>
          <p className="body-text text-base md:text-lg text-[var(--muted)] leading-relaxed">
            High-performance operations require trust, technical alignment, and strategic collaboration across founders, executives, and engineering specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Leadership & Executive Network */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
            <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)] mb-6">
              <Briefcase className="w-4 h-4 text-[var(--accent-gold)]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                Leadership Ecosystem & Founders
              </h3>
            </div>

            <div className="space-y-3">
              {leadership.map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] transition-colors hover:border-[var(--accent-gold-soft)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
                    <span className="text-sm font-bold text-[var(--foreground)]">
                      {person.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)]">
                    {person.organization}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical & Specialist Collaborators */}
          <div className="lg:col-span-6 p-6 md:p-8 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)]">
            <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)] mb-6">
              <Code className="w-4 h-4 text-[var(--accent-tech)]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-tech)] font-bold">
                Specialist Network & Engineering Associates
              </h3>
            </div>

            <div className="space-y-3">
              {collaborators.map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] transition-colors hover:border-[var(--accent-tech)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-tech)]" />
                    <span className="text-sm font-bold text-[var(--foreground)]">
                      {person.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--surface-elevated)] text-[var(--accent-tech)] border border-[var(--border)] font-medium">
                    {person.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)] font-mono">
            <Users className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            Verified professional and operational relationships across 15+ years.
          </span>
        </div>
      </div>
    </section>
  );
}
