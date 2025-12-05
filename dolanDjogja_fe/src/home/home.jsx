import Navbar from "../components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div style={{ padding: "60px 40px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "10px" }}>
          Selamat Datang di dolanDjogja!
        </h1>

        <p style={{ fontSize: "18px", color: "#555", marginBottom: "20px" }}>
          Nyoba halaman beranda utama^^
        </p>

        <p style={{ fontSize: "16px", color: "#777", maxWidth: "600px" }}>
          Jelajahi berbagai destinasi menarik dan paket wisata terbaik dari Jogja.
          Silakan login untuk melakukan booking atau melihat pemesanan Anda^^
        </p>
      </div>
    </>
  );
}