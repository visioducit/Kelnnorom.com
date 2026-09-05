import { useState, useEffect, useRef } from 'react';
import { Twitter, Linkedin, MessageCircle, Copy, Check, Quote } from 'lucide-react';
import { useCms } from '@/lib/cms-store';

interface QuoteShareTooltipProps {
  articleTitle: string;
  articleSlug: string;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function QuoteShareTooltip({
  articleTitle,
  articleSlug,
  containerRef,
}: QuoteShareTooltipProps) {
  const { recordShare } = useCms();
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !containerRef.current) {
        setSelectedText('');
        setPosition(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length < 15) {
        setSelectedText('');
        setPosition(null);
        return;
      }

      // Check if selection is inside container
      const anchorNode = selection.anchorNode;
      if (!anchorNode || !containerRef.current.contains(anchorNode)) {
        setSelectedText('');
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Calculate tooltip position
      const top = rect.top + window.scrollY - 52;
      const left = Math.max(10, Math.min(window.innerWidth - 300, rect.left + window.scrollX + rect.width / 2 - 140));

      setSelectedText(text);
      setPosition({ top, left });
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, [containerRef]);

  if (!selectedText || !position) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://kelnnorom.com/insights/${articleSlug}`;
  const truncatedQuote = selectedText.length > 180 ? `${selectedText.substring(0, 177)}...` : selectedText;
  const citationText = `“${selectedText}” — Kel Nnorom, “${articleTitle}”\n${currentUrl}`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    recordShare(articleSlug, 'copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterQuote = () => {
    recordShare(articleSlug, 'twitter');
    const tweet = `“${truncatedQuote}”\n\n— via Kel Nnorom (@KelNnorom)\n${currentUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank', 'width=600,height=400');
  };

  const handleLinkedinQuote = () => {
    recordShare(articleSlug, 'linkedin');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=500');
  };

  const handleWhatsAppQuote = () => {
    recordShare(articleSlug, 'whatsapp');
    const waText = `“${truncatedQuote}”\n\n— Kel Nnorom: ${articleTitle}\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
  };

  return (
    <div
      ref={tooltipRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="absolute z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--accent-gold)]/60 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center gap-1 px-2 text-[10px] font-mono text-[var(--accent-gold)] font-bold">
        <Quote size={12} />
        <span>Quote</span>
      </div>

      <div className="h-4 w-px bg-[var(--border)]" />

      <button
        onClick={handleTwitterQuote}
        className="p-1.5 rounded-xl hover:bg-black hover:text-white text-[var(--muted)] transition-colors cursor-pointer"
        title="Share Quote on X (Twitter)"
        aria-label="Share Quote on X"
      >
        <Twitter size={14} />
      </button>

      <button
        onClick={handleLinkedinQuote}
        className="p-1.5 rounded-xl hover:bg-blue-600 hover:text-white text-[var(--muted)] transition-colors cursor-pointer"
        title="Share Quote on LinkedIn"
        aria-label="Share Quote on LinkedIn"
      >
        <Linkedin size={14} />
      </button>

      <button
        onClick={handleWhatsAppQuote}
        className="p-1.5 rounded-xl hover:bg-emerald-500 hover:text-white text-[var(--muted)] transition-colors cursor-pointer"
        title="Share Quote via WhatsApp"
        aria-label="Share Quote via WhatsApp"
      >
        <MessageCircle size={14} />
      </button>

      <div className="h-4 w-px bg-[var(--border)]" />

      <button
        onClick={handleCopyQuote}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          copied
            ? 'bg-emerald-500 text-white'
            : 'bg-[var(--accent-gold)] text-black hover:brightness-110'
        }`}
        title="Copy Quote with full citation"
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    </div>
  );
}
