import React, { useState } from 'react';
import { X, Plus, Calendar, DollarSign, Users, MapPin } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

export const CreateTripModal = ({ isOpen, onClose, defaultDestination = '' }) => {
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const [title, setTitle] = useState(defaultDestination ? `Voyage to ${defaultDestination}` : '');
  const [destination, setDestination] = useState(defaultDestination || '');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0]);
  const [totalBudget, setTotalBudget] = useState(1800);
  const [travelersCount, setTravelersCount] = useState(2);
  const [coverImage, setCoverImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    await createTrip({
      title: title || `Trip to ${destination}`,
      destination,
      country: country || destination,
      startDate,
      endDate,
      totalBudget: Number(totalBudget),
      currency: 'USD',
      travelersCount: Number(travelersCount),
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    });

    onClose();
    navigate('/itinerary');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon">
              <Plus size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Create New Expedition</h3>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="input-group">
            <label className="input-label">Trip Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Summer in Tokyo & Kyoto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Destination City</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Tokyo"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Country</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Japan"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">End Date</label>
              <input
                type="date"
                className="input-field"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Budget ($ USD)</label>
              <input
                type="number"
                min={100}
                className="input-field"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Travelers</label>
              <input
                type="number"
                min={1}
                max={20}
                className="input-field"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Cover Photo URL (Optional)</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '8px' }}>
            <Plus size={18} /> Initialize Itinerary
          </button>
        </form>
      </div>
    </div>
  );
};
