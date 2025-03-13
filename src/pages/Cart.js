import React from "react";
import { useCart } from "../store/cart";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

const Cart = () => {
	const { cart = [], removeFromCart, updateQuantity } = useCart(); // Make sure updateQuantity is available from your cart store
	const navigate = useNavigate();

	const handleCheckout = () => {
		navigate("/checkout"); // Navigate to checkout screen
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
			{cart.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<>
					<div className="space-y-4">
						{cart.map((item) => (
							<CartItem
								key={item.id}
								item={item} // Make sure the correct prop name is being passed
								updateQuantity={updateQuantity} // Pass the updateQuantity function
								removeFromCart={removeFromCart}
							/>
						))}
					</div>
					<div className="flex justify-between mt-4">
						<span className="text-xl font-semibold">
							Total: {cart.reduce((acc, item) => acc + item.price, 0)} MAD
						</span>
						<button
							onClick={handleCheckout}
							className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
							Proceed to Checkout
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default Cart;
