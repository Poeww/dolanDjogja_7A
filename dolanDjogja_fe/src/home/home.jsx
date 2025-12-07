import Navbar from "../components/navbar";
import "./home.css";
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

  return (
    <>
      <Navbar />

      <div
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
      </div>
    </>
  );
}