require("dotenv").config(); // Load environment variables

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

// Check if MongoDB connected
mongoose.connection.on("connected", () => {
	console.log("MongoDB connected successfully");
});

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
	location: Object,
	items: Array,
	total: Number,
});
const Order = mongoose.model("Order", OrderSchema);

// Routes
app.get("/", (req, res) => {
	res.send("<h1>Server side is running</h1>");
});

app.get("/products", async (req, res) => {
	const products = await Product.find();
	res.json(products);
});

app.post("/products", async (req, res) => {
	const newProduct = new Product(req.body);
	await newProduct.save();
	res.json({ message: "Product added!" });
});

app.get("/orders", async (req, res) => {
	const orders = await Order.find();
	res.json(orders);
});

app.post("/orders", async (req, res) => {
	const newOrder = new Order(req.body);
	await newOrder.save();
	res.json({ message: "Order placed!" });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
