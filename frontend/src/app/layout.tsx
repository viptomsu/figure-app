import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "./components/AppLayout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Figure Store",
	description: "Figure E-Commerce Platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				{/* Google Fonts */}
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
					rel="stylesheet"
				/>

				{/* jQuery for legacy components */}
				<script
					src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
					crossOrigin="anonymous"
				/>

				{/* Font Awesome */}
				<script
					src="https://kit.fontawesome.com/b7e00c266a.js"
					crossOrigin="anonymous"
				/>
			</head>
			<body className={inter.className}>
				<AppLayout>{children}</AppLayout>
				<Toaster />
			</body>
		</html>
	);
}
