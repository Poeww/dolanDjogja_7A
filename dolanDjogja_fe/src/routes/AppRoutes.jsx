import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../home/login";
import Register from "../home/register";
import Home from "../home/home";

import PaketList from "../pages/admin/paket/paketList";
import PaketCreate from "../pages/admin/paket/paketCreate";
import PaketEdit from "../pages/admin/paket/paketEdit";

import { getUser } from "../services/authService";

const PrivateRoute = ({ children, role }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN PAKET */}
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
      </Routes>
    </BrowserRouter>
  );
}