'use client'

import React, { useState } from "react";
import ProductsSide from "./ProductsSide/ProductsSide";
import FilterSide from "./FilterSide";
import Brands from "./Brands/Brands";

interface ShopProps {
  initialProducts: any[];
  initialCategory: string | null;
  initialPage: number;
  initialSort: string;
  initialDirection: string;
  totalPages: number;
}

const Shop: React.FC<ShopProps> = ({
  initialProducts,
  initialCategory,
  initialPage,
  initialSort,
  initialDirection,
  totalPages,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [sortField, setSortField] = useState<string>(initialSort);
  const [sortDirection, setSortDirection] = useState<string>(initialDirection);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <section className="shop-content py-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="shop-sidebar sticky top-4">
              <FilterSide setSelectedCategory={handleCategorySelect} selectedCategory={selectedCategory} />
              <Brands />
            </div>
          </div>
          <div className="lg:col-span-3">
            <ProductsSide
              products={initialProducts}
              totalPagesNum={totalPages}
              currentPage={currentPage}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
