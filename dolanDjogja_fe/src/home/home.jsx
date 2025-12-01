import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Selamat Datang di dolanDjogja!</h1>
      <p>Ini halaman Home.</p>

      <Link to="/login">
        <button
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </Link>
    </div>
  );
}
