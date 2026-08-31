import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary';
type Size = 'default' | 'large';

type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  ariaLabel?: string;
};

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'default',
  className,
  ariaLabel,
}: ButtonProps) {
  const base = cn(
    'inline-flex items-center gap-2 font-semibold rounded-button transition-all duration-300 ease-premium',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-gold',
    size === 'large' ? 'px-8 py-4 text-base' : 'px-5 py-2.5 text-sm',
    className
  );

  const styles: Record<Variant, string> = {
    primary: 'bg-gold text-background hover:opacity-90',
    secondary:
      'border border-themed text-foreground hover:border-gold',
    tertiary: 'text-foreground hover:text-gold',
  };

  const content = (
    <>
      {children}
      {variant !== 'tertiary' && <ArrowRight size={size === 'large' ? 18 : 15} className="transition-transform duration-300 group-hover:translate-x-0.5" />}
    </>
  );

  const classes = cn(base, styles[variant], 'group');

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} aria-label={ariaLabel} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
