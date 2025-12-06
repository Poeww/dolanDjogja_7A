import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services/userService";

import "../dashboard/dashboard.css";
import "./user.css";

export default function UserCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createUser(form);
        navigate("/admin/users");
    };

    return (
        <div className="dashboard-content">
            <h2>Tambah User</h2>

            <form onSubmit={handleSubmit} className="form-box">
                <label>Nama</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>Email</label>
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <button className="btn-primary">Simpan</button>
            </form>
        </div>
    );
}