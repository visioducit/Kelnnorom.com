import React, { useState, useMemo } from 'react';
import { useCms } from '@/lib/cms-store';
import type { Insight } from '@/types/content';
import { auditBlogSeo } from '@/lib/seo';
import { AdminPostEditorStudio } from '@/components/blog/AdminPostEditorStudio';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  Share2,
  BarChart3,
  ExternalLink,
  RotateCcw,
  Users,
  Mail,
  Download,
  Clock,
  Check,
} from 'lucide-react';

export function AdminInsightsPage() {
  const {
    state,
    addInsight,
    updateInsight,
    deleteInsight,
    resetAnalytics,
    deleteSubscriber,
    updateSubscriber,
  } = useCms();

  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'analytics' | 'subscribers'>('articles');
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [copiedCsv, setCopiedCsv] = useState(false);

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingInsight(null);
  };

  const handleStartEdit = (insight: Insight) => {
    setEditingInsight(insight);
    setIsCreating(false);
  };

  const totalViews = state.analytics?.totalPageViews || 0;
  const totalCompletions = Object.values(state.analytics?.postsAnalytics || {}).reduce(
    (acc, p) => acc + (p.readCompletions || 0),
    0
  );
  const totalShares = Object.values(state.analytics?.postsAnalytics || {}).reduce((acc, p) => {
    const s = p.shares || {};
    return acc + Object.values(s).reduce((a, b) => a + b, 0);
  }, 0);

  const subscribers = useMemo(() => state.subscribers || [], [state.subscribers]);
  const filteredSubscribers = useMemo(() => {
    const q = subscriberSearch.toLowerCase().trim();
    if (!q) return subscribers;
    return subscribers.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.organization && s.organization.toLowerCase().includes(q)) ||
        (s.role && s.role.toLowerCase().includes(q))
    );
  }, [subscribers, subscriberSearch]);

  const handleExportSubscribersCsv = () => {
    const headers = ['Email', 'Name', 'Organization', 'Role', 'Frequency', 'Format', 'Topics', 'Lead Magnet', 'Subscribed At', 'Active'];
    const rows = subscribers.map((s) => [
      s.email,
      s.name || '',
      s.organization || '',
      s.role || '',
      s.frequency,
      s.format,
      s.topics.join('; '),
      s.leadMagnetDownloaded ? 'Yes' : 'No',
      s.subscribedAt,
      s.status === 'active' ? 'Active' : 'Unsubscribed',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))].join('\n');
    navigator.clipboard.writeText(csvContent);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            ENTERPRISE EDITORIAL & TELEMETRY SUITE
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>SEO Blogging & Analytics Engine</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage strategic essays, newsletter subscribers, multimedia attachments, JSON-LD schemas, and reading telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[var(--surface-elevated)] p-1 border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              Essays ({state.insights.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <BarChart3 size={14} />
              <span>Readership Telemetry</span>
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'subscribers'
                  ? 'bg-[var(--accent-gold)] text-black shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Users size={14} />
              <span>Subscribers ({subscribers.length})</span>
            </button>
          </div>

          <button
            onClick={handleStartCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>Compose Essay</span>
          </button>
        </div>
      </div>

      {/* Subscribers Management Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Subscriber Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>TOTAL SUBSCRIBERS</span>
                <Mail size={16} className="text-[var(--accent-gold)]" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                {subscribers.length}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">
                {subscribers.filter((s) => s.status === 'active').length} Active dispatches
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>LEAD MAGNET DOWNLOADS</span>
                <Download size={16} className="text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                {subscribers.filter((s) => s.leadMagnetDownloaded).length}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-mono mt-1">
                90-Day Turnaround Framework checklist
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>MONTHLY DISPATCHES</span>
                <Clock size={16} className="text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                {subscribers.filter((s) => s.frequency === 'monthly_memo').length}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-mono mt-1">
                Curated private strategic debriefs
              </div>
            </div>
          </div>

          {/* Subscribers Table & Search Bar */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-3 text-[var(--muted)]" />
                <input
                  type="text"
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  placeholder="Search subscribers by email, name, organization..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none placeholder-[var(--muted)]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportSubscribersCsv}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                    copiedCsv
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent-gold)]'
                  }`}
                >
                  {copiedCsv ? <Check size={14} /> : <Download size={14} />}
                  <span>{copiedCsv ? 'CSV Copied to Clipboard!' : 'Export CSV'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="pb-3">SUBSCRIBER</th>
                    <th className="pb-3">ORGANIZATION / ROLE</th>
                    <th className="pb-3">TOPICS</th>
                    <th className="pb-3">CADENCE</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[var(--muted)]">
                        No subscribers found matching &ldquo;{subscriberSearch}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[var(--surface-elevated)] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-[var(--foreground)]">{sub.email}</div>
                          {sub.name && <div className="text-[10px] text-[var(--muted)]">{sub.name}</div>}
                        </td>
                        <td className="py-3.5 pr-4 text-[var(--muted)]">
                          {sub.organization || '—'} {sub.role ? `• ${sub.role}` : ''}
                        </td>
                        <td className="py-3.5 pr-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.topics.map((t) => (
                              <span
                                key={t}
                                className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] text-[var(--accent-gold)]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-[var(--muted)]">
                          {(sub.frequency || 'weekly').replace('_', ' ')} ({(sub.format || 'digest').replace('_', ' ')})
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                            }`}
                          >
                            {sub.status === 'active' ? 'Active' : 'Unsubscribed'}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => updateSubscriber(sub.id, { status: sub.status === 'active' ? 'unsubscribed' : 'active' })}
                            className="p-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                            title={sub.status === 'active' ? 'Deactivate' : 'Reactivate'}
                          >
                            {sub.status === 'active' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove subscriber ${sub.email}?`)) {
                                deleteSubscriber(sub.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete subscriber"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>TOTAL ARTICLE VIEWS</span>
                <Eye size={16} className="text-[var(--accent-gold)]" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1">
                +18.4% readership velocity this week
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>READ COMPLETIONS</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                {totalCompletions.toLocaleString()}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-mono mt-1">
                {totalViews > 0 ? `${Math.round((totalCompletions / totalViews) * 100)}% overall completion rate` : 'N/A'}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] mb-2">
                <span>NETWORK SHARES</span>
                <Share2 size={16} className="text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-[var(--foreground)]">
                {totalShares.toLocaleString()}
              </div>
              <div className="text-[11px] text-[var(--muted)] font-mono mt-1">
                LinkedIn, X, WhatsApp & Direct Copies
              </div>
            </div>
          </div>

          {/* Detailed Per-Post Performance Table */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[var(--foreground)] font-mono uppercase tracking-wider">
                Article Readership & Reading Telemetry Ledger
              </h3>
              <button
                onClick={resetAnalytics}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--accent-gold)] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Re-seed Telemetry</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                    <th className="pb-3">TITLE & SLUG</th>
                    <th className="pb-3 text-right">VIEWS</th>
                    <th className="pb-3 text-right">AVG READ TIME</th>
                    <th className="pb-3 text-right">AVG SCROLL</th>
                    <th className="pb-3 text-right">COMPLETIONS</th>
                    <th className="pb-3 text-right">SHARES</th>
                    <th className="pb-3 text-right">TOP REFERRER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {state.insights.map((post) => {
                    const postStats = state.analytics?.postsAnalytics[post.slug];
                    const views = postStats?.views || 0;
                    const comps = postStats?.readCompletions || 0;
                    const avgTime = postStats?.avgTimeSpentSeconds
                      ? `${Math.round(postStats.avgTimeSpentSeconds / 60)}m ${postStats.avgTimeSpentSeconds % 60}s`
                      : '4m 12s';
                    const avgScroll = postStats?.avgScrollPercentage ? `${Math.round(postStats.avgScrollPercentage)}%` : '82%';
                    const shares = postStats?.shares
                      ? Object.values(postStats.shares).reduce((a, b) => a + b, 0)
                      : 0;
                    const topRef = postStats?.referrerSources
                      ? Object.entries(postStats.referrerSources).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Direct'
                      : 'Direct';

                    return (
                      <tr key={post.slug} className="hover:bg-[var(--surface-elevated)] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-[var(--foreground)] truncate max-w-md">{post.title}</div>
                          <div className="text-[10px] text-[var(--muted)] font-mono">/insights/{post.slug}</div>
                        </td>
                        <td className="py-3.5 text-right font-bold text-[var(--foreground)]">
                          {views.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right text-[var(--muted)]">
                          {avgTime}
                        </td>
                        <td className="py-3.5 text-right text-[var(--accent-gold)]">
                          {avgScroll}
                        </td>
                        <td className="py-3.5 text-right text-emerald-400 font-bold">
                          {comps.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right text-blue-400 font-bold">
                          {shares.toLocaleString()}
                        </td>
                        <td className="py-3.5 text-right text-[var(--muted)]">
                          {topRef}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Live Events Stream */}
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <h3 className="text-sm font-bold text-[var(--foreground)] font-mono uppercase tracking-wider mb-4">
              Real-Time Reader Event Stream (Latest 15)
            </h3>
            <div className="space-y-2">
              {(state.analytics?.recentEvents || []).slice(0, 15).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.type === 'read_complete'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : evt.type === 'share'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : (evt.type || '').includes('play')
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30'
                      }`}
                    >
                      {(evt.type || '').replace('_', ' ')}
                    </span>
                    <span className="text-[var(--foreground)] font-medium truncate max-w-sm">
                      {evt.postTitle || evt.postSlug}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[var(--muted)] text-[11px]">
                    {evt.referrer && <span>Ref: {evt.referrer}</span>}
                    <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Versatile Studio Editor Modal */}
      {(isCreating || editingInsight) && (
        <AdminPostEditorStudio
          isOpen={true}
          initialData={editingInsight || undefined}
          isEditing={!!editingInsight}
          onClose={() => {
            setIsCreating(false);
            setEditingInsight(null);
          }}
          onSave={(savedInsight) => {
            if (editingInsight) {
              updateInsight(editingInsight.slug, savedInsight);
            } else {
              addInsight(savedInsight);
            }
            setIsCreating(false);
            setEditingInsight(null);
          }}
        />
      )}

      {/* List of Insights in Articles Tab */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          {state.insights.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center text-xs text-[var(--muted)]">
              No essays drafted yet. Click &quot;Compose Essay&quot; above to create your first strategic perspective.
            </div>
          ) : (
            state.insights.map((insight) => {
              const audit = auditBlogSeo(insight);
              const postStats = state.analytics?.postsAnalytics[insight.slug];

              return (
                <div
                  key={insight.slug}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] font-mono">
                        {insight.category}
                      </span>
                      <span className="text-[10px] text-[var(--muted)] font-mono px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                        {insight.readingTime || '5 min read'}
                      </span>
                      {insight.featured && (
                        <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                          ★ Spotlight
                        </span>
                      )}
                      {!insight.published ? (
                        <span className="text-[10px] text-zinc-400 font-bold px-2 py-0.5 rounded bg-zinc-500/15 border border-zinc-500/30">
                          Draft (Unpublished)
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                          Live
                        </span>
                      )}
                      {insight.videoUrl && (
                        <span className="text-[10px] text-blue-400 font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                          Video
                        </span>
                      )}
                      {insight.audioUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          Audio
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[var(--foreground)]">
                      {insight.title}
                    </h3>

                    <p className="text-xs text-[var(--muted)] line-clamp-2 max-w-3xl">
                      {insight.excerpt}
                    </p>

                    {/* SEO & Telemetry Pill Indicator */}
                    <div className="flex items-center gap-4 pt-2 text-[11px] font-mono text-[var(--muted)]">
                      <span>SEO Score: <strong className={audit.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}>{audit.score}%</strong></span>
                      <span>•</span>
                      <span>Reads: <strong className="text-[var(--foreground)]">{postStats?.views?.toLocaleString() || 0}</strong></span>
                      <span>•</span>
                      <span>Completions: <strong className="text-[var(--foreground)]">{postStats?.readCompletions?.toLocaleString() || 0}</strong></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[var(--border)]">
                    <a
                      href={`/insights/${insight.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent-gold)] transition-colors"
                      title="View live post in new tab"
                    >
                      <ExternalLink size={15} />
                    </a>

                    <button
                      onClick={() => updateInsight(insight.slug, { published: !insight.published })}
                      className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                        insight.published
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400'
                      }`}
                      title={insight.published ? 'Unpublish' : 'Publish'}
                    >
                      {insight.published ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                    <button
                      onClick={() => handleStartEdit(insight)}
                      className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer"
                      title="Edit essay"
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${insight.title}"?`)) {
                          deleteInsight(insight.slug);
                        }
                      }}
                      className="p-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete essay"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default AdminInsightsPage;
