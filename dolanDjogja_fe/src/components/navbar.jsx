import "./navbar.css";
import Logo from "../assets/img/logo-dolandjogja.svg";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

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
                        <a href="/booking" className="nav-item">Booking</a>

                        <div className="dropdown">
                            <button className="dropbtn">Akun ▾</button>

                            <div className="dropdown-content">
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