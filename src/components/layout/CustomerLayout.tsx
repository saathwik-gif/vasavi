import { Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ClipboardList, User } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const NAV = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/customer' },
  { label: 'New Order', icon: <PlusCircle size={16} />, to: '/customer/new-order' },
  { label: 'My Orders', icon: <ClipboardList size={16} />, to: '/customer/orders' },
  { label: 'Profile', icon: <User size={16} />, to: '/customer/settings' },
];

export default function CustomerLayout() {
  return <AppLayout navItems={NAV} accentColor="#6366f1"><Outlet /></AppLayout>;
}
