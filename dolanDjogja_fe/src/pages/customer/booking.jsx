import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaketById } from "../../services/paketService";
import { getAllJadwal } from "../../services/jadwalTripService";
import { createBooking } from "../../services/bookingService";
import { getUser } from "../../services/authService";
import "./booking.css"; 

import placeholderImg from "../../assets/malioboro.jpg";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paket, setPaket] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    jadwal_trip_id: "",
    jumlah_orang: 1,
  });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dataPaket = await getPaketById(id);
      const semuaJadwal = await getAllJadwal();

      setPaket(dataPaket);
      setJadwal(semuaJadwal.filter((j) => j.paket_id === Number(id)));
    } catch (error) {
      console.error("Gagal memuat data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    try {
      await createBooking(payload);
      alert("Booking Berhasil!");
      navigate("/my-bookings");
    } catch (error) {
      console.error(error);
      alert("Gagal melakukan booking.");
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>;
  if (!paket) return <div style={{textAlign:'center', padding:'50px'}}>Paket tidak ditemukan</div>;

  const selectedSchedule = jadwal.find(j => j.id === Number(form.jadwal_trip_id));
  const totalHarga = paket.harga * form.jumlah_orang;

  // PERHATIKAN PERUBAHAN DI BAWAH INI (style={styles.x} JADI className="x")
  return (
      <div className="packages-page">
      {/* Header */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo">
            <h1>dolanDjogja</h1>
          </div>
          <nav className="nav-menu">
            <ul className="nav-list">
              <li><a href="/">Home</a></li>
              <li><a href="/packages">Packages</a></li>
              <li><a href="/mybookings">MyBookings</a></li>
            </ul>
          </nav>
          <div className="user-avatar">
            <div className="avatar-circle"><a href="/profil">👤</a></div>
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <img 
            src={paket.image || placeholderImg} 
            alt={paket.nama_paket} 
            className="hero-image" 
        />
        <div className="hero-content">
          <h1 className="hero-title">Booking: {paket.nama_paket}</h1>
          <p className="hero-subtitle">Selesaikan pemesanan Anda untuk memulai petualangan</p>
        </div>
      </div>

      <div className="container">
        <div className="grid-container">
          
          {/* KOLOM KIRI: FORM DETAIL */}
          <div className="left-column">
            
            {/* Kartu Detail Pemesan */}
            <div className="card">
              <h3 className="card-title">Detail Pemesan</h3>
              <p className="card-subtitle">Informasi diambil dari akun Anda</p>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={user?.name || "User"} 
                  disabled 
                  className="form-input-disabled" 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="text" 
                  value={user?.email || "email@example.com"} 
                  disabled 
                  className="form-input-disabled" 
                />
              </div>
            </div>

            {/* Kartu Form Booking */}
            <div className="card">
              <h3 className="card-title">Detail Perjalanan</h3>
              <form id="bookingForm" onSubmit={handleSubmit}>
                
                {/* Pilih Jadwal */}
                <div className="form-group">
                  <label htmlFor="jadwal" className="form-label">Pilih Tanggal Keberangkatan</label>
                  <select
                    id="jadwal"
                    name="jadwal_trip_id"
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">-- Pilih Jadwal Tersedia --</option>
                    {jadwal.map((j) => (
                      <option key={j.id} value={j.id} disabled={j.kuota_tersedia <= 0}>
                        {j.tanggal_berangkat} s/d {j.tanggal_pulang} (Sisa Kuota: {j.kuota_tersedia})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jumlah Orang */}
                <div className="form-group">
                  <label htmlFor="jumlah" className="form-label">Jumlah Peserta</label>
                  <input
                    id="jumlah"
                    type="number"
                    name="jumlah_orang"
                    min="1"
                    value={form.jumlah_orang}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                  <small className="form-helper">
                    Pastikan jumlah peserta sesuai dengan rencana Anda.
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: RINGKASAN */}
          <div className="right-column">
            <div className="summary-card">
              <h3 className="summary-title">{paket.nama_paket}</h3>
              
              <div className="summary-detail">
                <div className="summary-row">
                  <span>Durasi:</span>
                  <strong>{paket.durasi}</strong>
                </div>
                <div className="summary-row">
                  <span>Tanggal:</span>
                  <strong>{selectedSchedule ? selectedSchedule.tanggal_berangkat : "-"}</strong>
                </div>
                <div className="summary-row">
                  <span>Peserta:</span>
                  <strong>{form.jumlah_orang} Orang</strong>
                </div>
              </div>

              <hr className="divider" />

              <div className="price-calculation">
                <div className="calc-row">
                  <span>Harga per pax</span>
                  <span>{formatRupiah(paket.harga)}</span>
                </div>
                <div className="calc-row-total">
                  <span>Total Pembayaran</span>
                  <span className="total-price">{formatRupiah(totalHarga)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="bookingForm" 
                className="pay-button"
              >
                Lanjut Bayar
              </button>
            </div>
          </div>
          <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>dolanDjogja</h2>
            <p>Explore. Experience. Enjoy</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h3>Navigasi</h3>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/packages">Packages</a></li>
                <li><a href="/bookings">My Bookings</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h3>Bantuan</h3>
              <ul>
                <li>JL. Kemerdekaan No.22, Kab.Sleman, DIY</li>
                <li><a href="mailto:dolandjogja@gmail.com">dolandjogja@gmail.com</a></li>
                <li><a href="tel:+6281245678901">+62 812-4567-8901</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-social">
            <div className="social-icons">
              <a href="#"><span>X</span></a>
              <a href="#"><span>🎵</span></a>
              <a href="#"><span>📸</span></a>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© 2025. All Right Reserved</p>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}