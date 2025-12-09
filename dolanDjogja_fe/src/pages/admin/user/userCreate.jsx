import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createUser } from "../../../services/userService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./userCreateEdit.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";
import BackIcon from "../../../assets/icon/back.svg";
import ProfilIcon from "../../../assets/icon/profil.svg";

export default function UserCreate() {
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const isFormDirty = () => {
        return form.name || form.email || form.password || form.role !== "user";
    };

    const submitNow = async () => {
        await createUser(form);
        navigate("/admin/users");
    };

    return (
        <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>

            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <img src={logo} className="sidebar-logo" alt="Logo" />
                    {!collapsed && <h2>dolanDjogja</h2>}
                </div>

                <nav className="sidebar-menu">

                    <Link
                        to="/admin/dashboard"
                        className={location.pathname === "/admin/dashboard" ? "active" : ""}
                    >
                        <img src={DashboardIcon} className="menu-icon" />
                        {!collapsed && "Dashboard"}
                    </Link>

                    <Link
                        to="/admin/users"
                        className={location.pathname.includes("/admin/users") ? "active" : ""}
                    >
                        <img src={ProfilIcon} className="menu-icon" />
                        {!collapsed && "Kelola User"}
                    </Link>

                    <Link
                        to="/admin/paket"
                        className={location.pathname.includes("/admin/paket") ? "active" : ""}
                    >
                        <img src={PaketIcon} className="menu-icon" />
                        {!collapsed && "Paket Wisata"}
                    </Link>

                    <Link
                        to="/admin/destinasi"
                        className={location.pathname.includes("/admin/destinasi") ? "active" : ""}
                    >
                        <img src={DestinasiIcon} className="menu-icon" />
                        {!collapsed && "Destinasi"}
                    </Link>

                    <Link
                        to="/admin/jadwal"
                        className={location.pathname.includes("/admin/jadwal") ? "active" : ""}
                    >
                        <img src={JadwalIcon} className="menu-icon" />
                        {!collapsed && "Jadwal Trip"}
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className={location.pathname.includes("/admin/bookings") ? "active" : ""}
                    >
                        <img src={BookingIcon} className="menu-icon" />
                        {!collapsed && "Booking"}
                    </Link>

                    <Link
                        to="/admin/payments"
                        className={location.pathname.includes("/admin/payments") ? "active" : ""}
                    >
                        <img src={PaymentIcon} className="menu-icon" />
                        {!collapsed && "Payments"}
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

                <Link to="/admin/users" className="back-btn">
                    <img src={BackIcon} className="back-icon" />
                    Kembali
                </Link>

                <h2 className="page-title">Tambah User</h2>

                <div className="user-form-card">

                    <form onSubmit={(e) => e.preventDefault()} className="user-form-grid">

                        <div className="user-form-group form-left">
                            <input
                                className="user-input"
                                name="name"
                                placeholder=" "
                                value={form.name}
                                onChange={handleChange}
                            />
                            <label className="user-label">Nama</label>
                        </div>

                        <div className="user-form-group form-right">
                            <input
                                className="user-input"
                                name="email"
                                placeholder=" "
                                value={form.email}
                                onChange={handleChange}
                            />
                            <label className="user-label">Email</label>
                        </div>

                        <div className="user-form-group form-left">
                            <input
                                className="user-input"
                                name="password"
                                type="password"
                                placeholder=" "
                                value={form.password}
                                onChange={handleChange}
                            />
                            <label className="user-label">Password</label>
                        </div>

                        <div className="user-form-group form-right">
                            <select
                                className="user-select"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <label className="user-label select-fix">Role</label>
                        </div>

                        <div className="user-buttons">
                            <button
                                type="button"
                                className="user-save-btn"
                                onClick={() => setShowSaveModal(true)}
                            >
                                Simpan
                            </button>

                            <button
                                type="button"
                                className="user-cancel-btn"
                                onClick={() => {
                                    if (isFormDirty()) setShowCancelModal(true);
                                    else navigate("/admin/users");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            </main>

            {showCancelModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Batalkan Perubahan?</h3>
                        <p>Data yang sudah diisi akan hilang. Yakin ingin keluar?</p>
                        <div className="modal-actions">
                            <button className="modal-confirm" onClick={() => navigate("/admin/users")}>
                                Ya, Batalkan
                            </button>
                            <button className="modal-cancel" onClick={() => setShowCancelModal(false)}>
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSaveModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Simpan User?</h3>
                        <p>Periksa kembali data Anda sebelum menyimpan.</p>
                        <div className="modal-actions">
                            <button className="modal-confirm" onClick={submitNow}>
                                Ya, Simpan
                            </button>
                            <button className="modal-cancel" onClick={() => setShowSaveModal(false)}>
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}