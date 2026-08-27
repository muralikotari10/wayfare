import React, { useState } from 'react';
import { X, DollarSign, ArrowRightLeft, TrendingUp } from 'lucide-react';

export const CurrencyConverterModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState(100);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('JPY');

  const rates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 154.5,
    CHF: 0.91,
    IDR: 16250.0,
    CAD: 1.37,
    AUD: 1.52,
    SGD: 1.35,
    ZAR: 18.6,
    ISK: 139.2,
    AED: 3.67,
    INR: 83.4,
  };

  if (!isOpen) return null;

  const converted = ((amount / (rates[fromCurr] || 1)) * (rates[toCurr] || 1)).toFixed(2);

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ background: 'var(--grad-aurora)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Live Travel Currency Exchange</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Real-time cross-currency converter & rate trends</p>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Amount input */}
          <div className="input-group">
            <label className="input-label">Amount</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          {/* Currency pickers with swap */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label">From</label>
              <select
                className="input-field"
                value={fromCurr}
                onChange={(e) => setFromCurr(e.target.value)}
              >
                {Object.keys(rates).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-icon"
              style={{ marginTop: '22px' }}
              onClick={handleSwap}
              title="Swap Currencies"
            >
              <ArrowRightLeft size={16} />
            </button>

            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="input-label">To</label>
              <select
                className="input-field"
                value={toCurr}
                onChange={(e) => setToCurr(e.target.value)}
              >
                {Object.keys(rates).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {amount} {fromCurr} =
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
              {Number(converted).toLocaleString()} {toCurr}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              1 {fromCurr} ≈ {(rates[toCurr] / rates[fromCurr]).toFixed(4)} {toCurr}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
