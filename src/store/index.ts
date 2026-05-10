import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Notification } from '@/types';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from '@/data/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (identifier, password) => {
        await new Promise(r => setTimeout(r, 800)); // simulate API
        const found = Object.values(MOCK_USERS).find(
          u => (u.email === identifier || u.username === identifier) && u.password === password
        );
        if (!found) return { success: false, error: 'Invalid email/username or password' };
        const { password: _, ...user } = found;
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'printeasy-auth' }
  )
);

// ─── Notification Store ──────────────────────────────────────────
interface NotifState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt'>) => void;
}

export const useNotifStore = create<NotifState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  markRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  addNotification: (n) => set(s => ({
    notifications: [{ ...n, id: `n${Date.now()}`, createdAt: new Date().toISOString() }, ...s.notifications]
  })),
}));
