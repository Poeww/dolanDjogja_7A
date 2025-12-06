import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../../services/userService";

import "../dashboard/dashboard.css";
import "./user.css";

export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllUsers();
        setUsers(res.data);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus user ini?")) return;

        await deleteUser(id);
        loadData();
    };

    return (
        <div className="dashboard-content">
            <div className="content-header">
                <h2>Kelola User</h2>

                <Link to="/admin/users/create" className="btn-primary">
                    + Tambah User
                </Link>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Tgl Daftar</th>
                        <th>Aksi</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td className={u.role === "admin" ? "role-admin" : "role-user"}>
                                {u.role}
                            </td>
                            <td>{new Date(u.created_at).toLocaleDateString()}</td>

                            <td>
                                <Link to={`/admin/users/edit/${u.id}`} className="btn-edit">
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="btn-delete"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
