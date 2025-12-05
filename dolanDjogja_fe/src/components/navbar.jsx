import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="nav-logo">dolanDjogja</Link>
            </div>

            <div className="nav-right">
                <Link to="/">Home</Link>
                <Link to="/destinasi">Destinasi</Link>
                <Link to="/paket">Paket</Link>

                {!user && (
                    <Link to="/login" className="btn-login">Login</Link>
                )}

                {user && role === "customer" && (
                    <>
                        <Link to="/booking">Booking</Link>

                        <div className="dropdown">
                            <button className="dropbtn">Akun ▾</button>
                            <div className="dropdown-content">
                                <Link to="/mybookings">Riwayat Booking</Link>
                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}