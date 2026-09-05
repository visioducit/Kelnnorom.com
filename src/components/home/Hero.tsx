import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SystemMap } from '@/components/home/SystemMap';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCms } from '@/lib/cms-store';

export function Hero() {
  const { state } = useCms();
  const settings = state.settings;

  const eyebrow = settings?.heroEyebrow || 'Cross-Functional Operations & Growth Strategist';
  const headline = settings?.heroHeadline || 'I turn complex operations into';
  const headlineHighlight = settings?.heroHeadlineHighlight || 'measurable growth';
  const pitchPoint1 = settings?.heroPitchPoint1 || 'Strategy. Digital systems. Operations. Technology. Data. Revenue. People.';
  const pitchPoint2 = settings?.heroPitchPoint2 || 'I work where these disciplines converge—architecting operating models, transforming complex businesses, and aligning capabilities to strategy. I turn complexity into scalable systems that unlock growth, strengthen performance, improve resilience, and create sustainable competitive advantage.';
  const primaryCtaText = settings?.heroPrimaryCtaText || 'Explore the Work';
  const primaryCtaLink = settings?.heroPrimaryCtaLink || '/work';
  const secondaryCtaText = settings?.heroSecondaryCtaText || "Let's Build Something";
  const secondaryCtaLink = settings?.heroSecondaryCtaLink || '/contact';
  const briefCtaText = settings?.heroBriefCtaText || 'Executive Brief (60-sec)';
  const briefCtaLink = settings?.heroBriefCtaLink || '/executive-brief';
  const credentialsDescription = settings?.heroCredentialsDescription || '15+ years operating across digital, commercial, technology and physical systems.';

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[var(--border)] overflow-hidden">
      <div className="max-w-content mx-auto container-px">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Executive Narrative & Positioning */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] w-fit mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-gold)]">
                {eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-[1.05] text-balance mb-6 font-['Inter_Tight',sans-serif]">
              {headline} <span className="text-[var(--accent-gold)]">{headlineHighlight}</span>.
            </h1>

            {/* Supporting Pitch */}
            <p className="body-text text-[var(--muted)] text-base sm:text-lg mb-8 leading-relaxed space-y-2">
              <span className="block font-medium text-[var(--foreground)]">
                {pitchPoint1}
              </span>
              <span className="block">
                {pitchPoint2}
              </span>
            </p>

            {/* Identity & Credibility Seal */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] mb-8">
              <div className="p-2.5 rounded-md bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--accent-gold)] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--foreground)] uppercase">
                  {settings?.siteName || 'KEL NNOROM'}
                </div>
                <div className="text-xs text-[var(--muted)] mt-0.5">
                  {credentialsDescription}
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <Button to={primaryCtaLink} variant="primary">
                {primaryCtaText}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button to={secondaryCtaLink} variant="secondary">
                {secondaryCtaText}
              </Button>
              <Link
                to={briefCtaLink}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-gold)] transition-colors py-2 px-1 ml-2"
              >
                <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>{briefCtaText}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive System Map */}
          <div className="lg:col-span-6 w-full">
            <SystemMap />
          </div>
        </div>
      </div>
    </section>
  );
}
