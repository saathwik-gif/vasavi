import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Check, Upload, X, FileText, ChevronRight, ChevronLeft, ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_SERVICES, MOCK_COUPONS } from '@/data/mockData';
import { formatCurrency, calcPrice } from '@/lib/utils';
import type { Service, ServiceVariant } from '@/types';

const STEPS = ['Select Service', 'Upload Files', 'Print Settings', 'Review & Confirm'];
const CATEGORY_LABELS: Record<string, string> = { printing: '🖨️ Printing', stamps: '🔖 Stamps', binding: '📚 Binding', identity: '💳 Identity', design: '🎨 Design' };
const PAPER_SIZES = ['A4', 'A3', 'Letter', 'Legal', 'A5'];
const BINDING_OPTIONS = ['None', 'Spiral Binding', 'Perfect Binding', 'Saddle Stitch'];

export default function NewOrderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [settings, setSettings] = useState({ copies: 1, paperSize: 'A4', color: 'bw' as 'bw' | 'color', sides: 'single' as 'single' | 'double', binding: 'None', lamination: false, notes: '' });
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof MOCK_COUPONS[0] | null>(null);
  const [placing, setPlacing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: (f) => setFiles(prev => [...prev, ...f]), accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] } });

  const unitPrice = selectedVariant ? calcPrice(selectedVariant.basePrice, settings.copies, selectedVariant.pricingTiers) : 0;
  const discount = appliedCoupon ? (appliedCoupon.type === 'percentage' ? unitPrice * appliedCoupon.value / 100 : appliedCoupon.value) : 0;
  const tax = (unitPrice - discount) * 0.18;
  const total = unitPrice - discount + tax;

  const applyCoupon = () => {
    const c = MOCK_COUPONS.find(c => c.code === coupon.toUpperCase() && c.isActive);
    if (!c) { toast.error('Invalid or expired coupon'); return; }
    if (unitPrice < c.minOrderAmount) { toast.error(`Min order amount: ${formatCurrency(c.minOrderAmount)}`); return; }
    setAppliedCoupon(c); toast.success(`Coupon applied! ${c.type === 'percentage' ? c.value + '%' : formatCurrency(c.value)} off`);
  };

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlacing(false);
    toast.success('Order placed successfully! 🎉');
    navigate('/customer/orders');
  };

  const canNext = () => {
    if (step === 0) return selectedService && selectedVariant;
    if (step === 1) return true; // files optional for some services
    return true;
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">New Order</h1>
        <p className="page-subtitle">Place a print order in just a few steps</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <div className={`step-indicator ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: i === step ? 'var(--color-text)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? 'var(--color-primary)' : 'var(--color-border)', margin: '0 0.75rem', transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

          {/* Step 0: Select Service */}
          {step === 0 && (
            <div>
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                const catServices = MOCK_SERVICES.filter(s => s.category === cat && s.isActive);
                if (!catServices.length) return null;
                return (
                  <div key={cat} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{label}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                      {catServices.map(svc => (
                        <button key={svc.id} type="button" onClick={() => { setSelectedService(svc); setSelectedVariant(null); }}
                          style={{ background: selectedService?.id === svc.id ? 'rgba(99,102,241,0.15)' : 'var(--color-surface-3)', border: `1px solid ${selectedService?.id === svc.id ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{svc.icon}</div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{svc.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>From {formatCurrency(svc.variants[0]?.basePrice)}/{svc.variants[0]?.unit}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {selectedService && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Select Variant — {selectedService.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedService.variants.map(v => (
                      <label key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: selectedVariant?.id === v.id ? 'rgba(99,102,241,0.1)' : 'var(--color-surface-3)', border: `1px solid ${selectedVariant?.id === v.id ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input type="radio" name="variant" checked={selectedVariant?.id === v.id} onChange={() => setSelectedVariant(v)} style={{ accentColor: 'var(--color-primary)' }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{v.name}</div>
                            {v.description && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{v.description}</div>}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{formatCurrency(v.basePrice)}/{v.unit}</div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Step 1: Upload Files */}
          {step === 1 && (
            <div>
              <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <Upload size={32} style={{ margin: '0 auto 1rem', color: 'var(--color-primary-light)', display: 'block' }} />
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{isDragActive ? 'Drop files here' : 'Drag & drop files here'}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>or click to browse — PDF, JPG, PNG supported</p>
              </div>
              {files.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--color-surface-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                      <FileText size={16} color="var(--color-primary-light)" />
                      <span style={{ fontSize: '0.875rem', flex: 1 }}>{f.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{(f.size / 1024).toFixed(0)} KB</span>
                      <button className="btn btn-ghost btn-icon" onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ width: 28, height: 28 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {files.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginTop: '0.75rem' }}>
                  Some services don't require a file upload. You can continue without uploading.
                </p>
              )}
            </div>
          )}

          {/* Step 2: Print Settings */}
          {step === 2 && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '-0.5rem' }}>Configure Print Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Number of Copies</label>
                  <input type="number" min={1} max={1000} value={settings.copies} onChange={e => setSettings(s => ({ ...s, copies: +e.target.value }))} className="input" />
                </div>
                <div>
                  <label className="label">Paper Size</label>
                  <select className="input" value={settings.paperSize} onChange={e => setSettings(s => ({ ...s, paperSize: e.target.value }))}>
                    {PAPER_SIZES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Color Mode</label>
                  <select className="input" value={settings.color} onChange={e => setSettings(s => ({ ...s, color: e.target.value as 'bw' | 'color' }))}>
                    <option value="bw">Black & White</option>
                    <option value="color">Full Color</option>
                  </select>
                </div>
                <div>
                  <label className="label">Print Sides</label>
                  <select className="input" value={settings.sides} onChange={e => setSettings(s => ({ ...s, sides: e.target.value as 'single' | 'double' }))}>
                    <option value="single">Single Sided</option>
                    <option value="double">Double Sided</option>
                  </select>
                </div>
                <div>
                  <label className="label">Binding</label>
                  <select className="input" value={settings.binding} onChange={e => setSettings(s => ({ ...s, binding: e.target.value }))}>
                    {BINDING_OPTIONS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
                  <input type="checkbox" id="lam" checked={settings.lamination} onChange={e => setSettings(s => ({ ...s, lamination: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--color-primary)' }} />
                  <label htmlFor="lam" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Add Lamination</label>
                </div>
              </div>
              <div>
                <label className="label">Special Instructions (optional)</label>
                <textarea value={settings.notes} onChange={e => setSettings(s => ({ ...s, notes: e.target.value }))} className="input" rows={3} placeholder="Any special requirements..." style={{ resize: 'vertical' }} />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { label: 'Service', value: selectedService?.name },
                    { label: 'Variant', value: selectedVariant?.name },
                    { label: 'Copies', value: settings.copies },
                    { label: 'Paper Size', value: settings.paperSize },
                    { label: 'Color', value: settings.color === 'bw' ? 'Black & White' : 'Full Color' },
                    { label: 'Sides', value: settings.sides === 'single' ? 'Single Sided' : 'Double Sided' },
                    { label: 'Binding', value: settings.binding },
                    { label: 'Lamination', value: settings.lamination ? 'Yes' : 'No' },
                    { label: 'Files', value: files.length > 0 ? `${files.length} file(s)` : 'No file uploaded' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{row.label}</span>
                      <span style={{ fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tag size={16} /> Apply Coupon</h3>
                {appliedCoupon ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>{appliedCoupon.code} applied!</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => setAppliedCoupon(null)}><X size={14} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input className="input" placeholder="Enter coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyCoupon()} />
                    <button className="btn btn-secondary" onClick={applyCoupon}>Apply</button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Price Breakdown</h3>
                {[
                  { label: 'Subtotal', value: formatCurrency(unitPrice) },
                  { label: 'Discount', value: `-${formatCurrency(discount)}`, color: '#10b981' },
                  { label: 'GST (18%)', value: formatCurrency(tax) },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{r.label}</span>
                    <span style={{ color: r.color }}>{r.value}</span>
                  </div>
                ))}
                <hr className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span className="gradient-text">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button className="btn btn-secondary" onClick={() => step === 0 ? navigate('/customer') : setStep(s => s - 1)}>
          <ChevronLeft size={16} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button className="btn btn-primary" disabled={placing} onClick={placeOrder} style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <ShoppingCart size={16} /> {placing ? 'Placing order...' : 'Place Order'}
          </button>
        )}
      </div>
    </div>
  );
}
