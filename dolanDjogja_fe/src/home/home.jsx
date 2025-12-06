import Navbar from "../components/navbar";
import "./home.css";
import bg from "../assets/img/highlight-home.png";

export default function Home() {
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
                Kamu akan jatuh cinta pada ketenangan alamnya, hangatnya warganya
                dan kenangan yang tumbuh dari setiap perjalanan!
            </p>

            <button className="btn-hero">Jelajahi</button>
        </div>

        <div className="right-cards">
            <div className="card-placeholder big"></div>
            <div className="card-placeholder small"></div>
        </div>

        </div>

      </div>
    </>
  );
}