import React, { useState } from "react";

const Admin = () => {
	const [adminAuth, setAdminAuth] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		if (username === "admin" && password === "admin123") {
			setAdminAuth(true);
		} else {
			alert("Incorrect credentials!");
		}
	};

	if (!adminAuth) {
		return (
			<div className="container mx-auto p-4">
				<h2 className="text-2xl font-bold mb-4">Admin Login</h2>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="border p-2 mb-2 w-full"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2 mb-4 w-full"
				/>
				<button
					onClick={handleLogin}
					className="bg-blue-500 text-white px-4 py-2 rounded">
					Login
				</button>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
			<h3 className="text-xl mb-4">Manage Products</h3>
			{/* Add CRUD for products here */}
		</div>
	);
};

export default Admin;
