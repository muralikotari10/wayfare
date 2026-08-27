import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  CheckCircle,
  Circle,
  Trash2,
  Sparkles,
  Share2,
  Download,
  Users,
  Compass,
} from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { MapView } from '../components/MapView';
import { CreateTripModal } from '../components/CreateTripModal';

export const ItineraryPlanner = ({ onOpenAIPlanner }) => {
  const { trips, activeTrip, setActiveTrip, addActivity, toggleActivity } = useTrips();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New activity form state
  const [showAddActForm, setShowAddActForm] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('10:00 AM');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState('');
  const [actCategory, setActCategory] = useState('Sightseeing');
  const [actNotes, setActNotes] = useState('');

  if (!activeTrip && trips.length === 0) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px auto' }}>
            <Compass size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>No Trips in Your Passport Yet</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Create your first expedition or let AI build you a complete day-by-day plan in seconds.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => onOpenAIPlanner()}>
              <Sparkles size={16} /> AI Itinerary
            </button>
            <button className="btn btn-secondary" onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} /> Custom Trip
            </button>
          </div>
        </div>
        <CreateTripModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </div>
    );
  }

  const currentTrip = activeTrip || trips[0];
  const activeDay = currentTrip.days?.find((d) => d.dayNumber === selectedDayNumber) || currentTrip.days?.[0] || { activities: [] };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    await addActivity(currentTrip._id, selectedDayNumber, {
      title: actTitle,
      time: actTime,
      location: actLocation,
      cost: Number(actCost) || 0,
      category: actCategory,
      notes: actNotes,
      coordinates: { lat: 35.6762 + (Math.random() - 0.5) * 0.05, lng: 139.6503 + (Math.random() - 0.5) * 0.05 },
    });

    setActTitle('');
    setActLocation('');
    setActCost('');
    setActNotes('');
    setShowAddActForm(false);
  };

  // Map markers from activities
  const markers = (activeDay.activities || [])
    .filter((a) => a.coordinates && (a.coordinates.lat || a.coordinates.lng))
    .map((a) => ({
      id: a._id,
      lat: a.coordinates.lat,
      lng: a.coordinates.lng,
      title: a.title,
      category: a.category,
      time: a.time,
      cost: a.cost,
    }));

  const mapCenter = markers.length > 0 ? [markers[0].lat, markers[0].lng] : [35.6762, 139.6503];
  const polylineCoords = markers.map((m) => [m.lat, m.lng]);

  const totalSpent = currentTrip.days?.reduce(
    (acc, day) => acc + (day.activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0),
    0
  ) || 0;

  return (
    <div className="main-content">
      {/* Top Banner & Trip Selector */}
      <div className="itinerary-header-banner">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-cyan">{currentTrip.status || 'Active'}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {currentTrip.startDate} → {currentTrip.endDate}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem' }}>{currentTrip.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-cyan)', fontSize: '0.95rem', fontWeight: 600 }}>
              <MapPin size={16} /> {currentTrip.destination}, {currentTrip.country} • {currentTrip.travelersCount} Travelers
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Trip Switcher Dropdown */}
            {trips.length > 1 && (
              <select
                className="input-field"
                style={{ width: 'auto', padding: '8px 14px' }}
                value={currentTrip._id}
                onChange={(e) => {
                  const t = trips.find((item) => item._id === e.target.value);
                  if (t) setActiveTrip(t);
                }}
              >
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>{t.destination} ({t.startDate})</option>
                ))}
              </select>
            )}

            <button className="btn btn-secondary" onClick={() => setIsCreateOpen(true)} style={{ padding: '8px 14px' }}>
              <Plus size={16} /> New Trip
            </button>
            <button className="btn btn-primary" onClick={() => onOpenAIPlanner(currentTrip.destination)} style={{ padding: '8px 14px' }}>
              <Sparkles size={16} /> AI Expand
            </button>
          </div>
        </div>

        {/* Budget Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Budget</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>${currentTrip.totalBudget?.toLocaleString()} USD</div>
            </div>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scheduled Activity Cost</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>${totalSpent.toLocaleString()} USD</div>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.82rem' }} onClick={() => alert('Itinerary summary copied to clipboard!')}>
            <Share2 size={14} /> Share Plan
          </button>
        </div>
      </div>

      {/* Days Navigation Tab Bar */}
      <div className="days-tab-bar">
        {currentTrip.days?.map((day) => (
          <button
            key={day.dayNumber}
            className={`day-tab-btn ${selectedDayNumber === day.dayNumber ? 'active' : ''}`}
            onClick={() => setSelectedDayNumber(day.dayNumber)}
          >
            <span>Day {day.dayNumber}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>{day.activities?.length || 0} stops</span>
          </button>
        ))}

        <button
          className="day-tab-btn"
          style={{ borderStyle: 'dashed' }}
          onClick={async () => {
            const nextDayNum = (currentTrip.days?.length || 0) + 1;
            await addActivity(currentTrip._id, nextDayNum, {
              title: `Explore Day ${nextDayNum}`,
              time: '09:00 AM',
              cost: 0,
              category: 'Sightseeing',
            });
            setSelectedDayNumber(nextDayNum);
          }}
        >
          <Plus size={16} />
          <span style={{ fontSize: '0.75rem' }}>Add Day</span>
        </button>
      </div>

      {/* Main Grid: Timeline + Live Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Timeline Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>
              Day {selectedDayNumber}: {activeDay.title || `Day ${selectedDayNumber} Schedule`}
            </h3>
            <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setShowAddActForm(!showAddActForm)}>
              <Plus size={14} /> Add Stop
            </button>
          </div>

          {/* Add Activity Form */}
          {showAddActForm && (
            <div className="glass-panel" style={{ padding: '18px', marginBottom: '18px', border: '1px solid var(--border-active)' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Add Stop to Day {selectedDayNumber}</h4>
              <form onSubmit={handleAddActivity}>
                <div className="input-group">
                  <label className="input-label">Activity Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Coffee at Blue Bottle Shibuya"
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Time</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 10:30 AM"
                      value={actTime}
                      onChange={(e) => setActTime(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select
                      className="input-field"
                      value={actCategory}
                      onChange={(e) => setActCategory(e.target.value)}
                    >
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Food">Food & Dining</option>
                      <option value="Hotel">Hotel / Check-in</option>
                      <option value="Activity">Activity / Tour</option>
                      <option value="Transport">Transport</option>
                      <option value="Nightlife">Nightlife</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Location / Address</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Shibuya Center-Gai"
                      value={actLocation}
                      onChange={(e) => setActLocation(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Est. Cost ($ USD)</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="0"
                      value={actCost}
                      onChange={(e) => setActCost(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddActForm(false)} style={{ padding: '6px 12px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '6px 14px' }}>
                    Save Activity
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Activity Timeline List */}
          {(!activeDay.activities || activeDay.activities.length === 0) ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-secondary)' }}>
              <p>No activities scheduled for this day yet.</p>
              <button className="btn btn-outline" style={{ marginTop: '12px' }} onClick={() => setShowAddActForm(true)}>
                <Plus size={16} /> Add First Stop
              </button>
            </div>
          ) : (
            <div className="timeline-container">
              {activeDay.activities.map((act) => (
                <div key={act._id} className="timeline-item">
                  <div className="timeline-time-col">
                    <div className="timeline-time-badge">
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {act.time}
                    </div>
                    <button
                      className="btn btn-icon"
                      style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                      onClick={() => toggleActivity(currentTrip._id, act._id)}
                      title={act.completed ? 'Mark pending' : 'Mark done'}
                    >
                      {act.completed ? <CheckCircle size={16} color="var(--accent-emerald)" /> : <Circle size={16} color="var(--text-muted)" />}
                    </button>
                  </div>

                  <div className="timeline-content-col">
                    <div className={`timeline-act-title ${act.completed ? 'completed' : ''}`}>
                      <span>{act.title}</span>
                      {act.cost > 0 && (
                        <span style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                          ${act.cost}
                        </span>
                      )}
                    </div>

                    {act.location && (
                      <div className="timeline-act-location">
                        <MapPin size={13} color="var(--primary-cyan)" /> {act.location}
                      </div>
                    )}

                    {act.notes && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        💡 {act.notes}
                      </p>
                    )}

                    <div style={{ marginTop: '6px' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{act.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map & Packing Widget */}
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--primary-cyan)" /> Day {selectedDayNumber} Geolocation Trail
          </h3>
          <MapView center={mapCenter} zoom={13} markers={markers} polylineCoords={polylineCoords} />
        </div>
      </div>

      <CreateTripModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} defaultDestination={currentTrip.destination} />
    </div>
  );
};
