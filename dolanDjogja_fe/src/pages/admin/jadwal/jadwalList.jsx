import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllJadwal, deleteJadwal } from "../../../services/jadwalTripService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./jadwal.css";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LogoPDF from "../../../assets/img/logo-dolandjogja.png";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";

import IconAdd from "../../../assets/icon/tambah.svg";
import IconEdit from "../../../assets/icon/edit.svg";
import IconDelete from "../../../assets/icon/hapus.svg";
import IconExport from "../../../assets/icon/export.svg";

export default function JadwalList() {
  const [collapsed, setCollapsed] = useState(false);
  const [jadwal, setJadwal] = useState([]);
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
    const res = await getAllJadwal();
    setJadwal(res);
  };

  const filteredData = jadwal.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.paket?.nama_paket?.toLowerCase().includes(s) ||
      item.tanggal_berangkat.toLowerCase().includes(s) ||
      item.tanggal_pulang.toLowerCase().includes(s)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal trip ini?")) return;
    await deleteJadwal(id);
    loadData();
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.addImage(LogoPDF, "PNG", 14, 10, 22, 22);

    doc.setFontSize(18);
    doc.setTextColor(26, 115, 232);
    doc.text("Daftar Jadwal Trip", 40, 20);

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
        ["ID", "Paket", "Tgl Berangkat", "Tgl Pulang", "Kuota Tersedia"],
      ],
      body: filteredData.map((j) => [
        j.id,
        j.paket?.nama_paket,
        j.tanggal_berangkat,
        j.tanggal_pulang,
        j.kuota_tersedia,
      ]),
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [26, 115, 232],
        textColor: 255,
        halign: "center",
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
          <Link to="/admin/dashboard">
            <img src={DashboardIcon} className="menu-icon" />
            {!collapsed && "Dashboard"}
          </Link>

          <Link to="/admin/paket">
            <img src={PaketIcon} className="menu-icon" />
            {!collapsed && "Paket Wisata"}
          </Link>

          <Link to="/admin/destinasi">
            <img src={DestinasiIcon} className="menu-icon" />
            {!collapsed && "Destinasi"}
          </Link>

          <Link to="/admin/jadwal" className="active">
            <img src={JadwalIcon} className="menu-icon" />
            {!collapsed && "Jadwal Trip"}
          </Link>

          <Link to="/admin/bookings">
            <img src={BookingIcon} className="menu-icon" />
            {!collapsed && "Booking"}
          </Link>

          <Link to="/admin/payments">
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
        <h2 className="jadwal-title">Daftar Jadwal Trip</h2>

        <div className="jadwal-table-top">
          <div className="left-actions">
            <Link to="/admin/jadwal/create" className="jadwal-add-btn">
              <img src={IconAdd} className="icon-btn" /> Tambah Jadwal
            </Link>

            <button className="jadwal-export-btn" onClick={exportPDF}>
              <img src={IconExport} className="icon-btn-small black-icon" />
              Export
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari jadwal..."
            className="jadwal-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="jadwal-table-wrapper">
          <table className="jadwal-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paket</th>
                <th>Tgl Berangkat</th>
                <th>Tgl Pulang</th>
                <th>Kuota Tersedia</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="jadwal-empty">Tidak ada data ditemukan.</td>
                </tr>
              ) : (
                filteredData.map((j) => (
                  <tr key={j.id}>
                    <td>{j.id}</td>
                    <td>{j.paket?.nama_paket}</td>
                    <td>{j.tanggal_berangkat}</td>
                    <td>{j.tanggal_pulang}</td>
                    <td>{j.kuota_tersedia}</td>

                    <td className="jadwal-action-col">
                      <Link to={`/admin/jadwal/edit/${j.id}`} className="jadwal-edit">
                        <img src={IconEdit} className="icon-btn-small" /> Edit
                      </Link>

                      <button className="jadwal-delete" onClick={() => handleDelete(j.id)}>
                        <img src={IconDelete} className="icon-btn-small" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="jadwal-count-info">
            Menampilkan {filteredData.length} dari {jadwal.length} data
          </div>
        </div>
      </main>
    </div>
  );
}