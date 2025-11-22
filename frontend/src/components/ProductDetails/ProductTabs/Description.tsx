import React from "react";

const Description: React.FC<any> = ({ product }) => {
	return (
		<div>
			<h6 className="text-lg font-semibold mb-4">Mô tả sản phẩm</h6>

			{/* Hiển thị product.description dưới dạng HTML */}
			<div className="text-gray-600 prose" dangerouslySetInnerHTML={{ __html: product?.description }} />
		</div>
	);
};

export default Description;
