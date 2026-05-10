import type { User, Order, Service, Staff, InventoryItem, Coupon, Notification, Tenant, Analytics } from '@/types';

// ─── Mock Users ─────────────────────────────────────────────────
export const MOCK_USERS: Record<string, User & { password: string }> = {
  'customer@printeasy.com': { id: 'u1', name: 'Arjun Sharma', email: 'customer@printeasy.com', username: 'arjun_s', phone: '9876543210', role: 'customer', tenantId: 't1', tenantName: 'PrintEasy Hyderabad', password: 'password123', createdAt: '2025-01-10T10:00:00Z' },
  'staff@printeasy.com': { id: 'u2', name: 'Priya Reddy', email: 'staff@printeasy.com', username: 'priya_r', phone: '9876543211', role: 'staff', tenantId: 't1', tenantName: 'PrintEasy Hyderabad', password: 'password123', createdAt: '2025-02-01T10:00:00Z' },
  'admin@printeasy.com': { id: 'u3', name: 'Ravi Kumar', email: 'admin@printeasy.com', username: 'ravi_k', phone: '9876543212', role: 'shop_admin', tenantId: 't1', tenantName: 'PrintEasy Hyderabad', password: 'password123', createdAt: '2024-12-01T10:00:00Z' },
  'super@printeasy.com': { id: 'u4', name: 'Vasavi Singh', email: 'super@printeasy.com', username: 'vasavi_s', phone: '9876543213', role: 'super_admin', password: 'password123', createdAt: '2024-11-01T10:00:00Z' },
};

