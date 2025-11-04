import React, { useEffect, useState } from "react";
import Countdown from "./Countdown";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";
import CustomCarousel from "@/components/Other/CustomCarousel";
import { getFilteredProducts } from "@/services/productService";

const DealOfTheDay: React.FC = () => {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const filteredProducts = await getFilteredProducts(false, false, true);
				setProducts(filteredProducts.payload.content); // Cập nhật state
				setLoading(false);
			} catch (error) {
				console.error("Lỗi khi lấy sản phẩm Deal trong ngày", error);
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading) {
		return <div>Đang tải...</div>;
	}

	if (products.length === 0) {
		return <div>Không có sản phẩm nào</div>;
	}

	return (
		<section id="deal-of-the-day" className="py-12 bg-gray-50">
			<div className="container">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center">
						<h4 className="text-2xl font-semibold mr-4">Ưu đãi trong ngày</h4>
						<Countdown />
					</div>
					<Link
						href="/shop"
						className="text-primary hover:text-red-700 transition-colors"
					>
						Xem tất cả
					</Link>
				</div>
				<CustomCarousel>
					{products.map((product: any, index: number) => (
						<ProductCard key={index} product={product} />
					))}
				</CustomCarousel>
			</div>
		</section>
	);
};

export default DealOfTheDay;
