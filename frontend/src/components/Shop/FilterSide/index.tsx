import React from "react";
import Categories from "./Categories/Categories";

interface FilterSideProps {
  setSelectedCategory: (categoryId: string | null) => void;
  selectedCategory?: string | null;
}

const FilterSide: React.FC<FilterSideProps> = ({ setSelectedCategory, selectedCategory }) => {
  return (
    <div className="filter-side">
      <Categories setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
    </div>
  );
};

export default FilterSide;
