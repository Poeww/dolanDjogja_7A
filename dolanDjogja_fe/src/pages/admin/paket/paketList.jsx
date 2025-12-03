import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllPaket, deletePaket } from "../../../services/paketService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./paket.css";

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

export default function PaketList() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [paket, setPaket] = useState([]);
  const [search, setSearch] = useState("");

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

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus paket ini?")) return;
    await deletePaket(id);
    loadData();
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
            data-title="Dashboard"
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
          >
            <img src={DashboardIcon} className="menu-icon" />
            {!collapsed && "Dashboard"}
          </Link>

          <Link
            to="/admin/paket"
            data-title="Paket Wisata"
            className={location.pathname.includes("/admin/paket") ? "active" : ""}
          >
            <img src={PaketIcon} className="menu-icon" />
            {!collapsed && "Paket Wisata"}
          </Link>

          <Link
            to="/admin/destinasi"
            data-title="Destinasi"
            className={location.pathname.includes("/admin/destinasi") ? "active" : ""}
          >
            <img src={DestinasiIcon} className="menu-icon" />
            {!collapsed && "Destinasi"}
          </Link>

          <Link
            to="/admin/jadwal"
            data-title="Jadwal Trip"
            className={location.pathname.includes("/admin/jadwal") ? "active" : ""}
          >
            <img src={JadwalIcon} className="menu-icon" />
            {!collapsed && "Jadwal Trip"}
          </Link>

          <Link
            to="/admin/bookings"
            data-title="Booking"
            className={location.pathname.includes("/admin/bookings") ? "active" : ""}
          >
            <img src={BookingIcon} className="menu-icon" />
            {!collapsed && "Booking"}
          </Link>

          <Link
            to="/admin/payments"
            data-title="Payments"
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

        <h2 className="paket-title">Daftar Paket Wisata</h2>

        <div className="paket-table-top">
          <Link to="/admin/paket/create" className="paket-add-btn">
            <img src={IconAdd} className="icon-btn" /> Tambah Paket
          </Link>

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
                  <td colSpan="5" className="paket-empty">
                    Tidak ada data ditemukan.
                  </td>
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

                      <button className="paket-delete" onClick={() => handleDelete(p.id)}>
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
    </div>
  );
}