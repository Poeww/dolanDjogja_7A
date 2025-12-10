import { useEffect, useState, useRef } from "react"; // Tambahkan useRef
import { useParams, useNavigate } from "react-router-dom";
import { uploadPayment } from "../../services/paymentService"; 
// import { getBookingById } from "../../services/bookingService"; 
// import { getUser } from "../../services/authService"; 

// 1. IMPOR KOMPONEN NAVBAR
import Navbar from "../../components/navbar";

import './Payment.css'; 
// 2. IMPOR STYLING TAMBAHAN DARI HOME (untuk Navbar & Footer)
import '../../home/home.css'; 

// === ASSET IMPORTS DARI HOME (DIPERLUKAN UNTUK HERO SECTION) ===
import iconMap from "../../assets/icon/maps.svg";
import iconClock from "../../assets/icon/clock.svg";
import bg from "../../assets/img/highlight-home.png"; // Gambar Latar Belakang Hero

import iconGuide from "../../assets/icon/guide.svg";
import iconCustom from "../../assets/icon/custom.svg";
import iconMoney from "../../assets/icon/money.svg";
import iconMaps from "../../assets/icon/maps.svg";
import senjaTugu from "../../assets/img/senja-tugu.jpg"; // Gambar Latar Belakang CTA

import img1 from "../../assets/img/carousel-home1.png";
import img2 from "../../assets/img/carousel-home2.png";
import img3 from "../../assets/img/carousel-home3.png";
import img4 from "../../assets/img/carousel-home4.png";
import img5 from "../../assets/img/carousel-home5.png";
import img6 from "../../assets/img/carousel-home6.png";
// ========================================================
// 1. DATA DUMMY (STATUS AWAL BELUM DIBAYAR)
// ========================================================
const DUMMY_BOOKING = {
  id: "P1001",
  total_harga: 'Rp 6.750.000',
  tanggal_bayar: '2027-05-15', 
  status_verifikasi: 'Belum Dibayar', // Status awal agar tombol bisa di-klik
  jadwal_trip: {
    paket: {
      nama_paket: 'Amazing Trip ke Raja Ampat 6H5M - Private',
    },
  },
};
// ========================================================

// =========================================
// COUNT UP HOOK (DIPERLUKAN AGAR HERO SECTION TIDAK ERROR)
// =========================================
function useCountUp(end, duration = 1500) {
    const [value, setValue] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;

                if (isVisible) {
                    let start = 0;
                    setValue(0);
                    const increment = end / (duration / 16);

                    const counter = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            start = end;
                            clearInterval(counter);
                        }
                        setValue(Math.floor(start));
                    }, 16);
                }
            },
            { threshold: 0.6 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration]);

    return [value, ref];
}
// =========================================

// Helper untuk styling status
const getStatusColor = (status) => {
    switch(status) {
      case 'Terverifikasi': return 'green';
      case 'Ditolak': return 'red';
      case 'Menunggu Verifikasi': return 'orange';
      default: return 'red'; // 'Belum Dibayar'
    }
}

