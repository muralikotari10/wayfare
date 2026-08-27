  const like = async (id) => { try { const updated = await api.posts.like(id); setPosts(posts.map((post) => post._id === id ? updated : post)); } catch (err) { if (!err.message.includes('already liked')) throw err; } };
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Archive, Check, Compass, DollarSign, Heart, LogIn, MapPin, MessageCircle,
  Plus, Receipt, Save, ShieldCheck, Sparkles, User, Users, Wallet,
} from 'lucide-react';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { TripCard } from '../components/TripCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';

const PageHeader = ({ icon: Icon, eyebrow, title, description, action }) => (
  <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
    <div>
      <span className="badge badge-cyan" style={{ marginBottom: '8px' }}><Icon size={14} /> {eyebrow}</span>
      <h1 style={{ fontSize: '2.2rem' }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '680px' }}>{description}</p>
    </div>
    {action}
  </div>
);

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'demo@wayfare.app', password: 'wayfare123' });
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      if (mode === 'demo') await demoLogin();
      else if (mode === 'login') await login({ email: form.email, password: form.password });
      else await register(form);
      navigate('/');
    } catch (err) { setError(err.message); }
  };
  return <div className="main-content" style={{ maxWidth: '560px' }}>
    <div className="glass-panel" style={{ padding: '32px' }}>
      <div className="brand-icon" style={{ marginBottom: '18px' }}><Compass size={24} /></div>
      <h1 style={{ marginBottom: '8px' }}>{mode === 'register' ? 'Create your passport' : 'Welcome back, wayfarer'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Your trips, passes, documents, and travel crew in one place.</p>
      {error && <p style={{ color: 'var(--accent-coral)', marginBottom: '16px' }}>{error}</p>}
      <form onSubmit={submit}>
        {mode === 'register' && <div className="input-group"><label className="input-label">Full name</label><input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>}
        {mode !== 'demo' && <><div className="input-group"><label className="input-label">Email</label><input className="input-field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><div className="input-group"><label className="input-label">Password</label><input className="input-field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div></>}
        <button className="btn btn-primary" style={{ width: '100%' }}><LogIn size={17} /> {mode === 'register' ? 'Create account' : mode === 'demo' ? 'Enter demo mode' : 'Sign in'}</button>
      </form>
      <button className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }} onClick={async () => { try { setError(''); await demoLogin(); navigate('/'); } catch (err) { setError(err.message); } }}>Try demo account</button>
      <button className="btn" style={{ width: '100%', marginTop: '8px', color: 'var(--primary-cyan)' }} onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>{mode === 'register' ? 'Already have an account? Sign in' : 'New to Wayfare? Create an account'}</button>
    </div>
  </div>;
};

export const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', destination: '' });
  const load = () => api.posts.getAll().then(setPosts).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);
  const create = async (event) => { event.preventDefault(); await api.posts.create(form); setForm({ title: '', content: '', destination: '' }); setShowForm(false); load(); };
  const like = async (id) => { const updated = await api.posts.like(id); setPosts(posts.map((post) => post._id === id ? updated : post)); };
  return <div className="main-content">
    <PageHeader icon={Users} eyebrow="Travel community" title="Stories from the road" description="Swap practical advice, hidden gems, and hard-won itinerary notes with fellow travelers." action={<button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={17} /> Share a story</button>} />
    {showForm && <form className="glass-panel" style={{ padding: '22px', marginBottom: '24px' }} onSubmit={create}><div className="input-group"><label className="input-label">Story title</label><input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div><div className="input-group"><label className="input-label">Destination</label><input className="input-field" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required /></div><div className="input-group"><label className="input-label">Your story</label><textarea className="input-field" rows="4" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div><button className="btn btn-primary"><Save size={16} /> Publish story</button></form>}
    <div style={{ display: 'grid', gap: '18px' }}>{posts.map((post) => <article className="glass-panel" style={{ padding: '22px' }} key={post._id}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}><img src={post.authorAvatar} alt="" className="user-avatar-sm" /><div><strong>{post.authorName}</strong><div style={{ color: 'var(--text-secondary)', fontSize: '.82rem' }}><MapPin size={12} style={{ verticalAlign: 'middle' }} /> {post.destination}</div></div></div><h2 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{post.title}</h2><p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{post.content}</p><div style={{ display: 'flex', gap: '18px', marginTop: '16px' }}><button className="btn" onClick={() => like(post._id)}><Heart size={16} /> {post.likes || 0}</button><span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><MessageCircle size={16} /> {post.comments?.length || 0}</span></div></article>)}</div>
    {!posts.length && <div className="glass-panel" style={{ padding: '44px', textAlign: 'center' }}>No stories loaded yet.</div>}
    {!user && <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Sign in to publish, like, and comment on stories.</p>}
  </div>;
};

