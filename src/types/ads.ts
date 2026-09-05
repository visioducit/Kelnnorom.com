export type AdPlacementPosition =
  | 'header_top_banner'
  | 'sidebar_sticky'
  | 'in_article_inline'
  | 'in_article_bottom'
  | 'feed_card'
  | 'newsletter_sponsor';

export type AdFormat =
  | 'native_card'
  | 'custom_banner'
  | 'sponsored_brief'
  | 'house_ad'
  | 'html_embed';

export type AdPricingModel = 'cpm' | 'cpc' | 'fixed_sponsor' | 'free_house';

export interface AdDailyStat {
  date: string;
  impressions: number;
  clicks: number;
}

export interface AdCampaign {
  id: string;
  title: string;
  advertiser: string;
  companyLogoUrl?: string;
  format: AdFormat;
  placement: AdPlacementPosition;
  headline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  badgeText: string;
  imageUrl?: string;
  htmlContent?: string;
  active: boolean;
  priority: number; // 1 (lowest) to 10 (highest weight)
  startDate?: string;
  endDate?: string;
  targetCategories: string[]; // e.g. ['Operations Turnaround'] or ['All']
  targetTags?: string[];
  pricingModel: AdPricingModel;
  costPerUnit: number; // CPM rate ($), CPC rate ($), or fixed monthly sponsor ($)
  budget: number;
  impressionsCount: number;
  clicksCount: number;
  dailyStats: AdDailyStat[];
  createdAt: string;
  updatedAt?: string;
}

export interface AdTelemetryEvent {
  id: string;
  campaignId: string;
  type: 'impression' | 'click' | 'dismiss';
  placement: AdPlacementPosition;
  postSlug?: string;
  timestamp: string;
  device?: 'desktop' | 'mobile' | 'tablet';
}

export interface AdPlacementZoneInfo {
  placement: AdPlacementPosition;
  label: string;
  description: string;
  recommendedDimensions: string;
  maxActiveRotations: number;
  averageCtrTargetPct: number;
}
