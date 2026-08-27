import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  Sun,
  Moon,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-logo" onClick={() => navigate('/')}>
          <div className="brand-icon">
            <Compass size={22} />
          </div>
          <span>WAY<span className="text-gradient">FARE</span></span>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <Compass size={17} /> Discover India
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={17} /> Community
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* AI Generator Button */}
          {/* Theme Toggler */}
          <button className="btn btn-icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="user-pill" onClick={() => navigate('/profile')}>
              <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
            </div>
          ) : (
            <button className="btn btn-outline" onClick={() => navigate('/auth')} style={{ padding: '8px 14px', fontSize: '0.88rem' }}>
              <UserIcon size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
