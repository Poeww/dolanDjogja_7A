import { useEffect, useState } from "react";
import { getAllJadwal, deleteJadwal } from "../../../services/jadwalTripService";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../../services/authService";

export default function JadwalList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    const res = await getAllJadwal();
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus jadwal?")) return;
    await deleteJadwal(id);
    loadData();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Daftar Jadwal Trip</h2>

      <Link to="/admin/jadwal/create">+ Tambah Jadwal</Link>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Paket</th>
            <th>Tanggal Berangkat</th>
            <th>Tanggal Pulang</th>
            <th>Kuota Tersedia</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((j) => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.paket?.nama_paket}</td>
              <td>{j.tanggal_berangkat}</td>
              <td>{j.tanggal_pulang}</td>
              <td>{j.kuota_tersedia}</td>
              <td>
                <Link to={`/admin/jadwal/edit/${j.id}`}>Edit</Link>{" "}
                <button onClick={() => handleDelete(j.id)}>Hapus</button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="6">Belum ada jadwal.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}