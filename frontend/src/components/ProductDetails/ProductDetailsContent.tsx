import React from "react";
import ImgSlider from "./PrimaryInfo/ImgSlider";
import ProductInfo from "./PrimaryInfo/ProductInfo";
import ProductTabs from "./ProductTabs/ProductTabs";

const ProductDetailsContent: React.FC<any> = ({ product }) => {
	return (
		<section id="product-details" className="py-10">
			<div className="container">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="w-full">
						<ImgSlider product={product} />
					</div>
					<div className="w-full">
						<ProductInfo product={product} />
					</div>
				</div>
				<div className="w-full mt-8">
					<ProductTabs product={product} />
				</div>
			</div>
		</section>
	);
};

export default ProductDetailsContent;
