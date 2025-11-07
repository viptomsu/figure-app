import React from "react";
import { getAllProductsServer } from "../../../services/productService";
import CustomCarousel from "../../Other/CustomCarousel";
import ProductCard from "../../ProductCard/ProductCard";

async function RelatedProducts({ product }: { product: any }) {
	const categoryId = product?.category?._id;

	const response = await getAllProductsServer("", categoryId, null, 1, 10, "productName", "asc");
	const relatedProducts = response.content.filter((relatedProduct: any) => relatedProduct._id !== product._id);

	return (
		<>
			{relatedProducts.length !== 0 ? (
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
}

export default RelatedProducts;
