import React, {useState} from "react";
import foto1 from "../assets/tamanSari.jpg";
import foto2 from "../assets/tugu.jpg";
import foto3 from "../assets/malioboro.jpg";
import foto4 from "../assets/titik0.jpg";
import background from "../assets/candi1.jpg";
import foto5 from "../assets/goaPindul.jpg";
import foto6 from "../assets/prambanan.jpg";
import './Homepage.css'; 

const destinations = [
    {
      id: 1,
      title: "Malioboro",
      image: foto3,
      description: "Jalan utama di Yogyakarta yang penuh dengan toko, kuliner, dan suasana malam yang ramai."
    },
    {
      id: 2,
      title: "Taman Sari",
      image: foto1,
      description: "Keraton air kerajaan Mataram yang menjadi saksi sejarah kejayaan Kesultanan Yogyakarta."
    },
    {
      id: 3,
      title: "Titik 0 Km",
      image: foto4,
      description: "Titik nol kilometer Yogyakarta, pusat navigasi dan ikon kota yang sering menjadi spot foto."
    },
    {
      id: 4,
      title: "Tugu Jogja",
      image: foto2,
      description: "Monumen ikonik Yogyakarta yang menjadi simbol kota dan tempat berkumpul warga setempat."
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "Senang banget, ga perlu repot untuk nentuin trip mau kemana aja, tinggal milih langsung terima bersih",
      name: "Maria Italiano",
      username: "@maria0125",
      avatar: "https://via.placeholder.com/40"
    },
    {
      id: 2,
      quote: "Senang banget, ga perlu repot untuk nentuin trip mau kemana aja, tinggal milih langsung terima bersih",
      name: "Maria Italiano",
      username: "@maria0125",
      avatar: "https://via.placeholder.com/40"
    },
    {
      id: 3,
      quote: "Senang banget, ga perlu repot untuk nentuin trip mau kemana aja, tinggal milih langsung terima bersih",
      name: "Maria Italiano",
      username: "@maria0125",
      avatar: "https://via.placeholder.com/40"
    },
    {
      id: 4,
      quote: "Senang banget, ga perlu repot untuk nentuin trip mau kemana aja, tinggal milih langsung terima bersih",
      name: "Maria Italiano",
      username: "@maria0125",
      avatar: "https://via.placeholder.com/40"
    }
  ];

const Home = () => (
  
  <div>
    {/* Header */}
    <section className="header-section">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <h2>dolanDjogja</h2>
        </div>
        
        {/* Navigation Menu */}
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/">Home</a>
            </li>
            <li className="nav-item">
              <a href="/packages">Packages</a>
            </li>
            <li className="nav-item">
              <a href="/mybookings">MyBookings</a>
            </li>
            <li className="nav-item">
              <a href="/login">Login</a>
            </li>
            <li className="nav-item">
              <a href="/register">Register</a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
    
    <section 
      className="banner-section" 
      style={{ backgroundImage: `url(${foto6})` }}
    >
      <div className="banner-text">
        <h1>dolanDjogja</h1>
      </div>
    </section>
      
        
      

    {/* Features */}
    <section className="features-section">
      <div className="feature-container">
       <div className="feature-content">
          <div className="feature-text">
            <h1>Travel Quickly <br />and Safely</h1>
            <p>
              With comprehensive and reliable information, <strong>Dolandjogja</strong> helps you explore the beauty and uniqueness of Yogyakarta without hassle, making every trip more memorable.
            </p>
          </div>
          
          <div className="feature-divider"></div>
          
          <div className="feature-icons">
            <div className="icon-item">
              <div className="icon">⏱️</div>
              <span>Fast</span>
            </div>
            <div className="icon-item">
              <div className="icon">✋</div>
              <span>Safe</span>
            </div>
            <div className="icon-item">
              <div className="icon">😊</div>
              <span>Comfortable</span>
            </div>
          </div>
          </div>
        </div>
    </section>

    {/* Destinations */}
    <section className="destination-section">
        <div className="destination-container">
          <h2 className="section-title">Top Destination</h2>
          <div className="destinations-grid">
            {destinations.map((dest) => (
              <div key={dest.id} className="destination-card">
                <img src={dest.image} alt={dest.title} className="card-image" />
                <div className="card-overlay">
                  <h3>{dest.title}</h3>
                  <p>{dest.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* Testimonials */}
    <section className="testimonial-section">
        <div className="testimonial-container">
          <h2 className="testimonial-title">Testimoni</h2>
          <h1 className="testimonial-heading">Pengalaman Pengguna</h1>
          <div className="testimonial-carousel">
            {testimonials.map((item) => (
              <div key={item.id} className="testimonial-card">
                <div className="quote-mark">“</div>
                <p className="quote-text">{item.quote}</p>
                <div className="user-info">
                  <img src={item.avatar} alt={item.name} className="avatar" />
                  <div className="user-name">
                    <span>{item.name}</span>
                    <span className="username">{item.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Best Package Section */}
      <section className="package-section">
        <div className="package-container">
          <div className="package-header">
            <h2>The Best Package <span className="subtitle">for you</span></h2>
            <a href="#" className="view-all">Lihat semua &gt;</a>
          </div>
          <div className="packages-grid">
            {[
              {
                id: 1,
                title: "Heritage & City",
                subtitle: "Warisan & Kota",
                duration: "3 Hari / 2 Malam",
                price: "Rp. 1.200.000",
                image: foto6
              },
              {
                id: 2,
                title: "Nature with Adventure",
                subtitle: "Alam dan Petualangan",
                duration: "4 Hari / 3 Malam",
                price: "Rp. 1.600.000",
                image: foto5
              }
            ].map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="package-image">
                  <img src={pkg.image} alt={pkg.title} />
                  <div className="package-overlay">
                    <h3>{pkg.title}</h3>
                  </div>
                </div>
                <div className="package-details">
                  <h4>{pkg.subtitle}</h4>
                  <p className="duration">{pkg.duration}</p>
                  <div className="price">
                    <span className="amount">{pkg.price}</span>
                    <span className="per-person">/ Orang</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


          {/* Footer Section - PERSIS SEPERTI GAMBAR */}
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

export default Home;