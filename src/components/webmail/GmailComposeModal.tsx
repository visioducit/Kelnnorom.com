import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useCms } from '@/lib/cms-store';
import type { WebmailEmail, WebmailAttachment, WebmailPriority } from '@/types/webmail';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Paperclip,
  Sparkles,
  Bookmark,
  Lock,
  Clock,
  Trash2,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Type,
  FileText,
  Wand2,
  Shield,
  Download,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface Recipient {
  name: string;
  email: string;
}

interface GmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTo?: string;
  initialCc?: string;
  initialBcc?: string;
  initialSubject?: string;
  initialBody?: string;
  initialDraftId?: string | null;
  replyEmail?: WebmailEmail | null;
  onSend: (emailData: {
    from?: Recipient;
    to: Recipient[];
    cc?: Recipient[];
    bcc?: Recipient[];
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
  }) => void;
  onSaveDraft: (draftData: {
    id?: string;
    from?: Recipient;
    to: Recipient[];
    cc?: Recipient[];
    bcc?: Recipient[];
    subject: string;
    bodyText: string;
    bodyHtml: string;
    priority: WebmailPriority;
    attachments: WebmailAttachment[];
  }) => void;
  onDiscard: (draftId?: string) => void;
}

export const GmailComposeModal: React.FC<GmailComposeModalProps> = ({
  isOpen,
  onClose,
  initialTo = '',
  initialCc = '',
  initialBcc = '',
  initialSubject = '',
  initialBody = '',
  initialDraftId = null,
  replyEmail = null,
  onSend,
  onSaveDraft,
  onDiscard,
}) => {
  const { state } = useCms();
  const { webmailConfig, webmailContacts, webmailTemplates } = state;

  // Available Sender Mailboxes
  const availableMailboxes = useMemo(() => {
    const list: Array<{ name: string; email: string; role?: string }> = [
      {
        name: webmailConfig.fromName || 'Kel Nnorom',
        email: webmailConfig.fromEmail || 'kel@kelnnorom.com',
        role: 'Primary Executive Mailbox',
      },
      ...(webmailConfig.configuredMailboxes || []),
    ];
    const seen = new Set<string>();
    return list.filter((item) => {
      if (!item.email || seen.has(item.email.toLowerCase())) return false;
      seen.add(item.email.toLowerCase());
      return true;
    });
  }, [webmailConfig]);

  const [selectedSenderEmail, setSelectedSenderEmail] = useState<string>(() => {
    return webmailConfig.fromEmail || 'kel@kelnnorom.com';
  });

  // Window Display Modes: 'dock' | 'expanded' | 'fullscreen' | 'minimized'
  const [windowMode, setWindowMode] = useState<'dock' | 'expanded' | 'fullscreen' | 'minimized'>('dock');

  // Recipients State
  const [toRecipients, setToRecipients] = useState<Recipient[]>([]);
  const [toInput, setToInput] = useState('');
  const [ccRecipients, setCcRecipients] = useState<Recipient[]>([]);
  const [ccInput, setCcInput] = useState('');
  const [bccRecipients, setBccRecipients] = useState<Recipient[]>([]);
  const [bccInput, setBccInput] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  // Subject & Content
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [priority, setPriority] = useState<WebmailPriority>('normal');
  const [attachments, setAttachments] = useState<WebmailAttachment[]>([]);
  const [draftId, setDraftId] = useState<string | null>(initialDraftId);

  // Confidential & Security Controls
  const [isConfidential, setIsConfidential] = useState(false);
  const [confidentialExpiryDays] = useState(7);
  const [requestReadReceipt] = useState(false);

  // UI Panels & Drawers
  const [showFormatToolbar, setShowFormatToolbar] = useState(true);
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [showTemplatesDrawer, setShowTemplatesDrawer] = useState(false);
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showSignatureMenu, setShowSignatureMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [customScheduleDateTime, setCustomScheduleDateTime] = useState('');
  const [isCustomScheduleOpen, setIsCustomScheduleOpen] = useState(false);

  // Formatting Selection State
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [fontSize, setFontSize] = useState('14px');
  const [textColor] = useState('#e2e8f0');
  const [signatureChoice] = useState<'executive' | 'advisory' | 'minimal' | 'none'>('executive');

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedSnippet, setAiGeneratedSnippet] = useState('');

  // Link Insertion State
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Auto-Save Status
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Signatures
  const getSignatureHtml = useCallback((choice: 'executive' | 'advisory' | 'minimal' | 'none') => {
    if (choice === 'none') return '';
    if (choice === 'minimal') {
      return `<div style="margin-top: 16px; font-family: sans-serif; font-size: 13px; color: #94a3b8;"><p style="margin: 0; font-weight: 700; color: #f8fafc;">${webmailConfig.fromName || 'Kel Nnorom'}</p><p style="margin: 2px 0 0 0; color: #64748b; font-size: 11px;">${webmailConfig.fromEmail || 'kel@kelnnorom.com'}</p></div>`;
    }
    if (choice === 'advisory') {
      return `<div style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #334155; font-family: sans-serif; font-size: 12px; color: #cbd5e1;"><p style="margin: 0; font-weight: 700; color: #d4af37;">${webmailConfig.fromName || 'Kel Nnorom'}</p><p style="margin: 2px 0; color: #94a3b8; font-size: 11px;">Operations, Turnaround & Advisory</p><p style="margin: 0; font-size: 11px; color: #64748b;">Direct: ${webmailConfig.fromEmail || 'kel@kelnnorom.com'} | Web: kelnnorom.com</p></div>`;
    }
    // Executive default
    return webmailConfig.signatureHtml || '';
  }, [webmailConfig]);

  // Generate full HTML payload
  const generateHtmlPayload = useCallback((rawBody: string, confidential: boolean) => {
    const formattedBody = rawBody
      .replace(/\n/g, '<br/>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #d4af37; text-decoration: underline;" target="_blank">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`([^`]+)`/g, '<code style="background: #1e293b; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #38bdf8;">$1</code>');

    const confidentialBanner = confidential
      ? `
<div style="background: #451a03; border: 1px solid #b45309; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; color: #fde68a; font-family: sans-serif; font-size: 12px;">
  <div style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
    🔒 CONFIDENTIAL TRANSMISSION — DO NOT FORWARD OR REPRODUCE
  </div>
  <div style="margin-top: 4px; font-size: 11px; color: #fed7aa;">
    This executive message contains proprietary turnaround analysis. Access expires in ${confidentialExpiryDays} days.
  </div>
</div>`
      : '';

    const sigHtml = getSignatureHtml(signatureChoice);

    return `
<div style="font-family: ${fontFamily}; font-size: ${fontSize}; color: ${textColor}; line-height: 1.6; background-color: #0f172a; padding: 20px; border-radius: 12px;">
  ${confidentialBanner}
  <div style="color: #f1f5f9;">${formattedBody}</div>
  ${sigHtml}
</div>`;
  }, [confidentialExpiryDays, fontFamily, fontSize, getSignatureHtml, signatureChoice, textColor]);

  // Helper: parse string of emails into recipients array
  const parseEmailsToRecipients = (raw: string): Recipient[] => {
    if (!raw.trim()) return [];
    return raw
      .split(/[,;\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => {
        const emailMatch = item.match(/<([^>]+)>/);
        if (emailMatch) {
          const email = emailMatch[1].trim();
          const name = item.replace(/<[^>]+>/, '').trim() || email.split('@')[0];
          return { name, email };
        }
        return { name: item.split('@')[0], email: item };
      });
  };

  // Initialize values on open
  useEffect(() => {
    if (isOpen) {
      setToRecipients(parseEmailsToRecipients(initialTo));
      setCcRecipients(parseEmailsToRecipients(initialCc));
      setBccRecipients(parseEmailsToRecipients(initialBcc));
      setSubject(initialSubject || '');
      setBodyText(initialBody || '');
      setDraftId(initialDraftId || null);
      setWindowMode('dock');
      setShowAiDrawer(false);
      setShowTemplatesDrawer(false);
      setShowScheduleMenu(false);
      setLastSavedTime(null);
      if (initialCc) setShowCc(true);
      if (initialBcc) setShowBcc(true);
    }
  }, [isOpen, initialTo, initialCc, initialBcc, initialSubject, initialBody, initialDraftId]);

  // Auto-Save Draft
  useEffect(() => {
    if (!isOpen || windowMode === 'minimized') return;
    if (!subject && !bodyText && toRecipients.length === 0) return;

    const timer = setTimeout(() => {
      const currentDraftId = draftId || `draft-${Date.now()}`;
      onSaveDraft({
        id: currentDraftId,
        to: toRecipients,
        cc: ccRecipients,
        bcc: bccRecipients,
        subject: subject.trim() || '(Draft without subject)',
        bodyText,
        bodyHtml: generateHtmlPayload(bodyText, isConfidential),
        priority,
        attachments,
      });
      setDraftId(currentDraftId);
      const now = new Date();
      setLastSavedTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 2500);

    return () => clearTimeout(timer);
  }, [subject, bodyText, toRecipients, ccRecipients, bccRecipients, priority, attachments, isConfidential, draftId, isOpen, windowMode, onSaveDraft, generateHtmlPayload]);

  // Autocomplete contacts lookup
  const getFilteredContacts = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return webmailContacts.filter(
      (c) =>
        c.email.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q)
    ).slice(0, 5);
  };

  // Add Recipient handler
  const handleAddRecipient = (
    type: 'to' | 'cc' | 'bcc',
    recipient: Recipient | string
  ) => {
    let finalRecipient: Recipient;
    if (typeof recipient === 'string') {
      const clean = recipient.trim().replace(/[,;]/g, '');
      if (!clean) return;
      finalRecipient = { name: clean.split('@')[0], email: clean };
    } else {
      finalRecipient = recipient;
    }

    if (type === 'to') {
      if (!toRecipients.some((r) => r.email.toLowerCase() === finalRecipient.email.toLowerCase())) {
        setToRecipients([...toRecipients, finalRecipient]);
      }
      setToInput('');
    } else if (type === 'cc') {
      if (!ccRecipients.some((r) => r.email.toLowerCase() === finalRecipient.email.toLowerCase())) {
        setCcRecipients([...ccRecipients, finalRecipient]);
      }
      setCcInput('');
    } else if (type === 'bcc') {
      if (!bccRecipients.some((r) => r.email.toLowerCase() === finalRecipient.email.toLowerCase())) {
        setBccRecipients([...bccRecipients, finalRecipient]);
      }
      setBccInput('');
    }
  };

  const handleRemoveRecipient = (type: 'to' | 'cc' | 'bcc', emailToRemove: string) => {
    if (type === 'to') setToRecipients(toRecipients.filter((r) => r.email !== emailToRemove));
    if (type === 'cc') setCcRecipients(ccRecipients.filter((r) => r.email !== emailToRemove));
    if (type === 'bcc') setBccRecipients(bccRecipients.filter((r) => r.email !== emailToRemove));
  };

  // Formatting helpers for text selection inside textarea
  const applyTextFormatting = (prefix: string, suffix: string = prefix, defaultPlaceholder: string = 'text') => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selected = currentVal.substring(start, end) || defaultPlaceholder;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setBodyText(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const handleInsertList = (ordered = false) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = el.value;
    const selected = currentVal.substring(start, end);

    let formatted = '';
    if (selected) {
      formatted = selected
        .split('\n')
        .map((line, idx) => (ordered ? `${idx + 1}. ${line}` : `• ${line}`))
        .join('\n');
    } else {
      formatted = ordered ? '1. First key action\n2. Second strategic deliverable' : '• Key objective\n• Telemetry metric';
    }

    const nextVal = currentVal.substring(0, start) + formatted + currentVal.substring(end);
    setBodyText(nextVal);
  };

  const handleInsertDivider = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const nextVal = el.value.substring(0, start) + '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' + el.value.substring(start);
    setBodyText(nextVal);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const el = textareaRef.current;
    if (!el) return;
    const display = linkText.trim() || linkUrl.trim();
    const linkMd = `[${display}](${linkUrl.trim()})`;
    const start = el.selectionStart;
    const nextVal = el.value.substring(0, start) + linkMd + el.value.substring(start);
    setBodyText(nextVal);
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  // Attachments Engine
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            size: sizeFormatted,
            type: file.type || 'application/octet-stream',
            url: base64Url,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments(attachments.filter((a) => a.id !== attId));
  };

  // AI Assistant Handlers
  const handleAiAction = (actionType: 'draft' | 'polish' | 'shorten' | 'elaborate' | 'fix_grammar') => {
    setIsAiGenerating(true);
    setTimeout(() => {
      let generated = '';
      if (actionType === 'draft') {
        const prompt = aiPrompt.trim() || 'executive diagnostic check-in';
        generated = `Dear [Partner / Executive],\n\nFollowing our review regarding ${prompt}, I wanted to formalize our recommended next steps to guarantee measurable operational throughput.\n\nKey Strategic Focus Areas:\n1. Root-Cause Variance Analysis: Identifying and arresting margin drag across active workstreams.\n2. Automated Telemetry Tracking: Establishing real-time SLA metrics to accelerate decision speed.\n3. Governance & Milestone Cadence: Bi-weekly accountability checkpoints with committee leads.\n\nPlease let me know your availability for a 20-minute executive briefing this Thursday afternoon.\n\nBest regards,`;
      } else if (actionType === 'polish') {
        generated = bodyText
          ? bodyText
              .replace(/hey/gi, 'Dear')
              .replace(/thanks/gi, 'Thank you for your valuable collaboration')
              .replace(/let me know/gi, 'Please advise at your earliest convenience')
          : 'Dear Leadership Team,\n\nThank you for granting operational visibility into your current workflows. We have structured a targeted diagnostic matrix to resolve throughput variance with immediate execution.';
      } else if (actionType === 'shorten') {
        generated = bodyText
          ? bodyText
              .split('\n')
              .filter((line) => line.trim().length > 0)
              .slice(0, 4)
              .join('\n\n')
          : 'Executive Summary:\n• Operational audit completed across all active fulfillment nodes.\n• Identified 18% idle latency at inter-depot gates.\n• Action: Deploying automated routing controls starting Monday.';
      } else if (actionType === 'elaborate') {
        generated = `${bodyText}\n\nAdditional Operational Details & Governance Framework:\n• Fiduciary Oversight: Guaranteed audit compliance with weekly variance logs.\n• Performance Benchmark: Targeting a 30-day EBITDA run-rate recovery of +18.5%.\n• Dedicated Executive Desk: Round-the-clock advisory access for critical escalation.`;
      } else if (actionType === 'fix_grammar') {
        generated = bodyText.replace(/\s+/g, ' ').trim();
      }

      setAiGeneratedSnippet(generated);
      setIsAiGenerating(false);
    }, 600);
  };

  const handleApplyAiSnippet = () => {
    if (aiGeneratedSnippet) {
      setBodyText(aiGeneratedSnippet);
      setAiGeneratedSnippet('');
      setShowAiDrawer(false);
    }
  };

  // Apply Template
  const handleApplyTemplate = (tplId: string) => {
    const tpl = webmailTemplates.find((t) => t.id === tplId);
    if (!tpl) return;
    setSubject(tpl.subject || '');
    const cleanBody = tpl.bodyHtml
      ? tpl.bodyHtml
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<li>/gi, '• ')
          .replace(/<\/li>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .trim()
      : '';
    setBodyText(cleanBody);
    setShowTemplatesDrawer(false);
  };

  // Send Email Trigger
  const handleTriggerSend = (scheduledFor?: string) => {
    if (toRecipients.length === 0 && !toInput.trim()) {
      alert('Please specify at least one recipient email address.');
      return;
    }

    // Include any typed recipient in input
    const finalTo = [...toRecipients];
    if (toInput.trim()) {
      finalTo.push({ name: toInput.trim().split('@')[0], email: toInput.trim().replace(/[,;]/g, '') });
    }

    const finalCc = [...ccRecipients];
    if (ccInput.trim()) {
      finalCc.push({ name: ccInput.trim().split('@')[0], email: ccInput.trim().replace(/[,;]/g, '') });
    }

    const finalBcc = [...bccRecipients];
    if (bccInput.trim()) {
      finalBcc.push({ name: bccInput.trim().split('@')[0], email: bccInput.trim().replace(/[,;]/g, '') });
    }

    const payloadHtml = generateHtmlPayload(bodyText, isConfidential);

    const activeSender = availableMailboxes.find((m) => m.email === selectedSenderEmail) || {
      name: webmailConfig.fromName || 'Kel Nnorom',
      email: webmailConfig.fromEmail || 'kel@kelnnorom.com',
    };

    onSend({
      from: activeSender,
      to: finalTo,
      cc: finalCc.length > 0 ? finalCc : undefined,
      bcc: finalBcc.length > 0 ? finalBcc : undefined,
      subject: subject.trim() || '(No Subject)',
      bodyText,
      bodyHtml: payloadHtml,
      priority,
      attachments,
      isConfidential,
      confidentialExpiry: isConfidential
        ? new Date(Date.now() + confidentialExpiryDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      requestReadReceipt,
      scheduledFor,
      draftId: draftId || undefined,
    });

    onClose();
  };

  // Schedule Presets
  const handleSchedulePreset = (preset: 'tomorrow_morning' | 'tomorrow_afternoon' | 'monday_morning') => {
    const now = new Date();
    const scheduledDate = new Date();

    if (preset === 'tomorrow_morning') {
      scheduledDate.setDate(now.getDate() + 1);
      scheduledDate.setHours(8, 0, 0, 0);
    } else if (preset === 'tomorrow_afternoon') {
      scheduledDate.setDate(now.getDate() + 1);
      scheduledDate.setHours(13, 0, 0, 0);
    } else if (preset === 'monday_morning') {
      const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
      scheduledDate.setDate(now.getDate() + daysUntilMonday);
      scheduledDate.setHours(8, 0, 0, 0);
    }

    handleTriggerSend(scheduledDate.toISOString());
    setShowScheduleMenu(false);
  };

  if (!isOpen) return null;

  // Minimized Bar Style (Gmail style dock bar)
  if (windowMode === 'minimized') {
    return (
      <div className="fixed bottom-0 right-8 z-50 w-72 bg-slate-900 border border-slate-700 rounded-t-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div
          onClick={() => setWindowMode('dock')}
          className="p-3 flex items-center justify-between cursor-pointer bg-slate-950 hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-accent-400"></span>
            <span className="text-xs font-bold text-slate-200 truncate">
              {subject || '(Draft) ' + (toRecipients[0]?.email || 'New Message')}
            </span>
          </div>
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setWindowMode('dock')}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              title="Expand"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              title="Close"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen / Center Expanded / Bottom-Right Dock Styles
  const containerClasses =
    windowMode === 'fullscreen'
      ? 'fixed inset-4 z-50 flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden'
      : windowMode === 'expanded'
      ? 'fixed inset-x-4 top-12 bottom-12 max-w-4xl mx-auto z-50 flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden'
      : 'fixed bottom-0 right-4 sm:right-8 z-50 w-full sm:w-[640px] max-h-[85vh] h-[680px] flex flex-col bg-slate-900 border border-slate-700 rounded-t-2xl shadow-2xl overflow-hidden';

  return (
    <>
      {/* Backdrop for expanded/fullscreen mode */}
      {(windowMode === 'fullscreen' || windowMode === 'expanded') && (
        <div className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-xs animate-in fade-in" />
      )}

      <div
        className={`${containerClasses} transition-all duration-200`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDraggingOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        {/* Drag and Drop Visual Overlay */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-50 bg-accent-500/20 backdrop-blur-xs border-2 border-dashed border-accent-400 rounded-2xl flex flex-col items-center justify-center text-accent-300">
            <Download className="w-12 h-12 animate-bounce mb-2" />
            <p className="font-bold text-sm">Drop attachments here to upload</p>
          </div>
        )}

        {/* Modal Window Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
              {replyEmail ? `Re: ${replyEmail.subject}` : subject || 'New Executive Message'}
            </span>
            {priority === 'urgent' && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                Urgent
              </span>
            )}
            {isConfidential && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 uppercase">
                <Lock size={10} /> Confidential
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {lastSavedTime && (
              <span className="text-[11px] font-mono text-slate-500 mr-2 hidden sm:inline">
                Draft saved {lastSavedTime}
              </span>
            )}
            <button
              onClick={() => setWindowMode('minimized')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() =>
                setWindowMode(
                  windowMode === 'dock' ? 'expanded' : windowMode === 'expanded' ? 'fullscreen' : 'dock'
                )
              }
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              title={windowMode === 'dock' ? 'Expand' : 'Restore'}
            >
              {windowMode === 'fullscreen' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-rose-400 transition-colors"
              title="Save & Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Main Compose Body Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900/90 text-xs">
          {/* Header Field: From Account Selector */}
          <div className="px-4 py-2 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40 text-slate-400">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-mono text-slate-500">From:</span>
              {availableMailboxes.length > 1 ? (
                <div className="relative inline-flex items-center">
                  <select
                    value={selectedSenderEmail}
                    onChange={(e) => setSelectedSenderEmail(e.target.value)}
                    aria-label="Select sender email address"
                    className="bg-slate-900 text-slate-200 font-medium text-xs rounded-lg px-2.5 py-1 border border-slate-700 hover:border-slate-600 focus:outline-none focus:border-accent-400 cursor-pointer font-mono"
                  >
                    {availableMailboxes.map((mb) => (
                      <option key={mb.email} value={mb.email} className="bg-slate-950 text-slate-200">
                        {mb.name} &lt;{mb.email}&gt; {mb.role ? `— ${mb.role}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{webmailConfig.fromName || 'Kel Nnorom'}</span>
                  <span className="font-mono text-[11px] text-accent-400">&lt;{webmailConfig.fromEmail || 'kel@kelnnorom.com'}&gt;</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-slate-400 hover:text-accent-400 hover:underline font-mono text-[11px]"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  type="button"
                  onClick={() => setShowBcc(true)}
                  className="text-slate-400 hover:text-accent-400 hover:underline font-mono text-[11px]"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* Header Field: To Recipients */}
          <div className="px-4 py-2 border-b border-slate-800/80 flex items-start gap-2 relative">
            <span className="font-mono text-slate-500 pt-1 shrink-0 w-8">To:</span>
            <div className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[28px]">
              {toRecipients.map((rec) => (
                <span
                  key={rec.email}
                  className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                >
                  <span className="truncate max-w-[160px]">{rec.name || rec.email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRecipient('to', rec.email)}
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-slate-700"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              <div className="relative flex-1 min-w-[140px]">
                <input
                  type="text"
                  value={toInput}
                  onChange={(e) => setToInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddRecipient('to', toInput);
                    }
                  }}
                  onBlur={() => {
                    if (toInput.trim()) handleAddRecipient('to', toInput);
                  }}
                  placeholder={toRecipients.length === 0 ? 'Type email address or name and press Enter...' : ''}
                  className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-xs py-0.5"
                />

                {/* Autocomplete Dropdown */}
                {toInput.trim() && getFilteredContacts(toInput).length > 0 && (
                  <div className="absolute left-0 top-full mt-1 w-72 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-30 py-1 overflow-hidden">
                    <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase">
                      Suggested Contacts
                    </div>
                    {getFilteredContacts(toInput).map((contact) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => handleAddRecipient('to', { name: contact.name, email: contact.email })}
                        className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-200 text-xs">{contact.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{contact.email}</div>
                        </div>
                        <span className="text-[10px] font-mono text-accent-400 bg-accent-400/10 px-1.5 py-0.5 rounded">
                          {contact.category}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Header Field: CC */}
          {showCc && (
            <div className="px-4 py-2 border-b border-slate-800/80 flex items-start gap-2 animate-in fade-in">
              <span className="font-mono text-slate-500 pt-1 shrink-0 w-8">Cc:</span>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[28px]">
                {ccRecipients.map((rec) => (
                  <span
                    key={rec.email}
                    className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                  >
                    <span className="truncate max-w-[160px]">{rec.name || rec.email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient('cc', rec.email)}
                      className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-slate-700"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddRecipient('cc', ccInput);
                    }
                  }}
                  onBlur={() => {
                    if (ccInput.trim()) handleAddRecipient('cc', ccInput);
                  }}
                  placeholder="Add CC recipient..."
                  className="flex-1 min-w-[120px] bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-xs py-0.5"
                />
              </div>
            </div>
          )}

          {/* Header Field: BCC */}
          {showBcc && (
            <div className="px-4 py-2 border-b border-slate-800/80 flex items-start gap-2 animate-in fade-in">
              <span className="font-mono text-slate-500 pt-1 shrink-0 w-8">Bcc:</span>
              <div className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[28px]">
                {bccRecipients.map((rec) => (
                  <span
                    key={rec.email}
                    className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                  >
                    <span className="truncate max-w-[160px]">{rec.name || rec.email}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient('bcc', rec.email)}
                      className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-slate-700"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={bccInput}
                  onChange={(e) => setBccInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddRecipient('bcc', bccInput);
                    }
                  }}
                  onBlur={() => {
                    if (bccInput.trim()) handleAddRecipient('bcc', bccInput);
                  }}
                  placeholder="Add BCC recipient..."
                  className="flex-1 min-w-[120px] bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-xs py-0.5"
                />
              </div>
            </div>
          )}

          {/* Header Field: Subject Line */}
          <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between gap-3">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject: Executive Briefing / Strategic Advisory..."
              className="flex-1 bg-transparent font-medium text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            />

            {/* Quick Priority Pill Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] flex items-center gap-1 border transition-colors ${
                  priority === 'urgent'
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : priority === 'high'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Priority: {priority.toUpperCase()}</span>
                <ChevronDown size={11} />
              </button>

              {showPriorityMenu && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-30 py-1">
                  {(['normal', 'high', 'urgent', 'low'] as WebmailPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPriority(p);
                        setShowPriorityMenu(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs font-mono capitalize hover:bg-slate-800 flex items-center justify-between text-slate-300"
                    >
                      <span>{p}</span>
                      {priority === p && <Check size={12} className="text-accent-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Drawer (Help Me Write) */}
          {showAiDrawer && (
            <div className="p-4 bg-gradient-to-r from-accent-950/40 via-slate-900 to-slate-950 border-b border-accent-500/30 space-y-3 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent-400 font-bold text-xs">
                  <Sparkles size={14} className="animate-spin text-accent-400" />
                  <span>Executive AI Ghostwriter & Polish Engine</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiDrawer(false)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your intent (e.g. 'Draft turnaround proposal for logistics client')..."
                  className="flex-1 bg-slate-950 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-accent-400"
                />
                <button
                  type="button"
                  onClick={() => handleAiAction('draft')}
                  disabled={isAiGenerating}
                  className="px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 font-bold text-navy-950 text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Wand2 size={13} />
                  <span>Generate</span>
                </button>
              </div>

              {/* Quick Prompt Enhancers */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-mono">Quick Tools:</span>
                <button
                  type="button"
                  onClick={() => handleAiAction('polish')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  ✨ Polish Tone
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('shorten')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  ✂️ Make Concise
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('elaborate')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  📝 Elaborate Metrics
                </button>
                <button
                  type="button"
                  onClick={() => handleAiAction('fix_grammar')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  🔍 Fix Grammar
                </button>
              </div>

              {/* Generated AI Preview */}
              {aiGeneratedSnippet && (
                <div className="p-3 rounded-xl bg-slate-950 border border-accent-500/40 space-y-2">
                  <div className="text-[11px] font-mono text-accent-400 font-bold">AI Generated Draft:</div>
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {aiGeneratedSnippet}
                  </pre>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAiGeneratedSnippet('')}
                      className="px-3 py-1 text-slate-400 hover:text-slate-200 text-xs"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyAiSnippet}
                      className="px-4 py-1 rounded-lg bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs"
                    >
                      Insert into Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Templates Drawer */}
          {showTemplatesDrawer && (
            <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 animate-in slide-in-from-top duration-200 max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
                  <Bookmark size={14} className="text-accent-400" />
                  <span>Executive Email Templates</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTemplatesDrawer(false)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {webmailTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl.id)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200 text-xs group-hover:text-accent-400">
                        {tpl.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{tpl.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{tpl.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Link Insertion Dialog Modal */}
          {showLinkModal && (
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-300 text-xs">Insert Hyperlink:</span>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Display Text (optional)"
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs w-44"
              />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://kelnnorom.com/case-studies/..."
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs flex-1 min-w-[200px]"
              />
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-3 py-1 rounded-lg bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs"
              >
                Apply Link
              </button>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          {/* WYSIWYG & Rich Text Formatting Toolbar */}
          {showFormatToolbar && (
            <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center gap-1 text-slate-300">
              {/* Font Family */}
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="bg-slate-900 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 text-[11px] focus:outline-none cursor-pointer"
              >
                <option value="Inter, sans-serif">Sans Serif (Inter)</option>
                <option value="Georgia, serif">Serif (Georgia)</option>
                <option value="'Playfair Display', serif">Display Serif</option>
                <option value="'JetBrains Mono', monospace">Monospace</option>
              </select>

              {/* Font Size */}
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-slate-900 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 text-[11px] focus:outline-none cursor-pointer"
              >
                <option value="12px">Small</option>
                <option value="14px">Normal</option>
                <option value="16px">Large</option>
                <option value="18px">Huge</option>
              </select>

              <div className="h-4 w-px bg-slate-800 mx-1"></div>

              {/* Style Controls */}
              <button
                type="button"
                onClick={() => applyTextFormatting('**', '**', 'bold text')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Bold (Ctrl+B)"
              >
                <Bold size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormatting('*', '*', 'italic text')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Italic (Ctrl+I)"
              >
                <Italic size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormatting('__', '__', 'underlined text')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Underline (Ctrl+U)"
              >
                <Underline size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormatting('~~', '~~', 'strikethrough text')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Strikethrough"
              >
                <Strikethrough size={13} />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1"></div>

              {/* Lists */}
              <button
                type="button"
                onClick={() => handleInsertList(false)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Bullet List"
              >
                <List size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleInsertList(true)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Numbered List"
              >
                <ListOrdered size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormatting('> ', '', 'Strategic quotation')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Quote Block"
              >
                <Quote size={13} />
              </button>
              <button
                type="button"
                onClick={() => applyTextFormatting('`', '`', 'code snippet')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Inline Code"
              >
                <Code size={13} />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1"></div>

              {/* Link & Divider */}
              <button
                type="button"
                onClick={() => setShowLinkModal(true)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Insert Link"
              >
                <Link2 size={13} />
              </button>
              <button
                type="button"
                onClick={handleInsertDivider}
                className="px-1.5 py-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-mono"
                title="Horizontal Divider"
              >
                — Div
              </button>
            </div>
          )}

          {/* Main Textarea Area */}
          <div className="flex-1 p-4 flex flex-col relative min-h-[220px]">
            <textarea
              ref={textareaRef}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Draft your operational briefing, executive letter, or strategic proposal..."
              className="flex-1 w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-xs leading-relaxed font-sans"
              style={{
                fontFamily,
                fontSize,
              }}
            />

            {/* Signature Preview Pill */}
            {signatureChoice !== 'none' && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-accent-400">
                  <CheckCircle2 size={12} />
                  <span>Signature attached ({signatureChoice} profile)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSignatureMenu(!showSignatureMenu)}
                  className="hover:underline text-slate-400"
                >
                  Change Profile
                </button>
              </div>
            )}
          </div>

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Paperclip size={12} className="text-accent-400" />
                <span>Attachments ({attachments.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs"
                  >
                    <FileText size={13} className="text-accent-400" />
                    <span className="truncate max-w-[180px] font-medium">{att.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({att.size})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-slate-700"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          {/* Left: Send Split Button + Actions */}
          <div className="flex items-center gap-2">
            {/* Split Send Button */}
            <div className="relative inline-flex rounded-xl shadow-md">
              <button
                type="button"
                onClick={() => handleTriggerSend()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-l-xl bg-accent-500 hover:bg-accent-600 text-navy-950 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                <Send size={14} />
                <span>Send</span>
              </button>

              <button
                type="button"
                onClick={() => setShowScheduleMenu(!showScheduleMenu)}
                className="px-2.5 py-2.5 rounded-r-xl bg-accent-600 hover:bg-accent-700 text-navy-950 border-l border-accent-700 transition-colors cursor-pointer"
                title="Schedule Send"
              >
                <ChevronDown size={14} />
              </button>

              {/* Schedule Send Dropdown Popover */}
              {showScheduleMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-40 p-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <Clock size={12} className="text-accent-400" />
                    <span>Schedule Dispatch</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSchedulePreset('tomorrow_morning')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>Tomorrow Morning</span>
                    <span className="text-[10px] font-mono text-slate-400">8:00 AM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSchedulePreset('tomorrow_afternoon')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>Tomorrow Afternoon</span>
                    <span className="text-[10px] font-mono text-slate-400">1:00 PM</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSchedulePreset('monday_morning')}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 rounded-lg text-xs text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>Monday Morning</span>
                    <span className="text-[10px] font-mono text-slate-400">8:00 AM</span>
                  </button>

                  <div className="border-t border-slate-800 pt-1">
                    {isCustomScheduleOpen ? (
                      <div className="p-2 space-y-2">
                        <input
                          type="datetime-local"
                          value={customScheduleDateTime}
                          onChange={(e) => setCustomScheduleDateTime(e.target.value)}
                          className="w-full bg-slate-900 text-slate-200 p-1.5 rounded text-xs border border-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customScheduleDateTime) {
                              handleTriggerSend(new Date(customScheduleDateTime).toISOString());
                            }
                          }}
                          className="w-full py-1.5 bg-accent-500 text-navy-950 font-bold text-xs rounded"
                        >
                          Confirm Custom Time
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsCustomScheduleOpen(true)}
                        className="w-full px-3 py-1.5 text-left text-xs text-accent-400 hover:underline font-mono"
                      >
                        Pick custom date & time...
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Icons */}
            <button
              type="button"
              onClick={() => setShowFormatToolbar(!showFormatToolbar)}
              className={`p-2 rounded-xl border transition-colors ${
                showFormatToolbar ? 'bg-slate-800 border-slate-700 text-accent-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Formatting Options"
            >
              <Type size={15} />
            </button>

            {/* File Attachment Input Trigger */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Attach Files"
            >
              <Paperclip size={15} />
            </button>

            {/* AI Assistant Toggle */}
            <button
              type="button"
              onClick={() => setShowAiDrawer(!showAiDrawer)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                showAiDrawer
                  ? 'bg-accent-500/20 border-accent-500/40 text-accent-400 shadow-xs'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
              title="AI Ghostwriter"
            >
              <Sparkles size={14} className="text-accent-400" />
              <span className="hidden sm:inline">AI Draft</span>
            </button>

            {/* Templates Toggle */}
            <button
              type="button"
              onClick={() => setShowTemplatesDrawer(!showTemplatesDrawer)}
              className={`p-2 rounded-xl border transition-colors ${
                showTemplatesDrawer ? 'bg-slate-800 border-slate-700 text-accent-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Templates"
            >
              <Bookmark size={15} />
            </button>

            {/* Confidential Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsConfidential(!isConfidential)}
              className={`p-2 rounded-xl border transition-colors ${
                isConfidential ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Confidential Mode"
            >
              <Shield size={15} />
            </button>
          </div>

          {/* Right: Trash / Discard Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('Discard this message draft?')) {
                  onDiscard(draftId || undefined);
                  onClose();
                }
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
              title="Discard Draft"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
