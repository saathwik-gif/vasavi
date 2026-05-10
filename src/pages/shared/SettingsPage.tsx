import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { getInitials } from '@/lib/utils';
import { Camera, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', username: user?.username ?? '' });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    toast.success('Profile updated successfully');
  };

  const changePassword = async () => {
    if (!passwords.current) { toast.error('Enter current password'); return; }
    if (passwords.newPw !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    if (passwords.newPw.length < 8) { toast.error('Min 8 characters'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    toast.success('Password changed successfully');
    setPasswords({ current: '', newPw: '', confirm: '' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <div className="avatar" style={{ width: 72, height: 72, fontSize: '1.5rem', background: 'linear-gradient(135deg,#6366f1,#06b6d4)' }}>
            {getInitials(user?.name ?? 'U')}
          </div>
          <button className="btn btn-secondary" style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, padding: 0, borderRadius: '50%' }}>
            <Camera size={13} />
          </button>
        </div>
        <div>
          <h3 style={{ fontWeight: 700 }}>{user?.name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')} · {user?.tenantName ?? 'Platform'}</p>
        </div>
      </motion.div>

      {/* Profile info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Personal Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} /></div>
            <div><label className="label">Username</label><input className="input" value={form.username} onChange={e => setForm(s => ({ ...s, username: e.target.value }))} /></div>
          </div>
          <div><label className="label">Email Address</label><input type="email" className="input" value={form.email} onChange={e => setForm(s => ({ ...s, email: e.target.value }))} /></div>
          <div><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} /></div>
          <button className="btn btn-primary" disabled={saving} onClick={save} style={{ alignSelf: 'flex-start' }}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>

      {/* Change password */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Change Password</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label className="label">Current Password</label><input type="password" className="input" value={passwords.current} onChange={e => setPasswords(s => ({ ...s, current: e.target.value }))} placeholder="••••••••" /></div>
          <div><label className="label">New Password</label><input type="password" className="input" value={passwords.newPw} onChange={e => setPasswords(s => ({ ...s, newPw: e.target.value }))} placeholder="Min 8 characters" /></div>
          <div><label className="label">Confirm New Password</label><input type="password" className="input" value={passwords.confirm} onChange={e => setPasswords(s => ({ ...s, confirm: e.target.value }))} placeholder="Repeat password" /></div>
          <button className="btn btn-secondary" onClick={changePassword} style={{ alignSelf: 'flex-start' }}>Update Password</button>
        </div>
      </motion.div>
    </div>
  );
}
