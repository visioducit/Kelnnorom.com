import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipToContent } from './SkipToContent';
import { WhatsAppFloatingWidget } from './WhatsAppFloatingWidget';
import { useCms } from '@/lib/cms-store';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: ReactNode }) {
  const { state } = useCms();
  const hasAnnouncement = Boolean(state.settings?.enableAnnouncementBar && state.settings.announcementText);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <SkipToContent />
      <Header />
      <main
        id="main-content"
        className={cn('flex-1 transition-[padding] duration-300', hasAnnouncement ? 'pt-24 lg:pt-28' : 'pt-16 lg:pt-20')}
      >
        {children}
      </main>
      <Footer />
      <WhatsAppFloatingWidget />
    </div>
  );
}
