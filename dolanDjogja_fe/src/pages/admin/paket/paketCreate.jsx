import { useState } from "react";
import { createPaket } from "../../../services/paketService";
import { useNavigate } from "react-router-dom";

export default function PaketCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_paket: "",
    deskripsi: "",
    harga: "",
    durasi: "",
    lokasi_tujuan: "",
    kuota: "",
    gambar_thumbnail: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      harga: Number(form.harga),
      kuota: Number(form.kuota),
    };

    await createPaket(payload);
    navigate("/admin/paket");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Tambah Paket Wisata</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nama_paket"
          placeholder="Nama Paket"
          value={form.nama_paket}
          onChange={handleChange}
        />
        <br />

        <textarea
          name="deskripsi"
          placeholder="Deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
        />
        <br />

        <input
          type="number"
          name="harga"
          placeholder="Harga"
          value={form.harga}
          onChange={handleChange}
        />
        <br />

        <input
          type="text"
          name="durasi"
          placeholder="Durasi (misal: 3 Hari 2 Malam)"
          value={form.durasi}
          onChange={handleChange}
        />
        <br />

        <input
          type="text"
          name="lokasi_tujuan"
          placeholder="Lokasi Tujuan"
          value={form.lokasi_tujuan}
          onChange={handleChange}
        />
        <br />

        <input
          type="number"
          name="kuota"
          placeholder="Kuota"
          value={form.kuota}
          onChange={handleChange}
        />
        <br />

        <input
          type="text"
          name="gambar_thumbnail"
          placeholder="URL Gambar (opsional)"
          value={form.gambar_thumbnail}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}