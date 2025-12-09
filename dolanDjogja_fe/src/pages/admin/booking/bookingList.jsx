import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllBookings } from "../../../services/bookingService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./booking.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";

import DashboardIcon from "../../../assets/icon/dashboard.svg";
import ProfilIcon from "../../../assets/icon/profil.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";

import IconEdit from "../../../assets/icon/edit.svg";
import IconExport from "../../../assets/icon/export.svg";

export default function BookingList() {
    const [collapsed, setCollapsed] = useState(false);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");

    const location = useLocation();
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
        const res = await getAllBookings();
        setData(res);
    };

    const filtered = data.filter((b) => {
        const s = search.toLowerCase();
        return (
            String(b.id).includes(s) ||
            b.user?.name?.toLowerCase().includes(s) ||
            b.jadwalTrip?.paket?.nama_paket?.toLowerCase().includes(s) ||
            b.status_pembayaran?.toLowerCase().includes(s)
        );
    });

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>
            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <img src={logo} className="sidebar-logo" />
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
                        className="active"
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

                <button className="logout-btn" onClick={handleLogout}>
                    <img src={LogoutIcon} className="menu-icon" /> {!collapsed && "Logout"}
                </button>
            </aside>

            <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "▶" : "◀"}
            </button>

            <main className="main-content">
                <h2 className="booking-title">Daftar Booking</h2>

                <div className="booking-table-top">
                    <div className="left-actions">
                        <button className="booking-export-btn">
                            <img src={IconExport} className="icon-btn-small black-icon" />
                            Export
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Cari booking..."
                        className="booking-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="booking-table-wrapper">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nama User</th>
                                <th>Paket Wisata</th>
                                <th>Jumlah Orang</th>
                                <th>Total Harga</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="booking-empty">Tidak ada data.</td>
                                </tr>
                            ) : (
                                filtered.map((b) => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>{b.user?.name}</td>
                                        <td>{b.jadwal_trip?.paket?.nama_paket}</td>
                                        <td>{b.jumlah_orang}</td>
                                        <td>Rp {Number(b.total_harga).toLocaleString("id-ID")}</td>
                                        <td>{b.status_pembayaran}</td>
                                        <td>
                                            <Link className="booking-edit" to={`/admin/bookings/edit/${b.id}`}>
                                                <img src={IconEdit} className="icon-btn-small" /> Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="booking-count-info">
                        Menampilkan {filtered.length} dari {data.length} data
                    </div>
                </div>
            </main>
        </div>
    );
}