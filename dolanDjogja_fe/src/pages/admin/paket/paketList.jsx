import { useEffect, useState } from "react";
import { getAllPaket, deletePaket } from "../../../services/paketService";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../../services/authService";

export default function PaketList() {
  const [paket, setPaket] = useState([]);
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
    const data = await getAllPaket();
    setPaket(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus paket ini?")) return;
    await deletePaket(id);
    loadData();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Daftar Paket Wisata</h2>

      <Link to="/admin/paket/create">+ Tambah Paket</Link>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Paket</th>
            <th>Harga</th>
            <th>Durasi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paket.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nama_paket}</td>
              <td>{p.harga}</td>
              <td>{p.durasi}</td>
              <td>
                <Link to={`/admin/paket/edit/${p.id}`}>Edit</Link>{" "}
                <button onClick={() => handleDelete(p.id)}>Hapus</button>
              </td>
            </tr>
          ))}

          {paket.length === 0 && (
            <tr>
              <td colSpan="5">Belum ada paket wisata.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}