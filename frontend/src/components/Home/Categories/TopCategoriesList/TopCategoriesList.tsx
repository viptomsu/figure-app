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
    <div className="top-categories-list">
      <div className="w-full">
        <div className="w-full">
          <div className="section-title">
            <h4>Danh Mục Nổi Bật Trong Tháng</h4>
          </div>
        </div>
      </div>
      <div className="categories-wrapper">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((item) => (
            <div key={item.id}>
              <Link href={`/shop?categoryId=${item.id}`}>
                <div className="category-item">
                  <div className="category-img">
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "168px",
                        height: "168px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="category-title">
                    <h6>{item.title}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCategoriesList;
