import { useState } from 'react';
import {
  Share2,
  Check,
  Copy,
  MessageCircle,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  QrCode,
  Send,
} from 'lucide-react';
import { useCms } from '@/lib/cms-store';
import { QrCodeShareModal } from './QrCodeShareModal';

interface SocialShareBarProps {
  slug: string;
  title: string;
  url?: string;
  orientation?: 'horizontal' | 'vertical';
  showQrTrigger?: boolean;
}

export function SocialShareBar({
  slug,
  title,
  url,
  orientation = 'horizontal',
  showQrTrigger = true,
}: SocialShareBarProps) {
  const { recordShare } = useCms();
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : `https://kelnnorom.com/insights/${slug}`);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`${title} — Strategic Briefing by Kel Nnorom`);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    recordShare(slug, 'copied');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareClick = (
    network: 'whatsapp' | 'linkedin' | 'twitter' | 'facebook' | 'reddit' | 'telegram' | 'email',
    link: string
  ) => {
    recordShare(slug, network);
    if (typeof window !== 'undefined') {
      if (network === 'email') {
        window.location.href = link;
      } else {
        window.open(link, '_blank', 'noopener,noreferrer,width=600,height=500');
      }
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — Kel Nnorom`,
          text: `Read this strategic operational briefing by Kel Nnorom.`,
          url: shareUrl,
        });
        recordShare(slug, 'copied');
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-[#0077b5] hover:text-white',
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      action: () =>
        handleShareClick('linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`),
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'hover:bg-black hover:text-white',
      link: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      action: () =>
        handleShareClick(
          'twitter',
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        ),
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-[#25D366] hover:text-white',
      link: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      action: () => handleShareClick('whatsapp', `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`),
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'hover:bg-[#0088cc] hover:text-white',
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      action: () =>
        handleShareClick(
          'telegram',
          `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        ),
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-[#1877F2] hover:text-white',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      action: () =>
        handleShareClick('facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
    },
    {
      name: 'Email Briefing',
      icon: Mail,
      color: 'hover:bg-amber-600 hover:text-white',
      link: `mailto:?subject=${encodedTitle}&body=I thought you would find this operational briefing by Kel Nnorom insightful:%0A%0A${encodedUrl}`,
      action: () =>
        handleShareClick(
          'email',
          `mailto:?subject=${encodedTitle}&body=I thought you would find this operational briefing by Kel Nnorom insightful:%0A%0A${encodedUrl}`
        ),
    },
  ];

  if (orientation === 'vertical') {
    return (
      <>
        <div className="flex flex-col items-center gap-2 bg-[var(--surface-elevated)] p-2 rounded-2xl border border-[var(--border)] shadow-md">
          <span className="text-[10px] font-mono text-[var(--muted)] font-bold uppercase py-1">
            Share
          </span>
          {shareLinks.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={`p-2.5 rounded-xl text-[var(--muted)] bg-[var(--surface)] transition-all cursor-pointer ${item.color}`}
                title={`Share on ${item.name}`}
                aria-label={`Share on ${item.name}`}
              >
                <Icon size={15} />
              </button>
            );
          })}

          {showQrTrigger && (
            <button
              onClick={() => setIsQrOpen(true)}
              className="p-2.5 rounded-xl text-[var(--muted)] bg-[var(--surface)] hover:bg-[var(--accent-gold)] hover:text-black transition-all cursor-pointer"
              title="Open QR Code for Mobile Reading"
              aria-label="Mobile QR Code"
            >
              <QrCode size={15} />
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`p-2.5 rounded-xl text-[var(--muted)] bg-[var(--surface)] transition-all cursor-pointer hover:bg-[var(--accent-gold)] hover:text-black ${
              copied ? 'bg-emerald-500 text-white' : ''
            }`}
            title="Copy link"
            aria-label="Copy link"
          >
            {copied ? <Check size={15} className="text-white" /> : <Copy size={15} />}
          </button>
        </div>

        <QrCodeShareModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          title={title}
          url={shareUrl}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center shrink-0">
            <Share2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--foreground)] block">
              Share this Executive Briefing
            </span>
            <span className="text-[11px] text-[var(--muted)]">
              Syndicate across executive boards and professional channels
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {shareLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={item.action}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] transition-all cursor-pointer ${item.color}`}
                title={`Share on ${item.name}`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{item.name}</span>
              </button>
            );
          })}

          {showQrTrigger && (
            <button
              onClick={() => setIsQrOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all cursor-pointer"
              title="Mobile QR Code"
            >
              <QrCode size={13} />
              <span className="hidden md:inline">Mobile QR</span>
            </button>
          )}

          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
            >
              <Share2 size={13} />
              <span>More</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                : 'bg-[var(--accent-gold)] text-black border-[var(--accent-gold)] hover:brightness-110 shadow-xs'
            }`}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      <QrCodeShareModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        title={title}
        url={shareUrl}
      />
    </>
  );
}
