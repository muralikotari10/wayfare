import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Curated destination templates with smart generative builder
const destinationActivityTemplates = {
  Tokyo: [
    { title: 'Sunrise visit to Meiji Jingu Shrine', category: 'Culture', cost: 0, time: '07:30 AM' },
    { title: 'Morning Matcha & Souffle Pancakes in Harajuku', category: 'Food', cost: 16, time: '09:30 AM' },
    { title: 'Shibuya Crossing & Hachiko Statue', category: 'Sightseeing', cost: 0, time: '11:30 AM' },
    { title: 'Omakase Sushi Lunch at Ginza Kyubey', category: 'Food', cost: 65, time: '01:00 PM' },
    { title: 'TeamLab Planets Immersive Digital Art', category: 'Activity', cost: 32, time: '03:30 PM' },
    { title: 'Shibuya Sky 360 Observation Sunset', category: 'Sightseeing', cost: 22, time: '06:00 PM' },
    { title: 'Yakitori Dinner & Highballs in Omoide Yokocho', category: 'Food', cost: 28, time: '08:00 PM' },
    { title: 'Asakusa Senso-ji Temple & Street Snacks', category: 'Culture', cost: 12, time: '09:00 AM' },
    { title: 'Akihabara Retro Gaming & Anime Arcades', category: 'Activity', cost: 20, time: '02:00 PM' },
    { title: 'Night cruise on Sumida River to Odaiba', category: 'Relax', cost: 30, time: '07:00 PM' },
  ],
  Bali: [
    { title: 'Mount Batur Sunrise Volcano Trek & Hot Springs', category: 'Adventure', cost: 45, time: '04:00 AM' },
    { title: 'Açaí Bowl & Organic Coffee in Ubud', category: 'Food', cost: 9, time: '09:00 AM' },
    { title: 'Tegallalang Sacred Rice Terrace Walk & Swing', category: 'Sightseeing', cost: 15, time: '11:00 AM' },
    { title: 'Sacred Monkey Forest Sanctuary Ubud', category: 'Nature', cost: 7, time: '02:00 PM' },
    { title: 'Sunset Cocktails at Rock Bar Jimbaran', category: 'Relax', cost: 35, time: '05:30 PM' },
    { title: 'Candlelight Seafood BBQ on Jimbaran Beach', category: 'Food', cost: 25, time: '07:30 PM' },
    { title: 'Speedboat to Nusa Penida & Kelingking T-Rex Cliff', category: 'Adventure', cost: 60, time: '08:00 AM' },
    { title: 'Snorkeling with Manta Rays at Crystal Bay', category: 'Activity', cost: 30, time: '01:00 PM' },
    { title: 'Uluwatu Cliffside Temple & Kecak Fire Dance', category: 'Culture', cost: 18, time: '06:00 PM' },
  ],
  'Swiss Alps': [
    { title: 'Gornergrat Cogwheel Train to 3,100m Viewpoint', category: 'Sightseeing', cost: 95, time: '08:30 AM' },
    { title: '5-Lakes Alpine Trail Hike with Matterhorn Reflection', category: 'Adventure', cost: 0, time: '10:30 AM' },
    { title: 'Alpine Chalet Lunch with Swiss Fondue & Rösti', category: 'Food', cost: 42, time: '01:30 PM' },
    { title: 'Matterhorn Glacier Paradise Ice Palace', category: 'Activity', cost: 85, time: '03:30 PM' },
    { title: 'Apres-Ski Lounge with Hot Spiced Glühwein', category: 'Nightlife', cost: 20, time: '06:30 PM' },
    { title: 'Fine Dining Swiss Raclette by the Fireplace', category: 'Food', cost: 55, time: '08:00 PM' },
  ],
  General: [
    { title: 'Morning Walking Tour & Old Town Historic Quarter', category: 'Culture', cost: 15, time: '09:00 AM' },
    { title: 'Artisan Cafe & Local Bakery Specialty', category: 'Food', cost: 12, time: '11:00 AM' },
    { title: 'Iconic City Landmark & Panoramic Rooftop View', category: 'Sightseeing', cost: 25, time: '01:30 PM' },
    { title: 'Scenic River Walk & Local Market Exploration', category: 'Activity', cost: 10, time: '04:00 PM' },
    { title: 'Golden Hour Sunset Viewpoint & Photography', category: 'Relax', cost: 0, time: '06:30 PM' },
    { title: 'Traditional Multi-course Local Dinner Experience', category: 'Food', cost: 40, time: '08:00 PM' },
  ],
};

