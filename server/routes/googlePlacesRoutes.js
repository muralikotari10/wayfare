import express from 'express';
import { GOOGLE_PLACE_TYPES, searchGoogleNearbyPlaces } from '../services/googlePlacesService.js';

const router = express.Router();

router.post('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius, types } = req.body;
    const places = await searchGoogleNearbyPlaces({ latitude, longitude, radius, types });
    res.json({ source: 'Google Places API (New)', types: types || GOOGLE_PLACE_TYPES, total: places.length, places });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

export default router;