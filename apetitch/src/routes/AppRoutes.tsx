import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Welcome } from "../pages/Welcome/Welcome";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Home } from "../pages/Home/Home";
import { Restaurant } from "../pages/Restaurant/Restaurant";
import { Profile } from "../pages/profile/profile";
import { Orders } from "../pages/Orders/Orders";
import { Explorar } from "../pages/Explorar/Explorar";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route path="/login" element={<Login />} />

        <Route path="/cadastro" element={<Register />} />

        <Route path="/home" element={<Home />} />
        
        <Route path="/pedidos" element={<Orders />} />

        <Route
          path="/explorar"
          element={<Explorar />}
        />
    

        <Route
          path="/restaurante/:id"
          element={<Restaurant />}
        />

        <Route
          path="/perfil"
          element={<Profile />}
        />
      </Routes>
    </BrowserRouter>
  );
}