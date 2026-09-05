import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipToContent } from './SkipToContent';
import { WhatsAppFloatingWidget } from './WhatsAppFloatingWidget';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-1 pt-16 lg:pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingWidget />
    </div>
  );
}
