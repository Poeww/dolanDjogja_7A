import { useEffect, useState } from "react";
import { getMyBookings } from "../../services/bookingService";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/authService";

import Navbar from "../../components/navbar";
import "./myBookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    loadData(user.id);
  }, []);

  const loadData = async (userId) => {
    try {
      const data = await getMyBookings(userId);
      setBookings(data);
    } catch (error) {
      console.error("Gagal mengambil data booking:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "pending":
        return "red";
      case "verified":
        return "orange";
      case "cancelled":
        return "gray";
      default:
        return "black";
    }
  };

  return (
    <>
      <Navbar />

      <div className="mybookings-container">
        <h2 className="mybookings-title">Booking Saya</h2>

        <table className="mybookings-table">
          <thead>
            <tr>
              <th>Paket</th>
              <th>Tgl Berangkat</th>
              <th>Tgl Pulang</th>
              <th>Jumlah Orang</th>
              <th>Total Harga</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.jadwal_trip?.paket?.nama_paket || "-"}</td>

                  <td>{b.jadwal_trip?.tanggal_berangkat || "-"}</td>

                  <td>{b.jadwal_trip?.tanggal_pulang || "-"}</td>

                  <td>{b.jumlah_orang}</td>

                  <td>
                    {Number(b.total_harga).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>

                  <td
                    style={{
                      fontWeight: "bold",
                      color: getStatusColor(b.status_pembayaran),
                    }}
                  >
                    {b.status_pembayaran?.toUpperCase()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="mybookings-empty">
                  Belum ada booking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
