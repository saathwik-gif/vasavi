import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OrderStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function getStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    in_queue: 'badge-confirmed',
    printing: 'badge-printing',
    ready: 'badge-ready',
    out_for_delivery: 'badge-printing',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  };
  return map[status] ?? '';
}

export function getStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_queue: 'In Queue',
    printing: 'Printing',
    ready: 'Ready',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[status] ?? status;
}

export function calcPrice(basePrice: number, qty: number, tiers: { minQty: number; maxQty: number | null; pricePerUnit: number }[]): number {
  const tier = tiers.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
  return (tier?.pricePerUnit ?? basePrice) * qty;
}
