import React from "react";

const Description: React.FC<any> = ({ product }) => {
	return (
		<div className="tabContent-description">
			<h6>Mô tả sản phẩm</h6>

			{/* Hiển thị product.description dưới dạng HTML */}
			<div dangerouslySetInnerHTML={{ __html: product?.description }} />
		</div>
	);
};

export default Description;
