import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    bookingType: {
      type: String,
      enum: ['Flight', 'Hotel', 'Tour', 'CarRental', 'Train'],
      required: true,
    },
    title: { type: String, required: true },
    provider: { type: String, required: true }, // e.g. "ANA Airlines", "Aman Tokyo", "JR Shinkansen"
    referenceCode: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: '12:00 PM' },
    origin: { type: String, default: '' },
    destination: { type: String, required: true },
    passengerName: { type: String, default: 'Alex Nomad' },
    seatOrRoom: { type: String, default: '14A' },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Confirmed',
    },
    gateOrAddress: { type: String, default: 'Gate B22 / Terminal 2' },
    qrData: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80' },
    roomType: { type: String, default: '' },
    coordinates: { lat: { type: Number }, lng: { type: Number } },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
