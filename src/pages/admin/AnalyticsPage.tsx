import { motion } from 'framer-motion';
import { MOCK_ANALYTICS } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="card" style={{ padding: '1.5rem' }}>
    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>{title}</h3>
    {children}
  </div>
);

const TooltipBox = ({ active, payload, label }: any) => active && payload?.length ? (
  <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem' }}>
    <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
    {payload.map((p: any) => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.name.includes('evenue') ? formatCurrency(p.value) : p.value}</p>)}
  </div>
) : null;

export default function AnalyticsPage() {
  const a = MOCK_ANALYTICS;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics & Reports</h1>
        <p className="page-subtitle">Your business performance overview</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(a.totalRevenue), change: a.revenueGrowth, icon: <TrendingUp size={20} />, color: '#6366f1' },
          { label: 'Total Orders', value: a.totalOrders.toLocaleString(), change: a.ordersGrowth, icon: <ShoppingBag size={20} />, color: '#06b6d4' },
          { label: 'Total Customers', value: a.totalCustomers.toLocaleString(), change: a.customersGrowth, icon: <Users size={20} />, color: '#10b981' },
          { label: 'Avg Order Value', value: formatCurrency(a.avgOrderValue), change: 5.2, icon: <TrendingUp size={20} />, color: '#f59e0b' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: k.color }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#10b981' }}>
              <ArrowUpRight size={12} /> +{k.change}% vs last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue + Orders Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <ChartCard title="Revenue & Orders Trend (2025)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={a.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
              <YAxis yAxisId="ord" orientation="right" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipBox />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.8rem' }} />
              <Line yAxisId="rev" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Revenue" />
              <Line yAxisId="ord" type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={2} dot={false} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Order Status Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={a.orderStatusDist} dataKey="count" nameKey="status" cx="50%" cy="45%" outerRadius={90} innerRadius={55} paddingAngle={3}>
                {a.orderStatusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Orders']} contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.78rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Service popularity */}
      <ChartCard title="Service Popularity — Orders by Service">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={a.servicePopularity}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipBox />} />
            <Bar dataKey="orders" name="Orders" radius={[4, 4, 0, 0]}>
              {a.servicePopularity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
