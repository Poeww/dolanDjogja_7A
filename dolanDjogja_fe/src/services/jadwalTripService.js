import API from "./api";

export const getAllJadwal = async () => {
  const res = await API.get("/jadwal-trip");
  return res.data;
};

export const getJadwalById = async (id) => {
  const res = await API.get(`/jadwal-trip/${id}`);
  return res.data;
};

export const createJadwal = async (data) => {
  const res = await API.post("/jadwal-trip", data);
  return res.data;
};

export const updateJadwal = async (id, data) => {
  const res = await API.put(`/jadwal-trip/${id}`, data);
  return res.data;
};

export const deleteJadwal = async (id) => {
  const res = await API.delete(`/jadwal-trip/${id}`);
  return res.data;
};