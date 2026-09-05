import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useCms } from '@/lib/cms-store';

interface ReaderFeedbackProps {
  postTitle: string;
  slug: string;
}

export function ReaderFeedback({ postTitle, slug }: ReaderFeedbackProps) {
  const { recordShare } = useCms();
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not_helpful' | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleFeedback = (type: 'helpful' | 'not_helpful') => {
    setFeedbackGiven(type);
    recordShare(slug, 'copied');
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="my-10 space-y-6">
      {/* Thumbs Rating */}
      <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <MessageSquare size={16} className="text-[var(--accent-gold)]" />
            <span>Was this operational briefing insightful?</span>
          </h4>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Help shape upcoming executive essays on &ldquo;{postTitle}&rdquo;
          </p>
        </div>

        {feedbackGiven ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={15} />
            <span>Thank you for your feedback!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFeedback('helpful')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
            >
              <ThumbsUp size={14} />
              <span>Insightful</span>
            </button>
            <button
              onClick={() => handleFeedback('not_helpful')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <ThumbsDown size={14} />
              <span>Needs Depth</span>
            </button>
          </div>
        )}
      </div>

      {/* Strategic Dispatch Newsletter Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
        <div className="max-w-xl">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-gold)] mb-1">
            EXECUTIVE DISPATCH
          </div>
          <h3 className="text-xl font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-2">
            Subscribe to Kel Nnorom&apos;s Private Strategic Memo
          </h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed mb-5">
            Receive monthly breakdowns on margin turnarounds, algorithmic arbitrage, supply chain resilience, and digital asset governance. No spam, ever.
          </p>

          {subscribed ? (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <CheckCircle2 size={16} />
              <span>You have been subscribed to the private briefing list.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter executive email address..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow shrink-0 cursor-pointer"
              >
                <span>Join Memo</span>
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
