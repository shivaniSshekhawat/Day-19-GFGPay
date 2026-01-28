import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://day-19-gfg-pay-alx3.vercel.app"
});

export const getShows = () => api.get("/shows");
export const getShowSeats = (id) => api.get(`/shows/${id}/seats`);
export const lockSeats = (payload) => api.post("/bookings/book-seats", payload);
export const checkout = (payload) => api.post("/bookings/checkout", payload);

export default api;