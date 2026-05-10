import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, RotateCcw } from 'lucide-react';
import { MOCK_ORDERS } from '@/data/mockData';
import { formatCurrency, formatDate, getStatusClass, getStatusLabel } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const STATUSES: { value: '' | OrderStatus; label: string }[] = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'printing', label: 'Printing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function CustomerOrdersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | OrderStatus>('');

  const myOrders = MOCK_ORDERS.filter(o => o.customerId === 'u1');
  const filtered = myOrders.filter(o =>
    (!statusFilter || o.status === statusFilter) &&
    (!search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.items.some(i => i.serviceName.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">{myOrders.length} total orders</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/customer/new-order')}>+ New Order</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s.value} className={`btn ${statusFilter === s.value ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setStatusFilter(s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
          <Filter size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <p>No orders match your filters</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((o, i) => (
            <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card" style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}
              onClick={() => navigate(`/customer/orders/${o.id}`)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{o.orderNumber}</span>
                    <span className={`status-pill ${getStatusClass(o.status)}`}>{getStatusLabel(o.status)}</span>
                    {o.isWalkIn && <span className="status-pill" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>Walk-in</span>}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                    {o.items.map(i => `${i.serviceName} ×${i.quantity}`).join(' · ')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{formatDate(o.createdAt)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{formatCurrency(o.total)}</div>
                  {o.discount > 0 && <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Saved {formatCurrency(o.discount)}</div>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/customer/orders/${o.id}`); }}>
                      <Eye size={13} /> View
                    </button>
                    {o.status === 'delivered' && (
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate('/customer/new-order'); }}>
                        <RotateCcw size={13} /> Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status timeline */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
                  {(['pending', 'confirmed', 'printing', 'ready', 'delivered'] as OrderStatus[]).map((s, idx, arr) => {
                    const isDone = o.statusHistory.some(h => h.status === s);
                    const isCurrent = o.status === s;
                    return (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', flex: idx < arr.length - 1 ? 1 : 'none' }}>
                        <div style={{ display: 'flex', flex: 'none', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: isDone ? (isCurrent ? 'var(--color-primary)' : 'var(--color-success)') : 'var(--color-border)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.6rem', color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-subtle)', whiteSpace: 'nowrap', fontWeight: isCurrent ? 700 : 400 }}>{getStatusLabel(s)}</span>
                        </div>
                        {idx < arr.length - 1 && <div style={{ flex: 1, height: 1, background: isDone ? 'var(--color-success)' : 'var(--color-border)', margin: '0 4px', marginTop: '-0.75rem', minWidth: 24 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
