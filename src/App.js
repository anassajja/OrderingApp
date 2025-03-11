// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./store/cart"; // Ensure this is imported

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin"; // Import the Admin page/component
import Navbar from "./components/Navbar";

function App() {
	return (
		<CartProvider>
			{" "}
			{/* Wrap with CartProvider */}
			<Router>
				<Navbar />
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
						path="/checkout"
						element={<Checkout />}
					/>
					<Route
						path="/admin"
						element={<Admin />}
					/>{" "}
					{/* Add Admin route here */}
				</Routes>
			</Router>
		</CartProvider>
	);
}

export default App;
