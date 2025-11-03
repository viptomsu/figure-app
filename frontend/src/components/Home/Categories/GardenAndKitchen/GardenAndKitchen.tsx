import React from "react";
import ProductCard from "../../../ProductCard/ProductCard";
import SectionHeader from "../../Other/SectionHeader";
import CustomCarousel from "../../../Other/CustomCarousel";
import { useProductsStore } from "../../../../stores";

const GardenAndKitchen: React.FC = () => {
  const { products } = useProductsStore();

  return (
    <div className="garden-and-kitchen">
      {/* ======= Section header ======= */}
      <div className="section-header-wrapper">
        <SectionHeader title="Garden & Kitchen" />
      </div>
      {/* ======= Owl-carousel ======= */}
      <div className="owl-carousel-wrapper">
        <CustomCarousel>
          {products.map(
            (product: any, index: number) =>
              product.category === "Home, Garden & Kitchen" && (
                <ProductCard key={index} product={product} />
              )
          )}
        </CustomCarousel>
      </div>
    </div>
  );
};

export default GardenAndKitchen;
