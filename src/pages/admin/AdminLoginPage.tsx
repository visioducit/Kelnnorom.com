import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCms } from '@/lib/cms-store';
import {
  Lock,
  Shield,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import type { UserRole } from '@/types/cms';

export function AdminLoginPage() {
  const {
    login,
    logout,
    isAuthenticated,
    currentUser,
    requestLoginAccessCode,
    verifyLoginAccessCode,
    state,
  } = useCms();
  const navigate = useNavigate();
  const location = useLocation();
  const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const from = (rawFrom && rawFrom !== '/admin/login' && rawFrom !== '/login') ? rawFrom : '/admin';

  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string; codePreview?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated && currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center container-px py-16">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] flex items-center justify-center mx-auto mb-4 border border-[var(--accent-gold)]/40">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">Login Active</h1>
          <p className="text-sm text-[var(--muted)] mb-6">
            as <strong className="text-[var(--foreground)]">{currentUser?.name || 'Kel Nnorom'}</strong>
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="w-full py-3 px-4 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 transition-all shadow-md"
            >
              Login
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--surface-elevated)] text-[var(--foreground)] font-medium text-xs border border-[var(--border)] hover:border-rose-500/50 hover:text-rose-400 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle Step 1: Request OTP Access Code for submitted email
  const handleRequestCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setStatusMessage({ type: 'error', text: 'Access Denied' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    // Call state engine to generate and auto-send the Access Code
    const result = requestLoginAccessCode(email);

    setIsSubmitting(false);
    if (result.success) {
      setCodeRequested(true);
      setStatusMessage({
        type: 'success',
        text: `Access Code dispatched to ${email}. Check your registered email / executive webmail inbox.`,
        codePreview: result.code,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Access Denied',
      });
    }
  };

  // Handle Step 2: Verify Access Code and authenticate
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setStatusMessage({ type: 'error', text: 'Access Denied' });
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
        text: 'Access Denied',
      });
    }
  };

  // Optional 1-Click Access if activated by Super Admin in settings
  const handleQuickLogin = (presetEmail: string, presetRole: UserRole) => {
    setEmail(presetEmail);
    login(presetEmail, presetRole);
    navigate(from, { replace: true });
  };

  const showQuickAccess = state.settings?.enableQuickAccessDemo === true;
  const quickPresets = state.settings?.quickAccessPresets || [];

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
          {/* Header with requested updated text */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border)]">
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono">
                WELCOME HOME
              </div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Enter Your Email</h1>
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

          {/* 1-Click Access Container (Hidden by default, activatable & customizable by Super Admin) */}
          {showQuickAccess && quickPresets.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--accent-gold)]/30 animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  Quick Access Presets (Super Admin Activated)
                </span>
                <span className="text-[10px] text-[var(--accent-gold)] font-mono">1-Click</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickLogin(preset.email, preset.role)}
                    className="p-3 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-left transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[var(--accent-gold)] mb-1">
                      <span>{preset.label}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 uppercase">
                        {preset.badge || preset.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-[var(--foreground)] font-mono truncate">{preset.email}</div>
                    <div className="text-[10px] text-[var(--muted)] mt-1 line-clamp-1">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Re-engineered Email & Access Code Authentication Form */}
          {!codeRequested ? (
            /* Step 1: Submit Email to generate Access Code */
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
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
                className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-gold)]/20 disabled:opacity-50"
              >
                <span>Send Access Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: Input Access Code */
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[var(--foreground)]">
                    Access Code
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRequestCode()}
                    className="text-[11px] text-[var(--accent-gold)] hover:underline flex items-center gap-1"
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
                    maxLength={10}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-sm font-mono tracking-widest text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <KeyRound className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-3 pointer-events-none" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--muted)] mt-1.5">
                  <span>Target Email: <strong className="text-[var(--foreground)] font-mono">{email}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeRequested(false);
                      setAccessCode('');
                      setStatusMessage(null);
                    }}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] underline"
                  >
                    Change Email
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-gold)]/20 disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span>Submit Code</span>
              </button>
            </form>
          )}

          {/* Security Assurance Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-center text-[11px] text-[var(--muted)] font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Random Key Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminLoginPage;
