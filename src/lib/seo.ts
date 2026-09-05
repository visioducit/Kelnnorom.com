export type SeoConfig = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  keywords?: string[];
  jsonLd?: Record<string, unknown>[];
  schema?: Record<string, unknown>[];
};

export const SITE_URL = 'https://www.kelnnorom.com';
export const DEFAULT_OG = 'https://www.kelnnorom.com/og-image.jpg';

export function buildSeo(config: SeoConfig) {
  const canonical = config.canonical || SITE_URL;
  const ogImage = config.ogImage || DEFAULT_OG;
  const jsonLd = config.jsonLd || config.schema || [];

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
    publishedTime: config.publishedTime,
    modifiedTime: config.modifiedTime,
    author: config.author || 'Kel Nnorom',
    tags: config.tags || config.keywords,
    keywords: config.keywords || config.tags,
    jsonLd,
  };
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://www.kelnnorom.com/#person',
  name: 'Kel Nnorom',
  alternateName: ['Kelechi Nnorom', 'Kel'],
  jobTitle: 'Cross-Functional Operations, Turnaround & Growth Strategist',
  description:
    'Cross-functional operations and growth strategist working across digital systems, business operations, technology, data, monetization, logistics and supply chain.',
  image: 'https://www.kelnnorom.com/og-image.jpg',
  knowsAbout: [
    'Digital Operations',
    'Business Operations & Turnaround',
    'Supply Chain Optimization',
    'Fleet Logistics & Telemetry',
    'Digital Asset Management',
    'SEO & Organic Search Architecture',
    'Digital Monetization & Programmatic Revenue',
    'Cross-Functional Engineering Leadership',
    'Operations Architecture & Operating Systems',
    'Enterprise Technology Systems',
  ],
  url: SITE_URL,
  sameAs: [
    'https://x.com/Kelnnorom',
    'https://facebook.com/Kelnnorom',
    'https://instagram.com/Kelnnorom',
    'https://linkedin.com/in/kelnnorom',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressCountry: 'Nigeria',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Kel Nnorom Advisory & Operations Practice',
    url: SITE_URL,
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.kelnnorom.com/#organization',
  name: 'Kel Nnorom Executive Practice',
  url: SITE_URL,
  logo: 'https://www.kelnnorom.com/favicon.png',
  image: 'https://www.kelnnorom.com/og-image.jpg',
  founder: {
    '@id': 'https://www.kelnnorom.com/#person',
  },
  sameAs: [
    'https://x.com/Kelnnorom',
    'https://facebook.com/Kelnnorom',
    'https://instagram.com/Kelnnorom',
    'https://linkedin.com/in/kelnnorom',
  ],
};

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://www.kelnnorom.com/#service',
  name: 'Kel Nnorom Advisory & Operations Practice',
  url: SITE_URL,
  logo: 'https://www.kelnnorom.com/favicon.png',
  image: 'https://www.kelnnorom.com/og-image.jpg',
  telephone: '+2348054397057',
  email: 'kel@kelnnorom.com',
  priceRange: '$$$$',
  founder: {
    '@id': 'https://www.kelnnorom.com/#person',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Strategic Advisory & Operations Practice',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Operational Turnaround & Diagnostics',
          description: 'Rapid operational restructuring, unit economics optimization, and process stabilization for high-burn enterprises.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Systems & Architecture',
          description: 'End-to-end digital infrastructure overhaul, automated workflow pipelines, and cross-functional tooling.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Logistics & Supply Chain Orchestration',
          description: 'Route telemetry, fleet unit economics, distribution dispatch optimization, and inventory cycle compression.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Digital Monetization & Arbitrage',
          description: 'Maximizing yield per impression, programmatic revenue architecture, and digital audience asset optimization.',
        },
      },
    ],
  },
};

export const getPersonSchema = () => ({ ...personSchema });

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
  })),
});

export interface BlogSchemaInput {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  authorRole?: string;
  url: string;
  image?: string;
  category?: string;
  keywords?: string[];
  wordCount?: number;
  videoUrl?: string;
  audioUrl?: string;
  schemaType?: 'BlogPosting' | 'Article' | 'TechArticle' | 'NewsArticle';
}

export function blogPostingSchema(input: BlogSchemaInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': input.schemaType || 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    headline: input.title,
    description: input.description,
    image: input.image || DEFAULT_OG,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      '@type': 'Person',
      name: input.author || 'Kel Nnorom',
      jobTitle: input.authorRole || 'Cross-Functional Operations Strategist',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kel Nnorom Editorial Desk',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    articleSection: input.category || 'Operations & Technology',
    keywords: (input.keywords || []).join(', '),
  };

  if (input.wordCount) {
    schema.wordCount = input.wordCount;
  }

  if (input.videoUrl) {
    schema.video = {
      '@type': 'VideoObject',
      name: `${input.title} - Operational Walkthrough`,
      description: input.description,
      thumbnailUrl: input.image || DEFAULT_OG,
      contentUrl: input.videoUrl,
      embedUrl: input.videoUrl,
      uploadDate: input.datePublished,
    };
  }

  if (input.audioUrl) {
    schema.audio = {
      '@type': 'AudioObject',
      name: `${input.title} - Executive Audio Briefing`,
      description: input.description,
      contentUrl: input.audioUrl,
    };
  }

  return schema;
}