// @route   POST /api/ai/generate-itinerary
// @desc    Generate personalized travel itinerary
router.post('/generate-itinerary', protect, async (req, res) => {
  try {
    const { destination, daysCount = 3, vibe = 'Adventure', budgetTier = 'Moderate', travelersCount = 2, currency = 'INR' } = req.body;

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    const duration = Math.min(Math.max(Number(daysCount) || 3, 1), 10);
    const destKey = Object.keys(destinationActivityTemplates).find((k) =>
      destination.toLowerCase().includes(k.toLowerCase())
    );
    const pool = destKey ? destinationActivityTemplates[destKey] : destinationActivityTemplates.General;

    const multiplier = budgetTier === 'Luxury' ? 2.2 : budgetTier === 'Budget' ? 0.6 : 1.0;
    const currencyRates = { USD: 1, INR: 83, JPY: 155, EUR: 0.92, IDR: 16000, CHF: 0.9, ISK: 140, ZAR: 18 };
    const currencyRate = currencyRates[currency] || 1;
    const generatedDays = [];
    let dayTotalEstimate = 0;

    for (let dayNum = 1; dayNum <= duration; dayNum++) {
      const startIdx = ((dayNum - 1) * 3) % pool.length;
      const dayActivities = [];

      for (let j = 0; j < 3; j++) {
        const item = pool[(startIdx + j) % pool.length];
        const scaledCost = Math.round(item.cost * multiplier * currencyRate);
        dayTotalEstimate += scaledCost;

        dayActivities.push({
          _id: `act-gen-${dayNum}-${j}-${Date.now()}`,
          time: item.time,
          title: item.title,
          location: `${destination} City Area`,
          cost: scaledCost,
          category: item.category,
          notes: `Optimized for ${vibe} & ${budgetTier} travel vibe.`,
          completed: false,
          coordinates: { lat: 0, lng: 0 },
        });
      }

      generatedDays.push({
        dayNumber: dayNum,
        date: new Date(Date.now() + (dayNum - 1) * 86400000).toISOString().split('T')[0],
        title: `Day ${dayNum}: ${destination} ${dayNum === 1 ? 'Arrival & Highlights' : dayNum === duration ? 'Grand Finale' : 'Immersion & Adventure'}`,
        activities: dayActivities,
      });
    }

    const calculatedTotalBudget = Math.round((dayTotalEstimate + duration * (budgetTier === 'Luxury' ? 300 : budgetTier === 'Budget' ? 60 : 140) * currencyRate) * Number(travelersCount));

    const smartItinerary = {
      title: `${duration}-Day ${vibe} Expedition in ${destination}`,
      destination,
      country: destination,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
      totalBudget: calculatedTotalBudget,
      currency,
      travelersCount: Number(travelersCount),
      vibe,
      budgetTier,
      days: generatedDays,
      aiInsights: {
        bestTimeToVisit: 'Spring & Autumn for prime weather and moderate crowds',
        dailyPace: 'Balanced (3 curated highlights per day + free leisure time)',
        moneySavingTip: budgetTier === 'Budget' ? 'Use public transit passes and eat at local street stalls' : 'Book sunset viewpoints 2 weeks ahead',
      },
    };

    res.json(smartItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
