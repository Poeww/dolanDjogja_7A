import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../../services/userService";

import "../dashboard/dashboard.css";
import "./user.css";

export default function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await getUserById(id);
        setForm({
            ...res.data,
            password: "",
        });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { ...form };
        if (payload.password === "") delete payload.password;

        await updateUser(id, payload);
        navigate("/admin/users");
    };

    return (
        <div className="dashboard-content">
            <h2>Edit User</h2>

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

                <label>Password (opsional)</label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />

                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>

                <button className="btn-primary">Simpan Perubahan</button>
            </form>
        </div>
    );
}
