import { useEffect, useState } from "react";
import { getMyBookings } from "../../services/bookingService";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/authService";
import "./MyBookings.css";

// ✅ Import gambar
import background from "../../assets/malioboro.jpg";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    // if (!user) {
    //   navigate("/login");
    //   return;
    // }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error("Gagal memuat data booking:", err);
      setBookings([]);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${month} ${year}`;
  };

  return (
    <div className="my-bookings-page">
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
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Banner - Dibungkus Container Sama Seperti Header */}
      <section className="my-bookings-banner">
        <div className="container">
          <div className="banner-wrapper">
            <img
              src={background}
              alt="Yogyakarta Street"
              className="banner-image"
            />
            <div className="banner-overlay">
              <h1 className="banner-title">Jelajahi<br />Yogyakarta!</h1>
              <p className="banner-subtitle">dengan dolanDjogja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Konten Pesanan */}
      <section className="my-bookings-content">
        <div className="container">
          <h2 className="section-title">Pesanan Saya</h2>

          {bookings.length === 0 ? (
            <p className="no-bookings">Belum ada pesanan. Yuk mulai jelajah!</p>
          ) : (
            <div className="bookings-list">
              {bookings.map((b) => (
                <div className="booking-card" key={b.id}>
                  <div className="booking-header">
                    <span className="order-code">Kode Order: {b.kode_order}</span>
                    <span
                      className={`payment-status ${
                        b.status_pembayaran === "lunas" ? "paid" : "unpaid"
                      }`}
                    >
                      {b.status_pembayaran === "lunas" ? "Telah dibayar" : "Belum dibayar"}
                    </span>
                  </div>

                  <div className="booking-body">
                    <div className="booking-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6.253v13m0-13C10.832 5.456 9.116 5 7.5 5S4.168 5.456 3 6.253v13C4.168 18.456 5.884 18 7.5 18s3.332.456 4.5 1.253m0-13C13.168 5.456 14.884 5 16.5 5c1.616 0 3.332.456 4.5 1.253v13C19.832 18.456 18.116 18 16.5 18c-1.616 0-3.332.456-4.5 1.253"/>
                      </svg>
                    </div>
                    <div className="booking-info">
                      <h3 className="package-name">
                        Paket Tur Wisata : {b.jadwal_trip?.paket?.nama_paket || "Paket Tidak Ditemukan"}
                      </h3>
                      <p className="travel-dates">
                        {formatDate(b.jadwal_trip?.tanggal_berangkat)} — {formatDate(b.jadwal_trip?.tanggal_pulang)}
                      </p>
                    </div>
                    <div className="booking-price">
                      <p className="total-amount">Rp {b.total_harga?.toLocaleString('id-ID') || '0'}</p>
                      <p className="price-label">Total Pembayaran</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          
        </div>
      </section>

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
                <li>JL. Kemerdekaan No.22, Kab.Sleman,DIY</li>
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
  );
}