import { useEffect, useState } from "react";
import { getDestinasiById, updateDestinasi } from "../../../services/destinasiService";
import { useNavigate, useParams } from "react-router-dom";

export default function DestinasiEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_destinasi: "",
    lokasi: "",
    deskripsi: "",
    harga_tiket: "",
    jam_buka: "",
    gambar: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getDestinasiById(id);
    setForm(data);
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
      harga_tiket: Number(form.harga_tiket),
    };

    await updateDestinasi(id, payload);
    navigate("/admin/destinasi");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Edit Destinasi</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="nama_destinasi" value={form.nama_destinasi} onChange={handleChange} /><br />
        <input type="text" name="lokasi" value={form.lokasi} onChange={handleChange} /><br />
        <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} /><br />
        <input type="number" name="harga_tiket" value={form.harga_tiket} onChange={handleChange} /><br />
        <input type="text" name="jam_buka" value={form.jam_buka} onChange={handleChange} /><br />
        <input type="text" name="gambar" value={form.gambar} onChange={handleChange} /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}