import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PUBLIC PAGES
import Login from "../home/login";
import Register from "../home/register";
import Home from "../home/home";

// ADMIN - USER
import UserList from "../pages/admin/user/userList";
import UserCreate from "../pages/admin/user/userCreate";
import UserEdit from "../pages/admin/user/userEdit";

// ADMIN - PAKET
import PaketList from "../pages/admin/paket/paketList";
import PaketCreate from "../pages/admin/paket/paketCreate";
import PaketEdit from "../pages/admin/paket/paketEdit";

// ADMIN - BOOKING
import BookingList from "../pages/admin/booking/bookingList";
import BookingEdit from "../pages/admin/booking/bookingEdit";

// ADMIN - DESTINASI
import DestinasiList from "../pages/admin/destinasi/destinasiList";
import DestinasiCreate from "../pages/admin/destinasi/destinasiCreate";
import DestinasiEdit from "../pages/admin/destinasi/destinasiEdit";

// ADMIN - JADWAL
import JadwalList from "../pages/admin/jadwal/jadwalList";
import JadwalCreate from "../pages/admin/jadwal/jadwalCreate";
import JadwalEdit from "../pages/admin/jadwal/jadwalEdit";

// CUSTOMER - BOOKING, PAYMENT
import Booking from "../pages/customer/booking";
import MyBookings from "../pages/customer/myBookings";
import Payment from "../pages/customer/payment";

// ADMIN - PAYMENT
import PaymentList from "../pages/admin/payment/paymentList";
import PaymentEdit from "../pages/admin/payment/paymentEdit";

// ADMIN DASHBOARD
import AdminDashboard from "../pages/admin/dashboard/dashboard";

// CUSTOMER - PROFILE
import Profile from "../pages/customer/profile"; // ✔ FIXED PATH

// Auth Service
import { getUser } from "../services/authService";


// =========================================
// PRIVATE ROUTE
// =========================================
const PrivateRoute = ({ children, role }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};


// =========================================
// ROUTING
// =========================================
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===============================
            PUBLIC ROUTES
        =============================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ===============================
            ADMIN REDIRECT
        =============================== */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />


        {/* ===============================
            ADMIN DASHBOARD
        =============================== */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />


        {/* ===============================
            ADMIN - USER MANAGEMENT
        =============================== */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="admin">
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/create"
          element={
            <PrivateRoute role="admin">
              <UserCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users/edit/:id"
          element={
            <PrivateRoute role="admin">
              <UserEdit />
            </PrivateRoute>
          }
        />


        {/* ===============================
            ADMIN - PAKET WISATA
        =============================== */}
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


        {/* ===============================
            ADMIN - BOOKING
        =============================== */}
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute role="admin">
              <BookingList />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings/edit/:id"
          element={
            <PrivateRoute role="admin">
              <BookingEdit />
            </PrivateRoute>
          }
        />


        {/* ===============================
            ADMIN - DESTINASI
        =============================== */}
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


        {/* ===============================
            ADMIN - JADWAL TRIP
        =============================== */}
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


        {/* ===============================
            CUSTOMER - BOOKING
        =============================== */}
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


        {/* ===============================
            CUSTOMER - PAYMENT
        =============================== */}
        <Route
          path="/payment/:id"
          element={
            // <PrivateRoute role="user">
              <Payment />
            // </PrivateRoute>
          }
        />


        {/* ===============================
            ADMIN - PAYMENT
        =============================== */}
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

        {/* ===============================
            CUSTOMER - BOOKING
        =============================== */}
        <Route path="/booking/:id" 
        element={<Booking />} 
        />

        {/* ===============================
            CUSTOMER - PROFILE
        =============================== */}
        <Route
          path="/profile"
          element={
            <PrivateRoute role="user">
              <Profile />
            </PrivateRoute>
          }
        />




      </Routes>
    </BrowserRouter>
  );
}