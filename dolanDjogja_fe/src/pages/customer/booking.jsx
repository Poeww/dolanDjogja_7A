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

    if (!form.jadwal_trip_id) {
      alert("Harap pilih jadwal terlebih dahulu.");
      return;
    }

    const payload = {
      jadwal_trip_id: Number(form.jadwal_trip_id),
      jumlah_orang: Number(form.jumlah_orang),
    };

    await createBooking(payload);
    navigate("/my-bookings");
  };

  if (!paket)
    return (
      <div style={{ textAlign: "center", padding: "40px", fontSize: "18px" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#2c3e50",
          fontSize: "24px",
        }}
      >
        Booking: {paket.nama_paket}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label
            htmlFor="jadwal"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Pilih Jadwal Perjalanan
          </label>
          <select
            id="jadwal"
            name="jadwal_trip_id"
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <option value="">-- Pilih jadwal --</option>
            {jadwal.map((j) => (
              <option key={j.id} value={j.id}>
                {j.tanggal_berangkat} → {j.tanggal_pulang} (Kuota: {j.kuota_tersedia})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="jumlah"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#34495e",
            }}
          >
            Jumlah Orang
          </label>
          <input
            id="jumlah"
            type="number"
            name="jumlah_orang"
            min="1"
            onChange={handleChange}
            defaultValue={1}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#fff",
            backgroundColor: "#3498db",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
        >
          Pesan Sekarang
        </button>
      </form>
    </div>
  );
}