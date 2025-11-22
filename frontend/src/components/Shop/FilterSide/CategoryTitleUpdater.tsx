'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores';

interface CategoryTitleUpdaterProps {
  selectedCategory?: string | null;
  categories: Array<{ id: string; categoryName: string; image?: string }>;
}

export default function CategoryTitleUpdater({
  selectedCategory,
  categories,
}: CategoryTitleUpdaterProps) {
  const { setTitle } = useUIStore();

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.id === selectedCategory);
      if (category) {
        setTitle(category.categoryName);
      }
    } else {
      setTitle('Tất cả sản phẩm');
    }
  }, [selectedCategory, categories, setTitle]);

  return null;
}
