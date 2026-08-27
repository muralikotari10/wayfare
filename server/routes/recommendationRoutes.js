import express from 'express';

const router = express.Router();
const OVERPASS_URL = 'https://overpass.kumi.systems/api/interpreter';

const selectors = {
  tourism: '["tourism"]',
  accommodation: '["tourism"~"hotel|guest_house|hostel"]',
  food: '["amenity"~"restaurant|cafe|fast_food"]',
  fuel: '["amenity"="fuel"]',
  health: '["amenity"~"hospital|pharmacy|clinic"]',
  safety: '["amenity"~"police|fire_station"]',
  essentials: '["amenity"~"atm|bank"]',
  theatre: '["amenity"="cinema"]',
  parks: '["leisure"~"park|water_park|garden|nature_reserve"]',
};

router.get('/nearby', async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  const category = selectors[req.query.category] ? req.query.category : 'tourism';
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return res.status(400).json({ message: 'Valid latitude and longitude are required.' });

  try {
    const radius = category === 'tourism' ? 30000 : 10000;
    const query = `[out:json][timeout:60];nwr(around:${radius},${lat},${lon})${selectors[category]};out center tags;`;
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({ data: query }),
    });
    if (!response.ok) return res.status(502).json({ message: 'Nearby map data is temporarily unavailable.' });
    const data = await response.json();
    const elements = (data.elements || []).filter((item) => item.tags?.name || item.tags?.['name:en']);
    res.json({ category, radius, total: elements.length, lastUpdated: new Date().toISOString(), elements });
  } catch (error) {
    res.status(502).json({ message: 'Nearby map data is temporarily unavailable.' });
  }
});

export default router;