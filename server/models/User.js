import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    bio: {
      type: String,
      default: 'Passionate world explorer, photographer, and culture enthusiast.',
    },
    homeCountry: {
      type: String,
      default: 'United States',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    travelStyle: {
      type: [String],
      default: ['Adventure', 'Photography', 'Local Food', 'Culture'],
    },
    passportStats: {
      countriesVisited: { type: Number, default: 12 },
      tripsCompleted: { type: Number, default: 18 },
      totalMiles: { type: Number, default: 34200 },
      badges: {
        type: [String],
        default: ['Globe Trotter', 'Alpine Trekker', 'Budget Ninja', 'Foodie Master'],
      },
    },
    savedDestinations: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
