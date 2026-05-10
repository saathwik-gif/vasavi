// ─── User & Auth ───────────────────────────────────────────────
export type UserRole = 'customer' | 'staff' | 'shop_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  tenantId?: string;
  tenantName?: string;
  createdAt: string;
}

// ─── Tenant ─────────────────────────────────────────────────────
export type TenantStatus = 'pending' | 'active' | 'suspended' | 'banned';
export type SaaSPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  plan: SaaSPlan;
  status: TenantStatus;
  revenue: number;
  ordersCount: number;
  createdAt: string;
}

// ─── Services ───────────────────────────────────────────────────
export type ServiceCategory =
  | 'printing'
  | 'stamps'
  | 'binding'
  | 'identity'
  | 'design';

export interface PricingTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

export interface ServiceVariant {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  unit: string;
  pricingTiers: PricingTier[];
}

export interface Service {
  id: string;
  tenantId: string;
  category: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  variants: ServiceVariant[];
  createdAt: string;
}

// ─── Orders ─────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_queue'
  | 'printing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface PrintSettings {
  copies: number;
  paperSize: string;
  color: 'bw' | 'color';
  sides: 'single' | 'double';
  binding?: string;
  lamination?: boolean;
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  printSettings?: PrintSettings;
  fileName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
  isWalkIn: boolean;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusEvent[];
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

// ─── Staff ──────────────────────────────────────────────────────
export type StaffRole = 'manager' | 'operator' | 'delivery';
export type StaffStatus = 'active' | 'inactive';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  avatar?: string;
  joinedAt: string;
  ordersHandled: number;
}

// ─── Inventory ──────────────────────────────────────────────────
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  alertThreshold: number;
  lastUpdated: string;
}

// ─── Coupon ─────────────────────────────────────────────────────
export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  usageLimit: number;
  usedCount: number;
  minOrderAmount: number;
  expiresAt: string;
  isActive: boolean;
}

// ─── Notifications ──────────────────────────────────────────────
export type NotifType = 'order' | 'stock' | 'payment' | 'system';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─── Analytics ──────────────────────────────────────────────────
export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

export interface ServicePopularity {
  name: string;
  orders: number;
  revenue: number;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  revenueData: RevenueData[];
  servicePopularity: ServicePopularity[];
  orderStatusDist: { status: string; count: number }[];
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
}
