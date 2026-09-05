import React, { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { Experience } from '@/types/content';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';

export function AdminExperiencePage() {
  const { state, addExperience, updateExperience, deleteExperience } = useCms();
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const initialExp: Experience = {
    id: `exp-${Date.now()}`,
    company: '',
    role: '',
    startDate: '2022',
    endDate: 'Present',
    location: 'Lagos, Nigeria',
    industry: ['Operations', 'Technology'],
    era: 'Integrated Operations',
    eraPeriod: '2022–Present',
    focus: ['Operations leadership', 'Process re-engineering'],
    responsibilities: ['Directing multi-disciplinary operating teams'],
    achievements: ['Delivered measurable efficiency gains'],
    capabilities: ['Operations', 'Leadership', 'Data'],
    verified: true,
  };

  const [formData, setFormData] = useState<Experience>(initialExp);
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');
  const [focusInput, setFocusInput] = useState('');
  const [capabilitiesInput, setCapabilitiesInput] = useState('');

  const handleStartCreate = () => {
    setFormData({
      ...initialExp,
      id: `exp-${Date.now()}`,
    });
    setResponsibilitiesInput('Directing multi-disciplinary operating teams');
    setAchievementsInput('Delivered measurable efficiency gains');
    setFocusInput('Operations leadership, Process re-engineering');
    setCapabilitiesInput('Operations, Leadership, Data');
    setIsCreating(true);
    setEditingExp(null);
  };

  const handleStartEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData(exp);
    setResponsibilitiesInput(exp.responsibilities.join('\n'));
    setAchievementsInput(exp.achievements.join('\n'));
    setFocusInput(exp.focus.join(', '));
    setCapabilitiesInput(exp.capabilities.join(', '));
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave: Experience = {
      ...formData,
      responsibilities: responsibilitiesInput.split('\n').map((s) => s.trim()).filter(Boolean),
      achievements: achievementsInput.split('\n').map((s) => s.trim()).filter(Boolean),
      focus: focusInput.split(',').map((s) => s.trim()).filter(Boolean),
      capabilities: capabilitiesInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (isCreating) {
      addExperience(dataToSave);
      setIsCreating(false);
    } else if (editingExp) {
      updateExperience(editingExp.id, dataToSave);
      setEditingExp(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            CAREER CHRONOLOGY
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Career History & Operating Roles</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage the 15+ year timeline spanning sales, digital streaming, media conglomerates,
            fintech, logistics, and multi-million ₦ warehousing.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>Add Career Role</span>
        </button>
      </div>

      {/* Editor Modal / Form */}
      {(isCreating || editingExp) && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border-2 border-[var(--accent-gold)]/50 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--accent-gold)]" />
              <span>{isCreating ? 'Add New Career Role' : `Edit Role: ${editingExp?.company}`}</span>
            </h2>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingExp(null);
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
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. iROKO Partners"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Executive Role / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Content Operations & Team Leadership"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Start Year
                </label>
                <input
                  type="text"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="2011"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  End Year (or Present)
                </label>
                <input
                  type="text"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="2014 or Present"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Career Era Theme
                </label>
                <input
                  type="text"
                  required
                  value={formData.era}
                  onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                  placeholder="e.g. Digital Content & Media Systems"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Era Period String
                </label>
                <input
                  type="text"
                  value={formData.eraPeriod}
                  onChange={(e) => setFormData({ ...formData, eraPeriod: e.target.value })}
                  placeholder="e.g. 2011–2014"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Core Responsibilities (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Cataloguing and metadata management&#10;Team leadership across content operations"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Documented Achievements (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={achievementsInput}
                  onChange={(e) => setAchievementsInput(e.target.value)}
                  placeholder="Trained and supervised 11+ team members&#10;Built standardized workflows"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Focus Areas (Comma separated)
                </label>
                <input
                  type="text"
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  placeholder="Metadata, Analytics, Team leadership"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Capabilities (Comma separated)
                </label>
                <input
                  type="text"
                  value={capabilitiesInput}
                  onChange={(e) => setCapabilitiesInput(e.target.value)}
                  placeholder="Digital, Operations, Leadership"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--accent-gold)]"
                  />
                  <span>Verified Operating Record</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingExp(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md"
              >
                {isCreating ? 'Add Experience Record' : 'Save Experience Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Experience Timeline List */}
      <div className="space-y-4">
        {state.experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[var(--accent-gold)] font-mono">
                  {exp.startDate} – {exp.endDate || 'Present'}
                </span>
                <span className="text-[10px] text-[var(--muted)] font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                  {exp.era}
                </span>
                {exp.verified && (
                  <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle size={10} />
                    Verified
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[var(--foreground)]">
                {exp.role} <span className="text-[var(--muted)] font-normal">at</span> {exp.company}
              </h3>

              <div className="text-xs text-[var(--muted)] line-clamp-2 max-w-3xl">
                {exp.responsibilities[0]}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {exp.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border)]"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border)]">
              <button
                onClick={() => handleStartEdit(exp)}
                className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors"
                title="Edit experience"
              >
                <Edit2 size={15} />
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${exp.company}"?`)) {
                    deleteExperience(exp.id);
                  }
                }}
                className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors"
                title="Delete experience"
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
