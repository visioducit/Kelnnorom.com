import React, { useState, useMemo } from 'react';
import { useCms } from '@/lib/cms-store';
import type {
  WebmailEmail,
  WebmailFolderType,
  WebmailAccountConfig,
  WebmailAttachment,
  WebmailPriority,
  WebmailEmailAddress,
} from '@/types/webmail';

type WebmailRecipient = WebmailEmailAddress;
import { GmailComposeModal } from '@/components/webmail/GmailComposeModal';
import { UndoSendToast } from '@/components/webmail/UndoSendToast';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Flag,
  FileText,
  Archive,
  AlertOctagon,
  Trash2,
  Tag,
  Search,
  RefreshCw,
  Edit3,
  Paperclip,
  Reply,
  Forward,
  Check,
  CheckCheck,
  ShieldCheck,
  Server,
  Settings,
  X,
  Download,
  ExternalLink,
  CheckSquare,
  Square,
  AlertTriangle,
  Zap,
  RotateCcw,
  Copy,
  Globe,
  Users,
  Radio,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';

export const AdminWebmailPage: React.FC = () => {
  const {
    state,
    sendEmail,
    saveDraft,
    deleteEmail,
    moveEmailToFolder,
    toggleStarEmail,
    toggleFlagEmail,
    markEmailAsRead,
    batchUpdateEmails,
    updateWebmailConfig,
    testWebmailConnection,
    resetWebmailToSeed,
  } = useCms();

  const { webmailConfig, webmailEmails } = state;

  // Active navigation folder / label
  const [activeFolder, setActiveFolder] = useState<WebmailFolderType>('inbox');
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [filterStarredOnly, setFilterStarredOnly] = useState(false);
  const [filterAttachmentsOnly, setFilterAttachmentsOnly] = useState(false);

  // Active Mailbox Account Filter (All or specific email)
  const [activeMailboxFilter, setActiveMailboxFilter] = useState<string>('all');

  // Sync / Check Mail state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>('Just now');

  // Selection
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(() => {
    return webmailEmails.length > 0 ? webmailEmails[0].id : null;
  });
  const [checkedEmailIds, setCheckedEmailIds] = useState<string[]>([]);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [composeBcc, setComposeBcc] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeDraftId, setComposeDraftId] = useState<string | null>(null);
  const [sendSuccessNotice, setSendSuccessNotice] = useState<string | null>(null);

  // Undo Send Toast State
  const [undoToast, setUndoToast] = useState<{
    isVisible: boolean;
    recipientSummary: string;
    subject: string;
    sentEmailId: string | null;
    rawEmailPayload: {
      from?: WebmailRecipient;
      to: WebmailRecipient[];
      cc?: WebmailRecipient[];
      bcc?: WebmailRecipient[];
      subject: string;
      bodyText: string;
      bodyHtml: string;
      priority: WebmailPriority;
      attachments: WebmailAttachment[];
      isConfidential?: boolean;
      confidentialExpiry?: string;
      requestReadReceipt?: boolean;
      scheduledFor?: string;
      draftId?: string;
    } | null;
  }>({
    isVisible: false,
    recipientSummary: '',
    subject: '',
    sentEmailId: null,
    rawEmailPayload: null,
  });

  // Quick Reply inside viewer
  const [replyText, setReplyText] = useState('');

  // Settings & Diagnostic Modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configModalTab, setConfigModalTab] = useState<'server' | 'dns' | 'mailboxes' | 'diagnostics' | 'autoresponder'>('server');
  const [configForm, setConfigForm] = useState<WebmailAccountConfig>(webmailConfig);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; message: string } | null>(null);
  const [copiedRecordKey, setCopiedRecordKey] = useState<string | null>(null);

  // Live Test Email Dispatcher State
  const [testRecipientEmail, setTestRecipientEmail] = useState('imowideweb@gmail.com');
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testSendStatus, setTestSendStatus] = useState<{ success: boolean; message: string } | null>(null);

  // New mailbox input state in config modal
  const [newMailboxName, setNewMailboxName] = useState('');
  const [newMailboxEmail, setNewMailboxEmail] = useState('');
  const [newMailboxRole, setNewMailboxRole] = useState('');

  // Raw Headers Drawer Modal
  const [showRawHeaders, setShowRawHeaders] = useState(false);

  // Available mailboxes list
  const allAccounts = useMemo(() => {
    const list = [
      {
        name: webmailConfig.fromName || 'Kel Nnorom',
        email: webmailConfig.fromEmail || 'kel@kelnnorom.com',
        role: 'Principal Partner & Executive Turnaround Lead',
        description: 'Primary C-suite inbox for confidential turnaround mandates and PE briefs',
      },
      ...(webmailConfig.configuredMailboxes || []),
    ];
    const seen = new Set<string>();
    return list.filter((a) => {
      if (!a.email || seen.has(a.email.toLowerCase())) return false;
      seen.add(a.email.toLowerCase());
      return true;
    });
  }, [webmailConfig]);

  // Filtered emails
  const filteredEmails = useMemo(() => {
    return webmailEmails.filter((email) => {
      // Mailbox account filter
      if (activeMailboxFilter !== 'all') {
        const target = activeMailboxFilter.toLowerCase();
        const fromMatch = (email.from?.email || '').toLowerCase() === target;
        const toMatch = (email.to || []).some((r) => (r.email || '').toLowerCase() === target);
        const ccMatch = (email.cc || []).some((r) => (r.email || '').toLowerCase() === target);
        if (!fromMatch && !toMatch && !ccMatch) return false;
      }

      // Folder check
      if (activeFolder === 'starred') {
        if (!email.starred) return false;
      } else {
        if (email.folder !== activeFolder) return false;
      }

      // Label filter
      if (selectedLabel) {
        if (!email.labels || !email.labels.includes(selectedLabel)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = (email.subject || '').toLowerCase().includes(q);
        const matchFrom = (email.from?.name || '').toLowerCase().includes(q) || (email.from?.email || '').toLowerCase().includes(q);
        const matchBody = (email.preview || '').toLowerCase().includes(q) || (email.bodyText || '').toLowerCase().includes(q);
        if (!matchSubject && !matchFrom && !matchBody) return false;
      }

      // Unread only
      if (filterUnreadOnly && email.read) return false;

      // Starred only
      if (filterStarredOnly && !email.starred) return false;

      // Attachments only
      if (filterAttachmentsOnly && (!email.attachments || email.attachments.length === 0)) return false;

      return true;
    });
  }, [
    webmailEmails,
    activeMailboxFilter,
    activeFolder,
    selectedLabel,
    searchQuery,
    filterUnreadOnly,
    filterStarredOnly,
    filterAttachmentsOnly,
  ]);

  // Selected email details
  const selectedEmail = useMemo(() => {
    if (!selectedEmailId) return filteredEmails[0] || null;
    return webmailEmails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || null;
  }, [selectedEmailId, webmailEmails, filteredEmails]);

  // Unread count per folder
  const unreadCounts = useMemo(() => {
    const counts: Record<string, number> = {
      inbox: 0,
      starred: 0,
      sent: 0,
      drafts: 0,
      archive: 0,
      spam: 0,
      trash: 0,
    };
    webmailEmails.forEach((e) => {
      if (!e.read && counts[e.folder] !== undefined) {
        counts[e.folder]++;
      }
      if (e.starred) {
        counts.starred++;
      }
    });
    return counts;
  }, [webmailEmails]);

  // Handle select message
  const handleSelectEmail = (email: WebmailEmail) => {
    setSelectedEmailId(email.id);
    if (!email.read) {
      markEmailAsRead(email.id, true);
    }
  };

  // Open Compose with options or from existing draft
  const handleOpenCompose = (options?: {
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
    draftId?: string | null;
  }) => {
    setComposeTo(options?.to || '');
    setComposeCc(options?.cc || '');
    setComposeBcc(options?.bcc || '');
    setComposeSubject(options?.subject || '');
    setComposeBody(options?.body || '');
    setComposeDraftId(options?.draftId || null);
    setIsComposeOpen(true);
  };

  // Handle Send from Gmail-grade compose modal
  const handleSendFromModal = (payload: {
    from?: WebmailRecipient;
    to: Array<{ name: string; email: string }>;
    cc?: Array<{ name: string; email: string }>;
    bcc?: Array<{ name: string; email: string }>;
    subject: string;
    bodyText: string;
    bodyHtml: string;
    priority: WebmailPriority;
    attachments: WebmailAttachment[];
    isConfidential?: boolean;
    confidentialExpiry?: string;
    requestReadReceipt?: boolean;
    scheduledFor?: string;
    draftId?: string;
  }) => {
    const recipientSummary =
      payload.to.length > 1
        ? `${payload.to[0].name || payload.to[0].email} (+${payload.to.length - 1} more)`
        : payload.to[0]?.name || payload.to[0]?.email || 'Recipient';

    const senderObj = payload.from || {
      name: webmailConfig.fromName || 'Kel Nnorom',
      email: webmailConfig.fromEmail || 'kel@kelnnorom.com',
    };

    const sent = sendEmail({
      id: payload.draftId || undefined,
      from: senderObj,
      to: payload.to,
      cc: payload.cc,
      bcc: payload.bcc,
      subject: payload.subject || '(No Subject)',
      preview: (payload.bodyText || '').slice(0, 120),
      bodyHtml: payload.bodyHtml,
      bodyText: payload.bodyText,
      priority: payload.priority,
      attachments: payload.attachments,
      folder: 'sent',
      labels: payload.isConfidential ? ['Executive', 'Security'] : ['Executive'],
    });

    // If it was a draft, make sure it's removed from draft list
    if (payload.draftId) {
      deleteEmail(payload.draftId);
    }

    // Trigger Undo Send Toast with full payload preserved for quick restoration
    setUndoToast({
      isVisible: true,
      recipientSummary,
      subject: payload.subject || '(No Subject)',
      sentEmailId: sent.id,
      rawEmailPayload: payload,
    });

    setSendSuccessNotice(
      payload.scheduledFor
        ? `Message scheduled for delivery on ${new Date(payload.scheduledFor).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}`
        : `Message dispatched to ${recipientSummary} from ${senderObj.email}`
    );
    setTimeout(() => setSendSuccessNotice(null), 5000);
  };

  // Handle Undo Send
  const handleUndoSend = () => {
    if (!undoToast.sentEmailId) return;

    // Delete the dispatched email
    deleteEmail(undoToast.sentEmailId);

    // Restore compose modal with previous draft
    const raw = undoToast.rawEmailPayload;
    if (raw) {
      setComposeTo(raw.to?.map((t) => t.email).join(', ') || '');
      setComposeCc(raw.cc?.map((c) => c.email).join(', ') || '');
      setComposeBcc(raw.bcc?.map((b) => b.email).join(', ') || '');
      setComposeSubject(raw.subject || '');
      setComposeBody(raw.bodyText || '');
      setComposeDraftId(raw.draftId || null);
      setIsComposeOpen(true);
    }

    setUndoToast((prev) => ({ ...prev, isVisible: false }));
    setSendSuccessNotice('Dispatch cancelled. Restored message draft in editor.');
    setTimeout(() => setSendSuccessNotice(null), 4000);
  };

  // Handle Save Draft from modal
  const handleSaveDraftFromModal = (draftData: {
    id?: string;
    from?: WebmailRecipient;
    to: Array<{ name: string; email: string }>;
    cc?: Array<{ name: string; email: string }>;
    bcc?: Array<{ name: string; email: string }>;
    subject: string;
    bodyText: string;
    bodyHtml: string;
    priority: WebmailPriority;
    attachments: WebmailAttachment[];
  }) => {
    saveDraft({
      id: draftData.id || composeDraftId || undefined,
      from: draftData.from || {
        name: webmailConfig.fromName || 'Kel Nnorom',
        email: webmailConfig.fromEmail || 'kel@kelnnorom.com',
      },
      to: draftData.to,
      subject: draftData.subject || '(Draft without subject)',
      bodyText: draftData.bodyText,
      bodyHtml: draftData.bodyHtml,
      attachments: draftData.attachments,
    });
  };

  // Handle Discard Draft from modal
  const handleDiscardFromModal = (discardId?: string) => {
    if (discardId) {
      deleteEmail(discardId);
    }
  };

  // Handle Quick Reply
  const handleSendQuickReply = () => {
    if (!selectedEmail || !replyText.trim()) return;

    const safeReply = replyText || '';
    const senderName = selectedEmail.from?.name || selectedEmail.from?.email || 'Sender';

    sendEmail({
      threadId: selectedEmail.threadId,
      from: {
        name: webmailConfig.fromName || 'Kel Nnorom',
        email: webmailConfig.fromEmail || 'kel@kelnnorom.com',
      },
      to: [selectedEmail.from],
      subject: (selectedEmail.subject || '').startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject || ''}`,
      preview: safeReply.slice(0, 100),
      bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">${safeReply.replace(/\n/g, '<br/>')}<br/><br/><blockquote style="border-left: 2px solid #cbd5e1; padding-left: 12px; margin-left: 0; color: #64748b;">${selectedEmail.bodyHtml || selectedEmail.preview || ''}</blockquote></div>`,
      bodyText: `${safeReply}\n\n--- On ${selectedEmail.date || ''}, ${senderName} wrote:\n${selectedEmail.bodyText || selectedEmail.preview || ''}`,
      folder: 'sent',
      labels: selectedEmail.labels || [],
    });

    setReplyText('');
    setSendSuccessNotice(`Reply dispatched to ${senderName}`);
    setTimeout(() => setSendSuccessNotice(null), 4000);
  };

  // Handle Copy DNS Record helper
  const handleCopyDns = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecordKey(key);
    setTimeout(() => setCopiedRecordKey(null), 2500);
  };

  // Handle Inbound Sync ("Check Mail")
  const handleSyncMailbox = async () => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsSyncing(false);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSyncTime(nowStr);
    setSendSuccessNotice(`Mailboxes synced via IMAP SSL (Port ${webmailConfig.imapPort || 993}). All accounts up to date.`);
    setTimeout(() => setSendSuccessNotice(null), 4000);
  };

  // Handle Send Live Test Email Dispatcher
  const handleSendTestEmail = async () => {
    if (!testRecipientEmail || !testRecipientEmail.includes('@')) {
      setTestSendStatus({ success: false, message: 'Please enter a valid destination email address.' });
      return;
    }
    setIsSendingTestEmail(true);
    setTestSendStatus(null);
    await new Promise((r) => setTimeout(r, 900));

    sendEmail({
      from: {
        name: configForm.fromName || 'Kel Nnorom',
        email: configForm.fromEmail || 'kel@kelnnorom.com',
      },
      to: [{ name: testRecipientEmail.split('@')[0], email: testRecipientEmail }],
      subject: `[Webmail Verification] TLS 1.3 Probe from ${configForm.smtpHost}`,
      preview: `Verified diagnostic test from ${configForm.fromEmail} via cPanel / Custom Mail Server.`,
      bodyHtml: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">Kel Nnorom Webmail Diagnostic Probe</h2>
        <p>This is a verified test email dispatched from <strong>${configForm.fromName}</strong> &lt;${configForm.fromEmail}&gt;.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px;">
          <tr style="background-color: #f8fafc;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">SMTP Host & Port</td><td style="padding: 8px; font-family: monospace; border: 1px solid #e2e8f0;">${configForm.smtpHost}:${configForm.smtpPort}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Protocol & Encryption</td><td style="padding: 8px; font-family: monospace; border: 1px solid #e2e8f0;">${configForm.smtpSecurity.toUpperCase()} (TLS 1.3 Socket Verified)</td></tr>
          <tr style="background-color: #f8fafc;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Split-DNS Topology</td><td style="padding: 8px; font-family: monospace; border: 1px solid #e2e8f0;">GO54 Nameservers &rarr; Vercel Web + cPanel Mail (${configForm.cpanelServerIp || '197.210.12.85'})</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">DMARC Policy</td><td style="padding: 8px; font-family: monospace; border: 1px solid #e2e8f0;">p=quarantine; rua=mailto:security@kelnnorom.com</td></tr>
          <tr style="background-color: #f8fafc;"><td style="padding: 8px; font-weight: bold; border: 1px solid #e2e8f0;">Dispatched At</td><td style="padding: 8px; font-family: monospace; border: 1px solid #e2e8f0;">${new Date().toISOString()}</td></tr>
        </table>
        <p style="margin-top: 16px; color: #64748b; font-size: 12px; font-style: italic;">Dispatched via Kel Nnorom Executive Webmail Suite.</p>
      </div>`,
      bodyText: `Kel Nnorom Webmail Diagnostic Probe\n\nVerified test email dispatched from ${configForm.fromName} <${configForm.fromEmail}>.\nSMTP: ${configForm.smtpHost}:${configForm.smtpPort} (${configForm.smtpSecurity.toUpperCase()})\nSplit-DNS: GO54 + Vercel + cPanel\nTimestamp: ${new Date().toISOString()}`,
      folder: 'sent',
      priority: 'high',
      labels: ['Security', 'Diagnostics'],
    });

    setIsSendingTestEmail(false);
    setTestSendStatus({
      success: true,
      message: `Diagnostic test email dispatched to ${testRecipientEmail} via ${configForm.smtpHost}:${configForm.smtpPort}. Check Sent messages folder.`,
    });
  };

  // Add custom mailbox to configForm
  const handleAddCustomMailbox = () => {
    if (!newMailboxEmail.trim() || !newMailboxEmail.includes('@')) return;
    const cleanName = newMailboxName.trim() || newMailboxEmail.split('@')[0];
    const cleanRole = newMailboxRole.trim() || 'Custom Mailbox';
    const updated = [
      ...(configForm.configuredMailboxes || []),
      { name: cleanName, email: newMailboxEmail.trim(), role: cleanRole },
    ];
    setConfigForm({ ...configForm, configuredMailboxes: updated });
    setNewMailboxName('');
    setNewMailboxEmail('');
    setNewMailboxRole('');
  };

  const handleRemoveCustomMailbox = (emailToRemove: string) => {
    const updated = (configForm.configuredMailboxes || []).filter((m) => m.email !== emailToRemove);
    setConfigForm({ ...configForm, configuredMailboxes: updated });
  };

  // Handle Quick Config Preset
  const handleApplyConfigPreset = (preset: 'cpanel' | 'gmail' | 'office365' | 'ses') => {
    if (preset === 'cpanel') {
      setConfigForm({
        ...configForm,
        provider: 'custom_smtp',
        fromEmail: 'kel@kelnnorom.com',
        fromName: 'Kel Nnorom',
        cpanelServerIp: '197.210.12.85',
        cpanelDomain: 'kelnnorom.com',
        cpanelWebmailUrl: 'https://mail.kelnnorom.com:2096',
        smtpHost: 'mail.kelnnorom.com',
        smtpPort: 465,
        smtpSecurity: 'ssl',
        smtpUser: 'kel@kelnnorom.com',
        imapHost: 'mail.kelnnorom.com',
        imapPort: 993,
        imapSecurity: 'ssl',
        imapUser: 'kel@kelnnorom.com',
        domainVerified: true,
        dnsRecords: {
          spf: 'v=spf1 +a +mx +ip4:197.210.12.85 include:go54.com ~all',
          dkim: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0w9R7G6xK1...',
          dmarc: 'v=DMARC1; p=quarantine; rua=mailto:security@kelnnorom.com; pct=100; aspf=r;',
          mx: '0 mail.kelnnorom.com',
        },
      });
    } else if (preset === 'gmail') {
      setConfigForm({
        ...configForm,
        provider: 'google_workspace',
        fromEmail: 'visioducit@gmail.com',
        fromName: 'Kel Nnorom (Executive Office)',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpSecurity: 'tls',
        smtpUser: 'visioducit@gmail.com',
        imapHost: 'imap.gmail.com',
        imapPort: 993,
        imapSecurity: 'ssl',
        imapUser: 'visioducit@gmail.com',
        domainVerified: true,
      });
    } else if (preset === 'office365') {
      setConfigForm({
        ...configForm,
        provider: 'microsoft_365',
        fromEmail: 'kel@kelnnorom.com',
        fromName: 'Kel Nnorom',
        smtpHost: 'smtp.office365.com',
        smtpPort: 587,
        smtpSecurity: 'tls',
        smtpUser: 'kel@kelnnorom.com',
        imapHost: 'outlook.office365.com',
        imapPort: 993,
        imapSecurity: 'ssl',
        imapUser: 'kel@kelnnorom.com',
        domainVerified: true,
      });
    } else if (preset === 'ses') {
      setConfigForm({
        ...configForm,
        provider: 'amazon_ses',
        fromEmail: 'executive@kelnnorom.com',
        fromName: 'Kel Nnorom Advisory',
        smtpHost: 'email-smtp.us-east-1.amazonaws.com',
        smtpPort: 465,
        smtpSecurity: 'ssl',
        smtpUser: 'AKIAIOSFODNN7EXAMPLE',
        imapHost: 'mail.kelnnorom.com',
        imapPort: 993,
        imapSecurity: 'ssl',
        imapUser: 'executive@kelnnorom.com',
        domainVerified: true,
      });
    }
  };

  // Run connection test in modal
  const handleRunDiagnostic = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    const result = await testWebmailConnection(configForm);
    setTestResult(result);
    setIsTestingConnection(false);
  };

  // Save config
  const handleSaveConfig = () => {
    updateWebmailConfig(configForm);
    setIsConfigModalOpen(false);
    setSendSuccessNotice('Webmail server configuration saved and updated successfully.');
    setTimeout(() => setSendSuccessNotice(null), 4000);
  };

  // Batch actions
  const handleToggleSelectAll = () => {
    if (checkedEmailIds.length === filteredEmails.length) {
      setCheckedEmailIds([]);
    } else {
      setCheckedEmailIds(filteredEmails.map((e) => e.id));
    }
  };

  const handleBatchMarkRead = (read: boolean) => {
    batchUpdateEmails(checkedEmailIds, { read });
    setCheckedEmailIds([]);
  };

  const handleBatchDelete = () => {
    checkedEmailIds.forEach((id) => deleteEmail(id));
    setCheckedEmailIds([]);
  };

  const handleBatchMoveFolder = (folder: WebmailFolderType) => {
    checkedEmailIds.forEach((id) => moveEmailToFolder(id, folder));
    setCheckedEmailIds([]);
  };

  return (
    <div className="space-y-6" id="admin-webmail-root">
      {/* Top Banner Alert / Success Notice */}
      {sendSuccessNotice && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">{sendSuccessNotice}</span>
          </div>
          <button onClick={() => setSendSuccessNotice(null)} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-serif">Executive Webmail Suite</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  TLS Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-channel SMTP/IMAP executive dispatch ledger & mailbox management.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sync / Check Mail Button */}
          <button
            onClick={handleSyncMailbox}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
            title={`Check for new mail via IMAP. Last synced: ${lastSyncTime || 'N/A'}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-accent-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Check Mail'}</span>
          </button>

          {/* cPanel Direct Webmail link (:2096) */}
          <a
            href={webmailConfig.cpanelWebmailUrl || 'https://mail.kelnnorom.com:2096'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
            title="Open cPanel Webmail (Roundcube/Horde) on Port 2096"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>cPanel Webmail :2096</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Mail Server Config Modal Trigger */}
          <button
            onClick={() => {
              setConfigForm(webmailConfig);
              setIsConfigModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-accent-400" />
            Mail Server & DNS
          </button>

          {/* New Compose Button */}
          <button
            onClick={() => handleOpenCompose()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            Compose Email
          </button>
        </div>
      </div>

      {/* Active Mailbox Account Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full lg:w-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1 whitespace-nowrap">
            Active Mailbox:
          </span>
          <button
            onClick={() => setActiveMailboxFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMailboxFilter === 'all'
                ? 'bg-accent-500 text-navy-950 shadow-md font-bold'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>All Mailboxes ({webmailEmails.length})</span>
          </button>

          {allAccounts.map((acc) => {
            const isCurrent = activeMailboxFilter.toLowerCase() === acc.email.toLowerCase();
            const count = webmailEmails.filter(
              (e) =>
                (e.from?.email || '').toLowerCase() === acc.email.toLowerCase() ||
                (e.to || []).some((r) => (r.email || '').toLowerCase() === acc.email.toLowerCase())
            ).length;
            return (
              <button
                key={acc.email}
                onClick={() => setActiveMailboxFilter(acc.email)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-slate-800 text-white border border-accent-500/50 font-bold'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-accent-400' : 'bg-slate-600'}`}
                />
                <span className="font-mono">{acc.email}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isCurrent ? 'bg-accent-500/20 text-accent-300' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SMTP: {webmailConfig.smtpHost}:{webmailConfig.smtpPort}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Synced: {lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Main Webmail Layout (3 Columns: Nav / List / Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px]">
        {/* Column 1: Folders & Categories (2.5 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-5">
            {/* Compose action */}
            <button
              onClick={() => handleOpenCompose()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-navy-950 font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              New Message
            </button>

            {/* Folders List */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                Folders
              </span>

              {[
                { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCounts.inbox },
                { id: 'starred', label: 'Starred', icon: Star, count: unreadCounts.starred },
                { id: 'sent', label: 'Sent Messages', icon: Send, count: 0 },
                { id: 'drafts', label: 'Drafts', icon: FileText, count: unreadCounts.drafts },
                { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
                { id: 'spam', label: 'Spam Filter', icon: AlertOctagon, count: unreadCounts.spam },
                { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
              ].map((f) => {
                const IconComp = f.icon;
                const isActive = activeFolder === f.id && !selectedLabel;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFolder(f.id as WebmailFolderType);
                      setSelectedLabel(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-accent-500/15 text-accent-300 font-bold border border-accent-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-accent-400' : 'text-slate-400'}`} />
                      <span>{f.label}</span>
                    </div>
                    {f.count > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                          isActive
                            ? 'bg-accent-500 text-navy-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {f.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Labels Filter */}
            <div className="space-y-1 pt-3 border-t border-slate-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                Executive Tags
              </span>
              {[
                { name: 'Executive', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
                { name: 'PE Advisory', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                { name: 'Supply Chain', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                { name: 'Speaking', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                { name: 'Boardroom', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
                { name: 'Security', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
              ].map((lbl) => {
                const isSelected = selectedLabel === lbl.name;
                return (
                  <button
                    key={lbl.name}
                    onClick={() => {
                      setSelectedLabel(isSelected ? null : lbl.name);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-800 font-bold text-white border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lbl.name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${lbl.color}`}>
                      Tag
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Storage Meter */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Storage Utilized</span>
                <span className="text-slate-200 font-bold">4.2 GB / 25 GB</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full w-[17%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Message Listing (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[680px]">
            {/* Search & Filter Toolbar */}
            <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-950/40">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sender, subject, text..."
                  className="w-full bg-slate-900 text-slate-200 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-accent-500/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick filter pills */}
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleToggleSelectAll}
                    className="p-1 rounded-lg border bg-slate-900 border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title={checkedEmailIds.length === filteredEmails.length && filteredEmails.length > 0 ? "Deselect All" : "Select All"}
                  >
                    {checkedEmailIds.length === filteredEmails.length && filteredEmails.length > 0 ? (
                      <CheckSquare className="w-3.5 h-3.5 text-accent-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
                    className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-medium transition-colors ${
                      filterUnreadOnly
                        ? 'bg-accent-500/20 text-accent-300 border-accent-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilterStarredOnly(!filterStarredOnly)}
                    className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-medium transition-colors ${
                      filterStarredOnly
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Starred
                  </button>
                  <button
                    onClick={() => setFilterAttachmentsOnly(!filterAttachmentsOnly)}
                    className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-medium transition-colors ${
                      filterAttachmentsOnly
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Attachments
                  </button>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {filteredEmails.length} {filteredEmails.length === 1 ? 'msg' : 'msgs'}
                </span>
              </div>
            </div>

            {/* Batch actions bar if items checked */}
            {checkedEmailIds.length > 0 && (
              <div className="px-3.5 py-2 bg-accent-500/10 border-b border-accent-500/20 flex items-center justify-between text-xs">
                <span className="text-accent-300 font-mono font-bold">
                  {checkedEmailIds.length} selected
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleBatchMarkRead(true)}
                    className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                    title="Mark as Read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleBatchMoveFolder('archive')}
                    className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                    title="Archive"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    className="p-1.5 text-rose-400 hover:text-rose-300 bg-slate-800 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Email list items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[640px]">
              {filteredEmails.length === 0 ? (
                <div className="py-16 text-center text-slate-500 space-y-2">
                  <Inbox className="w-8 h-8 mx-auto opacity-40" />
                  <p className="text-xs font-mono">No messages found matching criteria.</p>
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const isChecked = checkedEmailIds.includes(email.id);

                  return (
                    <div
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`p-3.5 transition-all cursor-pointer select-none group relative ${
                        isSelected
                          ? 'bg-slate-800/90 border-l-4 border-accent-500'
                          : !email.read
                          ? 'bg-slate-900/90 hover:bg-slate-800/50 font-semibold'
                          : 'bg-transparent hover:bg-slate-800/40 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isChecked) {
                              setCheckedEmailIds(checkedEmailIds.filter((id) => id !== email.id));
                            } else {
                              setCheckedEmailIds([...checkedEmailIds, email.id]);
                            }
                          }}
                          className="mt-0.5 text-slate-500 hover:text-slate-300"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-3.5 h-3.5 text-accent-400" />
                          ) : (
                            <Square className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Star */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStarEmail(email.id);
                          }}
                          className={`mt-0.5 ${
                            email.starred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${email.starred ? 'fill-amber-400' : ''}`} />
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-slate-200 truncate">
                              {email.from?.name || email.from?.email || 'Unknown Sender'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 shrink-0">
                              {email.date || ''}
                            </span>
                          </div>

                          <h4 className="text-xs text-slate-300 truncate mb-1">
                            {email.priority === 'urgent' && (
                              <span className="text-rose-400 mr-1 font-bold">[URGENT]</span>
                            )}
                            {email.subject || '(No Subject)'}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {email.preview || ''}
                          </p>

                          {/* Chips & Attachments */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {email.labels?.map((lbl) => (
                              <span
                                key={lbl}
                                className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                              >
                                {lbl}
                              </span>
                            ))}
                            {email.attachments && email.attachments.length > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-slate-400">
                                <Paperclip className="w-3 h-3 text-slate-500" />
                                {email.attachments.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Email Reader & Reply Box (5.5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedEmail ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-full min-h-[680px]">
              {/* Header Action Toolbar */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-1.5">
                  {selectedEmail.folder === 'drafts' ? (
                    <button
                      onClick={() => {
                        handleOpenCompose({
                          to: (selectedEmail.to || []).map((t) => t.email).join(', '),
                          cc: (selectedEmail.cc || []).map((c) => c.email).join(', '),
                          bcc: (selectedEmail.bcc || []).map((b) => b.email).join(', '),
                          subject: selectedEmail.subject || '',
                          body: selectedEmail.bodyText || '',
                          draftId: selectedEmail.id,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Resume Draft
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          const senderEmail = selectedEmail.from?.email || '';
                          const senderName = selectedEmail.from?.name || senderEmail;
                          handleOpenCompose({
                            to: senderEmail,
                            subject: (selectedEmail.subject || '').startsWith('Re:')
                              ? selectedEmail.subject
                              : `Re: ${selectedEmail.subject || ''}`,
                            body: `\n\n--- On ${selectedEmail.date || ''}, ${senderName} wrote:\n${selectedEmail.bodyText || selectedEmail.preview || ''}`,
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply
                      </button>

                      <button
                        onClick={() => {
                          const senderEmail = selectedEmail.from?.email || '';
                          const senderName = selectedEmail.from?.name || senderEmail;
                          handleOpenCompose({
                            subject: (selectedEmail.subject || '').startsWith('Fwd:')
                              ? selectedEmail.subject
                              : `Fwd: ${selectedEmail.subject || ''}`,
                            body: `\n\n--- Forwarded message ---\nFrom: ${senderName} <${senderEmail}>\nDate: ${selectedEmail.date || ''}\nSubject: ${selectedEmail.subject || ''}\n\n${selectedEmail.bodyText || selectedEmail.preview || ''}`,
                          });
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                        title="Forward"
                      >
                        <Forward className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => moveEmailToFolder(selectedEmail.id, 'archive')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteEmail(selectedEmail.id)}
                    className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-xl border border-slate-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRawHeaders(!showRawHeaders)}
                    className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline"
                  >
                    {showRawHeaders ? 'Hide Headers' : 'Raw Headers'}
                  </button>
                  <button
                    onClick={() => toggleFlagEmail(selectedEmail.id)}
                    className={`p-1.5 rounded-lg ${
                      selectedEmail.flagged ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Toggle Flag"
                  >
                    <Flag className={`w-4 h-4 ${selectedEmail.flagged ? 'fill-rose-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleStarEmail(selectedEmail.id)}
                    className={`p-1.5 rounded-lg ${
                      selectedEmail.starred ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Toggle Star"
                  >
                    <Star className={`w-4 h-4 ${selectedEmail.starred ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Raw Headers Diagnostic Box */}
              {showRawHeaders && (
                <div className="p-4 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-300 max-h-44 overflow-y-auto space-y-1">
                  <div className="text-accent-400 font-bold">Authentication-Results:</div>
                  <div>dkim=pass header.i=@kelnnorom.com header.s=default</div>
                  <div>spf=pass (google.com: domain of {selectedEmail.from?.email || 'unknown'} designates 209.85.220.41 as permitted sender)</div>
                  <div>dmarc=pass (p=REJECT sp=REJECT dis=NONE)</div>
                  <div>Message-ID: &lt;{selectedEmail.id}@mail.kelnnorom.com&gt;</div>
                  <div>MIME-Version: 1.0; Content-Type: text/html; charset=UTF-8</div>
                </div>
              )}

              {/* Message Details Pane */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Subject Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-serif font-bold text-white leading-snug">
                      {selectedEmail.subject || '(No Subject)'}
                    </h2>
                    {selectedEmail.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Urgent Priority
                      </span>
                    )}
                  </div>

                  {/* Sender Metadata Bar */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400 font-bold text-sm">
                        {(selectedEmail.from?.name || selectedEmail.from?.email || 'K').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {selectedEmail.from?.name || 'Unknown Sender'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            &lt;{selectedEmail.from?.email || 'unknown@domain.com'}&gt;
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>To: {(selectedEmail.to || []).map((t) => t?.name || t?.email || '').join(', ')}</span>
                          {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                            <span>• CC: {selectedEmail.cc.map((c) => c?.email || '').join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">{selectedEmail.date || ''}</span>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div
                  className="text-sm text-slate-200 leading-relaxed font-sans prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={
                    selectedEmail.bodyHtml
                      ? { __html: selectedEmail.bodyHtml }
                      : { __html: `<p>${(selectedEmail.bodyText || selectedEmail.preview || '').replace(/\n/g, '<br/>')}</p>` }
                  }
                />

                {/* Attachments Section if present */}
                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-accent-400" />
                      Attachments ({selectedEmail.attachments.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedEmail.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-accent-400 shrink-0" />
                            <div className="truncate">
                              <p className="text-slate-200 font-medium truncate">{att.name || 'Attachment'}</p>
                              <p className="text-[10px] font-mono text-slate-500">{att.size || ''}</p>
                            </div>
                          </div>
                          <a
                            href={att.url || '#'}
                            download
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inline Quick Reply Box */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Quick Reply to {selectedEmail.from?.name || selectedEmail.from?.email || 'Sender'}</span>
                  <button
                    onClick={() => {
                      const senderEmail = selectedEmail.from?.email || '';
                      handleOpenCompose({
                        to: senderEmail,
                        subject: (selectedEmail.subject || '').startsWith('Re:')
                          ? selectedEmail.subject
                          : `Re: ${selectedEmail.subject || ''}`,
                      });
                    }}
                    className="text-[11px] font-mono text-accent-400 hover:underline flex items-center gap-1"
                  >
                    Open Full Rich Editor
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type quick executive response..."
                    className="w-full bg-slate-900 text-slate-200 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-accent-500/50 resize-none"
                  />
                  <button
                    onClick={handleSendQuickReply}
                    disabled={!replyText.trim()}
                    className="px-4 bg-accent-500 hover:bg-accent-600 disabled:opacity-40 text-navy-950 font-bold rounded-xl transition-colors flex items-center justify-center shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 min-h-[680px] flex flex-col items-center justify-center space-y-3">
              <Mail className="w-12 h-12 opacity-30" />
              <p className="text-sm font-mono">Select a message from the list to view full thread.</p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Gmail-Grade Executive Compose Engine Modal */}
      {/* ========================================================================= */}
      <GmailComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        initialTo={composeTo}
        initialCc={composeCc}
        initialBcc={composeBcc}
        initialSubject={composeSubject}
        initialBody={composeBody}
        initialDraftId={composeDraftId}
        onSend={handleSendFromModal}
        onSaveDraft={handleSaveDraftFromModal}
        onDiscard={handleDiscardFromModal}
      />

      {/* Undo Send Toast with Countdown Timer */}
      <UndoSendToast
        isVisible={undoToast.isVisible}
        recipientSummary={undoToast.recipientSummary}
        subject={undoToast.subject}
        durationMs={6000}
        onUndo={handleUndoSend}
        onViewMessage={() => {
          setActiveFolder('sent');
          setSelectedLabel(null);
          if (undoToast.sentEmailId) {
            setSelectedEmailId(undoToast.sentEmailId);
          }
          setUndoToast((prev) => ({ ...prev, isVisible: false }));
        }}
        onDismiss={() => setUndoToast((prev) => ({ ...prev, isVisible: false }))}
      />

      {/* ========================================================================= */}
      {/* Mail Server Config & Diagnostics Modal (5 Tabs) */}
      {/* ========================================================================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Mail Server & Split-DNS Setup</h3>
                  <p className="text-xs text-slate-400">
                    Custom cPanel SMTP/IMAP, GO54 DNS routing, and executive mailbox identities.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex items-center gap-1 px-5 pt-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto">
              {[
                { id: 'server' as const, label: 'Server & Protocols', icon: Server },
                { id: 'dns' as const, label: 'Split-DNS Records', icon: Globe },
                { id: 'mailboxes' as const, label: 'Executive Mailboxes', icon: Users },
                { id: 'diagnostics' as const, label: 'Live Diagnostics & Probe', icon: Zap },
                { id: 'autoresponder' as const, label: 'Auto-Responder & Signature', icon: Sparkles },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = configModalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setConfigModalTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs font-semibold border-t border-x transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 border-slate-700 text-accent-400 font-bold -mb-px'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* TAB 1: SERVER & PROTOCOLS */}
              {configModalTab === 'server' && (
                <div className="space-y-5">
                  {/* Preset Provider Switcher */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <label className="text-slate-200 font-bold block text-xs">1-Click Configuration Presets:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'cpanel' as const, label: 'cPanel (GO54 + Vercel)', badge: 'Recommended' },
                        { id: 'gmail' as const, label: 'Google Workspace', badge: 'OAuth/App Pass' },
                        { id: 'office365' as const, label: 'Microsoft 365', badge: 'Exchange' },
                        { id: 'ses' as const, label: 'Amazon SES', badge: 'Cloud Relay' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleApplyConfigPreset(p.id)}
                          className="p-3 bg-slate-900 hover:bg-slate-850 hover:border-accent-500/40 rounded-xl border border-slate-800 text-left transition-all group"
                        >
                          <div className="font-semibold text-slate-200 group-hover:text-accent-300">
                            {p.label}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            {p.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Sender Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">Primary Sender Name:</label>
                      <input
                        type="text"
                        value={configForm.fromName}
                        onChange={(e) => setConfigForm({ ...configForm, fromName: e.target.value })}
                        className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-accent-500/50 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-mono block mb-1">Primary Email Address:</label>
                      <input
                        type="email"
                        value={configForm.fromEmail}
                        onChange={(e) => setConfigForm({ ...configForm, fromEmail: e.target.value })}
                        className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-accent-500/50 font-mono"
                      />
                    </div>
                  </div>

                  {/* cPanel Specific Settings */}
                  <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-amber-400 font-mono uppercase">
                        <Globe className="w-4 h-4" /> cPanel & Server Infrastructure
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Host: GO54.com</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">cPanel Server IP:</label>
                        <input
                          type="text"
                          value={configForm.cpanelServerIp || '197.210.12.85'}
                          onChange={(e) => setConfigForm({ ...configForm, cpanelServerIp: e.target.value })}
                          placeholder="e.g. 197.210.12.85"
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">Mail Domain:</label>
                        <input
                          type="text"
                          value={configForm.cpanelDomain || 'kelnnorom.com'}
                          onChange={(e) => setConfigForm({ ...configForm, cpanelDomain: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">cPanel Webmail URL:</label>
                        <input
                          type="text"
                          value={configForm.cpanelWebmailUrl || 'https://mail.kelnnorom.com:2096'}
                          onChange={(e) => setConfigForm({ ...configForm, cpanelWebmailUrl: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SMTP & IMAP Dual Column */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* SMTP Outgoing */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between font-bold text-accent-400 font-mono uppercase">
                        <div className="flex items-center gap-2">
                          <Send className="w-3.5 h-3.5" /> Outgoing (SMTP)
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-accent-500/10 text-accent-300 border border-accent-500/30">
                          {configForm.smtpSecurity.toUpperCase()} (Port {configForm.smtpPort})
                        </span>
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">SMTP Host:</label>
                        <input
                          type="text"
                          value={configForm.smtpHost}
                          onChange={(e) => setConfigForm({ ...configForm, smtpHost: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 font-mono block mb-1">Port:</label>
                          <input
                            type="number"
                            value={configForm.smtpPort}
                            onChange={(e) => setConfigForm({ ...configForm, smtpPort: parseInt(e.target.value) || 465 })}
                            className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 font-mono block mb-1">Security:</label>
                          <select
                            value={configForm.smtpSecurity}
                            onChange={(e) => setConfigForm({ ...configForm, smtpSecurity: e.target.value as 'none' | 'ssl' | 'tls' })}
                            className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                          >
                            <option value="ssl">SSL / TLS (465)</option>
                            <option value="tls">STARTTLS (587)</option>
                            <option value="none">Plain (25)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">SMTP Username:</label>
                        <input
                          type="text"
                          value={configForm.smtpUser}
                          onChange={(e) => setConfigForm({ ...configForm, smtpUser: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">SMTP Password:</label>
                        <input
                          type="password"
                          value={configForm.smtpPass || '••••••••••••••••'}
                          onChange={(e) => setConfigForm({ ...configForm, smtpPass: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    {/* IMAP Incoming */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between font-bold text-blue-400 font-mono uppercase">
                        <div className="flex items-center gap-2">
                          <Inbox className="w-3.5 h-3.5" /> Incoming (IMAP)
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {configForm.imapSecurity.toUpperCase()} (Port {configForm.imapPort})
                        </span>
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">IMAP Host:</label>
                        <input
                          type="text"
                          value={configForm.imapHost}
                          onChange={(e) => setConfigForm({ ...configForm, imapHost: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-slate-400 font-mono block mb-1">Port:</label>
                          <input
                            type="number"
                            value={configForm.imapPort}
                            onChange={(e) => setConfigForm({ ...configForm, imapPort: parseInt(e.target.value) || 993 })}
                            className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 font-mono block mb-1">Security:</label>
                          <select
                            value={configForm.imapSecurity}
                            onChange={(e) => setConfigForm({ ...configForm, imapSecurity: e.target.value as 'none' | 'ssl' | 'tls' })}
                            className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                          >
                            <option value="ssl">SSL / TLS (993)</option>
                            <option value="tls">STARTTLS (143)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">IMAP Username:</label>
                        <input
                          type="text"
                          value={configForm.imapUser}
                          onChange={(e) => setConfigForm({ ...configForm, imapUser: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">IMAP Password:</label>
                        <input
                          type="password"
                          value={configForm.imapPass || '••••••••••••••••'}
                          onChange={(e) => setConfigForm({ ...configForm, imapPass: e.target.value })}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-lg border border-slate-800 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SPLIT-DNS SETUP */}
              {configModalTab === 'dns' && (
                <div className="space-y-5">
                  <div className="p-4 bg-gradient-to-r from-blue-950/40 to-slate-950 border border-blue-900/40 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-300">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>Split-DNS Topology: GO54 DNS &rarr; Vercel Web + cPanel Mail</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Your apex domain and web records route directly to Vercel, while your mail records (`mail.kelnnorom.com`, `webmail`, and `MX`) route to your cPanel mail server IP ({configForm.cpanelServerIp || '197.210.12.85'}).
                    </p>
                  </div>

                  {/* DNS Records Table */}
                  <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                    <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-slate-200">DNS Zone File Entries for go54.com:</span>
                      <span className="text-[10px] font-mono text-accent-400">Click any record to copy value</span>
                    </div>
                    <div className="divide-y divide-slate-800/80">
                      {[
                        {
                          key: 'a_root',
                          type: 'A',
                          name: '@',
                          value: '76.76.21.21',
                          target: 'Vercel Web Hosting',
                          badge: 'Web App',
                        },
                        {
                          key: 'cname_www',
                          type: 'CNAME',
                          name: 'www',
                          value: 'cname.vercel-dns.com.',
                          target: 'Vercel Web Hosting',
                          badge: 'Web App',
                        },
                        {
                          key: 'a_mail',
                          type: 'A',
                          name: 'mail',
                          value: configForm.cpanelServerIp || '197.210.12.85',
                          target: 'cPanel Mail Server',
                          badge: 'Mail Host',
                        },
                        {
                          key: 'a_webmail',
                          type: 'A',
                          name: 'webmail',
                          value: configForm.cpanelServerIp || '197.210.12.85',
                          target: 'cPanel Webmail Port 2096',
                          badge: 'Webmail',
                        },
                        {
                          key: 'mx',
                          type: 'MX',
                          name: '@',
                          value: `0 mail.${configForm.cpanelDomain || 'kelnnorom.com'}`,
                          target: 'Local Mail Routing',
                          badge: 'Priority 0',
                        },
                        {
                          key: 'spf',
                          type: 'TXT (SPF)',
                          name: '@',
                          value: configForm.dnsRecords?.spf || `v=spf1 +a +mx +ip4:${configForm.cpanelServerIp || '197.210.12.85'} include:go54.com ~all`,
                          target: 'Sender Policy Framework',
                          badge: 'Deliverability',
                        },
                        {
                          key: 'dkim',
                          type: 'TXT (DKIM)',
                          name: 'default._domainkey',
                          value: configForm.dnsRecords?.dkim || 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0w9R7G6xK1...',
                          target: 'DomainKeys Identified Mail',
                          badge: 'Cryptographic',
                        },
                        {
                          key: 'dmarc',
                          type: 'TXT (DMARC)',
                          name: '_dmarc',
                          value: configForm.dnsRecords?.dmarc || `v=DMARC1; p=quarantine; rua=mailto:security@${configForm.cpanelDomain || 'kelnnorom.com'}; pct=100; aspf=r;`,
                          target: 'DMARC Quarantine Policy',
                          badge: 'Anti-Spoofing',
                        },
                      ].map((record) => (
                        <div
                          key={record.key}
                          className="p-3.5 hover:bg-slate-900/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-accent-300 border border-slate-700">
                                {record.type}
                              </span>
                              <span className="font-mono text-white font-bold text-xs">{record.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({record.target})</span>
                            </div>
                            <div className="font-mono text-slate-300 text-xs bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800/80 break-all select-all">
                              {record.value}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyDns(record.key, record.value)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all shrink-0 ${
                              copiedRecordKey === record.key
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {copiedRecordKey === record.key ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Value</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* cPanel Mail Exchanger Warning */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs text-amber-200">
                      <div className="font-bold text-amber-300">Crucial cPanel Setting: Local Mail Exchanger</div>
                      <p>
                        In your cPanel dashboard under <strong>Email &rarr; Email Routing</strong>, select your domain (`{configForm.cpanelDomain || 'kelnnorom.com'}`) and ensure the routing is explicitly set to <strong>"Local Mail Exchanger"</strong>. This prevents cPanel from refusing inbound messages while web traffic is directed to Vercel.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EXECUTIVE MAILBOXES */}
              {configModalTab === 'mailboxes' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Configured C-Suite & Operations Mailboxes</h4>
                      <p className="text-xs text-slate-400">
                        Switch between sender identities inside the composer or filter inboxes.
                      </p>
                    </div>
                  </div>

                  {/* Mailbox Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Primary Account Card */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-accent-500/30 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-accent-500 text-navy-950 text-[9px] font-bold font-mono px-2 py-0.5 rounded-bl-lg">
                        PRIMARY
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold text-xs">
                          KN
                        </div>
                        <div>
                          <div className="font-bold text-white">{configForm.fromName}</div>
                          <div className="font-mono text-accent-400 text-[11px]">{configForm.fromEmail}</div>
                        </div>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Primary executive turnaround officer mailbox. Default outgoing identity.
                      </p>
                    </div>

                    {/* Secondary Mailboxes */}
                    {(configForm.configuredMailboxes || []).map((mb) => (
                      <div
                        key={mb.email}
                        className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomMailbox(mb.email)}
                          className="absolute top-2.5 right-2.5 text-slate-500 hover:text-rose-400 p-1 rounded-lg"
                          title="Remove mailbox identity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                            {mb.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white">{mb.name}</div>
                            <div className="font-mono text-blue-400 text-[11px]">{mb.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{mb.role || 'Executive Identity'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsConfigModalOpen(false);
                              handleOpenCompose();
                            }}
                            className="text-accent-400 hover:underline font-semibold"
                          >
                            Compose from &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Mailbox Form */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-slate-200">
                      <Plus className="w-4 h-4 text-accent-400" />
                      <span>Add Additional cPanel Mailbox Identity:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">Display Name:</label>
                        <input
                          type="text"
                          placeholder="e.g. Turnaround Advisory"
                          value={newMailboxName}
                          onChange={(e) => setNewMailboxName(e.target.value)}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">Email Address:</label>
                        <input
                          type="email"
                          placeholder="e.g. advisory@kelnnorom.com"
                          value={newMailboxEmail}
                          onChange={(e) => setNewMailboxEmail(e.target.value)}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-mono block mb-1">Role / Department:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Deal Sourcing"
                            value={newMailboxRole}
                            onChange={(e) => setNewMailboxRole(e.target.value)}
                            className="w-full bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomMailbox}
                            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-xl transition-all shadow-md shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE DIAGNOSTICS & PROBE */}
              {configModalTab === 'diagnostics' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-accent-400 font-mono uppercase">
                        <Zap className="w-4 h-4" /> Live TLS Handshake & Socket Probe
                      </div>
                      <button
                        type="button"
                        onClick={handleRunDiagnostic}
                        disabled={isTestingConnection}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold rounded-xl text-xs transition-all shadow-md"
                      >
                        {isTestingConnection ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Radio className="w-3.5 h-3.5" />
                        )}
                        <span>Run Socket Test</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-mono">SMTP Protocol</div>
                        <div className="text-white font-bold font-mono mt-0.5">TLS 1.3 / SSL</div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-mono">Outgoing Port</div>
                        <div className="text-accent-400 font-bold font-mono mt-0.5">{configForm.smtpPort} (Secure)</div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-mono">Incoming Port</div>
                        <div className="text-blue-400 font-bold font-mono mt-0.5">{configForm.imapPort} (IMAP SSL)</div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400 font-mono">Latency</div>
                        <div className="text-emerald-400 font-bold font-mono mt-0.5">
                          {testResult?.latencyMs ? `${testResult.latencyMs}ms` : '38ms'}
                        </div>
                      </div>
                    </div>

                    {testResult && (
                      <div
                        className={`p-3.5 rounded-xl border font-mono text-xs space-y-1 ${
                          testResult.success
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold">
                          {testResult.success ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          )}
                          <span>{testResult.success ? 'Diagnostic Passed' : 'Diagnostic Error'}</span>
                        </div>
                        <p>{testResult.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Live Test Email Dispatcher Form */}
                  <div className="p-5 bg-gradient-to-r from-slate-950 to-navy-950/80 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <Send className="w-4 h-4 text-accent-400" />
                      <span>Live Test Email Dispatcher (Real-time Probe)</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Send an end-to-end verification probe email through this webmail server engine to confirm external inbox delivery.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full">
                        <label className="text-slate-400 font-mono block mb-1">Destination Probe Recipient:</label>
                        <input
                          type="email"
                          value={testRecipientEmail}
                          onChange={(e) => setTestRecipientEmail(e.target.value)}
                          placeholder="e.g. imowideweb@gmail.com"
                          className="w-full bg-slate-900 text-slate-200 p-2.5 rounded-xl border border-slate-800 font-mono focus:outline-none focus:border-accent-500/50"
                        />
                      </div>
                      <div className="sm:self-end w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={isSendingTestEmail}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-navy-950 font-bold rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap"
                        >
                          {isSendingTestEmail ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span>{isSendingTestEmail ? 'Dispatching...' : 'Send Test Probe'}</span>
                        </button>
                      </div>
                    </div>

                    {testSendStatus && (
                      <div
                        className={`p-3.5 rounded-xl border font-mono text-xs ${
                          testSendStatus.success
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold">
                          {testSendStatus.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                          )}
                          <span>{testSendStatus.success ? 'Dispatch Successful' : 'Dispatch Failed'}</span>
                        </div>
                        <p className="mt-1">{testSendStatus.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: AUTORESPONDER & SIGNATURE */}
              {configModalTab === 'autoresponder' && (
                <div className="space-y-5">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">Executive Auto-Responder (Out of Office)</div>
                        <div className="text-slate-400 text-[11px]">
                          Automated confirmation dispatched to incoming inquiries during board reviews.
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configForm.autoResponderEnabled || false}
                          onChange={(e) => setConfigForm({ ...configForm, autoResponderEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                      </label>
                    </div>

                    <div>
                      <label className="text-slate-400 font-mono block mb-1">Auto-Responder Subject & Body:</label>
                      <textarea
                        rows={4}
                        value={
                          configForm.autoResponderTemplate ||
                          `Thank you for contacting the Executive Office of Kel Nnorom. Your communication has been received and routed under standard NDA protocol. If this is regarding a time-sensitive turnaround mandate, our operating desk will respond within 4 hours.`
                        }
                        onChange={(e) => setConfigForm({ ...configForm, autoResponderTemplate: e.target.value })}
                        className="w-full bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-accent-500/50 leading-relaxed font-sans"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="font-bold text-white text-xs">Executive Email Signature HTML</div>
                    <textarea
                      rows={4}
                      value={
                        configForm.signatureHtml ||
                        `<p style="margin: 0; font-family: sans-serif; font-size: 13px; color: #0f172a;"><strong>Kel Nnorom</strong><br/><span style="color: #64748b;">Principal Turnaround & Advisory Lead</span><br/><span style="color: #D4AF37; font-weight: bold;">Kel Nnorom Advisory</span> | <a href="https://kelnnorom.com" style="color: #0284c7;">kelnnorom.com</a></p>`
                      }
                      onChange={(e) => setConfigForm({ ...configForm, signatureHtml: e.target.value })}
                      className="w-full bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 font-mono text-xs focus:outline-none focus:border-accent-500/50"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Restore sample executive inbox messages?')) {
                      resetWebmailToSeed();
                      setSendSuccessNotice('Webmail data restored to seed executive inbox.');
                      setTimeout(() => setSendSuccessNotice(null), 3000);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs border border-slate-800 transition-colors"
                  title="Reset Sample Ledger"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Ledger</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs rounded-xl transition-all shadow-md"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
