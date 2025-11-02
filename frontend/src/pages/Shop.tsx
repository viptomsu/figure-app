import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IsLoading, ShowSidebarFilter } from "../redux/actions/primaryActions";
import { Link, useLocation } from "react-router-dom";
import BrandsSection from "../components/Shop/Brands/Brands";
import Categories from "../components/Shop/FilterSide/Categories/Categories";
import Brands from "../components/Shop/FilterSide/Brands/Brands";
import ProductsSide from "../components/Shop/ProductsSide/ProductsSide";
import { RootState } from "../redux/reducers/index";
import { getAllProducts } from "../services/productService";
import { CircleLoader } from "react-spinners";

const Shop: React.FC = () => {
  const primaryState = useSelector((state: RootState) => state.primary);
  const loading = primaryState.isLoading;
  const showSideFilter = primaryState.showSidebarFilter;
  const dispatch = useDispatch();

  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [totalPagesNum, setTotalPagesNum] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("productName");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Kiểm tra categoryId từ URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryIdParam = params.get("categoryId");

    if (categoryIdParam) {
      console.log("Category ID từ URL:", categoryIdParam);
      setSelectedCategory(categoryIdParam);
    } else {
      // Nếu không có categoryId trong URL, reset về null để lấy tất cả sản phẩm
      setSelectedCategory(null);
    }

    // Đánh dấu đã khởi tạo xong và fetch luôn
    setIsInitialized(true);
  }, [location.search]);
  const fetchProducts = async () => {
    try {
      dispatch(IsLoading(true));

      console.log("Fetching products với params:", {
        selectedCategory,
        selectedBrand,
        currentPage,
        sortField,
        sortDirection,
      });

      const response = await getAllProducts(
        "", // search term
        selectedCategory, // categoryId - null nếu không filter theo category
        selectedBrand,
        currentPage,
        12, // page size
        sortField,
        sortDirection
      );

      setProducts(response.payload.content);
      setTotalPagesNum(response.payload.totalPages);

      console.log("Đã lấy được", response.payload.content.length, "sản phẩm");
    } catch (error) {
      console.error("Error fetching products", error);
      setProducts([]);
    } finally {
      dispatch(IsLoading(false));
    }
  };
  // Fetch products ngay sau khi khởi tạo hoặc khi filter thay đổi
  useEffect(() => {
    if (isInitialized) {
      fetchProducts();
    }
  }, [
    isInitialized,
    selectedCategory,
    selectedBrand,
    currentPage,
    sortField,
    sortDirection,
  ]);

  // Reset về trang 1 khi thay đổi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, sortField, sortDirection]);

  // Handler để update category khi user chọn từ filter sidebar
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Có thể update URL nếu muốn
    // const newUrl = categoryId
    //   ? `${location.pathname}?categoryId=${categoryId}`
    //   : location.pathname;
    // window.history.pushState({}, '', newUrl);
  };

  return (
    <div className="shop-content">
      <div className="main">
        <section id="breadcrumb">
          <div className="container">
            <ul className="breadcrumb-content d-flex m-0 p-0">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <span>Sản phẩm</span>
              </li>
              {selectedCategory && (
                <li>
                  <span>Category: {selectedCategory}</span>
                </li>
              )}
            </ul>
          </div>
        </section>
        <div className="shop-content-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <BrandsSection />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <div
                  className={
                    showSideFilter ? "filter-side show-filter" : "filter-side"
                  }
                >
                  <Categories
                    setSelectedCategory={handleCategoryChange}
                    selectedCategory={selectedCategory}
                  />
                  <Brands
                    setSelectedBrand={setSelectedBrand}
                    selectedBrand={selectedBrand}
                  />
                </div>
              </div>
              <div className="col-lg-9">
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}
                  >
                    <CircleLoader color="#36d7b7" size={100} />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-4">
                    <small>
                      {selectedCategory
                        ? `Không tìm thấy sản phẩm cho category này.`
                        : `Không tìm thấy sản phẩm.`}
                    </small>
                  </div>
                ) : (
                  <ProductsSide
                    products={products}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    setSortField={setSortField}
                    setSortDirection={setSortDirection}
                    totalPagesNum={totalPagesNum}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={showSideFilter ? "dark-bg-color" : "d-none"}
          onClick={() => {
            dispatch(ShowSidebarFilter(false));
          }}
        ></div>
      </div>
    </div>
  );
};

export default Shop;
