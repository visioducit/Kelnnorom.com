import { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { Metric } from '@/types/content';
import { BarChart3, Plus, Trash2 } from 'lucide-react';

export function AdminMetricsPage() {
  const { state, updateMetrics } = useCms();
  const [metricsList, setMetricsList] = useState<Metric[]>(state.metrics);
  const [newValue, setNewValue] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim() || !newLabel.trim()) return;
    const updated = [
      ...metricsList,
      { value: newValue.trim(), label: newLabel.trim(), verified: true },
    ];
    setMetricsList(updated);
    updateMetrics(updated);
    setNewValue('');
    setNewLabel('');
  };

  const handleUpdateMetric = (index: number, field: 'value' | 'label' | 'verified', val: string | boolean) => {
    const updated = metricsList.map((m, idx) => (idx === index ? { ...m, [field]: val } : m));
    setMetricsList(updated);
    updateMetrics(updated);
  };

  const handleDeleteMetric = (index: number) => {
    const updated = metricsList.filter((_, idx) => idx !== index);
    setMetricsList(updated);
    updateMetrics(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            CREDIBILITY BENCHMARKS
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Headline Credibility Metrics</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage verified operational metrics displayed across the homepage, executive brief, and case studies.
          </p>
        </div>
      </div>

      {/* Add New Metric */}
      <form
        onSubmit={handleAddMetric}
        className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
      >
        <div className="sm:col-span-4">
          <input
            type="text"
            required
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Metric Value (e.g. 15+, >95%, -25%)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-6">
          <input
            type="text"
            required
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Metric Label (e.g. OTIF Performance / Lower Fuel Expense)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md flex items-center justify-center gap-1.5"
          >
            <Plus size={15} />
            <span>Add Stat</span>
          </button>
        </div>
      </form>

      {/* Metrics List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsList.map((m, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--muted)]">Stat #{idx + 1}</span>
              <button
                onClick={() => handleDeleteMetric(idx)}
                className="p-1 text-[var(--muted)] hover:text-red-400 transition-colors"
                title="Delete Stat"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-[var(--muted)] mb-1">Metric Value</label>
              <input
                type="text"
                value={m.value}
                onChange={(e) => handleUpdateMetric(idx, 'value', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-sm font-mono font-black text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[var(--muted)] mb-1">Metric Label</label>
              <input
                type="text"
                value={m.label}
                onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={m.verified}
                  onChange={(e) => handleUpdateMetric(idx, 'verified', e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[var(--accent-gold)]"
                />
                <span>Verified Metric</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
