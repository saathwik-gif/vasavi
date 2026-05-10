import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { MOCK_ORDERS } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatusClass, getStatusLabel } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | OrderStatus>('');

  const filtered = MOCK_ORDERS.filter(o =>
    (!statusFilter || o.status === statusFilter) &&
    (!search || o.orderNumber.includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase()))
  );

  const STATUSES: ('' | OrderStatus)[] = ['', 'pending', 'confirmed', 'printing', 'ready', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <p className="page-subtitle">{MOCK_ORDERS.length} total orders</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={String(s)} className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStatusFilter(s)}>
              {s === '' ? 'All' : getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Phone</th><th>Services</th><th>Total</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {filtered.map((o, i) => (
              <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <td style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{o.orderNumber}</td>
                <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{o.customerPhone}</td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{o.items.map(i => i.serviceName).join(', ')}</td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(o.total)}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 999, background: o.isWalkIn ? 'rgba(245,158,11,0.15)' : 'rgba(99,102,241,0.15)', color: o.isWalkIn ? '#f59e0b' : '#818cf8', fontWeight: 600 }}>
                    {o.isWalkIn ? 'Walk-in' : 'Online'}
                  </span>
                </td>
                <td><span className={`status-pill ${getStatusClass(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{formatDateTime(o.createdAt)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
