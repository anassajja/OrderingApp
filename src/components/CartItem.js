import React, { useState, useEffect } from "react";

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
	const [quantity, setQuantity] = useState(item.quantity);

	useEffect(() => {
		// Update quantity when the item quantity changes
		setQuantity(item.quantity);
	}, [item.quantity]); // Include item.quantity as a dependency

	const handleQuantityChange = (e) => {
		const newQuantity = e.target.value;
		setQuantity(newQuantity);
		updateQuantity(item.id, newQuantity);
	};

	return (
		<div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 mb-4">
			<div className="flex items-center space-x-4">
				<img
					src={`https://via.placeholder.com/100?text=${item.name}`}
					alt={item.name}
					className="w-16 h-16 object-cover rounded-md"
				/>
				<div>
					<h3 className="text-lg font-semibold">{item.name}</h3>
					<p className="text-sm text-gray-500">{item.description}</p>
					<p className="text-sm font-semibold text-gray-700">
						${item.price} x {quantity} = ${item.price * quantity}
					</p>
				</div>
			</div>

			<div className="flex items-center space-x-4">
				<input
					type="number"
					min="1"
					value={quantity}
					onChange={handleQuantityChange}
					className="w-12 px-2 py-1 text-center border rounded-md"
				/>
				<button
					onClick={() => removeFromCart(item.id)}
					className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
					Remove
				</button>
			</div>
		</div>
	);
};

export default CartItem;
