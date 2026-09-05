import React, { useState } from 'react';
import {
  Check,
  Copy,
  Quote,
  Maximize2,
  X,
  Sparkles,
} from 'lucide-react';

interface ContentRendererProps {
  content: string;
  postSlug?: string;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Helper to parse custom shortcodes and markdown blocks
  const parseBlocks = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let blockIndex = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join('\n').trim();
        if (text) {
          elements.push(
            <p key={`p-${blockIndex++}`} className="my-5 text-base sm:text-lg leading-[1.8] text-[var(--foreground)] opacity-90">
              {renderInlineMarkdown(text)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start / End
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          const codeString = codeBuffer.join('\n');
          const idx = blockIndex++;
          const isCopied = copiedCodeIdx === idx;
          elements.push(
            <div key={`code-${idx}`} className="my-6 rounded-2xl overflow-hidden bg-[#12161F] border border-[#232936] shadow-xl text-left">
              <div className="px-4 py-2.5 bg-[#181E29] border-b border-[#232936] flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="uppercase text-[var(--accent-gold)] font-bold">{codeLanguage || 'CODE'}</span>
                <button
                  onClick={() => handleCopyCode(codeString, idx)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#232936] text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span className="text-[11px]">{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-gray-100 leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          flushParagraph();
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Check Shortcodes
      // 1. [callout: title=... | text=...]
      if (line.startsWith('[callout:') && line.endsWith(']')) {
        flushParagraph();
        const inner = line.slice(9, -1);
        const parts = inner.split('|');
        let title = 'Key Insight';
        let text = inner;
        parts.forEach((p) => {
          const [k, ...v] = p.split('=');
          if (k?.trim() === 'title') title = v.join('=').trim();
          if (k?.trim() === 'text') text = v.join('=').trim();
        });
        elements.push(
          <div key={`callout-${blockIndex++}`} className="my-7 p-5 sm:p-6 rounded-2xl bg-[var(--surface-elevated)] border-l-4 border-l-[var(--accent-gold)] border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-2 text-[var(--accent-gold)] font-bold text-xs uppercase tracking-wider font-mono mb-2">
              <Sparkles size={16} />
              <span>{title}</span>
            </div>
            <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed font-medium">
              {text}
            </p>
          </div>
        );
        continue;
      }

      // 2. [metric: value=... | label=... | context=...]
      if (line.startsWith('[metric:') && line.endsWith(']')) {
        flushParagraph();
        const inner = line.slice(8, -1);
        const parts = inner.split('|');
        let value = '';
        let label = '';
        let context = '';
        parts.forEach((p) => {
          const [k, ...v] = p.split('=');
          if (k?.trim() === 'value') value = v.join('=').trim();
          if (k?.trim() === 'label') label = v.join('=').trim();
          if (k?.trim() === 'context') context = v.join('=').trim();
        });
        elements.push(
          <div key={`metric-${blockIndex++}`} className="my-6 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--accent-gold)] tracking-tight">
                {value}
              </div>
              <div className="text-sm font-bold text-[var(--foreground)] mt-1">{label}</div>
            </div>
            {context && (
              <div className="text-xs text-[var(--muted)] max-w-xs font-mono bg-[var(--surface-elevated)] px-3 py-2 rounded-xl border border-[var(--border)]">
                {context}
              </div>
            )}
          </div>
        );
        continue;
      }

      // 3. [quote: text=... | author=...]
      if (line.startsWith('[quote:') && line.endsWith(']')) {
        flushParagraph();
        const inner = line.slice(7, -1);
        const parts = inner.split('|');
        let text = inner;
        let author = '';
        parts.forEach((p) => {
          const [k, ...v] = p.split('=');
          if (k?.trim() === 'text') text = v.join('=').trim();
          if (k?.trim() === 'author') author = v.join('=').trim();
        });
        elements.push(
          <blockquote key={`quote-${blockIndex++}`} className="my-8 p-6 sm:p-8 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] relative overflow-hidden">
            <Quote className="absolute right-4 bottom-4 w-20 h-20 text-[var(--accent-gold)]/10 pointer-events-none" />
            <p className="text-lg sm:text-xl font-serif italic text-[var(--foreground)] leading-relaxed">
              &ldquo;{text}&rdquo;
            </p>
            {author && (
              <cite className="block mt-4 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] not-italic">
                — {author}
              </cite>
            )}
          </blockquote>
        );
        continue;
      }

      // 4. [image: url=... | alt=... | caption=...]
      if (line.startsWith('[image:') && line.endsWith(']')) {
        flushParagraph();
        const inner = line.slice(7, -1);
        const parts = inner.split('|');
        let url = '';
        let alt = 'Operational Image';
        let caption = '';
        parts.forEach((p) => {
          const [k, ...v] = p.split('=');
          if (k?.trim() === 'url') url = v.join('=').trim();
          if (k?.trim() === 'alt') alt = v.join('=').trim();
          if (k?.trim() === 'caption') caption = v.join('=').trim();
        });
        if (url) {
          elements.push(
            <figure key={`img-${blockIndex++}`} className="my-8 rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] group">
              <div className="relative overflow-hidden cursor-pointer" onClick={() => setZoomedImage({ src: url, alt, caption })}>
                <img
                  src={url}
                  alt={alt}
                  className="w-full h-auto max-h-[500px] object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} />
                </div>
              </div>
              {caption && (
                <figcaption className="px-5 py-3 text-xs text-[var(--muted)] italic bg-[var(--surface-elevated)] border-t border-[var(--border)]">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }
        continue;
      }

      // Headings (H3, H4) with Anchor IDs for TOC
      if (line.startsWith('### ')) {
        flushParagraph();
        const headingText = line.replace('### ', '').trim();
        const anchorId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h3 id={anchorId} key={`h3-${blockIndex++}`} className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-10 mb-4 pt-4 border-t border-[var(--border)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
            <span>{headingText}</span>
          </h3>
        );
        continue;
      }

      if (line.startsWith('#### ')) {
        flushParagraph();
        const headingText = line.replace('#### ', '').trim();
        const anchorId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h4 id={anchorId} key={`h4-${blockIndex++}`} className="text-lg sm:text-xl font-bold text-[var(--foreground)] mt-6 mb-3">
            {headingText}
          </h4>
        );
        continue;
      }

      // Divider
      if (line.trim() === '---') {
        flushParagraph();
        elements.push(<hr key={`hr-${blockIndex++}`} className="my-8 border-[var(--border)]" />);
        continue;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        flushParagraph();
        const itemText = line.substring(2).trim();
        elements.push(
          <li key={`li-${blockIndex++}`} className="ml-6 list-disc my-2 text-base text-[var(--foreground)] leading-relaxed">
            {renderInlineMarkdown(itemText)}
          </li>
        );
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        flushParagraph();
        const itemText = line.replace(/^\d+\.\s/, '').trim();
        elements.push(
          <li key={`oli-${blockIndex++}`} className="ml-6 list-decimal my-2 text-base text-[var(--foreground)] leading-relaxed">
            {renderInlineMarkdown(itemText)}
          </li>
        );
        continue;
      }

      // Standard text line
      if (line.trim() === '') {
        flushParagraph();
      } else {
        currentParagraph.push(line);
      }
    }

    flushParagraph();
    return elements;
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-[var(--foreground)]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-[var(--foreground)]">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--accent-gold)]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="blog-content-body prose prose-invert max-w-none text-[var(--foreground)]">
      {parseBlocks(content)}

      {/* Lightbox Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-5xl w-full bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
            <img src={zoomedImage.src} alt={zoomedImage.alt} className="w-full max-h-[80vh] object-contain" />
            {zoomedImage.caption && (
              <div className="p-4 bg-[var(--surface-elevated)] border-t border-[var(--border)] text-xs text-[var(--muted)] text-center">
                {zoomedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
