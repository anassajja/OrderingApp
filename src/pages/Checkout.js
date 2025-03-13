// Checkout.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	GoogleMap,
	LoadScript,
	Marker,
	InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";

const Checkout = () => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [location, setLocation] = useState(null);
	const [address, setAddress] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	const GOOGLE_MAPS_API_KEY = "AIzaSyDsL_DCpP8pZZBjuOQnWxzCL2mEB-paZQY";

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					setLocation({ lat: latitude, lng: longitude });

					const response = await fetch(
						`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
					);
					const data = await response.json();
					setAddress(data.results[0]?.formatted_address || "Address not found");
				},
				(error) => {
					console.error("Error fetching location", error);
					alert("Unable to retrieve your location.");
				}
			);
		} else {
			alert("Geolocation is not supported by your browser.");
		}
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name && phone && location) {
			const order = { name, phone, address, location };
			await axios.post("http://localhost:5000/orders", order);
			setIsSubmitted(true);
			setTimeout(() => navigate("/"), 2000);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

			{isSubmitted ? (
				<p className="text-center text-lg text-green-500">
					Order submitted successfully!
				</p>
			) : (
				<form
					onSubmit={handleSubmit}
					className="space-y-6">
					<div className="flex flex-col">
						<label className="font-semibold">Name</label>
						<input
							type="text"
							className="border p-3 rounded-lg"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
					<div className="flex flex-col">
						<label className="font-semibold">Phone</label>
						<input
							type="tel"
							className="border p-3 rounded-lg"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required
						/>
					</div>
					<div className="flex flex-col">
						<label className="font-semibold">Address</label>
						<input
							type="text"
							className="border p-3 rounded-lg"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							required
						/>
					</div>

					{location && (
						<LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
							<GoogleMap
								mapContainerStyle={{ width: "100%", height: "200px" }}
								center={location}
								zoom={14}>
								<Marker position={location} />
								<InfoWindow position={location}>
									<div>
										<p className="font-semibold">{address}</p>
									</div>
								</InfoWindow>
							</GoogleMap>
						</LoadScript>
					)}

					<button
						type="submit"
						className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
						Submit Order
					</button>
				</form>
			)}
		</div>
	);
};

export default Checkout;
