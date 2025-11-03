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
		<section id="deal-of-the-day">
			<div className="container">
				{/* ======= Tiêu đề phần ======= */}
				<div className="section-header-wrapper">
					<div className="section-header">
						<div className="left-side flex items-center">
							<div className="title mr-4">
								<h4 className="text-lg font-semibold">Ưu đãi trong ngày</h4>
							</div>
							<div className="countdown-wrapper">
								<Countdown />
							</div>
						</div>
						<div className="right-side">
							<div className="view-all">
								<Link
									href="/shop"
									className="text-blue-600 hover:text-blue-800 transition-colors">
									Xem tất cả
								</Link>
							</div>
						</div>
					</div>
				</div>
				{/* ======= Slider ======= */}
				<div className="slider-wrapper">
					<CustomCarousel>
						{products.map((product: any, index: number) => (
							<ProductCard key={index} product={product} />
						))}
					</CustomCarousel>
				</div>
			</div>
		</section>
	);
};

export default DealOfTheDay;
