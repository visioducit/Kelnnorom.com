import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useCms } from '@/lib/cms-store';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Experience', href: '/experience' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Blog', href: '/#blog' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { state } = useCms();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/' && !location.hash;
    if (href === '/#blog') return location.hash === '#blog' || location.pathname === '/blog';
    if (href === '/insights') return location.pathname === '/insights' || location.pathname.startsWith('/insights/');
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    if (href === '/#blog' && location.pathname === '/') {
      const el = document.getElementById('blog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-themed'
            : 'bg-transparent border-b border-transparent'
        )}
        style={{
          backgroundColor: scrolled ? 'color-mix(in srgb, var(--background) 85%, transparent)' : 'transparent',
          borderBottomColor: scrolled ? 'var(--border)' : 'transparent',
        }}
      >
        <div className="max-w-content container-px flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-sm font-bold tracking-tight hover:text-gold transition-colors duration-300 group"
            aria-label="Kel Nnorom — Home"
          >
            <img
              src={state.settings?.faviconUrl || '/favicon.png'}
              alt="Kel Nnorom Emblem"
              referrerPolicy="no-referrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--accent-gold)]/50 shadow-xs group-hover:scale-105 transition-transform object-cover"
            />
            <span className="font-['Inter_Tight',sans-serif] tracking-wider text-xs sm:text-sm font-bold">KEL NNOROM</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
            {navItems.slice(1, -1).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'text-sm font-medium transition-colors duration-300 hover:text-gold',
                  isActive(item.href) ? 'text-gold' : 'text-foreground'
                )}
                style={{ color: isActive(item.href) ? 'var(--accent-gold)' : 'var(--foreground)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md border border-themed hover:border-gold transition-colors duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link
              to="/contact"
              onClick={() => trackEvent('work_with_kel_click', { location: 'header' })}
              className="hidden lg:inline-flex items-center text-sm font-semibold px-5 py-2.5 rounded-md bg-gold text-background hover:opacity-90 transition-opacity duration-300"
              style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--background)' }}
            >
              Work With Kel
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="absolute inset-0 bg-background"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <div className="max-w-content container-px flex items-center justify-between h-16">
              <span className="text-sm font-bold tracking-tight">KEL NNOROM</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2"
                aria-label="Close navigation menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="container-px mt-8 flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'text-2xl font-bold py-3 border-b border-themed transition-colors duration-300',
                    isActive(item.href) ? 'text-gold' : 'text-foreground'
                  )}
                  style={{
                    color: isActive(item.href) ? 'var(--accent-gold)' : 'var(--foreground)',
                    borderBottomColor: 'var(--border)',
                  }}
                >
                  {item.label.toUpperCase()}
                </Link>
              ))}
            </nav>

            <div className="container-px mt-8">
              <Link
                to="/contact"
                onClick={() => trackEvent('work_with_kel_click', { location: 'mobile_nav' })}
                className="block text-center text-sm font-semibold px-5 py-4 rounded-md bg-gold text-background"
                style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--background)' }}
              >
                WORK WITH KEL
              </Link>
            </div>

            <div className="container-px mt-12">
              <p className="meta-label mb-2">CROSS-FUNCTIONAL OPERATIONS & GROWTH STRATEGIST</p>
              <p className="text-sm text-muted" style={{ color: 'var(--muted)' }}>
                ...by all means, dream always.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
