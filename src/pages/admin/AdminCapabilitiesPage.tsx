import React, { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { Capability } from '@/types/content';
import {
  Layers,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

export function AdminCapabilitiesPage() {
  const { state, updateCapabilities } = useCms();
  const [caps, setCaps] = useState<Capability[]>(state.capabilities);
  const [newCategory, setNewCategory] = useState('');
  const [newItemText, setNewItemText] = useState<{ [cat: string]: string }>({});

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const updated = [...caps, { category: newCategory.trim(), items: [] }];
    setCaps(updated);
    updateCapabilities(updated);
    setNewCategory('');
  };

  const handleDeleteCategory = (catName: string) => {
    if (confirm(`Delete capability category "${catName}"?`)) {
      const updated = caps.filter((c) => c.category !== catName);
      setCaps(updated);
      updateCapabilities(updated);
    }
  };

  const handleAddItem = (catName: string) => {
    const text = newItemText[catName];
    if (!text || !text.trim()) return;

    const updated = caps.map((c) => {
      if (c.category === catName) {
        return { ...c, items: [...c.items, text.trim()] };
      }
      return c;
    });

    setCaps(updated);
    updateCapabilities(updated);
    setNewItemText({ ...newItemText, [catName]: '' });
  };

  const handleDeleteItem = (catName: string, itemIdx: number) => {
    const updated = caps.map((c) => {
      if (c.category === catName) {
        return { ...c, items: c.items.filter((_, idx) => idx !== itemIdx) };
      }
      return c;
    });
    setCaps(updated);
    updateCapabilities(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            CORE DISCIPLINES
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Capabilities & Operating Range Matrix</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage multi-disciplinary skill categories spanning Operations, Digital Asset Management,
            Data, Commercial Monetization, Logistics, Technology and Leadership.
          </p>
        </div>
      </div>

      {/* Add New Category Form */}
      <form onSubmit={handleAddCategory} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center gap-3">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name (e.g. Artificial Intelligence / Robotics)"
          className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md shrink-0"
        >
          <Plus size={15} />
          <span>Add Category</span>
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caps.map((cap) => (
          <div
            key={cap.category}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
                <span>{cap.category}</span>
                <span className="text-[10px] text-[var(--muted)] font-mono">
                  ({cap.items.length} items)
                </span>
              </h3>
              <button
                onClick={() => handleDeleteCategory(cap.category)}
                className="p-1 text-[var(--muted)] hover:text-red-400 transition-colors"
                title="Delete Category"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex flex-wrap gap-2">
              {cap.items.map((item, idx) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-elevated)] text-xs font-medium text-[var(--foreground)] border border-[var(--border)]"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleDeleteItem(cap.category, idx)}
                    className="text-[var(--muted)] hover:text-red-400 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add item input */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
              <input
                type="text"
                value={newItemText[cap.category] || ''}
                onChange={(e) =>
                  setNewItemText({ ...newItemText, [cap.category]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(cap.category);
                  }
                }}
                placeholder="Add skill / tool item..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
              />
              <button
                onClick={() => handleAddItem(cap.category)}
                className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] text-[var(--accent-gold)] border border-[var(--border)]"
                title="Add skill"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
