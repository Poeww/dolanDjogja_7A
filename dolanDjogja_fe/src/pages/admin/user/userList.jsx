import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../../services/userService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./user.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import ProfilIcon from "../../../assets/icon/profil.svg";

import IconAdd from "../../../assets/icon/tambah.svg";
import IconEdit from "../../../assets/icon/edit.svg";
import IconDelete from "../../../assets/icon/hapus.svg";

export default function UserList() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== "admin") {
            navigate("/login");
            return;
        }

        loadData();
    }, []);

    const loadData = async () => {
        const res = await getAllUsers();
        setUsers(res.data);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await deleteUser(deleteId);
        setShowDeleteModal(false);
        setDeleteId(null);
        loadData();
    };

    return (
        <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <img src={logo} className="sidebar-logo" alt="Logo" />
                    {!collapsed && <h2>dolanDjogja</h2>}
                </div>

                <nav className="sidebar-menu">
                    <Link to="/admin/dashboard" className={location.pathname.includes("/admin/dashboard") ? "active" : ""}>
                        <img src={DashboardIcon} className="menu-icon" /> {!collapsed && "Dashboard"}
                    </Link>

                    <Link to="/admin/users" className={location.pathname.includes("/admin/users") ? "active" : ""}>
                        <img src={ProfilIcon} className="menu-icon" /> {!collapsed && "Kelola User"}
                    </Link>

                    <Link to="/admin/paket" className={location.pathname.includes("/admin/paket") ? "active" : ""}>
                        <img src={PaketIcon} className="menu-icon" /> {!collapsed && "Paket Wisata"}
                    </Link>

                    <Link to="/admin/destinasi">
                        <img src={DestinasiIcon} className="menu-icon" /> {!collapsed && "Destinasi"}
                    </Link>

                    <Link to="/admin/jadwal">
                        <img src={JadwalIcon} className="menu-icon" /> {!collapsed && "Jadwal Trip"}
                    </Link>

                    <Link to="/admin/bookings">
                        <img src={BookingIcon} className="menu-icon" /> {!collapsed && "Booking"}
                    </Link>

                    <Link to="/admin/payments">
                        <img src={PaymentIcon} className="menu-icon" /> {!collapsed && "Payments"}
                    </Link>
                </nav>

                <button className="logout-btn">
                    <img src={LogoutIcon} className="menu-icon" /> {!collapsed && "Logout"}
                </button>
            </aside>

            <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "▶" : "◀"}
            </button>

            <main className="main-content">

                <h2 className="paket-title">Daftar User</h2>

                <div className="paket-table-top">
                    <div className="left-actions">
                        <Link to="/admin/users/create" className="paket-add-btn">
                            <img src={IconAdd} className="icon-btn" /> Tambah User
                        </Link>
                    </div>
                </div>

                <div className="paket-table-wrapper">
                    <table className="paket-table">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Terdaftar</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="paket-empty">
                                        Tidak ada user.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td className={u.role === "admin" ? "role-admin" : "role-user"}>
                                            {u.role}
                                        </td>
                                        <td>{new Date(u.created_at).toLocaleDateString()}</td>

                                        <td className="paket-action-col">
                                            <Link className="paket-edit" to={`/admin/users/edit/${u.id}`}>
                                                <img src={IconEdit} className="icon-btn-small" /> Edit
                                            </Link>

                                            <button
                                                className="paket-delete"
                                                onClick={() => handleDeleteClick(u.id)}
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
                        Menampilkan {users.length} dari {users.length} data
                    </div>
                </div>
            </main>

            {showDeleteModal && (
                <div className="paket-modal-overlay">
                    <div className="paket-modal-box">
                        <h3>Hapus User?</h3>
                        <p>User yang dihapus tidak dapat dikembalikan.</p>

                        <div className="paket-modal-actions">
                            <button className="paket-modal-confirm" onClick={confirmDelete}>Ya, Hapus</button>
                            <button className="paket-modal-cancel" onClick={() => setShowDeleteModal(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}