import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import { Welcome } from "../pages/Welcome/Welcome";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Home } from "../pages/Home/Home";
import { Restaurant } from "../pages/Restaurant/Restaurant";
import { Profile } from "../pages/profile/profile";
import { Orders } from "../pages/Orders/Orders";
import { Explorar } from "../pages/Explorar/Explorar";
import { Delivery } from "../pages/Delivery/Delivery";
import { Favoritos } from "../pages/Favoritos/Favoritos";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Welcome />} />

				<Route path="/login" element={<Login />} />

				<Route path="/cadastro" element={<Register />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/home" element={<Home />} />

					<Route path="/pedidos" element={<Orders />} />

                    <Route path="/favoritos" element={<Favoritos />} />
				  
					<Route path="/explorar" element={<Explorar />} />

					<Route path="/entrega" element={<Delivery />} />

					<Route path="/restaurante/:id" element={<Restaurant />} />

					<Route path="/perfil" element={<Profile />} />
				</Route>

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}
