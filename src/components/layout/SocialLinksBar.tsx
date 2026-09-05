import React from 'react';
import { XIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';
import { Linkedin } from 'lucide-react';
import { useCms } from '@/lib/cms-store';

interface SocialLinksBarProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
  variant?: 'minimal' | 'pills' | 'cards' | 'compact' | 'default';
}

export const SocialLinksBar: React.FC<SocialLinksBarProps> = ({
  className = '',
  iconSize = 18,
  showLabels = false,
  variant = 'minimal',
}) => {
  const { state } = useCms();
  const socials = state.settings?.socials || {};
  const whatsappNumber = state.settings?.whatsappNumber || '+2348054397057';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    state.settings?.whatsappPrefillText ||
      'Hello Kel, I would like to discuss an operational advisory inquiry.'
  )}`;

  const links = [
    {
      name: 'X (Twitter)',
      handle: '@Kelnnorom',
      url: socials.x || 'https://x.com/Kelnnorom',
      icon: <XIcon size={iconSize} />,
      colorClass: 'hover:text-[var(--accent-gold)]',
    },
    {
      name: 'Facebook',
      handle: '@Kelnnorom',
      url: socials.facebook || 'https://facebook.com/Kelnnorom',
      icon: <FacebookIcon size={iconSize} />,
      colorClass: 'hover:text-blue-500',
    },
    {
      name: 'Instagram',
      handle: '@Kelnnorom',
      url: socials.instagram || 'https://instagram.com/Kelnnorom',
      icon: <InstagramIcon size={iconSize} />,
      colorClass: 'hover:text-pink-500',
    },
    {
      name: 'LinkedIn',
      handle: 'kelnnorom',
      url: socials.linkedin || 'https://linkedin.com/in/kelnnorom',
      icon: <Linkedin size={iconSize} />,
      colorClass: 'hover:text-blue-400',
    },
    {
      name: 'WhatsApp',
      handle: '+2348054397057',
      url: whatsappUrl,
      icon: <WhatsAppIcon size={iconSize} />,
      colorClass: 'hover:text-[#25D366]',
    },
  ];

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-xs font-medium text-[var(--foreground)] transition-all duration-200"
            title={`${link.name}: ${link.handle}`}
            aria-label={`${link.name}: ${link.handle}`}
          >
            <span className={link.colorClass}>{link.icon}</span>
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors">
                {link.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--foreground)]">{link.name}</div>
                <div className="text-[11px] text-[var(--muted)] font-mono">{link.handle}</div>
              </div>
            </div>
            <span className="text-xs text-[var(--accent-gold)] font-medium group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </a>
        ))}
      </div>
    );
  }

  // Default Minimal Variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          title={`${link.name}: ${link.handle}`}
          aria-label={`${link.name} (${link.handle})`}
        >
          <span className={link.colorClass}>{link.icon}</span>
          {showLabels && <span className="ml-2 text-xs font-medium">{link.name}</span>}
        </a>
      ))}
    </div>
  );
};
