"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../../services/productService"; // Import API
import CustomCarousel from "../../Other/CustomCarousel";
import ProductCard from "../../ProductCard/ProductCard";

const RelatedProducts: React.FC<any> = ({ product }) => {
	const [relatedProducts, setRelatedProducts] = useState<any[]>([]); // State để lưu danh sách sản phẩm liên quan
	const [loading, setLoading] = useState<boolean>(true); // State để xử lý loading

	// Lấy categoryId từ product
	const categoryId = product?.category?._id;

	// Hàm gọi API lấy sản phẩm liên quan
	const fetchRelatedProducts = async () => {
		try {
			setLoading(true);
			const response = await getAllProducts(
				"",
				categoryId,
				null,
				1,
				10,
				"productName",
				"asc"
			);
			const filteredProducts = response.payload.content.filter(
				(relatedProduct: any) => relatedProduct._id !== product._id
			);
			setRelatedProducts(filteredProducts);
		} catch (error) {
			console.error("Error fetching related products", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (categoryId) {
			fetchRelatedProducts(); // Gọi API khi component được render
		}
	}, [categoryId]);

	return (
		<>
			{!loading && relatedProducts.length !== 0 ? (
				<section id="related-products" className="pb-15">
					<div className="container">
						<div className="text-center mb-4">
							<h3 className="text-2xl font-semibold">
								Sản phẩm liên quan
							</h3>
						</div>
						<CustomCarousel>
							{relatedProducts.map(
								(relatedProduct: any, index: number) => (
									<ProductCard key={index} product={relatedProduct} />
								)
							)}
						</CustomCarousel>
					</div>
				</section>
			) : (
				<p>Không có sản phẩm liên quan.</p>
			)}
		</>
	);
};

export default RelatedProducts;
