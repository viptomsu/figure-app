import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductsSide from "./ProductsSide/ProductsSide";
import FilterSide from "./FilterSide";
import Brands from "./Brands/Brands";
import { useProductsStore, useUIStore } from "@/stores";
import { getAllProducts } from "@/services/productService";

const Shop = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPagesNum, setTotalPagesNum] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [sortField, setSortField] = useState<string>("productName");
  const [sortDirection, setSortDirection] = useState<string>("asc");
  
  const { setIsLoading } = useUIStore();
  const { products: storeProducts, setProducts: setStoreProducts } = useProductsStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        const response = await getAllProducts();
        let fetchedProducts = response.content || [];
        
        // Filter by category if selected
        if (selectedCategory) {
          fetchedProducts = fetchedProducts.filter(
            (product: any) => product.categoryId === selectedCategory
          );
        }
        
        // Sort products
        fetchedProducts.sort((a: any, b: any) => {
          let aValue = a[sortField];
          let bValue = b[sortField];
          
          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (sortDirection === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        setProducts(fetchedProducts);
        setStoreProducts(fetchedProducts);
        setTotalPagesNum(Math.ceil(fetchedProducts.length / 12));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortField, sortDirection, setStoreProducts, setIsLoading]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <section className="shop-content">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="shop-sidebar">
              <FilterSide setSelectedCategory={handleCategorySelect} selectedCategory={selectedCategory} />
              <Brands />
            </div>
          </div>
          <div className="col-lg-9">
            <ProductsSide
              products={products}
              loading={loading}
              totalPagesNum={totalPagesNum}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              sortField={sortField}
              sortDirection={sortDirection}
              setSortField={setSortField}
              setSortDirection={setSortDirection}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
