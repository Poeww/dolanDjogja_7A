import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadPayment } from "../../services/paymentService";
import { getBookingById } from "../../services/bookingService";
import { getUser } from "../../services/authService";

export default function Payment() {
  const { id } = useParams(); // id booking
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    loadBooking();
  }, []);

  const loadBooking = async () => {
    const data = await getBookingById(id);
    setBooking(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("booking_id", id);
    formData.append("jumlah_bayar", booking.total_harga);
    formData.append("bukti_pembayaran", file);

    await uploadPayment(formData);
    navigate("/my-bookings");
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Pembayaran Booking #{id}</h2>

      <p>Paket: {booking.jadwal_trip?.paket?.nama_paket}</p>
      <p>Total Harga: {booking.total_harga}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button type="submit">Upload Pembayaran</button>
      </form>
    </div>
  );
}