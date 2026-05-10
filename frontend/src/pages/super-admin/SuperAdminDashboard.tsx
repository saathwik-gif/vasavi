import { motion } from 'framer-motion';
import { MOCK_TENANTS, MOCK_ANALYTICS } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { Building2, TrendingUp, ShoppingBag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const PLAN_COLORS: Record<string, string> = { free: '#64748b', starter: '#06b6d4', professional: '#6366f1', enterprise: '#f59e0b' };
const PLAN_PRICES: Record<string, number> = { free: 0, starter: 999, professional: 2999, enterprise: 7999 };

export default function SuperAdminDashboard() {
  const totalRevenue = MOCK_TENANTS.reduce((s, t) => s + t.revenue, 0);
  const totalOrders = MOCK_TENANTS.reduce((s, t) => s + t.ordersCount, 0);
  const mrr = MOCK_TENANTS.reduce((s, t) => s + PLAN_PRICES[t.plan], 0);
  const active = MOCK_TENANTS.filter(t => t.status === 'active').length;
  const pending = MOCK_TENANTS.filter(t => t.status === 'pending').length;

  const planDist = Object.entries(PLAN_PRICES).map(([plan, price]) => ({
    plan, count: MOCK_TENANTS.filter(t => t.plan === plan).length, mrr: MOCK_TENANTS.filter(t => t.plan === plan).length * price
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Platform Overview</h1>
        <p className="page-subtitle">PrintEasy SaaS — Admin Control Panel</p>
      </div>

      {pending > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={18} color="#f59e0b" />
          <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>{pending} shop{pending > 1 ? 's' : ''} awaiting approval</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Platform Revenue', value: formatCurrency(totalRevenue), icon: <TrendingUp size={20} />, color: '#6366f1' },
          { label: 'Monthly Recurring', value: formatCurrency(mrr), icon: <TrendingUp size={20} />, color: '#a855f7' },
          { label: 'Active Shops', value: active, icon: <Building2 size={20} />, color: '#06b6d4' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), icon: <ShoppingBag size={20} />, color: '#10b981' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Platform Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_ANALYTICS.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} />
              <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Tenants by Plan</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={planDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="plan" tick={{ fill: 'var(--color-text-muted)', fontSize: 11, textTransform: 'capitalize' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} />
              <Bar dataKey="count" name="Shops" radius={[4, 4, 0, 0]}>
                {planDist.map((p) => <Cell key={p.plan} fill={PLAN_COLORS[p.plan]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top shops */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem' }}>Top Performing Shops</h3>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="table">
            <thead><tr><th>Shop</th><th>Owner</th><th>City</th><th>Plan</th><th>Status</th><th>Revenue</th><th>Orders</th></tr></thead>
            <tbody>
              {MOCK_TENANTS.sort((a, b) => b.revenue - a.revenue).map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{t.ownerName}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t.city}</td>
                  <td><span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 999, background: PLAN_COLORS[t.plan] + '20', color: PLAN_COLORS[t.plan], fontWeight: 700, textTransform: 'capitalize' }}>{t.plan}</span></td>
                  <td><span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 999, background: t.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: t.status === 'active' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{t.status}</span></td>
                  <td style={{ fontWeight: 700 }}>{formatCurrency(t.revenue)}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{t.ordersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
