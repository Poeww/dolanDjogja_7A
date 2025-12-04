import { useState } from "react";
import { createPaket } from "../../../services/paketService";
import { useNavigate } from "react-router-dom";
import "../dashboard/dashboard.css";
import "./paketCreateEdit.css";

export default function PaketCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_paket: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    lokasi_tujuan: "",
    kuota: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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

    try {
      await createPaket(fd);
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
          <h2 className="form-title">Tambah Paket Wisata</h2>

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
              ></textarea>
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
              <label>Durasi (misal: 3 Hari 2 Malam)</label>
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
              <label className="upload-label">Upload Gambar</label>
              <input type="file" accept="image/*" onChange={handleImage} />

              {preview && (
                <img src={preview} className="image-preview" alt="preview" />
              )}
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}