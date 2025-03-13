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
		image: null, // Add image field
	});
	const [updatedProduct, setUpdatedProduct] = useState({
		name: "",
		price: 0,
		image: "", // Add image field
	});

	const [editingProduct, setEditingProduct] = useState(null);

	useEffect(() => {
		const authState = localStorage.getItem("isAuthenticated");
		if (authState === "true") {
			setIsAuthenticated(true);
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			fetchOrders();
			fetchProducts();
		}
	}, [isAuthenticated]);

	const handleLogin = (e) => {
		e.preventDefault();
		axios
			.post("http://localhost:5000/admins/login", { username, password })
			.then((response) => {
				setIsAuthenticated(true);
				localStorage.setItem("isAuthenticated", "true"); // Store authentication state in local storage
				setLoginError("");
			})
			.catch((error) => {
				setLoginError("Invalid username or password");
				console.error("Error logging in:", error);
			});
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		localStorage.removeItem("isAuthenticated"); // Clear authentication state from local storage
	};

	// CRUD for Orders
	const fetchOrders = () => {
		axios
			.get("http://localhost:5000/orders")
			.then((response) => setOrders(response.data))
			.catch((error) => console.error("Error fetching orders:", error));
	};

	const handleConfirmOrder = (id) => {
		console.log("Confirming order with ID:", id);
		axios
			.put(`http://localhost:5000/orders/${id}/confirm`)
			.then(() => fetchOrders())
			.catch((error) => console.error("Error confirming order:", error));
	};

	const handleDeleteOrder = (id) => {
		axios
			.delete(`http://localhost:5000/orders/${id}`)
			.then(() => fetchOrders())
			.catch((error) => console.error("Error deleting order:", error));
	};

	// CRUD for Products
	const fetchProducts = () => {
		console.log("Fetching products");
		axios
			.get("http://localhost:5000/products")
			.then((response) => setProducts(response.data))
			.catch((error) => console.error("Error fetching products:", error));
	};

	// ...existing code...

	const handleAddProduct = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", newProduct.name);
		formData.append("price", newProduct.price);
		formData.append("image", newProduct.image); // Append image file

		axios
			.post("http://localhost:5000/products", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(() => {
				fetchProducts();
				setNewProduct({ name: "", price: "", image: null });
			})
			.catch((error) => console.error("Error adding product:", error));
	};

	const handleUpdateProduct = (id, updatedData) => {
		console.log("Updating product with ID:", id);
		console.log("Updated data:", updatedData);
		const formData = new FormData();
		formData.append("name", updatedData.name);
		formData.append("price", updatedData.price);
		if (updatedData.image && typeof updatedData.image !== "string") {
			formData.append("image", updatedData.image); // Append image file if it exists
		}

		axios
			.put(`http://localhost:5000/products/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(() => {
				console.log("Product updated successfully");
				fetchProducts();
				setEditingProduct(null);
			})
			.catch((error) => {
				console.error("Error updating product:", error);
				if (error.response) {
					console.error("Response data:", error.response.data);
					console.error("Response status:", error.response.status);
					console.error("Response headers:", error.response.headers);
				}
			});
	};

	const handleEditProduct = (product) => {
		setEditingProduct(product._id);
		setUpdatedProduct({
			name: product.name,
			price: product.price,
			image: product.image,
		});
	};

	const handleDeleteProduct = (id) => {
		console.log("Deleting product with ID:", id);
		axios
			.delete(`http://localhost:5000/products/${id}`)
			.then(() => fetchProducts())
			.catch((error) => console.error("Error deleting product:", error));
	};

	// Render login form if not authenticated
	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="bg-white p-8 rounded-lg shadow-lg w-96">
					<h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
					<form
						onSubmit={handleLogin}
						className="space-y-4">
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

	return (
		<div className="container mx-auto p-6">
			<h2 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h2>
			<button
				onClick={handleLogout}
				className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
				Logout
			</button>

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
												handleConfirmOrder(order._id);
											}
										}}
										className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
										Confirm
									</button>

									<button
										onClick={() => handleDeleteOrder(order._id)}
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
					onSubmit={handleAddProduct}
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
					<input
						type="file"
						className="border p-3 rounded w-full"
						onChange={(e) =>
							setNewProduct({ ...newProduct, image: e.target.files[0] })
						}
						required
					/>
					<button
						type="submit"
						className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition">
						Add Product
					</button>
				</form>

				{products.length === 0 ? (
					<p className="text-center text-gray-500">No products available</p>
				) : (
					<div className="space-y-4">
						{products.map((product) => (
							<div
								key={product._id}
								className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm">
								<div>
									<p className="font-bold text-lg">{product.name}</p>
									<p className="text-gray-600">Price: {product.price} MAD</p>
								</div>
								<div className="flex gap-4">
									<button
										onClick={() => handleEditProduct(product)}
										className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition">
										Edit
									</button>
									<button
										onClick={() => handleDeleteProduct(product._id)}
										className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				{/* Editing Product */}
				{editingProduct && (
					<div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
						<h4 className="text-xl font-semibold mb-4">Edit Product</h4>
						<input
							type="text"
							placeholder="Product Name"
							className="border p-3 rounded w-full mb-4"
							value={updatedProduct.name}
							onChange={(e) =>
								setUpdatedProduct({ ...updatedProduct, name: e.target.value })
							}
						/>
						<input
							type="number"
							placeholder="Price"
							className="border p-3 rounded w-full mb-4"
							value={updatedProduct.price}
							onChange={(e) =>
								setUpdatedProduct({ ...updatedProduct, price: e.target.value })
							}
						/>
						<input
							type="file"
							className="border p-3 rounded w-full mb-4"
							onChange={(e) =>
								setUpdatedProduct({ ...updatedProduct, image: e.target.files[0] })
							}
						/>
						<button
							onClick={() => handleUpdateProduct(editingProduct, updatedProduct)}
							className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition">
							Update Product
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Admin;
