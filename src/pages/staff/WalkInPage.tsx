import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { MOCK_SERVICES } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';

export default function WalkInPage() {
  const [form, setForm] = useState({ customerName: '', phone: '', serviceId: '', variantId: '', copies: 1, paperSize: 'A4', color: 'bw', notes: '', payment: 'cash' });
  const [saving, setSaving] = useState(false);

  const svc = MOCK_SERVICES.find(s => s.id === form.serviceId);
  const variant = svc?.variants.find(v => v.id === form.variantId);
  const subtotal = variant ? variant.basePrice * form.copies : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.serviceId || !form.variantId) { toast.error('Fill all required fields'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    toast.success(`Walk-in order created for ${form.customerName} — ${formatCurrency(total)}`);
    setForm({ customerName: '', phone: '', serviceId: '', variantId: '', copies: 1, paperSize: 'A4', color: 'bw', notes: '', payment: 'cash' });
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Walk-in Order</h1>
        <p className="page-subtitle">Create an instant order for a walk-in customer</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Customer info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Customer Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Customer Name *</label>
                <input className="input" value={form.customerName} onChange={e => setForm(s => ({ ...s, customerName: e.target.value }))} placeholder="Enter name" required />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input className="input" value={form.phone} onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} placeholder="9876543210" />
              </div>
            </div>
          </div>

          {/* Service */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Select Service *</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="label">Service</label>
                <select className="input" value={form.serviceId} onChange={e => setForm(s => ({ ...s, serviceId: e.target.value, variantId: '' }))}>
                  <option value="">-- Select service --</option>
                  {MOCK_SERVICES.filter(s => s.isActive).map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Variant</label>
                <select className="input" value={form.variantId} onChange={e => setForm(s => ({ ...s, variantId: e.target.value }))} disabled={!svc}>
                  <option value="">-- Select variant --</option>
                  {svc?.variants.map(v => <option key={v.id} value={v.id}>{v.name} — {formatCurrency(v.basePrice)}/{v.unit}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div>
                <label className="label">Copies</label>
                <input type="number" min={1} className="input" value={form.copies} onChange={e => setForm(s => ({ ...s, copies: +e.target.value }))} />
              </div>
              <div>
                <label className="label">Paper Size</label>
                <select className="input" value={form.paperSize} onChange={e => setForm(s => ({ ...s, paperSize: e.target.value }))}>
                  {['A4', 'A3', 'A5', 'Letter'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Color</label>
                <select className="input" value={form.color} onChange={e => setForm(s => ({ ...s, color: e.target.value }))}>
                  <option value="bw">B&W</option>
                  <option value="color">Color</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment & total */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Payment</h3>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {['cash', 'upi', 'card'].map(p => (
                <button key={p} type="button"
                  className={`btn ${form.payment === p ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setForm(s => ({ ...s, payment: p }))}>
                  {p === 'cash' ? '💵 Cash' : p === 'upi' ? '📱 UPI' : '💳 Card'}
                </button>
              ))}
            </div>
            {variant && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--color-surface-3)', borderRadius: 'var(--radius-sm)', padding: '1rem', border: '1px solid var(--color-border)' }}>
                {[{ label: 'Subtotal', val: formatCurrency(subtotal) }, { label: 'GST (18%)', val: formatCurrency(tax) }].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{r.label}</span>
                    <span>{r.val}</span>
                  </div>
                ))}
                <hr className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span className="gradient-text">{formatCurrency(total)}</span>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <label className="label">Notes (optional)</label>
            <textarea className="input" value={form.notes} onChange={e => setForm(s => ({ ...s, notes: e.target.value }))} placeholder="Special instructions..." rows={2} style={{ resize: 'vertical' }} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Creating order...' : '✓ Create Walk-in Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
