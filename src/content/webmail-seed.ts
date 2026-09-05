import type {
  WebmailAccountConfig,
  WebmailEmail,
  WebmailTemplate,
  WebmailContact,
} from '@/types/webmail';

export const defaultWebmailConfig: WebmailAccountConfig = {
  provider: 'custom_smtp',
  fromName: 'Kel Nnorom',
  fromEmail: 'kel@kelnnorom.com',
  replyTo: 'kel@kelnnorom.com',
  cpanelServerIp: '197.210.12.85',
  cpanelDomain: 'kelnnorom.com',
  cpanelWebmailUrl: 'https://mail.kelnnorom.com:2096',
  configuredMailboxes: [
    {
      name: 'Kel Nnorom',
      email: 'kel@kelnnorom.com',
      role: 'Principal Partner & Executive Turnaround Lead',
      description: 'Primary C-suite inbox for confidential turnaround mandates and PE briefs',
    },
    {
      name: 'Operations Desk',
      email: 'operations@kelnnorom.com',
      role: 'Portfolio Diagnostics & Telemetry Lead',
      description: 'Inbound operational logs, KPI audits, and fulfillment telemetry',
    },
    {
      name: 'Advisory & Media',
      email: 'contact@kelnnorom.com',
      role: 'General Inquiries & Keynote Bureau',
      description: 'Media interviews, keynote invitations, and initial advisory contact',
    },
    {
      name: 'Security & Verification',
      email: 'security@kelnnorom.com',
      role: 'DMARC & Compliance Gatekeeper',
      description: 'Automated DMARC aggregate reports, TLS audits, and access notices',
    },
  ],
  smtpHost: 'mail.kelnnorom.com',
  smtpPort: 465,
  smtpUser: 'kel@kelnnorom.com',
  smtpPassword: '••••••••••••••••',
  smtpSecurity: 'ssl',
  imapEnabled: true,
  imapHost: 'mail.kelnnorom.com',
  imapPort: 993,
  imapUser: 'kel@kelnnorom.com',
  imapPassword: '••••••••••••••••',
  imapSecurity: 'ssl',
  signatureHtml: `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #E4E4E7; font-size: 13px; line-height: 1.5; border-top: 1px solid #3F3F46; padding-top: 12px; margin-top: 20px;">
  <p style="margin: 0; font-weight: 700; color: #D4AF37; letter-spacing: 0.02em;">Kel Nnorom</p>
  <p style="margin: 2px 0 6px 0; color: #A1A1AA; font-size: 11px;">Cross-Functional Operations, Margin Turnaround & Yield Strategist</p>
  <p style="margin: 0; font-size: 11px; color: #71717A;">
    <span style="color: #D4AF37;">Web:</span> <a href="https://kelnnorom.com" style="color: #D4AF37; text-decoration: none;">kelnnorom.com</a> &nbsp;|&nbsp;
    <span style="color: #D4AF37;">Direct:</span> <a href="mailto:kel@kelnnorom.com" style="color: #E4E4E7; text-decoration: none;">kel@kelnnorom.com</a>
  </p>
  <p style="margin: 8px 0 0 0; font-size: 10px; color: #52525B; font-style: italic;">
    CONFIDENTIALITY NOTE: The contents of this transmission are intended solely for the recipient named above and may contain strategic intellectual property or privileged executive analysis.
  </p>
</div>`,
  signatureText: `Kel Nnorom | Cross-Functional Operations & Yield Strategist\nWeb: https://kelnnorom.com | Email: kel@kelnnorom.com\nCONFIDENTIAL: Intended solely for named recipient.`,
  companyName: 'Kel Nnorom Advisory & Operations Group',
  disclaimerText: 'Protected by Enterprise TLS 1.3 encryption and DMARC enforcement.',
  autoResponderEnabled: false,
  autoResponderSubject: 'Acknowledging Receipt: Kel Nnorom Executive Desk',
  autoResponderBody: `Thank you for your transmission. Your message has reached Kel Nnorom's executive desk.\n\nFor active turnaround diagnostics and time-sensitive advisory briefings, our team will review your dossier within 4-6 business hours.`,
  domainVerified: true,
  dnsRecords: {
    spf: 'v=spf1 +a +mx +ip4:197.210.12.85 include:go54.com ~all',
    dkim: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0w9R7G6xK1...',
    dmarc: 'v=DMARC1; p=quarantine; rua=mailto:security@kelnnorom.com; pct=100; aspf=r;',
    mx: '0 mail.kelnnorom.com',
  },
  connectionStatus: 'connected',
  lastTestedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  testLatencyMs: 44,
};

