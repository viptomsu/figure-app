import React from 'react';
import ProductsSide from './ProductsSide/ProductsSide';
import Categories from './FilterSide/Categories/Categories';
import Brands from './Brands/Brands';

interface ShopProps {
  initialProducts: any[];
  initialCategory: string | null | undefined;
  initialPage: number;
  initialSort: string;
  initialDirection: string;
  totalPages: number;
  initialBrands: any[];
}

const Shop: React.FC<ShopProps> = ({
  initialProducts,
  initialCategory,
  initialPage,
  initialSort,
  initialDirection,
  totalPages,
  initialBrands,
}) => {
  return (
    <section className="shop-content py-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="shop-sidebar sticky top-4">
              <Categories selectedCategory={initialCategory} />
              <Brands initialBrands={initialBrands} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <ProductsSide
              products={initialProducts}
              totalPagesNum={totalPages}
              currentPage={initialPage}
              sortField={initialSort}
              sortDirection={initialDirection}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
