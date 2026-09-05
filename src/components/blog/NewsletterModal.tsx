import React, { useState } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  Download,
  Sliders,
  ShieldCheck,
  Zap,
  TrendingUp,
  Truck,
  Cpu,
  Layers,
  FileText,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useCms } from '@/lib/cms-store';
import type { NewsletterTopic, NewsletterFrequency, NewsletterFormat } from '@/types/cms';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: NewsletterTopic;
  source?: 'modal' | 'lead_magnet' | 'exit_intent' | 'footer' | 'inline_card';
}

export function NewsletterModal({
  isOpen,
  onClose,
  defaultTopic,
  source = 'modal',
}: NewsletterModalProps) {
  const { addSubscriber, unsubscribeByEmail } = useCms();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<NewsletterTopic[]>(
    defaultTopic ? [defaultTopic, 'turnaround'] : ['turnaround', 'logistics', 'arbitrage']
  );
  const [frequency, setFrequency] = useState<NewsletterFrequency>('monthly_memo');
  const [format, setFormat] = useState<NewsletterFormat>('executive_text');
  const [downloadLeadMagnet, setDownloadLeadMagnet] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [unsubscribeFeedback, setUnsubscribeFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTopic = (topic: NewsletterTopic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.length > 1
          ? prev.filter((t) => t !== topic)
          : prev
        : [...prev, topic]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const result = addSubscriber({
      email,
      name: name.trim() || undefined,
      organization: organization.trim() || undefined,
      role: role.trim() || undefined,
      topics: selectedTopics,
      frequency,
      format,
      source,
      leadMagnetDownloaded: downloadLeadMagnet,
    });

    if (result.success) {
      setIsSuccess(true);
      setStatusMessage(result.message);
    } else {
      setStatusMessage(result.message);
    }
  };

  const handleUnsubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const unsubscribed = unsubscribeByEmail(email);
    if (unsubscribed) {
      setUnsubscribeFeedback(`Subscription for ${email} has been deactivated.`);
    } else {
      setUnsubscribeFeedback(`No active subscription found for ${email}.`);
    }
  };

  const topicsList: { id: NewsletterTopic; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'turnaround',
      label: 'Operations & Margin Turnaround',
      desc: '90-day frameworks, EBITDA leakage elimination, and lean restructuring.',
      icon: TrendingUp,
    },
    {
      id: 'logistics',
      label: 'Supply Chain & Telemetry Systems',
      desc: 'Predictive fleet route automation, RFID IoT telemetry, and OTIF logistics.',
      icon: Truck,
    },
    {
      id: 'arbitrage',
      label: 'Ad Monetization & Digital Arbitrage',
      desc: 'High-RPM traffic yield, programmatic bidding mechanics, and digital asset governance.',
      icon: Cpu,
    },
    {
      id: 'case_notes',
      label: 'Live Turnaround Field Notes',
      desc: 'Real-time teardowns and retrospective audits of recent enterprise engagements.',
      icon: Layers,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 sm:p-8 text-[var(--foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] mb-2">
          <Zap size={14} className="text-[var(--accent-gold)]" />
          <span>Executive Briefing Dispatch</span>
        </div>

        <h2 className="text-2xl font-bold font-['Inter_Tight',sans-serif] tracking-tight text-[var(--foreground)] mb-2">
          Subscribe to Kel Nnorom&apos;s Private Strategic Memo
        </h2>

        <p className="text-xs text-[var(--muted)] leading-relaxed mb-6">
          Direct operational intelligence, margin turnaround playbooks, algorithmic yield frameworks, and field telemetry delivered without fluff.
        </p>

        {isSuccess ? (
          <div className="space-y-6 py-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                You&apos;re On The Executive List
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                {statusMessage || 'Your briefing preferences are active. Welcome to Kel Nnorom’s inner operational network.'}
              </p>
            </div>

            {downloadLeadMagnet && (
              <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] max-w-md mx-auto flex items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--foreground)]">
                      90-Day Turnaround Checklist
                    </h4>
                    <p className="text-[10px] font-mono text-[var(--muted)]">PDF Framework • 4.2 MB</p>
                  </div>
                </div>
                <a
                  href="#download-lead-magnet"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Checklist downloaded! A master PDF briefing has been queued for your session.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[var(--accent-gold)] text-black text-xs font-bold flex items-center gap-1.5 hover:brightness-110 transition-all cursor-pointer shrink-0"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
              >
                Close & Return to Briefings
              </button>
            </div>
          </div>
        ) : isManaging ? (
          /* Manage or Unsubscribe Mode */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">
                Manage Existing Subscription
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Enter your email address below to update your preferences or unsubscribe from all dispatches.
              </p>
            </div>

            {unsubscribeFeedback && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                {unsubscribeFeedback}
              </div>
            )}

            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Your Subscribed Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@organization.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-xs font-bold transition-all cursor-pointer"
                >
                  Unsubscribe from All Dispatches
                </button>
                <button
                  type="button"
                  onClick={() => setIsManaging(false)}
                  className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  Back to Sign Up
                </button>
              </div>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {statusMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {statusMessage}
              </div>
            )}

            {/* Email & Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Executive Email Address <span className="text-[var(--accent-gold)]">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-[var(--muted)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@enterprise.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Johnathan Sterling"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Organization (Optional)
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Acme Logistics Group"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Role / Title (Optional)
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Chief Operating Officer / VP Supply Chain"
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
                />
              </div>
            </div>

            {/* Strategic Topic Selection */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-2 flex items-center justify-between">
                <span>Select Briefing Topics</span>
                <span className="text-[10px] text-[var(--accent-gold)] font-bold">
                  {selectedTopics.length} selected
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {topicsList.map((item) => {
                  const Icon = item.icon;
                  const isChecked = selectedTopics.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleTopic(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-[var(--accent-gold)]/10 border-[var(--accent-gold)] text-[var(--foreground)]'
                          : 'bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isChecked
                            ? 'bg-[var(--accent-gold)] text-black font-bold'
                            : 'bg-[var(--surface)] text-[var(--muted)]'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[var(--foreground)]">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-[var(--muted)] line-clamp-1 mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferences: Frequency & Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
                  <Bell size={12} className="text-[var(--accent-gold)]" />
                  <span>Cadence</span>
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as NewsletterFrequency)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                >
                  <option value="monthly_memo">Monthly Executive Memo (Curated)</option>
                  <option value="biweekly_telemetry">Bi-Weekly Telemetry & EBITDA Logs</option>
                  <option value="instant_alerts">Instant Publishing Alerts</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
                  <Sliders size={12} className="text-[var(--accent-gold)]" />
                  <span>Delivery Format</span>
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as NewsletterFormat)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                >
                  <option value="executive_text">Executive Text Summary (Fast Read)</option>
                  <option value="pdf_digest">PDF Master Digest & Telemetry Graphs</option>
                  <option value="audio_podcast">Audio Podcast Feed Access</option>
                </select>
              </div>
            </div>

            {/* Instant Lead Magnet Download Checkbox */}
            <div className="p-3.5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={downloadLeadMagnet}
                  onChange={(e) => setDownloadLeadMagnet(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--accent-gold)] focus:ring-0 cursor-pointer accent-[var(--accent-gold)]"
                />
                <div>
                  <span className="text-xs font-bold text-[var(--foreground)] block">
                    Include the 90-Day Turnaround Framework Checklist
                  </span>
                  <span className="text-[10px] text-[var(--muted)]">
                    Instant access to the master EBITDA recovery spreadsheet & audit matrix
                  </span>
                </div>
              </label>
              <Sparkles size={16} className="text-[var(--accent-gold)] shrink-0" />
            </div>

            {/* Submit & Trust footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Strictly private. Zero spam. Unsubscribe anytime.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsManaging(true)}
                  className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] underline transition-colors cursor-pointer"
                >
                  Manage Preferences
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  <span>Confirm Dispatch</span>
                  <Zap size={13} />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
