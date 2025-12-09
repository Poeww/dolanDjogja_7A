import { useState, useEffect, useRef } from "react";
import "./navbar.css";
import Logo from "../assets/img/logo-dolandjogja.svg";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    const toggleDropdown = () => {
        setOpenDropdown((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-left">
                <a className="nav-item" onClick={() => scrollToSection("home")}>
                    <img src={Logo} alt="DolanDjogja" className="logo-img" />
                </a>
            </div>

            <div className="nav-right">

                <a className="nav-item" onClick={() => scrollToSection("home")}>Home</a>
                <a className="nav-item" onClick={() => scrollToSection("destinasi")}>Destinasi</a>
                <a className="nav-item" onClick={() => scrollToSection("paket")}>Paket</a>

                {!user && (
                    <a href="/login" className="btn-login">Login</a>
                )}

                {user && role === "user" && (
                    <>

                        <div className="dropdown" ref={dropdownRef}>
                            <button className="dropbtn" onClick={toggleDropdown}>
                                Akun ▾
                            </button>

                            <div className={`dropdown-content ${openDropdown ? "show" : ""}`}>
                                <a href="/profile">Profil</a>
                                <a href="/mybookings">Riwayat Booking</a>

                                <button onClick={handleLogout} className="logout-btn">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {user && role === "admin" && (
                    <a href="/admin" className="nav-item">Dashboard</a>
                )}

            </div>
        </nav>
    );
}