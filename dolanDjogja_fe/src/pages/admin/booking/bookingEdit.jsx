import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { getBookingById, updateBookingStatus } from "../../../services/bookingService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./bookingEdit.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import BackIcon from "../../../assets/icon/back.svg";

export default function BookingEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [booking, setBooking] = useState(null);

  const [showPaidModal, setShowPaidModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const res = await getBookingById(id);
    setBooking(res);
  };

  const submitStatus = async (status) => {
    await updateBookingStatus(id, { status_pembayaran: status });
    await loadData();
    setShowPaidModal(false);
    setShowCancelModal(false);
  };

  if (!booking) return <div className="loading-text">Loading...</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID");
  };

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="Logo" />
          {!collapsed && <h2>dolanDjogja</h2>}
        </div>

        <nav className="sidebar-menu">

          <Link to="/admin/dashboard">
            <img src={DashboardIcon} className="menu-icon" /> {!collapsed && "Dashboard"}
          </Link>

          <Link to="/admin/paket">
            <img src={PaketIcon} className="menu-icon" /> {!collapsed && "Paket Wisata"}
          </Link>

          <Link to="/admin/destinasi">
            <img src={DestinasiIcon} className="menu-icon" /> {!collapsed && "Destinasi"}
          </Link>

          <Link to="/admin/jadwal">
            <img src={JadwalIcon} className="menu-icon" /> {!collapsed && "Jadwal Trip"}
          </Link>

          <Link to="/admin/bookings" className="active">
            <img src={BookingIcon} className="menu-icon" /> {!collapsed && "Booking"}
          </Link>

          <Link to="/admin/payments">
            <img src={PaymentIcon} className="menu-icon" /> {!collapsed && "Payments"}
          </Link>

        </nav>

        <button className="logout-btn">
          <img src={LogoutIcon} className="menu-icon" /> {!collapsed && "Logout"}
        </button>
      </aside>

      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>

      <main className="main-content">

        <Link to="/admin/bookings" className="back-btn">
          <img src={BackIcon} className="back-icon" /> Kembali
        </Link>

        <h2 className="paket-title">Detail Booking #{booking.id}</h2>

        <div className="booking-card">
          <div className="booking-row">
            <span>Nama User</span>
            <p>{booking.user?.name}</p>
          </div>

          <div className="booking-row">
            <span>Paket Wisata</span>
            <p>{booking.jadwal_trip?.paket?.nama_paket}</p>
          </div>

          <div className="booking-row">
            <span>Tanggal Berangkat</span>
            <p>{formatDate(booking.jadwal_trip?.tanggal_berangkat)}</p>
          </div>

          <div className="booking-row">
            <span>Tanggal Pulang</span>
            <p>{formatDate(booking.jadwal_trip?.tanggal_pulang)}</p>
          </div>

          <div className="booking-row">
            <span>Jumlah Orang</span>
            <p>{booking.jumlah_orang}</p>
          </div>

          <div className="booking-row">
            <span>Total Harga</span>
            <p>Rp {Number(booking.total_harga).toLocaleString("id-ID")}</p>
          </div>

          <div className="booking-row status-row">
            <span>Status Pembayaran</span>
            <p
              className={`status-badge ${booking.status_pembayaran === "paid" ? "paid" : "cancelled"
                }`}
            >
              {booking.status_pembayaran.toUpperCase()}
            </p>
          </div>

          <div className="booking-buttons">
            <button className="btn-paid" onClick={() => setShowPaidModal(true)}>
              Set Paid
            </button>

            <button className="btn-cancel-book" onClick={() => setShowCancelModal(true)}>
              Set Cancelled
            </button>
          </div>
        </div>
      </main>

      {showPaidModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Konfirmasi Pembayaran</h3>
            <p>Ubah status menjadi <strong>Paid</strong>?</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => submitStatus("paid")}>
                Ya, Set Paid
              </button>
              <button className="modal-cancel" onClick={() => setShowPaidModal(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Batalkan Booking?</h3>
            <p>Status akan berubah menjadi <strong>Cancelled</strong>.</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => submitStatus("cancelled")}>
                Ya, Batalkan
              </button>
              <button className="modal-cancel" onClick={() => setShowCancelModal(false)}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}