import React from "react";
import ProductCard from "../../../ProductCard/ProductCard";
import SectionHeader from "../../Other/SectionHeader";
import CustomCarousel from "../../../Other/CustomCarousel";
import { useProductsStore } from "../../../../stores";

const Clothings: React.FC = () => {
  const { products } = useProductsStore();

  return (
    <div className="clothings">
      <div className="section-header-wrapper">
        <SectionHeader title="Clothings" />
      </div>
      <div className="owl-carousel-wrapper">
        <CustomCarousel>
          {products.map(
            (product: any, index: number) =>
              product.category === "Clothing & Apparel" && (
                <ProductCard key={index} product={product} />
              )
          )}
        </CustomCarousel>
      </div>
    </div>
  );
};

export default Clothings;
