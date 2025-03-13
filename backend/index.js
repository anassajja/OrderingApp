require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
	destination: "uploads/",
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

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

// Admin Schema
const AdminSchema = new mongoose.Schema({
	username: String,
	password: String,
});
const Admin = mongoose.model("Admin", AdminSchema);

// Routes
app.get("/", (req, res) => {
	res.send("<h1>Server side is running</h1>");
});

// Add a new admin (for initial setup)
app.post("/admins", async (req, res) => {
	try {
		const { username, password } = req.body;
		const newAdmin = new Admin({ username, password });
		await newAdmin.save();
		res.json({ message: "Admin added!", admin: newAdmin });
	} catch (error) {
		res.status(500).json({ error: "Error adding admin" });
	}
});

// Authenticate admin
app.post("/admins/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const admin = await Admin.findOne({ username, password });
		if (admin) {
			res.json({ message: "Authenticated", admin });
		} else {
			res.status(401).json({ error: "Invalid username or password" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error authenticating admin" });
	}
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
app.post("/products", upload.single("image"), async (req, res) => {
	try {
		const { name, price, description } = req.body;
		const imagePath = req.file ? req.file.path : null; // Store the image path

		const newProduct = new Product({
			name,
			price,
			description,
			image: imagePath, // Save image path in database
		});

		await newProduct.save();
		res.json({ message: "Product added!", product: newProduct });
	} catch (error) {
		res.status(500).json({ error: "Error adding product" });
	}
});
// Delete a product
app.delete("/products/:id", async (req, res) => {
	const { id } = req.params;
	await Product.findByIdAndDelete(id);
	res.json({ message: "Product deleted!" });
});

// Update a product
app.put("/products/:id", upload.single("image"), async (req, res) => {
	try {
		const { id } = req.params;
		const { name, price, description } = req.body;
		const productImage = await Product.findById(id);

		if (!productImage) {
			return res.status(404).json({ error: "Product not found" });
		}

		const imagePath = req.file ? `/uploads/${req.file.filename}` : productImage.image; // Retain existing image if no new image is provided

		const updatedProduct = {
			name,
			price,
			description,
			image: imagePath, // Save image path in database
		};

		const product = await Product.findByIdAndUpdate(id, updatedProduct, {
			new: true,
		});
		res.json(product);
	} catch (error) {
		res.status(500).json({ error: "Error updating product" });
	}
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
