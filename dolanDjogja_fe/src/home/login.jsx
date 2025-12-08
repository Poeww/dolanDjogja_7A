// src/pages/Login.jsx

import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ CSS global

// ✅ Import gambar PNG
import dolandjogjaLogo from "../assets/dolandjogjaLogo.png";
import loginImage from "../assets/loginImage.png";
import ilustrasi from "../assets/ilustrasi.png"; 

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

            if (res.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError("Email atau password salah.");
        }
    };

    return (
        <div className="container">
            {/* Left Side - Form */}
            <div className="leftSide">
                <img
                    src={dolandjogjaLogo}
                    alt="Dolan Jogja"
                    className="logo"
                />

                <div className="titleSection">
                    <h1 className="title">Sign In</h1>
                    <p className="description">
                        Continue your journey and explore the best of Yogyakarta with us.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="form">
                {error && <div className="errorMessage">{error}</div>}
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

                    <button type="submit" className="submitButton">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Sign In
                    </button>
                </form>

                <p className="registerText">
                    Not registered yet?{" "}
                    <a href="/register" className="registerLink">
                        Create an Account
                    </a>
                </p>
            </div>
            {/* Corner Illustration (kiri bawah) */}
                <div className="cornerIllustration">
                    <img
                        src={ilustrasi}
                        alt="Corner Decoration"
                        className="cornerImage"
                    />
                </div>

            {/* Right Side - Full Image */}
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