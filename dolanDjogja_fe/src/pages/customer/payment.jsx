import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadPayment } from "../../services/paymentService"; 
// import { getBookingById } from "../../services/bookingService"; 
// import { getUser } from "../../services/authService"; 

import './Payment.css'; 

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

  useEffect(() => {
    // Logika Pengecekan Login Dinonaktifkan
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi file sudah ditambahkan di sini, tapi kita mengandalkan tombol disable juga
    if (!file) {
        alert("Mohon pilih file bukti pembayaran sebelum mengunggah.");
        return; 
    }
    
    setIsLoading(true); // Tampilkan "Sedang memproses..."

    const formData = new FormData();
    formData.append("booking_id", id || DUMMY_BOOKING.id); 
    formData.append("jumlah_bayar", booking.total_harga);
    formData.append("bukti_pembayaran", file); 
    
    try {
        // Asumsi: Kita akan mensimulasikan upload berhasil dan verifikasi cepat
        // (Jika API asli digunakan, status di bawah akan menjadi 'Menunggu Verifikasi')
        // await uploadPayment(formData); 
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulasi proses 2 detik
        
        // --- PERUBAHAN UTAMA: SET STATUS MENJADI TERVERIFIKASI SETELAH PROSES ---
        setBooking(prevBooking => ({
            ...prevBooking,
            status_verifikasi: 'Terverifikasi', // Status berhasil!
            tanggal_bayar: new Date().toISOString().slice(0, 10)
        }));

        setIsLoading(false);
        alert("Bukti pembayaran berhasil diunggah dan terverifikasi!");
        
        // Kita tidak akan me-redirect di sini agar user bisa melihat status 'Terverifikasi'
        // Jika Anda ingin redirect ke my-bookings setelah verifikasi: navigate("/my-bookings");
        
    } catch (error) {
        console.error("Gagal mengunggah bukti pembayaran:", error);
        alert("Gagal mengunggah bukti pembayaran. Silakan coba lagi.");
        setIsLoading(false);
    }
  };

  // Tampilkan Loading State jika sedang memproses
  if (isLoading) return <p className="loading-state">Sedang memproses...</p>;
  if (!booking) return <p className="loading-state">Loading detail booking...</p>;

  const isButtonDisabled = isLoading || !file || 
                         booking.status_verifikasi === 'Menunggu Verifikasi' || 
                         booking.status_verifikasi === 'Terverifikasi';

  return (
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
                ? 'Sedang Memproses...' // Teks saat isLoading
                : booking.status_verifikasi === 'Terverifikasi'
                ? 'Lunas / Terverifikasi'
                : 'Upload Pembayaran' // Teks default jika file sudah dipilih dan belum ada status
            }
          </button>
          
          {booking.status_verifikasi === 'Terverifikasi' && (
            <button 
                type="button" 
                className="btn-upload" 
                onClick={() => navigate('/my-bookings')} 
                style={{backgroundColor: 'green', marginTop: '10px'}}>
                Lihat Daftar Booking
            </button>
          )}
        </form>
      </div>
    </div>
  );
}