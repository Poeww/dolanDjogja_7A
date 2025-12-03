import API from "./api";

export const createBooking = async (data) => {
  const res = await API.post("/bookings", data);
  return res.data;
};

export const getBookingById = async (id) => {
  const res = await API.get(`/bookings/${id}`);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await API.get("/my-bookings");
  return res.data;
};

export const getAllBookings = async () => {
  const res = await API.get("/bookings");
  return res.data;
};

export const updateBookingStatus = async (id, data) => {
  const res = await API.put(`/bookings/${id}`, data);
  return res.data;
};