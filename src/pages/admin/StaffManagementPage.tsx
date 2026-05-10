import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, UserCheck, UserX, Mail, Phone, X } from 'lucide-react';
import { MOCK_STAFF } from '@/data/mockData';
import { formatDate, getInitials } from '@/lib/utils';
import type { Staff } from '@/types';

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'operator' as Staff['role'] });

  const toggleStatus = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const invite = () => {
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    const newStaff: Staff = { id: `u${Date.now()}`, name: form.name, email: form.email, phone: form.phone, role: form.role, status: 'active', joinedAt: new Date().toISOString(), ordersHandled: 0 };
    setStaff(prev => [...prev, newStaff]);
    toast.success(`${form.name} invited successfully`);
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', role: 'operator' });
  };

  const ROLE_COLORS: Record<Staff['role'], string> = { manager: '#6366f1', operator: '#06b6d4', delivery: '#f59e0b' };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">{staff.filter(s => s.status === 'active').length} active staff members</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Invite Staff</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {staff.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card" style={{ opacity: s.status === 'inactive' ? 0.65 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: '0.9rem', background: `linear-gradient(135deg, ${ROLE_COLORS[s.role]}, #06b6d4)` }}>
                {getInitials(s.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: 999, background: ROLE_COLORS[s.role] + '20', color: ROLE_COLORS[s.role], fontWeight: 600, textTransform: 'capitalize' }}>{s.role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                  <Mail size={11} /> {s.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  <Phone size={11} /> {s.phone || 'Not provided'}
                </div>
              </div>
            </div>
            <hr className="divider" style={{ margin: '1rem 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{s.ordersHandled}</span> orders · Since {formatDate(s.joinedAt)}
              </div>
              <button className={`btn btn-sm ${s.status === 'active' ? 'btn-danger' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem' }} onClick={() => toggleStatus(s.id)}>
                {s.status === 'active' ? <><UserX size={12} /> Deactivate</> : <><UserCheck size={12} /> Activate</>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700 }}>Invite Staff Member</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} placeholder="Staff member name" /></div>
                <div><label className="label">Email Address *</label><input type="email" className="input" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} placeholder="staff@shop.com" /></div>
                <div><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} placeholder="9876543210" /></div>
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={form.role} onChange={e => setForm(s => ({ ...s, role: e.target.value as Staff['role'] }))}>
                    <option value="operator">Operator</option>
                    <option value="manager">Manager</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={invite}>Send Invitation</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
