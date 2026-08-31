import type { Insight } from '@/types/content';

export const insights: Insight[] = [];

export const insightCategories = [
  'Operations',
  'Digital Strategy',
  'SEO',
  'Analytics',
  'Monetization',
  'Logistics',
  'Supply Chain',
  'Technology',
  'Leadership',
  'Business Systems',
];

export const getInsight = (slug: string): Insight | undefined =>
  insights.find((i) => i.slug === slug);

export const getPublishedInsights = (): Insight[] =>
  insights.filter((i) => i.published);
