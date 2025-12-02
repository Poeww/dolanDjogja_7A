import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./dashboard.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";

import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import ProfilIcon from "../../../assets/icon/profil.svg";

import api from "../../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    paket: 0,
    destinasi: 0,
    jadwal: 0,
    booking: 0,
    payment: 0,
  });

  // Ambil data jumlah dari backend
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const p = await api.get("/paket-wisata");
      const d = await api.get("/destinasi");
      const j = await api.get("/jadwal-trip");
      const b = await api.get("/bookings"); // admin only
      const pay = await api.get("/payments"); // admin only

      setStats({
        paket: p.data.length,
        destinasi: d.data.length,
        jadwal: j.data.length,
        booking: b.data.length,
        payment: pay.data.length,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="Logo" />
          <h2>dolanDjogja</h2>
        </div>

        <nav className="sidebar-menu">
          <Link to="/admin/dashboard"><img src={DashboardIcon} className="menu-icon" /> Dashboard</Link>
          <Link to="/admin/paket"><img src={PaketIcon} className="menu-icon" /> Paket Wisata</Link>
          <Link to="/admin/destinasi"><img src={DestinasiIcon} className="menu-icon" /> Destinasi</Link>
          <Link to="/admin/jadwal"><img src={JadwalIcon} className="menu-icon" /> Jadwal Trip</Link>
          <Link to="/admin/bookings"><img src={BookingIcon} className="menu-icon" /> Booking</Link>
          <Link to="/admin/payments"><img src={PaymentIcon} className="menu-icon" /> Payments</Link>
        </nav>

        <button className="logout-btn">
          <img src={LogoutIcon} className="menu-icon" /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <h1>Dashboard Admin</h1>
            <p className="welcome-text">Selamat datang, <strong>Admin</strong> 👋</p>
          </div>

          <div className="admin-profile">
            <img src={ProfilIcon} alt="Profil" className="profile-img" />
            <span>Admin</span>
          </div>
        </header>

        {/* SECTION TITLE */}
        <h2 className="section-title">Ringkasan Data</h2>

        {/* CARD ROW */}
        <section className="cards-row">
          <div className="card large-card">
            <h3>Total Paket Wisata</h3>
            <p className="value">{stats.paket}</p>
          </div>

          <div className="card large-card">
            <h3>Total Destinasi</h3>
            <p className="value">{stats.destinasi}</p>
          </div>

          <div className="card large-card">
            <h3>Total Jadwal Trip</h3>
            <p className="value">{stats.jadwal}</p>
          </div>

          <div className="card large-card">
            <h3>Total Booking</h3>
            <p className="value">{stats.booking}</p>
          </div>

          <div className="card large-card">
            <h3>Total Payments</h3>
            <p className="value">{stats.payment}</p>
          </div>
        </section>

      </main>

    </div>
  );
}
