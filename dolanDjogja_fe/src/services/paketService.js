import API from "./api";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getThumbnailUrl = (path) => {
  if (!path) return null;
  return `${BASE_URL}/storage/${path}`;
};

export const getAllPaket = async () => {
  const res = await API.get("/paket-wisata");
  return res.data;
};

export const getPaketById = async (id) => {
  const res = await API.get(`/paket-wisata/${id}`);
  return res.data;
};

export const createPaket = async (data) => {
  const res = await API.post("/paket-wisata", data, {
    headers: { 
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const updatePaket = async (id, data) => {
  data.append("_method", "PUT");

  const res = await API.post(`/paket-wisata/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};

export const deletePaket = async (id) => {
  const res = await API.delete(`/paket-wisata/${id}`);
  return res.data;
};