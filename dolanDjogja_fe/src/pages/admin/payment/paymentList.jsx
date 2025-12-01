import { useEffect, useState } from "react";
import { getAllPayments } from "../../../services/paymentService";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../../services/authService";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllPayments();
    setPayments(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Daftar Pembayaran</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Booking ID</th>
            <th>Jumlah Bayar</th>
            <th>Bukti Pembayaran</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.booking_id}</td>
              <td>{p.jumlah_bayar}</td>
              <td>
                {p.bukti_pembayaran ? (
                  <img src={p.bukti_pembayaran} width="80" />
                ) : (
                  "Belum Upload"
                )}
              </td>
              <td>{p.status_verifikasi}</td>
              <td>
                <Link to={`/admin/payments/edit/${p.id}`}>Verifikasi</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}