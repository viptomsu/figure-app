'use client'

import React, { useEffect, useState } from "react";
import { getAllBrands } from "@/services/brandService";

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]); // State to store brand data
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch brands from the API when the component mounts
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands(); // Call the API to get brand data
        setBrands(response.content); // Assuming response.content contains the brand data
      } catch (error) {
        console.error("Error fetching brands", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }
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
          {tripleBrands.map((brand: any, index: number) => (
            <li key={index} className="mx-5">
              <a href="#/">
                <img
                  src={brand.image}
                  alt={brand.brandName}
                  className="w-25 h-auto"
                />
              </a>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default Brands;
