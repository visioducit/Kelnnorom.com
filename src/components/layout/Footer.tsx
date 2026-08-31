import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const footerLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Experience', href: '/experience' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-themed mt-auto"
      style={{ borderTopColor: 'var(--border)' }}
    >
      <div className="max-w-content container-px section-py">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <p className="text-lg font-bold tracking-tight mb-3">KEL NNOROM</p>
            <p className="meta-label mb-4">CROSS-FUNCTIONAL OPERATIONS & GROWTH STRATEGIST</p>
            <p className="text-sm text-muted" style={{ color: 'var(--muted)' }}>
              Digital systems. Business operations. Technology. Data. Growth.
            </p>
          </div>

          <div>
            <p className="meta-label mb-4">NAVIGATION</p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta-label mb-4">CONNECT</p>
            <a
              href="https://www.linkedin.com/in/kelnnorom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-gold transition-colors duration-300"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>
            <div className="mt-8">
              <Link
                to="/contact"
                className="inline-flex items-center text-sm font-semibold px-5 py-2.5 rounded-md border border-themed hover:border-gold transition-colors duration-300"
                style={{ borderColor: 'var(--border)' }}
              >
                WORK WITH KEL →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-themed flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-muted" style={{ color: 'var(--muted)' }}>
            © {year} Kel Nnorom. All rights reserved.
          </p>
          <p className="text-xs text-muted italic" style={{ color: 'var(--muted)' }}>
            ...by all means, dream always.
          </p>
        </div>
      </div>
    </footer>
  );
}
