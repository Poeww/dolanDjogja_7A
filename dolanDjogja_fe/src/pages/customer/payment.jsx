import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import "./payment.css";

import { getBookingById } from "../../services/bookingService";
import { uploadPayment } from "../../services/paymentService";
import { getUser } from "../../services/authService";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [paket, setPaket] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentCode, setPaymentCode] = useState("");
  const [file, setFile] = useState(null);

  // ==========================================
  // UNIVERSAL MODAL
  // ==========================================
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

  // ==========================================
  // LOAD BOOKING DATA
  // ==========================================
  useEffect(() => {
    const user = getUser();
    if (!user) return navigate("/login");

    loadData();
  }, []);

  const loadData = async () => {
    const data = await getBookingById(id);
    setBooking(data);
    setPaket(data.jadwal_trip?.paket || null);
  };

  const generateVA = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `djogja25${random}`;
  };

  useEffect(() => {
    if (paymentMethod === "virtual_account") {
      setPaymentCode(generateVA());
    } else if (paymentMethod === "transfer_bank") {
      setPaymentCode("BCA - 1234567890 a.n DolanDjogja");
    }
  }, [paymentMethod]);

  // ==========================================
  // SUBMIT PEMBAYARAN
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("booking_id", id);
    formData.append("jumlah_bayar", booking.total_harga);
    formData.append("metode_pembayaran", paymentMethod);
    formData.append("kode_pembayaran", paymentCode);
    formData.append("bukti_pembayaran", file);

    try {
      await uploadPayment(formData);

      openModal(
        "Pembayaran Berhasil!",
        "Bukti pembayaran telah dikirim. Anda akan diarahkan ke halaman pemesanan...",
        "success"
      );

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1400);
    } catch (err) {
      openModal("Gagal Upload", "Terjadi kesalahan saat mengirim bukti pembayaran.", "error");
    }
  };

  if (!booking || !paket) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="payment-container">
        <div className="payment-card">

          <h2 className="payment-title">Pembayaran: {paket.nama_paket}</h2>

          <div className="detail-box">
            <div><span>Paket:</span> <strong>{paket.nama_paket}</strong></div>
            <div><span>Durasi:</span> <strong>{paket.durasi}</strong></div>
            <div><span>Peserta:</span> <strong>{booking.jumlah_orang} Orang</strong></div>
            <div>
              <span>Total Bayar:</span>
              <strong className="highlight">
                {Number(booking.total_harga).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </strong>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            <div className="floating-group">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                data-has-value={paymentMethod !== ""}
              >
                <option value="" hidden></option>
                <option value="virtual_account">Virtual Account</option>
                <option value="transfer_bank">Transfer Bank</option>
              </select>
              <label>Metode Pembayaran</label>
            </div>

            {paymentMethod && (
              <div className="payment-info-box">
                <p className="info-title">Instruksi Pembayaran</p>

                {paymentMethod === "virtual_account" && (
                  <p>Gunakan nomor Virtual Account berikut:</p>
                )}

                {paymentMethod === "transfer_bank" && (
                  <p>Silakan transfer ke rekening berikut:</p>
                )}

                <div className="payment-code">{paymentCode}</div>

                <div className="upload-inside-box">
                  <label>Bukti Pembayaran (JPG/PNG)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
            )}

            <button className="btn-submit">Kirim Pembayaran</button>
          </form>
        </div>
      </div>

      {/* ================================
          UNIVERSAL MODAL
      ================================= */}
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
    </>
  );
}