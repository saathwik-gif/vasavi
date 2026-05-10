import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Auth
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Guards
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Public pages
import LandingPage from '@/pages/public/LandingPage';

// Layouts
import CustomerLayout from '@/components/layout/CustomerLayout';
import StaffLayout from '@/components/layout/StaffLayout';
import ShopAdminLayout from '@/components/layout/ShopAdminLayout';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

// Customer pages
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import NewOrderPage from '@/pages/customer/NewOrderPage';
import CustomerOrdersPage from '@/pages/customer/CustomerOrdersPage';

// Staff pages
import StaffDashboard from '@/pages/staff/StaffDashboard';
import WalkInPage from '@/pages/staff/WalkInPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ServicesPage from '@/pages/admin/ServicesPage';
import StaffManagementPage from '@/pages/admin/StaffManagementPage';
import InventoryPage from '@/pages/admin/InventoryPage';
import CouponsPage from '@/pages/admin/CouponsPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';

// Super admin pages
import SuperAdminDashboard from '@/pages/super-admin/SuperAdminDashboard';
import TenantsPage from '@/pages/super-admin/TenantsPage';

// Shared
import SettingsPage from '@/pages/shared/SettingsPage';

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/" element={<LandingPage />} />

          {/* Customer */}
          <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}>
            <Route index element={<CustomerDashboard />} />
            <Route path="new-order" element={<NewOrderPage />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Staff */}
          <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffLayout /></ProtectedRoute>}>
            <Route index element={<StaffDashboard />} />
            <Route path="queue" element={<StaffDashboard />} />
            <Route path="walkin" element={<WalkInPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Shop Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['shop_admin']}><ShopAdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="customers" element={<AdminOrdersPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="coupons" element={<CouponsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Super Admin */}
          <Route path="/super-admin" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminLayout /></ProtectedRoute>}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="plans" element={<SuperAdminDashboard />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="disputes" element={<TenantsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontFamily: 'var(--font-sans)' },
          duration: 3500,
        }}
        richColors
      />
    </QueryClientProvider>
  );
}
