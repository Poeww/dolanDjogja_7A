import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadPayment } from "../../services/paymentService";
import { getBookingById } from "../../services/bookingService";
import { getUser } from "../../services/authService";
import "./Payment.css";
import background from "../../assets/malioboro.jpg";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // ✅ Untuk kontrol tampilan sukses

  useEffect(() => {
    const user = getUser();
    // if (!user) {
    //   navigate("/login");
    //   return;
    // }

    loadBooking();
  }, [id, navigate]);

  const loadBooking = async () => {
    const mockBooking = {
      id: 1,
      user_id: 101,
      package_id: 5,
      schedule_id: 8,
      booking_date: "2025-12-09 14:30:00",
      total_person: 2,
      total_price: 2450000.00,
      status: "pending",

      jadwal_trip: {
        id: 8,
        tanggal_keberangkatan: "2025-12-20",
        kuota_tersedia: 8,
        paket: {
          id: 5,
          nama_paket: "Heritage & City Tour",
          durasi: "3 Hari / 2 Malam",
          destinasi: "Malioboro, Keraton, Borobudur, Prambanan, Taman Sari",
          fasilitas: "Transportasi AC, Hotel Bintang 3, Makan Siang & Malam, Tiket Masuk, Guide",
          harga: 1225000.00,
          gambar: "https://via.placeholder.com/600x400?text=Heritage+Tour"
        }
      },
      user: {
        id: 101,
        nama: "Anisa Putri",
        email: "anisa@example.com"
      }
    };

    await new Promise(resolve => setTimeout(resolve, 800));
    setBooking(mockBooking);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert("Silakan pilih metode pembayaran.");
      return;
    }

    const formData = new FormData();
    formData.append("booking_id", booking.id);
    formData.append("jumlah_bayar", booking.total_price);
    formData.append("metode_pembayaran", paymentMethod);

    try {
      await uploadPayment(formData);
      setIsSuccess(true); // ✅ Tampilkan card sukses
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  if (!booking) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontSize: "1.2rem" }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="header-section">
        <div className="header-container">
          <div className="logo">
            <h2>dolanDjogja</h2>
          </div>
          <nav className="nav-menu">
            <ul className="nav-list">
              <li className="nav-item"><a href="/">Home</a></li>
              <li className="nav-item"><a href="/packages">Packages</a></li>
              <li className="nav-item"><a href="/mybookings">MyBookings</a></li>
              <li className="nav-item"><a href="/login">Login</a></li>
              <li className="nav-item"><a href="/register">Register</a></li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Banner */}
      <section className="packages-banner">
        <img
          src={background}
          alt="Yogyakarta Destinations"
          className="banner-image"
        />
        <div className="banner-overlay">
          <h1 className="banner-title">Jelajahi<br />Yogyakarta!</h1>
          <p className="banner-subtitle">dengan dolanDjogja</p>
        </div>
      </section>

      {/* Konten Pembayaran */}
      <section>
        <div className="payment-content">
          <div className="booking-header">
            <h2>Pembayaran Booking #{booking.id}</h2>
            <h3>{booking.jadwal_trip?.paket?.nama_paket || "—"}</h3>
          </div>

          {/* ✅ Jika sukses, tampilkan card */}
          {isSuccess ? (
            <div className="success-card">
              <div className="success-icon">✅</div>
              <h2>Pembayaran Anda Berhasil</h2>
              <p>Bukti pembayaran telah dikirim dan sedang diproses.</p>
              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/")}
              >
                Kembali ke Home
              </button>
            </div>
          ) : (
            <>
              {/* Detail Booking */}
              <div className="booking-details-row">
                <div className="detail-item">
                  <strong>Paket:</strong>
                  <span>{booking.jadwal_trip?.paket?.nama_paket || "—"}</span>
                </div>
                <div className="detail-item">
                  <strong>Total Harga:</strong>
                  <span>Rp {booking.total_price?.toLocaleString('id-ID', { minimumFractionDigits: 2 }) || "0,00"}</span>
                </div>
                <div className="detail-item">
                  <strong>Jumlah Peserta:</strong>
                  <span>{booking.total_person} orang</span>
                </div>
                <div className="detail-item">
                  <strong>Tanggal Booking:</strong>
                  <span>{new Date(booking.booking_date).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="detail-item">
                  <strong>Status:</strong>
                  <span style={{
                    color: booking.status === 'pending' ? '#ffc107' : booking.status === 'confirmed' ? '#28a745' : '#dc3545'
                  }}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Form Pembayaran */}
              <form onSubmit={handleSubmit} className="upload-form">
                <div className="payment-method">
                  <label htmlFor="payment-method">Pilih Metode Pembayaran</label>
                  <select
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="payment-select"
                    required
                  >
                    <option value="" disabled>
                      Pilih Metode Pembayaran
                    </option>
                    <option value="QRIS">QRIS</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="cash">Bayar di Tempat</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="pay-button"
                  disabled={!paymentMethod}
                  style={{ opacity: !paymentMethod ? 0.6 : 1 }}
                >
                  Bayar
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
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