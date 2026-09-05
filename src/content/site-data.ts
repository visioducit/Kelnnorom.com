import type { Capability, Metric, ProfessionalContact, PhilosophyStage, OperatingStackRow, SystemNode } from '@/types/content';

export const capabilities: Capability[] = [
  {
    category: 'Operations',
    items: [
      'Business Operations',
      'Process Optimization',
      'Operational Excellence',
      'Vendor Management',
      'Procurement',
      'Change Management',
      'Risk Management',
    ],
  },
  {
    category: 'Digital',
    items: [
      'Digital Asset Management',
      'Digital Marketing',
      'SEO',
      'Social Media',
      'Web Operations',
      'Content Operations',
      'Digital Reputation',
    ],
  },
  {
    category: 'Data',
    items: [
      'Analytics',
      'KPI Design',
      'Performance Monitoring',
      'Reporting',
      'Data Interpretation',
      'Decision Support',
    ],
  },
  {
    category: 'Commercial',
    items: [
      'Monetization',
      'Revenue Management',
      'P&L Exposure',
      'Business Development',
      'Campaign Management',
      'Customer Acquisition',
    ],
  },
  {
    category: 'Technology',
    items: [
      'CMS',
      'ERP',
      'WMS',
      'TMS',
      'GPS Fleet Systems',
      'Advertising Technology',
      'Web Infrastructure',
    ],
  },
  {
    category: 'Logistics',
    items: [
      'Fleet Management',
      'Last-Mile Delivery',
      'Route Optimization',
      'Distribution',
      'Supply Chain',
      'Warehouse Operations',
      'Compliance',
    ],
  },
  {
    category: 'Leadership',
    items: [
      'Team Leadership',
      'Cross-functional Coordination',
      'Vendor Management',
      'Stakeholder Management',
      'Project Leadership',
    ],
  },
];

export const metrics: Metric[] = [
  { value: '15+', label: 'Years of Professional Experience', verified: true },
  { value: '20+', label: 'Web Platforms Managed', verified: true },
  { value: '6', label: 'Servers Managed', verified: true },
  { value: '11+', label: 'Content Professionals Trained / Managed', verified: true },
  { value: '15+', label: 'Logistics Personnel Led', verified: true },
  { value: '20%+', label: 'Operational Growth', verified: true },
  { value: '>95%', label: 'OTIF Performance', verified: true },
  { value: '20%', label: 'Lower Cost-per-Delivery', verified: true },
  { value: '25%', label: 'Lower Fuel Expense', verified: true },
  { value: '35%', label: 'Operational Efficiency Improvement', verified: true },
  { value: 'Multi-million ₦', label: 'P&L Exposure', verified: true },
];

export const professionalContacts: ProfessionalContact[] = [
  { name: 'Jason Njoku', organization: 'iROKO', relationshipType: 'Leadership Ecosystem', verified: true },
  { name: 'Bastian Gotter', organization: 'iROKO', relationshipType: 'Leadership Ecosystem', verified: true },
  { name: 'Thomas Pilar', organization: 'TopCheck', relationshipType: 'Leadership Ecosystem', verified: true },
  { name: 'Christian Wiesner', organization: 'TopCheck', relationshipType: 'Leadership Ecosystem', verified: true },
  { name: 'Femi Falodun', organization: 'ID Africa', relationshipType: 'Leadership Ecosystem', verified: true },
  { name: 'Tony Ikeokwu', organization: 'LoveWorld Media Coordinating Centre', relationshipType: 'Leadership Ecosystem', verified: true },
  { name: 'Muhammad Nasir', role: 'Ruby/ROR', relationshipType: 'Collaborator', verified: true },
  { name: 'Samson Egbedele', role: 'UI/UX', relationshipType: 'Collaborator', verified: true },
  { name: 'Ummed Khan', role: 'SEO', relationshipType: 'Collaborator', verified: true },
  { name: 'Prince Ehima', role: 'Full Stack Tech & UI/UX', relationshipType: 'Collaborator', verified: true },
  { name: 'Yinka Olayokun', role: 'SEO', relationshipType: 'Collaborator', verified: true },
];

