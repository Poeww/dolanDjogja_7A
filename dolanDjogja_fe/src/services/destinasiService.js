import API from "./api";

export const getAllDestinasi = async () => {
  const res = await API.get("/destinasi");
  return res.data;
};

export const getDestinasiById = async (id) => {
  const res = await API.get(`/destinasi/${id}`);
  return res.data;
};

export const createDestinasi = async (data) => {
  const res = await API.post("/destinasi", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateDestinasi = async (id, data) => {
  const res = await API.post(`/destinasi/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteDestinasi = async (id) => {
  const res = await API.delete(`/destinasi/${id}`);
  return res.data;
};