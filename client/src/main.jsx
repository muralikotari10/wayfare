import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Explore } from './pages/Explore';
import { PlaceGuide } from './pages/PlaceGuide';
import { AuthPage, Community, Profile } from './pages/DashboardPages';
import './styles/index.css';
import './styles/components.css';
import './styles/mobile.css';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="app-loading"><div className="brand-icon"><CompassIcon /></div><p>Preparing your travel passport...</p></div>;
  }

  if (!user) {
    return <Routes><Route path="*" element={<AuthPage />} /></Routes>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/place/:place" element={<PlaceGuide />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MobileNav />

    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

const CompassIcon = () => <span style={{ fontSize: '1.25rem' }}>+</span>;