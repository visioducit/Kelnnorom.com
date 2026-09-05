import { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  Clock,
  FileJson,
  AlertTriangle,
} from 'lucide-react';

export function AdminAuditBackupPage() {
  const { state, isSuperAdmin, resetToDefaults, exportDatabaseJson, importDatabaseJson } = useCms();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--surface)] border border-red-500/30 text-center">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[var(--foreground)]">Super Admin Privileges Required</h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          Database maintenance, export, restore, and security audit logs are restricted to Super Administrators.
        </p>
      </div>
    );
  }

  const handleExport = () => {
    const dataStr = exportDatabaseJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kel-nnorom-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const success = importDatabaseJson(importText);
    if (success) {
      setImportStatus('Database successfully restored from JSON snapshot!');
      setImportText('');
    } else {
      setImportStatus('Error: Invalid JSON format. Please verify backup payload.');
    }
  };

  const handleFactoryReset = () => {
    if (
      confirm(
        'WARNING: This will reset all case studies, slider banners, and metrics back to pristine factory defaults. Do you wish to proceed?'
      )
    ) {
      resetToDefaults();
      alert('Database reverted to pristine verified defaults.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            MAINTENANCE & SECURITY AUDIT
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Database className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Database Backup, Restore & System Audit Log</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Super Administrator tools for exporting JSON snapshots, performing database restorations, and auditing chronological operational actions.
          </p>
        </div>
      </div>

      {/* Database Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export JSON */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-4">
          <div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] text-[var(--accent-gold)] border border-[var(--border)] w-fit mb-3">
              <Download size={20} />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Export JSON Snapshot</h3>
            <p className="text-xs text-[var(--muted)] mt-1">
              Download the complete CMS data store (case studies, slider banners, experiences,
              capabilities, settings, and logs) as a timestamped JSON file.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-2.5 px-4 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-xs font-bold text-[var(--foreground)] transition-all flex items-center justify-center gap-2"
          >
            <FileJson size={15} className="text-[var(--accent-gold)]" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Restore from JSON */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-4">
          <div>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] text-blue-400 border border-[var(--border)] w-fit mb-3">
              <Upload size={20} />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Restore from JSON</h3>
            <p className="text-xs text-[var(--muted)] mt-1">
              Import a previously exported JSON backup payload to restore or sync state.
            </p>
          </div>

          <form onSubmit={handleImport} className="space-y-2">
            <textarea
              rows={2}
              required
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste backup JSON payload here..."
              className="w-full p-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
            />
            {importStatus && (
              <div className="text-[10px] font-bold text-[var(--accent-gold)]">{importStatus}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Upload size={13} />
              <span>Import & Restore</span>
            </button>
          </form>
        </div>

        {/* Factory Reset */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-red-500/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 w-fit mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-bold text-red-400">Revert to Factory Defaults</h3>
            <p className="text-xs text-[var(--muted)] mt-1">
              Reset all collections, slider banners, and settings back to verified initial default values.
            </p>
          </div>

          <button
            onClick={handleFactoryReset}
            className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={15} />
            <span>Perform Factory Reset</span>
          </button>
        </div>
      </div>

      {/* Chronological Audit Log Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
            <Clock size={16} className="text-[var(--accent-gold)]" />
            <span>Chronological Operational Audit Trail</span>
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            Total Events: {state.auditLogs.length}
          </span>
        </div>

        <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-elevated)] border-b border-[var(--border)] text-[10px] uppercase font-mono text-[var(--muted)] tracking-wider">
                <tr>
                  <th className="p-3.5 pl-5">Timestamp</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Entity</th>
                  <th className="p-3.5">Operator</th>
                  <th className="p-3.5 pr-5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {state.auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-[10px] text-[var(--muted)] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-[var(--foreground)] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] font-mono text-[10px] text-[var(--accent-gold)]">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="p-3.5 text-[var(--muted)] whitespace-nowrap font-mono text-[10px]">
                      {log.userEmail}
                    </td>
                    <td className="p-3.5 pr-5 text-[var(--foreground)]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
