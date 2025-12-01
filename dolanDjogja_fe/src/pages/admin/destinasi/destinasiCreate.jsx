import { useState } from "react";
import { createDestinasi } from "../../../services/destinasiService";
import { useNavigate } from "react-router-dom";

export default function DestinasiCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_destinasi: "",
    lokasi: "",
    deskripsi: "",
    harga_tiket: "",
    jam_buka: "",
    gambar: "",
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
      harga_tiket: Number(form.harga_tiket),
    };

    await createDestinasi(payload);
    navigate("/admin/destinasi");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Tambah Destinasi</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="nama_destinasi" placeholder="Nama Destinasi" onChange={handleChange} /><br />
        <input type="text" name="lokasi" placeholder="Lokasi" onChange={handleChange} /><br />
        <textarea name="deskripsi" placeholder="Deskripsi" onChange={handleChange} /><br />
        <input type="number" name="harga_tiket" placeholder="Harga Tiket" onChange={handleChange} /><br />
        <input type="text" name="jam_buka" placeholder="Jam Buka (07:00 - 17:00)" onChange={handleChange} /><br />
        <input type="text" name="gambar" placeholder="URL Gambar" onChange={handleChange} /><br />
        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}