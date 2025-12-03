import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllBookings } from "../../../services/bookingService";
import { getUser } from "../../../services/authService";

import "../dashboard/dashboard.css";
import "./booking.css";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import LogoPDF from "../../../assets/img/logo-dolandjogja.png";

import logo from "../../../assets/img/logo-dolandjogja.svg";
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";

import IconExport from "../../../assets/icon/export.svg";
import IconEdit from "../../../assets/icon/edit.svg";

export default function BookingList() {
    const [collapsed, setCollapsed] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== "admin") {
            navigate("/login");
            return;
        }

        loadData();
    }, []);

    const loadData = async () => {
        const data = await getAllBookings();
        setBookings(data);
    };

    const filteredData = bookings.filter((b) => {
        const s = search.toLowerCase();
        return (
            String(b.id).includes(s) ||
            String(b.user?.name || "").toLowerCase().includes(s) ||
            String(b.jadwal_trip?.paket?.nama_paket || "").toLowerCase().includes(s) ||
            String(b.status_pembayaran || "").toLowerCase().includes(s)
        );
    });

    const exportPDF = () => {
        const doc = new jsPDF("p", "mm", "a4");

        doc.addImage(LogoPDF, "PNG", 14, 10, 22, 22);
        doc.setFontSize(18);
        doc.setTextColor(26, 115, 232);
        doc.text("Daftar Booking", 40, 20);

        const today = new Date().toLocaleString("id-ID", {
            dateStyle: "long",
            timeStyle: "short",
        });

        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(`Tanggal Export: ${today}`, 40, 28);

        autoTable(doc, {
            startY: 40,
            head: [
                ["ID", "Nama User", "Paket", "Jumlah Orang", "Total Harga", "Status"],
            ],
            body: filteredData.map((b) => [
                b.id,
                b.user?.name,
                b.jadwal_trip?.paket?.nama_paket,
                b.jumlah_orang,
                "Rp " + Number(b.total_harga).toLocaleString("id-ID"),
                b.status_pembayaran,
            ]),
            theme: "grid",
            headStyles: {
                fillColor: [26, 115, 232],
                textColor: 255,
            },
            alternateRowStyles: {
                fillColor: [245, 248, 255],
            },
        });

        window.open(doc.output("bloburl"), "_blank");
    };

    return (
        <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>
            <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                <div className="sidebar-header">
                    <img src={logo} className="sidebar-logo" alt="Logo" />
                    {!collapsed && <h2>dolanDjogja</h2>}
                </div>

                <nav className="sidebar-menu">
                    <Link to="/admin/dashboard">
                        <img src={DashboardIcon} className="menu-icon" />
                        {!collapsed && "Dashboard"}
                    </Link>

                    <Link to="/admin/paket">
                        <img src={PaketIcon} className="menu-icon" />
                        {!collapsed && "Paket Wisata"}
                    </Link>

                    <Link to="/admin/destinasi">
                        <img src={DestinasiIcon} className="menu-icon" />
                        {!collapsed && "Destinasi"}
                    </Link>

                    <Link to="/admin/jadwal">
                        <img src={JadwalIcon} className="menu-icon" />
                        {!collapsed && "Jadwal Trip"}
                    </Link>

                    <Link to="/admin/bookings" className="active">
                        <img src={BookingIcon} className="menu-icon" />
                        {!collapsed && "Booking"}
                    </Link>

                    <Link to="/admin/payments">
                        <img src={PaymentIcon} className="menu-icon" />
                        {!collapsed && "Payments"}
                    </Link>
                </nav>

                <button className="logout-btn">
                    <img src={LogoutIcon} className="menu-icon" />
                    {!collapsed && "Logout"}
                </button>
            </aside>

            <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "▶" : "◀"}
            </button>

            <main className="main-content">
                <h2 className="booking-title">Daftar Booking</h2>

                <div className="booking-table-top">
                    <div className="left-actions">
                        <button className="booking-export-btn" onClick={exportPDF}>
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
                                <th>Paket Trip</th>
                                <th>Jumlah Orang</th>
                                <th>Total Harga</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="booking-empty">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((b) => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>{b.user?.name}</td>
                                        <td>{b.jadwal_trip?.paket?.nama_paket}</td>
                                        <td>{b.jumlah_orang}</td>
                                        <td>
                                            Rp {Number(b.total_harga).toLocaleString("id-ID")}
                                        </td>
                                        <td>{b.status_pembayaran}</td>

                                        <td className="booking-action-col">
                                            <Link
                                                to={`/admin/payments/edit/${b.id}`}
                                                className="booking-edit"
                                            >
                                                <img src={IconEdit} className="icon-btn-small" />
                                                Verifikasi
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="booking-count-info">
                        Menampilkan {filteredData.length} dari {bookings.length} data
                    </div>
                </div>
            </main>
        </div>
    );
}