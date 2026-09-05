import React, { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { UserRole, UserStatus, AdminUser, QuickAccessPreset } from '@/types/cms';
import {
  Shield,
  Trash2,
  UserPlus,
  ShieldAlert,
  Edit3,
  Send,
  CheckCircle2,
  Search,
  Lock,
  Mail,
  Clock,
  Sparkles,
  Copy,
  Check,
  Plus,
} from 'lucide-react';

export function AdminUsersPage() {
  const {
    state,
    currentUser,
    isSuperAdmin,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    resetUserAccessCode,
    updateSettings,
    generateApiToken,
  } = useCms();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // New User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Operations');
  const [newPhone, setNewPhone] = useState('');
  const [newBio, setNewBio] = useState('');

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'profile' | 'security' | 'tokens' | 'notifications'>('profile');

  // Quick Access Demo Preset Management
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [presets, setPresets] = useState<QuickAccessPreset[]>(
    state.settings.quickAccessPresets || []
  );

  // Copied token notification
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [newTokenName, setNewTokenName] = useState('');

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--surface)] border border-red-500/30 text-center max-w-2xl mx-auto my-12">
        <ShieldAlert className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-[var(--foreground)]">Super Admin Authorization Required</h2>
        <p className="text-sm text-[var(--muted)] mt-2">
          Only accounts with Super Administrator role level can manage administrative users, edit profile permissions, and manage security access credentials.
        </p>
      </div>
    );
  }

  // Filtered users list
  const filteredUsers = state.adminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.jobTitle && user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      name: newName.trim(),
      role: newRole,
      status: 'active',
      jobTitle: newJobTitle.trim() || 'Operations Administrator',
      department: newDepartment.trim() || 'Operations Desk',
      phone: newPhone.trim(),
      bio: newBio.trim(),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?q=80&w=400&auto=format&fit=crop`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      twoFactorEnabled: true,
      apiTokens: [],
      notificationPreferences: {
        emailOnLogin: true,
        emailOnSubscriber: true,
        emailOnAdAlert: true,
        emailOnSystemWarning: true,
        weeklySummaryDigest: true,
      },
    };

    addAdminUser(newUser);
    setIsAddModalOpen(false);
    setNewEmail('');
    setNewName('');
    setNewJobTitle('');
    setNewBio('');
    showNotification(`Successfully provisioned account for ${newUser.name} (${newUser.email})`);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateAdminUser(editingUser.id, editingUser);
    showNotification(`Account details for ${editingUser.name} updated successfully.`);
    setEditingUser(null);
  };

  const handleDispatchAccessCode = (user: AdminUser) => {
    const result = resetUserAccessCode(user.id);
    if (result.success) {
      showNotification(result.message);
    }
  };

  const handleToggleQuickAccess = () => {
    const currentVal = state.settings.enableQuickAccessDemo ?? false;
    updateSettings({ enableQuickAccessDemo: !currentVal });
    showNotification(
      !currentVal
        ? '1-Click Demo Access enabled on administrative login gateway.'
        : '1-Click Demo Access hidden and deactivated on login gateway.'
    );
  };

  const handleSavePresets = () => {
    updateSettings({ quickAccessPresets: presets });
    showNotification('Quick access demo presets updated successfully.');
    setShowPresetManager(false);
  };

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim() || !editingUser) return;
    const token = generateApiToken(newTokenName.trim());
    setEditingUser((prev) =>
      prev ? { ...prev, apiTokens: [...(prev.apiTokens || []), token] } : null
    );
    setNewTokenName('');
    showNotification(`Generated API Token "${token.name}"`);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTokenId(id);
    setTimeout(() => setCopiedTokenId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-xs opacity-60 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            ACCESS & IDENTITY ARCHITECTURE
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Registered User Account Management</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Full control over administrative accounts, RBAC privilege tiers, OTP dispatching, and security tokens.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPresetManager(!showPresetManager)}
            className="px-3.5 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-xs font-medium text-[var(--foreground)] flex items-center gap-2 transition-all"
          >
            <Sparkles size={14} className="text-[var(--accent-gold)]" />
            <span>1-Click Login Settings</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md flex items-center gap-2 transition-all"
          >
            <UserPlus size={15} />
            <span>Provision Account</span>
          </button>
        </div>
      </div>

      {/* 1-Click Access Customization Drawer (Super Admin Configurable) */}
      {showPresetManager && (
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--accent-gold)]/40 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>1-Click Access Demo Customizer</span>
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Toggle and configure the quick 1-click access authorization presets displayed on the login screen.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-[var(--muted)]">Status:</span>
              <button
                type="button"
                onClick={handleToggleQuickAccess}
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                  state.settings.enableQuickAccessDemo
                    ? 'bg-emerald-500 text-black shadow-sm'
                    : 'bg-[var(--surface-elevated)] text-[var(--muted)] border border-[var(--border)]'
                }`}
              >
                {state.settings.enableQuickAccessDemo ? 'ACTIVE / VISIBLE' : 'HIDDEN / DISABLED'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-[var(--foreground)]">Configured Quick Access Presets</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presets.map((preset, idx) => (
                <div
                  key={preset.id || idx}
                  className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={preset.label}
                      onChange={(e) => {
                        const updated = [...presets];
                        updated[idx].label = e.target.value;
                        setPresets(updated);
                      }}
                      className="px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                    />
                    <select
                      value={preset.role}
                      onChange={(e) => {
                        const updated = [...presets];
                        updated[idx].role = e.target.value as UserRole;
                        setPresets(updated);
                      }}
                      className="px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px] font-mono text-[var(--accent-gold)]"
                    >
                      <option value="super_admin">super_admin</option>
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="viewer">viewer</option>
                    </select>
                  </div>
                  <input
                    type="email"
                    value={preset.email}
                    onChange={(e) => {
                      const updated = [...presets];
                      updated[idx].email = e.target.value;
                      setPresets(updated);
                    }}
                    placeholder="email address"
                    className="w-full px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--muted)] focus:border-[var(--accent-gold)]"
                  />
                  <input
                    type="text"
                    value={preset.description || ''}
                    onChange={(e) => {
                      const updated = [...presets];
                      updated[idx].description = e.target.value;
                      setPresets(updated);
                    }}
                    placeholder="Preset description summary"
                    className="w-full px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--muted)]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShowPresetManager(false)}
              className="px-4 py-2 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePresets}
              className="px-4 py-2 rounded-lg bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-sm"
            >
              Save Preset Configurations
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts by name, email, or role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[var(--muted)] absolute left-3 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
          >
            <option value="all">All Roles ({state.adminUsers.length})</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Directory Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all shadow-sm group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Column: Avatar and User Metadata */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-2xl object-cover border border-[var(--border)] group-hover:border-[var(--accent-gold)] transition-colors shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-[var(--surface-elevated)] text-[var(--accent-gold)] border border-[var(--border)] flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span
                    className={`w-3.5 h-3.5 rounded-full border-2 border-[var(--surface)] absolute -bottom-1 -right-1 ${
                      user.status === 'suspended'
                        ? 'bg-red-500'
                        : user.status === 'pending'
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    title={`Status: ${user.status || 'active'}`}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-[var(--foreground)]">{user.name}</h2>
                    {user.id === currentUser?.id && (
                      <span className="text-[10px] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 px-2 py-0.5 rounded font-mono font-bold">
                        YOU (ACTIVE SESSION)
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                        user.role === 'super_admin'
                          ? 'bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] border-[var(--accent-gold)]/40'
                          : user.role === 'admin'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/40'
                          : 'bg-zinc-500/15 text-zinc-300 border-zinc-500/40'
                      }`}
                    >
                      {(user.role || 'editor').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1 font-mono text-[var(--foreground)]">
                      <Mail size={12} className="text-[var(--accent-gold)]" />
                      {user.email}
                    </span>
                    {user.jobTitle && (
                      <span className="text-[var(--muted)]">• {user.jobTitle}</span>
                    )}
                    {user.department && (
                      <span className="text-[var(--muted)]">• {user.department}</span>
                    )}
                  </div>

                  {user.bio && (
                    <p className="text-xs text-[var(--muted)] line-clamp-1 max-w-2xl pt-1">
                      {user.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-[var(--muted)] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Last Login: {user.lastLogin || 'Never'}
                    </span>
                    <span>• Registered: {user.createdAt}</span>
                    {user.twoFactorEnabled && (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <Lock size={11} /> OTP Protected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
                {/* Send Fresh Access Code Button */}
                <button
                  type="button"
                  onClick={() => handleDispatchAccessCode(user)}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-all shadow-sm"
                  title="Generate and dispatch new Access Code to user email & webmail inbox"
                >
                  <Send size={13} className="text-[var(--accent-gold)]" />
                  <span>Send Access Code</span>
                </button>

                {/* Edit Account Modal Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(user);
                    setActiveEditTab('profile');
                  }}
                  className="px-3 py-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-all"
                >
                  <Edit3 size={13} />
                  <span>Edit Account</span>
                </button>

                {/* Revoke / Delete Button */}
                {user.id !== currentUser?.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Revoke all administrative access and permanently remove account for ${user.name} (${user.email})?`
                        )
                      ) {
                        deleteAdminUser(user.id);
                        showNotification(`Removed account for ${user.email}`);
                      }
                    }}
                    className="p-2 rounded-xl bg-[var(--surface-elevated)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/30 text-[var(--muted)] hover:text-red-400 transition-all"
                    title="Delete User Account"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Edit & Update Drawer / Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-6 bg-[var(--surface-elevated)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border border-[var(--accent-gold)]/40">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    Edit Account: {editingUser.name}
                  </h2>
                  <p className="text-xs text-[var(--muted)] font-mono">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[var(--border)] bg-[var(--surface)] px-6">
              {[
                { id: 'profile' as const, label: 'Profile & Role' },
                { id: 'security' as const, label: 'Security & Access' },
                { id: 'tokens' as const, label: 'API & Webhooks' },
                { id: 'notifications' as const, label: 'Notification Rules' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditTab(tab.id)}
                  className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
                    activeEditTab === tab.id
                      ? 'border-[var(--accent-gold)] text-[var(--accent-gold)]'
                      : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveUserEdit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {activeEditTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Authorization Role
                      </label>
                      <select
                        disabled={editingUser.id === currentUser?.id}
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      >
                        <option value="super_admin">Super Admin (Full System)</option>
                        <option value="admin">Content Administrator</option>
                        <option value="editor">Editor / Author</option>
                        <option value="viewer">Auditor / Viewer (Read Only)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Account Status
                      </label>
                      <select
                        disabled={editingUser.id === currentUser?.id}
                        value={editingUser.status || 'active'}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, status: e.target.value as UserStatus })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={editingUser.department || ''}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, department: e.target.value })
                        }
                        placeholder="e.g. Executive Operations"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Official Job Title
                      </label>
                      <input
                        type="text"
                        value={editingUser.jobTitle || ''}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, jobTitle: e.target.value })
                        }
                        placeholder="e.g. Senior Operations Strategist"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={editingUser.phone || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        placeholder="+234 805 439 7057"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={editingUser.avatarUrl || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, avatarUrl: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Bio & Operational Scope
                    </label>
                    <textarea
                      rows={3}
                      value={editingUser.bio || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                      placeholder="Brief statement of role responsibility and domain oversight..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                    />
                  </div>
                </div>
              )}

              {activeEditTab === 'security' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-[var(--foreground)]">
                          Two-Factor & Single-Use Access Code Authentication
                        </h3>
                        <p className="text-[11px] text-[var(--muted)]">
                          Mandates 6-digit cryptographic code validation on every login attempt.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingUser.twoFactorEnabled ?? true}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, twoFactorEnabled: e.target.checked })
                        }
                        className="w-4 h-4 accent-[var(--accent-gold)] rounded"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[var(--foreground)]">Direct Access Code Dispatch</h3>
                      <p className="text-[11px] text-[var(--muted)]">
                        Generate and send an immediate temporary Access Code to {editingUser.email}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDispatchAccessCode(editingUser)}
                      className="px-3.5 py-2 rounded-lg bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
                    >
                      <Send size={13} />
                      <span>Dispatch Now</span>
                    </button>
                  </div>
                </div>
              )}

              {activeEditTab === 'tokens' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[var(--foreground)]">API & Webhook Tokens</h3>
                    <span className="text-[11px] text-[var(--muted)] font-mono">
                      {(editingUser.apiTokens || []).length} Active Tokens
                    </span>
                  </div>

                  {/* Create Token */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTokenName}
                      onChange={(e) => setNewTokenName(e.target.value)}
                      placeholder="Token Label (e.g. Zapier / Telemetry Webhook)"
                      className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                    />
                    <button
                      type="button"
                      onClick={handleCreateToken}
                      className="px-3 py-2 rounded-lg bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>Create Token</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {(editingUser.apiTokens || []).map((token) => (
                      <div
                        key={token.id}
                        className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-[var(--foreground)]">{token.name}</div>
                          <div className="text-[11px] font-mono text-[var(--muted)] flex items-center gap-2">
                            <span>{token.token}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(token.token, token.id)}
                              className="text-[var(--accent-gold)] hover:underline flex items-center gap-0.5 text-[10px]"
                            >
                              {copiedTokenId === token.id ? <Check size={10} /> : <Copy size={10} />}
                              <span>{copiedTokenId === token.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = (editingUser.apiTokens || []).filter((t) => t.id !== token.id);
                            setEditingUser({ ...editingUser, apiTokens: filtered });
                          }}
                          className="p-1.5 text-[var(--muted)] hover:text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeEditTab === 'notifications' && (
                <div className="space-y-3">
                  {[
                    { key: 'emailOnLogin' as const, label: 'Security Login Alerts', desc: 'Receive email whenever a login is authenticated.' },
                    { key: 'emailOnSubscriber' as const, label: 'New Subscriber Alerts', desc: 'Instant notice when an executive subscribes.' },
                    { key: 'emailOnAdAlert' as const, label: 'Ad & Sponsorship Alert', desc: 'Alerts when banner impression goals are reached.' },
                    { key: 'emailOnSystemWarning' as const, label: 'System & Security Warnings', desc: 'Critical alerts on telemetry anomalies.' },
                    { key: 'weeklySummaryDigest' as const, label: 'Weekly Executive Briefing Digest', desc: 'Comprehensive operational telemetry digest.' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-[var(--foreground)]">{item.label}</div>
                        <div className="text-[11px] text-[var(--muted)]">{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                          editingUser.notificationPreferences?.[item.key] ?? true
                        }
                        onChange={(e) => {
                          const prefs = {
                            ...(editingUser.notificationPreferences || {
                              emailOnLogin: true,
                              emailOnSubscriber: true,
                              emailOnAdAlert: true,
                              emailOnSystemWarning: true,
                              weeklySummaryDigest: true,
                            }),
                            [item.key]: e.target.checked,
                          };
                          setEditingUser({ ...editingUser, notificationPreferences: prefs });
                        }}
                        className="w-4 h-4 accent-[var(--accent-gold)] rounded"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] hover:border-[var(--muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md"
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provision New Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 bg-[var(--surface-elevated)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]">
                  <UserPlus size={18} />
                </div>
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  Provision New Administrative Account
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Operator Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. marcus@kelnnorom.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Role Privilege
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)]"
                  >
                    <option value="admin">Content Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="editor">Editor / Contributor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="Operations Desk"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Systems & Turnaround Analyst"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+234 805 439 7057"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                  Operational Bio
                </label>
                <textarea
                  rows={2}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Brief note on duties and responsibilities..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminUsersPage;
