import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllBookings } from "../../../services/bookingService";
import { getUser } from "../../../services/authService";

export default function BookingList() {
  const [data, setData] = useState([]);
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
    const res = await getAllBookings();
    setData(res);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Daftar Booking</h2>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama User</th>
            <th>Paket Wisata</th>
            <th>Jumlah Orang</th>
            <th>Total Harga</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user?.name}</td>
              <td>{b.jadwal_trip?.paket?.nama_paket}</td>
              <td>{b.jumlah_orang}</td>
              <td>{Number(b.total_harga).toLocaleString("id-ID")}</td>
              <td>{b.status_pembayaran}</td>
              <td>
                <Link to={`/admin/bookings/edit/${b.id}`}>Edit</Link>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="7">Belum ada data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}