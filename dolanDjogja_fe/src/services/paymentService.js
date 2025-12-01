import API from "./api";

export const uploadPayment = async (data) => {
  const res = await API.post("/payments", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const getAllPayments = async () => {
  const res = await API.get("/payments");
  return res.data;
};

export const updatePayment = async (id, data) => {
  const res = await API.post(`/payments/${id}?_method=PUT`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};