// ─── Mock Services ───────────────────────────────────────────────
export const MOCK_SERVICES: Service[] = [
  { id: 's1', tenantId: 't1', category: 'printing', name: 'B&W Printing', description: 'Standard black & white document printing', icon: '🖨️', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv1', name: 'A4 Single Side', basePrice: 1, unit: 'page', pricingTiers: [{ minQty: 1, maxQty: 50, pricePerUnit: 1 }, { minQty: 51, maxQty: null, pricePerUnit: 0.75 }] }, { id: 'sv2', name: 'A4 Double Side', basePrice: 1.5, unit: 'page', pricingTiers: [{ minQty: 1, maxQty: 50, pricePerUnit: 1.5 }, { minQty: 51, maxQty: null, pricePerUnit: 1.2 }] }] },
  { id: 's2', tenantId: 't1', category: 'printing', name: 'Color Printing', description: 'Vibrant full-color document printing', icon: '🎨', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv3', name: 'A4 Color', basePrice: 8, unit: 'page', pricingTiers: [{ minQty: 1, maxQty: 20, pricePerUnit: 8 }, { minQty: 21, maxQty: null, pricePerUnit: 6 }] }] },
  { id: 's3', tenantId: 't1', category: 'printing', name: 'Photo Printing', description: 'High-quality glossy photo prints', icon: '📸', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv4', name: '4x6 inch', basePrice: 15, unit: 'photo', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 15 }] }, { id: 'sv5', name: '5x7 inch', basePrice: 25, unit: 'photo', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 25 }] }] },
  { id: 's4', tenantId: 't1', category: 'printing', name: 'Flex Printing', description: 'Large format flex & banner printing', icon: '📋', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv6', name: 'Standard Flex', basePrice: 25, unit: 'sq.ft', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 25 }] }] },
  { id: 's5', tenantId: 't1', category: 'printing', name: 'Visiting Cards', description: 'Premium visiting cards — matte or glossy', icon: '💳', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv7', name: '100 cards', basePrice: 250, unit: 'set', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 250 }] }] },
  { id: 's6', tenantId: 't1', category: 'stamps', name: 'Rubber Stamps', description: 'Custom rubber stamps for business use', icon: '🔖', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv8', name: 'Small (up to 3cm)', basePrice: 120, unit: 'stamp', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 120 }] }, { id: 'sv9', name: 'Large (3-7cm)', basePrice: 200, unit: 'stamp', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 200 }] }] },
  { id: 's7', tenantId: 't1', category: 'binding', name: 'Spiral Binding', description: 'Durable spiral binding for documents', icon: '📚', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv10', name: 'Up to 100 pages', basePrice: 30, unit: 'document', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 30 }] }] },
  { id: 's8', tenantId: 't1', category: 'binding', name: 'Lamination', description: 'Protect your prints with quality lamination', icon: '✨', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv11', name: 'A4 Matte', basePrice: 20, unit: 'page', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 20 }] }, { id: 'sv12', name: 'A4 Glossy', basePrice: 25, unit: 'page', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 25 }] }] },
  { id: 's9', tenantId: 't1', category: 'design', name: 'Logo Design', description: 'Professional logo design service', icon: '🎯', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv13', name: 'Basic (3 concepts)', basePrice: 999, unit: 'project', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 999 }] }] },
  { id: 's10', tenantId: 't1', category: 'identity', name: 'ID Cards', description: 'PVC ID cards with photo printing', icon: '🪪', isActive: true, createdAt: '2025-01-01T00:00:00Z', variants: [{ id: 'sv14', name: 'Single sided', basePrice: 80, unit: 'card', pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 80 }] }] },
];

// ─── Mock Orders ─────────────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  { id: 'o1', orderNumber: 'PE-2025-001', tenantId: 't1', customerId: 'u1', customerName: 'Arjun Sharma', customerPhone: '9876543210', status: 'printing', items: [{ id: 'oi1', serviceId: 's1', serviceName: 'B&W Printing', variantId: 'sv1', variantName: 'A4 Single Side', quantity: 50, unitPrice: 1, totalPrice: 50, printSettings: { copies: 1, paperSize: 'A4', color: 'bw', sides: 'single' }, fileName: 'thesis_draft.pdf' }], subtotal: 50, discount: 0, tax: 9, total: 59, isWalkIn: false, createdAt: '2025-05-09T10:00:00Z', updatedAt: '2025-05-09T11:30:00Z', statusHistory: [{ status: 'pending', timestamp: '2025-05-09T10:00:00Z', actor: 'Arjun Sharma' }, { status: 'confirmed', timestamp: '2025-05-09T10:15:00Z', actor: 'Priya Reddy' }, { status: 'in_queue', timestamp: '2025-05-09T10:30:00Z', actor: 'Priya Reddy' }, { status: 'printing', timestamp: '2025-05-09T11:30:00Z', actor: 'Priya Reddy' }] },
  { id: 'o2', orderNumber: 'PE-2025-002', tenantId: 't1', customerId: 'u1', customerName: 'Arjun Sharma', customerPhone: '9876543210', status: 'delivered', items: [{ id: 'oi2', serviceId: 's2', serviceName: 'Color Printing', variantId: 'sv3', variantName: 'A4 Color', quantity: 10, unitPrice: 8, totalPrice: 80, fileName: 'presentation.pdf' }], subtotal: 80, discount: 10, tax: 12.6, total: 82.6, couponCode: 'FIRST10', isWalkIn: false, createdAt: '2025-05-07T14:00:00Z', updatedAt: '2025-05-08T16:00:00Z', statusHistory: [{ status: 'pending', timestamp: '2025-05-07T14:00:00Z', actor: 'Arjun Sharma' }, { status: 'confirmed', timestamp: '2025-05-07T14:10:00Z', actor: 'Priya Reddy' }, { status: 'delivered', timestamp: '2025-05-08T16:00:00Z', actor: 'System' }] },
  { id: 'o3', orderNumber: 'PE-2025-003', tenantId: 't1', customerId: 'u5', customerName: 'Meena Iyer', customerPhone: '9876543220', status: 'pending', items: [{ id: 'oi3', serviceId: 's7', serviceName: 'Spiral Binding', variantId: 'sv10', variantName: 'Up to 100 pages', quantity: 3, unitPrice: 30, totalPrice: 90 }], subtotal: 90, discount: 0, tax: 16.2, total: 106.2, isWalkIn: true, createdAt: '2025-05-10T09:00:00Z', updatedAt: '2025-05-10T09:00:00Z', statusHistory: [{ status: 'pending', timestamp: '2025-05-10T09:00:00Z', actor: 'Walk-in' }] },
  { id: 'o4', orderNumber: 'PE-2025-004', tenantId: 't1', customerId: 'u6', customerName: 'Kiran Babu', customerPhone: '9876543221', status: 'confirmed', items: [{ id: 'oi4', serviceId: 's5', serviceName: 'Visiting Cards', variantId: 'sv7', variantName: '100 cards', quantity: 2, unitPrice: 250, totalPrice: 500 }], subtotal: 500, discount: 0, tax: 90, total: 590, isWalkIn: false, createdAt: '2025-05-10T10:00:00Z', updatedAt: '2025-05-10T10:10:00Z', statusHistory: [{ status: 'pending', timestamp: '2025-05-10T10:00:00Z', actor: 'Kiran Babu' }, { status: 'confirmed', timestamp: '2025-05-10T10:10:00Z', actor: 'Priya Reddy' }] },
  { id: 'o5', orderNumber: 'PE-2025-005', tenantId: 't1', customerId: 'u7', customerName: 'Sunita Devi', customerPhone: '9876543222', status: 'ready', items: [{ id: 'oi5', serviceId: 's3', serviceName: 'Photo Printing', variantId: 'sv4', variantName: '4x6 inch', quantity: 20, unitPrice: 15, totalPrice: 300 }], subtotal: 300, discount: 0, tax: 54, total: 354, isWalkIn: false, createdAt: '2025-05-09T16:00:00Z', updatedAt: '2025-05-10T08:00:00Z', statusHistory: [{ status: 'pending', timestamp: '2025-05-09T16:00:00Z', actor: 'Sunita Devi' }, { status: 'confirmed', timestamp: '2025-05-09T16:10:00Z', actor: 'Priya Reddy' }, { status: 'printing', timestamp: '2025-05-09T17:00:00Z', actor: 'Priya Reddy' }, { status: 'ready', timestamp: '2025-05-10T08:00:00Z', actor: 'Priya Reddy' }] },
];

// ─── Mock Staff ──────────────────────────────────────────────────
export const MOCK_STAFF: Staff[] = [
  { id: 'u2', name: 'Priya Reddy', email: 'staff@printeasy.com', phone: '9876543211', role: 'operator', status: 'active', joinedAt: '2025-02-01T00:00:00Z', ordersHandled: 142 },
  { id: 'u8', name: 'Rahul Nair', email: 'rahul@printeasy.com', phone: '9876543214', role: 'manager', status: 'active', joinedAt: '2025-01-15T00:00:00Z', ordersHandled: 89 },
  { id: 'u9', name: 'Deepa Singh', email: 'deepa@printeasy.com', phone: '9876543215', role: 'operator', status: 'inactive', joinedAt: '2025-03-01T00:00:00Z', ordersHandled: 34 },
];

// ─── Mock Inventory ───────────────────────────────────────────────
export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'A4 Paper (80gsm)', category: 'Paper', unit: 'ream', quantity: 45, alertThreshold: 10, lastUpdated: '2025-05-09T10:00:00Z' },
  { id: 'inv2', name: 'A3 Paper (90gsm)', category: 'Paper', unit: 'ream', quantity: 8, alertThreshold: 5, lastUpdated: '2025-05-08T14:00:00Z' },
  { id: 'inv3', name: 'Black Ink Cartridge', category: 'Ink', unit: 'unit', quantity: 3, alertThreshold: 5, lastUpdated: '2025-05-07T09:00:00Z' },
  { id: 'inv4', name: 'Color Ink Set (CMYK)', category: 'Ink', unit: 'set', quantity: 12, alertThreshold: 3, lastUpdated: '2025-05-06T11:00:00Z' },
  { id: 'inv5', name: 'Spiral Coils (Assorted)', category: 'Binding', unit: 'pack', quantity: 25, alertThreshold: 5, lastUpdated: '2025-05-05T15:00:00Z' },
  { id: 'inv6', name: 'Lamination Rolls (A4)', category: 'Finishing', unit: 'roll', quantity: 2, alertThreshold: 3, lastUpdated: '2025-05-04T10:00:00Z' },
  { id: 'inv7', name: 'Glossy Photo Paper', category: 'Paper', unit: 'pack', quantity: 18, alertThreshold: 5, lastUpdated: '2025-05-03T09:00:00Z' },
];

// ─── Mock Coupons ─────────────────────────────────────────────────
export const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', code: 'FIRST10', type: 'percentage', value: 10, usageLimit: 100, usedCount: 34, minOrderAmount: 100, expiresAt: '2025-12-31T23:59:59Z', isActive: true },
  { id: 'c2', code: 'FLAT50', type: 'fixed', value: 50, usageLimit: 50, usedCount: 50, minOrderAmount: 500, expiresAt: '2025-06-30T23:59:59Z', isActive: false },
  { id: 'c3', code: 'SUMMER20', type: 'percentage', value: 20, usageLimit: 200, usedCount: 67, minOrderAmount: 200, expiresAt: '2025-08-31T23:59:59Z', isActive: true },
];

// ─── Mock Notifications ──────────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'order', title: 'Order Ready', message: 'Your order PE-2025-005 is ready for pickup.', read: false, createdAt: '2025-05-10T08:00:00Z' },
  { id: 'n2', type: 'order', title: 'Order Confirmed', message: 'Order PE-2025-001 has been confirmed and is in queue.', read: false, createdAt: '2025-05-09T10:15:00Z' },
  { id: 'n3', type: 'stock', title: 'Low Stock Alert', message: 'Black Ink Cartridge is running low (3 units remaining).', read: true, createdAt: '2025-05-09T09:00:00Z' },
  { id: 'n4', type: 'system', title: 'Welcome to PrintEasy', message: 'Your account has been set up successfully. Start placing orders!', read: true, createdAt: '2025-05-01T10:00:00Z' },
];

// ─── Mock Tenants ─────────────────────────────────────────────────
export const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'PrintEasy Hyderabad', slug: 'pe-hyd', ownerName: 'Ravi Kumar', email: 'admin@printeasy.com', phone: '9876543212', address: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', plan: 'professional', status: 'active', revenue: 284500, ordersCount: 1240, createdAt: '2024-12-01T00:00:00Z' },
  { id: 't2', name: 'QuickPrint Bangalore', slug: 'qp-blr', ownerName: 'Anita Rao', email: 'anita@quickprint.com', phone: '9876543230', address: 'Koramangala', city: 'Bangalore', state: 'Karnataka', plan: 'starter', status: 'active', revenue: 98200, ordersCount: 430, createdAt: '2025-01-15T00:00:00Z' },
  { id: 't3', name: 'PrintHub Mumbai', slug: 'ph-mum', ownerName: 'Suresh Patel', email: 'suresh@printhub.com', phone: '9876543240', address: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', plan: 'enterprise', status: 'active', revenue: 520000, ordersCount: 2100, createdAt: '2024-10-01T00:00:00Z' },
  { id: 't4', name: 'FastPrint Delhi', slug: 'fp-del', ownerName: 'Kavya Mehta', email: 'kavya@fastprint.com', phone: '9876543250', address: 'Connaught Place', city: 'Delhi', state: 'Delhi', plan: 'free', status: 'pending', revenue: 0, ordersCount: 0, createdAt: '2025-05-09T00:00:00Z' },
];

// ─── Mock Analytics ───────────────────────────────────────────────
export const MOCK_ANALYTICS: Analytics = {
  totalRevenue: 284500,
  totalOrders: 1240,
  totalCustomers: 387,
  avgOrderValue: 229.4,
  revenueGrowth: 18.4,
  ordersGrowth: 12.1,
  customersGrowth: 8.7,
  revenueData: [
    { date: 'Jan', revenue: 18000, orders: 80 },
    { date: 'Feb', revenue: 22000, orders: 95 },
    { date: 'Mar', revenue: 19500, orders: 88 },
    { date: 'Apr', revenue: 28000, orders: 120 },
    { date: 'May', revenue: 34000, orders: 148 },
    { date: 'Jun', revenue: 29000, orders: 130 },
    { date: 'Jul', revenue: 38000, orders: 162 },
    { date: 'Aug', revenue: 42000, orders: 178 },
    { date: 'Sep', revenue: 35000, orders: 150 },
    { date: 'Oct', revenue: 41000, orders: 170 },
    { date: 'Nov', revenue: 39000, orders: 165 },
    { date: 'Dec', revenue: 45000, orders: 190 },
  ],
  servicePopularity: [
    { name: 'B&W Printing', orders: 480, revenue: 48000 },
    { name: 'Color Printing', orders: 210, revenue: 67200 },
    { name: 'Photo Printing', orders: 145, revenue: 43500 },
    { name: 'Visiting Cards', orders: 98, revenue: 49000 },
    { name: 'Spiral Binding', orders: 130, revenue: 13000 },
    { name: 'Lamination', orders: 87, revenue: 8700 },
    { name: 'Rubber Stamps', orders: 56, revenue: 11200 },
    { name: 'Logo Design', orders: 34, revenue: 33966 },
  ],
  orderStatusDist: [
    { status: 'Delivered', count: 980 },
    { status: 'Printing', count: 85 },
    { status: 'Ready', count: 62 },
    { status: 'Confirmed', count: 74 },
    { status: 'Pending', count: 39 },
  ],
};
