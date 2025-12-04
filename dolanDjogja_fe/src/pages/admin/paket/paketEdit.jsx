import { useEffect, useState } from "react";
import { getPaketById, updatePaket } from "../../../services/paketService";
import { Link, useNavigate, useParams } from "react-router-dom";

import "../dashboard/dashboard.css";
import "./paketCreateEdit.css";

import BackIcon from "../../../assets/icon/back.svg";

export default function PaketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

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

    const payload = new FormData();
    Object.keys(form).forEach((key) => payload.append(key, form[key]));

    if (thumbnail) {
      payload.append("gambar_thumbnail", thumbnail);
    }

    payload.append("_method", "PUT");

    try {
      await updatePaket(id, payload);
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
    <div className="dashboard-container">
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
              {errors.nama_paket && <p className="form-error">{errors.nama_paket[0]}</p>}
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
              {errors.durasi && <p className="form-error">{errors.durasi[0]}</p>}
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
              {errors.deskripsi && <p className="form-error">{errors.deskripsi[0]}</p>}
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
              {errors.lokasi_tujuan && <p className="form-error">{errors.lokasi_tujuan[0]}</p>}
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
              {errors.harga && <p className="form-error">{errors.harga[0]}</p>}
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
              {errors.kuota && <p className="form-error">{errors.kuota[0]}</p>}
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
                    <span>Belum ada gambar</span>
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