import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllDestinasi, deleteDestinasi } from "../../../services/destinasiService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./destinasi.css";

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

export default function DestinasiList() {
  const [collapsed, setCollapsed] = useState(false);
  const [destinasi, setDestinasi] = useState([]);
  const [search, setSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    const res = await getAllDestinasi();
    setDestinasi(res);
  };

  const filteredData = destinasi.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.nama_destinasi.toLowerCase().includes(s) ||
      item.lokasi.toLowerCase().includes(s) ||
      String(item.harga_tiket).toLowerCase().includes(s)
    );
  });

  const openDeleteModal = (item) => {
    setDeleteTarget(item);
    setShowDeleteModal(true);
  };

  const deleteNow = async () => {
    await deleteDestinasi(deleteTarget.id);
    setShowDeleteModal(false);
    setDeleteTarget(null);
    loadData();
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.addImage(LogoPDF, "PNG", 14, 10, 22, 22);
    doc.setFontSize(18);
    doc.setTextColor(26, 115, 232);
    doc.text("Daftar Destinasi Wisata", 40, 20);

    const today = new Date().toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Tanggal Export: ${today}`, 40, 28);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Nama Destinasi", "Lokasi", "Harga Tiket"]],
      body: filteredData.map((d) => [
        d.id,
        d.nama_destinasi,
        d.lokasi,
        "Rp " + Number(d.harga_tiket).toLocaleString("id-ID"),
      ]),
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [26, 115, 232],
        textColor: 255,
        fontSize: 12,
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

          <Link to="/admin/destinasi" className="active">
            <img src={DestinasiIcon} className="menu-icon" />
            {!collapsed && "Destinasi"}
          </Link>

          <Link to="/admin/jadwal">
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

        <h2 className="destinasi-title">Daftar Destinasi Wisata</h2>

        <div className="destinasi-table-top">
          <div className="left-actions">
            <Link to="/admin/destinasi/create" className="destinasi-add-btn">
              <img src={IconAdd} className="icon-btn" /> Tambah Destinasi
            </Link>

            <button className="destinasi-export-btn" onClick={exportPDF}>
              <img src={IconExport} className="icon-btn-small black-icon" /> Export
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari destinasi..."
            className="destinasi-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="destinasi-table-wrapper">
          <table className="destinasi-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Destinasi</th>
                <th>Lokasi</th>
                <th>Harga Tiket</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="destinasi-empty">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredData.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.nama_destinasi}</td>
                    <td>{d.lokasi}</td>
                    <td>Rp {Number(d.harga_tiket).toLocaleString()}</td>

                    <td className="destinasi-action-col">
                      <Link to={`/admin/destinasi/edit/${d.id}`} className="destinasi-edit">
                        <img src={IconEdit} className="icon-btn-small" /> Edit
                      </Link>

                      <button
                        className="destinasi-delete"
                        onClick={() => openDeleteModal(d)}
                      >
                        <img src={IconDelete} className="icon-btn-small" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="destinasi-count-info">
            Menampilkan {filteredData.length} dari {destinasi.length} data
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="paket-modal-overlay">
          <div className="paket-modal-box">
            <h3>Hapus Destinasi?</h3>

            <p>
              Yakin ingin menghapus destinasi
              <br />
              <b>{deleteTarget?.nama_destinasi}</b> ?
            </p>

            <div className="paket-modal-actions">
              <button className="paket-modal-confirm" onClick={deleteNow}>
                Ya, Hapus
              </button>

              <button className="paket-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}