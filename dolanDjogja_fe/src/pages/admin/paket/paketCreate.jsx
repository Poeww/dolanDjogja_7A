import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPaket } from "../../../services/paketService";
import { getAllDestinasi } from "../../../services/destinasiService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./paketCreateEdit.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";

import BackIcon from "../../../assets/icon/back.svg";

export default function PaketCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [destinasiList, setDestinasiList] = useState([]);

  const [form, setForm] = useState({
    nama_paket: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    lokasi_tujuan: "",
    kuota: "",
    destinasi_ids: [],
    gambar_thumbnail: null,
  });

  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") navigate("/login");

    loadDestinasi();
  }, []);

  const loadDestinasi = async () => {
    const data = await getAllDestinasi();
    setDestinasiList(data);
  };

  const formatRupiah = (angka) =>
    angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleHargaChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setForm({ ...form, harga: raw });
  };

  const toggleDestinasi = (id) => {
    let updated = [...form.destinasi_ids];
    if (updated.includes(id)) {
      updated = updated.filter((x) => x !== id);
    } else {
      updated.push(id);
    }
    setForm({ ...form, destinasi_ids: updated });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, gambar_thumbnail: file });
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("nama_paket", form.nama_paket);
    payload.append("deskripsi", form.deskripsi);
    payload.append("harga", form.harga);
    payload.append("durasi", form.durasi);
    payload.append("lokasi_tujuan", form.lokasi_tujuan);
    payload.append("kuota", form.kuota);

    form.destinasi_ids.forEach((id) =>
      payload.append("destinasi_ids[]", id)
    );

    if (form.gambar_thumbnail) {
      payload.append("gambar_thumbnail", form.gambar_thumbnail);
    }

    await createPaket(payload);
    navigate("/admin/paket");
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

          <Link to="/admin/paket" className="active">
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

        <button className="logout-btn">
          <img src={LogoutIcon} className="menu-icon" /> {!collapsed && "Logout"}
        </button>
      </aside>

      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "▶" : "◀"}
      </button>

      <main className="main-content">

        <Link to="/admin/paket" className="back-btn">
          <img src={BackIcon} className="back-icon" />
          Kembali
        </Link>

        <h2 className="paket-title">Tambah Paket Wisata</h2>

        <div className="paket-form-card">
          <form onSubmit={handleSubmit} className="form-grid">

            <div className="form-group form-left">
              <input className="form-input" placeholder=" " />
              <label className="form-label">Nama Paket</label>
            </div>

            <div className="form-group form-right">
              <input className="form-input" placeholder=" " />
              <label className="form-label">Durasi</label>
            </div>

            <div className="form-group form-left">
              <textarea className="form-input form-textarea" placeholder=" " />
              <label className="form-label">Deskripsi</label>
            </div>

            <div className="form-group form-right">
              <input className="form-input" placeholder=" " />
              <label className="form-label">Lokasi Tujuan</label>
            </div>

            <div className="form-group form-left">
              <input className="form-input" placeholder=" " />
              <label className="form-label">Harga</label>
            </div>

            <div className="form-group form-right">
              <input className="form-input" placeholder=" " />
              <label className="form-label">Kuota</label>
            </div>

            <div className="destinasi-box form-full">
              {destinasiList.map(d => (
                <label key={d.id} className="destinasi-item">
                  <input type="checkbox" />
                  {d.nama_destinasi}
                </label>
              ))}
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn-basic">Simpan</button>
              <button type="button" onClick={() => navigate('/admin/paket')} className="btn-cancel">Cancel</button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}