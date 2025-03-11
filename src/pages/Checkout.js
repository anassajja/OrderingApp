import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	GoogleMap,
	LoadScript,
	Marker,
	InfoWindow,
} from "@react-google-maps/api";

const Checkout = () => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [location, setLocation] = useState(null); // For storing the user's location
	const [address, setAddress] = useState(""); // Address string
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	// Define Google Maps API key
	const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

	useEffect(() => {
		// Get the user's location on mount
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					setLocation({ lat: latitude, lng: longitude });

					// Fetch address using reverse geocoding API
					const response = await fetch(
						`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
					);
					const data = await response.json();
					const address = data.results[0]?.formatted_address || "Address not found";
					setAddress(address);
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

	const handleSubmit = (e) => {
		e.preventDefault();
		// Add logic for handling form submission (you can add validation here)
		if (name && phone && location) {
			setIsSubmitted(true);
			// After successful form submission, you could navigate to a confirmation page or perform other actions
			setTimeout(() => {
				navigate("/"); // Redirect back to home after successful submission (you can customize this)
			}, 2000);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

			{isSubmitted ? (
				<div className="text-center">
					<p className="text-lg text-green-500">Order submitted successfully!</p>
				</div>
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
						<label className="font-semibold">Phone Number</label>
						<input
							type="tel"
							className="border p-3 rounded-lg"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							required
						/>
					</div>

					{/* Display Map and Location */}
					<div className="flex flex-col space-y-2">
						<label className="font-semibold">Your Location</label>
						{location ? (
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
						) : (
							<p>Fetching your location...</p>
						)}
					</div>

					<div className="flex justify-center mt-4">
						<button
							type="submit"
							className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
							Submit Order (Cash on Delivery)
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default Checkout;