export default function Payment() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [booking, setBooking] = useState(DUMMY_BOOKING); 
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  // States dan Hook yang diperlukan dari Home/MyBookings (diperlukan untuk Hero Section)
  const images = [img1, img2, img3, img4, img5, img6];
  const duplicated = [...images, ...images];
  // PENTING: useCountUp hooks ini harus ada untuk mencegah error referensi pada JSX Hero/CTA.
  const [pelanggan, pelangganRef] = useCountUp(500); 
  const [jumlahDestinasi, destinasiRef] = useCountUp(100); 
  const [jumlahPaket, paketRef] = useCountUp(50); 
  // Akhir states/hooks Home

  useEffect(() => {
    // Logika Pengecekan Login Dinonaktifkan
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
        alert("Mohon pilih file bukti pembayaran sebelum mengunggah.");
        return; 
    }
    
    setIsLoading(true); 

    const formData = new FormData();
    formData.append("booking_id", id || DUMMY_BOOKING.id); 
    formData.append("jumlah_bayar", booking.total_harga);
    formData.append("bukti_pembayaran", file); 
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulasi proses 2 detik
        
        setBooking(prevBooking => ({
            ...prevBooking,
            status_verifikasi: 'Menunggu Verifikasi', 
            tanggal_bayar: new Date().toISOString().slice(0, 10)
        }));

        setIsLoading(false);
        alert("Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.");
        
    } catch (error) {
        console.error("Gagal mengunggah bukti pembayaran:", error);
        alert("Gagal mengunggah bukti pembayaran. Silakan coba lagi.");
        setIsLoading(false);
    }
  };
  
  // FUNGSI BOOKING (dari Home - DIBUTUHKAN OLEH CTA SECTION)
  const handleBookingButton = () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            window.location.href = "/login";
            return;
        }

        // Di halaman pembayaran, mungkin lebih baik diarahkan ke halaman paket
        window.location.href = "/paket";
    };


  // Tampilkan Loading State jika sedang memproses
  if (isLoading) return <p className="loading-state">Sedang memproses...</p>;
  if (!booking) return <p className="loading-state">Loading detail booking...</p>;

  const isButtonDisabled = isLoading || !file || 
                         booking.status_verifikasi === 'Menunggu Verifikasi' || 
                         booking.status_verifikasi === 'Terverifikasi';

  return (
    <>
      <Navbar /> 
      
      {/* HERO SECTION DARI GAMBAR KEDUA (MyBookings.jsx) */}
      <section id="home" className="home-hero" style={{ backgroundImage: `url(${bg})` }}>
            <div className="home-overlay"></div>
            <div className="home-container">
                <div className="left-text">
                    <h3 className="region">YOGYAKARTA</h3>
                    <h1 className="welcome-title">Konfirmasi Pembayaran</h1>
                    <p className="desc">
                        Lakukan pembayaran dan unggah bukti transfer Anda di sini untuk segera diproses oleh admin.
                    </p>
                    <button
                        className="btn-hero"
                        onClick={() =>
                            document.querySelector(".payment-wrapper").scrollIntoView({
                                behavior: "smooth",
                            })
                        }
                    >
                        Lanjut ke Form
                    </button>
                </div>

                <div className="multi-slider">
                    <div className="slider-track infinite-scroll">
                        {duplicated.map((src, i) => (
                            <div className="slider-card" key={i}>
                                <img src={src} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
      </section>
      
      {/* KONTEN UTAMA PEMBAYARAN */}
      <div className="payment-wrapper">
        <div className="payment-card">
          <h2>Pembayaran Booking #{DUMMY_BOOKING.id}</h2>

          <div className="booking-detail">
              <p>Paket: <strong>{booking.jadwal_trip?.paket?.nama_paket}</strong></p>
              <p>Total Harga yang Harus Dibayar: <strong>{booking.total_harga}</strong></p>
              
              <p>Tanggal Pembayaran: <strong>{booking.tanggal_bayar || 'Belum Ada'}</strong></p>
              <p>Status Verifikasi: <strong style={{ color: getStatusColor(booking.status_verifikasi) }}>{booking.status_verifikasi}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            
            <div className="file-upload-group">
              <label htmlFor="bukti-pembayaran" className="file-upload-label">
                  Pilih Bukti Pembayaran
              </label>
              
              <input
                id="bukti-pembayaran"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                disabled={booking.status_verifikasi !== 'Belum Dibayar'} 
              />
              
              <p className="file-name-display">
                  {file ? `File terpilih: ${file.name}` : 'Belum ada file dipilih.'}
              </p>
            </div>
            
            <button 
                type="submit" 
                className="btn-upload" 
                disabled={isButtonDisabled}>
              
              {isLoading 
                  ? 'Sedang Memproses...'
                  : booking.status_verifikasi === 'Menunggu Verifikasi'
                  ? 'Menunggu Verifikasi'
                  : booking.status_verifikasi === 'Terverifikasi'
                  ? 'Lunas / Terverifikasi'
                  : 'Upload Pembayaran'
              }
          </button>
          
          { (booking.status_verifikasi === 'Terverifikasi' || booking.status_verifikasi === 'Menunggu Verifikasi') && (
            <button 
                type="button" 
                className="btn-upload" 
                onClick={() => navigate('/my-bookings')} 
                style={{backgroundColor: '#007bff', marginTop: '10px'}}>
                Kembali ke Daftar Booking
            </button>
          )}
        </form>
      </div>
    </div>

      {/* CTA SECTION DARI GAMBAR KEDUA (MyBookings.jsx) - Dipertahankan untuk kelengkapan */}
      <section className="cta-section" style={{ backgroundImage: `url(${senjaTugu})` }}>
            <div className="cta-overlay"></div>
            <div className="cta-content">
                <h1 className="cta-title">Siap Jalan-Jalan di Jogja?</h1>
                <p className="cta-subtitle">
                    Jangan lewatkan kesempatan wisata tak terlupakan. Mulai petualanganmu sekarang!
                </p>
                <div className="cta-buttons">
                    <button
                        className="btn-cta-primary"
                        onClick={handleBookingButton}
                    >
                        Mulai Booking
                    </button>
                </div>
                <div className="cta-stats">
                    <div className="stat-item" ref={pelangganRef}>
                        <h2>{pelanggan}+</h2>
                        <p>Pelanggan Puas</p>
                    </div>
                    <div className="stat-item" ref={destinasiRef}>
                        <h2>{jumlahDestinasi}+</h2>
                        <p>Destinasi</p>
                    </div>
                    <div className="stat-item" ref={paketRef}>
                        <h2>{jumlahPaket}+</h2>
                        <p>Paket Wisata</p>
                    </div>
                </div>
            </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-simple">
        © {new Date().getFullYear()} <span>DolanDjogja</span>. All rights reserved.
      </footer>
    </>
  );
}