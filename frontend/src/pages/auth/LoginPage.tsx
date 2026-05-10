import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Printer, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import type { UserRole } from '@/types';

const schema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

const ROLE_REDIRECTS: Record<UserRole, string> = {
  customer: '/customer',
  staff: '/staff',
  shop_admin: '/admin',
  super_admin: '/super-admin',
};

const DEMO_CREDENTIALS = [
  { role: 'Customer', email: 'customer@printeasy.com', pw: 'password123' },
  { role: 'Staff', email: 'staff@printeasy.com', pw: 'password123' },
  { role: 'Shop Admin', email: 'admin@printeasy.com', pw: 'password123' },
  { role: 'Super Admin', email: 'super@printeasy.com', pw: 'password123' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await login(data.identifier, data.password);
    setLoading(false);
    if (!result.success) {
      toast.error(result.error ?? 'Login failed');
      return;
    }
    const user = useAuthStore.getState().user!;
    toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
    navigate(ROLE_REDIRECTS[user.role]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-surface)' }}>
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', maxWidth: 480 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Printer size={22} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>PrintEasy</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: -2 }}>Enterprise Printing Platform</div>
          </div>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Sign in to your PrintEasy account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label">Email or Username</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
              <input {...register('identifier')} className={`input ${errors.identifier ? 'input-error' : ''}`} style={{ paddingLeft: '2.25rem' }} placeholder="you@example.com or username" />
            </div>
            {errors.identifier && <p className="error-msg">{errors.identifier.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
              <input {...register('password')} type={showPw ? 'text' : 'password'} className={`input ${errors.password ? 'input-error' : ''}`} style={{ paddingLeft: '2.25rem', paddingRight: '2.75rem' }} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', textDecoration: 'none' }}>Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </p>

        {/* Demo credentials */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-surface-3)', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Accounts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DEMO_CREDENTIALS.map(c => (
              <button key={c.role} type="button" onClick={() => { setValue('identifier', c.email); setValue('password', c.pw); }} style={{ textAlign: 'left', background: 'var(--color-surface-4)', border: '1px solid var(--color-border)', borderRadius: 6, padding: '0.5rem 0.75rem', cursor: 'pointer', color: 'var(--color-text)', transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-light)' }}>{c.role}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>{c.email}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        className="hidden-mobile mesh-bg-animated"
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)' }} />

        <div style={{ textAlign: 'center', padding: '2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🖨️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            <span className="gradient-text">One Platform.</span>
            <br />Every Print Service.
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: 320 }}>
            Manage your entire printing business — orders, staff, inventory, and analytics — from a single powerful dashboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['1,240+ Orders', '387 Customers', '₹2.84L Revenue', '10 Services'].map(s => (
              <div key={s} className="glass-panel" style={{ padding: '0.6rem 1.25rem', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600 }}>{s}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
