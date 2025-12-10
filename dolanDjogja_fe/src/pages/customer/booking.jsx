import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import "./booking.css";

import { getPaketById } from "../../services/paketService";
import { getAllJadwal } from "../../services/jadwalTripService";
import { createBooking } from "../../services/bookingService";
import { getUser } from "../../services/authService";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paket, setPaket] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    jadwal_trip_id: "",
    jumlah_orang: 1,
  });

  // ================================
  // MODAL STATE
  // ================================
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const openModal = (title, message, type = "success") => {
    setModal({ show: true, title, message, type });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  // ================================
  // LOAD DATA
  // ================================
  useEffect(() => {
    const userData = getUser();
    if (!userData) return navigate("/login");

    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    const dataPaket = await getPaketById(id);
    const semuaJadwal = await getAllJadwal();

    setPaket(dataPaket);
    setJadwal(semuaJadwal.filter((j) => j.paket_id === Number(id)));
  };

  // ================================
  // HANDLE INPUT
  // ================================
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "jumlah_orang") {
      const num = Number(value);

      if (num < 1 || isNaN(num)) value = 1;

      const selected = jadwal.find((j) => j.id === Number(form.jadwal_trip_id));
      if (selected) {
        const maxKuota = selected.kuota_tersedia;

        if (num > maxKuota) {
          value = maxKuota;
          openModal(
            "Kuota Tidak Mencukupi",
            `Kuota hanya tersisa ${maxKuota} orang.`,
            "warning"
          );
        }
      }
    }

    setForm({ ...form, [name]: value });
  };

  // ================================
  // SUBMIT BOOKING
  // ================================
  const submitBooking = async (e) => {
    e.preventDefault();

    const payload = {
      jadwal_trip_id: Number(form.jadwal_trip_id),
      jumlah_orang: Number(form.jumlah_orang),
    };

    try {
      const booking = await createBooking(payload);

      openModal(
        "Booking Berhasil!",
        "Anda akan diarahkan ke halaman pembayaran...",
        "success"
      );

      setTimeout(() => {
        navigate(`/payment/${booking.id}`);
      }, 1200);

    } catch (err) {
      openModal("Gagal Booking", "Terjadi kesalahan. Coba lagi.", "error");
    }
  };

  if (!paket) return null;

  const selectedSchedule = jadwal.find(
    (j) => j.id === Number(form.jadwal_trip_id)
  );

  return (
    <>
      <Navbar />

      <div className="booking-hero">
        <img
          className="booking-hero-img"
          src={`${import.meta.env.VITE_API_URL}/${paket.gambar_thumbnail}`}
          alt={paket.nama_paket}
        />
        <div className="booking-hero-overlay"></div>

        <div className="booking-hero-text">
          <h1>Booking: {paket.nama_paket}</h1>
          <p>Selesaikan pemesanan perjalanan Anda</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="booking-container">
        <div className="booking-left">

          {/* PEMESAN */}
          <div className="booking-card">
            <h2 className="card-title">Detail Pemesan</h2>

            <div className="floating-group">
              <input disabled value={user.name} placeholder=" " />
              <label>Nama</label>
            </div>

            <div className="floating-group">
              <input disabled value={user.email} placeholder=" " />
              <label>Email</label>
            </div>
          </div>

          {/* DETAIL PERJALANAN */}
          <div className="booking-card">
            <h2 className="card-title">Detail Perjalanan</h2>

            <form id="bookingForm" onSubmit={submitBooking}>

              {/* PILIH JADWAL */}
              <div className="floating-group">
                <select
                  name="jadwal_trip_id"
                  value={form.jadwal_trip_id}
                  onChange={handleChange}
                  data-has-value={form.jadwal_trip_id !== ""}
                  required
                >
                  <option value="" disabled hidden></option>
                  {jadwal.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.tanggal_berangkat} → {j.tanggal_pulang} (Sisa {j.kuota_tersedia})
                    </option>
                  ))}
                </select>
                <label>Pilih Jadwal</label>
              </div>

              {/* JUMLAH ORANG */}
              <div className="floating-group">
                <input
                  type="number"
                  name="jumlah_orang"
                  min="1"
                  value={form.jumlah_orang}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Jumlah Orang</label>
              </div>
            </form>
          </div>

        </div>

        {/* SUMMARY */}
        <div className="booking-right">
          <div className="summary-card">
            <h2 className="card-title">{paket.nama_paket}</h2>

            <div className="summary-info">
              <div>
                <span>Durasi:</span>
                <strong>{paket.durasi}</strong>
              </div>

              <div>
                <span>Tanggal:</span>
                <strong>{selectedSchedule?.tanggal_berangkat || "-"}</strong>
              </div>

              <div>
                <span>Peserta:</span>
                <strong>{form.jumlah_orang} Orang</strong>
              </div>

              <div>
                <span>Harga / Orang:</span>
                <strong>
                  {Number(paket.harga).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </strong>
              </div>

              <div>
                <span>Total Bayar:</span>
                <strong style={{ color: "#1e6feb" }}>
                  {(Number(paket.harga) * Number(form.jumlah_orang)).toLocaleString(
                    "id-ID",
                    { style: "currency", currency: "IDR" }
                  )}
                </strong>
              </div>
            </div>

            <button
              type="submit"
              form="bookingForm"
              className="btn-submit"
              disabled={!form.jadwal_trip_id}
              style={{
                opacity: !form.jadwal_trip_id ? 0.5 : 1,
                cursor: !form.jadwal_trip_id ? "not-allowed" : "pointer",
              }}
            >
              Lanjut Bayar
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POPUP */}
      {modal.show && (
        <div className="modal-overlay">
          <div className={`modal-box ${modal.type}`}>
            <h2>{modal.title}</h2>
            <p>{modal.message}</p>

            <button className="modal-btn" onClick={closeModal}>
              Oke
            </button>
          </div>
        </div>
      )}

      <footer className="footer-simple">
        © {new Date().getFullYear()} <span>DolanDjogja</span>. All rights reserved.
      </footer>
    </>
  );
}