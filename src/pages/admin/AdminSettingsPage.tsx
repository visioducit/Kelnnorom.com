import React, { useState, useRef } from 'react';
import { useCms } from '@/lib/cms-store';
import type { SiteSettings } from '@/types/cms';
import {
  Settings,
  Save,
  Share2,
  Globe,
  Check,
  Image,
  Upload,
  RefreshCw,
  Search,
  FileCode,
  Shield,
  ExternalLink,
  Copy,
  Mail,
  Sparkles,
  Layers,
  Smartphone,
  Eye,
  Sliders,
} from 'lucide-react';
import { XIcon, FacebookIcon, InstagramIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';

type TabKey = 'assets' | 'seo' | 'webmail' | 'socials';

export function AdminSettingsPage() {
  const { state, updateSettings } = useCms();
  const [formData, setFormData] = useState<SiteSettings>({
    ...state.settings,
    faviconUrl: state.settings.faviconUrl || '/favicon.png',
    faviconAppleTouchUrl: state.settings.faviconAppleTouchUrl || '/apple-touch-icon.png',
    logoEmblemUrl: state.settings.logoEmblemUrl || '/favicon.png',
    canonicalUrl: state.settings.canonicalUrl || 'https://www.kelnnorom.com',
    defaultOgImageUrl: state.settings.defaultOgImageUrl || 'https://www.kelnnorom.com/og-image.jpg',
    googleSiteVerification: state.settings.googleSiteVerification || 'google-site-verification=kn_seo_prod_verification_2026',
    bingSiteVerification: state.settings.bingSiteVerification || 'msvalidate.01=7A3B91C4920E83D5',
    googleAnalyticsId: state.settings.googleAnalyticsId || 'G-KELNNOROM26',
    authorDefault: state.settings.authorDefault || 'Kel Nnorom',
    metaKeywords: state.settings.metaKeywords || 'Kel Nnorom, Operations Strategist, Growth Strategist, Digital Transformation, Supply Chain Optimization, Fleet Operations, Digital Asset Management, SEO Strategy, Business Turnaround, Operations Architecture',
    robotsTxt: state.settings.robotsTxt || 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /login\nSitemap: https://www.kelnnorom.com/sitemap.xml',
    sitemapUrl: state.settings.sitemapUrl || 'https://www.kelnnorom.com/sitemap.xml',
    enableStructuredSchema: state.settings.enableStructuredSchema ?? true,
  });

  const [activeTab, setActiveTab] = useState<TabKey>('assets');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const appleTouchInputRef = useRef<HTMLInputElement | null>(null);
  const ogImageInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'faviconUrl' | 'faviconAppleTouchUrl' | 'defaultOgImageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({ ...prev, [field]: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const resetToDefaultFavicon = () => {
    setFormData((prev) => ({
      ...prev,
      faviconUrl: '/favicon.png',
      faviconAppleTouchUrl: '/apple-touch-icon.png',
      logoEmblemUrl: '/favicon.png',
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono">
              SUPERADMIN PORTAL CONTROL
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 text-[10px] font-mono font-bold">
              Full Privileges
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Site Settings, Favicon & SEO Operations</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1 max-w-3xl">
            Manage global site identity, brand favicon and touch icons, SEO search engine indexing tags, live webmail domain architecture for kelnnorom.com, and social channels.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <Check size={16} />
            <span>All Settings Saved & Applied!</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-px overflow-x-auto">
        {[
          { id: 'assets' as TabKey, label: 'Favicon & Brand Assets', icon: Image },
          { id: 'seo' as TabKey, label: 'SEO Operations & Indexing', icon: Search },
          { id: 'webmail' as TabKey, label: 'Custom Domain Webmail (kelnnorom.com)', icon: Mail },
          { id: 'socials' as TabKey, label: 'Socials & Executive Identity', icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[var(--accent-gold)] text-[var(--accent-gold)] bg-[var(--surface-elevated)]/50 rounded-t-lg'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: FAVICON & BRAND ASSETS STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            {/* Live Interactive Preview Card */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[var(--accent-gold)]" />
                  <h2 className="text-sm font-bold text-[var(--foreground)]">
                    Live Browser & Device Icon Simulation
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetToDefaultFavicon}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] text-[11px] font-medium border border-[var(--border)] transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Reset to Original Emblem</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Browser Tab Mockup */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 font-bold uppercase flex items-center gap-2">
                    <Globe size={13} className="text-blue-400" />
                    <span>Desktop Browser Tab</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                    <img
                      src={formData.faviconUrl || '/favicon.png'}
                      alt="Favicon preview"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-xs object-cover border border-slate-700"
                    />
                    <span className="text-xs text-slate-200 font-medium truncate">
                      {formData.siteTitle || 'Kel Nnorom | Growth Strategist'}
                    </span>
                    <span className="text-slate-600 text-xs ml-auto">✕</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Standard 16x16 / 32x32 px favicon displayed on chrome, safari, edge tabs.
                  </p>
                </div>

                {/* 2. Apple iOS Touch Icon Mockup */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 font-bold uppercase flex items-center gap-2">
                    <Smartphone size={13} className="text-emerald-400" />
                    <span>Apple Touch Icon (iOS)</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <img
                      src={formData.faviconAppleTouchUrl || formData.faviconUrl || '/apple-touch-icon.png'}
                      alt="Apple touch icon preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Kel Nnorom</div>
                      <div className="text-[10px] text-slate-400">iOS Bookmarks & Home Screen</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    High-DPI 180x180 px icon used when users bookmark or pin to home screen.
                  </p>
                </div>

                {/* 3. Header & Footer Emblem */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 font-bold uppercase flex items-center gap-2">
                    <Sparkles size={13} className="text-[var(--accent-gold)]" />
                    <span>Header Navigation Emblem</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <img
                      src={formData.faviconUrl || '/favicon.png'}
                      alt="Emblem preview"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-[var(--accent-gold)]/50 object-cover shadow-xs"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">KEL NNOROM</div>
                      <div className="text-[10px] text-[var(--accent-gold)] font-mono">GROWTH STRATEGIST</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Dynamic circular badge rendered across the top navigation and global footer.
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Configuration Inputs */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                <Image className="w-5 h-5 text-[var(--accent-gold)]" />
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Favicon & Asset Media Configuration
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Standard Favicon (.png, .ico, .svg) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)]">
                    Primary Favicon URL / Path
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.faviconUrl}
                      onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                      placeholder="/favicon.png or https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                    />
                    <input
                      type="file"
                      ref={faviconInputRef}
                      onChange={(e) => handleFileUpload(e, 'faviconUrl')}
                      accept="image/png,image/x-icon,image/svg+xml,image/jpeg"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Upload from device"
                    >
                      <Upload size={14} />
                      <span>Upload</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] block">
                    Recommended: 64x64 or 32x32 PNG with transparent or dark contrast background.
                  </span>
                </div>

                {/* Apple Touch Icon (180x180) */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)]">
                    Apple Touch Icon URL / Path
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.faviconAppleTouchUrl}
                      onChange={(e) => setFormData({ ...formData, faviconAppleTouchUrl: e.target.value })}
                      placeholder="/apple-touch-icon.png or https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                    />
                    <input
                      type="file"
                      ref={appleTouchInputRef}
                      onChange={(e) => handleFileUpload(e, 'faviconAppleTouchUrl')}
                      accept="image/png,image/jpeg"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => appleTouchInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Upload from device"
                    >
                      <Upload size={14} />
                      <span>Upload</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] block">
                    Recommended: 180x180 square PNG icon for mobile bookmarks and Safari icons.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SEO OPERATIONS & SEARCH ENGINE INDEXING */}
        {/* ========================================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* Meta Title & Description */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                <Search className="w-5 h-5 text-[var(--accent-gold)]" />
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Primary Metadata & Canonical Indexing
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Global Page Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.siteTitle}
                    onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">
                    Recommended format: Kel Nnorom | Growth Strategist (50-60 characters)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Canonical Website Domain URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.canonicalUrl}
                    onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">
                    Primary domain: https://www.kelnnorom.com
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Default Author / Strategist Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorDefault}
                    onChange={(e) => setFormData({ ...formData, authorDefault: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Global Meta Keywords (Comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Verification Tokens & Analytics */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Search Engine Webmaster Verification & Analytics
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Google Search Console Verification
                  </label>
                  <input
                    type="text"
                    value={formData.googleSiteVerification}
                    onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                    placeholder="google-site-verification=..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">
                    Injected into document head as meta tag
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Bing Webmaster Verification
                  </label>
                  <input
                    type="text"
                    value={formData.bingSiteVerification}
                    onChange={(e) => setFormData({ ...formData, bingSiteVerification: e.target.value })}
                    placeholder="msvalidate.01=..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">
                    Injected as msvalidate.01 tag
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Google Analytics GA4 Measurement ID
                  </label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId}
                    onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    placeholder="G-KELNNOROM26"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">
                    GA4 stream tracking identifier
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share OpenGraph Card Preview & Image */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[var(--accent-gold)]" />
                  <h2 className="text-sm font-bold text-[var(--foreground)]">
                    Social Card OpenGraph Image (X, LinkedIn & Facebook)
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      OpenGraph & Twitter Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.defaultOgImageUrl}
                        onChange={(e) => setFormData({ ...formData, defaultOgImageUrl: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                      />
                      <input
                        type="file"
                        ref={ogImageInputRef}
                        onChange={(e) => handleFileUpload(e, 'defaultOgImageUrl')}
                        accept="image/png,image/jpeg"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => ogImageInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload size={14} />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2 text-xs text-[var(--muted)]">
                    <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                      <Layers size={14} className="text-[var(--accent-gold)]" />
                      <span>Schema & Crawl Directives</span>
                    </div>
                    <label className="flex items-center gap-2.5 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={formData.enableStructuredSchema !== false}
                        onChange={(e) => setFormData({ ...formData, enableStructuredSchema: e.target.checked })}
                        className="w-4 h-4 rounded text-[var(--accent-gold)] focus:ring-0"
                      />
                      <span className="text-xs text-[var(--foreground)] font-medium">
                        Enable JSON-LD Person & ProfessionalService Structured Schema
                      </span>
                    </label>
                  </div>
                </div>

                {/* Social Card Mockup */}
                <div className="rounded-xl border border-[var(--border)] bg-slate-950 overflow-hidden shadow-lg">
                  <img
                    src={formData.defaultOgImageUrl || 'https://www.kelnnorom.com/og-image.jpg'}
                    alt="Social preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-40 object-cover border-b border-slate-800"
                  />
                  <div className="p-3.5 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">kelnnorom.com</div>
                    <div className="text-xs font-bold text-slate-100 line-clamp-1">{formData.siteTitle}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">{formData.siteDescription}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Robots.txt & Sitemap.xml Directives */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[var(--accent-gold)]" />
                  <h2 className="text-sm font-bold text-[var(--foreground)]">
                    Robots.txt & Sitemap Directives
                  </h2>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent-gold)] hover:underline flex items-center gap-1"
                >
                  <span>View Live Sitemap.xml</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                  Robots.txt Directives
                </label>
                <textarea
                  rows={4}
                  value={formData.robotsTxt}
                  onChange={(e) => setFormData({ ...formData, robotsTxt: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-mono focus:border-[var(--accent-gold)] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUSTOM DOMAIN WEBMAIL SETUP (kelnnorom.com) */}
        {/* ========================================================================= */}
        {activeTab === 'webmail' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-5 h-5 text-[var(--accent-gold)]" />
                  <div>
                    <h2 className="text-sm font-bold text-[var(--foreground)]">
                      Live Custom Domain Email Setup Guide: kelnnorom.com
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      Easy step-by-step instructions to configure sending and receiving emails for any custom address (e.g. contact@kelnnorom.com, kel@kelnnorom.com).
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold">
                  Domain: kelnnorom.com
                </span>
              </div>

              {/* Step 1: DNS Records Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] font-mono">
                    Step 1: Add DNS Records to Your Domain Registrar (Namecheap, Cloudflare, GoDaddy)
                  </h3>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--surface)] font-mono text-[11px] text-[var(--muted)]">
                        <th className="p-3">Record Type</th>
                        <th className="p-3">Host / Name</th>
                        <th className="p-3">Value / Target</th>
                        <th className="p-3">Priority / TTL</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
                      {/* MX 1 */}
                      <tr>
                        <td className="p-3 font-bold text-purple-400">MX</td>
                        <td className="p-3 text-[var(--foreground)]">@ (or kelnnorom.com)</td>
                        <td className="p-3 text-emerald-400">mail.kelnnorom.com</td>
                        <td className="p-3 text-[var(--muted)]">Priority: 10 / Auto</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('mail.kelnnorom.com', 'mx1')}
                            className="p-1.5 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'mx1' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span className="text-[10px]">{copiedKey === 'mx1' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>

                      {/* SPF TXT */}
                      <tr>
                        <td className="p-3 font-bold text-blue-400">TXT (SPF)</td>
                        <td className="p-3 text-[var(--foreground)]">@</td>
                        <td className="p-3 text-emerald-400 truncate max-w-xs">v=spf1 mx a include:_spf.kelnnorom.com ~all</td>
                        <td className="p-3 text-[var(--muted)]">Auto / 3600</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('v=spf1 mx a include:_spf.kelnnorom.com ~all', 'spf')}
                            className="p-1.5 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'spf' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span className="text-[10px]">{copiedKey === 'spf' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>

                      {/* DKIM TXT */}
                      <tr>
                        <td className="p-3 font-bold text-blue-400">TXT (DKIM)</td>
                        <td className="p-3 text-[var(--foreground)]">default._domainkey</td>
                        <td className="p-3 text-emerald-400 truncate max-w-xs">v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBg...</td>
                        <td className="p-3 text-[var(--muted)]">Auto</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...', 'dkim')}
                            className="p-1.5 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'dkim' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span className="text-[10px]">{copiedKey === 'dkim' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>

                      {/* DMARC TXT */}
                      <tr>
                        <td className="p-3 font-bold text-blue-400">TXT (DMARC)</td>
                        <td className="p-3 text-[var(--foreground)]">_dmarc</td>
                        <td className="p-3 text-emerald-400 truncate max-w-xs">v=DMARC1; p=quarantine; rua=mailto:dmarc@kelnnorom.com</td>
                        <td className="p-3 text-[var(--muted)]">Auto</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('v=DMARC1; p=quarantine; rua=mailto:dmarc@kelnnorom.com', 'dmarc')}
                            className="p-1.5 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'dmarc' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span className="text-[10px]">{copiedKey === 'dmarc' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>

                      {/* CNAME / A for Mail */}
                      <tr>
                        <td className="p-3 font-bold text-amber-400">CNAME / A</td>
                        <td className="p-3 text-[var(--foreground)]">mail</td>
                        <td className="p-3 text-emerald-400">kelnnorom.com (or your server IP)</td>
                        <td className="p-3 text-[var(--muted)]">Auto</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('mail.kelnnorom.com', 'cname')}
                            className="p-1.5 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === 'cname' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span className="text-[10px]">{copiedKey === 'cname' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step 2: Inbound & Outbound Connection Parameters */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] font-mono">
                  Step 2: SMTP (Outgoing) & IMAP (Incoming) Configuration
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SMTP Box */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-[var(--accent-gold)] font-mono uppercase">
                      <span>Outgoing Mail Server (SMTP)</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">SMTP Server:</span>
                        <span className="text-slate-200 font-bold">mail.kelnnorom.com</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">SSL/TLS Port:</span>
                        <span className="text-emerald-400 font-bold">465 (or STARTTLS: 587)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Authentication:</span>
                        <span className="text-slate-200">Required (Full Email & Password)</span>
                      </div>
                    </div>
                  </div>

                  {/* IMAP Box */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 font-bold text-blue-400 font-mono uppercase">
                      <span>Incoming Mail Server (IMAP)</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">IMAP Server:</span>
                        <span className="text-slate-200 font-bold">mail.kelnnorom.com</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">SSL/TLS Port:</span>
                        <span className="text-emerald-400 font-bold">993</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Encryption:</span>
                        <span className="text-slate-200">SSL/TLS Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Webmail Client & App Access */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <Check size={16} />
                  <span>Step 3: Accessing & Managing Custom Mailboxes in this Portal</span>
                </div>
                <p className="text-[var(--foreground)] leading-relaxed">
                  Once your DNS propagates, open the <strong>Webmail Suite (/admin/webmail)</strong> in this administrative portal. You can compose, receive, categorize, search, filter, and draft emails from any registered domain mailbox.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SOCIALS, WHATSAPP & IDENTITY */}
        {/* ========================================================================= */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            {/* Social Media & WhatsApp Links Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                <Share2 className="w-5 h-5 text-[var(--accent-gold)]" />
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Social Media Channels & Direct WhatsApp Hotline
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* X (Twitter) */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-2">
                    <XIcon size={14} className="text-[var(--accent-gold)]" />
                    <span>X (formerly Twitter) Profile URL</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.socials.x}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, x: e.target.value },
                      })
                    }
                    placeholder="https://x.com/Kelnnorom"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">Default: @Kelnnorom</span>
                </div>

                {/* Facebook */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-2">
                    <FacebookIcon size={14} className="text-blue-500" />
                    <span>Facebook Profile URL</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.socials.facebook}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, facebook: e.target.value },
                      })
                    }
                    placeholder="https://facebook.com/Kelnnorom"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">Default: @Kelnnorom</span>
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-2">
                    <InstagramIcon size={14} className="text-pink-500" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.socials.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, instagram: e.target.value },
                      })
                    }
                    placeholder="https://instagram.com/Kelnnorom"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-[var(--muted)] mt-1 block">Default: @Kelnnorom</span>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-2">
                    <span className="text-blue-400 font-bold text-xs">in</span>
                    <span>LinkedIn Profile URL</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.socials.linkedin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        socials: { ...formData.socials, linkedin: e.target.value },
                      })
                    }
                    placeholder="https://linkedin.com/in/kelnnorom"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                {/* WhatsApp Chat Hotline */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-2">
                    <WhatsAppIcon size={14} className="text-[#25D366]" />
                    <span>WhatsApp Phone Number (E.164 / International)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+2348054397057"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono font-bold focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    Direct WhatsApp link destination: wa.me/{formData.whatsappNumber.replace(/[^0-9]/g, '')}
                  </span>
                </div>

                {/* WhatsApp Prefill Message */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    WhatsApp Prefilled Message Prompt
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappPrefillText}
                    onChange={(e) => setFormData({ ...formData, whatsappPrefillText: e.target.value })}
                    placeholder="Hello Kel, I would like to discuss an operational inquiry."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Platform Identity & Contact Info */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
                <Globe className="w-5 h-5 text-[var(--accent-gold)]" />
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  General Identity & Executive Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Executive Operator Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Primary Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Voice / Inquiry Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Executive Signoff Motto
                  </label>
                  <input
                    type="text"
                    value={formData.executiveQuote}
                    onChange={(e) => setFormData({ ...formData, executiveQuote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] italic focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Core Positioning Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Global Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <Sliders size={14} className="text-[var(--accent-gold)]" />
            <span>Changes are stored immediately in local administrative cache and synchronized across the portal.</span>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-[var(--accent-gold)]/20 transition-all cursor-pointer"
          >
            <Save size={16} />
            <span>Save All Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