export const Splitfare = () => {
  const [data, setData] = useState({ expenses: [], settlements: [], categoryTotals: {}, totalSpent: 0 });
  const [open, setOpen] = useState(false);
  const load = () => api.expenses.getAll().then(setData).catch(() => {});
  useEffect(() => { load(); }, []);
  const add = async (expense) => { await api.expenses.create(expense); load(); };
  return <div className="main-content"><PageHeader icon={Receipt} eyebrow="Splitfare" title="Keep the group balanced" description="Log shared costs and see the fewest transfers needed to settle the trip." action={<button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={17} /> Add expense</button>} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>{[['Total spent', `$${Number(data.totalSpent || 0).toFixed(2)}`, Wallet], ['Expenses', data.expenses.length, Receipt], ['Transfers', data.settlements.length, Users]].map(([label, value, Icon]) => <div className="glass-panel" style={{ padding: '20px' }} key={label}><Icon size={20} color="var(--primary-cyan)" /><div style={{ color: 'var(--text-secondary)', fontSize: '.82rem', marginTop: '10px' }}>{label}</div><strong style={{ fontSize: '1.45rem' }}>{value}</strong></div>)}</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}><section className="glass-panel" style={{ padding: '22px' }}><h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Settle up</h2>{data.settlements.length ? data.settlements.map((item, index) => <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}><span>{item.from} pays {item.to}</span><strong style={{ color: 'var(--accent-emerald)' }}>${item.amount.toFixed(2)}</strong></div>) : <p style={{ color: 'var(--text-secondary)' }}>Everyone is settled.</p>}</section><section className="glass-panel" style={{ padding: '22px' }}><h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Recent expenses</h2>{data.expenses.slice(0, 6).map((expense) => <div key={expense._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}><span>{expense.title}<small style={{ display: 'block', color: 'var(--text-secondary)' }}>{expense.paidBy} · {expense.category}</small></span><strong>${Number(expense.amount).toFixed(2)}</strong></div>)}</section></div>
    <AddExpenseModal isOpen={open} onClose={() => setOpen(false)} onAdd={add} /></div>;
};

export const Vault = () => {
  const { trips } = useTrips();
  const [bookings, setBookings] = useState([]);
  useEffect(() => { api.bookings.getAll().then(setBookings).catch(() => {}); }, []);
  return <div className="main-content"><PageHeader icon={ShieldCheck} eyebrow="Travel vault" title="Everything important, offline-ready" description="Keep your confirmed passes and trip documents close when connectivity gets thin." /><div className="glass-panel" style={{ padding: '22px', marginBottom: '18px' }}><h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}><Archive size={18} /> Digital passes</h2>{bookings.map((booking) => <div key={booking._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}><span><strong>{booking.title}</strong><small style={{ display: 'block', color: 'var(--text-secondary)' }}>{booking.referenceCode} · {booking.date}</small></span><span className="badge badge-emerald"><Check size={12} /> {booking.status}</span></div>)}{!bookings.length && <p style={{ color: 'var(--text-secondary)' }}>No saved passes yet. Create one in Bookings.</p>}</div><h2 style={{ fontSize: '1.2rem', marginBottom: '14px' }}>Saved itineraries</h2><div className="grid-destinations">{trips.filter((trip) => trip.isPublic).map((trip) => <TripCard key={trip._id} trip={trip} />)}</div></div>;
};

export const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', homeCountry: user?.homeCountry || '', currency: user?.currency || 'USD' });
  if (!user) return <div className="main-content" style={{ textAlign: 'center' }}><div className="glass-panel" style={{ padding: '44px' }}><User size={32} color="var(--primary-cyan)" /><h1 style={{ margin: '12px 0' }}>Your passport is waiting</h1><button className="btn btn-primary" onClick={() => navigate('/auth')}><LogIn size={16} /> Sign in</button></div></div>;
  const save = async (event) => { event.preventDefault(); await updateProfile(form); };
  return <div className="main-content"><PageHeader icon={User} eyebrow="Wayfarer passport" title={user.name} description={user.bio} action={<button className="btn btn-outline" onClick={() => { logout(); navigate('/'); }}>Sign out</button>} /><div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, .7fr) minmax(300px, 1.3fr)', gap: '18px' }}><section className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}><img src={user.avatar} alt={user.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--primary-cyan)' }} /><h2 style={{ marginTop: '14px' }}>{user.name}</h2><p style={{ color: 'var(--text-secondary)' }}>{user.email}</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '22px', gap: '8px' }}>{[['Countries', user.passportStats?.countriesVisited || 0], ['Trips', user.passportStats?.tripsCompleted || 0], ['Miles', user.passportStats?.totalMiles || 0]].map(([label, value]) => <div key={label}><strong>{value}</strong><small style={{ display: 'block', color: 'var(--text-secondary)' }}>{label}</small></div>)}</div></section><form className="glass-panel" style={{ padding: '24px' }} onSubmit={save}><h2 style={{ fontSize: '1.2rem', marginBottom: '18px' }}>Passport details</h2>{[['name', 'Name'], ['bio', 'Bio'], ['homeCountry', 'Home country']].map(([key, label]) => <div className="input-group" key={key}><label className="input-label">{label}</label>{key === 'bio' ? <textarea className="input-field" rows="3" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /> : <input className="input-field" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />}</div>)}<div className="input-group"><label className="input-label">Home currency</label><select className="input-field" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}><option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option></select></div><button className="btn btn-primary"><Save size={16} /> Save passport</button></form></div></div>;
};