export const defaultWebmailContacts: WebmailContact[] = [
  {
    id: 'contact-1',
    name: 'Marcus Sterling',
    email: 'msterling@vanguardhorizonpe.com',
    organization: 'Vanguard Horizon Capital (PE)',
    role: 'Managing Director, Portfolio Operations',
    category: 'Client',
    phone: '+1 (212) 555-0192',
    notes: 'Oversees 14 middle-market logistics and manufacturing portfolio assets.',
  },
  {
    id: 'contact-2',
    name: 'Dr. Elena Rostova',
    email: 'e.rostova@apollomediaadvisory.com',
    organization: 'Apollo Media Group',
    role: 'Chief Strategy Officer & Yield Officer',
    category: 'Executive',
    phone: '+44 20 7946 0912',
    notes: 'Collaborating on high-yield programmatic ad mediation and yield arbitrage frameworks.',
  },
  {
    id: 'contact-3',
    name: 'Julian Vance',
    email: 'julian.vance@boardnexus.org',
    organization: 'Global Supply Chain Institute',
    role: 'Chairman of the Board',
    category: 'Board',
    phone: '+1 (312) 555-7788',
    notes: 'Invited Kel to keynote the Annual Supply Chain Telemetry Summit.',
  },
  {
    id: 'contact-4',
    name: 'Amina Al-Mansoor',
    email: 'amina@nexuslogistics.ae',
    organization: 'Nexus Trans-Continental Logistics',
    role: 'Chief Operating Officer',
    category: 'Client',
    phone: '+971 4 313 8900',
    notes: '90-Day Turnaround engagement client across 6 regional fulfillment hubs.',
  },
  {
    id: 'contact-5',
    name: 'Harrison Briggs',
    email: 'harrison.b@ftbriefings.com',
    organization: 'Financial Times Intelligence',
    role: 'Senior Technology & Enterprise Editor',
    category: 'Media',
    phone: '+44 20 7873 3000',
    notes: 'Quoted Kel in global logistics turnaround investigative feature.',
  },
];

