import React from 'react';
import { Brand } from '@/services/types';

interface BrandsProps {
  initialBrands: Brand[];
}

const Brands = ({ initialBrands }: BrandsProps) => {
  const brands = initialBrands || [];
  const tripleBrands = [...brands, ...brands, ...brands];

  return (
    <div
      className="brands-section overflow-hidden py-6 pb-20"
      data-animated="true"
      data-direction="left"
      data-speed="fast"
    >
      <ul className="flex items-center justify-between overflow-hidden">
        <div className="md:w-80"></div>
        <div className="flex animate-scroll">
          {tripleBrands.map((brand: Brand, index: number) => (
            <li key={index} className="mx-5">
              <a href="#/">
                <img src={brand.image} alt={brand.brandName} className="w-25 h-auto" />
              </a>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default Brands;
