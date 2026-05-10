import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ClipboardList, Package, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useAuthStore } from '@/store';
import { MOCK_ORDERS } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatusClass, getStatusLabel } from '@/lib/utils';

export default function CustomerDashboard() {
  const user = useAuthStore(s => s.user);
  const navigate = useNavigate();
  const myOrders = MOCK_ORDERS.filter(o => o.customerId === 'u1').slice(0, 4);
  const totalSpent = myOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const activeOrders = myOrders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: '8rem', opacity: 0.06 }}>🖨️</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Ready to place your next print order?</p>
        <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => navigate('/customer/new-order')}>
          <PlusCircle size={16} /> New Order
        </button>
      </motion.div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Orders', value: myOrders.length, icon: <ClipboardList size={20} />, color: '#6366f1' },
          { label: 'Active Orders', value: activeOrders, icon: <Clock size={20} />, color: '#06b6d4' },
          { label: 'Total Spent', value: formatCurrency(totalSpent), icon: <TrendingUp size={20} />, color: '#10b981' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Orders</h2>
          <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/customer/orders')}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        {myOrders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <Package size={36} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <p>No orders yet. Place your first order!</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="table">
              <thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {myOrders.map(o => (
                  <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/customer/orders/${o.id}`)}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{o.orderNumber}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{o.items.map(i => i.serviceName).join(', ')}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(o.total)}</td>
                    <td><span className={`status-pill ${getStatusClass(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{formatDateTime(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
