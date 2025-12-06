import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllPayments } from "../../../services/paymentService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./payment.css";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LogoPDF from "../../../assets/img/logo-dolandjogja.png";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import ProfilIcon from "../../../assets/icon/profil.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";

import IconExport from "../../../assets/icon/export.svg";
import IconEdit from "../../../assets/icon/edit.svg";

export default function PaymentList() {
  const [collapsed, setCollapsed] = useState(false);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllPayments();
    setPayments(data);
  };

  const filteredData = payments.filter((p) => {
    const s = search.toLowerCase();
    return (
      String(p.id).includes(s) ||
      String(p.booking_id).includes(s) ||
      String(p.jumlah_bayar).includes(s) ||
      (p.status_verifikasi || "").toLowerCase().includes(s)
    );
  });

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.addImage(LogoPDF, "PNG", 14, 10, 22, 22);
    doc.setFontSize(18);
    doc.setTextColor(26, 115, 232);
    doc.text("Daftar Pembayaran", 40, 20);

    const today = new Date().toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Tanggal Export: ${today}`, 40, 28);

    autoTable(doc, {
      startY: 40,
      head: [
        ["ID", "Booking ID", "Jumlah Bayar", "Status Verifikasi"],
      ],
      body: filteredData.map((p) => [
        p.id,
        p.booking_id,
        "Rp " + Number(p.jumlah_bayar).toLocaleString("id-ID"),
        p.status_verifikasi,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [26, 115, 232],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 248, 255],
      },
    });

    window.open(doc.output("bloburl"), "_blank");
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

        <button className="logout-btn">
          <img src={LogoutIcon} className="menu-icon" />
          {!collapsed && "Logout"}
        </button>
      </aside>

      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>

      <main className="main-content">
        <h2 className="payment-title">Daftar Pembayaran</h2>

        <div className="payment-table-top">
          <div className="left-actions">
            <button className="payment-export-btn" onClick={exportPDF}>
              <img src={IconExport} className="icon-btn-small black-icon" />
              Export
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari pembayaran…"
            className="payment-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="payment-table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking ID</th>
                <th>Jumlah Bayar</th>
                <th>Bukti Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="payment-empty">
                    Tidak ada pembayaran ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.booking_id}</td>
                    <td>Rp {Number(p.jumlah_bayar).toLocaleString()}</td>

                    <td>
                      {p.bukti_pembayaran ? (
                        <img
                          src={p.bukti_pembayaran}
                          className="payment-proof-img"
                          alt="Bukti Pembayaran"
                        />
                      ) : (
                        <span className="payment-no-proof">Belum Upload</span>
                      )}
                    </td>

                    <td>{p.status_verifikasi}</td>

                    <td className="payment-action-col">
                      <Link
                        to={`/admin/payments/edit/${p.id}`}
                        className="payment-edit"
                      >
                        <img src={IconEdit} className="icon-btn-small" />{" "}
                        Verifikasi
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="payment-count-info">
            Menampilkan {filteredData.length} dari {payments.length} data
          </div>
        </div>
      </main>
    </div>
  );
}