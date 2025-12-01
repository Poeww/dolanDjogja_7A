import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
        <div style={{ padding: "40px" }}>
            <h2>Register</h2>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nama"
                    value={form.name}
                    onChange={handleChange}
                />
                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />
                <br />

                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Konfirmasi Password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                />
                <br />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}