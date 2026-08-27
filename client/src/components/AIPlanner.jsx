import React, { useState } from 'react';
import { Sparkles, X, Compass, Calendar, DollarSign, Users, Check, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

export const AIPlanner = ({ isOpen, onClose, initialDestination = '', initialCountry = '' }) => {
  const [destination, setDestination] = useState(initialDestination || 'Hyderabad');
  const [daysCount, setDaysCount] = useState(4);
  const [vibe, setVibe] = useState('Adventure');
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [travelersCount, setTravelersCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const currencyByCountry = { India: 'INR', Japan: 'JPY', Italy: 'EUR', Indonesia: 'IDR', Switzerland: 'CHF', Iceland: 'ISK', Greece: 'EUR', 'South Africa': 'ZAR' };
  const currency = currencyByCountry[initialCountry] || 'INR';
  const currencySymbol = currency === 'INR' ? '₹' : currency;

  const { createTrip } = useTrips();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const quickCities = ['Hyderabad', 'Goa', 'Jaipur', 'Kerala', 'Manali', 'Mumbai', 'Varanasi', 'Darjeeling'];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    try {
      setLoading(true);
      const res = await api.ai.generateItinerary({
        destination,
        daysCount,
        vibe,
        budgetTier,
        travelersCount,
        currency,
      });
      setGeneratedResult(res);
    } catch (err) {
      alert(`AI Generation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTrips = async () => {
    if (!generatedResult) return;

    const coverImages = {
      Tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'Swiss Alps': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      'Amalfi Coast': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      Reykjavik: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
      Santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    };

    const tripData = {
      title: generatedResult.title,
      destination: generatedResult.destination,
      country: generatedResult.country,
      startDate: generatedResult.startDate,
      endDate: generatedResult.endDate,
      coverImage:
        coverImages[generatedResult.destination] ||
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      totalBudget: generatedResult.totalBudget,
      currency: generatedResult.currency || currency,
      travelersCount: generatedResult.travelersCount,
      days: generatedResult.days,
      packingList: [
        { item: 'Passport & International Visa Documents', category: 'Documents', isPacked: false },
        { item: 'Universal Power Adapter & Cable Kit', category: 'Electronics', isPacked: false },
        { item: 'Weather-appropriate Layers & Footwear', category: 'Clothing', isPacked: false },
        { item: 'Personal First-Aid & Medication', category: 'Essentials', isPacked: false },
      ],
    };

    await createTrip(tripData);
    onClose();
    navigate('/itinerary');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ background: 'var(--grad-primary)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>AI Smart Itinerary Engine</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Instant tailor-made travel plans powered by WayBot</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Form / Result */}
        <div style={{ padding: '24px' }}>
          {!generatedResult ? (
            <form onSubmit={handleGenerate}>
              {/* Destination Input */}
              <div className="input-group">
                <label className="input-label">Destination City / Country</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Hyderabad, Goa, Jaipur, Kerala..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              {/* Quick Picks */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {quickCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`category-pill ${destination === city ? 'active' : ''}`}
                    style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                    onClick={() => setDestination(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Grid Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Duration</label>
                  <select
                    className="input-field"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                  >
                    <option value={3}>3 Days (Weekend)</option>
                    <option value={4}>4 Days (Explorer)</option>
                    <option value={5}>5 Days (Popular)</option>
                    <option value={7}>7 Days (Full Week)</option>
                    <option value={10}>10 Days (Grand Tour)</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Travel Vibe</label>
                  <select
                    className="input-field"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                  >
                    <option value="Adventure">Adventure & Hiking</option>
                    <option value="Culture">Culture & Heritage</option>
                    <option value="Romantic">Romantic & Scenic</option>
                    <option value="Foodie">Foodie & Culinary</option>
                    <option value="Relax">Relax & Beaches</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Budget Tier ({currency})</label>
                  <select
                    className="input-field"
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                  >
                    <option value="Budget">Backpacker ({currencySymbol})</option>
                    <option value="Moderate">Balanced ({currencySymbol}{currencySymbol})</option>
                    <option value="Luxury">Ultra Luxury ({currencySymbol}{currencySymbol}{currencySymbol})</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Travelers</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    className="input-field"
                    value={travelersCount}
                    onChange={(e) => setTravelersCount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Crafting Your Custom Itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate AI Itinerary
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Generated Itinerary Result Preview */
            <div>
              <div
                style={{
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid var(--border-active)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.2rem' }}>{generatedResult.title}</h4>
                  <span className="badge badge-emerald">{generatedResult.totalBudget.toLocaleString()} {generatedResult.currency || currency} Est.</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  💡 <strong>WayBot Insight:</strong> {generatedResult.aiInsights?.moneySavingTip}
                </p>

                {/* Day-by-Day Snippets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                  {generatedResult.days.map((day) => (
                    <div
                      key={day.dayNumber}
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                        borderLeft: '3px solid var(--primary-cyan)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                        Day {day.dayNumber}: {day.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {day.activities.map((a) => a.title).join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setGeneratedResult(null)}
                >
                  Modify Parameters
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  onClick={handleSaveToTrips}
                >
                  <Check size={18} /> Save & Open in Planner <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