export function articleSchema(article: {
  title: string;
  description: string;
  date: string;
  author: string;
  url: string;
}) {
  return blogPostingSchema({
    title: article.title,
    description: article.description,
    datePublished: article.date,
    author: article.author,
    url: article.url,
  });
}

/**
 * Calculates SEO Readability & Keyword Optimization Score (0-100)
 */
export interface SeoAuditResult {
  score: number;
  grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'POOR';
  checks: {
    label: string;
    passed: boolean;
    recommendation: string;
    weight: number;
  }[];
  checklist: {
    label: string;
    passed: boolean;
    recommendation: string;
    weight: number;
  }[];
}

export function auditBlogSeo(params: {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  focusKeyword?: string;
  seoKeywords?: string[];
  tags?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  image?: string;
  imageAlt?: string;
  readingTime?: string;
}): SeoAuditResult {
  const title = params.title || '';
  const slug = params.slug || '';
  const excerpt = params.excerpt || '';
  const body = params.body || '';
  const focusKeyword = params.focusKeyword || params.seoKeywords?.[0] || params.tags?.[0] || '';
  const featuredImage = params.featuredImage || params.image || '';
  const featuredImageAlt = params.featuredImageAlt || params.imageAlt || '';

  const kw = focusKeyword.trim().toLowerCase();

  const titleLength = title.length;
  const excerptLength = excerpt.length;
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  const checks = [
    {
      label: 'Title Length (40–65 characters)',
      passed: titleLength >= 35 && titleLength <= 70,
      recommendation: titleLength < 35 ? 'Title is too brief for search engine snippets.' : titleLength > 70 ? 'Title may be truncated on Google SERP.' : 'Optimal length for desktop and mobile search.',
      weight: 15,
    },
    {
      label: 'Meta Description Length (120–160 characters)',
      passed: excerptLength >= 100 && excerptLength <= 175,
      recommendation: excerptLength < 100 ? 'Meta description is too short; add detail to improve CTR.' : excerptLength > 175 ? 'Meta description exceeds search engine truncation boundary.' : 'Perfect snippet preview length.',
      weight: 15,
    },
    {
      label: 'Depth & In-depth Word Count (500+ words)',
      passed: wordCount >= 400,
      recommendation: wordCount < 400 ? 'Content is under 400 words. Comprehensive long-form rankings favor 600+ words.' : `Comprehensive depth (${wordCount} words).`,
      weight: 20,
    },
    {
      label: 'Focus Keyword in Title',
      passed: kw ? title.toLowerCase().includes(kw) : true,
      recommendation: kw && !title.toLowerCase().includes(kw) ? `Include your focus keyword "${focusKeyword}" in the title.` : 'Focus keyword placed in primary title.',
      weight: 15,
    },
    {
      label: 'Focus Keyword in URL Slug',
      passed: kw ? slug.toLowerCase().includes(kw.replace(/\s+/g, '-')) || slug.toLowerCase().includes(kw.split(' ')[0]) : true,
      recommendation: kw ? `Ensure focus keyword appears in URL slug.` : 'Clean URL slug configured.',
      weight: 10,
    },
    {
      label: 'Focus Keyword in Meta Description',
      passed: kw ? excerpt.toLowerCase().includes(kw) : true,
      recommendation: kw && !excerpt.toLowerCase().includes(kw) ? `Add focus keyword "${focusKeyword}" in the meta excerpt.` : 'Keyword present in snippet description.',
      weight: 10,
    },
    {
      label: 'Multimedia Cover & Alt Text',
      passed: Boolean(featuredImage && (featuredImageAlt || '').length > 3),
      recommendation: !featuredImage ? 'Add a featured cover image.' : !featuredImageAlt ? 'Add descriptive alt text to the cover image for image SEO.' : 'Cover image and descriptive alt text provided.',
      weight: 15,
    },
  ];

  const totalPossible = checks.reduce((acc, c) => acc + c.weight, 0);
  const earned = checks.reduce((acc, c) => (c.passed ? acc + c.weight : acc), 0);
  const score = Math.round((earned / totalPossible) * 100);

  let grade: SeoAuditResult['grade'] = 'POOR';
  if (score >= 85) grade = 'EXCELLENT';
  else if (score >= 70) grade = 'GOOD';
  else if (score >= 50) grade = 'NEEDS_WORK';

  return { score, grade, checks, checklist: checks };
}
