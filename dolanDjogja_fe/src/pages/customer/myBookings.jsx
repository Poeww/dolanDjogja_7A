import { useEffect, useState } from "react";
import { getMyBookings } from "../../services/bookingService";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/authService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMyBookings();
    setBookings(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Booking Saya</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Paket</th>
            <th>Tgl Berangkat</th>
            <th>Tgl Pulang</th>
            <th>Jumlah Orang</th>
            <th>Total Harga</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.jadwal_trip?.paket?.nama_paket}</td>
              <td>{b.jadwal_trip?.tanggal_berangkat}</td>
              <td>{b.jadwal_trip?.tanggal_pulang}</td>
              <td>{b.jumlah_orang}</td>
              <td>{b.total_harga}</td>
            </tr>
          ))}

          {bookings.length === 0 && (
            <tr>
              <td colSpan="5">Belum ada booking.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}