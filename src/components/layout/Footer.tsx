import { Link } from 'react-router-dom';
import { SocialLinksBar } from './SocialLinksBar';
import { Shield } from 'lucide-react';
import { useCms } from '@/lib/cms-store';

const footerLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Experience', href: '/experience' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Executive Brief', href: '/executive-brief' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const year = new Date().getFullYear();
  const { state } = useCms();

  return (
    <footer
      id="global-footer"
      className="border-t border-themed mt-auto bg-[var(--surface)] text-[var(--foreground)]"
      style={{ borderTopColor: 'var(--border)' }}
    >
      <div className="max-w-content container-px section-py">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Operator Identity & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={state.settings?.faviconUrl || '/favicon.png'}
                alt="Kel Nnorom Emblem"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-[var(--accent-gold)]/50 shadow-xs object-cover"
              />
              <p className="text-lg font-bold tracking-tight text-[var(--foreground)]">
                {state.settings.siteName || 'KEL NNOROM'}
              </p>
            </div>
            <p className="meta-label mb-3 text-[var(--accent-gold)]">
              {state.settings.tagline || 'CROSS-FUNCTIONAL OPERATIONS & GROWTH STRATEGIST'}
            </p>
            <p className="text-sm text-muted mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>
              {state.settings.siteDescription ||
                'Digital systems. Business operations. Technology. Data. Growth. Logistics & multi-million warehousing.'}
            </p>

            {/* Social Links Bar */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider font-mono text-[var(--muted)] mb-2.5">
                Socialize with Kel
              </p>
              <SocialLinksBar showLabels={false} variant="compact" />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <p className="meta-label mb-4 text-[var(--accent-gold)] font-mono">NAVIGATION</p>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-[var(--accent-gold)] transition-colors duration-300 text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Direct Connect & Engagement */}
          <div>
            <p className="meta-label mb-4 text-[var(--accent-gold)] font-mono">DIRECT ENGAGEMENT</p>
            
            <div className="space-y-3">
              <a
                href={`mailto:${state.settings.contactEmail}`}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] hover:border-[var(--accent-gold)] transition-colors w-full font-mono"
              >
                <span>{state.settings.contactEmail}</span>
              </a>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center text-xs font-bold px-5 py-3 rounded-xl bg-[var(--accent-gold)] text-black hover:brightness-110 transition-all w-full shadow-md"
                >
                  START AN ENGAGEMENT →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Admin Portal Link */}
        <div className="mt-16 pt-8 border-t border-themed flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted" style={{ color: 'var(--muted)' }}>
            © {year} Kel Nnorom. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-muted" style={{ color: 'var(--muted)' }}>
            <p className="italic">
              {state.settings.executiveQuote || '...by all means, dream always.'}
            </p>
            <span>•</span>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted)] hover:text-[var(--accent-gold)] transition-colors"
            >
              <Shield size={12} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
