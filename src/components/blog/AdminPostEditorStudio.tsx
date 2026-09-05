import React, { useState, useMemo } from 'react';
import type { Insight } from '@/types/content';
import { auditBlogSeo } from '@/lib/seo';
import { ContentRenderer } from '@/components/blog/ContentRenderer';
import {
  Sparkles,
  Search,
  Video,
  Headphones,
  Layers,
  Check,
  X,
  FileText,
  Image as ImageIcon,
  Columns,
  Eye,
  Wand2,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-react';

export interface AdminPostEditorStudioProps {
  isOpen?: boolean;
  isCreating?: boolean;
  isEditing?: boolean;
  initialInsight?: Insight | null;
  initialData?: Insight | null;
  onSave: (data: Insight) => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export const AdminPostEditorStudio: React.FC<AdminPostEditorStudioProps> = ({
  isCreating = true,
  isEditing,
  initialInsight,
  initialData,
  onSave,
  onClose,
  onCancel,
}) => {
  const effectiveIsCreating = isEditing !== undefined ? !isEditing : isCreating;
  const effectiveInitial = initialData || initialInsight || null;

  // Studio View Mode: 'split' (side-by-side) | 'editor' (focus) | 'preview' (full preview & SERP simulators)
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // AI Assistant Drawer
  const [showAiStudio, setShowAiStudio] = useState(false);
  const [aiTopicInput, setAiTopicInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedOutline, setAiGeneratedOutline] = useState('');

  // Form State
  const defaultInsight: Insight = {
    slug: effectiveIsCreating ? `essay-${Date.now().toString().slice(-4)}` : '',
    title: '',
    excerpt: '',
    body: '',
    category: 'Operations Turnaround',
    tags: ['Operations', 'Strategy'],
    date: new Date().toISOString().split('T')[0],
    author: 'Kel Nnorom',
    authorRole: 'Cross-Functional Operations & Growth Strategist',
    readingTime: '5 min read',
    featured: false,
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    featuredImageAlt: 'Modern operational architecture skyline',
    featuredImageCaption: '',
    videoUrl: '',
    videoTitle: '',
    videoCaption: '',
    audioUrl: '',
    audioTitle: '',
    audioDuration: '',
    seoTitle: '',
    seoDescription: '',
    focusKeyword: '',
    seoKeywords: ['Operations Strategy', 'Kel Nnorom'],
    schemaType: 'BlogPosting',
    wordCount: 0,
    published: true,
  };

  const [formData, setFormData] = useState<Insight>(effectiveInitial || defaultInsight);
  const [tagsInput, setTagsInput] = useState(formData.tags?.join(', ') || 'Operations, Turnaround, Logistics');
  const [keywordsInput, setKeywordsInput] = useState(formData.seoKeywords?.join(', ') || 'Operations Strategy, Kel Nnorom');

  // Sync title to slug automatically if creating
  const handleTitleChange = (newTitle: string) => {
    const updates: Partial<Insight> = { title: newTitle };
    if (effectiveIsCreating) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      if (generatedSlug) {
        updates.slug = generatedSlug;
      }
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleClose = () => {
    if (onClose) onClose();
    else if (onCancel) onCancel();
  };

  // Live SEO Calculations & Checklist
  const liveSeoAudit = useMemo(() => {
    return auditBlogSeo({
      ...formData,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      seoKeywords: keywordsInput.split(',').map((k) => k.trim()).filter(Boolean),
    });
  }, [formData, tagsInput, keywordsInput]);

  // Readability & Text Metrics
  const textStats = useMemo(() => {
    const text = formData.body.trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const paragraphs = text ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const headings = (text.match(/#{1,6}\s+/g) || []).length;
    const readingTimeMins = Math.max(1, Math.ceil(words / 200));

    return {
      words,
      chars,
      paragraphs,
      headings,
      readingTime: `${readingTimeMins} min read`,
    };
  }, [formData.body]);

  // Shortcode Inserter Engine
  const handleInsertBlock = (
    type:
      | 'callout'
      | 'metric'
      | 'quote'
      | 'code'
      | 'divider'
      | 'table'
      | 'checklist'
      | 'faq'
  ) => {
    let snippet = '';
    switch (type) {
      case 'callout':
        snippet = '\n\n[callout: title=Executive Takeaway | text=Enter key strategic takeaway here.]\n\n';
        break;
      case 'metric':
        snippet = '\n\n[metric: value=+35% | label=Operating Margin Recovery | context=Validated across 6 regional distribution hubs]\n\n';
        break;
      case 'quote':
        snippet = '\n\n[quote: text=In turnaround environments, speed of feedback is the only sustainable moat. | author=Kel Nnorom | role=Cross-Functional Strategist]\n\n';
        break;
      case 'code':
        snippet = '\n\n```typescript\n// Example: Operational Telemetry Ingestion Pipeline\ninterface DispatchMetric {\n  hubId: string;\n  transitVarianceMin: number;\n  slaCompliancePct: number;\n}\n```\n\n';
        break;
      case 'table':
        snippet = `\n\n| Operating Dimension | Legacy Model | Turnaround Model |\n| :--- | :--- | :--- |\n| Decision Latency | 4–6 Days | Real-time Telemetry |\n| Inventory Buffer | $4.2M Trapped | Dynamic Just-In-Time |\n| EBITDA Yield | Baseline | +28.5% Run-rate |\n\n`;
        break;
      case 'checklist':
        snippet = `\n\n### Strategic Execution Checklist:\n- [ ] Step 1: Execute 48-Hour Cash & Dispatch Audit\n- [ ] Step 2: Decouple Legacy Monolith Routing Dependencies\n- [ ] Step 3: Implement Automated Shift Variance Alerts\n\n`;
        break;
      case 'faq':
        snippet = `\n\n### Frequently Asked Questions\n\n**Q: How rapidly can an operational turnaround achieve EBITDA stabilization?**\nA: With quantitative telemetry deployed across tier-1 nodes, margin variance is typically arrested within 30 to 45 days.\n\n**Q: What is the primary bottleneck in middle-market supply chains?**\nA: Information latency between warehouse floor supervisors and executive leadership teams.\n\n`;
        break;
      case 'divider':
        snippet = '\n\n---\n\n';
        break;
    }

    setFormData((prev) => ({
      ...prev,
      body: prev.body + snippet,
    }));
  };

  // AI Assistant Engine
  const handleGenerateAiOutline = () => {
    const topic = aiTopicInput.trim() || formData.title || 'Operational Turnaround Strategy';
    setIsAiGenerating(true);

    setTimeout(() => {
      const generated = `## Executive Overview: The Mechanics of ${topic}

In high-stakes turnaround environments, operational breakdown rarely originates from sudden macro shocks. Rather, it is the cumulative result of undetected margin leakages, unmeasured inter-hub transit latency, and misaligned shift incentives in ${topic}.

[callout: title=Fiduciary Axiom | text=You cannot fix what you do not measure in real-time. Speed of telemetry determines the velocity of margin recovery.]

### Core Architectural Bottlenecks

When dissecting operations across enterprise logistics and distributed facilities, three primary structural friction points consistently emerge:

1. **Information Asymmetry:** Frontline operators solve immediate bottlenecks with ad-hoc workarounds that remain invisible to executive planning.
2. **Buffer Over-compensation:** Depots accumulate excess inventory capital to hedge against volatile scheduling SLA failures.
3. **Incentive Misalignment:** Operational teams optimize for volume output rather than net realized margin contribution.

[metric: value=+32.4% | label=EBITDA Contribution | context=Achieved within 90 days across 8 logistics fulfillment centers]

### The 3-Phase Recovery Matrix

To restore institutional throughput, leadership must enforce a structured three-phase intervention:

| Phase | Timeframe | Core Objective | Primary Deliverable |
| :--- | :--- | :--- | :--- |
| Phase 1: Stabilization | Days 1–30 | Root-Cause Audit | Cash-Leakage Arrest |
| Phase 2: Acceleration | Days 31–60 | Workflow Decoupling | Automated Dispatch Control |
| Phase 3: Institutionalization | Days 61–90 | Margin Codification | +25% EBITDA Moat |

[quote: text=Turnaround is not an exercise in theory. It is the ruthless elimination of operational variance. | author=Kel Nnorom]

### Real-Time Telemetry Implementation

By ingesting telemetry logs directly into unified dashboards, executive leadership reduces escalation cycle times from days to minutes:

\`\`\`typescript
// Telemetry Threshold Enforcement
export function evaluateNodeHealth(latencyMs: number, bufferHours: number): 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' {
  if (latencyMs > 120 || bufferHours < 2) return 'CRITICAL';
  if (latencyMs > 60 || bufferHours < 6) return 'DEGRADED';
  return 'OPTIMAL';
}
\`\`\`

### Summary & Governance Next Steps

Organizations that codify their operational playbooks transition from reactive crisis management to sustainable competitive advantage in ${topic}.`;

      setAiGeneratedOutline(generated);
      setIsAiGenerating(false);
    }, 700);
  };

  const handleApplyAiOutline = () => {
    if (aiGeneratedOutline) {
      setFormData((prev) => ({
        ...prev,
        body: aiGeneratedOutline,
        excerpt:
          prev.excerpt ||
          'A quantitative framework for eliminating operational friction, arresting margin leakage, and scaling institutional throughput in 90 days.',
        focusKeyword: prev.focusKeyword || 'Operational Turnaround Strategy',
        seoTitle: prev.seoTitle || `${formData.title || 'Operational Turnaround Strategy'} | Kel Nnorom`,
        seoDescription:
          prev.seoDescription ||
          'Discover how cross-functional operational frameworks eliminate margin leakage and scale EBITDA velocity.',
      }));
      setAiGeneratedOutline('');
      setShowAiStudio(false);
    }
  };

  // AI 1-Click SEO Generator
  const handleAutoGenerateSeo = () => {
    const title = formData.title.trim() || 'Strategic Operational Turnaround';
    const cleanExcerpt = formData.excerpt.trim() || formData.body.slice(0, 150).replace(/[#*`[\]]/g, '');

    const generatedSeoTitle = `${title.slice(0, 48)} | Kel Nnorom`;
    const generatedSeoDesc = cleanExcerpt.slice(0, 150);
    const generatedFocus = formData.category || 'Operations Strategy';

    setFormData((prev) => ({
      ...prev,
      seoTitle: generatedSeoTitle,
      seoDescription: generatedSeoDesc,
      focusKeyword: generatedFocus,
    }));
  };

  // Submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanSlug = formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const seoKeywords = keywordsInput.split(',').map((k) => k.trim()).filter(Boolean);

    const payload: Insight = {
      ...formData,
      slug: cleanSlug,
      tags,
      seoKeywords,
      wordCount: textStats.words,
      readingTime: textStats.readingTime,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(payload);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-gold)] font-bold">
              {isCreating ? 'CREATE ESSAY STUDIO' : 'EDITORIAL REVISION ENGINE'}
            </div>
            <h2 className="text-lg font-black text-[var(--foreground)] tracking-tight">
              {formData.title || (isCreating ? 'Untitled Strategic Essay' : 'Edit Essay')}
            </h2>
          </div>
        </div>

        {/* View Mode Switcher + Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-xl bg-[var(--surface-elevated)] p-1 border border-[var(--border)]">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Columns size={13} />
              <span>Split View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <FileText size={13} />
              <span>Editor Only</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Eye size={13} />
              <span>Live & SERP Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAiStudio(!showAiStudio)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showAiStudio
                ? 'bg-[var(--accent-gold)]/20 border-[var(--accent-gold)] text-[var(--accent-gold)]'
                : 'bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border-[var(--border)] text-[var(--foreground)]'
            }`}
          >
            <Wand2 size={14} className="text-[var(--accent-gold)]" />
            <span>AI Outline Assistant</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-[var(--accent-gold)] text-black font-extrabold text-xs hover:brightness-110 shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>{isCreating ? 'Publish Essay' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* AI Outline & Generator Drawer */}
      {showAiStudio && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-elevated)] border border-[var(--accent-gold)]/40 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-gold)] font-mono uppercase">
              <Sparkles size={16} />
              <span>Executive Strategic AI Content Generator</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiStudio(false)}
              className="text-[var(--muted)] hover:text-[var(--foreground)] p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={aiTopicInput}
              onChange={(e) => setAiTopicInput(e.target.value)}
              placeholder="e.g. 90-Day Logistics Turnaround, EBITDA Margin Recovery, Private Equity Value Creation..."
              className="sm:col-span-3 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleGenerateAiOutline}
              disabled={isAiGenerating}
              className="px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-extrabold text-xs hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isAiGenerating ? <Sparkles size={14} className="animate-spin" /> : <Wand2 size={14} />}
              <span>Generate Framework</span>
            </button>
          </div>

          {/* Preset Framework Starters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[var(--muted)] font-mono text-[11px]">1-Click Playbook Presets:</span>
            {[
              '90-Day Operational Turnaround',
              'Margin Leakage & EBITDA Recovery',
              'Logistics Fleet Telemetry Architecture',
              'Private Equity Value Creation Playbook',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAiTopicInput(preset);
                  setFormData((prev) => ({
                    ...prev,
                    title: prev.title || preset,
                    category: 'Operations Turnaround',
                  }));
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-[11px] text-[var(--foreground)] font-mono cursor-pointer"
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Generated AI Preview */}
          {aiGeneratedOutline && (
            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--accent-gold)]/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--accent-gold)] font-bold">
                <span>Generated Strategic Essay Blueprint</span>
                <span>{aiGeneratedOutline.split(/\s+/).length} Words</span>
              </div>
              <pre className="text-xs text-[var(--foreground)] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed bg-[var(--surface-elevated)] p-3 rounded-lg border border-[var(--border)]">
                {aiGeneratedOutline}
              </pre>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAiGeneratedOutline('')}
                  className="px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleApplyAiOutline}
                  className="px-5 py-2 rounded-xl bg-[var(--accent-gold)] text-black font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Insert Blueprint into Essay
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Workspace */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top 2-Column: Meta & Multimedia */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Metadata Form */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
              <Layers size={14} />
              <span>1. Core Essay Meta & Structure</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Essay Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Anatomy of an Operational Turnaround: Restoring EBITDA Velocity"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. anatomy-of-an-operational-turnaround"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Category / Content Pillar *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                >
                  <option value="Operations Turnaround">Operations Turnaround</option>
                  <option value="Supply Chain Architecture">Supply Chain Architecture</option>
                  <option value="EBITDA & Margin Recovery">EBITDA & Margin Recovery</option>
                  <option value="Ad Monetization & Yield">Ad Monetization & Yield</option>
                  <option value="Private Equity Portfolio Operations">Private Equity Portfolio Operations</option>
                  <option value="Executive Telemetry">Executive Telemetry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Author Name & Role
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Kel Nnorom"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Executive Excerpt (Lead Briefing Summary) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A crisp 2-sentence breakdown of the operational friction, diagnostic framework, and quantified turnaround outcome..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Right 1 Col: Multimedia & Hero Image Suite */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
              <ImageIcon size={14} />
              <span>2. Multimedia Attachments</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
                {formData.featuredImage && (
                  <div className="mt-2 relative rounded-xl overflow-hidden h-24 border border-[var(--border)]">
                    <img
                      src={formData.featuredImage}
                      alt={formData.featuredImageAlt || 'Hero preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Image Alt Text (SEO Essential)
                </label>
                <input
                  type="text"
                  value={formData.featuredImageAlt || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                  placeholder="Architectural structure representing operational efficiency"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              {/* Video Embed */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1">
                  <Video size={13} className="text-blue-400" />
                  <span>Video Walkthrough URL (YouTube, Vimeo, Loom)</span>
                </label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              {/* Audio / Podcast URL */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1 flex items-center gap-1">
                  <Headphones size={13} className="text-emerald-400" />
                  <span>Audio Briefing / Podcast URL (MP3)</span>
                </label>
                <input
                  type="url"
                  value={formData.audioUrl || ''}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  placeholder="https://.../briefing.mp3"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Live Editor & Split Preview */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
              <FileText size={14} />
              <span>3. Analytical Body & Interactive Shortcodes</span>
            </div>

            {/* Fast Block Inserter Bar */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleInsertBlock('callout')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Callout
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('metric')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Metric
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('quote')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Quote
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('table')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Table
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('checklist')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Checklist
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('faq')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + FAQ
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('code')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Code
              </button>
              <button
                type="button"
                onClick={() => handleInsertBlock('divider')}
                className="px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                + Div
              </button>
            </div>
          </div>

          {/* Editor & Preview Split Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === 'split'
                ? 'grid-cols-1 lg:grid-cols-2'
                : viewMode === 'editor'
                ? 'grid-cols-1'
                : 'grid-cols-1'
            }`}
          >
            {/* Editor Workspace Column */}
            {(viewMode === 'split' || viewMode === 'editor') && (
              <div className="space-y-2">
                <textarea
                  rows={20}
                  required
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Write the analytical body with markdown headers (## Header), bullet points, and shortcodes..."
                  className="w-full p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono leading-relaxed resize-y min-h-[420px]"
                />

                {/* Real-time Text Telemetry Bar */}
                <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--muted)] gap-2">
                  <span>Words: <strong className="text-[var(--foreground)]">{textStats.words}</strong></span>
                  <span>Characters: <strong className="text-[var(--foreground)]">{textStats.chars}</strong></span>
                  <span>Headings: <strong className="text-[var(--foreground)]">{textStats.headings}</strong></span>
                  <span>Paragraphs: <strong className="text-[var(--foreground)]">{textStats.paragraphs}</strong></span>
                  <span>Est. Reading Time: <strong className="text-[var(--accent-gold)]">{textStats.readingTime}</strong></span>
                </div>
              </div>
            )}

            {/* Live Interactive Rendering Column */}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <div className="p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] overflow-y-auto max-h-[580px] space-y-6 shadow-inner">
                <div className="border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent-gold)] uppercase px-2 py-0.5 rounded bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20">
                      {formData.category}
                    </span>
                    <span className="text-[10px] text-[var(--muted)] font-mono">
                      {formData.date} • {textStats.readingTime}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-[var(--foreground)] mt-2 leading-tight">
                    {formData.title || 'Untitled Strategic Essay'}
                  </h1>
                  {formData.excerpt && (
                    <p className="text-xs text-[var(--muted)] italic mt-2 leading-relaxed">
                      {formData.excerpt}
                    </p>
                  )}
                </div>

                {/* Render Full Body with shortcodes */}
                <ContentRenderer content={formData.body} postSlug={formData.slug} />
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Live Google SERP & Social Card Preview Simulator */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
              <Search size={14} />
              <span>4. Real-time Search Optimization (SEO) & Social Graph Studio</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAutoGenerateSeo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-bold hover:brightness-110 transition-colors cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Auto-Optimize Meta</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[var(--muted)]">SEO Score:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono ${
                    liveSeoAudit.score >= 80
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : liveSeoAudit.score >= 60
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}
                >
                  {liveSeoAudit.score}% ({liveSeoAudit.grade})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Focus Target Keyword (Primary)
              </label>
              <input
                type="text"
                value={formData.focusKeyword || ''}
                onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                placeholder="e.g. Operational Turnaround"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Schema.org Structured Type
              </label>
              <select
                value={formData.schemaType || 'BlogPosting'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schemaType: e.target.value as 'BlogPosting' | 'TechArticle' | 'Article',
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              >
                <option value="BlogPosting">BlogPosting (Google Search Rich Results)</option>
                <option value="TechArticle">TechArticle (Systems & Operational Frameworks)</option>
                <option value="Article">Article (General Executive Briefing)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                SEO Meta Title Tag ({formData.seoTitle?.length || 0}/60 chars)
              </label>
              <input
                type="text"
                value={formData.seoTitle || ''}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="The Anatomy of an Operational Turnaround | Kel Nnorom"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Operations, Turnaround, Logistics, EBITDA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                SEO Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="Operations Strategy, Turnaround Execution, Kel Nnorom"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                SEO Meta Description Tag ({formData.seoDescription?.length || 0}/155 chars)
              </label>
              <input
                type="text"
                value={formData.seoDescription || ''}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="Discover how quantitative telemetry and cross-functional frameworks eliminate margin leakage and scale EBITDA velocity."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>
          </div>

          {/* Real Google SERP Visual Simulator Card */}
          <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
              <span className="font-bold uppercase text-[var(--foreground)]">
                Live Google Search SERP Snippet Preview
              </span>
              <div className="flex rounded-lg bg-[var(--surface)] p-0.5 border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setSerpDevice('desktop')}
                  className={`p-1 rounded text-[10px] flex items-center gap-1 ${
                    serpDevice === 'desktop' ? 'bg-[var(--accent-gold)] text-black font-bold' : 'text-[var(--muted)]'
                  }`}
                >
                  <Monitor size={11} />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice('mobile')}
                  className={`p-1 rounded text-[10px] flex items-center gap-1 ${
                    serpDevice === 'mobile' ? 'bg-[var(--accent-gold)] text-black font-bold' : 'text-[var(--muted)]'
                  }`}
                >
                  <Smartphone size={11} />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#202124] text-left space-y-1 font-sans border border-slate-700">
              <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                <Globe size={12} className="text-[#8ab4f8]" />
                <span className="text-[11px] truncate">https://kelnnorom.com &rsaquo; insights &rsaquo; {formData.slug || 'essay-slug'}</span>
              </div>
              <h4 className="text-[#8ab4f8] hover:underline text-base font-medium cursor-pointer truncate">
                {formData.seoTitle || formData.title || 'The Anatomy of an Operational Turnaround'}
              </h4>
              <p className="text-[#bdc1c6] text-xs leading-relaxed line-clamp-2">
                {formData.seoDescription || formData.excerpt || 'Strategic framework for eliminating operational friction and recovering EBITDA throughput...'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Visibility & Action Controls */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)]"
              />
              <span>Published & Publicly Live</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[var(--foreground)]">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)]"
              />
              <span>Feature on Spotlight Hero</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-extrabold text-xs hover:brightness-110 shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Check size={15} />
              <span>{effectiveIsCreating ? 'Publish Strategic Essay' : 'Save Essay Revisions'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
