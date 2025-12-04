import { useEffect, useState } from "react";
import { getPaketById, updatePaket } from "../../../services/paketService";
import { useNavigate, useParams } from "react-router-dom";

import "../dashboard/dashboard.css";
import "./paketCreateEdit.css";

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
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      const onlyNumber = value.replace(/\D/g, "");
      setForm({
        ...form,
        harga: onlyNumber,
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setPreview(URL.createObjectURL(file));
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

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <div className="form-wrapper">
          <h2 className="form-title">Edit Paket Wisata</h2>

          <form onSubmit={handleSubmit} className="form-card">

            <div className="input-group">
              <input
                type="text"
                name="nama_paket"
                value={form.nama_paket}
                onChange={handleChange}
                required
              />
              <label>Nama Paket</label>
              {errors.nama_paket && <p className="error">{errors.nama_paket[0]}</p>}
            </div>

            <div className="input-group">
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
              />
              <label>Deskripsi</label>
              {errors.deskripsi && <p className="error">{errors.deskripsi[0]}</p>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="harga"
                value={
                  form.harga
                    ? "Rp " +
                    Number(form.harga).toLocaleString("id-ID")
                    : ""
                }
                onChange={handleChange}
                required
              />
              <label>Harga</label>
              {errors.harga && <p className="error">{errors.harga[0]}</p>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="durasi"
                value={form.durasi}
                onChange={handleChange}
                required
              />
              <label>Durasi</label>
              {errors.durasi && <p className="error">{errors.durasi[0]}</p>}
            </div>

            <div className="input-group">
              <input
                type="text"
                name="lokasi_tujuan"
                value={form.lokasi_tujuan}
                onChange={handleChange}
                required
              />
              <label>Lokasi Tujuan</label>
              {errors.lokasi_tujuan && <p className="error">{errors.lokasi_tujuan[0]}</p>}
            </div>

            <div className="input-group">
              <input
                type="number"
                name="kuota"
                value={form.kuota}
                onChange={handleChange}
                required
              />
              <label>Kuota</label>
              {errors.kuota && <p className="error">{errors.kuota[0]}</p>}
            </div>

            <div className="image-upload-area">
              <label className="upload-label">Thumbnail Paket</label>

              {oldThumbnail && !preview && (
                <img
                  src={`/storage/${oldThumbnail}`}
                  className="image-preview"
                  alt="thumbnail"
                />
              )}

              {preview && (
                <img src={preview} className="image-preview" alt="preview" />
              )}

              <input type="file" accept="image/*" onChange={handleImage} />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Menyimpan..." : "Update"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}