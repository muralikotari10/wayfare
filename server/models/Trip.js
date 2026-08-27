import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  time: { type: String, default: '10:00 AM' },
  title: { type: String, required: true },
  location: { type: String, default: '' },
  cost: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ['Flight', 'Hotel', 'Food', 'Sightseeing', 'Activity', 'Transport', 'Nightlife', 'Relax'],
    default: 'Sightseeing',
  },
  notes: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
});

const dayPlanSchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: String, default: '' },
  title: { type: String, default: '' },
  activities: [activitySchema],
});

const packingItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  category: { type: String, default: 'Essentials' },
  isPacked: { type: Boolean, default: false },
});

const subPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  visited: { type: Boolean, default: false },
});

const checklistSchema = new mongoose.Schema({
  item: { type: String, required: true },
  packed: { type: Boolean, default: false },
});

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userName: { type: String, default: 'Alex Nomad' },
    userAvatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    title: { type: String, required: true },
    destination: { type: String, required: true },
    country: { type: String, default: '' },
    startDate: { type: Date },
    endDate: { type: Date },
    coverImage: { type: String, default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80' },
    totalBudget: { type: Number, default: 1500 },
    currency: { type: String, default: 'USD' },
    travelersCount: { type: Number, default: 2 },
    isPublic: { type: Boolean, default: true },
    status: { type: String, enum: ['Planning', 'Active', 'Completed'], default: 'Planning' },
    days: [dayPlanSchema],
    packingList: [packingItemSchema],
    subPlaces: [subPlaceSchema],
    checklist: [checklistSchema],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
export default Trip;
