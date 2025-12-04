import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { getDestinasiById, updateDestinasi } from "../../../services/destinasiService";

import "../dashboard/dashboard.css";
import "./destinasiCreateEdit.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import BackIcon from "../../../assets/icon/back.svg";

export default function DestinasiEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const [form, setForm] = useState({
    nama_destinasi: "",
    lokasi: "",
    deskripsi: "",
    harga_tiket: "",
    jam_buka: "",
    gambar: null,
  });

  const [oldImage, setOldImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    loadDestinasi();
  }, []);

  const loadDestinasi = async () => {
    const data = await getDestinasiById(id);

    setForm({
      nama_destinasi: data.nama_destinasi || "",
      lokasi: data.lokasi || "",
      deskripsi: data.deskripsi || "",
      harga_tiket: data.harga_tiket || "",
      jam_buka: data.jam_buka || "",
      gambar: null,
    });

    setOldImage(data.gambar);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, gambar: file });
    setPreviewImg(file ? URL.createObjectURL(file) : null);
  };

  const isFormDirty = () => {
    return (
      form.nama_destinasi ||
      form.lokasi ||
      form.deskripsi ||
      form.harga_tiket ||
      form.jam_buka ||
      form.gambar
    );
  };

  const submitNow = async () => {
    const fd = new FormData();

    fd.append("nama_destinasi", form.nama_destinasi);
    fd.append("lokasi", form.lokasi);
    fd.append("deskripsi", form.deskripsi);
    fd.append("harga_tiket", form.harga_tiket);
    fd.append("jam_buka", form.jam_buka);

    if (form.gambar) {
      fd.append("gambar", form.gambar);
    }

    fd.append("_method", "PUT");

    await updateDestinasi(id, fd);
    navigate("/admin/destinasi");
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

          <Link to="/admin/paket">
            <img src={PaketIcon} className="menu-icon" /> {!collapsed && "Paket Wisata"}
          </Link>

          <Link to="/admin/destinasi" className="active">
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

        <Link to="/admin/destinasi" className="back-btn">
          <img src={BackIcon} className="back-icon" />
          Kembali
        </Link>

        <h2 className="paket-title">Edit Destinasi</h2>

        <div className="paket-form-card">
          <form onSubmit={(e) => e.preventDefault()} className="form-grid">

            <div className="form-group form-left">
              <input
                name="nama_destinasi"
                className="form-input"
                placeholder=" "
                value={form.nama_destinasi}
                onChange={handleChange}
              />
              <label className="form-label">Nama Destinasi</label>
            </div>

            <div className="form-group form-right">
              <input
                name="lokasi"
                className="form-input"
                placeholder=" "
                value={form.lokasi}
                onChange={handleChange}
              />
              <label className="form-label">Lokasi</label>
            </div>

            <div className="form-group form-left">
              <input
                type="number"
                name="harga_tiket"
                className="form-input"
                placeholder=" "
                value={form.harga_tiket}
                onChange={handleChange}
              />
              <label className="form-label">Harga Tiket</label>
            </div>

            <div className="form-group form-right">
              <input
                name="jam_buka"
                className="form-input"
                placeholder=" "
                value={form.jam_buka}
                onChange={handleChange}
              />
              <label className="form-label">Jam Buka (07:00 - 17:00)</label>
            </div>

            <div className="form-group form-full">
              <textarea
                name="deskripsi"
                className="form-input form-textarea"
                placeholder=" "
                value={form.deskripsi}
                onChange={handleChange}
              />
              <label className="form-label">Deskripsi</label>
            </div>

            <div className="upload-row form-full">
              <div className="preview-wrapper">

                {previewImg ? (
                  <>
                    <img src={previewImg} className="upload-preview" alt="preview" />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => {
                        setPreviewImg(null);
                        setForm({ ...form, gambar: null });
                        document.getElementById("fileInput").value = "";
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : oldImage ? (
                  <img
                    src={`/storage/${oldImage}`}
                    className="upload-preview"
                    alt="old"
                  />
                ) : (
                  <div className="upload-preview placeholder">
                    Belum ada gambar
                  </div>
                )}

              </div>

              <div className="upload-right">
                <input
                  className="form-input upload-display"
                  readOnly
                  type="text"
                  value={form.gambar ? form.gambar.name : ""}
                  placeholder="Belum ada file dipilih"
                />

                <button
                  type="button"
                  className="file-input-custom"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Pilih Gambar
                </button>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="submit-btn-basic" onClick={() => setShowSaveModal(true)}>
                Simpan
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  if (isFormDirty()) setShowCancelModal(true);
                  else navigate("/admin/destinasi");
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
            <p>Data yang telah diubah akan hilang.</p>

            <div className="modal-actions">
              <button className="modal-confirm" onClick={() => navigate("/admin/destinasi")}>
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
            <h3>Simpan Perubahan?</h3>
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