import { useEffect, useState } from "react";
import { getAllDestinasi } from "../services/destinasiService";

import Navbar from "../components/navbar";
import "./home.css";

import iconMap from "../assets/icon/maps.svg";
import bg from "../assets/img/highlight-home.png";

import img1 from "../assets/img/carousel-home1.png";
import img2 from "../assets/img/carousel-home2.png";
import img3 from "../assets/img/carousel-home3.png";
import img4 from "../assets/img/carousel-home4.png";
import img5 from "../assets/img/carousel-home5.png";
import img6 from "../assets/img/carousel-home6.png";

export default function Home() {
  const images = [img1, img2, img3, img4, img5, img6];
  const duplicated = [...images, ...images];

  const [destinasi, setDestinasi] = useState([]);

  useEffect(() => {
    loadDestinasi();
  }, []);

  const loadDestinasi = async () => {
    try {
      const data = await getAllDestinasi();
      setDestinasi(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <section
        className="home-hero"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="home-overlay"></div>

        <div className="home-container">
          <div className="left-text">
            <h3 className="region">YOGYAKARTA</h3>
            <h1 className="welcome-title">Sugeng Rawuh</h1>
            <p className="desc">
              Kamu akan jatuh cinta pada ketenangan alamnya, hangatnya warganya,
              dan kenangan yang tumbuh dari setiap perjalanan!
            </p>
            <button className="btn-hero">Jelajahi</button>
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
      <section className="destinasi-section">
        <h1 className="destinasi-title">Destinasi Populer</h1>
        <p className="destinasi-subtitle">
          Tempat-tempat favorit yang wajib dikunjungi di Jogja
        </p>

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
                <button className="btn-detail">Detail</button>
              </div>

            </div>
          ))}
        </div>
      </section>

    </>
  );
}