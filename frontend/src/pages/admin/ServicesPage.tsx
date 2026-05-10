import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Edit2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { MOCK_SERVICES } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import type { Service } from '@/types';

const CATEGORY_INFO: Record<string, { label: string; emoji: string }> = {
  printing: { label: 'Printing', emoji: '🖨️' },
  stamps: { label: 'Stamps', emoji: '🔖' },
  binding: { label: 'Binding & Finishing', emoji: '📚' },
  identity: { label: 'Identity & Business', emoji: '💳' },
  design: { label: 'Design Services', emoji: '🎨' },
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'printing', icon: '🖨️', basePrice: 1, unit: 'page' });

  const toggle = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    const svc = services.find(s => s.id === id);
    toast.success(`${svc?.name} ${svc?.isActive ? 'deactivated' : 'activated'}`);
  };

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', category: 'printing', icon: '🖨️', basePrice: 1, unit: 'page' }); setShowModal(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, description: s.description, category: s.category, icon: s.icon, basePrice: s.variants[0]?.basePrice ?? 1, unit: s.variants[0]?.unit ?? 'page' }); setShowModal(true); };

  const save = () => {
    if (!form.name) { toast.error('Service name required'); return; }
    if (editing) {
      setServices(prev => prev.map(s => s.id === editing.id ? { ...s, name: form.name, description: form.description, icon: form.icon } : s));
      toast.success('Service updated');
    } else {
      const newSvc: Service = { id: `s${Date.now()}`, tenantId: 't1', category: form.category as Service['category'], name: form.name, description: form.description, icon: form.icon, isActive: true, createdAt: new Date().toISOString(), variants: [{ id: `sv${Date.now()}`, name: 'Standard', basePrice: form.basePrice, unit: form.unit, pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: form.basePrice }] }] };
      setServices(prev => [...prev, newSvc]);
      toast.success('Service created');
    }
    setShowModal(false);
  };

  const grouped = Object.entries(CATEGORY_INFO).map(([cat, info]) => ({
    cat, ...info, services: services.filter(s => s.category === cat),
  }));

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Services & Pricing</h1>
          <p className="page-subtitle">{services.filter(s => s.isActive).length} active · {services.length} total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Service</button>
      </div>

      {grouped.map(g => (
        <div key={g.cat} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>{g.emoji} {g.label}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {g.services.map(svc => (
              <motion.div key={svc.id} layout className="card" style={{ opacity: svc.isActive ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '1.75rem' }}>{svc.icon}</div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn btn-ghost btn-icon" style={{ width: 30, height: 30 }} onClick={() => openEdit(svc)}><Edit2 size={13} /></button>
                    <button className="btn btn-ghost btn-icon" style={{ width: 30, height: 30, color: svc.isActive ? '#10b981' : '#64748b' }} onClick={() => toggle(svc.id)}>
                      {svc.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{svc.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>{svc.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {svc.variants.map(v => (
                    <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', padding: '0.375rem 0.625rem', background: 'var(--color-surface-3)', borderRadius: 6 }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{v.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatCurrency(v.basePrice)}/{v.unit}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className={`status-pill ${svc.isActive ? 'badge-active' : 'badge-inactive'}`}>{svc.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div className="modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontWeight: 700 }}>{editing ? 'Edit Service' : 'Add New Service'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.75rem' }}>
                  <div>
                    <label className="label">Service Name *</label>
                    <input className="input" value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} placeholder="e.g. Color Printing" />
                  </div>
                  <div>
                    <label className="label">Icon</label>
                    <input className="input" value={form.icon} onChange={e => setForm(s => ({ ...s, icon: e.target.value }))} style={{ textAlign: 'center', fontSize: '1.25rem' }} />
                  </div>
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input" value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} rows={2} style={{ resize: 'none' }} placeholder="Brief description..." />
                </div>
                {!editing && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="label">Category</label>
                      <select className="input" value={form.category} onChange={e => setForm(s => ({ ...s, category: e.target.value }))}>
                        {Object.entries(CATEGORY_INFO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Base Price (₹)</label>
                      <input type="number" min={0} step={0.5} className="input" value={form.basePrice} onChange={e => setForm(s => ({ ...s, basePrice: +e.target.value }))} />
                    </div>
                    <div>
                      <label className="label">Unit</label>
                      <input className="input" value={form.unit} onChange={e => setForm(s => ({ ...s, unit: e.target.value }))} placeholder="page / photo / stamp" />
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={save}>{editing ? 'Save Changes' : 'Create Service'}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