export const defaultWebmailTemplates: WebmailTemplate[] = [
  {
    id: 'tpl-1',
    title: '90-Day Turnaround Proposal Memo',
    category: 'Operations',
    subject: 'Executive Proposal: 90-Day Operational Turnaround & EBITDA Recovery Matrix — [Client Name]',
    description: 'Comprehensive 3-phase diagnostic, cost containment, and operational execution blueprint.',
    bodyHtml: `<p>Dear [Executive Name],</p>
<p>Following our diagnostic briefing on [Date], I have structured the foundational <strong>90-Day Operational Turnaround Roadmap</strong> designed specifically for [Client Organization].</p>

<h3>Core Strategic Objectives:</h3>
<ul>
  <li><strong>Phase 1 (Days 1–30): Root-Cause Telemetry & Cash-Leakage Arrest</strong> — Immediate stabilization of dispatch variance, unit economics audit, and vendor renegotiation.</li>
  <li><strong>Phase 2 (Days 31–60): Bottleneck Dissolution & Workflow Re-engineering</strong> — Eliminating SLA lag and implementing automated routing controls.</li>
  <li><strong>Phase 3 (Days 61–90): Margin Expansion & Institutional Velocity</strong> — Codifying operational playbooks to preserve a projected +[Target EBITDA]% EBITDA run-rate.</li>
</ul>

<p>I have attached our executive engagement terms and governance schedule for your committee's review.</p>
<p>Respectfully,</p>`,
  },
  {
    id: 'tpl-2',
    title: 'Operations Telemetry Diagnostic Follow-up',
    category: 'Diagnostics',
    subject: 'Preliminary Diagnostic Findings: Operational Variance & Throughput Audit',
    description: 'Post-audit executive debrief outlining immediate high-impact interventions.',
    bodyHtml: `<p>Dear [Leadership Team],</p>
<p>Thank you for granting access to your operational logs and fulfillment pipeline over the past week.</p>
<p>Our initial quantitative telemetry audit reveals three high-leverage bottlenecks:</p>
<ol>
  <li><strong>Inter-hub Transit Latency:</strong> 18.4% excess idle time occurring at regional handoff gates.</li>
  <li><strong>Labor Unit Economics:</strong> Overtime expenditure indexing 24% higher than model baselines due to shift scheduling misalignment.</li>
  <li><strong>Inventory Buffer Miscalculation:</strong> $1.8M in trapped working capital across tier-2 depots.</li>
</ol>
<p>We are prepared to deploy corrective mechanisms starting Monday morning.</p>`,
  },
  {
    id: 'tpl-3',
    title: 'Programmatic Yield Arbitrage Consultation',
    category: 'Ad Monetization',
    subject: 'Ad Monetization Audit: Header Bidding Mediation & Yield Optimization',
    description: 'Structured proposal for media publishers and platforms seeking margin arbitrage.',
    bodyHtml: `<p>Dear [Publisher / Executive],</p>
<p>We have completed our evaluation of your programmatic ad stack and floor-price telemetry.</p>
<p>By restructuring your Prebid timeout thresholds and introducing dynamic floor pricing algorithms across tier-1 geo traffic, we project an immediate <strong>+28% to +35% eCPM lift</strong> without degrading reader retention or core Web Vitals.</p>
<p>Let us schedule a 20-minute architecture review to discuss implementation details.</p>`,
  },
  {
    id: 'tpl-4',
    title: 'Board Due Diligence & M&A Operational Briefing',
    category: 'M&A & PE',
    subject: 'Operational Due Diligence Briefing: Target Asset [Target Name]',
    description: 'M&A assessment memo for PE partners and board investment committees.',
    bodyHtml: `<p>Dear Investment Committee,</p>
<p>Attached please find our independent <strong>Operational Due Diligence Report</strong> regarding target asset [Target Name].</p>
<p><strong>Executive Summary:</strong></p>
<ul>
  <li><strong>Operational Debt Level:</strong> Moderate-High (Legacy ERP requires immediate API decoupling).</li>
  <li><strong>EBITDA Expansion Upside:</strong> Strong (Est. $2.4M in annualized supply chain synergies post-consolidation).</li>
  <li><strong>Management Execution Capacity:</strong> High in core manufacturing; requires specialized leadership for digital fulfillment logistics.</li>
</ul>`,
  },
];

