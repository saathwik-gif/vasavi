import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowRight, AlertTriangle } from 'lucide-react';
import { MOCK_ANALYTICS, MOCK_ORDERS, MOCK_INVENTORY } from '@/data/mockData';
import { formatCurrency, formatDateTime, getStatusClass, getStatusLabel } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.75rem 1rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.8rem' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: '0.8rem', color: p.color }}>
            {p.name}: {p.name === 'revenue' ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const a = MOCK_ANALYTICS;
  const lowStock = MOCK_INVENTORY.filter(i => i.quantity <= i.alertThreshold);
  const recentOrders = MOCK_ORDERS.slice(0, 5);

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(a.totalRevenue), change: `+${a.revenueGrowth}%`, icon: <TrendingUp size={20} />, color: '#6366f1' },
    { label: 'Total Orders', value: a.totalOrders.toLocaleString(), change: `+${a.ordersGrowth}%`, icon: <ShoppingBag size={20} />, color: '#06b6d4' },
    { label: 'Customers', value: a.totalCustomers.toLocaleString(), change: `+${a.customersGrowth}%`, icon: <Users size={20} />, color: '#10b981' },
    { label: 'Avg Order Value', value: formatCurrency(a.avgOrderValue), change: '+5.2%', icon: <Package size={20} />, color: '#f59e0b' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shop Dashboard</h1>
        <p className="page-subtitle">Your print shop overview at a glance</p>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="#ef4444" />
          <span style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 600 }}>
            {lowStock.length} item{lowStock.length > 1 ? 's' : ''} running low: {lowStock.map(i => i.name).join(', ')}
          </span>
          <button className="btn btn-sm" style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }} onClick={() => navigate('/admin/inventory')}>
            View Inventory
          </button>
        </motion.div>
      )}

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#10b981' }}>
              <ArrowUpRight size={12} /> {k.change} this month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.9rem' }}>Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={a.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={false} name="revenue" />
              <Line type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} dot={false} name="orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.9rem' }}>Top Services</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={a.servicePopularity.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#6366f1" radius={[0, 4, 4, 0]} name="orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Recent Orders</h3>
          <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => navigate('/admin/orders')}>View all <ArrowRight size={14} /></button>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead><tr><th>Order</th><th>Customer</th><th>Service</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>{o.orderNumber}</td>
                  <td>{o.customerName}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{o.items[0]?.serviceName}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(o.total)}</td>
                  <td><span className={`status-pill ${getStatusClass(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDateTime(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
