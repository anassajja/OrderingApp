// Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {
	const { addToCart } = useCart();
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		axios
			.get("http://localhost:5000/products")
			.then((response) => setProducts(response.data))
			.catch((error) => console.error("Error fetching products:", error));
	}, []);

	const handleAddToCart = (product) => {
		addToCart(product);
		navigate("/cart");
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Menu</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{products.map((product) => (
					<ProductCard
						key={product._id}
						product={product}
						addToCart={handleAddToCart}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
