import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="bg-blue-600 shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						{/* Logo */}
						<Link
							to="/"
							className="text-white text-2xl font-semibold">
							Blaban
						</Link>
					</div>
					{/* Desktop Menu */}
					<div className="hidden md:flex space-x-4">
						<Link
							to="/"
							className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-lg">
							Home
						</Link>
						<Link
							to="/cart"
							className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-lg">
							Cart
						</Link>
						<Link
							to="/admin"
							className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-lg">
							Admin
						</Link>
					</div>
					{/* Mobile Menu Button */}
					<div className="-mr-2 flex md:hidden">
						<button
							onClick={toggleMenu}
							type="button"
							className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
							<span className="sr-only">Open main menu</span>
							{isOpen ? (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="block h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div className={`${isOpen ? "block" : "hidden"} md:hidden bg-blue-700`}>
				<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
					<Link
						to="/"
						className="text-white block px-3 py-2 rounded-md text-base font-medium">
						Home
					</Link>
					<Link
						to="/cart"
						className="text-white block px-3 py-2 rounded-md text-base font-medium">
						Cart
					</Link>
					<Link
						to="/admin"
						className="text-white block px-3 py-2 rounded-md text-base font-medium">
						Admin
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
