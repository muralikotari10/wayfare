import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Users,
  User,
} from 'lucide-react';

export const MobileNav = () => {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} end>
        <Compass size={20} />
        <span>Discover</span>
      </NavLink>
      <NavLink to="/community" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Users size={20} />
        <span>Feed</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
