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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

  const [bookingChart, setBookingChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [paketPopular, setPaketPopular] = useState([]);
  const [destinasiPopular, setDestinasiPopular] = useState([]);
  const [kuotaTrip, setKuotaTrip] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchCharts();
  }, []);

  const fetchStats = async () => {
    try {
      const [p, d, j, b, pay] = await Promise.all([
        api.get("/paket-wisata"),
        api.get("/destinasi"),
        api.get("/jadwal-trip"),
        api.get("/bookings"),
        api.get("/payments"),
      ]);

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

  const fetchCharts = async () => {
    try {
      const [book, rev, paket, dest, kuota] = await Promise.all([
        api.get("/chart/bookings-monthly"),
        api.get("/chart/revenue-monthly"),
        api.get("/chart/paket-popular"),
        api.get("/chart/destinasi-popular"),
        api.get("/chart/kuota-trip"),
      ]);

      setBookingChart(
        (book.data || []).map(item => ({
          name: item.month || "",
          total: parseInt(item.total) || 0,
        }))
      );

      setRevenueChart(
        (rev.data || []).map(item => ({
          name: item.month || "",
          total: parseInt(item.total) || 0,
        }))
      );

      setPaketPopular(
        (paket.data || []).map(item => ({
          name: item.nama || "",
          total: parseInt(item.total) || 0,
        }))
      );

      setDestinasiPopular(
        (dest.data || []).map(item => ({
          name: item.nama || "",
          total: parseInt(item.total) || 0,
        }))
      );

      setKuotaTrip(
        (kuota.data || []).map(item => ({
          name: item.jadwal || "",
          sisa: parseInt(item.sisa_kuota) || 0,
        }))
      );
    } catch (err) {
      console.error("Error loading charts:", err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="Logo" />
          {!collapsed && <h2>dolanDjogja</h2>}
        </div>

        <nav className="sidebar-menu">
          <Link
            to="/admin/dashboard"
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
          >
            <img src={DashboardIcon} className="menu-icon" />
            {!collapsed && "Dashboard"}
          </Link>

          <Link
            to="/admin/users"
            className={location.pathname.includes("/admin/users") ? "active" : ""}
          >
            <img src={ProfilIcon} className="menu-icon" />
            {!collapsed && "Kelola User"}
          </Link>

          <Link
            to="/admin/paket"
            className={location.pathname.includes("/admin/paket") ? "active" : ""}
          >
            <img src={PaketIcon} className="menu-icon" />
            {!collapsed && "Paket Wisata"}
          </Link>

          <Link
            to="/admin/destinasi"
            className={location.pathname.includes("/admin/destinasi") ? "active" : ""}
          >
            <img src={DestinasiIcon} className="menu-icon" />
            {!collapsed && "Destinasi"}
          </Link>

          <Link
            to="/admin/jadwal"
            className={location.pathname.includes("/admin/jadwal") ? "active" : ""}
          >
            <img src={JadwalIcon} className="menu-icon" />
            {!collapsed && "Jadwal Trip"}
          </Link>

          <Link
            to="/admin/bookings"
            className={location.pathname.includes("/admin/bookings") ? "active" : ""}
          >
            <img src={BookingIcon} className="menu-icon" />
            {!collapsed && "Booking"}
          </Link>

          <Link
            to="/admin/payments"
            className={location.pathname.includes("/admin/payments") ? "active" : ""}
          >
            <img src={PaymentIcon} className="menu-icon" />
            {!collapsed && "Payments"}
          </Link>
        </nav>

        <Link to="/" className="logout-btn" onClick={handleLogout}>
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

        <h2 className="section-title" style={{ marginTop: 30 }}>
          Statistik
        </h2>

        <section className="charts-row">
          <div className="chart-card">
            <h3 className="chart-title">Booking Bulanan</h3>
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Booking"
                    stroke="#1a73e8"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Pendapatan Bulanan</h3>
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Pendapatan"
                    stroke="#28a745"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="charts-row">
          {/* POPULER PAKET */}
          <div className="chart-card">
            <h3 className="chart-title">Paket Wisata Terpopuler</h3>
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paketPopular}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#1a73e8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Destinasi Terpopuler</h3>
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={destinasiPopular}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#ff9800" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="charts-row">
          <div className="chart-card" style={{ maxWidth: "100%" }}>
            <h3 className="chart-title">Sisa Kuota per Trip</h3>
            <div className="chart-inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kuotaTrip}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sisa" fill="#9c27b0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}