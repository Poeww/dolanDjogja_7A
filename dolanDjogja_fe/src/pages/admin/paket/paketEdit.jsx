import { useEffect, useState } from "react";
import { getPaketById, updatePaket } from "../../../services/paketService";
import { useNavigate, useParams } from "react-router-dom";

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
    gambar_thumbnail: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getPaketById(id);
    setForm({
      nama_paket: data.nama_paket || "",
      deskripsi: data.deskripsi || "",
      harga: data.harga || "",
      durasi: data.durasi || "",
      lokasi_tujuan: data.lokasi_tujuan || "",
      kuota: data.kuota || "",
      gambar_thumbnail: data.gambar_thumbnail || "",
    });
  };

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

    await updatePaket(id, payload);
    navigate("/admin/paket");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Edit Paket Wisata</h2>

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
          placeholder="Durasi"
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
          placeholder="URL Gambar"
          value={form.gambar_thumbnail}
          onChange={handleChange}
        />
        <br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}