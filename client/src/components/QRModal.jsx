import React from 'react';
import { X, QrCode, Download, Printer, CheckCircle, Plane, Hotel, Compass } from 'lucide-react';

export const QRModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              {booking.bookingType === 'Flight' ? <Plane size={18} /> : booking.bookingType === 'Hotel' ? <Hotel size={18} /> : <Compass size={18} />}
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Digital Boarding Pass</h3>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-cyan">{booking.provider}</span>
              <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} /> {booking.status || 'Confirmed'}
              </span>
            </div>

            <h4 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{booking.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Ref Code: <strong style={{ color: '#fff' }}>{booking.referenceCode}</strong>
            </p>

            {/* QR Code Display Box */}
            <div
              style={{
                background: '#ffffff',
                padding: '18px',
                borderRadius: '16px',
                display: 'inline-block',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                marginBottom: '20px',
              }}
            >
              {/* High-res SVG QR Simulation */}
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="180" height="180" fill="white" />
                {/* Outer corners */}
                <rect x="15" y="15" width="45" height="45" rx="6" fill="#0f172a" />
                <rect x="22" y="22" width="31" height="31" rx="4" fill="white" />
                <rect x="28" y="28" width="19" height="19" rx="2" fill="#06b6d4" />

                <rect x="120" y="15" width="45" height="45" rx="6" fill="#0f172a" />
                <rect x="127" y="22" width="31" height="31" rx="4" fill="white" />
                <rect x="133" y="28" width="19" height="19" rx="2" fill="#06b6d4" />

                <rect x="15" y="120" width="45" height="45" rx="6" fill="#0f172a" />
                <rect x="22" y="127" width="31" height="31" rx="4" fill="white" />
                <rect x="28" y="133" width="19" height="19" rx="2" fill="#06b6d4" />

                {/* Simulated Data Grid */}
                <rect x="70" y="20" width="12" height="12" fill="#0f172a" />
                <rect x="90" y="20" width="12" height="12" fill="#0f172a" />
                <rect x="70" y="45" width="20" height="10" fill="#0f172a" />
                <rect x="20" y="70" width="15" height="12" fill="#0f172a" />
                <rect x="45" y="70" width="25" height="12" fill="#0f172a" />
                <rect x="80" y="70" width="20" height="20" rx="3" fill="#6366f1" />
                <rect x="110" y="70" width="15" height="12" fill="#0f172a" />
                <rect x="135" y="70" width="25" height="12" fill="#0f172a" />
                <rect x="20" y="95" width="25" height="12" fill="#0f172a" />
                <rect x="60" y="100" width="15" height="20" fill="#0f172a" />
                <rect x="90" y="105" width="20" height="12" fill="#0f172a" />
                <rect x="125" y="95" width="35" height="12" fill="#0f172a" />
                <rect x="70" y="135" width="35" height="15" fill="#0f172a" />
                <rect x="120" y="125" width="15" height="35" fill="#0f172a" />
                <rect x="145" y="140" width="18" height="20" fill="#0f172a" />
              </svg>
            </div>

            {/* Pass Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                textAlign: 'left',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passenger</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{booking.passengerName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Seat / Room</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-cyan)' }}>{booking.seatOrRoom}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date & Time</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{booking.date} • {booking.time}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gate / Access</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{booking.gateOrAddress}</div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => window.print()}
            >
              <Printer size={16} /> Print Pass
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              onClick={() => alert(`Boarding pass for ${booking.referenceCode} saved to your device vault!`)}
            >
              <Download size={16} /> Save to Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
