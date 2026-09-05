import React, { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { SliderBannerItem } from '@/types/cms';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  X,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export function AdminSlidersPage() {
  const { state, addSliderBanner, updateSliderBanner, deleteSliderBanner } = useCms();
  const [editingBanner, setEditingBanner] = useState<SliderBannerItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialForm: SliderBannerItem = {
    id: `slider-${Date.now()}`,
    title: '',
    eyebrow: 'OPERATIONAL STRATEGY',
    headlineHighlight: 'System Performance',
    description: '',
    category: 'Operations',
    badgeText: 'ORGANIZATION / STACK',
    metricValue: '+30%',
    metricLabel: 'Efficiency Gain',
    metricContext: 'Verified Performance Metric',
    primaryCtaText: 'Explore System',
    primaryCtaLink: '/work',
    secondaryCtaText: 'Executive Brief',
    secondaryCtaLink: '/executive-brief',
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    tags: ['Operations', 'Growth', 'Systems'],
    active: true,
    order: state.sliderBanners.length + 1,
  };

  const [formData, setFormData] = useState<SliderBannerItem>(initialForm);
  const [tagInput, setTagInput] = useState('');

  const handleStartCreate = () => {
    setFormData({
      ...initialForm,
      id: `slider-${Date.now()}`,
      order: state.sliderBanners.length + 1,
    });
    setTagInput('Operations, Growth, Systems');
    setIsCreating(true);
    setEditingBanner(null);
  };

  const handleStartEdit = (banner: SliderBannerItem) => {
    setEditingBanner(banner);
    setFormData(banner);
    setTagInput(banner.tags.join(', '));
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dataToSave = {
      ...formData,
      tags,
    };

    if (isCreating) {
      addSliderBanner(dataToSave);
      setIsCreating(false);
    } else if (editingBanner) {
      updateSliderBanner(editingBanner.id, dataToSave);
      setEditingBanner(null);
    }
  };

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    const list = [...state.sliderBanners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    list.forEach((banner, idx) => {
      updateSliderBanner(banner.id, { order: idx + 1 });
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            HERO SHOWCASE MANAGEMENT
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Executive Homepage Slider Banners</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Configure dynamic multi-slide executive showcase banners with real-time metric pills,
            custom backgrounds, and high-impact operational call-to-actions.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>New Slider Slide</span>
        </button>
      </div>

      {/* Editor Modal / Form if Open */}
      {(isCreating || editingBanner) && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border-2 border-[var(--accent-gold)]/50 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>{isCreating ? 'Create New Slider Banner Slide' : `Edit Slide: ${editingBanner?.title}`}</span>
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingBanner(null);
              }}
              className="p-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Main Slide Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Digital Systems & Multi-Platform Infrastructure"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Headline Highlight Keyword
                </label>
                <input
                  type="text"
                  required
                  value={formData.headlineHighlight}
                  onChange={(e) => setFormData({ ...formData, headlineHighlight: e.target.value })}
                  placeholder="e.g. Multi-Platform Scaling"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Eyebrow Category Label
                </label>
                <input
                  type="text"
                  required
                  value={formData.eyebrow}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  placeholder="e.g. DIGITAL OPERATIONS & MONETIZATION"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Pillar / Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Digital Infrastructure"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Executive Description (Pitch)
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the core execution, systems, and operating scope..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Organization / Badge Text
                </label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. BHM / NET / ID AFRICA"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Background Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              {/* Metric Card Settings */}
              <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
                <div className="text-xs font-bold text-[var(--accent-gold)] uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  <span>Executive Metric Highlight</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">Metric Value (e.g. 20+ Platforms, &gt;95% OTIF, -25%)</label>
                  <input
                    type="text"
                    required
                    value={formData.metricValue}
                    onChange={(e) => setFormData({ ...formData, metricValue: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">Metric Label</label>
                  <input
                    type="text"
                    required
                    value={formData.metricLabel}
                    onChange={(e) => setFormData({ ...formData, metricLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">Secondary Context</label>
                  <input
                    type="text"
                    value={formData.metricContext || ''}
                    onChange={(e) => setFormData({ ...formData, metricContext: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              {/* Call-to-Action Settings */}
              <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
                <div className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                  Call to Action Links
                </div>
                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">Primary CTA Text & Link</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={formData.primaryCtaText}
                      onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                      placeholder="Button Text"
                      className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                    <input
                      type="text"
                      required
                      value={formData.primaryCtaLink}
                      onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                      placeholder="/work/slug"
                      className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[var(--muted)] mb-1">Secondary CTA (Optional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.secondaryCtaText || ''}
                      onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                      placeholder="Secondary Button Text"
                      className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                    <input
                      type="text"
                      value={formData.secondaryCtaLink || ''}
                      onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                      placeholder="/capabilities"
                      className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Tags & Active Toggle */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g. CMS Architecture, Server Infrastructure, SEO"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--accent-gold)]"
                  />
                  <span>Active in Homepage Slider</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingBanner(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md"
              >
                {isCreating ? 'Add Slider Slide' : 'Update Slide Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Slider Items */}
      <div className="space-y-4">
        {state.sliderBanners
          .sort((a, b) => a.order - b.order)
          .map((banner, index) => (
            <div
              key={banner.id}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Thumbnail & Text Info */}
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-24 h-20 rounded-xl bg-cover bg-center shrink-0 border border-[var(--border)] relative overflow-hidden"
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-bold">
                    0{index + 1}
                  </span>
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] font-mono">
                      {banner.eyebrow}
                    </span>
                    <span className="text-[10px] text-[var(--muted)] font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                      {banner.badgeText}
                    </span>
                    {!banner.active && (
                      <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[var(--foreground)] truncate">
                    {banner.title} — <span className="text-[var(--accent-gold)]">{banner.headlineHighlight}</span>
                  </h3>

                  <p className="text-xs text-[var(--muted)] line-clamp-1 max-w-2xl">
                    {banner.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono font-bold text-[var(--foreground)] bg-[var(--surface-elevated)] px-2 py-0.5 rounded border border-[var(--border)]">
                      Metric: {banner.metricValue} ({banner.metricLabel})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border)]">
                {/* Order controls */}
                <div className="flex items-center bg-[var(--surface-elevated)] rounded-lg border border-[var(--border)] p-0.5">
                  <button
                    disabled={index === 0}
                    onClick={() => moveOrder(index, 'up')}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                    title="Move slide up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={index === state.sliderBanners.length - 1}
                    onClick={() => moveOrder(index, 'down')}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                    title="Move slide down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                {/* Active toggle */}
                <button
                  onClick={() => updateSliderBanner(banner.id, { active: !banner.active })}
                  className={`p-2 rounded-lg border text-xs transition-colors ${
                    banner.active
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                  }`}
                  title={banner.active ? 'Disable slide' : 'Enable slide'}
                >
                  {banner.active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleStartEdit(banner)}
                  className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors"
                  title="Edit slide"
                >
                  <Edit2 size={15} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${banner.title}"?`)) {
                      deleteSliderBanner(banner.id);
                    }
                  }}
                  className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors"
                  title="Delete slide"
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
