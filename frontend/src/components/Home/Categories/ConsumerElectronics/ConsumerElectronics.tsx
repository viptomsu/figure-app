import React, { useEffect, useState } from "react";
import ProductCard from "../../../ProductCard/ProductCard";
import SectionHeader from "../../Other/SectionHeader";
import CustomCarousel from "../../../Other/CustomCarousel";
import { getAllProducts } from "../../../../services/productService"; // Import hàm API

interface ConsumerElectronicsProps {
  categoryId: number; // Nhận categoryId từ props
  title: string;
}

const ConsumerElectronics: React.FC<ConsumerElectronicsProps> = ({
  categoryId,
  title,
}) => {
  const [products, setProducts] = useState<any[]>([]); // State để lưu danh sách sản phẩm
  const [loading, setLoading] = useState<boolean>(true); // State để kiểm tra trạng thái loading

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Gọi API để lấy danh sách sản phẩm theo categoryId
        const data = await getAllProducts("", categoryId, null, 1, 10); // Gọi API với page=1 và limit=10
        setProducts(data.payload.content); // Lưu kết quả vào state
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Dừng trạng thái loading sau khi API hoàn tất
      }
    };

    fetchProducts();
  }, [categoryId]); // Gọi lại API khi categoryId thay đổi

  if (loading) {
    return <div>Đang tải sản phẩm...</div>; // Hoặc hiển thị spinner
  }

  return (
    <div className="mb-12">
      <div className="mb-6">
        <SectionHeader title={title} />
      </div>
      <div>
        <CustomCarousel>
          {products.length > 0 ? (
            products.map((product: any, index: number) => (
              <ProductCard key={index} product={product} />
            ))
          ) : (
            <div>Không có sản phẩm nào</div>
          )}
        </CustomCarousel>
      </div>
    </div>
  );
};

export default ConsumerElectronics;
