import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../home/login";
import Register from "../home/register";
import Home from "../home/home";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}