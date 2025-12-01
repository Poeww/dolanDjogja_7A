import API from "./api";

export const getAllPaket = async () => {
  const res = await API.get("/paket-wisata");
  return res.data;
};

export const getPaketById = async (id) => {
  const res = await API.get(`/paket-wisata/${id}`);
  return res.data;
};

export const createPaket = async (data) => {
  const res = await API.post("/paket-wisata", data);
  return res.data;
};

export const updatePaket = async (id, data) => {
  const res = await API.put(`/paket-wisata/${id}`, data);
  return res.data;
};

export const deletePaket = async (id) => {
  const res = await API.delete(`/paket-wisata/${id}`);
  return res.data;
};