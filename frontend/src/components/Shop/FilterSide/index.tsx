import React from "react";
import Categories from "./Categories/Categories";

interface FilterSideProps {
  selectedCategory?: number | null;
}

const FilterSide: React.FC<FilterSideProps> = ({ selectedCategory }) => {
  return (
    <div>
      <Categories selectedCategory={selectedCategory} />
    </div>
  );
};

export default FilterSide;
