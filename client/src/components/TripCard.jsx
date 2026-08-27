import React from 'react';
import { Calendar, Users, DollarSign, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';

export const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { setActiveTrip, deleteTrip } = useTrips();

  const handleOpen = () => {
    setActiveTrip(trip);
    navigate('/itinerary');
  };

  const totalActivities = trip.days?.reduce((acc, day) => acc + (day.activities?.length || 0), 0) || 0;
  const completedActivities = trip.days?.reduce(
    (acc, day) => acc + (day.activities?.filter((a) => a.completed)?.length || 0),
    0
  ) || 0;
  const progress = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return (
    <div className="dest-card" style={{ cursor: 'pointer' }} onClick={handleOpen}>
      <div className="dest-card-image-wrap">
        <img src={trip.coverImage} alt={trip.title} className="dest-card-img" />
        <div className="dest-card-badges">
          <span className="badge badge-cyan">{trip.status || 'Active'}</span>
          <button
            className="btn btn-icon"
            style={{ width: '32px', height: '32px', background: 'rgba(0,0,0,0.6)' }}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this trip?')) {
                deleteTrip(trip._id);
              }
            }}
            title="Delete Trip"
          >
            <Trash2 size={14} color="#f43f5e" />
          </button>
        </div>
      </div>

      <div className="dest-card-body">
        <div className="dest-card-country">
          <MapPin size={14} /> {trip.destination}, {trip.country}
        </div>
        <h3 className="dest-card-title">{trip.title}</h3>

        <div style={{ display: 'flex', gap: '16px', margin: '10px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} color="var(--primary-cyan)" /> {trip.startDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users size={14} color="#c084fc" /> {trip.travelersCount} Travelers
          </span>
        </div>

        {/* Progress Bar */}
        {totalActivities > 0 && (
          <div style={{ margin: '8px 0 14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Activities Completed</span>
              <span>{completedActivities}/{totalActivities} ({progress}%)</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--grad-primary)', borderRadius: '3px' }} />
            </div>
          </div>
        )}

        <div className="dest-card-footer">
          <div>
            <div className="dest-price-label">Estimated Budget</div>
            <div className="dest-price-val" style={{ color: 'var(--accent-emerald)' }}>
              ${trip.totalBudget?.toLocaleString()} {trip.currency}
            </div>
          </div>

          <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
            View Timeline <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
