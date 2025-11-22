import React from 'react';
import Link from 'next/link';
import { getAllCategoriesServer } from '@/services/server';
import CategoryTitleUpdater from '../CategoryTitleUpdater';

interface CategoriesProps {
  selectedCategory?: string | null;
}

async function Categories({ selectedCategory }: CategoriesProps) {
  const response = await getAllCategoriesServer(1, 100);
  const categories = response.content;

  return (
    <>
      <CategoryTitleUpdater selectedCategory={selectedCategory} categories={categories} />
      <div className="bg-orange-50 p-6 rounded-lg mb-5">
        <div className="mb-4.5">
          <h5 className="text-lg font-semibold">Danh mục</h5>
        </div>
        <div className="categories-list">
          <ul className="space-y-1.25">
            <li
              className={`font-${selectedCategory === null ? 'bold' : 'normal'} p-1.25 rounded ${
                selectedCategory === null ? 'bg-gray-100' : ''
              }`}
            >
              <Link
                href="/shop"
                className={`no-underline ${
                  selectedCategory === null ? 'text-primary' : 'text-inherit'
                } flex items-center`}
              >
                Tất cả sản phẩm
              </Link>
            </li>
            {categories.map((category: any) => (
              <li
                key={category.id}
                className={`font-${
                  selectedCategory === category.id ? 'bold' : 'normal'
                } p-1.25 rounded ${selectedCategory === category.id ? 'bg-gray-100' : ''}`}
              >
                <Link
                  href={`/shop?categoryId=${category.id}`}
                  className={`no-underline flex items-center ${
                    selectedCategory === category.id ? 'text-primary' : 'text-inherit'
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
        </div>
      </div>
    </>
  );
}

export default Categories;
