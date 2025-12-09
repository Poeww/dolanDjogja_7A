import { useEffect, useState } from "react";
import { getPaketById, updatePaket, getThumbnailUrl } from "../../../services/paketService";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

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
import ProfilIcon from "../../../assets/icon/profil.svg";

export default function PaketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const [form, setForm] = useState({
    nama_paket: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    lokasi_tujuan: "",
    kuota: "",
  });

  const [oldThumbnail, setOldThumbnail] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getPaketById(id);
    setForm({
      nama_paket: data.nama_paket ?? "",
      deskripsi: data.deskripsi ?? "",
      harga: String(data.harga ?? ""),
      durasi: data.durasi ?? "",
      lokasi_tujuan: data.lokasi_tujuan ?? "",
      kuota: String(data.kuota ?? ""),
    });
    setOldThumbnail(data.gambar_thumbnail);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "harga") {
      const numeric = value.replace(/\D/g, "");
      setForm({ ...form, harga: numeric });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreviewImg(URL.createObjectURL(file));
  };

  const isFormDirty = () => {
    const { nama_paket, deskripsi, harga, durasi, lokasi_tujuan, kuota } = form;
    return (
      nama_paket ||
      deskripsi ||
      harga ||
      durasi ||
      lokasi_tujuan ||
      kuota ||
      thumbnail
    );
  };

  const submitNow = async () => {
    setLoading(true);
    setErrors({});

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    if (thumbnail) {
      fd.append("gambar_thumbnail", thumbnail);
    }

    fd.append("_method", "PUT");

    try {
      await updatePaket(id, fd);
      navigate("/admin/paket");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }

    setLoading(false);
  };

  const formatRupiah = (angka) =>
    angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
            className={location.pathname.includes("/admin/dashboard") ? "active" : ""}
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

        <h2 className="paket-title">Edit Paket Wisata</h2>

        <div className="paket-form-card">
          <form onSubmit={(e) => e.preventDefault()} className="form-grid">

            <div className="form-group form-left">
              <input
                name="nama_paket"
                className="form-input"
                placeholder=" "
                value={form.nama_paket}
                onChange={handleChange}
              />
              <label className="form-label">Nama Paket</label>
            </div>

            <div className="form-group form-right">
              <input
                name="durasi"
                className="form-input"
                placeholder=" "
                value={form.durasi}
                onChange={handleChange}
              />
              <label className="form-label">Durasi</label>
            </div>

            <div className="form-group form-left">
              <textarea
                name="deskripsi"
                className="form-input form-textarea"
                placeholder=" "
                value={form.deskripsi}
                onChange={handleChange}
              />
              <label className="form-label">Deskripsi</label>
            </div>

            <div className="form-group form-right">
              <input
                name="lokasi_tujuan"
                className="form-input"
                placeholder=" "
                value={form.lokasi_tujuan}
                onChange={handleChange}
              />
              <label className="form-label">Lokasi Tujuan</label>
            </div>

            <div className="form-group form-left">
              <input
                name="harga"
                className="form-input"
                placeholder=" "
                value={form.harga ? "Rp " + formatRupiah(form.harga) : ""}
                onChange={handleChange}
              />
              <label className="form-label">Harga</label>
            </div>

            <div className="form-group form-right">
              <input
                type="number"
                name="kuota"
                className="form-input"
                placeholder=" "
                value={form.kuota}
                onChange={handleChange}
              />
              <label className="form-label">Kuota</label>
            </div>

            <div className="upload-row form-full">
              <div className="preview-wrapper">

                {oldThumbnail && !previewImg && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${oldThumbnail}`}
                    className="upload-preview"
                    alt="thumbnail lama"
                  />
                )}

                {previewImg && (
                  <>
                    <img src={previewImg} className="upload-preview" alt="preview" />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => {
                        setPreviewImg(null);
                        setThumbnail(null);
                        document.getElementById("fileInput").value = "";
                      }}
                    >
                      ✕
                    </button>
                  </>
                )}

                {!oldThumbnail && !previewImg && (
                  <div className="upload-preview placeholder">
                    Belum ada gambar
                  </div>
                )}

              </div>

              <div className="upload-right">
                <input
                  className="form-input upload-display"
                  type="text"
                  readOnly
                  value={thumbnail ? thumbnail.name : ""}
                  placeholder="Belum ada file dipilih"
                />
                <button
                  type="button"
                  className="file-input-custom"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Pilih Gambar
                </button>
                <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="submit-btn-basic"
                disabled={loading}
                onClick={() => setShowSaveModal(true)}
              >
                {loading ? "Menyimpan..." : "Update"}
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  if (isFormDirty()) {
                    setShowCancelModal(true);
                  } else {
                    navigate("/admin/paket");
                  }
                }}
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
            <p>Data yang sudah diubah akan hilang. Yakin ingin keluar?</p>
            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => navigate("/admin/paket")}>Ya, Batalkan</button>
              <button className="modal-cancel" onClick={() => setShowCancelModal(false)}>Kembali</button>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Simpan Perubahan?</h3>
            <p>Periksa kembali data sebelum menyimpan.</p>
            <div className="modal-actions">
              <button className="modal-confirm" onClick={submitNow}>Ya, Simpan</button>
              <button className="modal-cancel" onClick={() => setShowSaveModal(false)}>Kembali</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}