import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { updatePayment, getAllPayments } from "../../../services/paymentService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./paymentEdit.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import BackIcon from "../../../assets/icon/back.svg";

export default function PaymentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [payment, setPayment] = useState(null);
  const [status, setStatus] = useState("");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") navigate("/login");

    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllPayments();
    const found = data.find((p) => p.id == id);
    setPayment(found);
    setStatus(found.status_verifikasi);
  };

  const submitNow = async () => {
    const fd = new FormData();
    fd.append("status_verifikasi", status);

    await updatePayment(id, fd);
    navigate("/admin/payments");
  };

  if (!payment) return <div>Loading...</div>;

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

          <Link to="/admin/users">
            <img src={ProfilIcon} className="menu-icon" /> {!collapsed && "Kelola User"}
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

          <Link to="/admin/bookings">
            <img src={BookingIcon} className="menu-icon" /> {!collapsed && "Booking"}
          </Link>

          <Link to="/admin/payments" className="active">
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

        <Link to="/admin/payments" className="back-btn">
          <img src={BackIcon} className="back-icon" /> Kembali
        </Link>

        <h2 className="payment-title">Verifikasi Pembayaran #{payment.id}</h2>

        <div className="payment-card">

          <div className="payment-row">
            <span>Booking ID</span>
            <p>{payment.booking_id}</p>
          </div>

          <div className="payment-row">
            <span>Jumlah Bayar</span>
            <p>Rp {Number(payment.jumlah_bayar).toLocaleString("id-ID")}</p>
          </div>

          <div className="payment-row">
            <span>Status</span>
            <p>
              <span className={`status-badge ${payment.status_verifikasi}`}>
                {payment.status_verifikasi.toUpperCase()}
              </span>
            </p>
          </div>

          <div className="payment-row">
            <span>Bukti Pembayaran</span>
            <img
              src={`${import.meta.env.VITE_API_URL}/${payment.bukti_pembayaran}`}
              className="payment-proof"
              alt="Bukti Pembayaran"
            />
          </div>


          <div className="payment-row">
            <span>Update Status</span>
            <select
              className="payment-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="payment-buttons">
            <button className="btn-update" onClick={() => setShowSaveModal(true)}>
              Update Status
            </button>

            <button className="btn-cancel" onClick={() => setShowCancelModal(true)}>
              Cancel
            </button>
          </div>

        </div>
      </main>

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update Status Pembayaran?</h3>
            <p>Perubahan tidak dapat dibatalkan.</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={submitNow}>
                Ya, Update
              </button>
              <button className="modal-cancel" onClick={() => setShowSaveModal(false)}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Batalkan?</h3>
            <p>Perubahan tidak akan disimpan.</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => navigate("/admin/payments")}>
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