import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, AlertTriangle, X } from 'lucide-react';
import { MOCK_INVENTORY } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import type { InventoryItem } from '@/types';

function StockBadge({ qty, threshold }: { qty: number; threshold: number }) {
  if (qty <= threshold) return <span className="status-pill badge-cancelled">⚠ Low Stock</span>;
  if (qty <= threshold * 2) return <span className="status-pill badge-pending">Medium</span>;
  return <span className="status-pill badge-active">Good</span>;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addQty, setAddQty] = useState(0);
  const [addForm, setAddForm] = useState({ name: '', category: '', unit: 'unit', quantity: 1, alertThreshold: 5 });

  const openAdd = (id: string) => { setEditingId(id); setAddQty(0); setShowModal(true); };

  const saveStock = () => {
    setInventory(prev => prev.map(i => i.id === editingId ? { ...i, quantity: i.quantity + addQty, lastUpdated: new Date().toISOString() } : i));
    toast.success(`Stock updated by +${addQty}`);
    setShowModal(false);
  };

  const lowCount = inventory.filter(i => i.quantity <= i.alertThreshold).length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">{inventory.length} items tracked</p>
        </div>
      </div>

      {lowCount > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="#ef4444" />
          <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>{lowCount} item{lowCount > 1 ? 's' : ''} below alert threshold!</span>
        </div>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr><th>Item</th><th>Category</th><th>Stock</th><th>Unit</th><th>Threshold</th><th>Status</th><th>Last Updated</th><th>Action</th></tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => (
              <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.category}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: item.quantity <= item.alertThreshold ? '#ef4444' : 'var(--color-text)' }}>{item.quantity}</span>
                    <div style={{ flex: 1, minWidth: 60 }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-fill" style={{ width: `${Math.min((item.quantity / (item.alertThreshold * 4)) * 100, 100)}%`, background: item.quantity <= item.alertThreshold ? '#ef4444' : item.quantity <= item.alertThreshold * 2 ? '#f59e0b' : 'linear-gradient(90deg,#6366f1,#06b6d4)' }} />
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.unit}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{item.alertThreshold}</td>
                <td><StockBadge qty={item.quantity} threshold={item.alertThreshold} /></td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{formatDate(item.lastUpdated)}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => openAdd(item.id)}>
                    <Plus size={12} /> Add Stock
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div className="modal" style={{ maxWidth: 380 }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Add Stock</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Adding stock to: <strong>{inventory.find(i => i.id === editingId)?.name}</strong>
              </p>
              <div>
                <label className="label">Quantity to Add</label>
                <input type="number" min={1} className="input" value={addQty} onChange={e => setAddQty(+e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveStock} disabled={addQty <= 0}>Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
