import React from "react";
import ProductCard from "../../ProductCard/ProductCard";
import Pagination from "./Pagination";
import { RiEqualizerLine } from "react-icons/ri";
import { useUIStore } from "@/stores";

const ProductsSide: React.FC<any> = ({
  products,
  totalPagesNum,
  currentPage,
  setCurrentPage,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}) => {
  const productsPerPage = 12;
  const { setShowSidebarFilter } = useUIStore();

  const handleFilterBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowSidebarFilter(true);
  };

  return (
    <div className="products-side">
      <div className="flex justify-between items-center bg-orange-50 px-3.75 py-2 mb-2.5 rounded-lg border border-orange-50">
        <div className="flex items-center">
          <span className="text-sm font-semibold mr-1.75">
            {products.length}
          </span>
          <p className="m-0 text-sm text-gray-600">Sản phẩm</p>
        </div>

        <div className="flex items-center">
          <label className="text-sm font-normal">Sắp xếp theo:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="bg-white ml-2.5 text-sm outline-none border border-gray-300 h-9 px-1.25 cursor-pointer transition-colors"
          >
            <option value="productName">Tên sản phẩm (A-Z)</option>
            <option value="price">Giá</option>
          </select>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="bg-white ml-2.5 text-sm outline-none border border-gray-300 h-9 px-1.25 cursor-pointer transition-colors"
          >
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </select>
        </div>

        <button
          type="button"
          className="filter-btn hidden sm:flex items-center gap-2 text-sm text-gray-700 hover:text-primary"
          onClick={handleFilterBtnClick}
        >
          <span className="text-lg">
            <RiEqualizerLine />
          </span>
          <p>Bộ lọc</p>
        </button>
      </div>

      <div className="products">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product: any, index: number) => (
            <div key={index} className="item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <Pagination
        pages={totalPagesNum}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductsSide;
