import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCms } from '@/lib/cms-store';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Sliders,
  FolderKanban,
  Briefcase,
  Layers,
  BookOpen,
  GitGraph,
  BarChart3,
  Users2,
  Settings,
  ShieldAlert,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  UserCheck,
  CheckCircle2,
  Mail,
  Megaphone,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const { currentUser, isAuthenticated, isSuperAdmin, logout, state } = useCms();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Redirect unauthenticated users
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
          <ShieldAlert className="w-12 h-12 text-[var(--accent-gold)] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Administrative Access Required</h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            Please authenticate to access the executive content management back-end.
          </p>
          <button
            onClick={() => navigate('/admin/login', { state: { from: location } })}
            className="w-full py-3 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-sm hover:brightness-110 transition-all"
          >
            Go to Authentication Portal
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  interface NavItem {
    label: string;
    to: string;
    icon: LucideIcon;
    end?: boolean;
    badge?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      group: 'Core Showcase',
      items: [
        {
          label: 'Dashboard Overview',
          to: '/admin',
          icon: LayoutDashboard,
          end: true,
        },
        {
          label: 'Multimedia Library',
          to: '/admin/media',
          icon: ImageIcon,
          badge: (state.mediaAssets?.length || 0).toString(),
        },
        {
          label: 'Homepage Sliders',
          to: '/admin/sliders',
          icon: Sliders,
          badge: state.sliderBanners.filter((b) => b.active).length.toString(),
        },
        {
          label: 'Case Studies',
          to: '/admin/case-studies',
          icon: FolderKanban,
          badge: state.caseStudies.length.toString(),
        },
        {
          label: 'Career & Experience',
          to: '/admin/experience',
          icon: Briefcase,
          badge: state.experiences.length.toString(),
        },
      ],
    },
    {
      group: 'Content & Systems',
      items: [
        {
          label: 'Capabilities Matrix',
          to: '/admin/capabilities',
          icon: Layers,
          badge: state.capabilities.length.toString(),
        },
        {
          label: 'Insights & Essays',
          to: '/admin/insights',
          icon: BookOpen,
          badge: state.insights.length.toString(),
        },
        {
          label: 'Systems & Stages',
          to: '/admin/systems',
          icon: GitGraph,
        },
        {
          label: 'Headline Metrics',
          to: '/admin/metrics',
          icon: BarChart3,
          badge: state.metrics.length.toString(),
        },
        {
          label: 'Ecosystem Network',
          to: '/admin/ecosystem',
          icon: Users2,
          badge: state.professionalContacts.length.toString(),
        },
      ],
    },
    {
      group: 'Executive Suite & Commercial',
      items: [
        {
          label: 'Executive Webmail',
          to: '/admin/webmail',
          icon: Mail,
          badge: state.webmailEmails.filter((e) => !e.read).length > 0
            ? `${state.webmailEmails.filter((e) => !e.read).length} unread`
            : undefined,
        },
        {
          label: 'Advert & Sponsorships',
          to: '/admin/ads',
          icon: Megaphone,
          badge: `${state.adCampaigns.filter((c) => c.active).length} active`,
        },
      ],
    },
    {
      group: 'Platform & Controls',
      items: [
        {
          label: 'Front-End & Site Controls',
          to: '/admin/settings',
          icon: Settings,
        },
        ...(isSuperAdmin
          ? [
              {
                label: 'User Accounts',
                to: '/admin/users',
                icon: Shield,
                badge: state.adminUsers.length.toString(),
              },
              {
                label: 'Audit & Database',
                to: '/admin/audit',
                icon: Database,
                badge: state.auditLogs.length.toString(),
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[var(--surface-elevated)] border-b border-[var(--border)] px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-gold)] text-black flex items-center justify-center font-black text-sm">
              KN
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">KEL NNOROM</div>
              <div className="text-[10px] text-[var(--accent-gold)] font-mono uppercase tracking-wider">
                EXECUTIVE CMS CONSOLE
              </div>
            </div>
          </Link>
        </div>

        {/* User Info and Global Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink size={13} />
          </Link>

          {/* User Role Badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] flex items-center justify-center text-xs">
              {isSuperAdmin ? <Shield size={13} /> : <UserCheck size={13} />}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-[var(--foreground)] leading-none">
                {currentUser?.name || 'Admin User'}
              </div>
              <div className="text-[10px] text-[var(--accent-gold)] font-mono mt-0.5 leading-none uppercase">
                {(currentUser?.role || 'admin').replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-[var(--surface)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-colors"
            title="End Admin Session"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Admin Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-30 w-72 bg-[var(--surface)] border-r border-[var(--border)] p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300',
            mobileNavOpen ? 'translate-x-0 top-[57px]' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.group}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] px-3 mb-2 font-mono">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileNavOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all',
                          isActive
                            ? 'bg-[var(--accent-gold)] text-black font-bold shadow-md shadow-[var(--accent-gold)]/20'
                            : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]'
                        )
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] font-mono px-2 py-0.5 rounded-full border',
                            'bg-black/10 text-inherit border-current/20'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick System Status Footer */}
          <div className="pt-6 border-t border-[var(--border)] text-[11px] text-[var(--muted)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                <CheckCircle2 size={13} />
                Store Persistent
              </span>
              <span className="font-mono text-[10px]">v{state.version}</span>
            </div>
            <div className="text-[10px] opacity-75">
              Access level: <strong className="uppercase">{currentUser.role}</strong>
            </div>
          </div>
        </aside>

        {/* Content Outlet Canvas */}
        <main className="flex-1 overflow-y-auto bg-[var(--background)] p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
