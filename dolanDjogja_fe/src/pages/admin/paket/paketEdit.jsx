import { useEffect, useState } from "react";
import { getPaketById, updatePaket } from "../../../services/paketService";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

        <h2 className="paket-title">Edit Paket Wisata</h2>

        <div className="paket-form-card">
          <form onSubmit={handleSubmit} className="form-grid">

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
                    src={`/storage/${oldThumbnail}`}
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
              <button type="submit" className="submit-btn-basic" disabled={loading}>
                {loading ? "Menyimpan..." : "Update"}
              </button>

              <button type="button" className="btn-cancel" onClick={() => navigate("/admin/paket")}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}