import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Tag, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { MOCK_COUPONS } from '@/data/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Coupon } from '@/types';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage' as Coupon['type'], value: 10, minOrderAmount: 0, usageLimit: 100, expiresAt: '' });

  const toggle = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const create = () => {
    if (!form.code) { toast.error('Coupon code required'); return; }
    if (coupons.some(c => c.code === form.code.toUpperCase())) { toast.error('Code already exists'); return; }
    setCoupons(prev => [...prev, { id: `c${Date.now()}`, ...form, code: form.code.toUpperCase(), usedCount: 0, isActive: true, expiresAt: form.expiresAt || '2025-12-31T23:59:59Z' }]);
    toast.success(`Coupon ${form.code.toUpperCase()} created`);
    setShowModal(false);
    setForm({ code: '', type: 'percentage', value: 10, minOrderAmount: 0, usageLimit: 100, expiresAt: '' });
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Coupon Management</h1>
          <p className="page-subtitle">{coupons.filter(c => c.isActive).length} active coupons</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Create Coupon</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {coupons.map((c, i) => {
          const usagePct = (c.usedCount / c.usageLimit) * 100;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="card" style={{ opacity: c.isActive ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tag size={16} color="var(--color-primary-light)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em', fontFamily: 'monospace', color: 'var(--color-primary-light)' }}>{c.code}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{c.type} discount</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-icon" style={{ color: c.isActive ? '#10b981' : '#64748b' }} onClick={() => toggle(c.id)}>
                  {c.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>

              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }} className="gradient-text">
                {c.type === 'percentage' ? `${c.value}% OFF` : `${formatCurrency(c.value)} OFF`}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Min order: {formatCurrency(c.minOrderAmount)} · Expires: {formatDate(c.expiresAt)}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Usage</span>
                  <span style={{ fontWeight: 600 }}>{c.usedCount} / {c.usageLimit}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${usagePct}%`, background: usagePct > 80 ? '#ef4444' : usagePct > 50 ? '#f59e0b' : 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700 }}>Create Coupon</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">Coupon Code *</label>
                  <input className="input" value={form.code} onChange={e => setForm(s => ({ ...s, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.1em' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">Discount Type</label>
                    <select className="input" value={form.type} onChange={e => setForm(s => ({ ...s, type: e.target.value as Coupon['type'] }))}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Discount Value</label>
                    <input type="number" min={1} className="input" value={form.value} onChange={e => setForm(s => ({ ...s, value: +e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="label">Min Order Amount (₹)</label>
                    <input type="number" min={0} className="input" value={form.minOrderAmount} onChange={e => setForm(s => ({ ...s, minOrderAmount: +e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Usage Limit</label>
                    <input type="number" min={1} className="input" value={form.usageLimit} onChange={e => setForm(s => ({ ...s, usageLimit: +e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">Expiry Date</label>
                  <input type="date" className="input" value={form.expiresAt} onChange={e => setForm(s => ({ ...s, expiresAt: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={create}>Create Coupon</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
