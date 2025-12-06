import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

import Logo from "../assets/img/logo-dolandjogja.svg";
import BgRegister from "../assets/img/bg-regis.svg";
import RegisUp from "../assets/img/frame-atas-regis.svg";
import RegisDown from "../assets/img/frame-bawah-regis.svg";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await register(form);
            setMessage("Registrasi berhasil! Silakan masuk.");
            navigate("/login");
        } catch (err) {
            setMessage("Registrasi gagal. Periksa kembali data Anda.");
        }
    };

    return (
        <div className="card-container">

            <img src={RegisUp} alt="Dekorasi Atas" className="decor-right-top" />
            <img src={RegisDown} alt="Dekorasi Bawah" className="decor-right-bottom" />

            <div className="image-section">
                <img src={BgRegister} alt="Ilustrasi Registrasi" />
            </div>

            <div className="form-section">

                <img src={Logo} alt="Logo Dolan Jogja" className="logo" />

                <h2 className="title">Buat Akun Baru</h2>
                <p className="subtitle">
                    Temukan pengalaman wisata, penawaran menarik, dan destinasi terbaik di Yogyakarta.
                </p>

                {message && <p className="error-text">{message}</p>}

                <form onSubmit={handleSubmit}>

                    <label className="label">Nama Lengkap</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Masukkan nama lengkap..."
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Masukkan email..."
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Kata Sandi</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Masukkan kata sandi..."
                        value={form.password}
                        onChange={handleChange}
                        className="input"
                    />

                    <label className="label">Konfirmasi Kata Sandi</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        placeholder="Ulangi kata sandi..."
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className="input"
                    />

                    <button type="submit" className="btn">
                        Daftar
                    </button>

                </form>

                <p className="register-text">
                    Sudah memiliki akun?
                    <Link to="/login" className="register-link"> Masuk di sini</Link>
                </p>

            </div>

        </div>
    );
}