import { Link } from 'react-router-dom';

export function SkipToContent() {
  return (
    <Link
      to="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-gold focus:text-background"
      style={{
        backgroundColor: 'var(--accent-gold)',
        color: 'var(--background)',
      }}
    >
      Skip to content
    </Link>
  );
}
