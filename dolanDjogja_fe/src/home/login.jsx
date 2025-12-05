import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
            setError("Email atau password salah.");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
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

                <button type="submit">Login</button>
            </form>
        </div>
    );
}