import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState("");

	const [orders, setOrders] = useState([]);
	const [products, setProducts] = useState([]);
	const [newProduct, setNewProduct] = useState({
		name: "",
		price: 0,
	});

	const [editingProduct, setEditingProduct] = useState(null);
	const [updatedProduct, setUpdatedProduct] = useState({
		name: "",
		price: 0,
	});

	useEffect(() => {
		if (isAuthenticated) {
			fetchOrders();
			fetchProducts();
		}
	}, [isAuthenticated]);

	// Admin login function
	const handleLogin = (e) => {
		e.preventDefault();
		if (username === "admin" && password === "admin123") {
			setIsAuthenticated(true);
		} else {
			setLoginError("Invalid username or password");
		}
	};

	// Fetch Orders
	const fetchOrders = () => {
		axios
			.get("http://localhost:5000/orders")
			.then((response) => setOrders(response.data))
			.catch((error) => console.error("Error fetching orders:", error));
	};

	// Fetch Products
	const fetchProducts = () => {
		axios
			.get("http://localhost:5000/products")
			.then((response) => setProducts(response.data))
			.catch((error) => console.error("Error fetching products:", error));
	};

	// Render login form if not authenticated
	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="bg-white p-8 rounded-lg shadow-lg w-96">
					<h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
					<form onSubmit={handleLogin} className="space-y-4">
						<input
							type="text"
							placeholder="Username"
							className="border p-3 rounded w-full"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							className="border p-3 rounded w-full"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{loginError && <p className="text-red-500 text-sm">{loginError}</p>}
						<button
							type="submit"
							className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition">
							Login
						</button>
					</form>
				</div>
			</div>
		);
	}

	// Render the Admin Dashboard if authenticated
	return (
		<div className="container mx-auto p-6">
			<h2 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h2>

			{/* Logout Button */}
			<div className="text-right">
				<button
					onClick={() => setIsAuthenticated(false)}
					className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
					Logout
				</button>
			</div>

			{/* Orders Section */}
			<div className="my-6">
				<h3 className="text-2xl font-semibold mb-4">Orders</h3>
				{orders.length === 0 ? (
					<p className="text-center text-gray-500">No orders found</p>
				) : (
					<div className="space-y-4">
						{orders.map((order) => (
							<div
								key={order._id}
								className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm">
								<div>
									<p className="font-bold text-lg">{order.name}</p>
									<p className="text-gray-600">Address: {order.address}</p>
									<p className="text-gray-600">Phone: {order.phone}</p>
									<p className="text-gray-800 font-semibold">Total: MAD{order.total}</p>
								</div>
								<div className="flex gap-4">
									<button
										onClick={() => {
											if (window.confirm("Are you sure you want to confirm this order?")) {
												axios
													.put(`http://localhost:5000/orders/${order._id}/confirm`)
													.then(fetchOrders)
													.catch((error) => console.error("Error confirming order:", error));
											}
										}}
										className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
										Confirm
									</button>

									<button
										onClick={() => {
											if (window.confirm("Are you sure you want to delete this order?")) {
												axios
													.delete(`http://localhost:5000/orders/${order._id}`)
													.then(fetchOrders)
													.catch((error) => console.error("Error deleting order:", error));
											}
										}}
										className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Products Section */}
			<div className="my-6">
				<h3 className="text-2xl font-semibold mb-4">Products</h3>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						axios
							.post("http://localhost:5000/products", newProduct)
							.then(fetchProducts)
							.catch((error) => console.error("Error adding product:", error));
					}}
					className="space-y-6 mb-6">
					<input
						type="text"
						placeholder="Product Name"
						className="border p-3 rounded w-full"
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						required
					/>
					<input
						type="number"
						placeholder="Price"
						className="border p-3 rounded w-full"
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						required
					/>
					<button
						type="submit"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition">
						Add Product
					</button>
				</form>
			</div>
		</div>
	);
};

export default Admin;
