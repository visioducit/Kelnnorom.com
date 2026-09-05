import { useState, useEffect } from 'react';
import { ListOrdered, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<TocItem[]>([]);

  useEffect(() => {
    // Extract headings from markdown content
    const lines = content.split('\n');
    const items: TocItem[] = [];

    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        const text = line.replace('### ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        items.push({ id, text, level: 3 });
      } else if (line.startsWith('#### ')) {
        const text = line.replace('#### ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        items.push({ id, text, level: 4 });
      }
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 140;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(headings[i].id);
          return;
        }
      }
      if (headings.length > 0 && window.scrollY < 200) {
        setActiveId(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] p-5 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)] text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)]">
        <ListOrdered size={15} />
        <span>Table of Contents</span>
      </div>

      <nav className="mt-4 space-y-1.5" aria-label="Table of Contents">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`w-full text-left flex items-start gap-2 py-1.5 px-2 rounded-lg text-xs transition-all cursor-pointer ${
                item.level === 4 ? 'pl-5 text-[11px]' : ''
              } ${
                isActive
                  ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] font-bold'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
              }`}
            >
              <ChevronRight
                size={12}
                className={`shrink-0 mt-0.5 transition-transform ${
                  isActive ? 'text-[var(--accent-gold)] translate-x-0.5' : 'opacity-40'
                }`}
              />
              <span className="line-clamp-2 leading-relaxed">{item.text}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
