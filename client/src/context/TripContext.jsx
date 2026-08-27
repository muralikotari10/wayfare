import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await api.trips.getAll();
      setTrips(data);
      if (data.length > 0 && !activeTrip) {
        setActiveTrip(data[0]);
      } else if (activeTrip) {
        const refreshed = data.find((t) => t._id === activeTrip._id);
        if (refreshed) setActiveTrip(refreshed);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const createTrip = async (tripData) => {
    const newTrip = await api.trips.create(tripData);
    setTrips((prev) => [newTrip, ...prev]);
    setActiveTrip(newTrip);
    
    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981'],
    });

    return newTrip;
  };

  const addActivity = async (tripId, dayNumber, activity) => {
    const updated = await api.trips.addActivity(tripId, dayNumber, activity);
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const toggleActivity = async (tripId, actId) => {
    const updated = await api.trips.toggleActivity(tripId, actId);
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const addPackingItem = async (tripId, item, category) => {
    const updated = await api.trips.addPackingItem(tripId, item, category);
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const togglePackingItem = async (tripId, packId) => {
    const updated = await api.trips.togglePackingItem(tripId, packId);
    setTrips((prev) => prev.map((t) => (t._id === tripId ? updated : t)));
    if (activeTrip?._id === tripId) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteTrip = async (tripId) => {
    await api.trips.delete(tripId);
    setTrips((prev) => prev.filter((t) => t._id !== tripId));
    if (activeTrip?._id === tripId) {
      setActiveTrip(trips.find((t) => t._id !== tripId) || null);
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        setActiveTrip,
        loading,
        fetchTrips,
        createTrip,
        addActivity,
        toggleActivity,
        addPackingItem,
        togglePackingItem,
        deleteTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => useContext(TripContext);
