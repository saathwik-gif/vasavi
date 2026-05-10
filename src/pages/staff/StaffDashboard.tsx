import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Printer, Clock, CheckCircle, Package, User, FileText } from 'lucide-react';
import { MOCK_ORDERS } from '@/data/mockData';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const COLUMNS: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'pending', label: 'Pending', color: '#f59e0b' },
  { status: 'confirmed', label: 'Confirmed', color: '#6366f1' },
  { status: 'printing', label: 'Printing', color: '#06b6d4' },
  { status: 'ready', label: 'Ready', color: '#10b981' },
];

const STATUS_FLOW: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed', confirmed: 'in_queue', in_queue: 'printing', printing: 'ready', ready: 'out_for_delivery',
};

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const advance = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const next = STATUS_FLOW[o.status];
      if (!next) return o;
      toast.success(`Order ${o.orderNumber} → ${getStatusLabel(next)}`);
      return { ...o, status: next, updatedAt: new Date().toISOString(), statusHistory: [...o.statusHistory, { status: next, timestamp: new Date().toISOString(), actor: 'Priya Reddy' }] };
    }));
  };

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'pending').length;
  const printing = orders.filter(o => o.status === 'printing').length;
  const ready = orders.filter(o => o.status === 'ready').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Print Queue Dashboard</h1>
        <p className="page-subtitle">Manage and advance print jobs in real-time</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Active', value: total, icon: <Package size={18} />, color: '#6366f1' },
          { label: 'Awaiting', value: pending, icon: <Clock size={18} />, color: '#f59e0b' },
          { label: 'Printing', value: printing, icon: <Printer size={18} />, color: '#06b6d4' },
          { label: 'Ready', value: ready, icon: <CheckCircle size={18} />, color: '#10b981' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: k.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Kanban board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', alignItems: 'start' }}>
        {COLUMNS.map(col => {
          const colOrders = orders.filter(o => o.status === col.status || (col.status === 'confirmed' && o.status === 'in_queue'));
          return (
            <div key={col.status}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{col.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-surface-3)', padding: '0.1rem 0.5rem', borderRadius: 999 }}>{colOrders.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colOrders.map(o => (
                  <motion.div key={o.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ background: 'var(--color-surface-2)', border: `1px solid var(--color-border)`, borderLeft: `3px solid ${col.color}`, borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>{o.orderNumber}</span>
                      {o.isWalkIn && <span style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '0.1rem 0.4rem', borderRadius: 4 }}>Walk-in</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem' }}>
                      <User size={12} /> {o.customerName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      {o.items.map(i => i.serviceName).join(', ')}
                    </div>
                    {o.items.some(i => i.fileName) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginBottom: '0.5rem' }}>
                        <FileText size={11} /> {o.items.find(i => i.fileName)?.fileName}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{formatCurrency(o.total)}</span>
                      {STATUS_FLOW[o.status] && (
                        <button className="btn btn-primary btn-sm" onClick={() => advance(o.id)} style={{ fontSize: '0.7rem', padding: '0.25rem 0.625rem' }}>
                          → {getStatusLabel(STATUS_FLOW[o.status]!)}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                {colOrders.length === 0 && (
                  <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Empty</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
