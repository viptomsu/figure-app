import React, { useState, useEffect } from "react";
import { useUIStore, useProductsStore } from "@/stores";
import { getAllCategories } from "@/services/categoryService";

interface CategoriesProps {
  setSelectedCategory: (categoryId: string | null) => void;
  selectedCategory?: string | null; // Thêm prop để nhận category hiện tại từ URL
}

const Categories: React.FC<CategoriesProps> = ({
  setSelectedCategory,
  selectedCategory,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setTitle, setIsLoading } = useUIStore();
  const { sortByCategory } = useProductsStore();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.content);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Effect để cập nhật title khi selectedCategory thay đổi từ URL
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat._id === selectedCategory);
      if (category) {
        setTitle(category.categoryName);
        sortByCategory(category.categoryName);
      }
    } else {
      setTitle("Tất cả sản phẩm");
    }
  }, [selectedCategory, categories, setTitle, sortByCategory]);

  const handleCategoryClick = (
    categoryId: string | null,
    categoryName?: string
  ) => {
    // Nếu đã chọn category này rồi thì không làm gì
    if (selectedCategory === categoryId) return;

    setSelectedCategory(categoryId);

    if (categoryId === null) {
      setTitle("Tất cả sản phẩm");
    } else if (categoryName) {
      setTitle(categoryName);
      sortByCategory(categoryName);
    }

    setIsLoading(true);
  };

  return (
    <div className="bg-orange-50 p-6 rounded-lg mb-5">
      <div className="mb-4.5">
        <h5 className="text-lg font-semibold">Danh mục</h5>
      </div>
      <div className="categories-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="space-y-1.25">
            <li
              onClick={() => handleCategoryClick(null)}
              className={`font-${
                selectedCategory === null ? "bold" : "normal"
              } cursor-${
                selectedCategory === null ? "default" : "pointer"
              } ${
                selectedCategory === null ? "bg-gray-100" : ""
              } p-1.25 rounded`}
            >
              <a
                href="#/"
                className={`no-underline ${
                  selectedCategory === null ? "text-primary" : "text-inherit"
                } flex items-center`}
                onClick={(e) => e.preventDefault()}
              >
                Tất cả sản phẩm
              </a>
            </li>
            {categories.map((category: any) => (
              <li
                key={category._id}
                onClick={() =>
                  handleCategoryClick(category._id, category.categoryName)
                }
                className={`font-${
                  selectedCategory === category._id ? "bold" : "normal"
                } cursor-${
                  selectedCategory === category._id ? "default" : "pointer"
                } p-1.25 rounded ${
                  selectedCategory === category._id ? "bg-gray-100" : ""
                }`}
              >
                <a
                  href="#/"
                  className={`no-underline flex items-center ${
                    selectedCategory === category._id ? "text-primary" : "text-inherit"
                  }`}
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    className="w-7.5 h-7.5 mr-2.5 rounded-lg object-cover"
                  />
                  {category.categoryName}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;
