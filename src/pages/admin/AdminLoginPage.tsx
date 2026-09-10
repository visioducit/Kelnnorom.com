import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCms } from '@/lib/cms-store';
import {
  Lock,
  Shield,
  ArrowLeft,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';

export function AdminLoginPage() {
  const {
    currentUser,
    requestLoginAccessCode,
    verifyLoginAccessCode,
  } = useCms();
  const navigate = useNavigate();
  const location = useLocation();
  const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const from = (rawFrom && rawFrom !== '/admin/login' && rawFrom !== '/login') ? rawFrom : '/admin';

  // Email input starts completely empty - no suggested or prefilled emails
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
    codePreview?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Step 1: Request fresh OTP Access Code for submitted email
  const handleRequestCode = (e?: React.FormEvent, overrideEmail?: string) => {
    if (e) e.preventDefault();
    const targetEmail = (overrideEmail || email).trim().toLowerCase();

    if (!targetEmail) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid administrator email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // Call state engine to generate, store, and dispatch the single-use Access Code
    const result = requestLoginAccessCode(targetEmail);

    setIsSubmitting(false);
    if (result.success) {
      setCodeRequested(true);
      setStatusMessage({
        type: 'success',
        text: `Fresh Access Code dispatched to ${targetEmail}. Check your registered email / executive webmail inbox.`,
        codePreview: result.code,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message || 'Access Denied: Unrecognized administrator email.',
      });
    }
  };

  // Handle Step 2: Verify Access Code and re-authenticate session
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter the 6-digit access code.' });
      return;
    }

    setIsSubmitting(true);
    const result = verifyLoginAccessCode(email, accessCode);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Access Denied: Invalid or expired access code. Please verify and try again.',
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center container-px py-12">
      <div className="w-full max-w-lg">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent-gold)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono">
                {currentUser ? 'RE-AUTHENTICATION REQUIRED' : 'WELCOME HOME'}
              </div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                {currentUser ? 'Confirm Administrative Session' : 'Enter Your Email'}
              </h1>
            </div>
          </div>

          {/* Feedback & Status Message */}
          {statusMessage && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs font-medium border flex items-start gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              ) : (
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
              )}
              <div className="flex-1">
                <p>{statusMessage.text}</p>
                {statusMessage.codePreview && (
                  <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                    <span className="text-[11px] opacity-80">Security Notice Code:</span>
                    <span className="font-mono font-bold tracking-widest text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-sm">
                      {statusMessage.codePreview}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Authentication Workflow */}
          {!codeRequested ? (
            /* Step 1: Submit Email to generate single-use Access Code */
            <form
              action="javascript:void(0);"
              method="post"
              onSubmit={(e) => handleRequestCode(e)}
              className="space-y-4"
            >
              <div>
                <div className="relative">
                  <input
                    type="email"
                    name="admin_login_email"
                    id="admin_login_email"
                    required
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    data-lpignore="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-gold)]/20 disabled:opacity-50 cursor-pointer"
              >
                <span>Send Access Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: Input Access Code to verify and complete authentication */
            <form
              action="javascript:void(0);"
              method="post"
              onSubmit={handleVerifyCode}
              className="space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[var(--foreground)]">
                    Access Code
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRequestCode()}
                    className="text-[11px] text-[var(--accent-gold)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={12}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-sm font-mono tracking-widest text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <KeyRound className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-3 pointer-events-none" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--muted)] mt-1.5">
                  <span>Target: <strong className="text-[var(--foreground)] font-mono">{email}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeRequested(false);
                      setAccessCode('');
                      setStatusMessage(null);
                    }}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-gold)]/20 disabled:opacity-50 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Verify & Authenticate</span>
              </button>
            </form>
          )}

          {/* Security Assurance Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)] font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Re-Authentication Policy Enforced
            </span>
            <span>Single-Use OTP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
