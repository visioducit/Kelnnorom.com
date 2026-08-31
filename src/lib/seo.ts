export type SeoConfig = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>[];
};

const SITE_URL = 'https://kelnnorom.com';
const DEFAULT_OG = 'https://bolt.new/static/og_default.png';

export function buildSeo(config: SeoConfig) {
  const canonical = config.canonical || SITE_URL;
  const ogImage = config.ogImage || DEFAULT_OG;

  return {
    title: config.title,
    description: config.description,
    canonical,
    ogTitle: config.title,
    ogDescription: config.description,
    ogImage,
    ogType: config.type || 'website',
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterImage: ogImage,
    jsonLd: config.jsonLd || [],
  };
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kel Nnorom',
  jobTitle: 'Cross-Functional Operations & Growth Strategist',
  description:
    'Cross-functional operations and growth strategist working across digital systems, business operations, technology, data, monetization, logistics and supply chain.',
  knowsAbout: [
    'Digital Operations',
    'Business Operations',
    'Supply Chain Optimization',
    'Logistics',
    'Digital Asset Management',
    'SEO',
    'Digital Monetization',
    'Fleet Operations',
    'Operations Strategy',
    'Digital Transformation',
  ],
  url: SITE_URL,
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export function articleSchema(article: {
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    url: article.url,
  };
}
