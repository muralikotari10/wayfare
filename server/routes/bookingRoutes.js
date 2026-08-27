import express from 'express';
import Booking from '../models/Booking.js';
import { getDBStatus } from '../config/db.js';
import { seedBookings } from '../seeds/seedData.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
let memoryBookings = JSON.parse(JSON.stringify(seedBookings));

const indiaHotels = [
  {
    _id: 'hotel-hyderabad-1', name: 'The Westin Hyderabad Mindspace', city: 'Hyderabad', area: 'HITEC City', rating: 4.7,
    coordinates: { lat: 17.4435, lng: 78.3772 }, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    rooms: [{ type: 'Deluxe King', price: 7800, available: 4 }, { type: 'Executive Suite', price: 12600, available: 2 }, { type: 'Presidential Suite', price: 24500, available: 1 }],
  },
  {
    _id: 'hotel-goa-1', name: 'Taj Fort Aguada Resort & Spa', city: 'Goa', area: 'Sinquerim Beach', rating: 4.8,
    coordinates: { lat: 15.4922, lng: 73.7739 }, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    rooms: [{ type: 'Garden View Room', price: 9200, available: 6 }, { type: 'Sea View Villa', price: 16800, available: 3 }, { type: 'Luxury Suite', price: 28900, available: 1 }],
  },
  {
    _id: 'hotel-jaipur-1', name: 'Rambagh Palace', city: 'Jaipur', area: 'Bhawani Singh Road', rating: 4.9,
    coordinates: { lat: 26.8958, lng: 75.8067 }, image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80',
    rooms: [{ type: 'Palace Room', price: 18500, available: 3 }, { type: 'Historical Suite', price: 32500, available: 2 }, { type: 'Grand Royal Suite', price: 78000, available: 1 }],
  },
  {
    _id: 'hotel-kerala-1', name: 'Kumarakom Lake Resort', city: 'Kerala', area: 'Vembanad Lake', rating: 4.8,
    coordinates: { lat: 9.6176, lng: 76.4304 }, image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=900&q=80',
    rooms: [{ type: 'Heritage Room', price: 11200, available: 5 }, { type: 'Pool Villa', price: 19800, available: 3 }, { type: 'Lake View Villa', price: 26400, available: 2 }],
  },
  {
    _id: 'hotel-mumbai-1', name: 'Taj Mahal Palace Mumbai', city: 'Mumbai', area: 'Colaba', rating: 4.8,
    coordinates: { lat: 18.9217, lng: 72.8332 }, image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=80',
    rooms: [{ type: 'Luxury City Room', price: 14500, available: 4 }, { type: 'Sea View Room', price: 21900, available: 2 }, { type: 'Taj Club Suite', price: 42000, available: 1 }],
  },
];

// Live-style inventory endpoint. Replace this source with a hotel provider later without changing the client contract.
router.get('/hotels', (req, res) => {
  const query = String(req.query.destination || '').toLowerCase();
  const filteredHotels = query ? indiaHotels.filter((hotel) => `${hotel.city} ${hotel.area}`.toLowerCase().includes(query)) : indiaHotels;
  const now = new Date().toISOString();
  res.json({
    currency: 'INR',
    lastUpdated: now,
    source: 'Wayfare live inventory',
    hotels: filteredHotels.map((hotel) => ({
      ...hotel,
      rooms: hotel.rooms.map((room) => ({
        ...room,
        price: Math.round(room.price * (0.96 + Math.random() * 0.08)),
        available: Math.max(1, room.available + Math.floor(Math.random() * 3) - 1),
      })),
    })),
  });
});

// @route   GET /api/bookings
router.get('/', async (req, res) => {
  try {
    if (getDBStatus()) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      if (bookings.length > 0) return res.json(bookings);
    }
    res.json(memoryBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create / Simulate a booking
router.post('/', protect, async (req, res) => {
  try {
    const {
      bookingType,
      title,
      provider,
      date,
      time,
      origin,
      destination,
      passengerName,
      seatOrRoom,
      price,
      currency,
      gateOrAddress,
      image,
      roomType,
      coordinates,
    } = req.body;

    const refPrefix = bookingType === 'Flight' ? 'FLT' : bookingType === 'Hotel' ? 'HTL' : 'ACT';
    const referenceCode = `${refPrefix}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const qrData = `WAYFARE-${bookingType.toUpperCase()}-${referenceCode}-${(passengerName || 'TRAVELER').replace(/\s+/g, '_').toUpperCase()}`;

    if (getDBStatus()) {
      const booking = await Booking.create({
        userId: req.user?.id,
        bookingType: bookingType || 'Flight',
        title,
        provider: provider || 'Wayfare Partner',
        referenceCode,
        date: date || new Date().toISOString().split('T')[0],
        time: time || '12:00 PM',
        origin: origin || 'City Center',
        destination,
        passengerName: passengerName || req.user?.name || 'Alex Nomad',
        seatOrRoom: seatOrRoom || '14A',
        price: Number(price) || 150,
        currency: currency || 'USD',
        status: 'Confirmed',
        gateOrAddress: gateOrAddress || 'Terminal / Main Reception',
        qrData,
        image:
          image ||
          'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        roomType,
        coordinates,
      });
      return res.status(201).json(booking);
    }

    const newBooking = {
      _id: `book-${Date.now()}`,
      userId: req.user?.id || 'user-demo-1',
      bookingType: bookingType || 'Flight',
      title: title || `${bookingType} Booking`,
      provider: provider || 'Wayfare Global',
      referenceCode,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '12:00 PM',
      origin: origin || 'Departure Hub',
      destination: destination || 'Destination Hub',
      passengerName: passengerName || req.user?.name || 'Alex Nomad',
      seatOrRoom: seatOrRoom || '14A',
      price: Number(price) || 150,
      currency: currency || 'USD',
      status: 'Confirmed',
      gateOrAddress: gateOrAddress || 'Gate / Terminal 1',
      qrData,
      image:
        image ||
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      roomType,
      coordinates,
      createdAt: new Date().toISOString(),
    };

    memoryBookings.unshift(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/bookings/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await Booking.findByIdAndDelete(id);
    }
    memoryBookings = memoryBookings.filter((b) => b._id !== id);
    res.json({ message: 'Booking cancelled successfully', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
