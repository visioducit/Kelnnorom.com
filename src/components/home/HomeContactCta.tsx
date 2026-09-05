import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';

const serviceOfferings = [
  'Operational Transformation',
  'Digital Strategy & Infrastructure',
  'Logistics & Supply-Chain Optimization',
  'Digital Asset Management & SEO',
  'Fleet & Distribution Systems',
  'Fractional Operations Leadership',
  'Monetization & Commercial Strategy',
  'Advisory & Board Consulting',
];

export function HomeContactCta() {
  return (
    <section className="py-24 md:py-32 bg-[var(--surface)] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-content mx-auto container-px relative z-10">
        <div className="p-8 md:p-14 lg:p-16 rounded-3xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)]/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-gold)]">
                  Engage Kel Nnorom
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--foreground)] font-['Inter_Tight',sans-serif] tracking-tight leading-[1.08] mb-6">
                Ready to turn an operating challenge into <span className="text-[var(--accent-gold)]">measurable leverage</span>?
              </h2>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-8">
                Available for advisory engagements, operational turnarounds, digital infrastructure projects, and fractional executive leadership across Africa and global markets.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Button to="/contact" variant="primary">
                  Discuss an Operating Challenge
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button to="/executive-brief" variant="secondary">
                  Request Executive Profile
                </Button>
                <a
                  href="mailto:contact@kelnnorom.com"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors ml-2 py-2"
                >
                  <Mail className="w-4 h-4 text-[var(--accent-gold)]" />
                  <span>Direct Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right Verified Capabilities Matrix */}
            <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" />
                  Service Areas
                </span>
                <span className="text-[11px] font-mono text-[var(--accent-gold)]">
                  Available for Mandates
                </span>
              </div>

              <div className="space-y-2.5">
                {serviceOfferings.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-[var(--foreground)] font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)] text-[11px] text-[var(--muted)] italic">
                &ldquo;...by all means, dream always.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
