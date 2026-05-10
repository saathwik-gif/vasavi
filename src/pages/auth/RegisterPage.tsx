import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Printer, User, Mail, Phone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9_]+$/, 'Only lowercase, numbers, underscores'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone required'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    // Auto-login as customer demo after register
    await login('customer@printeasy.com', 'password123');
    setLoading(false);
    toast.success('Account created! Welcome to PrintEasy 🎉');
    navigate('/customer');
  };

  const renderField = (label: string, name: keyof FormData, type = 'text', placeholder?: string, Icon?: any, toggle?: boolean) => (
    <div key={name}>
      <label className="label">{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />}
        <input {...register(name)} type={toggle ? (showPw ? 'text' : 'password') : type}
          className={`input ${errors[name] ? 'input-error' : ''}`}
          style={{ paddingLeft: Icon ? '2.25rem' : '1rem', paddingRight: toggle ? '2.75rem' : '1rem' }}
          placeholder={placeholder}
        />
        {toggle && (
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer' }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {errors[name] && <p className="error-msg">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-surface)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Printer size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Create account</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Join PrintEasy and start ordering prints</p>
        </div>

        <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {renderField('Full Name', 'name', 'text', 'Arjun Sharma', User)}
            {renderField('Email Address', 'email', 'email', 'you@example.com', Mail)}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {renderField('Username', 'username', 'text', 'arjun_s')}
              {renderField('Phone Number', 'phone', 'text', '9876543210', Phone)}
            </div>
            {renderField('Password', 'password', 'password', 'Min 8 characters', Lock, true)}
            {renderField('Confirm Password', 'confirmPassword', 'password', 'Repeat password', Lock, true)}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1.25rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
