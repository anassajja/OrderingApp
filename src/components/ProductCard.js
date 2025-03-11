// ProductCard.js
import React from "react";

const ProductCard = ({ product, addToCart }) => {
	return (
		<div className="border rounded-lg p-4">
			<h3 className="text-xl font-bold">{product.name}</h3>
			<p className="text-gray-500">{product.description}</p>
			<p className="text-lg font-semibold">${product.price}</p>
			<button
				onClick={() => addToCart(product)}
				className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
				Add to Cart
			</button>
		</div>
	);
};

export default ProductCard;
