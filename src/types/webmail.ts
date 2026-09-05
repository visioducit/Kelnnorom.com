export type WebmailProviderPreset =
  | 'custom_smtp'
  | 'custom_smtp_imap'
  | 'sendgrid'
  | 'mailgun'
  | 'aws_ses'
  | 'amazon_ses'
  | 'resend'
  | 'google_workspace'
  | 'office365'
  | 'microsoft_365';

export type WebmailSecurity = 'ssl' | 'tls' | 'starttls' | 'none';

export type WebmailFolderType =
  | 'inbox'
  | 'sent'
  | 'drafts'
  | 'starred'
  | 'archive'
  | 'trash'
  | 'spam';

export type WebmailPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface WebmailAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface WebmailEmailAddress {
  name: string;
  email: string;
  avatar?: string;
}

export interface WebmailEmail {
  id: string;
  threadId: string;
  from: WebmailEmailAddress;
  to: WebmailEmailAddress[];
  cc?: WebmailEmailAddress[];
  bcc?: WebmailEmailAddress[];
  subject: string;
  preview: string;
  bodyHtml: string;
  bodyText: string;
  timestamp: string;
  date: string;
  folder: WebmailFolderType;
  read: boolean;
  starred: boolean;
  flagged: boolean;
  labels: string[];
  priority: WebmailPriority;
  attachments?: WebmailAttachment[];
  isOutgoing?: boolean;
  replyToId?: string;
  snoozedUntil?: string;
}

export interface WebmailTemplate {
  id: string;
  title: string;
  category: string;
  subject: string;
  bodyHtml: string;
  description: string;
}

export interface WebmailContact {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  category: 'Executive' | 'Client' | 'Board' | 'Advisory' | 'Partner' | 'Media';
  avatarUrl?: string;
  phone?: string;
  notes?: string;
}

export interface WebmailDnsRecords {
  spf: string;
  dkim: string;
  dmarc: string;
  mx: string;
}

export interface WebmailAccountConfig {
  provider: WebmailProviderPreset;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  // cPanel / GO54 Specific Config
  cpanelServerIp?: string;
  cpanelDomain?: string;
  cpanelWebmailUrl?: string;
  configuredMailboxes?: Array<{
    name: string;
    email: string;
    role: string;
    description?: string;
  }>;
  // Outgoing SMTP
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  smtpSecurity: WebmailSecurity;
  // Incoming IMAP / API Sync
  imapEnabled: boolean;
  imapHost: string;
  imapPort: number;
  imapUser: string;
  imapPassword?: string;
  imapSecurity: WebmailSecurity;
  // Signature & Branding
  signatureHtml: string;
  signatureText: string;
  companyName: string;
  disclaimerText: string;
  // Auto-Responder
  autoResponderEnabled: boolean;
  autoResponderSubject: string;
  autoResponderBody: string;
  // DNS & Verification
  domainVerified: boolean;
  dnsRecords: WebmailDnsRecords;
  // Connection Testing State
  connectionStatus: 'connected' | 'untested' | 'failed' | 'testing' | 'error' | 'unconfigured';
  lastTestedAt?: string;
  testLatencyMs?: number;
  errorMessage?: string;
}
