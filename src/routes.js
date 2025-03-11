import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";

export default function AppRoutes() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={<Home />}
				/>
				<Route
					path="/cart"
					element={<Cart />}
				/>
				<Route
					path="/admin"
					element={<Admin />}
				/>
			</Routes>
		</Router>
	);
}