export const philosophyStages: PhilosophyStage[] = [
  {
    number: '01',
    title: 'Understand',
    items: ['Business model', 'Customer', 'Market', 'Constraints', 'Data'],
  },
  {
    number: '02',
    title: 'Map',
    items: ['People', 'Processes', 'Technology', 'Dependencies', 'Risks'],
  },
  {
    number: '03',
    title: 'Build',
    items: ['Systems', 'Workflows', 'Infrastructure', 'Teams', 'Partnerships'],
  },
  {
    number: '04',
    title: 'Optimize',
    items: ['Performance', 'Cost', 'Conversion', 'Efficiency', 'Revenue'],
  },
  {
    number: '05',
    title: 'Measure',
    items: ['KPIs', 'Analytics', 'Financial outcomes', 'Customer outcomes'],
  },
  {
    number: '06',
    title: 'Scale',
    items: ['Automation', 'Standardization', 'Technology', 'People', 'Continuous improvement'],
  },
];

export const systemNodes: SystemNode[] = [
  {
    id: 'operations',
    label: 'OPERATIONS',
    description: 'Running and improving the systems that deliver value.',
    experiences: ['TopCheck', 'ZedOut', 'Official Shoppers Warehouse', 'iROKO'],
    position: { x: 50, y: 20 },
  },
  {
    id: 'data',
    label: 'DATA',
    description: 'Turning information into decisions.',
    experiences: ['iROKO — Content analytics', 'BHM — Audience analytics', 'NET — Performance analytics', 'Official Shoppers Warehouse — KPI dashboards'],
    position: { x: 82, y: 38 },
  },
  {
    id: 'technology',
    label: 'TECHNOLOGY',
    description: 'Connecting systems to business outcomes.',
    experiences: ['BHM', 'NET', 'TopCheck', 'Official Shoppers Warehouse'],
    position: { x: 78, y: 75 },
  },
  {
    id: 'revenue',
    label: 'REVENUE',
    description: 'Monetization and commercial performance.',
    experiences: ['iROKO', 'BHM', 'NET', 'ZedOut'],
    position: { x: 50, y: 90 },
  },
  {
    id: 'people',
    label: 'PEOPLE',
    description: 'Teams, vendors and stakeholder coordination.',
    experiences: ['iROKO', 'BHM', 'ZedOut', 'Official Shoppers Warehouse'],
    position: { x: 22, y: 75 },
  },
  {
    id: 'growth',
    label: 'GROWTH',
    description: 'Acquisition, optimization and scale.',
    experiences: ['TopCheck', 'BHM', 'NET', 'ZedOut'],
    position: { x: 18, y: 38 },
  },
];

