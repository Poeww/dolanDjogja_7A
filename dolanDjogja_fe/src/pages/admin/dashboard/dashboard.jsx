import { Link, useLocation } from "react-router-dom";
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
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [stats, setStats] = useState({
    paket: 0,
    destinasi: 0,
    jadwal: 0,
    booking: 0,
    payment: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const p = await api.get("/paket-wisata");
      const d = await api.get("/destinasi");
      const j = await api.get("/jadwal-trip");
      const b = await api.get("/bookings");
      const pay = await api.get("/payments");

      setStats({
        paket: p.data.length,
        destinasi: d.data.length,
        jadwal: j.data.length,
        booking: b.data.length,
        payment: pay.data.length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "▶" : "◀"}
        </button>

        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" />
          {!collapsed && <h2>dolanDjogja</h2>}
        </div>

        <nav className="sidebar-menu">

          <Link to="/admin/dashboard" className={pathname.includes("/dashboard") ? "active" : ""}>
            <img src={DashboardIcon} className="menu-icon" />
            {!collapsed && "Dashboard"}
          </Link>

          <Link to="/admin/paket" className={pathname.includes("/paket") ? "active" : ""}>
            <img src={PaketIcon} className="menu-icon" />
            {!collapsed && "Paket Wisata"}
          </Link>

          <Link to="/admin/destinasi" className={pathname.includes("/destinasi") ? "active" : ""}>
            <img src={DestinasiIcon} className="menu-icon" />
            {!collapsed && "Destinasi"}
          </Link>

          <Link to="/admin/jadwal" className={pathname.includes("/jadwal") ? "active" : ""}>
            <img src={JadwalIcon} className="menu-icon" />
            {!collapsed && "Jadwal Trip"}
          </Link>

          <Link to="/admin/bookings" className={pathname.includes("/bookings") ? "active" : ""}>
            <img src={BookingIcon} className="menu-icon" />
            {!collapsed && "Booking"}
          </Link>

          <Link to="/admin/payments" className={pathname.includes("/payments") ? "active" : ""}>
            <img src={PaymentIcon} className="menu-icon" />
            {!collapsed && "Payments"}
          </Link>

        </nav>

        <button className="logout-btn">
          <img src={LogoutIcon} className="menu-icon" />
          {!collapsed && "Logout"}
        </button>

      </aside>

      <main className="main-content">
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

        <h2 className="section-title">Ringkasan Data</h2>

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