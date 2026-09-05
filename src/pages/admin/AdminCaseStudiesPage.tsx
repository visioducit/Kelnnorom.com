import React, { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { CaseStudy } from '@/types/content';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  Star,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminCaseStudiesPage() {
  const { state, addCaseStudy, updateCaseStudy, deleteCaseStudy } = useCms();
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialStudy: CaseStudy = {
    slug: '',
    title: '',
    company: '',
    year: '2023–2024',
    industry: ['Digital Operations', 'Logistics'],
    categories: ['Operations', 'Growth'],
    tagline: 'Operational Scalability & Performance',
    challenge: '',
    environment: ['Multi-platform network', 'Distributed teams'],
    role: 'Lead Operations Strategist',
    intervention: ['Process re-engineering', 'Telemetry integration'],
    systems: ['ERP', 'WMS', 'Analytics'],
    flow: ['AUDIENCE', 'DATA', 'OPERATIONS', 'REVENUE'],
    outcomes: ['30% increase in operational throughput.'],
    metrics: [{ value: '30%', label: 'Efficiency Improvement', context: 'Year over year' }],
    capabilities: ['Operations', 'Technology', 'Data'],
    featured: true,
    order: state.caseStudies.length + 1,
  };

  const [formData, setFormData] = useState<CaseStudy>(initialStudy);
  const [industryInput, setIndustryInput] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');
  const [capabilitiesInput, setCapabilitiesInput] = useState('');
  const [interventionInput, setInterventionInput] = useState('');
  const [outcomesInput, setOutcomesInput] = useState('');
  const [metricValue, setMetricValue] = useState('30%');
  const [metricLabel, setMetricLabel] = useState('Throughput Gain');

  const handleStartCreate = () => {
    setFormData({
      ...initialStudy,
      slug: `case-study-${Date.now()}`,
      order: state.caseStudies.length + 1,
    });
    setIndustryInput('Digital Operations, Logistics');
    setCategoriesInput('Operations, Growth');
    setCapabilitiesInput('Operations, Technology, Data');
    setInterventionInput('Process re-engineering\nTelemetry integration\nTeam coordination');
    setOutcomesInput('30% increase in operational throughput\nReduced cycle bottlenecks');
    setIsCreating(true);
    setEditingStudy(null);
  };

  const handleStartEdit = (study: CaseStudy) => {
    setEditingStudy(study);
    setFormData(study);
    setIndustryInput(study.industry.join(', '));
    setCategoriesInput(study.categories.join(', '));
    setCapabilitiesInput(study.capabilities.join(', '));
    setInterventionInput(study.intervention.join('\n'));
    setOutcomesInput(study.outcomes.join('\n'));
    if (study.metrics && study.metrics.length > 0) {
      setMetricValue(study.metrics[0].value);
      setMetricLabel(study.metrics[0].label);
    }
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave: CaseStudy = {
      ...formData,
      slug: formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      industry: industryInput.split(',').map((s) => s.trim()).filter(Boolean),
      categories: categoriesInput.split(',').map((s) => s.trim()).filter(Boolean),
      capabilities: capabilitiesInput.split(',').map((s) => s.trim()).filter(Boolean),
      intervention: interventionInput.split('\n').map((s) => s.trim()).filter(Boolean),
      outcomes: outcomesInput.split('\n').map((s) => s.trim()).filter(Boolean),
      metrics: [{ value: metricValue, label: metricLabel, context: 'Documented outcome' }],
    };

    if (isCreating) {
      addCaseStudy(dataToSave);
      setIsCreating(false);
    } else if (editingStudy) {
      updateCaseStudy(editingStudy.slug, dataToSave);
      setEditingStudy(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            PORTFOLIO ENGINE
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Case Studies & Deep Dives</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage comprehensive documented operational turnarounds, challenges, systems interventions,
            and outcome metrics.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>New Case Study</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {(isCreating || editingStudy) && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border-2 border-[var(--accent-gold)]/50 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>{isCreating ? 'Create New Case Study' : `Edit Study: ${editingStudy?.title}`}</span>
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingStudy(null);
              }}
              className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Digital Media at Scale"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. digital-media-at-scale"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. BHM / ID Africa / NET"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Year Period
                </label>
                <input
                  type="text"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g. 2016–2018"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Tagline / Theme
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Digital Infrastructure × Monetization"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Executive Role
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Digital Infrastructure & Monetization Lead"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Challenge Narrative
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="Detail the operational friction, legacy constraints, or bottlenecks..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Intervention Steps (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={interventionInput}
                  onChange={(e) => setInterventionInput(e.target.value)}
                  placeholder="Infrastructure deployment&#10;Process re-engineering&#10;Analytics rollout"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Measurable Outcomes (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={outcomesInput}
                  onChange={(e) => setOutcomesInput(e.target.value)}
                  placeholder="Integrated operating model connecting audience and revenue&#10;Reduced latency by 40%"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Categories (Comma separated)
                </label>
                <input
                  type="text"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  placeholder="Digital Operations, Infrastructure, Monetization"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Capabilities & Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={capabilitiesInput}
                  onChange={(e) => setCapabilitiesInput(e.target.value)}
                  placeholder="Web Infrastructure, Monetization, SEO, Analytics"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              {/* Headline Metric */}
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Metric Value
                </label>
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  placeholder="e.g. 20+ Platforms or >95% OTIF"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Metric Label
                </label>
                <input
                  type="text"
                  value={metricLabel}
                  onChange={(e) => setMetricLabel(e.target.value)}
                  placeholder="e.g. Managed & Monetized"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--accent-gold)]"
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingStudy(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md"
              >
                {isCreating ? 'Publish Case Study' : 'Save Study Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Case Studies */}
      <div className="space-y-4">
        {state.caseStudies
          .sort((a, b) => a.order - b.order)
          .map((study) => (
            <div
              key={study.slug}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-[var(--foreground)] font-mono">
                    {study.company}
                  </span>
                  {study.year && (
                    <span className="text-[10px] text-[var(--muted)] font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                      {study.year}
                    </span>
                  )}
                  {study.featured && (
                    <span className="text-[10px] text-[var(--accent-gold)] font-bold px-2 py-0.5 rounded bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center gap-1">
                      <Star size={11} />
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[var(--foreground)]">
                  {study.title}
                </h3>

                <p className="text-xs text-[var(--muted)] line-clamp-2 max-w-3xl">
                  {study.challenge}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {study.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border)]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border)]">
                <Link
                  to={`/work/${study.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent-gold)] transition-colors"
                  title="View live case study"
                >
                  <ExternalLink size={15} />
                </Link>

                <button
                  onClick={() => handleStartEdit(study)}
                  className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors"
                  title="Edit case study"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${study.title}"?`)) {
                      deleteCaseStudy(study.slug);
                    }
                  }}
                  className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors"
                  title="Delete case study"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
