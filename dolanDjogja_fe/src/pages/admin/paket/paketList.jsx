import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllPaket, deletePaket } from "../../../services/paketService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./paket.css";

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

import IconAdd from "../../../assets/icon/tambah.svg";
import IconEdit from "../../../assets/icon/edit.svg";
import IconDelete from "../../../assets/icon/hapus.svg";
import IconExport from "../../../assets/icon/export.svg";

export default function PaketList() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [paket, setPaket] = useState([]);
  const [search, setSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getAllPaket();
    setPaket(data);
  };

  const filteredData = paket.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.nama_paket.toLowerCase().includes(s) ||
      item.durasi.toLowerCase().includes(s) ||
      String(item.harga).toLowerCase().includes(s)
    );
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deletePaket(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
    loadData();
  };

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.addImage(LogoPDF, "PNG", 14, 10, 22, 22);
    doc.setFontSize(18);
    doc.setTextColor(26, 115, 232);
    doc.text("Daftar Paket Wisata", 40, 20);

    const today = new Date().toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Tanggal Export: ${today}`, 40, 28);

    autoTable(doc, {
      startY: 40,
      head: [["ID", "Nama Paket", "Harga", "Durasi"]],
      body: filteredData.map((p) => [
        p.id,
        p.nama_paket,
        "Rp " + Number(p.harga).toLocaleString("id-ID"),
        p.durasi,
      ]),
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 4,
        halign: "left",
        valign: "middle",
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
      tableLineColor: [220, 220, 220],
      tableLineWidth: 0.3,
    });

    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} className="sidebar-logo" alt="Logo" />
          {!collapsed && <h2>dolanDjogja</h2>}
        </div>

        <nav className="sidebar-menu">

          <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>
            <img src={DashboardIcon} className="menu-icon" /> {!collapsed && "Dashboard"}
          </Link>

          <Link
            to="/admin/users"
            className={location.pathname.includes("/admin/users") ? "active" : ""}
          >
            <img src={ProfilIcon} className="menu-icon" />
            {!collapsed && "Kelola User"}
          </Link>

          <Link to="/admin/paket" className={location.pathname.includes("/admin/paket") ? "active" : ""}>
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

          <Link to="/admin/payments">
            <img src={PaymentIcon} className="menu-icon" /> {!collapsed && "Payments"}
          </Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <img src={LogoutIcon} className="menu-icon" /> {!collapsed && "Logout"}
        </button>
      </aside>

      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>

      <main className="main-content">

        <h2 className="paket-title">Daftar Paket Wisata</h2>

        <div className="paket-table-top">

          <div className="left-actions">
            <Link to="/admin/paket/create" className="paket-add-btn">
              <img src={IconAdd} className="icon-btn" /> Tambah Paket
            </Link>

            <button className="paket-export-btn" onClick={exportPDF}>
              <img src={IconExport} className="icon-btn-small black-icon" /> Export
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari di sini..."
            className="paket-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="paket-table-wrapper">
          <table className="paket-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Paket</th>
                <th>Harga</th>
                <th>Durasi</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="paket-empty">Tidak ada data ditemukan.</td>
                </tr>
              ) : (
                filteredData.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nama_paket}</td>
                    <td>Rp {Number(p.harga).toLocaleString()}</td>
                    <td>{p.durasi}</td>
                    <td className="paket-action-col">

                      <Link className="paket-edit" to={`/admin/paket/edit/${p.id}`}>
                        <img src={IconEdit} className="icon-btn-small" /> Edit
                      </Link>

                      <button
                        className="paket-delete"
                        onClick={() => handleDeleteClick(p.id)}
                      >
                        <img src={IconDelete} className="icon-btn-small" /> Hapus
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="paket-count-info">
            Menampilkan {filteredData.length} dari {paket.length} data
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="paket-modal-overlay">
          <div className="paket-modal-box">
            <h3>Hapus Paket?</h3>
            <p>Paket yang dihapus tidak dapat dikembalikan.</p>

            <div className="paket-modal-actions">
              <button className="paket-modal-confirm" onClick={confirmDelete}>Ya, Hapus</button>
              <button className="paket-modal-cancel" onClick={() => setShowDeleteModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}