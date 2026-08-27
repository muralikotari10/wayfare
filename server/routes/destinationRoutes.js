import express from 'express';
import Destination from '../models/Destination.js';
import { getDBStatus } from '../config/db.js';
import { seedDestinations } from '../seeds/seedData.js';

const router = express.Router();
let memoryDestinations = [...seedDestinations];

// @route   GET /api/destinations
// @desc    Get all destinations with search & filters
router.get('/', async (req, res) => {
  try {
    const { search, category, continent, maxCost } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { highlights: { $regex: search, $options: 'i' } },
        ];
      }
      if (category && category !== 'All') query.category = category;
      if (continent && continent !== 'All') query.continent = continent;
      if (maxCost) query.avgCostPerDay = { $lte: Number(maxCost) };

      const destinations = await Destination.find(query);
      if (destinations.length > 0) return res.json(destinations);
    }

    // Memory filter
    let results = memoryDestinations;
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }
    if (category && category !== 'All') {
      results = results.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    }
    if (continent && continent !== 'All') {
      results = results.filter((d) => d.continent.toLowerCase() === continent.toLowerCase());
    }
    if (maxCost) {
      results = results.filter((d) => d.avgCostPerDay <= Number(maxCost));
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const dest = await Destination.findById(id);
      if (dest) return res.json(dest);
    }

    const dest = memoryDestinations.find((d) => d._id === id);
    if (!dest) return res.status(404).json({ message: 'Destination not found' });
    res.json(dest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
