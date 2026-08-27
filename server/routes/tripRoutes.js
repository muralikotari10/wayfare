import express from 'express';
import Trip from '../models/Trip.js';
import { getDBStatus } from '../config/db.js';
import { seedTrips } from '../seeds/seedData.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
let memoryTrips = JSON.parse(JSON.stringify(seedTrips));

// @route   GET /api/trips
// @desc    Get all trips
router.get('/', async (req, res) => {
  try {
    if (getDBStatus()) {
      const trips = await Trip.find().sort({ createdAt: -1 });
      if (trips.length > 0) return res.json(trips);
    }
    res.json(memoryTrips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/trips/:id
// @desc    Get trip by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const trip = await Trip.findById(id);
      if (trip) return res.json(trip);
    }

    const trip = memoryTrips.find((t) => t._id === id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/trips
// @desc    Create new trip
router.post('/', protect, async (req, res) => {
  try {
    const { title, destination, country, startDate, endDate, coverImage, totalBudget, currency, travelersCount, days, packingList } = req.body;

    const defaultDays = days || [
      {
        dayNumber: 1,
        date: startDate || new Date().toISOString().split('T')[0],
        title: `Welcome to ${destination || 'Adventure'}`,
        activities: [],
      },
    ];

    const defaultPacking = packingList || [
      { item: 'Passport & Travel Documents', category: 'Documents', isPacked: false },
      { item: 'Universal Power Adapter', category: 'Electronics', isPacked: false },
      { item: 'Comfortable Walking Shoes', category: 'Clothing', isPacked: false },
    ];

    if (getDBStatus()) {
      const newTrip = await Trip.create({
        userId: req.user?.id,
        userName: req.user?.name || 'Alex Nomad',
        title,
        destination,
        country: country || destination,
        startDate,
        endDate,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        totalBudget: totalBudget || 1500,
        currency: currency || 'USD',
        travelersCount: travelersCount || 1,
        days: defaultDays,
        packingList: defaultPacking,
        subPlaces: req.body.subPlaces || [],
        checklist: req.body.checklist || [],
      });
      return res.status(201).json(newTrip);
    }

    const newTrip = {
      _id: `trip-${Date.now()}`,
      userId: req.user?.id || 'user-demo-1',
      userName: req.user?.name || 'Alex Nomad',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      title: title || `Trip to ${destination}`,
      destination: destination || 'New Destination',
      country: country || 'Explore',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      totalBudget: Number(totalBudget) || 1500,
      currency: currency || 'USD',
      travelersCount: Number(travelersCount) || 1,
      isPublic: true,
      status: 'Active',
      days: defaultDays,
      packingList: defaultPacking,
      subPlaces: req.body.subPlaces || [],
      checklist: req.body.checklist || [],
      notes: '',
      createdAt: new Date().toISOString(),
    };

    memoryTrips.unshift(newTrip);
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update trip details, sub-places, or checklist items
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedTrip) return res.status(404).json({ error: 'Trip not found' });
      return res.json(updatedTrip);
    }

    const index = memoryTrips.findIndex((t) => t._id === id);
    if (index === -1) return res.status(404).json({ error: 'Trip not found' });

    memoryTrips[index] = { ...memoryTrips[index], ...req.body };
    res.json(memoryTrips[index]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   POST /api/trips/:id/activities
// @desc    Add activity to a specific day
router.post('/:id/activities', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { dayNumber, activity } = req.body;

    if (getDBStatus()) {
      const trip = await Trip.findById(id);
      if (!trip) return res.status(404).json({ message: 'Trip not found' });

      let day = trip.days.find((d) => d.dayNumber === dayNumber);
      if (!day) {
        trip.days.push({ dayNumber, date: '', title: `Day ${dayNumber}`, activities: [] });
        day = trip.days[trip.days.length - 1];
      }
      day.activities.push(activity);
      await trip.save();
      return res.json(trip);
    }

    const trip = memoryTrips.find((t) => t._id === id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    let day = trip.days.find((d) => d.dayNumber === dayNumber);
    if (!day) {
      day = { dayNumber, date: '', title: `Day ${dayNumber}`, activities: [] };
      trip.days.push(day);
    }

    const newAct = {
      _id: `act-${Date.now()}`,
      time: activity.time || '10:00 AM',
      title: activity.title || 'New Activity',
      location: activity.location || '',
      cost: Number(activity.cost) || 0,
      category: activity.category || 'Sightseeing',
      notes: activity.notes || '',
      completed: false,
      coordinates: activity.coordinates || { lat: 0, lng: 0 },
    };

    day.activities.push(newAct);
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/trips/:id/activities/:actId/toggle
// @desc    Toggle activity completed status
router.patch('/:id/activities/:actId/toggle', protect, async (req, res) => {
  try {
    const { id, actId } = req.params;
    const trip = memoryTrips.find((t) => t._id === id);
    if (trip) {
      for (const day of trip.days) {
        const act = day.activities.find((a) => a._id === actId);
        if (act) {
          act.completed = !act.completed;
          return res.json(trip);
        }
      }
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/trips/:id/packing
// @desc    Add packing item
router.post('/:id/packing', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { item, category } = req.body;
    const trip = memoryTrips.find((t) => t._id === id);
    if (trip) {
      trip.packingList.push({
        _id: `pack-${Date.now()}`,
        item,
        category: category || 'Essentials',
        isPacked: false,
      });
      return res.json(trip);
    }
    res.status(404).json({ message: 'Trip not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/trips/:id/packing/:packId/toggle
router.patch('/:id/packing/:packId/toggle', protect, async (req, res) => {
  try {
    const { id, packId } = req.params;
    const trip = memoryTrips.find((t) => t._id === id);
    if (trip) {
      const item = trip.packingList.find((p) => p._id === packId || p.item === packId);
      if (item) item.isPacked = !item.isPacked;
      return res.json(trip);
    }
    res.status(404).json({ message: 'Trip not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/trips/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await Trip.findByIdAndDelete(id);
    }
    memoryTrips = memoryTrips.filter((t) => t._id !== id);
    res.json({ message: 'Trip deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
