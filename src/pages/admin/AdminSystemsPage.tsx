import React, { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { PhilosophyStage, SystemNode } from '@/types/content';
import { GitGraph } from 'lucide-react';

export function AdminSystemsPage() {
  const { state, updatePhilosophyStages, updateSystemNodes } = useCms();
  const [stages, setStages] = useState<PhilosophyStage[]>(state.philosophyStages);
  const [nodes, setNodes] = useState<SystemNode[]>(state.systemNodes);
  const [activeTab, setActiveTab] = useState<'stages' | 'topology'>('stages');

  const handleStageChange = (idx: number, field: 'title', value: string) => {
    const updated = stages.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
    setStages(updated);
    updatePhilosophyStages(updated);
  };

  const handleStageItemChange = (stageIdx: number, itemsString: string) => {
    const items = itemsString.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = stages.map((s, i) => (i === stageIdx ? { ...s, items } : s));
    setStages(updated);
    updatePhilosophyStages(updated);
  };

  const handleNodeChange = (idx: number, field: 'label' | 'description', value: string) => {
    const updated = nodes.map((n, i) => (i === idx ? { ...n, [field]: value } : n));
    setNodes(updated);
    updateSystemNodes(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            OPERATING FRAMEWORKS
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <GitGraph className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Systems Architecture & Execution Framework</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage the 6-Stage Execution Engine (Understand → Map → Build → Optimize → Measure → Scale)
            and the 6-Node System Topology.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stages'
                ? 'bg-[var(--accent-gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            6-Stage Philosophy
          </button>
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'topology'
                ? 'bg-[var(--accent-gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            System Topology Nodes
          </button>
        </div>
      </div>

      {activeTab === 'stages' ? (
        /* 6-Stage Philosophy Stages */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((stage, idx) => (
            <div
              key={stage.number}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[var(--accent-gold)] px-2.5 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                  Stage {stage.number}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--muted)] mb-1">Stage Title</label>
                <input
                  type="text"
                  value={stage.title}
                  onChange={(e) => handleStageChange(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--muted)] mb-1">Focus Elements (Comma separated)</label>
                <textarea
                  rows={3}
                  value={stage.items.join(', ')}
                  onChange={(e) => handleStageItemChange(idx, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 6-Node System Topology */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[var(--foreground)] uppercase">
                  NODE: {node.id}
                </span>
              </div>

              <div>
                <label className="block text-[11px] text-[var(--muted)] mb-1">Node Display Label</label>
                <input
                  type="text"
                  value={node.label}
                  onChange={(e) => handleNodeChange(idx, 'label', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[var(--muted)] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={node.description}
                  onChange={(e) => handleNodeChange(idx, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
