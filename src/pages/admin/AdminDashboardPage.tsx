import { useCms } from '@/lib/cms-store';
import { Link } from 'react-router-dom';
import {
  Sliders,
  FolderKanban,
  Briefcase,
  Layers,
  BookOpen,
  Users2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Clock,
  Sparkles,
  Mail,
  Megaphone,
  Image as ImageIcon,
} from 'lucide-react';

export function AdminDashboardPage() {
  const { state, currentUser, isSuperAdmin } = useCms();

  const stats = [
    {
      label: 'Executive Sliders',
      value: state.sliderBanners.length,
      active: `${state.sliderBanners.filter((b) => b.active).length} Active`,
      to: '/admin/sliders',
      icon: Sliders,
      color: 'text-[var(--accent-gold)]',
    },
    {
      label: 'Case Studies',
      value: state.caseStudies.length,
      active: `${state.caseStudies.filter((c) => c.featured).length} Featured`,
      to: '/admin/case-studies',
      icon: FolderKanban,
      color: 'text-blue-400',
    },
    {
      label: 'Career Roles',
      value: state.experiences.length,
      active: '15+ Years Span',
      to: '/admin/experience',
      icon: Briefcase,
      color: 'text-emerald-400',
    },
    {
      label: 'Capability Groups',
      value: state.capabilities.length,
      active: `${state.capabilities.reduce((acc, c) => acc + c.items.length, 0)} Skills`,
      to: '/admin/capabilities',
      icon: Layers,
      color: 'text-purple-400',
    },
    {
      label: 'Insights & Essays',
      value: state.insights.length,
      active: `${state.insights.filter((i) => i.published).length} Published`,
      to: '/admin/insights',
      icon: BookOpen,
      color: 'text-amber-400',
    },
    {
      label: 'Ecosystem Contacts',
      value: state.professionalContacts.length,
      active: `${state.professionalContacts.filter((c) => c.verified).length} Verified`,
      to: '/admin/ecosystem',
      icon: Users2,
      color: 'text-cyan-400',
    },
    {
      label: 'Executive Webmail',
      value: state.webmailEmails.length,
      active: `${state.webmailEmails.filter((e) => !e.read).length} Unread Memos`,
      to: '/admin/webmail',
      icon: Mail,
      color: 'text-rose-400',
    },
    {
      label: 'Multimedia Library',
      value: state.mediaAssets?.length || 0,
      active: `${(state.mediaAssets || []).filter((m) => m.type === 'image').length} HD Images`,
      to: '/admin/media',
      icon: ImageIcon,
      color: 'text-pink-400',
    },
    {
      label: 'Advert & Placements',
      value: state.adCampaigns.length,
      active: `${state.adCampaigns.filter((c) => c.active).length} Active Campaigns`,
      to: '/admin/ads',
      icon: Megaphone,
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--surface-elevated)] border border-[var(--border)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--accent-gold)]/40 text-[var(--accent-gold)] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>System Command & Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1 max-w-xl">
              Manage executive portfolio content, slider banner campaigns, case studies, insights,
              operating topology, and system integrations in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/sliders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 transition-all shadow-md"
            >
              <Plus size={15} />
              <span>Add Slider Slide</span>
            </Link>
            <Link
              to="/admin/case-studies"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-xs font-medium text-[var(--foreground)] transition-all"
            >
              <FolderKanban size={15} />
              <span>Manage Studies</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Key CMS Modules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
            <TrendingUp size={16} className="text-[var(--accent-gold)]" />
            <span>Platform Section Overview</span>
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">All components reactive</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="p-5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <ArrowUpRight size={16} className="text-[var(--muted)] group-hover:text-[var(--accent-gold)] transition-colors" />
              </div>

              <div className="text-2xl font-black text-[var(--foreground)] font-mono mb-1">
                {item.value}
              </div>

              <div className="text-xs font-bold text-[var(--foreground)]">
                {item.label}
              </div>

              <div className="text-[11px] text-[var(--muted)] mt-1 flex items-center justify-between border-t border-[var(--border)] pt-2 mt-2">
                <span>{item.active}</span>
                <span className="text-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono">
                  Edit Section →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Launchpad & Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Launch Actions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--foreground)]">Quick Administrative Actions</h3>
            <span className="text-xs text-[var(--muted)]">Direct shortcuts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/settings"
              className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all"
            >
              <div className="text-xs font-bold text-[var(--foreground)] mb-1">Social Links & WhatsApp</div>
              <div className="text-[11px] text-[var(--muted)]">
                Configure X, Instagram, Facebook, and WhatsApp hotline (+234 805 439 7057).
              </div>
            </Link>

            <Link
              to="/admin/metrics"
              className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all"
            >
              <div className="text-xs font-bold text-[var(--foreground)] mb-1">Headline Credibility Stats</div>
              <div className="text-[11px] text-[var(--muted)]">
                Update verified metrics: 15+ Yrs, 20+ Platforms, &gt;95% OTIF, -25% Fuel.
              </div>
            </Link>

            <Link
              to="/admin/systems"
              className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all"
            >
              <div className="text-xs font-bold text-[var(--foreground)] mb-1">6-Stage Philosophy Engine</div>
              <div className="text-[11px] text-[var(--muted)]">
                Modify execution stages: Understand, Map, Build, Optimize, Measure, Scale.
              </div>
            </Link>

            {isSuperAdmin ? (
              <Link
                to="/admin/audit"
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all"
              >
                <div className="text-xs font-bold text-[var(--foreground)] mb-1">Database Backup & JSON</div>
                <div className="text-[11px] text-[var(--muted)]">
                  Export complete database snapshot or perform verified factory reset.
                </div>
              </Link>
            ) : (
              <Link
                to="/admin/insights"
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-all"
              >
                <div className="text-xs font-bold text-[var(--foreground)] mb-1">Write New Essay</div>
                <div className="text-[11px] text-[var(--muted)]">
                  Draft or publish strategic insights on operational systems.
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Clock size={15} className="text-[var(--accent-gold)]" />
              <span>Recent System Activity</span>
            </h3>
            {isSuperAdmin && (
              <Link to="/admin/audit" className="text-xs text-[var(--accent-gold)] hover:underline">
                View Full Audit Log →
              </Link>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] divide-y divide-[var(--border)] max-h-[300px] overflow-y-auto">
            {state.auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[var(--foreground)]">{log.action}</span>
                  <span className="text-[10px] text-[var(--muted)] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--muted)]">{log.details}</div>
                <div className="text-[10px] text-[var(--accent-gold)] font-mono mt-1">
                  By {log.userName} ({log.userEmail})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
