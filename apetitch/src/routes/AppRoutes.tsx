import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Welcome } from "../pages/Welcome/Welcome";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Home } from "../pages/Home/Home";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Register />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}