export const defaultWebmailEmails: WebmailEmail[] = [
  {
    id: 'mail-1',
    threadId: 'th-1',
    from: {
      name: 'Marcus Sterling',
      email: 'msterling@vanguardhorizonpe.com',
    },
    to: [
      {
        name: 'Kel Nnorom',
        email: 'kel@kelnnorom.com',
      },
    ],
    subject: 'CONFIDENTIAL: Turnaround Engagement for Portco Logistics Asset ($140M Rev)',
    preview: 'Kel, following our partner meeting yesterday, we would like to formally retain you for a 90-day turnaround of our Midwest freight operator...',
    bodyHtml: `
<p>Dear Kel,</p>
<p>Following our partner meeting yesterday, we would like to formally retain you for an urgent <strong>90-day operational turnaround</strong> of our Midwest logistics and freight distribution asset ($140M top-line revenue).</p>
<p>Over the last three quarters, EBITDA margins compressed from 14.2% down to 6.8%, driven primarily by fuel surcharge leakage, high driver turnover, and inter-hub dispatch delays.</p>

<p><strong>Proposed Scope of Engagement:</strong></p>
<ul>
  <li>Immediate on-site diagnostic of central operations hub (Chicago & Indianapolis).</li>
  <li>Full audit of fleet telemetry, maintenance scheduling, and fuel hedging contracts.</li>
  <li>Implementation of your 90-Day Turnaround Framework with weekly partner updates.</li>
</ul>

<p>Could we convene for a preliminary briefing call this Thursday at 10:00 AM EST? I have attached our preliminary operating ledger and management accounts.</p>

<p>Best regards,</p>
<p><strong>Marcus Sterling</strong><br />Managing Director, Portfolio Operations<br />Vanguard Horizon Capital</p>`,
    bodyText: `Dear Kel,\n\nFollowing our partner meeting yesterday, we would like to formally retain you for an urgent 90-day operational turnaround...`,
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    date: 'Today, 10:45 AM',
    folder: 'inbox',
    read: false,
    starred: true,
    flagged: true,
    priority: 'urgent',
    labels: ['Turnaround Lead', 'Executive Advisory'],
    attachments: [
      {
        id: 'att-1',
        name: 'Portco_Logistics_Q2_Management_Ledger.pdf',
        size: '3.4 MB',
        type: 'application/pdf',
      },
      {
        id: 'att-2',
        name: 'Turnaround_Governance_Charter_Draft.docx',
        size: '480 KB',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    ],
  },
  {
    id: 'mail-2',
    threadId: 'th-2',
    from: {
      name: 'Dr. Elena Rostova',
      email: 'e.rostova@apollomediaadvisory.com',
    },
    to: [
      {
        name: 'Kel Nnorom',
        email: 'kel@kelnnorom.com',
      },
    ],
    subject: 'Ad Mediation Arbitrage: Yield Results Exceeding Forecast (+31.4% eCPM)',
    preview: 'Kel, the telemetry data from our 14-day production rollout of your algorithmic floor pricing matrix just came in. We recorded a sustained 31.4% eCPM lift...',
    bodyHtml: `
<p>Hi Kel,</p>
<p>The telemetry data from our 14-day production rollout of your <strong>Dynamic Prebid Mediation & Floor-Price Model</strong> just completed validation. The results are exceptional:</p>
<ul>
  <li><strong>Blended eCPM:</strong> Increased from $2.14 to $2.81 (+31.4% net margin lift).</li>
  <li><strong>Fill Rate:</strong> Maintained at 99.2% without latency degradation.</li>
  <li><strong>Core Web Vitals FID / INP:</strong> Zero negative impact on page responsiveness.</li>
</ul>
<p>The board was thoroughly impressed with the velocity of this deployment. We would like to expand this architecture across our European publishing subsidiaries next month.</p>
<p>Warm regards,</p>
<p><strong>Dr. Elena Rostova</strong><br />Chief Strategy Officer | Apollo Media Group</p>`,
    bodyText: `Hi Kel,\n\nThe telemetry data from our 14-day production rollout of your Dynamic Prebid Mediation & Floor-Price Model just completed validation...`,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    date: 'Today, 7:15 AM',
    folder: 'inbox',
    read: true,
    starred: true,
    flagged: false,
    priority: 'high',
    labels: ['Ad Monetization', 'Client'],
    attachments: [
      {
        id: 'att-3',
        name: 'Apollo_Yield_Lift_Telemetry_Report.pdf',
        size: '1.8 MB',
        type: 'application/pdf',
      },
    ],
  },
  {
    id: 'mail-3',
    threadId: 'th-3',
    from: {
      name: 'Julian Vance',
      email: 'julian.vance@boardnexus.org',
    },
    to: [
      {
        name: 'Kel Nnorom',
        email: 'kel@kelnnorom.com',
      },
    ],
    subject: 'Invitation: Keynote Speaker at Global Supply Chain & Telemetry Summit 2026',
    preview: 'Dear Kel, on behalf of the Board of Governors, it is our distinct privilege to invite you to deliver the Opening Keynote on Battlefield Turnaround Operations...',
    bodyHtml: `
<p>Dear Kel,</p>
<p>On behalf of the Board of Governors at the Global Supply Chain Institute, it is our distinct privilege to formally invite you as our <strong>Opening Keynote Speaker</strong> for the 2026 International Supply Chain & Telemetry Summit in Geneva.</p>
<p>Your recent essays on <em>The Anatomy of an Operational Turnaround</em> and <em>Supply Chain Telemetry</em> have resonated deeply across our Fortune 500 COO executive network.</p>
<p><strong>Session Details:</strong></p>
<ul>
  <li><strong>Topic:</strong> First-Principles Execution: Reversing Multi-Million Dollar Margin Bleeds in Volatile Environments</li>
  <li><strong>Audience:</strong> 450+ Chief Operating Officers, Private Equity Operating Partners, and Enterprise Transformation Leaders</li>
  <li><strong>Format:</strong> 40-minute keynote + 20-minute executive fireside Q&A</li>
</ul>
<p>Our executive coordinator will follow up regarding travel arrangements and honorarium particulars.</p>
<p>Sincerely,</p>
<p><strong>Julian Vance</strong><br />Chairman, Global Supply Chain Institute</p>`,
    bodyText: `Dear Kel,\n\nOn behalf of the Board of Governors, it is our distinct privilege to formally invite you as our Opening Keynote Speaker...`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    date: 'Yesterday, 3:30 PM',
    folder: 'inbox',
    read: true,
    starred: false,
    flagged: false,
    priority: 'normal',
    labels: ['Speaking & Media', 'Board Memo'],
  },
  {
    id: 'mail-4',
    threadId: 'th-4',
    from: {
      name: 'Kel Nnorom',
      email: 'kel@kelnnorom.com',
    },
    to: [
      {
        name: 'Amina Al-Mansoor',
        email: 'amina@nexuslogistics.ae',
      },
    ],
    subject: 'RE: Milestone 2 Review: Fulfillment SLA Recovery & Dispatch Optimization',
    preview: 'Dear Amina, thank you for reviewing the Phase 2 milestone deliverables. Our telemetry sensors across the Dubai South hub show a 42% reduction in gate wait times...',
    bodyHtml: `
<p>Dear Amina,</p>
<p>Thank you for convening your leadership team for the Phase 2 Milestone review.</p>
<p>Our telemetry sensors across the Dubai South hub show a <strong>42% reduction in gate turnaround latency</strong> and our newly implemented dynamic dispatch algorithm has officially eliminated weekend SLA backlogs.</p>
<p>We are now transitioning directly into Phase 3: Finalizing standard operating procedures (SOPs) and empowering regional station managers with the automated margin dashboard.</p>
<p>Looking forward to our on-site executive wrap-up next Tuesday.</p>
<p>Best,</p>
<p><strong>Kel Nnorom</strong></p>`,
    bodyText: `Dear Amina,\n\nThank you for convening your leadership team for the Phase 2 Milestone review...`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    date: 'Yesterday, 9:15 AM',
    folder: 'sent',
    read: true,
    starred: false,
    flagged: false,
    priority: 'normal',
    isOutgoing: true,
    labels: ['Turnaround Lead', 'Client'],
  },
  {
    id: 'mail-5',
    threadId: 'th-5',
    from: {
      name: 'Kel Nnorom',
      email: 'kel@kelnnorom.com',
    },
    to: [
      {
        name: 'Newsletter Advisory Circle',
        email: 'subscribers@kelnnorom.com',
      },
    ],
    subject: '[Executive Memo #48] The 7 Warning Signs of Silent Margin Decay',
    preview: 'In this monthly executive briefing: Deconstructing margin erosion that hides behind top-line revenue growth, inventory holding traps, and real-time EBITDA telemetry...',
    bodyHtml: `
<p><em>Executive Briefing Dispatch — Private Distribution</em></p>
<h2>The 7 Warning Signs of Silent Margin Decay</h2>
<p>Top-line revenue expansion is the most seductive narcotic in modern business. It routinely conceals fatal balance sheet pathologies until cash flow breaks down.</p>
<p>In this month's debrief, we explore the specific telemetry signals our turnaround teams monitor in week one of an emergency turnaround...</p>`,
    bodyText: `Executive Briefing Dispatch — Private Distribution\n\nThe 7 Warning Signs of Silent Margin Decay...`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    date: '3 days ago',
    folder: 'sent',
    read: true,
    starred: true,
    flagged: false,
    priority: 'normal',
    isOutgoing: true,
    labels: ['Newsletter Dispatch'],
  },
  {
    id: 'mail-6',
    threadId: 'th-6',
    from: {
      name: 'Kel Nnorom',
      email: 'kel@kelnnorom.com',
    },
    to: [
      {
        name: 'Marcus Sterling',
        email: 'msterling@vanguardhorizonpe.com',
      },
    ],
    subject: 'DRAFT: Advisory Engagement Term Sheet — Portco Logistics Turnaround',
    preview: 'Marcus, here is our preliminary fee and performance milestone structure for the 90-day turnaround engagement...',
    bodyHtml: `
<p>Marcus,</p>
<p>Attached is our standard fee and performance milestone structure for the 90-day engagement:</p>
<ul>
  <li>Fixed advisory retainer: $45,000 / month</li>
  <li>Success milestone fee: 8.5% of verified EBITDA recovery above baseline hurdle rate</li>
  <li>Weekly on-site deployment: 3 days in Chicago/Indy hubs</li>
</ul>`,
    bodyText: `Marcus,\n\nAttached is our standard fee and performance milestone structure...`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    date: 'Today, 4:00 AM',
    folder: 'drafts',
    read: true,
    starred: false,
    flagged: false,
    priority: 'high',
    isOutgoing: true,
    labels: ['Turnaround Lead'],
  },
];
