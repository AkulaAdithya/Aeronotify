import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aeronotify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────
export const loginAdmin = (email, password) =>
  api.post("/auth/login", { email, password });

// ─── Flights ─────────────────────────────────────────────────
export const getAllFlights = () => api.get("/flights");

export const getFlightByNumber = (flightNumber) =>
  api.get(`/flights/${flightNumber}`);

export const createFlight = (flightData) =>
  api.post("/flights", flightData);

export const updateFlight = (id, flightData) =>
  api.put(`/flights/${id}`, flightData);

export const deleteFlight = (id) => api.delete(`/flights/${id}`);

// ─── Passengers ──────────────────────────────────────────────
export const registerPassenger = ({ name, phone, email, password }) =>
  api.post("/passengers/register", { name, phone, email, password });

export const loginPassenger = (email, password) =>
  api.post("/passengers/login", { email, password });

export const getPassengersByFlight = (flightNumber) =>
  api.get(`/passengers/${flightNumber}`);

// ─── Flight Tracking ─────────────────────────────────────────
export const trackFlight = (flightId, email) =>
  api.post(`/flights/${flightId}/track`, { email });

export const untrackFlight = (flightId, email) =>
  api.post(`/flights/${flightId}/untrack`, { email });

export default api;
