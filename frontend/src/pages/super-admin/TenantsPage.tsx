import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle, Building2 } from 'lucide-react';
import { MOCK_TENANTS } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Tenant, TenantStatus } from '@/types';

const STATUS_COLOR: Record<TenantStatus, string> = { pending: '#f59e0b', active: '#10b981', suspended: '#ef4444', banned: '#64748b' };
const PLAN_COLOR: Record<string, string> = { free: '#64748b', starter: '#06b6d4', professional: '#6366f1', enterprise: '#f59e0b' };

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [filter, setFilter] = useState<TenantStatus | ''>('');

  const updateStatus = (id: string, status: TenantStatus) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast.success(`Tenant status updated to ${status}`);
  };

  const filtered = tenants.filter(t => !filter || t.status === filter);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Tenant Management</h1>
          <p className="page-subtitle">{tenants.length} registered shops</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['', 'pending', 'active', 'suspended', 'banned'] as const).map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${PLAN_COLOR[t.plan]}, #06b6d4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={22} color="white" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontWeight: 700 }}>{t.name}</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: 999, background: STATUS_COLOR[t.status] + '20', color: STATUS_COLOR[t.status], fontWeight: 700, textTransform: 'capitalize' }}>{t.status}</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: 999, background: PLAN_COLOR[t.plan] + '20', color: PLAN_COLOR[t.plan], fontWeight: 700, textTransform: 'capitalize' }}>{t.plan}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {t.ownerName} · {t.email} · {t.city}, {t.state}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(t.revenue)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.ordersCount} orders · Since {formatDate(t.createdAt)}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {t.status === 'pending' && (
                  <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }} onClick={() => updateStatus(t.id, 'active')}>
                    <CheckCircle size={13} /> Approve
                  </button>
                )}
                {t.status === 'active' && (
                  <button className="btn btn-sm btn-danger" onClick={() => updateStatus(t.id, 'suspended')}>
                    <AlertTriangle size={13} /> Suspend
                  </button>
                )}
                {t.status === 'suspended' && (
                  <button className="btn btn-sm" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }} onClick={() => updateStatus(t.id, 'active')}>
                    <CheckCircle size={13} /> Reinstate
                  </button>
                )}
                {t.status !== 'banned' && t.status !== 'pending' && (
                  <button className="btn btn-sm" style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b', border: '1px solid rgba(100,116,139,0.3)' }} onClick={() => updateStatus(t.id, 'banned')}>
                    <XCircle size={13} /> Ban
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
