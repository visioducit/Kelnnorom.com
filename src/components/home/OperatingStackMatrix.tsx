import { useState } from 'react';
import { operatingStackRows } from '@/content/site-data';
type DomainStrength = 'deep' | 'strong' | 'supporting' | 'none';
import { Info, Filter } from 'lucide-react';

const columns = ['DIGITAL', 'COMMERCIAL', 'PHYSICAL', 'PEOPLE', 'TECHNOLOGY'] as const;

const strengthBadge: Record<DomainStrength, { label: string; bg: string; text: string; dot: string }> = {
  deep: { label: 'Deep', bg: 'bg-[var(--accent-gold)]/20', text: 'text-[var(--accent-gold)]', dot: 'bg-[var(--accent-gold)]' },
  strong: { label: 'Strong', bg: 'bg-[var(--accent-tech)]/20', text: 'text-[var(--accent-tech)]', dot: 'bg-[var(--accent-tech)]' },
  supporting: { label: 'Supporting', bg: 'bg-[var(--surface-elevated)]', text: 'text-[var(--muted)]', dot: 'bg-[var(--muted)]' },
  none: { label: '—', bg: 'transparent', text: 'text-[var(--muted)]/40', dot: 'bg-transparent' },
};

export function OperatingStackMatrix() {
  const [selectedRow, setSelectedRow] = useState<string | null>('Operations');
  const [columnFilter, setColumnFilter] = useState<string>('ALL');

  const activeRowData = operatingStackRows.find((r) => r.layer === selectedRow);

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)] bg-[var(--background)] relative">
      <div className="max-w-content mx-auto container-px">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-2 text-[var(--accent-gold)]">Capability Map</div>
          <h2 className="headline-section text-[var(--foreground)] mb-4">
            The Operating Stack
          </h2>
          <p className="body-text text-base md:text-lg text-[var(--muted)] leading-relaxed">
            An interactive matrix cross-referencing functional operating disciplines with core domains of execution.
          </p>
        </div>

        {/* Legend & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] mb-8">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[10px] font-mono uppercase text-[var(--muted)]">Proficiency Depth:</span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--accent-gold)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" /> Deep
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--accent-tech)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-tech)]" /> Strong
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--muted)]" /> Supporting
            </span>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
            <select
              value={columnFilter}
              onChange={(e) => setColumnFilter(e.target.value)}
              className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded px-2.5 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent-gold)]"
            >
              <option value="ALL">Show All Domains</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  Highlight {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Interactive Matrix Table */}
        <div className="hidden md:block overflow-x-auto border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <th className="p-4 font-mono uppercase tracking-wider text-[var(--muted)] font-semibold w-1/4">
                  Functional Layer
                </th>
                {columns.map((col) => {
                  const isFiltered = columnFilter === col;
                  return (
                    <th
                      key={col}
                      className={`p-4 font-mono uppercase tracking-wider font-semibold text-center ${
                        isFiltered ? 'text-[var(--accent-gold)] bg-[var(--accent-gold)]/10' : 'text-[var(--muted)]'
                      }`}
                    >
                      {col}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {operatingStackRows.map((row) => {
                const isSelected = selectedRow === row.layer;
                return (
                  <tr
                    key={row.layer}
                    onClick={() => setSelectedRow(row.layer)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[var(--surface-elevated)] ring-1 ring-[var(--accent-gold)]/20'
                        : 'hover:bg-[var(--surface-elevated)]/50'
                    }`}
                  >
                    <td className="p-4 font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span>{row.layer}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />}
                    </td>
                    {columns.map((col) => {
                      const strength = row.domains[col];
                      const badge = strengthBadge[strength];
                      const isFiltered = columnFilter === col;
                      return (
                        <td
                          key={col}
                          className={`p-4 text-center ${isFiltered ? 'bg-[var(--accent-gold)]/5' : ''}`}
                        >
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-[var(--border)]/40 ${badge.bg} ${badge.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            {badge.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion Cards */}
        <div className="md:hidden space-y-3">
          {operatingStackRows.map((row) => {
            const isSelected = selectedRow === row.layer;
            return (
              <div
                key={row.layer}
                onClick={() => setSelectedRow(isSelected ? null : row.layer)}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[var(--surface-elevated)] border-[var(--accent-gold)]'
                    : 'bg-[var(--surface)] border-[var(--border)]'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm text-[var(--foreground)] mb-3">
                  <span>{row.layer}</span>
                  <span className="text-xs text-[var(--accent-gold)]">
                    {isSelected ? 'Collapse' : 'Details'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {columns.map((col) => {
                    const strength = row.domains[col];
                    const badge = strengthBadge[strength];
                    return (
                      <div
                        key={col}
                        className="flex items-center justify-between p-2 rounded bg-[var(--surface)] border border-[var(--border)]"
                      >
                        <span className="text-[10px] text-[var(--muted)] font-mono">{col}</span>
                        <span className={`text-[10px] font-medium ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Layer Context Box */}
        {activeRowData && (
          <div className="mt-8 p-6 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-[var(--accent-gold)]" />
                <h4 className="text-xs font-bold font-mono uppercase text-[var(--foreground)]">
                  {activeRowData.layer} Operating History
                </h4>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Documented environments: {activeRowData.experiences.join(' • ')}
              </p>
            </div>
            <span className="text-xs text-[var(--accent-tech)] font-mono">
              Synchronized Systems Layer
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
