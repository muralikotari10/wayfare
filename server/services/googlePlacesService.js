const GOOGLE_PLACES_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';

export const GOOGLE_PLACE_TYPES = [
  'tourist_attraction',
  'hospital',
  'gas_station',
  'restaurant',
  'lodging',
  'movie_theater',
  'gym',
];

const fields = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.formattedAddress',
  'places.rating',
  'places.internationalPhoneNumber',
  'places.primaryType',
  'places.editorialSummary',
  'places.googleMapsUri',
].join(',');

const asFiniteNumber = (value, name) => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${name} must be a valid number`);
  return number;
};

export const searchGoogleNearbyPlaces = async ({ latitude, longitude, radius, types = GOOGLE_PLACE_TYPES }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    const error = new Error('GOOGLE_MAPS_API_KEY is not configured');
    error.statusCode = 503;
    throw error;
  }

  const lat = asFiniteNumber(latitude, 'latitude');
  const lng = asFiniteNumber(longitude, 'longitude');
  const searchRadius = asFiniteNumber(radius, 'radius');
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) throw new Error('Coordinates are outside valid ranges');
  if (searchRadius < 1 || searchRadius > 50000) throw new Error('radius must be between 1 and 50000 metres');

  const requestedTypes = Array.isArray(types) ? types.filter((type) => GOOGLE_PLACE_TYPES.includes(type)) : GOOGLE_PLACE_TYPES;
  if (!requestedTypes.length) throw new Error(`types must include one of: ${GOOGLE_PLACE_TYPES.join(', ')}`);

  const response = await fetch(GOOGLE_PLACES_NEARBY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fields,
    },
    body: JSON.stringify({
      includedTypes: requestedTypes,
      maxResultCount: 20,
      locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: searchRadius } },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'Google Places request failed');
    error.statusCode = response.status >= 500 ? 502 : response.status;
    throw error;
  }

  return (payload.places || []).map((place) => ({
    id: place.id,
    name: place.displayName?.text || 'Unnamed place',
    description: place.editorialSummary?.text || '',
    coordinates: {
      lat: place.location?.latitude ?? null,
      lng: place.location?.longitude ?? null,
    },
    address: place.formattedAddress || '',
    rating: place.rating ?? null,
    phone: place.internationalPhoneNumber || null,
    primaryType: place.primaryType || null,
    googleMapsUri: place.googleMapsUri || null,
  }));
};
