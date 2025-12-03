import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookingById, updateBookingStatus } from "../../../services/bookingService";
import { getUser } from "../../../services/authService";

export default function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const res = await getBookingById(id);
    setBooking(res);
  };

  const handleUpdate = async (status) => {
    await updateBookingStatus(id, { status_pembayaran: status });
    loadData();
    alert("Status berhasil diperbarui!");
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Edit Booking #{booking.id}</h2>

      <p><strong>Nama User:</strong> {booking.user?.name}</p>
      <p><strong>Paket:</strong> {booking.jadwal_trip?.paket?.nama_paket}</p>
      <p><strong>Tanggal Berangkat:</strong> {booking.jadwal_trip?.tanggal_berangkat}</p>
      <p><strong>Tanggal Pulang:</strong> {booking.jadwal_trip?.tanggal_pulang}</p>
      <p><strong>Jumlah Orang:</strong> {booking.jumlah_orang}</p>
      <p><strong>Total Harga:</strong> Rp {Number(booking.total_harga).toLocaleString("id-ID")}</p>

      <p><strong>Status Pembayaran:</strong> {booking.status_pembayaran}</p>

      <button onClick={() => handleUpdate("paid")}>Set Paid</button>
      <button onClick={() => handleUpdate("cancelled")} style={{ marginLeft: 10 }}>
        Set Cancelled
      </button>

      <br /><br />
      <Link to="/admin/bookings">← Kembali</Link>
    </div>
  );
}