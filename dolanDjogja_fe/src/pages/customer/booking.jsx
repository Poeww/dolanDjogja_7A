import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaketById } from "../../services/paketService";
import { getAllJadwal } from "../../services/jadwalTripService";
import { createBooking } from "../../services/bookingService";
import { getUser } from "../../services/authService";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paket, setPaket] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [form, setForm] = useState({
    jadwal_trip_id: "",
    jumlah_orang: 1,
  });

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const dataPaket = await getPaketById(id);
    const semuaJadwal = await getAllJadwal();

    setPaket(dataPaket);
    setJadwal(semuaJadwal.filter((j) => j.paket_id === Number(id)));
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      jadwal_trip_id: Number(form.jadwal_trip_id),
      jumlah_orang: Number(form.jumlah_orang),
    };

    await createBooking(payload);
    navigate("/my-bookings");
  };

  if (!paket) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Booking: {paket.nama_paket}</h2>

      <h3>Pilih Jadwal</h3>
      <form onSubmit={handleSubmit}>
        <select name="jadwal_trip_id" onChange={handleChange}>
          <option value="">-- pilih jadwal --</option>
          {jadwal.map((j) => (
            <option key={j.id} value={j.id}>
              {j.tanggal_berangkat} → {j.tanggal_pulang} (Kuota: {j.kuota_tersedia})
            </option>
          ))}
        </select>
        <br />

        <h3>Jumlah Orang</h3>
        <input
          type="number"
          name="jumlah_orang"
          min="1"
          onChange={handleChange}
          defaultValue={1}
        />
        <br />

        <button type="submit">Pesan Sekarang</button>
      </form>
    </div>
  );
}