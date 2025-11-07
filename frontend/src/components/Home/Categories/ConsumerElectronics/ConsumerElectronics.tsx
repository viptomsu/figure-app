import React from "react";
import ProductCard from "../../../ProductCard/ProductCard";
import SectionHeader from "../../Other/SectionHeader";
import CustomCarousel from "../../../Other/CustomCarousel";
import { getAllProductsServer } from "../../../../services/productService";

interface ConsumerElectronicsProps {
  categoryId: number;
  title: string;
}

async function ConsumerElectronics({ categoryId, title }: ConsumerElectronicsProps) {
  const productsData = await getAllProductsServer("", categoryId, null, 1, 10);
  const products = productsData.payload.content;

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
}

export default ConsumerElectronics;
