/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ["image/webp", "image/avif"],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
