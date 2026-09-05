import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sliders, Sparkles, FileText, Download, Shield } from 'lucide-react';
import { useCms } from '@/lib/cms-store';
import { NewsletterModal } from './NewsletterModal';
import type { NewsletterTopic } from '@/types/cms';

interface NewsletterCardProps {
  defaultTopic?: NewsletterTopic;
  title?: string;
  subtitle?: string;
  source?: 'inline_card' | 'footer' | 'lead_magnet';
  showChecklistDownload?: boolean;
}

export function NewsletterCard({
  defaultTopic,
  title = "Subscribe to Kel Nnorom's Strategic Memo",
  subtitle = 'Monthly deep-dives on operational turnarounds, EBITDA margin protection, algorithmic arbitrage, and real-time fleet telemetry.',
  source = 'inline_card',
  showChecklistDownload = true,
}: NewsletterCardProps) {
  const { addSubscriber } = useCms();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const res = addSubscriber({
      email,
      source,
      topics: defaultTopic ? [defaultTopic, 'turnaround'] : ['turnaround', 'logistics', 'arbitrage'],
      frequency: 'monthly_memo',
      format: 'executive_text',
      leadMagnetDownloaded: showChecklistDownload,
    });

    if (res.success) {
      setIsSubscribed(true);
      setMsg(res.message);
      setEmail('');
    }
  };

  return (
    <>
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-elevated)] border border-[var(--border)] relative overflow-hidden shadow-sm">
        {/* Background accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-gold)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-gold)] mb-2">
            <Sparkles size={13} className="text-[var(--accent-gold)]" />
            <span>PRIVATE EXECUTIVE DISPATCH</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-['Inter_Tight',sans-serif] tracking-tight text-[var(--foreground)] mb-2">
            {title}
          </h3>

          <p className="text-xs text-[var(--muted)] leading-relaxed mb-6">
            {subtitle}
          </p>

          {isSubscribed ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--foreground)]">
                    Executive Memo Activated
                  </div>
                  <div className="text-[11px] text-emerald-400/90 font-mono">
                    {msg || 'You are subscribed to the private briefing distribution.'}
                  </div>
                </div>
              </div>

              {showChecklistDownload && (
                <button
                  onClick={() => alert('Downloaded Turnaround Checklist framework!')}
                  className="px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:border-[var(--accent-gold)] flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Get Checklist</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail size={15} className="absolute left-3.5 top-3.5 text-[var(--muted)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter executive email address..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)] shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <Send size={13} />
                </button>
              </form>

              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--muted)] pt-1">
                <div className="flex items-center gap-1.5">
                  <Shield size={13} className="text-emerald-400" />
                  <span>Strict confidentiality. No marketing spam.</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 text-[var(--accent-gold)] hover:underline font-mono text-[10px] uppercase font-bold cursor-pointer"
                >
                  <Sliders size={11} />
                  <span>Customize Topics & Cadence</span>
                </button>
              </div>
            </div>
          )}

          {showChecklistDownload && !isSubscribed && (
            <div className="mt-5 pt-5 border-t border-[var(--border)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-[var(--muted)]">
                <FileText size={15} className="text-[var(--accent-gold)]" />
                <span>Bonus: Includes the <strong>90-Day Turnaround Framework Checklist</strong></span>
              </div>
              <span className="text-[10px] font-mono text-[var(--muted)] uppercase px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
                PDF + XLSX
              </span>
            </div>
          )}
        </div>
      </div>

      <NewsletterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTopic={defaultTopic}
        source={source}
      />
    </>
  );
}
