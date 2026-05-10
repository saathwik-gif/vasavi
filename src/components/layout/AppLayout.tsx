import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, ChevronDown, Printer, Check } from 'lucide-react';
import { useAuthStore, useNotifStore } from '@/store';
import { getInitials, timeAgo } from '@/lib/utils';
import { toast } from 'sonner';

interface SidebarItem { label: string; icon: React.ReactNode; to: string; }

interface AppLayoutProps {
  children: React.ReactNode;
  navItems: SidebarItem[];
  accentColor?: string;
}

export default function AppLayout({ children, navItems, accentColor = '#6366f1' }: AppLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { notifications, markRead, markAllRead } = useNotifStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface)' }}>
      {/* Sidebar */}
      <nav className="sidebar" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden auto' }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${accentColor}, #06b6d4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Printer size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>PrintEasy</div>
              {user?.tenantName && <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: -1 }}>{user.tenantName}</div>}
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ padding: '0.75rem 0.75rem', flex: 1 }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to.split('/').length <= 2}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => isActive ? { borderLeftColor: accentColor, color: accentColor + 'dd' } : {}}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* User info */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="avatar" style={{ background: `linear-gradient(135deg, ${accentColor}, #06b6d4)` }}>
              {getInitials(user?.name ?? 'U')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout" style={{ flexShrink: 0 }}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 60, background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 1.5rem', gap: '0.75rem', position: 'sticky', top: 0, zIndex: 30 }}>
          {/* Notification bell */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }} style={{ position: 'relative' }}>
              <Bell size={18} />
              {unread > 0 && (
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid var(--color-surface-2)' }} />
              )}
            </button>

            <AnimatePresence>
              {showNotif && (
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', right: 0, top: '110%', width: 340, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 100 }}>
                  <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications {unread > 0 && <span style={{ color: '#ef4444' }}>({unread})</span>}</span>
                    <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={markAllRead}>Mark all read</button>
                  </div>
                  <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} onClick={() => markRead(n.id)} style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)', transition: 'background 0.15s' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', marginTop: 6, flexShrink: 0 }} />}
                          {n.read && <Check size={14} color="var(--color-text-subtle)" style={{ marginTop: 3, flexShrink: 0 }} />}
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{n.message}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost" onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.5rem' }}>
              <div className="avatar" style={{ width: 30, height: 30, fontSize: '0.7rem', background: `linear-gradient(135deg, ${accentColor}, #06b6d4)` }}>
                {getInitials(user?.name ?? 'U')}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', right: 0, top: '110%', width: 180, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 100 }}>
                  <div style={{ padding: '0.5rem' }}>
                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem' }} onClick={() => { setShowUserMenu(false); navigate('settings'); }}>Profile Settings</button>
                    <hr className="divider" style={{ margin: '0.25rem 0' }} />
                    <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.8rem' }} onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* Overlay to close panels */}
      {(showNotif || showUserMenu) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => { setShowNotif(false); setShowUserMenu(false); }} />
      )}
    </div>
  );
}
