import { useEffect, useState } from "react";
import { updatePayment, getAllPayments } from "../../../services/paymentService";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllPayments();
    const found = data.find((p) => p.id == id);
    setPayment(found);
    setStatus(found.status_verifikasi);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("status_verifikasi", status);

    await updatePayment(id, formData);
    navigate("/admin/payments");
  };

  if (!payment) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Verifikasi Pembayaran</h2>

      <p>Booking ID: {payment.booking_id}</p>
      <p>Jumlah Bayar: {payment.jumlah_bayar}</p>
      <img src={payment.bukti_pembayaran} width="200" alt="Bukti" />

      <form onSubmit={handleSubmit}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>

        <br /><br />
        <button type="submit">Update Status</button>
      </form>
    </div>
  );
}