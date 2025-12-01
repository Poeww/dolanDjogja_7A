import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PUBLIC PAGES
import Login from "../home/login";
import Register from "../home/register";
import Home from "../home/home";

// ADMIN - Paket
import PaketList from "../pages/admin/paket/paketList";
import PaketCreate from "../pages/admin/paket/paketCreate";
import PaketEdit from "../pages/admin/paket/paketEdit";

// ADMIN - Destinasi
import DestinasiList from "../pages/admin/destinasi/destinasiList";
import DestinasiCreate from "../pages/admin/destinasi/destinasiCreate";
import DestinasiEdit from "../pages/admin/destinasi/destinasiEdit";

// ADMIN - Jadwal
import JadwalList from "../pages/admin/jadwal/jadwalList";
import JadwalCreate from "../pages/admin/jadwal/jadwalCreate";
import JadwalEdit from "../pages/admin/jadwal/jadwalEdit";

// CUSTOMER - Booking
import Booking from "../pages/customer/booking";
import MyBookings from "../pages/customer/myBookings";

// PAYMENT
import Payment from "../pages/customer/payment";
import PaymentList from "../pages/admin/payment/paymentList";
import PaymentEdit from "../pages/admin/payment/paymentEdit";

import AdminDashboard from "../pages/admin/dashboard/dashboard";

// Auth Service
import { getUser } from "../services/authService";


// ========== PRIVATE ROUTE HANDLER ==========
const PrivateRoute = ({ children, role }) => {
  const user = getUser();

  // Jika belum login → redirect login
  if (!user) return <Navigate to="/login" />;

  // Jika role tidak sesuai → redirect home
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};


// ========== ROUTING START ==========
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================
            PUBLIC ROUTES
        ============================ */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />



        {/* ============================
            ADMIN - PAKET WISATA
        ============================ */}
        <Route
          path="/admin/paket"
          element={
            <PrivateRoute role="admin">
              <PaketList />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/paket/create"
          element={
            <PrivateRoute role="admin">
              <PaketCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/paket/edit/:id"
          element={
            <PrivateRoute role="admin">
              <PaketEdit />
            </PrivateRoute>
          }
        />


        {/* ============================
            ADMIN - DESTINASI
        ============================ */}
        <Route
          path="/admin/destinasi"
          element={
            <PrivateRoute role="admin">
              <DestinasiList />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/destinasi/create"
          element={
            <PrivateRoute role="admin">
              <DestinasiCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/destinasi/edit/:id"
          element={
            <PrivateRoute role="admin">
              <DestinasiEdit />
            </PrivateRoute>
          }
        />


        {/* ============================
            ADMIN - JADWAL TRIP
        ============================ */}
        <Route
          path="/admin/jadwal"
          element={
            <PrivateRoute role="admin">
              <JadwalList />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/jadwal/create"
          element={
            <PrivateRoute role="admin">
              <JadwalCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/jadwal/edit/:id"
          element={
            <PrivateRoute role="admin">
              <JadwalEdit />
            </PrivateRoute>
          }
        />


        {/* ============================
            CUSTOMER - BOOKING
        ============================ */}
        <Route
          path="/booking/:id"
          element={
            <PrivateRoute role="user">
              <Booking />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <PrivateRoute role="user">
              <MyBookings />
            </PrivateRoute>
          }
        />

      {/* ============================
          PAYMENT
      ============================ */}
      <Route
        path="/payment/:id"
        element={
          <PrivateRoute role="user">
            <Payment />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/payments"
        element={
          <PrivateRoute role="admin">
            <PaymentList />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/payments/edit/:id"
        element={
          <PrivateRoute role="admin">
            <PaymentEdit />
          </PrivateRoute>
        }
      />

      {/* ========== ADMIN DASHBOARD ========== */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

    </Routes>
  </BrowserRouter>
);

}