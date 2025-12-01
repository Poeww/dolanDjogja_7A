import { useEffect, useState } from "react";
import { createJadwal } from "../../../services/jadwalTripService";
import { getAllPaket } from "../../../services/paketService";
import { useNavigate } from "react-router-dom";

export default function JadwalCreate() {
  const navigate = useNavigate();

  const [paket, setPaket] = useState([]);
  const [form, setForm] = useState({
    paket_id: "",
    tanggal_berangkat: "",
    tanggal_pulang: "",
    kuota_tersedia: "",
    harga_per_orang: "",
  });

  useEffect(() => {
    loadPaket();
  }, []);

  const loadPaket = async () => {
    const data = await getAllPaket();
    setPaket(data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createJadwal(form);
    navigate("/admin/jadwal");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Tambah Jadwal Trip</h2>

      <form onSubmit={handleSubmit}>
        <select name="paket_id" onChange={handleChange}>
          <option value="">-- Pilih Paket Wisata --</option>
          {paket.map((p) => (
            <option value={p.id} key={p.id}>
              {p.nama_paket}
            </option>
          ))}
        </select>
        <br />

        <input type="date" name="tanggal_berangkat" onChange={handleChange} /><br />
        <input type="date" name="tanggal_pulang" onChange={handleChange} /><br />

        <input type="number" name="kuota_tersedia" placeholder="Kuota" onChange={handleChange} /><br />
        <input type="number" name="harga_per_orang" placeholder="Harga per orang" onChange={handleChange} /><br />

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}