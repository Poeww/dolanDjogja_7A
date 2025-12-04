import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getJadwalById, updateJadwal } from "../../../services/jadwalTripService";
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

export default function JadwalEdit() {
  const { id } = useParams();
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

    loadAll();
  }, []);

  const loadAll = async () => {
    const pk = await getAllPaket();
    const jd = await getJadwalById(id);

    setPaket(pk);
    setForm({
      paket_id: jd.paket_id ?? "",
      tanggal_berangkat: jd.tanggal_berangkat ?? "",
      tanggal_pulang: jd.tanggal_pulang ?? "",
      kuota_tersedia: jd.kuota_tersedia ?? "",
      harga_per_orang: jd.harga_per_orang ?? "",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const isFormDirty = () => {
    return (
      form.paket_id ||
      form.tanggal_berangkat ||
      form.tanggal_pulang ||
      form.kuota_tersedia ||
      form.harga_per_orang
    );
  };

  const submitNow = async () => {
    await updateJadwal(id, form);
    navigate("/admin/jadwal");
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

        <h2 className="paket-title">Edit Jadwal Trip</h2>

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
                  <option key={p.id} value={p.id}>
                    {p.nama_paket}
                  </option>
                ))}
              </select>
              <label className="form-label">Paket Wisata</label>
            </div>

            <div className="form-group form-right">
              <input
                type="date"
                name="tanggal_berangkat"
                className="form-input"
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
                value={form.kuota_tersedia}
                onChange={handleChange}
              />
              <label className="form-label">Kuota Tersedia</label>
            </div>

            <div className="form-group form-left">
              <input
                type="number"
                name="harga_per_orang"
                className="form-input"
                placeholder=" "
                value={form.harga_per_orang}
                onChange={handleChange}
              />
              <label className="form-label">Harga per Orang</label>
            </div>

            <div className="form-buttons">
              <button type="button" className="submit-btn-basic" onClick={() => setShowSaveModal(true)}>
                Update
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => (isFormDirty() ? setShowCancelModal(true) : navigate("/admin/jadwal"))}
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
            <h3>Batalkan Perubahan?</h3>
            <p>Perubahan yang sudah Anda buat akan hilang.</p>

            <div className="modal-actions">
              <button
                className="modal-confirm"
                onClick={() => navigate("/admin/jadwal")}
              >
                Ya, Batalkan
              </button>

              <button
                className="modal-cancel"
                onClick={() => setShowCancelModal(false)}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update Jadwal?</h3>
            <p>Pastikan semua data sudah benar sebelum menyimpan.</p>

            <div className="modal-actions">
              <button
                className="modal-confirm"
                onClick={submitNow}
              >
                Ya, Update
              </button>

              <button
                className="modal-cancel"
                onClick={() => setShowSaveModal(false)}
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}