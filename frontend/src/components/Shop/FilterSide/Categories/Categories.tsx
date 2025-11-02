import React, { useState, useEffect } from "react";
import { useUIStore, useProductsStore } from "../../../../stores";
import { getAllCategories } from "../../../../services/categoryService";

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
    <div className="categories">
      <div className="categories-title">
        <h5>Danh mục</h5>
      </div>
      <div className="categories-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul>
            <li
              onClick={() => handleCategoryClick(null)}
              style={{
                fontWeight: selectedCategory === null ? "bold" : "normal",
                cursor: selectedCategory === null ? "default" : "pointer",
                backgroundColor:
                  selectedCategory === null ? "#f0f0f0" : "transparent",
                padding: "5px 10px",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              <a
                href="#/"
                style={{
                  textDecoration: "none",
                  color: selectedCategory === null ? "#007bff" : "inherit",
                }}
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
                style={{
                  fontWeight:
                    selectedCategory === category._id ? "bold" : "normal",
                  cursor:
                    selectedCategory === category._id ? "default" : "pointer",
                  backgroundColor:
                    selectedCategory === category._id
                      ? "#f0f0f0"
                      : "transparent",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                }}
              >
                <a
                  href="#/"
                  style={{
                    textDecoration: "none",
                    color:
                      selectedCategory === category._id ? "#007bff" : "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
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
