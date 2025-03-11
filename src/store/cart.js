import React, { createContext, useState, useContext } from "react";

// Create CartContext
const CartContext = createContext();

// CartProvider Component to manage the cart state and expose functions
export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]); // Initialize the cart as an empty array

	// Add an item to the cart
	const addToCart = (product) => {
		setCart((prevCart) => {
			// Check if the product is already in the cart and update quantity if necessary
			const existingProductIndex = prevCart.findIndex(
				(item) => item.id === product.id
			);
			if (existingProductIndex >= 0) {
				const updatedCart = [...prevCart];
				updatedCart[existingProductIndex].quantity += product.quantity;
				return updatedCart;
			}
			return [...prevCart, product];
		});
	};

	// Update the quantity of a product in the cart
	const updateQuantity = (id, newQuantity) => {
		setCart((prevCart) =>
			prevCart.map((item) =>
				item.id === id ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	// Remove a product from the cart
	const removeFromCart = (productId) => {
		setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
	};

	// Provide the cart state and functions to children components
	return (
		<CartContext.Provider
			value={{ cart, addToCart, updateQuantity, removeFromCart }}>
			{children}
		</CartContext.Provider>
	);
};

// Custom hook to access the CartContext
export const useCart = () => {
	const context = useContext(CartContext);

	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}

	return context;
};
