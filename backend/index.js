require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;

mongoose
	.connect(mongoURI)
	.then(() => console.log("MongoDB connected successfully"))
	.catch((err) => console.log("Error connecting to MongoDB: ", err));

// Product Schema
const ProductSchema = new mongoose.Schema({
	name: String,
	price: Number,
	image: String,
});
const Product = mongoose.model("Product", ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
	name: String,
	phone: String,
	address: String,
	items: [
		{
			product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
			quantity: Number,
		},
	],
	total: Number,
	status: { type: String, default: "Pending" },
});
const Order = mongoose.model("Order", OrderSchema);

// Routes
app.get("/", (req, res) => {
	res.send("<h1>Server side is running</h1>");
});

// Get all products
app.get("/products", async (req, res) => {
	console.log("Fetching products...");
	const products = await Product.find();
	res.json(products);
});

// Get a single product
app.get("/products/:id", async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.json(product);
});

// Add a new product
app.post("/products", async (req, res) => {
	const newProduct = new Product(req.body);
	await newProduct.save();
	res.json({ message: "Product added!" });
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
	const { id } = req.params;
	await Product.findByIdAndDelete(id);
	res.json({ message: "Product deleted!" });
});

// Update a product
app.put("/products/:id", (req, res) => {
	console.log("Updating product with ID:", req.params.id);
	console.log("Updated data:", req.body);
	const productId = req.params.id;
	const updatedProduct = req.body;

	// Logic to find the product and update it
	Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
		.then((updated) => res.json(updated))
		.catch((error) => res.status(400).send(error));
});

// Get all orders
app.get("/orders", async (req, res) => {
	const orders = await Order.find();
	res.json(orders);
});

// Place a new order
app.post("/orders", async (req, res) => {
	const newOrder = new Order(req.body);
	await newOrder.save();
	res.json({ message: "Order placed!" });
});

// Admin: Modify an order
app.put("/orders/:id", async (req, res) => {
	const { id } = req.params;
	await Order.findByIdAndUpdate(id, req.body);
	res.json({ message: "Order updated!" });
});

// Admin: Confirm an order
app.put("/orders/:id/confirm", async (req, res) => {
	console.log("Confirming order with ID:", req.params.id);
	const { id } = req.params;
	await Order.findByIdAndUpdate(id, { status: "Confirmed" });
	res.json({ message: "Order confirmed!" });
});

// Admin: Delete an order
app.delete("/orders/:id", async (req, res) => {
	const { id } = req.params;
	await Order.findByIdAndDelete(id);
	res.json({ message: "Order deleted!" });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
