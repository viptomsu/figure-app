"use client";

import React, { useState, useEffect } from "react";
import { VscArrowUp } from "react-icons/vsc";

const BackToTopBtn: React.FC = () => {
	const [show, setShow] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 500) {
				setShow(true);
			} else {
				setShow(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div
			id="back-to-top-btn"
			className={`fixed bottom-12.5 right-10 z-dropdown transition-all duration-300 md:hidden lg:flex ${
				show
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-4 pointer-events-none"
			}`}>
			<button
				type="button"
				onClick={handleClick}
				className="bg-white border border-gray-200 text-gray-600 h-11.25 w-11.25 rounded-full transition-all duration-300 hover:text-primary hover:border-primary">
				<VscArrowUp className="text-xl mb-1" />
			</button>
		</div>
	);
};

export default BackToTopBtn;
