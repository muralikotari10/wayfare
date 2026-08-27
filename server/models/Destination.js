import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    continent: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    category: {
      type: String,
      enum: ['Adventure', 'Beaches', 'Culture', 'Romantic', 'City', 'Nature', 'Luxury', 'Budget'],
      default: 'Adventure',
    },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 120 },
    avgCostPerDay: { type: Number, required: true }, // in USD
    currency: { type: String, default: 'USD' },
    bestTimeToVisit: { type: String, default: 'Spring & Autumn' },
    weather: {
      temp: { type: Number, default: 22 },
      condition: { type: String, default: 'Sunny' },
      humidity: { type: String, default: '45%' },
    },
    highlights: [{ type: String }],
    localEats: [{ type: String }],
    safetyRating: { type: String, default: 'Very Safe (9.4/10)' },
    visaRequirement: { type: String, default: 'Visa Free / E-Visa available' },
  },
  { timestamps: true }
);

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
export default Destination;
