import React, { useState } from 'react';
import { X, Leaf, Plane, TreePine, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CarbonCalculatorModal = ({ isOpen, onClose }) => {
  const [flightDistanceMiles, setFlightDistanceMiles] = useState(5120);
  const [passengers, setPassengers] = useState(2);
  const [treesPlanted, setTreesPlanted] = useState(0);

  if (!isOpen) return null;

  // Approx 0.15 kg CO2 per passenger mile on long-haul
  const totalCO2Kg = Math.round(flightDistanceMiles * 0.15 * passengers);
  const totalCO2Tons = (totalCO2Kg / 1000).toFixed(2);
  const treesNeeded = Math.ceil(totalCO2Kg / 22); // 1 mature tree absorbs ~22kg CO2/year

  const handlePlantTrees = () => {
    setTreesPlanted(treesNeeded);
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#06b6d4'],
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ background: 'var(--grad-aurora)' }}>
              <Leaf size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Eco Travel & Carbon Offset</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Flight emission estimator & green forest offset badge</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Flight Distance (Miles)</label>
              <input
                type="number"
                min={100}
                className="input-field"
                value={flightDistanceMiles}
                onChange={(e) => setFlightDistanceMiles(Number(e.target.value))}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Passengers</label>
              <input
                type="number"
                min={1}
                max={10}
                className="input-field"
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Impact summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total CO2 Footprint</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e', margin: '4px 0' }}>{totalCO2Tons} t</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>({totalCO2Kg.toLocaleString()} kg CO2e)</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Offset Equivalent</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '4px 0' }}>{treesNeeded}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Trees to plant</div>
            </div>
          </div>

          {treesPlanted > 0 ? (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <CheckCircle size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 10px auto' }} />
              <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '4px' }}>Carbon Neutral Certified!</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                You have successfully sponsored <strong>{treesPlanted} Native Trees</strong> through the Wayfare Green Canopy Project.
              </p>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', background: 'var(--grad-aurora)' }}
              onClick={handlePlantTrees}
            >
              <TreePine size={18} /> Offset Trip by Planting {treesNeeded} Trees ($12.00)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
