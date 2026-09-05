import { useState } from 'react';
import { X, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';

interface QrCodeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function QrCodeShareModal({ isOpen, onClose, title, url }: QrCodeShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use a reliable QR Code rendering API with fallback
  const encodedUrl = encodeURIComponent(url);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUrl}&margin=10&color=0-0-0&bgcolor=255-255-255`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl p-6 text-center text-[var(--foreground)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center mx-auto mb-3">
          <Smartphone size={24} />
        </div>

        <h3 className="text-lg font-bold font-['Inter_Tight',sans-serif] text-[var(--foreground)] mb-1">
          Read on Mobile
        </h3>

        <p className="text-xs text-[var(--muted)] leading-relaxed mb-5 max-w-xs mx-auto">
          Scan this QR code with your phone&apos;s camera to seamlessly continue reading &ldquo;{title}&rdquo;.
        </p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border border-[var(--border)] inline-block shadow-inner mb-5">
          <img
            src={qrImageUrl}
            alt={`QR code for ${title}`}
            width={180}
            height={180}
            className="rounded-lg mx-auto"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Copy Link Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-[var(--surface-elevated)] hover:bg-[var(--border)] text-[var(--foreground)] border border-[var(--border)]'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Link Copied' : 'Copy Direct Link'}</span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold hover:brightness-110 transition-all cursor-pointer"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
