// Home.js
import React from "react";
import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ProductCard from "../components/ProductCard";

const Home = () => {
	const { addToCart } = useCart();
	const navigate = useNavigate(); // Initialize useNavigate hook

	const products = [
		{
			id: 1,
			name: "Pizza",
			description: "Delicious pizza with cheese",
			price: 12,
		},
		{ id: 2, name: "Burger", description: "Juicy burger with fries", price: 8 },
		{
			id: 3,
			name: "Pasta",
			description: "Creamy pasta with mushrooms",
			price: 10,
		},
	];

	const handleAddToCart = (product) => {
		addToCart(product); // Add to cart
		navigate("/cart"); // Navigate to the Cart page
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Menu</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						addToCart={handleAddToCart} // Use handleAddToCart
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
