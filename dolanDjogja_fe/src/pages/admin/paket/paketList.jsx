import { useEffect, useState } from "react";
import { getAllPaket, deletePaket } from "../../../services/paketService";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../../services/authService";

import IconAdd from "../../../assets/icon/tambah.svg";
import IconEdit from "../../../assets/icon/edit.svg";
import IconDelete from "../../../assets/icon/hapus.svg";

import "./paket.css";

export default function PaketList() {
  const [paket, setPaket] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredData = paket.filter((item) =>
    item.nama_paket.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="paket-page">
      <h2 className="paket-title">Daftar Paket Wisata</h2>

      <div className="paket-table-top">

        <Link to="/admin/paket/create" className="paket-add-btn">
          <img src={IconAdd} className="icon-btn" /> Tambah Paket
        </Link>

        <input
          type="text"
          placeholder="Cari di sini..."
          className="paket-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="paket-table-wrapper">
        <table className="paket-table">
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
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="paket-empty">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              filteredData.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nama_paket}</td>
                  <td>Rp {Number(p.harga).toLocaleString()}</td>
                  <td>{p.durasi}</td>
                  <td className="paket-action-col">
                    <Link
                      className="paket-edit"
                      to={`/admin/paket/edit/${p.id}`}
                    >
                      <img src={IconEdit} className="icon-btn-small" /> Edit
                    </Link>

                    <button
                      className="paket-delete"
                      onClick={() => handleDelete(p.id)}
                    >
                      <img src={IconDelete} className="icon-btn-small" /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="paket-count-info">
          Menampilkan {filteredData.length} dari {paket.length} data
        </div>
      </div>
    </div>
  );
}