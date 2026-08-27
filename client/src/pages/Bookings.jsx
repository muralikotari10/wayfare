import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Plane,
  Hotel,
  Compass,
  QrCode,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { QRModal } from '../components/QRModal';
import { MapView } from '../components/MapView';

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRBooking, setSelectedQRBooking] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [showSimulateForm, setShowSimulateForm] = useState(false);
  const [hotelSearch, setHotelSearch] = useState('');
  const [hotels, setHotels] = useState([]);
  const [hotelUpdated, setHotelUpdated] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);

  // New booking form state
  const [newType, setNewType] = useState('Flight');
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newDest, setNewDest] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSeat, setNewSeat] = useState('12A');
  const [newPrice, setNewPrice] = useState(320);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.bookings.getAll();
      setBookings(data);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchHotels = async () => {
    try {
      setHotelLoading(true);
      const data = await api.bookings.getHotels(hotelSearch);
      setHotels(data.hotels || []);
      setHotelUpdated(data.lastUpdated);
    } catch (err) {
      console.error('Error loading hotel inventory:', err);
    } finally {
      setHotelLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    const liveRefresh = window.setInterval(fetchHotels, 30000);
    return () => window.clearInterval(liveRefresh);
  }, [hotelSearch]);

  const reserveRoom = async (hotel, room) => {
    try {
      await api.bookings.create({
        bookingType: 'Hotel',
        title: `${hotel.name} - ${room.type}`,
        provider: hotel.name,
        destination: hotel.city,
        date: new Date().toISOString().split('T')[0],
        time: 'Check-in 3:00 PM',
        seatOrRoom: room.type,
        roomType: room.type,
        price: room.price,
        currency: 'INR',
        gateOrAddress: hotel.area,
        image: hotel.image,
        coordinates: hotel.coordinates,
      });
      await fetchBookings();
    } catch (err) {
      alert(`Room reservation error: ${err.message}`);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDest.trim()) return;

    try {
      await api.bookings.create({
        bookingType: newType,
        title: newTitle,
        provider: newProvider || `${newType} Express`,
        origin: newOrigin || 'Departure Hub',
        destination: newDest,
        date: newDate,
        seatOrRoom: newSeat,
        price: Number(newPrice),
        currency: 'USD',
      });
      setShowSimulateForm(false);
      setNewTitle('');
      fetchBookings();
    } catch (err) {
      alert(`Booking error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this booking pass?')) {
      await api.bookings.delete(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    }
  };

  const filtered = filterType === 'All' ? bookings : bookings.filter((b) => b.bookingType === filterType);

  return (
    <div className="main-content">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '16px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>
            <Ticket size={14} /> Smart Boarding Passes & Tickets
          </span>
          <h1 style={{ fontSize: '2.2rem' }}>Bookings & Digital Passes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Access scannable mobile boarding passes, hotel reservations, and excursion tickets with offline QR codes.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowSimulateForm(true)} style={{ padding: '10px 18px' }}>
          <Plus size={18} /> Simulate Booking
        </button>
      </div>

      {/* Type Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Flight', 'Hotel', 'Tour'].map((type) => (
          <button
            key={type}
            className={`category-pill ${filterType === type ? 'active' : ''}`}
            onClick={() => setFilterType(type)}
          >
            {type === 'Flight' ? '✈️ Flights' : type === 'Hotel' ? '🏨 Stays' : type === 'Tour' ? '🧭 Tours' : '🌟 All Passes'}
          </button>
        ))}
      </div>

      {/* Live India hotel inventory */}
      <section className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
          <div>
            <span className="badge badge-emerald"><span className="live-dot" /> Live India inventory</span>
            <h2 style={{ fontSize: '1.45rem', marginTop: '8px' }}>Find your stay</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Compare room types, live-style availability, and nightly prices in INR.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '.8rem' }}>
            <RefreshCw size={14} /> Updated {hotelUpdated ? new Date(hotelUpdated).toLocaleTimeString() : 'now'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input className="input-field" placeholder="Search Hyderabad, Goa, Jaipur, Kerala..." value={hotelSearch} onChange={(e) => setHotelSearch(e.target.value)} />
          <button className="btn btn-secondary" onClick={fetchHotels} title="Refresh hotel prices"><RefreshCw size={17} /></button>
        </div>
        {hotelLoading ? <p style={{ color: 'var(--text-secondary)' }}>Refreshing room availability...</p> : <>
          <div style={{ display: 'grid', gap: '16px' }}>
            {hotels.map((hotel) => <article key={hotel._id} style={{ display: 'grid', gridTemplateColumns: 'minmax(170px, .7fr) minmax(260px, 1.3fr)', gap: '18px', paddingBottom: '18px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div><img src={hotel.image} alt={hotel.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} /><div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '.82rem' }}><MapPin size={13} style={{ verticalAlign: 'middle' }} /> {hotel.city} · {hotel.area}</div></div>
              <div><div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}><div><h3 style={{ fontSize: '1.1rem' }}>{hotel.name}</h3><span style={{ color: 'var(--accent-amber)' }}>★ {hotel.rating}</span></div><span className="badge badge-cyan">INR / night</span></div><div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>{hotel.rooms.map((room) => <div key={room.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '9px 10px', background: 'rgba(255,255,255,.04)', borderRadius: 'var(--radius-sm)' }}><span><strong>{room.type}</strong><small style={{ display: 'block', color: room.available <= 2 ? 'var(--accent-coral)' : 'var(--text-secondary)' }}>{room.available} rooms left</small></span><span style={{ textAlign: 'right' }}><strong style={{ color: 'var(--accent-emerald)' }}>₹{room.price.toLocaleString('en-IN')}</strong><button className="btn btn-primary" style={{ display: 'flex', padding: '5px 10px', fontSize: '.75rem', marginTop: '4px' }} onClick={() => reserveRoom(hotel, room)}>Reserve</button></span></div>)}</div></div>
            </article>)}
          </div>
          {hotels.length > 0 && <div style={{ marginTop: '20px' }}><MapView center={[hotels[0].coordinates.lat, hotels[0].coordinates.lng]} zoom={5} markers={hotels.map((hotel) => ({ id: hotel._id, lat: hotel.coordinates.lat, lng: hotel.coordinates.lng, title: hotel.name, category: 'Hotel', time: `${hotel.city} · ${hotel.rooms.length} room types` }))} /></div>}
        </>}
      </section>

      {/* Simulate Booking Modal / Drawer */}
      {showSimulateForm && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Simulate New Travel Booking</h3>
            <button className="btn btn-icon" onClick={() => setShowSimulateForm(false)} style={{ width: '28px', height: '28px' }}>
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateBooking}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Type</label>
                <select
                  className="input-field"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel / Resort</option>
                  <option value="Tour">Guided Experience</option>
                </select>
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Provider Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Singapore Airlines / Aman Resorts"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Title / Route Description</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Flight SQ22: SIN -> JFK"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Origin (If flight/ride)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Singapore (SIN)"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Destination / Venue</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Tokyo Haneda (HND)"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  required
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Seat / Room</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 18A / Suite 401"
                  value={newSeat}
                  onChange={(e) => setNewSeat(e.target.value)}
                />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Price ($ USD)</label>
                <input
                  type="number"
                  className="input-field"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowSimulateForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Issue Confirmed Pass & QR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          Loading your travel passes...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Ticket size={32} color="var(--primary-cyan)" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            No passes found in this category.
          </p>
          <button className="btn btn-primary" onClick={() => setShowSimulateForm(true)}>
            Simulate First Booking
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map((b) => (
            <div key={b._id} className="boarding-pass-card">
              <div className="pass-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
                    {b.bookingType === 'Flight' ? <Plane size={18} /> : b.bookingType === 'Hotel' ? <Hotel size={18} /> : <Compass size={18} />}
                  </div>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{b.provider}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>Ref: {b.referenceCode}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-emerald">{b.status}</span>
                  <button
                    className="btn btn-icon"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => handleDelete(b._id)}
                    title="Cancel Booking"
                  >
                    <Trash2 size={14} color="#f43f5e" />
                  </button>
                </div>
              </div>

              <div className="pass-body">
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{b.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      <span>📅 {b.date} • {b.time}</span>
                      <span>📍 {b.destination}</span>
                      <span>💺 {b.seatOrRoom}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ${b.price} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>USD</span>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: '8px', padding: '8px 16px', fontSize: '0.88rem' }}
                      onClick={() => setSelectedQRBooking(b)}
                    >
                      <QrCode size={16} /> View Digital QR Pass
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Boarding Pass Modal */}
      <QRModal booking={selectedQRBooking} onClose={() => setSelectedQRBooking(null)} />
    </div>
  );
};
