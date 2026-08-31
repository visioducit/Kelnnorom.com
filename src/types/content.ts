export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  industry: string[];
  era: string;
  eraPeriod: string;
  focus: string[];
  responsibilities: string[];
  achievements: string[];
  capabilities: string[];
  systems?: string[];
  verified: boolean;
};

export type CaseStudy = {
  slug: string;
  title: string;
  company: string;
  year?: string;
  industry: string[];
  categories: string[];
  tagline: string;
  challenge: string;
  environment: string[];
  role?: string;
  intervention: string[];
  systems?: string[];
  flow?: string[];
  outcomes: string[];
  metrics?: {
    value: string;
    label: string;
    context?: string;
  }[];
  capabilities: string[];
  relatedSlugs?: string[];
  featured?: boolean;
  order: number;
};

export type Capability = {
  category: string;
  items: string[];
};

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  date: string;
  updatedAt?: string;
  author: string;
  readingTime: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  published: boolean;
};

export type ProfessionalContact = {
  name: string;
  role?: string;
  organization?: string;
  relationshipType: 'Leadership Ecosystem' | 'Professional Network' | 'Collaborator';
  verified: boolean;
  testimonial?: string;
  permissionStatus?: 'pending' | 'approved';
};

export type SystemNode = {
  id: string;
  label: string;
  description: string;
  experiences: string[];
  position: { x: number; y: number };
};

export type Metric = {
  value: string;
  label: string;
  context?: string;
  verified: boolean;
};

export type OperatingStackRow = {
  layer: string;
  domains: {
    DIGITAL: StackLevel;
    COMMERCIAL: StackLevel;
    PHYSICAL: StackLevel;
    PEOPLE: StackLevel;
    TECHNOLOGY: StackLevel;
  };
  experiences: string[];
};

export type StackLevel = 'none' | 'supporting' | 'strong' | 'deep';

export type PhilosophyStage = {
  number: string;
  title: string;
  items: string[];
};

export type NavItem = {
  label: string;
  href: string;
};
