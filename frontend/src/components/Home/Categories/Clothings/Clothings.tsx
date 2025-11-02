import React from "react";
import ProductCard from "../../../ProductCard/ProductCard";
import SectionHeader from "../../Other/SectionHeader";
import OwlCarousel from "react-owl-carousel";
import { Options } from "../../../Other/OwlCarouselOptions";
import { useProductsStore } from "../../../../stores";

const Clothings: React.FC = () => {
  const { products } = useProductsStore();

  return (
    <div className="clothings">
      <div className="section-header-wrapper">
        <SectionHeader title="Clothings" />
      </div>
      <div className="owl-carousel-wrapper">
        <OwlCarousel className="owl-theme" {...Options}>
          {products.map(
            (product: any, index: number) =>
              product.category === "Clothing & Apparel" && (
                <div key={index} className="item">
                  <ProductCard product={product} />
                </div>
              )
          )}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default Clothings;
