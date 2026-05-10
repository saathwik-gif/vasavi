import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, Globe, BarChart3, Layers, Palette, Printer, Smartphone } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleCTA = () => {
    if (user) {
      const routes = { customer: '/customer', staff: '/staff', shop_admin: '/admin', super_admin: '/super-admin' };
      navigate(routes[user.role]);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="mesh-bg-animated" style={{ minHeight: '100vh', color: 'var(--color-text)', overflowX: 'hidden' }}>
      {/* Header */}
      <header className="glass-panel" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Printer size={18} />
          </div>
          PrintEasy
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <button className="btn btn-primary" onClick={handleCTA}>Go to Dashboard <ArrowRight size={16} /></button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => navigate('/login')}>Log In</button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ paddingTop: '10rem', paddingBottom: '6rem', px: '2rem', textAlign: 'center', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '0.375rem 1rem', borderRadius: 999, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-light)', marginBottom: '1.5rem' }}>
            <Zap size={14} /> PrintEasy 2.0 is here
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            The Operating System for <br />
            <span className="gradient-text">Modern Print Shops</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem' }}>
            Transform your print business with an enterprise-grade platform. Manage orders, inventory, staff, and customers—all from one beautiful dashboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary btn-lg" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }} onClick={handleCTA}>
              Start Free Trial <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>
              Book Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Product Showcase */}
      <section style={{ padding: '0 2rem 8rem', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="glass-panel" style={{ padding: '0.5rem', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" alt="Dashboard Preview" style={{ width: '100%', height: 'auto', borderRadius: 'calc(var(--radius-xl) - 0.5rem)', display: 'block', opacity: 0.85, mixBlendMode: 'luminosity' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-surface) 0%, transparent 40%)' }} />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Everything you need to scale</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Stop juggling spreadsheets. PrintEasy handles the heavy lifting.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: <Layers />, title: 'Smart Print Queue', desc: 'Kanban-style boards to manage walk-ins and online orders simultaneously.' },
            { icon: <Globe />, title: 'Multi-tenant SaaS', desc: 'Built for enterprise. Run multiple shop locations under one unified platform.' },
            { icon: <BarChart3 />, title: 'Advanced Analytics', desc: 'Real-time revenue tracking, service popularity, and conversion metrics.' },
            { icon: <Shield />, title: 'Role-based Access', desc: 'Granular permissions for Super Admins, Shop Managers, Staff, and Customers.' },
            { icon: <Palette />, title: 'Dynamic Services', desc: 'Create custom printing variants, pricing tiers, and file-upload workflows.' },
            { icon: <Smartphone />, title: 'Mobile Optimized', desc: 'Responsive dashboards so your team can manage the shop from anywhere.' },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="card glass-light" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-light)', marginBottom: '1.5rem' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '6rem 2rem', background: 'var(--color-surface-2)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>A seamless flow for <br /><span className="gradient-text">you and your customers</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2.5rem' }}>
              {[
                { step: '1', title: 'Customer Places Order', desc: 'Clients select services, upload files, and configure print settings via the self-serve portal.' },
                { step: '2', title: 'Staff Reviews & Prints', desc: 'Order appears in the Kanban queue. Staff verifies files and moves it to printing.' },
                { step: '3', title: 'Automated Updates', desc: 'Customers receive real-time notifications when their order is ready or out for delivery.' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{s.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-warning)', fontWeight: 700, marginBottom: '0.5rem' }}>PENDING</div>
                <div style={{ fontWeight: 600 }}>Order #ORD-1049</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>A4 Color Printing • 100 copies</div>
              </div>
              <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '0.5rem' }}>PRINTING</div>
                <div style={{ fontWeight: 600 }}>Order #ORD-1048</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Spiral Binding • 5 books</div>
              </div>
              <div className="card" style={{ borderLeft: '4px solid var(--color-success)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 700, marginBottom: '0.5rem' }}>READY</div>
                <div style={{ fontWeight: 600 }}>Order #ORD-1047</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Business Cards • Premium Matte</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '6rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Simple, transparent pricing</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Start for free, upgrade when you need more power.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { name: 'Starter', price: '₹999', desc: 'Perfect for small local print shops.', features: ['Up to 500 orders/mo', 'Basic Services', '2 Staff Members', 'Standard Support'] },
            { name: 'Professional', price: '₹2,999', desc: 'For growing businesses and franchises.', featured: true, features: ['Unlimited orders', 'Advanced Analytics', '10 Staff Members', 'Priority Support', 'Custom Domain'] },
          ].map(p => (
            <div key={p.name} className={`card ${p.featured ? 'glow-primary' : ''}`} style={{ position: 'relative', padding: '2.5rem', border: p.featured ? '1px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
              {p.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>MOST POPULAR</div>}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', height: 48 }}>{p.desc}</p>
              <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem' }}>{p.price}<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/mo</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={16} color="var(--color-primary-light)" />
                    <span style={{ color: 'var(--color-text-muted)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`btn ${p.featured ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', padding: '1rem' }} onClick={handleCTA}>
                {p.featured ? 'Start Free Trial' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '4rem 2rem', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
              <Printer size={18} color="var(--color-primary-light)" /> PrintEasy
            </div>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 300 }}>The modern operating system for enterprise print shops and digital agencies.</p>
          </div>
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                <span>Features</span><span>Pricing</span><span>Changelog</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                <span>About</span><span>Contact</span><span>Legal</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
