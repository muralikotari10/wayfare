import React, { useState } from 'react';
import { X, Receipt, DollarSign, Users, Tag } from 'lucide-react';

export const AddExpenseModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('Alex');
  const [splitBetween, setSplitBetween] = useState(['Alex', 'Elena', 'Marcus', 'Sora']);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const groupMembers = ['Alex', 'Elena', 'Marcus', 'Sora', 'Maya', 'Lucas'];

  const toggleMember = (member) => {
    if (splitBetween.includes(member)) {
      if (splitBetween.length > 1) {
        setSplitBetween(splitBetween.filter((m) => m !== member));
      }
    } else {
      setSplitBetween([...splitBetween, member]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    onAdd({
      title,
      amount: Number(amount),
      category,
      paidBy,
      splitBetween,
      notes,
      date: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ background: 'var(--grad-sunset)' }}>
              <Receipt size={20} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Log Group Expense</h3>
          </div>
          <button className="btn btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div className="input-group">
            <label className="input-label">Expense Description</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Seafood Dinner at Amalfi Port"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label className="input-label">Amount ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="input-field"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food & Dining</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Transport">Transport & Flights</option>
                <option value="Activities">Activities & Tours</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Who Paid?</label>
            <select
              className="input-field"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {groupMembers.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Split Between ({splitBetween.length} people)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {groupMembers.map((m) => {
                const isSelected = splitBetween.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    className={`category-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => toggleMember(m)}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            {amount && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-cyan)', marginTop: '8px' }}>
                Per Person: ${(Number(amount) / splitBetween.length).toFixed(2)}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
            <Receipt size={18} /> Record Split Expense
          </button>
        </form>
      </div>
    </div>
  );
};
