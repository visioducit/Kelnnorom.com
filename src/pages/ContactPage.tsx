import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/ui/Button';
import { useCms } from '@/lib/cms-store';
import {
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { SocialLinksBar } from '@/components/layout/SocialLinksBar';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

const areaOptions = [
  'Operational Transformation',
  'Digital Strategy',
  'Digital Operations',
  'Digital Asset Management',
  'Logistics / Operations',
  'Supply Chain',
  'Advisory',
  'Fractional Leadership',
  'Strategic Collaboration',
] as const;

function ContactPage() {
  const { state } = useCms();
  const cleanPhone = (state.settings?.whatsappNumber || '').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    state.settings.whatsappPrefillText || 'Hello Kel, I would like to discuss an operational inquiry.'
  )}`;

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    challenge: '',
    area: 'Operational Transformation',
    budget: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
    }
  };

  return (
    <>
      <Seo
        config={{
          title: 'Contact & Retain Advisory Services | Kel Nnorom',
          description:
            'Initiate an executive advisory dialogue or operational audit with Kel Nnorom. Strategic consulting across business turnarounds, logistics, and digital architecture.',
          canonical: 'https://www.kelnnorom.com/contact',
          keywords: [
            'Contact Kel Nnorom',
            'Retain Operations Advisor',
            'Business Turnaround Consultant Lagos',
            'Supply Chain Consultant Nigeria',
            'Digital Systems Advisory',
          ],
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: 'Contact Kel Nnorom',
              url: 'https://www.kelnnorom.com/contact',
              mainEntity: {
                '@type': 'Person',
                name: 'Kel Nnorom',
                telephone: '+2348054397057',
                email: 'kel@kelnnorom.com',
              },
            },
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
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-gold)] font-mono">
                  Operating Engagement & Advisory
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] font-['Inter_Tight',sans-serif] leading-[1.05] mb-6">
                Have a Complex Problem? <br />
                <span className="text-[var(--accent-gold)]">Let&apos;s Start a Conversation.</span>
              </h1>

              <p className="body-text text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6">
                If the challenge sits somewhere between operations, technology, growth, data, and execution, it is worth an exploratory dialogue.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--muted)]">
                <span className="flex items-center gap-1 text-[var(--accent-gold)] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Executive Access
                </span>
                <span>•</span>
                <span>Confidential Advisory</span>
                <span>•</span>
                <span>48-Hour Response SLA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content & Form Grid */}
        <section className="py-16 md:py-24 bg-[var(--surface)]">
          <div className="max-w-content mx-auto container-px">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Inquiries & Context */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-3">
                    Operating Mandates & Advisory
                  </h2>
                  <p className="body-text text-sm text-[var(--muted)] leading-relaxed mb-6">
                    Kel advises founders, boards, and enterprise leadership teams navigating operational bottlenecks, digital media transformations, logistics dispatch redesigns, and high-frequency supply chains.
                  </p>
                </div>

                {/* Direct Channels */}
                <div className="space-y-4">
                  {/* WhatsApp Direct Hotline */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-start gap-4 hover:bg-[#25D366]/20 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-[#25D366] text-black shrink-0">
                      <WhatsAppIcon size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-[#25D366] font-bold">
                        WhatsApp Instant Chat
                      </div>
                      <div className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#25D366] transition-colors">
                        {state.settings.whatsappNumber}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">
                        Direct 1-click mobile or desktop chat session
                      </div>
                    </div>
                  </a>

                  {/* Email */}
                  <div className="p-5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--accent-gold)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-[var(--muted)]">Direct Email</div>
                      <a
                        href={`mailto:${state.settings.contactEmail}`}
                        className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors"
                      >
                        {state.settings.contactEmail}
                      </a>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">Operating briefings & formal advisory</div>
                    </div>
                  </div>

                  {/* Turnaround Time */}
                  <div className="p-5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono uppercase text-[var(--muted)]">Turnaround Time</div>
                      <div className="text-sm font-bold text-[var(--foreground)]">Within 24–48 Business Hours</div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">All inquiries are reviewed personally</div>
                    </div>
                  </div>
                </div>

                {/* Social Channels Callout */}
                <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
                    Socialize with Kel
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    Connect across X (formerly Twitter), Facebook, Instagram, and LinkedIn.
                  </p>
                  <div className="pt-2">
                    <SocialLinksBar showLabels={true} variant="default" />
                  </div>
                </div>

                {/* Quick Consultation Callout */}
                <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border-2 border-[var(--accent-gold)]/30">
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">
                    Need an immediate overview?
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
                    Review the executive brief highlighting 15+ years of verified operating performance and core metrics.
                  </p>
                  <Button to="/executive-brief" variant="secondary" className="w-full justify-center">
                    View 60-Second Brief
                  </Button>
                </div>
              </div>

              {/* Right Column: Interactive Consultation Request Form */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
                  {submitted ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/20 border border-[var(--accent-gold)] text-[var(--accent-gold)] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                        Consultation Request Received
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out, {formData.name}. Kel will review your operational context and respond within 24–48 business hours.
                      </p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            organization: '',
                            email: '',
                            challenge: '',
                            area: 'Operational Transformation',
                            budget: '',
                            message: '',
                          });
                        }}
                        className="px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--accent-gold)]"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="pb-4 border-b border-[var(--border)]">
                        <h2 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)]">
                          Start a Strategic Conversation
                        </h2>
                        <p className="text-xs text-[var(--muted)] mt-1">
                          Provide brief context regarding the operational system or challenge you are seeking to evaluate.
                        </p>
                      </div>

                      {/* Name & Organization */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                            Full Name <span className="text-[var(--accent-gold)]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                            Organization / Company
                          </label>
                          <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            placeholder="e.g. Apex Logistics Ltd"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                          />
                        </div>
                      </div>

                      {/* Email & Area */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                            Email Address <span className="text-[var(--accent-gold)]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="executive@organization.com"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                            Area of Focus
                          </label>
                          <select
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-gold)] cursor-pointer"
                          >
                            {areaOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* What are you trying to solve? */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                          What is the primary system or problem you are trying to solve?
                        </label>
                        <input
                          type="text"
                          value={formData.challenge}
                          onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                          placeholder="e.g. Route optimization and fuel leakage in warehouse dispatch"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                        />
                      </div>

                      {/* Budget / Timeline */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                          Estimated Timeline / Target Implementation (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          placeholder="e.g. Q3 Turnaround / Immediate 6-month advisory"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                        />
                      </div>

                      {/* Detailed Message */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-[var(--muted)] mb-2">
                          Context / Specific Objectives
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Provide any additional background, current team structure, or technical constraints..."
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-[var(--accent-gold)] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Strategic Inquiry</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ContactPage;
