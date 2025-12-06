import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/userService";

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

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const [originalForm, setOriginalForm] = useState({});
    const [touched, setTouched] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getUserById(id);
        setForm({ ...res.data, password: "" });
        setOriginalForm({ ...res.data, password: "" });
    };

    const handleChange = (e) => {
        if (!touched) setTouched(true);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const isFormDirty = () => {
        return (
            touched &&
            (
                form.name !== originalForm.name ||
                form.email !== originalForm.email ||
                form.role !== originalForm.role ||
                form.password !== ""
            )
        );
    };

    const submitNow = async () => {
        const payload = { ...form };
        if (payload.password === "") delete payload.password;

        await updateUser(id, payload);
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
                    <Link to="/admin/dashboard"
                        className={location.pathname === "/admin/dashboard" ? "active" : ""}>
                        <img src={DashboardIcon} className="menu-icon" /> {!collapsed && "Dashboard"}
                    </Link>

                    <Link to="/admin/paket">
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

                    <Link to="/admin/users" className="active">
                        <img src={DashboardIcon} className="menu-icon" /> {!collapsed && "Users"}
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

                <h2 className="page-title">Edit User</h2>

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
                            <label className="user-label">Password (Opsional)</label>
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
                            <label className="user-label">Role</label>
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
                        <p>Data yang telah diubah akan hilang. Yakin ingin keluar?</p>

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
                        <h3>Simpan Perubahan?</h3>
                        <p>Pastikan data yang diubah sudah benar.</p>

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