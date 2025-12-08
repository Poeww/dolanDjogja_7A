import { useEffect, useState } from "react";
import { getAllPaket as getPackages } from "../../services/paketService";
import "./Packages.css";
import background from "../../assets/malioboro.jpg";
import foto1 from "../../assets/tamanSari.jpg";
import foto2 from "../../assets/tugu.jpg";
import foto3 from "../../assets/malioboro.jpg";
import foto4 from "../../assets/titik0.jpg";
import foto5 from "../../assets/goaPindul.jpg";
import foto6 from "../../assets/prambanan.jpg";

export default function Packages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dummyData = [
        {
          id: 1,
          name: "Heritage & City",
          duration: "2 Hari 1 Malam",
          price: 1205000,
          image: foto1,
          category: "Heritage"
        },
        {
          id: 2,
          name: "Beach Escape",
          duration: "1 Hari",
          price: 950000,
          image: foto2,
          category: "Nature"
        },
        {
          id: 3,
          name: "Candi Borobudur Tour",
          duration: "1 Hari",
          price: 850000,
          image: foto3,
          category: "Heritage"
        },
        {
          id: 4,
          name: "Parangtritis Sunset",
          duration: "Half Day",
          price: 650000,
          image: foto4,
          category: "Nature"
        },
        {
          id: 5,
          name: "Malioboro Night Walk",
          duration: "Evening",
          price: 450000,
          image: foto5,
          category: "City"
        },
        {
          id: 6,
          name: "Trekking Merapi",
          duration: "Full Day",
          price: 1500000,
          image: foto6,
          category: "Adventure"
        },
      ];
      setPackages(dummyData);
    } catch (err) {
      console.error("Gagal memuat paket:", err);
      setPackages([]);
    }
  };

  return (
    <div className="packages-page">
      {/* Header */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo">
            <h1>dolanDjogja</h1>
          </div>
          <nav className="nav-menu">
            <ul className="nav-list">
              <li><a href="/">Home</a></li>
              <li><a href="/packages">Packages</a></li>
              <li><a href="/mybookings">MyBookings</a></li>
            </ul>
          </nav>
          <div className="user-avatar">
            <div className="avatar-circle"><a href="/profil">👤</a></div>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="packages-banner">
        <img
          src={background}
          alt="Yogyakarta Destinations"
          className="banner-image"
        />
      </section>

      {/* Konten Utama — SATU KOLOM, CENTERED */}
      <section className="packages-content">
        <div className="container">
          {/* Judul & Deskripsi */}
          <h2 className="section-title">Semua Paket</h2>
          
        </div>
      </section>

      <p className="section-subtitle">
        Semua paket wisata dengan berbagai kategori terbaik di Yogyakarta.
      </p>

          {/* Kategori 1 */}
          <div className="category-section">
            <h3 className="category-title-h3">Heritage & City</h3>
            <div className="packages-grid">
              {packages
                .filter(p => p.category === "Heritage" || p.category === "City")
                .map(pkg => (
                  <div key={pkg.id} className="package-card">
                    <img src={pkg.image} alt={pkg.name} className="package-image" />
                    <div className="package-info">
                      <h4 className="package-name">{pkg.name}</h4>
                      <p className="package-duration">{pkg.duration}</p>
                      <p className="package-price">Rp {pkg.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Kategori 2 */}
          <div className="category-section">
            <h3 className="category-title-h3">Nature & Adventure</h3>
            <div className="packages-grid">
              {packages
                .filter(p => p.category === "Nature" || p.category === "Adventure")
                .map(pkg => (
                  <div key={pkg.id} className="package-card">
                    <img src={pkg.image} alt={pkg.name} className="package-image" />
                    <div className="package-info">
                      <h4 className="package-name">{pkg.name}</h4>
                      <p className="package-duration">{pkg.duration}</p>
                      <p className="package-price">Rp {pkg.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Footer */}
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-logo">
            <h2>dolanDjogja</h2>
            <p>Explore. Experience. Enjoy</p>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h3>Navigasi</h3>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/packages">Packages</a></li>
                <li><a href="/bookings">My Bookings</a></li>
              </ul>
            </div>

            <div className="link-column">
              <h3>Bantuan</h3>
              <ul>
                <li>JL. Kemerdekaan No.22, Kab.Sleman,DIY</li>
                <li><a href="mailto:dolandjogja@gmail.com">dolandjogja@gmail.com</a></li>
                <li><a href="tel:+6281245678901">+62 812-4567-8901</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-social">
            <div className="social-icons">
              <a href="#"><span>X</span></a>
              <a href="#"><span>🎵</span></a>
              <a href="#"><span>📸</span></a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2025. All Right Reserved</p>
        </div>
      </footer>
    </div>
  );
}