import { Link } from "react-router-dom";
import "./dashboard.css";

import logo from "../../../assets/img/logo-dolandjogja.svg";

// ICONS
import DashboardIcon from "../../../assets/icon/dashboard.svg";
import PaketIcon from "../../../assets/icon/paket.svg";
import DestinasiIcon from "../../../assets/icon/destinasi.svg";
import JadwalIcon from "../../../assets/icon/jadwal.svg";
import BookingIcon from "../../../assets/icon/booking.svg";
import PaymentIcon from "../../../assets/icon/payment.svg";
import LogoutIcon from "../../../assets/icon/logout.svg";

export default function AdminDashboard() {
    return (
        <div className="dashboard-container">

            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                    <h2>dolanDjogja</h2>
                </div>

                <nav className="sidebar-menu">

                    <Link to="/admin/dashboard">
                        <img src={DashboardIcon} className="menu-icon" />
                        Dashboard
                    </Link>

                    <Link to="/admin/paket">
                        <img src={PaketIcon} className="menu-icon" />
                        Paket Wisata
                    </Link>

                    <Link to="/admin/destinasi">
                        <img src={DestinasiIcon} className="menu-icon" />
                        Destinasi
                    </Link>

                    <Link to="/admin/jadwal">
                        <img src={JadwalIcon} className="menu-icon" />
                        Jadwal Trip
                    </Link>

                    <Link to="/admin/bookings">
                        <img src={BookingIcon} className="menu-icon" />
                        Booking
                    </Link>

                    <Link to="/admin/payments">
                        <img src={PaymentIcon} className="menu-icon" />
                        Payments
                    </Link>

                </nav>

                <button className="logout-btn">
                    <img src={LogoutIcon} className="menu-icon" /> Logout
                </button>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <h1>Dashboard Admin</h1>
                    <div className="admin-info">👤 Admin</div>
                </header>

                <section className="cards-grid">
                    <div className="card">
                        <h3>Total Paket Wisata</h3>
                        <p className="value">12</p>
                    </div>

                    <div className="card">
                        <h3>Total Destinasi</h3>
                        <p className="value">18</p>
                    </div>

                    <div className="card">
                        <h3>Total Jadwal Trip</h3>
                        <p className="value">9</p>
                    </div>

                    <div className="card">
                        <h3>Total Booking</h3>
                        <p className="value">25</p>
                    </div>

                    <div className="card">
                        <h3>Total Payments</h3>
                        <p className="value">20</p>
                    </div>
                </section>
            </main>
        </div>
    );
}