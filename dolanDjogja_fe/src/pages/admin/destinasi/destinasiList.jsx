import { useEffect, useState } from "react";
import { getAllDestinasi, deleteDestinasi } from "../../../services/destinasiService";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../../services/authService";

export default function DestinasiList() {
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
    const res = await getAllDestinasi();
    setData(res);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    await deleteDestinasi(id);
    loadData();
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Daftar Destinasi Wisata</h2>

      <Link to="/admin/destinasi/create">+ Tambah Destinasi</Link>

      <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Destinasi</th>
            <th>Lokasi</th>
            <th>Harga Tiket</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.nama_destinasi}</td>
              <td>{d.lokasi}</td>
              <td>{d.harga_tiket}</td>
              <td>
                <Link to={`/admin/destinasi/edit/${d.id}`}>Edit</Link>{" "}
                <button onClick={() => handleDelete(d.id)}>Hapus</button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="5">Belum ada data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}