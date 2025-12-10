import { useEffect, useState, useRef } from "react";
// Import dari layanan untuk Home Section:
import { getAllDestinasi } from "../../services/destinasiService";
import { getAllPaket } from "../../services/paketService";
import { useNavigate } from "react-router-dom";
// import { getMyBookings } from "../../services/bookingService"; 
// import { getUser } from "../../services/authService"; 

import Navbar from "../../components/navbar";
import './MyBookings.css'; 
// Import home.css yang diperlukan untuk styling Home sections:
import '../../home/home.css'; 


// === ASSET IMPORTS DARI HOME ===
import iconMap from "../../assets/icon/maps.svg";
import iconClock from "../../assets/icon/clock.svg";
import bg from "../../assets/img/highlight-home.png";

import iconGuide from "../../assets/icon/guide.svg";
import iconCustom from "../../assets/icon/custom.svg";
import iconMoney from "../../assets/icon/money.svg";
import iconMaps from "../../assets/icon/maps.svg";
import senjaTugu from "../../assets/img/senja-tugu.jpg";

import img1 from "../../assets/img/carousel-home1.png";
import img2 from "../../assets/img/carousel-home2.png";
import img3 from "../../assets/img/carousel-home3.png";
import img4 from "../../assets/img/carousel-home4.png";
import img5 from "../../assets/img/carousel-home5.png";
import img6 from "../../assets/img/carousel-home6.png";
// ===================================


// =========================================
// COUNT UP HOOK (DIPERLUKAN UNTUK CTA SECTION)
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

// Helper untuk menentukan warna status (DARI MYBOOKINGS)
const getStatusColor = (status) => {
    switch (status) {
        case 'Lunas': return 'green';
        case 'Menunggu Pembayaran': return 'red';
        case 'Menunggu Verifikasi': return 'orange';
        default: return 'grey';
    }
};

// DATA DUMMY (MOCK DATA) UNTUK VISUAL CHECK (DARI MYBOOKINGS)
const DUMMY_BOOKINGS = [
    {
        id: 101,
        jumlah_orang: 2,
        total_harga: 'Rp 4.500.000',
        status_pembayaran: 'Lunas', 
        jadwal_trip: {
            tanggal_berangkat: '2026-03-10',
            tanggal_pulang: '2026-03-15',
            paket: {
                nama_paket: 'Eksplorasi Raja Ampat 5H4M',
            },
        },
    },
    {
        id: 102,
        jumlah_orang: 1,
        total_harga: 'Rp 2.800.000',
        status_pembayaran: 'Menunggu Pembayaran',
        jadwal_trip: {
            tanggal_berangkat: '2026-04-20',
            tanggal_pulang: '2026-04-23',
            paket: {
                nama_paket: 'Paket Mendaki Gunung Bromo 4 Hari',
            },
        },
    },
    {
        id: 103,
        jumlah_orang: 4,
        total_harga: 'Rp 9.200.000',
        status_pembayaran: 'Menunggu Verifikasi', 
        jadwal_trip: {
            tanggal_berangkat: '2026-07-01',
            tanggal_pulang: '2026-07-07',
            paket: {
                nama_paket: 'Liburan Keluarga di Bali 7 Hari',
            },
        },
    },
];

export default function MyBookings() {
    const navigate = useNavigate();
    
    // STATES DAN HOOKS DARI HOME
    const [bookings, setBookings] = useState([]); // Dari MyBookings
    const images = [img1, img2, img3, img4, img5, img6];
    const duplicated = [...images, ...images];
    const [destinasi, setDestinasi] = useState([]);
    const [paket, setPaket] = useState([]);
    const [pelanggan, pelangganRef] = useCountUp(500);
    const [jumlahDestinasi, destinasiRef] = useCountUp(100);
    const [jumlahPaket, paketRef] = useCountUp(50);
    const [showModalDestinasi, setShowModalDestinasi] = useState(false);
    const [selectedDestinasi, setSelectedDestinasi] = useState(null);
    const [relatedPaket, setRelatedPaket] = useState([]);
    const [showModalPaket, setShowModalPaket] = useState(false);
    const [selectedPaket, setSelectedPaket] = useState(null);


    // =========================================
    // LOAD DATA DAN EFFECT GABUNGAN
    // =========================================
    useEffect(() => {
        setBookings(DUMMY_BOOKINGS); // Logic MyBookings

        // Logic Home
        loadDestinasi();
        loadPaket();
    }, []);
    
    const loadDestinasi = async () => { /* ... (fungsi loadDestinasi) ... */ };
    const loadPaket = async () => { /* ... (fungsi loadPaket) ... */ };

    // ... (Fungsi handleOpenDetailDestinasi, closeModalDestinasi, handleOpenDetailPaket, closeModalPaket) ...
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

    const handleOpenDetailPaket = (paket) => {
        setSelectedPaket(paket);
        setShowModalPaket(true);
    };

    const closeModalPaket = () => {
        setShowModalPaket(false);
        setSelectedPaket(null);
    };


    // =========================================
    // AUTO ACTIVE NAVBAR (DARI HOME)
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

    // FUNGSI BOOKING (DARI HOME)
    const handleBookingButton = (paketId) => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            window.location.href = "/login";
            return;
        }

        window.location.href = `/booking/${paketId}`;
    };


    return (
        <>
            <Navbar />
            
            {/* HERO SECTION DARI HOME */}
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

            {/* KONTEN UTAMA MY BOOKINGS (DITAMBAHKAN DI BAWAH HERO) */}
            <div className="my-bookings-wrapper">
                <div className="my-bookings-card">
                    <h2>Booking Saya</h2>
                    {/* ... (Tabel My Bookings di sini) ... */}
                    <table className="my-bookings-table">
                        <thead>
                            <tr>
                                <th>Paket</th>
                                <th>Tgl Berangkat</th>
                                <th>Tgl Pulang</th>
                                <th>Jumlah Orang</th>
                                <th>Total Harga</th>
                                <th>Status Pembayaran</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.jadwal_trip?.paket?.nama_paket}</td>
                                    <td>{b.jadwal_trip?.tanggal_berangkat}</td>
                                    <td>{b.jadwal_trip?.tanggal_pulang}</td>
                                    <td>{b.jumlah_orang}</td>
                                    <td>{b.total_harga}</td>
                                    <td style={{ fontWeight: 'bold', color: getStatusColor(b.status_pembayaran) }}>
                                        {b.status_pembayaran}
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="6">Belum ada booking.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CTA SECTION */}
            <section className="cta-section" style={{ backgroundImage: `url(${senjaTugu})` }}>
                <div className="cta-overlay"></div>
                {/* ... (konten CTA) ... */}
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