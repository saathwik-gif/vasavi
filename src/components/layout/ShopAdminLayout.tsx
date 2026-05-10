import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Layers, ClipboardList, Users, Package, Tag, BarChart2, Settings } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const NAV = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/admin' },
  { label: 'Orders', icon: <ClipboardList size={16} />, to: '/admin/orders' },
  { label: 'Services & Pricing', icon: <Layers size={16} />, to: '/admin/services' },
  { label: 'Staff', icon: <Users size={16} />, to: '/admin/staff' },
  { label: 'Customers', icon: <Users size={16} />, to: '/admin/customers' },
  { label: 'Inventory', icon: <Package size={16} />, to: '/admin/inventory' },
  { label: 'Coupons', icon: <Tag size={16} />, to: '/admin/coupons' },
  { label: 'Analytics', icon: <BarChart2 size={16} />, to: '/admin/analytics' },
  { label: 'Settings', icon: <Settings size={16} />, to: '/admin/settings' },
];

export default function ShopAdminLayout() {
  return <AppLayout navItems={NAV} accentColor="#f59e0b"><Outlet /></AppLayout>;
}
