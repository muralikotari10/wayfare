import express from 'express';
import Expense from '../models/Expense.js';
import { getDBStatus } from '../config/db.js';
import { seedExpenses } from '../seeds/seedData.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
let memoryExpenses = JSON.parse(JSON.stringify(seedExpenses));

// Settle debts algorithm helper
const calculateSettlements = (expensesList) => {
  const balances = {}; // { 'Alex': +250, 'Elena': -120 }
  const categoryTotals = {};
  let totalSpent = 0;

  expensesList.forEach((exp) => {
    const amount = Number(exp.amount) || 0;
    totalSpent += amount;
    const cat = exp.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;

    const payer = exp.paidBy;
    const splits = exp.splitBetween && exp.splitBetween.length > 0 ? exp.splitBetween : [payer];
    const splitAmount = amount / splits.length;

    if (!balances[payer]) balances[payer] = 0;
    balances[payer] += amount;

    splits.forEach((person) => {
      if (!balances[person]) balances[person] = 0;
      balances[person] -= splitAmount;
    });
  });

  // Separate debtors and creditors
  const creditors = [];
  const debtors = [];

  Object.keys(balances).forEach((person) => {
    const net = Math.round(balances[person] * 100) / 100;
    if (net > 0.01) creditors.push({ person, amount: net });
    else if (net < -0.01) debtors.push({ person, amount: -net });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];
    const settleAmt = Math.min(creditor.amount, debtor.amount);

    if (settleAmt > 0.01) {
      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: Number(settleAmt.toFixed(2)),
      });
    }

    creditor.amount -= settleAmt;
    debtor.amount -= settleAmt;

    if (creditor.amount <= 0.01) cIdx++;
    if (debtor.amount <= 0.01) dIdx++;
  }

  return {
    totalSpent,
    balances,
    categoryTotals,
    settlements,
  };
};

// @route   GET /api/expenses
router.get('/', async (req, res) => {
  try {
    let list = memoryExpenses;
    if (getDBStatus()) {
      const exps = await Expense.find().sort({ createdAt: -1 });
      if (exps.length > 0) list = exps;
    }
    const settlementData = calculateSettlements(list);
    res.json({
      expenses: list,
      ...settlementData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/expenses
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, category, paidBy, splitBetween, date, notes } = req.body;
    if (!title || !amount || !paidBy) {
      return res.status(400).json({ message: 'Title, amount, and payer are required' });
    }

    const splits = splitBetween && splitBetween.length > 0 ? splitBetween : [paidBy];

    if (getDBStatus()) {
      const exp = await Expense.create({
        title,
        amount: Number(amount),
        category: category || 'Food',
        paidBy,
        splitBetween: splits,
        date: date || new Date().toISOString().split('T')[0],
        notes: notes || '',
      });
      return res.status(201).json(exp);
    }

    const newExp = {
      _id: `exp-${Date.now()}`,
      title,
      amount: Number(amount),
      currency: 'USD',
      category: category || 'Food',
      paidBy,
      splitBetween: splits,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    memoryExpenses.unshift(newExp);
    res.status(201).json(newExp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/expenses/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await Expense.findByIdAndDelete(id);
    }
    memoryExpenses = memoryExpenses.filter((e) => e._id !== id);
    res.json({ message: 'Expense deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
