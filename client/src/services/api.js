const API_BASE = 'https://wayfare-backend.onrender.com/api';
const TRIPS_API_URL = 'https://wayfare-backend.onrender.com/api/trips';

const getAuthHeaders = () => {
  const token = localStorage.getItem('wayfare_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : { message: await res.text() };
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const api = {
  recommendations: {
    getNearby: async (lat, lon, category) => {
      const query = new URLSearchParams({ lat, lon, category }).toString();
      const res = await fetch(`${API_BASE}/recommendations/nearby?${query}`);
      return handleResponse(res);
    },
  },
  // Auth
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },
    demoLogin: async () => {
      const res = await fetch(`${API_BASE}/auth/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    updateProfile: async (data) => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Destinations
  destinations: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/destinations${query ? `?${query}` : ''}`);
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/destinations/${id}`);
      return handleResponse(res);
    },
  },

  // Trips
  trips: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/trips`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/trips/${id}`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    create: async (tripData) => {
      const res = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tripData),
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_BASE}/trips/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    addActivity: async (tripId, dayNumber, activity) => {
      const res = await fetch(`${API_BASE}/trips/${tripId}/activities`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dayNumber, activity }),
      });
      return handleResponse(res);
    },
    toggleActivity: async (tripId, actId) => {
      const res = await fetch(`${API_BASE}/trips/${tripId}/activities/${actId}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    addPackingItem: async (tripId, item, category) => {
      const res = await fetch(`${API_BASE}/trips/${tripId}/packing`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ item, category }),
      });
      return handleResponse(res);
    },
    togglePackingItem: async (tripId, packId) => {
      const res = await fetch(`${API_BASE}/trips/${tripId}/packing/${packId}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/trips/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Bookings
  bookings: {
    getHotels: async (destination = '') => {
      const query = destination ? `?destination=${encodeURIComponent(destination)}` : '';
      const res = await fetch(`${API_BASE}/bookings/hotels${query}`);
      return handleResponse(res);
    },
    getAll: async () => {
      const res = await fetch(`${API_BASE}/bookings`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    create: async (bookingData) => {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Splitfare Expenses
  expenses: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/expenses`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    create: async (expenseData) => {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(expenseData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Community Posts
  posts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/posts`, { headers: getAuthHeaders() });
      return handleResponse(res);
    },
    create: async (postData) => {
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData),
      });
      return handleResponse(res);
    },
    like: async (id) => {
      const res = await fetch(`${API_BASE}/posts/${id}/like`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    addComment: async (id, content) => {
      const res = await fetch(`${API_BASE}/posts/${id}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });
      return handleResponse(res);
    },
  },

  // AI Itinerary Planner
  ai: {
    generateItinerary: async (params) => {
      const res = await fetch(`${API_BASE}/ai/generate-itinerary`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params),
      });
      return handleResponse(res);
    },
  },
};

export const getTrips = async () => {
  const response = await fetch(TRIPS_API_URL, { headers: getAuthHeaders() });
  return handleResponse(response);
};

export const fetchTrips = getTrips;

export const createTrip = async (tripData) => {
  const response = await fetch(TRIPS_API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(tripData),
  });
  return handleResponse(response);
};

export const updateTrip = async (id, data) => {
  const response = await fetch(`${TRIPS_API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
