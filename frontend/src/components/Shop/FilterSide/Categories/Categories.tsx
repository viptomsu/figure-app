'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUIStore } from "@/stores";
import { getAllCategories } from "@/services/categoryService";

interface CategoriesProps {
  setSelectedCategory: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

const Categories: React.FC<CategoriesProps> = ({
  setSelectedCategory,
  selectedCategory,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setTitle } = useUIStore();

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

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat._id === selectedCategory);
      if (category) {
        setTitle(category.categoryName);
      }
    } else {
      setTitle("Tất cả sản phẩm");
    }
  }, [selectedCategory, categories, setTitle]);

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
              className={`font-${
                selectedCategory === null ? "bold" : "normal"
              } p-1.25 rounded ${
                selectedCategory === null ? "bg-gray-100" : ""
              }`}
            >
              <Link
                href="/shop"
                className={`no-underline ${
                  selectedCategory === null ? "text-primary" : "text-inherit"
                } flex items-center`}
              >
                Tất cả sản phẩm
              </Link>
            </li>
            {categories.map((category: any) => (
              <li
                key={category._id}
                className={`font-${
                  selectedCategory === category._id ? "bold" : "normal"
                } p-1.25 rounded ${
                  selectedCategory === category._id ? "bg-gray-100" : ""
                }`}
              >
                <Link
                  href={`/shop?category=${category._id}`}
                  className={`no-underline flex items-center ${
                    selectedCategory === category._id ? "text-primary" : "text-inherit"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.categoryName}
                    className="w-7.5 h-7.5 mr-2.5 rounded-lg object-cover"
                  />
                  {category.categoryName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;
