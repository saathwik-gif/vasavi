import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Layers, ClipboardList, PlusCircle } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const NAV = [
  { label: 'Queue Dashboard', icon: <LayoutDashboard size={16} />, to: '/staff' },
  { label: 'Print Queue', icon: <Layers size={16} />, to: '/staff/queue' },
  { label: 'Walk-in Order', icon: <PlusCircle size={16} />, to: '/staff/walkin' },
  { label: 'All Orders', icon: <ClipboardList size={16} />, to: '/staff/orders' },
];

export default function StaffLayout() {
  return <AppLayout navItems={NAV} accentColor="#06b6d4"><Outlet /></AppLayout>;
}
