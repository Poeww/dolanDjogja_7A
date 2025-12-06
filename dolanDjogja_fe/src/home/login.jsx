import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

import TuguIcon from "../assets/img/logo-dolandjogja.svg";
import BgIllustration from "../assets/img/bg-login.svg";
import FrameAtas from "../assets/img/frame-atas-login.svg";
import FrameBawah from "../assets/img/frame-bawah-login.svg";

export default function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await login(form);
            const user = res.user;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", res.token);

            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            setError("Email atau kata sandi yang Anda masukkan tidak valid!");
        }
    };

    return (
        <div className="card-container">

            <img src={FrameAtas} alt="Hiasan Atas" className="decor-top" />
            <img src={FrameBawah} alt="Hiasan Bawah" className="decor-bottom" />

            <div className="form-section">

                <img src={TuguIcon} alt="Logo Dolan Djogja" className="logo" />

                <h2 className="title">Masuk</h2>
                <p className="subtitle">
                    Lanjutkan perjalananmu dan jelajahi keindahan Yogyakarta bersama kami.
                </p>

                {error && <p className="error-text">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">

                    <label className="label">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Masukkan email Anda..."
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Kata Sandi</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Masukkan kata sandi Anda..."
                        value={form.password}
                        onChange={handleChange}
                        className="input"
                    />

                    <button type="submit" className="btn">
                        Masuk
                    </button>
                </form>

                <p className="register-text">
                    Belum memiliki akun?
                    <Link to="/register" className="register-link"> Daftar sekarang</Link>
                </p>
            </div>

            <div className="image-section">
                <img src={BgIllustration} alt="Ilustrasi Yogyakarta" />
            </div>

        </div>
    );
}