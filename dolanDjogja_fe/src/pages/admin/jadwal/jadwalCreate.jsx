import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createJadwal } from "../../../services/jadwalTripService";
import { getAllPaket } from "../../../services/paketService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./jadwalCreateEdit.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import BackIcon from "../../../assets/icon/back.svg";

export default function JadwalCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [paket, setPaket] = useState([]);
  const [form, setForm] = useState({
    paket_id: "",
    tanggal_berangkat: "",
    tanggal_pulang: "",
    kuota_tersedia: "",
    harga_per_orang: "",
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") navigate("/login");
    loadPaket();
  }, []);

  const loadPaket = async () => {
    const data = await getAllPaket();
    setPaket(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const isFormDirty = () => {
    const { paket_id, tanggal_berangkat, tanggal_pulang, kuota_tersedia, harga_per_orang } = form;
    return paket_id || tanggal_berangkat || tanggal_pulang || kuota_tersedia || harga_per_orang;
  };

  const submitNow = async () => {
    await createJadwal(form);
    navigate("/admin/jadwal");
  };

  const formatRupiah = (angka) =>
    angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const handleHargaChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setForm({ ...form, harga_per_orang: raw });
  };

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];

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

          <Link to="/admin/paket">
            <img src={PaketIcon} className="menu-icon" /> {!collapsed && "Paket Wisata"}
          </Link>

          <Link to="/admin/destinasi">
            <img src={DestinasiIcon} className="menu-icon" /> {!collapsed && "Destinasi"}
          </Link>

          <Link to="/admin/jadwal" className="active">
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

        <Link to="/admin/jadwal" className="back-btn">
          <img src={BackIcon} className="back-icon" />
          Kembali
        </Link>

        <h2 className="paket-title">Tambah Jadwal Trip</h2>

        <div className="paket-form-card">
          <form onSubmit={(e) => e.preventDefault()} className="form-grid">

            <div className="form-group form-left">
              <select
                name="paket_id"
                className="form-input"
                value={form.paket_id}
                onChange={handleChange}
              >
                <option value="">-- Pilih Paket Wisata --</option>
                {paket.map((p) => (
                  <option key={p.id} value={p.id}>{p.nama_paket}</option>
                ))}
              </select>
              <label className="form-label">Paket Wisata</label>
            </div>

            <div className="form-group form-right">
              <input
                type="date"
                name="tanggal_berangkat"
                className="form-input"
                min={minDate}
                value={form.tanggal_berangkat}
                onChange={handleChange}
              />
              <label className="form-label">Tanggal Berangkat</label>
            </div>

            <div className="form-group form-left">
              <input
                type="date"
                name="tanggal_pulang"
                className="form-input"
                min={form.tanggal_berangkat || minDate}
                value={form.tanggal_pulang}
                onChange={handleChange}
              />
              <label className="form-label">Tanggal Pulang</label>
            </div>

            <div className="form-group form-right">
              <input
                type="number"
                name="kuota_tersedia"
                className="form-input"
                placeholder=" "
                min="1"
                value={form.kuota_tersedia}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val < 1) setForm({ ...form, kuota_tersedia: 1 });
                  else setForm({ ...form, kuota_tersedia: val });
                }}
              />
              <label className="form-label">Kuota Tersedia</label>
            </div>

            <div className="form-group form-left">
              <input
                className="form-input"
                placeholder=" "
                value={
                  form.harga_per_orang
                    ? "Rp " + formatRupiah(form.harga_per_orang)
                    : ""
                }
                onChange={handleHargaChange}
              />
              <label className="form-label">Harga per Orang</label>
            </div>


            <div className="form-buttons">
              <button type="button" className="submit-btn-basic" onClick={() => setShowSaveModal(true)}>
                Simpan
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => isFormDirty() ? setShowCancelModal(true) : navigate("/admin/jadwal")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Batalkan?</h3>
            <p>Data yang telah diisi akan hilang.</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => navigate("/admin/jadwal")}>
                Ya, Batalkan
              </button>
              <button className="modal-cancel" onClick={() => setShowCancelModal(false)}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Simpan Jadwal?</h3>
            <p>Pastikan data sudah benar.</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={submitNow}>
                Ya, Simpan
              </button>
              <button className="modal-cancel" onClick={() => setShowSaveModal(false)}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}