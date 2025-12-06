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

import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
        paket: p.data.length ?? 0,
        destinasi: d.data.length ?? 0,
        jadwal: j.data.length ?? 0,
        booking: b.data.length ?? 0,
        payment: pay.data.length ?? 0,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const bookingMonthly = [
    { month: "Jan", total: 0 },
    { month: "Feb", total: 0 },
    { month: "Mar", total: 0 },
    { month: "Apr", total: 0 },
    { month: "Mei", total: 0 },
    { month: "Jun", total: 0 },
    { month: "Jul", total: 0 },
    { month: "Agu", total: 0 },
    { month: "Sep", total: 0 },
    { month: "Okt", total: 0 },
    { month: "Nov", total: 0 },
    { month: "Des", total: 0 },
  ];

  const revenueMonthly = [
    { month: "Jan", total: 0 },
    { month: "Feb", total: 0 },
    { month: "Mar", total: 0 },
    { month: "Apr", total: 0 },
    { month: "Mei", total: 0 },
    { month: "Jun", total: 0 },
  ];

  const paketPopular = [
    { name: "Belum Ada Data", value: 1 },
  ];

  const COLORS = ["#1a73e8"];

  const destinasiPopular = [
    { name: "Belum Ada", total: 0 },
  ];

  const kuotaTrip = [
    { name: "Belum Ada", total: 0, kuota: 0 },
  ];

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="Logo" />
          {!collapsed && <h2>dolanDjogja</h2>}
        </div>

        <nav className="sidebar-menu">

          <Link to="/admin/dashboard" data-title="Dashboard"
            className={location.pathname === "/admin/dashboard" ? "active" : ""}>
            <img src={DashboardIcon} className="menu-icon" />
            {!collapsed && "Dashboard"}
          </Link>

          <Link to="/admin/paket" data-title="Paket Wisata"
            className={location.pathname.includes("/admin/paket") ? "active" : ""}>
            <img src={PaketIcon} className="menu-icon" />
            {!collapsed && "Paket Wisata"}
          </Link>

          <Link to="/admin/destinasi" data-title="Destinasi"
            className={location.pathname.includes("/admin/destinasi") ? "active" : ""}>
            <img src={DestinasiIcon} className="menu-icon" />
            {!collapsed && "Destinasi"}
          </Link>

          <Link to="/admin/jadwal" data-title="Jadwal Trip"
            className={location.pathname.includes("/admin/jadwal") ? "active" : ""}>
            <img src={JadwalIcon} className="menu-icon" />
            {!collapsed && "Jadwal Trip"}
          </Link>

          <Link to="/admin/bookings" data-title="Booking"
            className={location.pathname.includes("/admin/bookings") ? "active" : ""}>
            <img src={BookingIcon} className="menu-icon" />
            {!collapsed && "Booking"}
          </Link>

          <Link to="/admin/payments" data-title="Payments"
            className={location.pathname.includes("/admin/payments") ? "active" : ""}>
            <img src={PaymentIcon} className="menu-icon" />
            {!collapsed && "Payments"}
          </Link>
        </nav>

        <Link to="/" className="logout-btn" data-title="Logout">
          <img src={LogoutIcon} className="menu-icon" />
          {!collapsed && "Logout"}
        </Link>

      </aside>

      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>

      <main className="main-content">

        <header className="topbar">
          <div>
            <h1>Dashboard Admin</h1>
            <p className="welcome-text">
              Selamat datang, <strong>Admin</strong> 👋
            </p>
          </div>

          <div className="admin-profile">
            <img src={ProfilIcon} className="profile-img" />
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

        <h2 className="section-title" style={{ marginTop: "40px" }}>Tren Booking Bulanan</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={bookingMonthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#1a73e8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h2 className="section-title" style={{ marginTop: "40px" }}>Pendapatan Bulanan</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={revenueMonthly}>
              <defs>
                <linearGradient id="revColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34a853" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#34a853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#34a853" fill="url(#revColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <h2 className="section-title" style={{ marginTop: "40px" }}>Paket Paling Banyak Dibooking</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={paketPopular} dataKey="value" nameKey="name" outerRadius={100} label>
                {paketPopular.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <h2 className="section-title" style={{ marginTop: "40px" }}>Destinasi Terpopuler</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={destinasiPopular}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#673ab7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2 className="section-title" style={{ marginTop: "40px" }}>Kuota Terpakai Jadwal Trip</h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={kuotaTrip}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#1a73e8" name="Terisi" />
              <Bar dataKey="kuota" fill="#e63946" name="Kuota Maks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </main>
    </div>
  );
}