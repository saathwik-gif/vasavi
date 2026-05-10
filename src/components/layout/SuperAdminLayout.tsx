import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, CreditCard, BarChart2, ShieldAlert } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const NAV = [
  { label: 'Platform Overview', icon: <LayoutDashboard size={16} />, to: '/super-admin' },
  { label: 'Tenants', icon: <Building2 size={16} />, to: '/super-admin/tenants' },
  { label: 'SaaS Plans', icon: <CreditCard size={16} />, to: '/super-admin/plans' },
  { label: 'Analytics', icon: <BarChart2 size={16} />, to: '/super-admin/analytics' },
  { label: 'Disputes', icon: <ShieldAlert size={16} />, to: '/super-admin/disputes' },
];

export default function SuperAdminLayout() {
  return <AppLayout navItems={NAV} accentColor="#a855f7"><Outlet /></AppLayout>;
}
