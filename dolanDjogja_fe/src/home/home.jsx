import { useEffect, useState, useRef } from "react";
import { getAllDestinasi } from "../services/destinasiService";
import { getAllPaket } from "../services/paketService";

import Navbar from "../components/navbar";
import "./home.css";

import iconMap from "../assets/icon/maps.svg";
import iconClock from "../assets/icon/clock.svg";
import bg from "../assets/img/highlight-home.png";

import iconGuide from "../assets/icon/guide.svg";
import iconCustom from "../assets/icon/custom.svg";
import iconMoney from "../assets/icon/money.svg";
import iconMaps from "../assets/icon/maps.svg";
import senjaTugu from "../assets/img/senja-tugu.jpg";

import img1 from "../assets/img/carousel-home1.png";
import img2 from "../assets/img/carousel-home2.png";
import img3 from "../assets/img/carousel-home3.png";
import img4 from "../assets/img/carousel-home4.png";
import img5 from "../assets/img/carousel-home5.png";
import img6 from "../assets/img/carousel-home6.png";

const handleBookingButton = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/login";
    return;
  }

  if (user.role === "user") {
    window.location.href = "/booking";
    return;
  }

  if (user.role === "admin") {
    window.location.href = "/admin";
    return;
  }
};


// =========================================
// COUNT UP HOOK
// =========================================
function useCountUp(end, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;

        if (isVisible) {
          let start = 0;
          setValue(0);
          const increment = end / (duration / 16);

          const counter = setInterval(() => {
            start += increment;
            if (start >= end) {
              start = end;
              clearInterval(counter);
            }
            setValue(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return [value, ref];
}

// =========================================
// MAIN COMPONENT
// =========================================
export default function Home() {

  // CAROUSEL IMAGES
  const images = [img1, img2, img3, img4, img5, img6];
  const duplicated = [...images, ...images];

  // DATA
  const [destinasi, setDestinasi] = useState([]);
  const [paket, setPaket] = useState([]);

  // COUNTER
  const [pelanggan, pelangganRef] = useCountUp(500);
  const [jumlahDestinasi, destinasiRef] = useCountUp(100);
  const [jumlahPaket, paketRef] = useCountUp(50);

  // =========================================
  // MODAL DESTINASI
  // =========================================
  const [showModalDestinasi, setShowModalDestinasi] = useState(false);
  const [selectedDestinasi, setSelectedDestinasi] = useState(null);
  const [relatedPaket, setRelatedPaket] = useState([]);

  // =========================================
  // MODAL PAKET
  // =========================================
  const [showModalPaket, setShowModalPaket] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);


  // =========================================
  // LOAD DATA
  // =========================================
  useEffect(() => {
    loadDestinasi();
    loadPaket();
  }, []);

  const loadDestinasi = async () => {
    try {
      const data = await getAllDestinasi();
      setDestinasi(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPaket = async () => {
    try {
      const data = await getAllPaket();
      setPaket(data);
    } catch (err) {
      console.log(err);
    }
  };


  // =========================================
  // DESTINASI MODAL OPEN
  // =========================================
  const handleOpenDetailDestinasi = (dest) => {
    setSelectedDestinasi(dest);

    const paketTerkait = paket.filter((p) =>
      p.destinasi?.some((d) => d.id === dest.id)
    );

    setRelatedPaket(paketTerkait);
    setShowModalDestinasi(true);
  };

  const closeModalDestinasi = () => {
    setShowModalDestinasi(false);
    setSelectedDestinasi(null);
    setRelatedPaket([]);
  };


  // =========================================
  // PAKET MODAL OPEN
  // =========================================
  const handleOpenDetailPaket = (paket) => {
    setSelectedPaket(paket);
    setShowModalPaket(true);
  };

  const closeModalPaket = () => {
    setShowModalPaket(false);
    setSelectedPaket(null);
  };


  // =========================================
  // AUTO ACTIVE NAVBAR
  // =========================================
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;

            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.textContent.toLowerCase() === id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);



  return (
    <>
      <Navbar />
      {/* HERO SECTION */}
      <section id="home" className="home-hero" style={{ backgroundImage: `url(${bg})` }}>
        <div className="home-overlay"></div>

        <div className="home-container">
          <div className="left-text">
            <h3 className="region">YOGYAKARTA</h3>
            <h1 className="welcome-title">Sugeng Rawuh</h1>
            <p className="desc">
              Kamu akan jatuh cinta pada ketenangan alamnya, hangatnya warganya,
              dan kenangan yang tumbuh dari setiap perjalanan!
            </p>

            <button
              className="btn-hero"
              onClick={() =>
                document.getElementById("destinasi").scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Jelajahi
            </button>
          </div>

          <div className="multi-slider">
            <div className="slider-track infinite-scroll">
              {duplicated.map((src, i) => (
                <div className="slider-card" key={i}>
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DESTINASI SECTION */}
      <section id="destinasi" className="destinasi-section">
        <h1 className="section-title">Destinasi Populer</h1>
        <p className="section-subtitle">Tempat-tempat favorit yang wajib dikunjungi di Jogja</p>

        <div className="destinasi-grid">
          {destinasi.map((d) => (
            <div className="destinasi-card" key={d.id}>
              <div className="img-wrapper">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${d.gambar}`}
                  alt={d.nama_destinasi}
                />
              </div>

              <div className="destinasi-content">
                <h3>{d.nama_destinasi}</h3>

                <div className="lokasi">
                  <img src={iconMap} alt="location" />
                  {d.lokasi}
                </div>

                <p className="desc">{d.deskripsi}</p>

                <button
                  className="btn-detail"
                  onClick={() => handleOpenDetailDestinasi(d)}
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================
          MODAL DESTINASI
      ======================================= */}
      {showModalDestinasi && selectedDestinasi && (
        <div className="modal-overlay" onClick={closeModalDestinasi}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModalDestinasi}>×</button>

            <img
              className="modal-img"
              src={`${import.meta.env.VITE_API_URL}/${selectedDestinasi.gambar}`}
              alt={selectedDestinasi.nama_destinasi}
            />

            <h2 className="modal-title">{selectedDestinasi.nama_destinasi}</h2>
            <p className="modal-location">{selectedDestinasi.lokasi}</p>

            <div className="modal-info">
              <p><strong>Harga Tiket:</strong> Rp {selectedDestinasi.harga_tiket}</p>
              <p><strong>Jam Buka:</strong> {selectedDestinasi.jam_buka}</p>
            </div>

            <p className="modal-desc">{selectedDestinasi.deskripsi}</p>

            <h3 className="modal-subtitle">Paket Wisata Terkait</h3>

            {relatedPaket.length > 0 ? (
              <ul className="modal-paket-list">
                {relatedPaket.map((p) => (
                  <li key={p.id}>{p.nama_paket}</li>
                ))}
              </ul>
            ) : (
              <p className="modal-no-paket">Belum ada paket terkait.</p>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          PAKET SECTION
      ========================================= */}
      <section id="paket" className="paket-section">
        <h1 className="section-title">Paket Wisata Rekomendasi</h1>
        <p className="section-subtitle">Pilihan paket terbaik untuk liburan yang seru!</p>

        <div className="paket-grid">
          {paket.map((p) => (
            <div className="paket-card" key={p.id}>
              <div className="img-wrapper paket-img">
                <img
                  src={`${import.meta.env.VITE_API_URL}/${p.gambar_thumbnail}`}
                  alt={p.nama_paket}
                />

                <div className="paket-price-badge">
                  Rp {Number(p.harga).toLocaleString("id-ID")}
                </div>
              </div>

              <div className="paket-content">
                <h3>{p.nama_paket}</h3>

                <div className="paket-duration">
                  <img src={iconClock} alt="" />
                  {p.durasi}
                </div>

                <div className="paket-destinasi-list">
                  <p>Destinasi yang dikunjungi:</p>

                  {p.destinasi &&
                    p.destinasi.slice(0, 3).map((d, i) => (
                      <div className="dest-item" key={i}>
                        <img src={iconMap} alt="" />
                        {d.nama_destinasi}
                      </div>
                    ))}

                  {p.destinasi && p.destinasi.length > 3 && (
                    <span className="more-dest">
                      +{p.destinasi.length - 3} destinasi lainnya
                    </span>
                  )}
                </div>

                <div className="paket-btn-row">
                  <button
                    className="btn-detail"
                    onClick={() => handleOpenDetailPaket(p)}
                  >
                    Detail
                  </button>

                  <button
                    className="btn-booking"
                    onClick={handleBookingButton}
                  >
                    Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==============================================
          MODAL PAKET
      ============================================== */}
      {showModalPaket && selectedPaket && (
        <div className="modal-overlay" onClick={closeModalPaket}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={closeModalPaket}>×</button>

            <img
              className="modal-img"
              src={`${import.meta.env.VITE_API_URL}/${selectedPaket.gambar_thumbnail}`}
              alt={selectedPaket.nama_paket}
            />

            <div className="modal-scroll">

              <h2 className="modal-title">{selectedPaket.nama_paket}</h2>

              <div className="modal-info">
                <p><strong>Harga Paket:</strong> Rp {Number(selectedPaket.harga).toLocaleString("id-ID")}</p>
                <p><strong>Durasi:</strong> {selectedPaket.durasi}</p>
                <p><strong>Kuota Tersedia:</strong> {selectedPaket.kuota}</p>
                <p><strong>Lokasi Tujuan:</strong> {selectedPaket.lokasi_tujuan}</p>
              </div>

              <p className="modal-desc">{selectedPaket.deskripsi}</p>

              <h3 className="modal-subtitle">Destinasi yang Dikunjungi</h3>
              {selectedPaket.destinasi?.length > 0 ? (
                <ul className="modal-paket-list">
                  {selectedPaket.destinasi.map((d) => (
                    <li key={d.id}>{d.nama_destinasi}</li>
                  ))}
                </ul>
              ) : <p className="modal-no-paket">Tidak ada destinasi terdaftar.</p>}

              {selectedPaket.jadwal?.length > 0 && (
                <>
                  <h3 className="modal-subtitle">Jadwal Trip</h3>
                  <ul className="modal-paket-list">
                    {selectedPaket.jadwal.map((j) => (
                      <li key={j.id}>
                        Berangkat: {j.tanggal_berangkat} — Pulang: {j.tanggal_pulang}
                      </li>
                    ))}
                  </ul>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* WHY SECTION */}
      <section className="why-section">
        <h1 className="section-title">Kenapa Harus DolanDjogja?</h1>
        <p className="section-subtitle">
          Nikmati pengalaman liburan terbaik dengan layanan ramah dan pastinya seru!
        </p>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon green">
              <img src={iconGuide} alt="guide" />
            </div>
            <h3>Tour Guide Lokal</h3>
            <p>Dipandu langsung oleh warga lokal yang paham budaya dan tahu banyak spot unik.</p>
          </div>

          <div className="why-card">
            <div className="why-icon blue">
              <img src={iconCustom} alt="custom trip" />
            </div>
            <h3>Custom Trip</h3>
            <p>Bikin itinerary sesuai gaya liburanmu! Fleksibel, bebas request ke mana saja!</p>
          </div>

          <div className="why-card">
            <div className="why-icon orange">
              <img src={iconMoney} alt="harga murah" />
            </div>
            <h3>Harga Murce</h3>
            <p>Paket wisata terjangkau tanpa mengurangi kualitas pengalaman.</p>
          </div>

          <div className="why-card">
            <div className="why-icon purple">
              <img src={iconMaps} alt="hidden gem" />
            </div>
            <h3>Destinasi Hidden Gem</h3>
            <p>Jelajahi spot anti-mainstream yang jarang diketahui wisatawan.</p>
          </div>
        </div>
      </section>

      <section className="cta-section" style={{ backgroundImage: `url(${senjaTugu})` }}>
        <div className="cta-overlay"></div>

        <div className="cta-content">
          <h1 className="cta-title">Siap Jalan-Jalan di Jogja?</h1>
          <p className="cta-subtitle">
            Jangan lewatkan kesempatan wisata tak terlupakan. Mulai petualanganmu sekarang!
          </p>

          <div className="cta-buttons">
            <button
              className="btn-cta-primary"
              onClick={handleBookingButton}
            >
              Mulai Booking
            </button>
          </div>

          <div className="cta-stats">

            <div className="stat-item" ref={pelangganRef}>
              <h2>{pelanggan}+</h2>
              <p>Pelanggan Puas</p>
            </div>

            <div className="stat-item" ref={destinasiRef}>
              <h2>{jumlahDestinasi}+</h2>
              <p>Destinasi</p>
            </div>

            <div className="stat-item" ref={paketRef}>
              <h2>{jumlahPaket}+</h2>
              <p>Paket Wisata</p>
            </div>

          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="footer-simple">
        © {new Date().getFullYear()} <span>DolanDjogja</span>. All rights reserved.
      </footer>
    </>
  );
}