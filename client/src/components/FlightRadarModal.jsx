import React, { useState, useEffect } from 'react';
import { X, Plane, Navigation, Compass, Radio, Wind, AlertCircle } from 'lucide-react';

export const FlightRadarModal = ({ isOpen, onClose }) => {
  const [activeFlights, setActiveFlights] = useState([
    {
      flightNo: 'NH 107',
      airline: 'All Nippon Airways',
      from: 'SFO (San Francisco)',
      to: 'HND (Tokyo)',
      altitude: '38,000 ft',
      speed: '562 mph',
      status: 'En Route',
      progress: 68,
      aircraft: 'Boeing 787-9 Dreamliner',
      eta: '2h 14m remaining',
    },
    {
      flightNo: 'AF 084',
      airline: 'Air France',
      from: 'CDG (Paris)',
      to: 'JFK (New York)',
      altitude: '36,000 ft',
      speed: '530 mph',
      status: 'On Time',
      progress: 42,
      aircraft: 'Airbus A350-900',
      eta: '4h 30m remaining',
    },
    {
      flightNo: 'EK 318',
      airline: 'Emirates',
      from: 'DXB (Dubai)',
      to: 'NRT (Tokyo)',
      altitude: '40,000 ft',
      speed: '580 mph',
      status: 'Approaching Runway',
      progress: 94,
      aircraft: 'Airbus A380-800',
      eta: '22 min remaining',
    },
    {
      flightNo: 'SQ 22',
      airline: 'Singapore Airlines',
      from: 'SIN (Singapore)',
      to: 'EWR (New York)',
      altitude: '39,000 ft',
      speed: '545 mph',
      status: 'En Route',
      progress: 81,
      aircraft: 'Airbus A350-900ULR',
      eta: '3h 10m remaining',
    },
  ]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ background: 'var(--grad-primary)' }}>
              <Radio size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Global Flight Radar & Airspace</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Live simulated transponder feeds & airspace telemetry</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Radar Scanner Visual Animation */}
          <div
            style={{
              position: 'relative',
              height: '140px',
              borderRadius: 'var(--radius-lg)',
              background: 'radial-gradient(circle, #0c1c38 0%, #060913 100%)',
              border: '1px solid var(--border-active)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            {/* Concentric Radar Rings */}
            <div style={{ position: 'absolute', width: '90px', height: '90px', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '180px', height: '180px', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '280px', height: '280px', border: '1px solid rgba(6, 182, 212, 0.08)', borderRadius: '50%' }} />

            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <Plane size={28} color="var(--primary-cyan)" style={{ animation: 'spin 20s linear infinite' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-cyan)', marginTop: '6px' }}>
                4 Active Flight Paths Monitored
              </div>
            </div>
          </div>

          {/* Flight List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeFlights.map((flight) => (
              <div
                key={flight.flightNo}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{flight.flightNo}</span>
                    <span className="badge badge-cyan">{flight.airline}</span>
                  </div>
                  <span className="badge badge-emerald">{flight.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>{flight.from}</span>
                  <Plane size={16} color="var(--primary-cyan)" />
                  <span>{flight.to}</span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', margin: '10px 0' }}>
                  <div style={{ width: `${flight.progress}%`, height: '100%', background: 'var(--grad-primary)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>🛩️ {flight.aircraft}</span>
                  <span>📍 {flight.altitude} • {flight.speed}</span>
                  <span style={{ color: 'var(--text-cyan)', fontWeight: 600 }}>⏱️ {flight.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
