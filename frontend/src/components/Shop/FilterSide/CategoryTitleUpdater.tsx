'use client'

import { useEffect } from "react";
import { useUIStore } from "@/stores";

interface CategoryTitleUpdaterProps {
  selectedCategory?: number | null;
  categories: Array<{ categoryId: number; categoryName: string; image?: string }>;
}

export default function CategoryTitleUpdater({ selectedCategory, categories }: CategoryTitleUpdaterProps) {
  const { setTitle } = useUIStore();

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.categoryId === selectedCategory);
      if (category) {
        setTitle(category.categoryName);
      }
    } else {
      setTitle("Tất cả sản phẩm");
    }
  }, [selectedCategory, categories, setTitle]);

  return null;
}