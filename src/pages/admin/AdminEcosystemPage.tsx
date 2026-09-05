import { useState } from 'react';
import { useCms } from '@/lib/cms-store';
import type { ProfessionalContact } from '@/types/content';
import { Users2, Plus, Trash2, CheckCircle } from 'lucide-react';

export function AdminEcosystemPage() {
  const { state, addContact, deleteContact } = useCms();
  const [contacts, setContacts] = useState<ProfessionalContact[]>(state.professionalContacts);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [relationshipType, setRelationshipType] = useState<
    'Leadership Ecosystem' | 'Professional Network' | 'Collaborator'
  >('Leadership Ecosystem');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newC: ProfessionalContact = {
      name: name.trim(),
      organization: organization.trim() || undefined,
      role: role.trim() || undefined,
      relationshipType,
      verified: true,
    };
    addContact(newC);
    setContacts([...contacts, newC]);
    setName('');
    setOrganization('');
    setRole('');
  };

  const handleDelete = (index: number) => {
    deleteContact(index);
    setContacts(contacts.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-gold)] font-mono mb-1">
            VERIFIED NETWORK
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-[var(--accent-gold)]" />
            <span>Professional Ecosystem & Leadership Network</span>
          </h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Manage executive leadership ecosystem contacts, founders, collaborators, and technical specialists.
          </p>
        </div>
      </div>

      {/* Add New Contact Form */}
      <form
        onSubmit={handleAdd}
        className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
      >
        <div className="sm:col-span-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g. Jason Njoku)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Organization (e.g. iROKO)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role / Discipline (e.g. Full Stack)"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <select
            value={relationshipType}
            onChange={(e) =>
              setRelationshipType(
                e.target.value as 'Leadership Ecosystem' | 'Professional Network' | 'Collaborator'
              )
            }
            className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-[var(--accent-gold)] focus:outline-none"
          >
            <option value="Leadership Ecosystem">Leadership</option>
            <option value="Collaborator">Collaborator</option>
            <option value="Professional Network">Network</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[var(--accent-gold)] text-black font-bold text-xs hover:brightness-110 shadow-md flex items-center justify-center"
            title="Add contact"
          >
            <Plus size={16} />
          </button>
        </div>
      </form>

      {/* Grid of Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.professionalContacts.map((c, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-gold)]/40 transition-all flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--foreground)]">{c.name}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle size={10} />
                </span>
              </div>
              <div className="text-xs text-[var(--accent-gold)] font-medium">
                {c.organization || c.role}
              </div>
              <div className="text-[10px] text-[var(--muted)] font-mono mt-0.5">
                {c.relationshipType}
              </div>
            </div>

            <button
              onClick={() => handleDelete(idx)}
              className="p-2 text-[var(--muted)] hover:text-red-400 transition-colors"
              title="Delete contact"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
