import type { SiteAnalytics, NewsletterSubscriber } from '@/types/cms';

export function getInitialAnalytics(): SiteAnalytics {
  return {
    totalPageViews: 1840,
    totalUniqueVisitors: 1240,
    postsAnalytics: {
      'operational-turnaround-framework': {
        slug: 'operational-turnaround-framework',
        views: 890,
        uniqueVisitors: 650,
        readCompletions: 610,
        totalTimeSpentSeconds: 146400,
        avgTimeSpentSeconds: 240,
        avgScrollPercentage: 86,
        scrollDepthHistogram: {
          '0_25': 890,
          '26_50': 780,
          '51_75': 690,
          '76_100': 610,
        },
        deviceBreakdown: { mobile: 420, desktop: 410, tablet: 60 },
        shares: { whatsapp: 58, linkedin: 45, twitter: 32, facebook: 12, copied: 89, reddit: 8, telegram: 14, email: 18 },
        referrerSources: { 'Direct / Search': 520, LinkedIn: 210, Twitter: 95, Other: 65 },
        dailyViews: [
          { date: '2026-08-25', views: 95, completions: 64 },
          { date: '2026-08-26', views: 120, completions: 82 },
          { date: '2026-08-27', views: 145, completions: 98 },
          { date: '2026-08-28', views: 180, completions: 124 },
          { date: '2026-08-29', views: 160, completions: 110 },
          { date: '2026-08-30', views: 190, completions: 132 },
        ],
      },
      'ad-monetization-arbitrage-systems': {
        slug: 'ad-monetization-arbitrage-systems',
        views: 530,
        uniqueVisitors: 390,
        readCompletions: 395,
        totalTimeSpentSeconds: 118500,
        avgTimeSpentSeconds: 300,
        avgScrollPercentage: 81,
        scrollDepthHistogram: {
          '0_25': 530,
          '26_50': 480,
          '51_75': 420,
          '76_100': 395,
        },
        deviceBreakdown: { mobile: 210, desktop: 290, tablet: 30 },
        shares: { whatsapp: 28, linkedin: 31, twitter: 44, facebook: 6, copied: 62, reddit: 15, telegram: 9, email: 12 },
        referrerSources: { 'Direct / Search': 310, Twitter: 140, LinkedIn: 50, Other: 30 },
        dailyViews: [
          { date: '2026-08-27', views: 80, completions: 60 },
          { date: '2026-08-28', views: 110, completions: 82 },
          { date: '2026-08-29', views: 150, completions: 115 },
          { date: '2026-08-30', views: 190, completions: 138 },
        ],
      },
      'supply-chain-telemetry-architecture': {
        slug: 'supply-chain-telemetry-architecture',
        views: 420,
        uniqueVisitors: 310,
        readCompletions: 285,
        totalTimeSpentSeconds: 85500,
        avgTimeSpentSeconds: 210,
        avgScrollPercentage: 78,
        scrollDepthHistogram: {
          '0_25': 420,
          '26_50': 360,
          '51_75': 310,
          '76_100': 285,
        },
        deviceBreakdown: { mobile: 160, desktop: 230, tablet: 30 },
        shares: { whatsapp: 19, linkedin: 38, twitter: 22, facebook: 4, copied: 41, reddit: 6, telegram: 7, email: 9 },
        referrerSources: { 'Direct / Search': 240, LinkedIn: 120, Twitter: 40, Other: 20 },
        dailyViews: [
          { date: '2026-08-28', views: 90, completions: 62 },
          { date: '2026-08-29', views: 140, completions: 95 },
          { date: '2026-08-30', views: 190, completions: 128 },
        ],
      },
    },
    recentEvents: [
      {
        id: 'evt-init-1',
        type: 'view',
        postSlug: 'operational-turnaround-framework',
        postTitle: 'The 90-Day Operational Turnaround Framework',
        timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        device: 'desktop',
        referrer: 'Direct / Search',
      },
      {
        id: 'evt-init-2',
        type: 'newsletter_signup',
        postSlug: 'operational-turnaround-framework',
        postTitle: 'Executive Turnaround Memo Subscription',
        timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        device: 'desktop',
      },
      {
        id: 'evt-init-3',
        type: 'read_complete',
        postSlug: 'operational-turnaround-framework',
        postTitle: 'The 90-Day Operational Turnaround Framework',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        device: 'mobile',
      },
      {
        id: 'evt-init-4',
        type: 'share',
        postSlug: 'ad-monetization-arbitrage-systems',
        postTitle: 'Digital Asset Monetization & Traffic Arbitrage Architecture',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        device: 'desktop',
        referrer: 'LinkedIn',
      },
    ],
  };
}

