import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: false },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    category: {
      type: String,
      enum: ['Food', 'Accommodation', 'Transport', 'Activities', 'Shopping', 'Other'],
      default: 'Food',
    },
    paidBy: { type: String, required: true }, // e.g. "Alex"
    splitBetween: [{ type: String }], // e.g. ["Alex", "Elena", "Marcus", "Sora"]
    date: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
export default Expense;