export const operatingStackRows: OperatingStackRow[] = [
  {
    layer: 'Strategy',
    domains: { DIGITAL: 'supporting', COMMERCIAL: 'deep', PHYSICAL: 'supporting', PEOPLE: 'strong', TECHNOLOGY: 'supporting' },
    experiences: ['BHM Group', 'ZedOut', 'TopCheck'],
  },
  {
    layer: 'Operations',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'deep', PHYSICAL: 'deep', PEOPLE: 'deep', TECHNOLOGY: 'strong' },
    experiences: ['iROKO', 'TopCheck', 'BHM', 'ZedOut', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Technology',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'strong', PHYSICAL: 'strong', PEOPLE: 'supporting', TECHNOLOGY: 'deep' },
    experiences: ['BHM', 'NET', 'TopCheck', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Data',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'strong', PHYSICAL: 'strong', PEOPLE: 'supporting', TECHNOLOGY: 'strong' },
    experiences: ['iROKO', 'BHM', 'NET', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Marketing',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'deep', PHYSICAL: 'supporting', PEOPLE: 'supporting', TECHNOLOGY: 'strong' },
    experiences: ['TopCheck', 'BHM', 'NET', 'ZedOut'],
  },
  {
    layer: 'SEO',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'strong', PHYSICAL: 'none', PEOPLE: 'none', TECHNOLOGY: 'strong' },
    experiences: ['TopCheck', 'BHM', 'NET', 'ZedOut'],
  },
  {
    layer: 'Content',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'strong', PHYSICAL: 'none', PEOPLE: 'strong', TECHNOLOGY: 'supporting' },
    experiences: ['iROKO', 'BHM', 'NET'],
  },
  {
    layer: 'Monetization',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'deep', PHYSICAL: 'none', PEOPLE: 'supporting', TECHNOLOGY: 'strong' },
    experiences: ['BHM', 'NET', 'ZedOut', 'iROKO'],
  },
  {
    layer: 'Infrastructure',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'strong', PHYSICAL: 'strong', PEOPLE: 'supporting', TECHNOLOGY: 'deep' },
    experiences: ['BHM', 'NET', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Logistics',
    domains: { DIGITAL: 'supporting', COMMERCIAL: 'strong', PHYSICAL: 'deep', PEOPLE: 'deep', TECHNOLOGY: 'deep' },
    experiences: ['ZedOut', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Supply Chain',
    domains: { DIGITAL: 'supporting', COMMERCIAL: 'strong', PHYSICAL: 'deep', PEOPLE: 'strong', TECHNOLOGY: 'deep' },
    experiences: ['Official Shoppers Warehouse'],
  },
  {
    layer: 'Fleet',
    domains: { DIGITAL: 'supporting', COMMERCIAL: 'supporting', PHYSICAL: 'deep', PEOPLE: 'deep', TECHNOLOGY: 'deep' },
    experiences: ['ZedOut', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'People',
    domains: { DIGITAL: 'strong', COMMERCIAL: 'strong', PHYSICAL: 'deep', PEOPLE: 'deep', TECHNOLOGY: 'supporting' },
    experiences: ['iROKO', 'BHM', 'ZedOut', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Vendors',
    domains: { DIGITAL: 'strong', COMMERCIAL: 'strong', PHYSICAL: 'strong', PEOPLE: 'deep', TECHNOLOGY: 'supporting' },
    experiences: ['TopCheck', 'BHM', 'ZedOut', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Compliance',
    domains: { DIGITAL: 'supporting', COMMERCIAL: 'strong', PHYSICAL: 'deep', PEOPLE: 'strong', TECHNOLOGY: 'supporting' },
    experiences: ['TopCheck', 'ZedOut', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Customer Experience',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'deep', PHYSICAL: 'strong', PEOPLE: 'deep', TECHNOLOGY: 'supporting' },
    experiences: ['Tastee Fried Chicken', 'TopCheck', 'iROKO', 'Official Shoppers Warehouse'],
  },
  {
    layer: 'Revenue',
    domains: { DIGITAL: 'deep', COMMERCIAL: 'deep', PHYSICAL: 'strong', PEOPLE: 'strong', TECHNOLOGY: 'strong' },
    experiences: ['iROKO', 'BHM', 'NET', 'ZedOut', 'Official Shoppers Warehouse'],
  },
];

export const careerFlow = [
  'Sales',
  'Operations',
  'Content',
  'Analytics',
  'Digital',
  'Technology',
  'Monetization',
  'Consulting',
  'Logistics',
  'Supply Chain',
  'Integrated Operations',
];

export const operatingRange = [
  'Customer',
  'Commercial',
  'Digital',
  'Technology',
  'Data',
  'People',
  'Operations',
  'Infrastructure',
  'Logistics',
  'Revenue',
];

export const industries = [
  'Digital Media',
  'Fintech',
  'Entertainment',
  'E-commerce',
  'Consulting',
  'Logistics',
  'Supply Chain',
];
