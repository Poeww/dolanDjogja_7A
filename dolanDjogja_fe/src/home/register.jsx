// src/pages/Register.jsx

import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // ✅ Import CSS global

// ✅ Import gambar PNG
import dolandjogjaLogo from "../assets/dolandjogjaLogo.png";
import loginImage from "../assets/loginImage.png"; // Gunakan ilustrasi yang sama seperti di login
import ilustrasi from "../assets/ilustrasi.png";   // Pola gelombang di sudut kanan bawah

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
            setMessage("Registrasi berhasil!");
            navigate("/login");
        } catch (err) {
            setMessage("Registrasi gagal.");
        }
    };

    return (
        <div className="container">
            <div className="leftSide">
                <img
                    src={dolandjogjaLogo}
                    alt="Dolan Jogja"
                    className="logo"
                />

                <div className="titleSection">
                    <h1 className="title">Create Your Account</h1>
                    <p className="description">
                        Discover hidden gems, exclusive offers and unforgettable travel experiences in Yogyakarta.
                    </p>
                </div>

                {message && <div className="message">{message}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <div className="formGroup">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name..."
                            value={form.name}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={form.email}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={form.password}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div className="formGroup">
                        <label className="label">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Enter your password again..."
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <button type="submit" className="submitButton">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Sign Up
                    </button>
                </form>

                <p className="loginText">
                    Already have an account?{" "}
                    <a href="/login" className="loginLink">
                        Sign In Here
                    </a>
                </p>

                
            </div>
            {/* Corner Illustration (kanan bawah) */}
                <div className="cornerIllustration">
                    <img
                        src={ilustrasi}
                        alt="Corner Decoration"
                        className="cornerImage"
                    />
                </div>

            {/* Right Side - Image */}
            <div className="rightSide">
                <img
                    src={loginImage}
                    alt="Yogyakarta Street Scene"
                    className="rightImage"
                />
            </div>
        </div>
    );
}