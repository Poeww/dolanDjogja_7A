import { useEffect, useState } from "react";
import { getJadwalById, updateJadwal } from "../../../services/jadwalTripService";
import { getAllPaket } from "../../../services/paketService";
import { useNavigate, useParams } from "react-router-dom";

export default function JadwalEdit() {
  const { id } = useParams();
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
    loadAll();
  }, []);

  const loadAll = async () => {
    const pk = await getAllPaket();
    const jd = await getJadwalById(id);

    setPaket(pk);
    setForm(jd);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateJadwal(id, form);
    navigate("/admin/jadwal");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Edit Jadwal Trip</h2>

      <form onSubmit={handleSubmit}>
        <select name="paket_id" value={form.paket_id} onChange={handleChange}>
          {paket.map((p) => (
            <option value={p.id} key={p.id}>
              {p.nama_paket}
            </option>
          ))}
        </select><br />

        <input type="date" name="tanggal_berangkat" value={form.tanggal_berangkat} onChange={handleChange} /><br />
        <input type="date" name="tanggal_pulang" value={form.tanggal_pulang} onChange={handleChange} /><br />

        <input type="number" name="kuota_tersedia" value={form.kuota_tersedia} onChange={handleChange} /><br />
        <input type="number" name="harga_per_orang" value={form.harga_per_orang} onChange={handleChange} /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}