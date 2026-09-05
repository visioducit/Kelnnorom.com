import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  organization: z.string().max(200).optional().or(z.literal('')),
  email: z.string().email('A valid email is required').max(200),
  problem: z.string().min(10, 'Please describe what you are trying to solve').max(2000),
  areaOfInterest: z.string().max(100),
  budgetTimeline: z.string().max(500).optional().or(z.literal('')),
  message: z.string().min(10, 'Please include a message').max(5000),
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const areaOptions = [
  'Operational Transformation',
  'Digital Strategy',
  'Digital Operations',
  'Digital Asset Management',
  'Logistics / Operations',
  'Supply Chain',
  'Advisory',
  'Fractional Leadership',
  'Strategic Collaboration',
  'Other',
];
