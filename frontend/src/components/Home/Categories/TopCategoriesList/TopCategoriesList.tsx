import React from "react";
import Link from "next/link";
import { ITopCategoriesData } from "@/types/types";

interface TopCategoriesListProps {
  categories: ITopCategoriesData[];
}

const TopCategoriesList: React.FC<TopCategoriesListProps> = ({
  categories,
}) => {
  return (
    <div className="mb-12">
      <div className="w-full text-center mb-6">
        <h4 className="text-2xl font-semibold">Danh Mục Nổi Bật Trong Tháng</h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((item) => (
          <div key={item.id}>
            <Link href={`/shop?category=${item.id}`}>
              <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="w-[168px] h-[168px] mx-auto mb-3">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="text-center">
                  <h6 className="text-sm font-medium">{item.title}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategoriesList;
