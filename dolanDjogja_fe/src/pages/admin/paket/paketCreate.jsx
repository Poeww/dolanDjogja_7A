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
  const [showCancelModal, setShowCancelModal] = useState(false);

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

  const isFormDirty = () => {
    const { nama_paket, deskripsi, harga, durasi, lokasi_tujuan, kuota, destinasi_ids, gambar_thumbnail } = form;
    return (
      nama_paket ||
      deskripsi ||
      harga ||
      durasi ||
      lokasi_tujuan ||
      kuota ||
      destinasi_ids.length > 0 ||
      gambar_thumbnail
    );
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

    form.destinasi_ids.forEach((id) => payload.append("destinasi_ids[]", id));

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
          <Link
            to="/admin/dashboard"
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
          >
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
              <input
                className="form-input"
                placeholder=" "
                value={form.nama_paket}
                onChange={(e) => setForm({ ...form, nama_paket: e.target.value })}
              />
              <label className="form-label">Nama Paket</label>
            </div>

            <div className="form-group form-right">
              <input
                className="form-input"
                placeholder=" "
                value={form.durasi}
                onChange={(e) => setForm({ ...form, durasi: e.target.value })}
              />
              <label className="form-label">Durasi</label>
            </div>

            <div className="form-group form-left">
              <textarea
                className="form-input form-textarea"
                placeholder=" "
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              />
              <label className="form-label">Deskripsi</label>
            </div>

            <div className="form-group form-right">
              <input
                className="form-input"
                placeholder=" "
                value={form.lokasi_tujuan}
                onChange={(e) =>
                  setForm({ ...form, lokasi_tujuan: e.target.value })
                }
              />
              <label className="form-label">Lokasi Tujuan</label>
            </div>

            <div className="form-group form-left">
              <input
                className="form-input"
                placeholder=" "
                value={form.harga ? "Rp " + formatRupiah(form.harga) : ""}
                onChange={handleHargaChange}
              />
              <label className="form-label">Harga</label>
            </div>

            <div className="form-group form-right">
              <input
                type="number"
                className="form-input"
                placeholder=" "
                min="0"
                value={form.kuota}
                onChange={(e) => setForm({ ...form, kuota: e.target.value })}
              />
              <label className="form-label">Kuota</label>
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
                        setForm({ ...form, gambar_thumbnail: null });
                        document.getElementById("fileInput").value = "";
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="upload-preview placeholder">
                    <span>Belum ada gambar</span>
                  </div>
                )}
              </div>

              <div className="upload-right">
                <input
                  className="form-input upload-display"
                  type="text"
                  readOnly
                  value={form.gambar_thumbnail ? form.gambar_thumbnail.name : ""}
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
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="destinasi-box form-full">
              {destinasiList.map((d) => (
                <label key={d.id} className="destinasi-item">
                  <input
                    type="checkbox"
                    checked={form.destinasi_ids.includes(d.id)}
                    onChange={() => toggleDestinasi(d.id)}
                  />
                  {d.nama_destinasi}
                </label>
              ))}
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn-basic">
                Simpan
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
            <p>Data yang sudah diisi akan hilang. Yakin ingin keluar?</p>

            <div className="modal-actions">
              <button
                className="modal-confirm"
                onClick={() => navigate("/admin/paket")}
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
    </div>
  );
}