export const defaultSubscribers: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'm.vance@vanguardlogistics.com',
    name: 'Marcus Vance',
    organization: 'Vanguard Logistics Partners',
    role: 'Managing Partner',
    topics: ['turnaround', 'logistics'],
    frequency: 'monthly_memo',
    format: 'pdf_digest',
    subscribedAt: '2026-08-12',
    source: 'lead_magnet',
    status: 'active',
    leadMagnetDownloaded: true,
  },
  {
    id: 'sub-2',
    email: 'elena.rostova@apexcap.io',
    name: 'Elena Rostova',
    organization: 'Apex Private Equity',
    role: 'Operating Principal',
    topics: ['turnaround', 'arbitrage'],
    frequency: 'biweekly_telemetry',
    format: 'executive_text',
    subscribedAt: '2026-08-18',
    source: 'modal',
    status: 'active',
    leadMagnetDownloaded: true,
  },
  {
    id: 'sub-3',
    email: 'david.chen@axonmedia.co',
    name: 'David Chen',
    organization: 'Axon Digital Media Group',
    role: 'VP Monetization & Yield',
    topics: ['arbitrage', 'case_notes'],
    frequency: 'instant_alerts',
    format: 'executive_text',
    subscribedAt: '2026-08-22',
    source: 'inline_card',
    status: 'active',
  },
  {
    id: 'sub-4',
    email: 'sarah.jenkins@swiftfleet.tech',
    name: 'Sarah Jenkins',
    organization: 'SwiftFleet Global',
    role: 'Chief Operating Officer',
    topics: ['logistics', 'turnaround'],
    frequency: 'monthly_memo',
    format: 'audio_podcast',
    subscribedAt: '2026-08-26',
    source: 'inline_card',
    status: 'active',
  },
  {
    id: 'sub-5',
    email: 'r.patel@horizonventures.com',
    name: 'Raj Patel',
    organization: 'Horizon Growth Partners',
    role: 'General Partner',
    topics: ['turnaround', 'logistics', 'arbitrage', 'case_notes'],
    frequency: 'monthly_memo',
    format: 'pdf_digest',
    subscribedAt: '2026-08-29',
    source: 'exit_intent',
    status: 'active',
    leadMagnetDownloaded: true,
  },
];

export const initialSiteAnalytics: SiteAnalytics = getInitialAnalytics();

export function calculateReadingTime(text: string, wordsPerMinute: number = 220): { minutes: number; text: string; wordCount: number } {
  if (!text) return { minutes: 1, text: '1 min read', wordCount: 0 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  // Account for code blocks and visual components adds ~15s each
  const codeBlocksCount = (text.match(/```/g) || []).length / 2;
  const extraSeconds = codeBlocksCount * 15;
  const totalSeconds = (words / wordsPerMinute) * 60 + extraSeconds;
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60));
  return {
    minutes,
    text: `${minutes} min read`,
    wordCount: words,
  };
}

export function detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
  return 'desktop';
}

export const detectDevice = detectDeviceType;

export function parseReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'Direct / Bookmark';
  const ref = document.referrer.toLowerCase();
  if (ref.includes('google') || ref.includes('bing') || ref.includes('duckduckgo')) return 'Organic Search';
  if (ref.includes('linkedin')) return 'LinkedIn';
  if (ref.includes('t.co') || ref.includes('twitter') || ref.includes('x.com')) return 'X / Twitter';
  if (ref.includes('whatsapp')) return 'WhatsApp';
  if (ref.includes('reddit')) return 'Reddit';
  if (ref.includes('facebook') || ref.includes('instagram')) return 'Meta / Social';
  return 'External Site';
}

export const detectReferrerSource = parseReferrer;
