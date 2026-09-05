import type { CaseStudy, Experience, Capability, Insight, ProfessionalContact, SystemNode, Metric, PhilosophyStage } from './content';
import type { WebmailAccountConfig, WebmailEmail, WebmailTemplate, WebmailContact } from './webmail';
import type { AdCampaign, AdTelemetryEvent } from './ads';

export * from './webmail';
export * from './ads';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface UserApiToken {
  id: string;
  name: string;
  token: string;
  createdAt: string;
  lastUsed?: string;
}

export interface UserNotificationPreferences {
  emailOnLogin: boolean;
  emailOnSubscriber: boolean;
  emailOnAdAlert: boolean;
  emailOnSystemWarning: boolean;
  weeklySummaryDigest: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: UserStatus;
  jobTitle?: string;
  department?: string;
  bio?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
  currentIp?: string;
  twoFactorEnabled?: boolean;
  apiTokens?: UserApiToken[];
  notificationPreferences?: UserNotificationPreferences;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';
export type MediaCategory =
  | 'general'
  | 'banners'
  | 'insights'
  | 'case-studies'
  | 'avatars'
  | 'documents'
  | 'telemetry';

export type MediaFilterPreset = 'none' | 'contrast' | 'warm-gold' | 'cyber-blue' | 'sepia' | 'grayscale';
export type MediaCropPreset = 'original' | '16:9' | '4:3' | '1:1' | '9:16' | '21:9';

export interface MediaAsset {
  id: string;
  title: string;
  filename: string;
  url: string;
  type: MediaType;
  mimeType: string;
  sizeBytes: number;
  fileSizeBytes?: number;
  fileSizeFormatted?: string;
  width?: number;
  height?: number;
  dimensions?: { width: number; height: number };
  aspectRatio?: string;
  durationSeconds?: number;
  durationFormatted?: string;
  category: MediaCategory;
  tags: string[];
  altText: string;
  caption?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  filterPreset?: MediaFilterPreset;
  cropPreset?: MediaCropPreset;
}

export interface QuickAccessPreset {
  id: string;
  label: string;
  email: string;
  role: UserRole;
  description: string;
  badge?: string;
}

export interface SliderBannerItem {
  id: string;
  title: string;
  eyebrow: string;
  headlineHighlight: string;
  description: string;
  category: string;
  badgeText: string;
  metricValue: string;
  metricLabel: string;
  metricContext?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  tags: string[];
  active: boolean;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  whatsappPrefillText: string;
  socials: {
    x: string;
    facebook: string;
    instagram: string;
    linkedin: string;
  };
  executiveQuote: string;
  availableForAdvisory: boolean;
  enableQuickAccessDemo: boolean;
  quickAccessPresets: QuickAccessPreset[];
  otpExpiryMinutes: number;
  securityNoticeText?: string;

  // Superadmin Favicon & Brand Emblem Assets
  faviconUrl?: string;
  faviconAppleTouchUrl?: string;
  logoEmblemUrl?: string;

  // Superadmin SEO Operations & Verification
  canonicalUrl?: string;
  defaultOgImageUrl?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  googleAnalyticsId?: string;
  authorDefault?: string;
  metaKeywords?: string;
  robotsTxt?: string;
  sitemapUrl?: string;
  enableStructuredSchema?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
}

export type NewsletterFrequency = 'monthly_memo' | 'biweekly_telemetry' | 'instant_alerts';
export type NewsletterFormat = 'executive_text' | 'pdf_digest' | 'audio_podcast';
export type NewsletterTopic = 'turnaround' | 'logistics' | 'arbitrage' | 'case_notes';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  organization?: string;
  role?: string;
  topics: NewsletterTopic[];
  frequency: NewsletterFrequency;
  format: NewsletterFormat;
  subscribedAt: string;
  source: 'inline_card' | 'modal' | 'lead_magnet' | 'exit_intent' | 'footer' | 'admin_manual';
  status: 'active' | 'paused' | 'unsubscribed';
  leadMagnetDownloaded?: boolean;
}

export interface PostAnalytics {
  slug: string;
  views: number;
  uniqueVisitors: number;
  readCompletions: number;
  totalTimeSpentSeconds: number;
  avgTimeSpentSeconds?: number;
  avgScrollPercentage?: number;
  scrollDepthHistogram?: {
    '0_25': number;
    '26_50': number;
    '51_75': number;
    '76_100': number;
  };
  deviceBreakdown?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  shares: {
    whatsapp: number;
    linkedin: number;
    twitter: number;
    facebook: number;
    copied: number;
    reddit?: number;
    telegram?: number;
    email?: number;
  };
  referrerSources: Record<string, number>;
  dailyViews: { date: string; views: number; completions: number }[];
  lastViewedAt?: string;
}

export interface AnalyticsEventEntry {
  id: string;
  timestamp: string;
  type: 'view' | 'read_complete' | 'share' | 'audio_play' | 'video_play' | 'newsletter_signup' | 'reading_heartbeat';
  postSlug: string;
  postTitle: string;
  referrer?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  timeSpentSeconds?: number;
  scrollDepthPct?: number;
}

export interface SiteAnalytics {
  totalPageViews: number;
  totalUniqueVisitors: number;
  postsAnalytics: Record<string, PostAnalytics>;
  recentEvents: AnalyticsEventEntry[];
}

export interface CmsStoreState {
  version: number;
  caseStudies: CaseStudy[];
  experiences: Experience[];
  capabilities: Capability[];
  insights: Insight[];
  professionalContacts: ProfessionalContact[];
  systemNodes: SystemNode[];
  metrics: Metric[];
  philosophyStages: PhilosophyStage[];
  sliderBanners: SliderBannerItem[];
  settings: SiteSettings;
  adminUsers: AdminUser[];
  auditLogs: AuditLogEntry[];
  analytics: SiteAnalytics;
  subscribers?: NewsletterSubscriber[];
  webmailConfig: WebmailAccountConfig;
  webmailEmails: WebmailEmail[];
  webmailTemplates: WebmailTemplate[];
  webmailContacts: WebmailContact[];
  adCampaigns: AdCampaign[];
  adEvents?: AdTelemetryEvent[];
  mediaAssets?: MediaAsset[];
  activeOtpCodes?: Record<string, { code: string; expiresAt: number; email: string }>;
}
