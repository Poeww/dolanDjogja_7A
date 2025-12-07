import { useEffect, useState } from "react";
import { getMyProfile, updateMyProfile } from "../../services/userProfileService";

import "./profile.css";

import Logo from "../../assets/img/logo-dolandjogja.svg";
import RegisUp from "../../assets/img/frame-atas-regis.svg";
import RegisDown from "../../assets/img/frame-bawah-regis.svg";

export default function Profile() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");

    useEffect(() => {
        getMyProfile()
            .then((res) => {
                setForm({
                    name: res.data.name,
                    email: res.data.email,
                    password: "",
                });
            })
            .catch(() => setMessage("Gagal memuat profil."));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmSave = window.confirm("Simpan perubahan profil?");
        if (!confirmSave) return;

        try {
            const payload = {
                name: form.name,
                email: form.email,
            };

            if (form.password.trim() !== "") {
                payload.password = form.password;
            }

            await updateMyProfile(payload);
            setMessage("Profil berhasil diperbarui!");

        } catch (err) {
            setMessage("Gagal memperbarui profil.");
        }
    };

    return (
        <div className="card-container profile-card">

            <img src={RegisUp} alt="" className="decor-right-top" />
            <img src={RegisDown} alt="" className="decor-right-bottom" />

            <div className="form-section">

                <img src={Logo} alt="Logo" className="logo" />

                <h2 className="title">Profil Saya</h2>
                <p className="subtitle">Perbarui informasi akunmu di sini.</p>

                {message && <p className="message-text">{message}</p>}

                <form onSubmit={handleSubmit}>

                    <div className="floating-group">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="floating-input"
                            placeholder=" "
                            required
                        />
                        <label className="floating-label">Nama</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="floating-input"
                            placeholder=" "
                            required
                        />
                        <label className="floating-label">Email</label>
                    </div>

                    <div className="floating-group">
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="floating-input"
                            placeholder=" "
                        />
                        <label className="floating-label">
                            Password Baru (opsional)
                        </label>
                    </div>

                    <button type="submit" className="btn">
                        Simpan Perubahan
                    </button>

                </form>

            </div>
        </div>
    );
}