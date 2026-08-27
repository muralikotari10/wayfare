import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  DollarSign,
  Sun,
  ShieldCheck,
  Globe,
  Sparkles,
  Utensils,
  Camera,
  ArrowLeft,
  CheckCircle2,
  Ticket,
} from 'lucide-react';
import { api } from '../services/api';
import { MapView } from '../components/MapView';

export const DestinationDetail = ({ onOpenAIPlanner }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDest = async () => {
      try {
        setLoading(true);
        const data = await api.destinations.getById(id);
        setDestination(data);
      } catch (err) {
        console.error('Failed to load destination:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDest();
  }, [id]);

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '80px 0' }}>
        Loading destination details...
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Destination not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
          Back to Explore
        </button>
      </div>
    );
  }

  const mapCenter = [destination.coordinates?.lat || 35.6762, destination.coordinates?.lng || 139.6503];
  const markers = [
    {
      id: 'center',
      lat: mapCenter[0],
      lng: mapCenter[1],
      title: destination.name,
      category: 'Sightseeing',
    },
  ];

  return (
    <div className="main-content">
      {/* Back Button */}
      <button
        className="btn btn-secondary"
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '8px 16px' }}
      >
        <ArrowLeft size={16} /> Back to Destinations
      </button>

      {/* Hero Cover Card */}
      <div
        className="hero-banner"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(7, 11, 20, 0.92) 0%, rgba(7, 11, 20, 0.6) 60%, rgba(7, 11, 20, 0.3) 100%), url('${destination.coverImage}')`,
          padding: '40px 32px',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-cyan">{destination.category}</span>
            <span className="badge badge-emerald">★ {destination.rating} ({destination.reviewCount} Reviews)</span>
          </div>

          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{destination.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-cyan)', fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>
            <MapPin size={18} /> {destination.country} • {destination.continent}
          </div>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {destination.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => onOpenAIPlanner(destination.name)} style={{ padding: '12px 22px' }}>
              <Sparkles size={18} /> Generate AI Itinerary for {destination.name}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/bookings')} style={{ padding: '12px 22px' }}>
              <Ticket size={18} /> View Available Flights & Stays
            </button>
          </div>
        </div>
      </div>

      {/* Fast Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-amber)', marginBottom: '8px' }}>
            <Sun size={20} /> <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Current Weather</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{destination.weather?.temp || 22}°C</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{destination.weather?.condition || 'Clear Skies'} • Humidity: {destination.weather?.humidity || '45%'}</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
            <DollarSign size={20} /> <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Daily Budget</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>${destination.avgCostPerDay} USD</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated mid-range daily spend</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-cyan)', marginBottom: '8px' }}>
            <Calendar size={20} /> <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Best Season</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{destination.bestTimeToVisit}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Optimal weather and conditions</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c084fc', marginBottom: '8px' }}>
            <ShieldCheck size={20} /> <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Safety & Visa</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{destination.safetyRating}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{destination.visaRequirement}</div>
        </div>
      </div>

      {/* Interactive Map */}
      <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MapPin size={20} color="var(--primary-cyan)" /> Destination Geolocation & Coordinates
      </h3>
      <MapView center={mapCenter} zoom={11} markers={markers} />

      {/* Highlights & Food Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {/* Must-See Highlights */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} color="var(--primary-cyan)" /> Top Curated Highlights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {destination.highlights?.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--primary-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Cuisine & Street Food */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={18} color="var(--accent-amber)" /> Iconic Local Cuisine & Street Eats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {destination.localEats?.map((eat, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🍜</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{eat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
