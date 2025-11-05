import React, { useState, useEffect } from "react";
import { useUIStore, useProductsStore } from "../../../../stores";
import { getAllBrands } from "../../../../services/brandService";

interface BrandsProps {
  setSelectedBrand: (brandId: string | null) => void;
  selectedBrand?: string | null; // Thêm prop để nhận brand hiện tại
}

const Brands: React.FC<BrandsProps> = ({ setSelectedBrand, selectedBrand }) => {
  const { setTitle, setIsLoading } = useUIStore();
  const { sortByBrand } = useProductsStore();
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.content);
      } catch (error) {
        console.error("Error fetching brands", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Effect để cập nhật title khi selectedBrand thay đổi
  useEffect(() => {
    if (selectedBrand) {
      const brand = brands.find((b) => b._id === selectedBrand);
      if (brand) {
        sortByBrand(brand.brandName);
        // Không cần dispatch GetTitle ở đây vì đã có logic ở Categories
      }
    }
  }, [selectedBrand, brands, sortByBrand]);

  const handleBrandClick = (brandId: string | null, brandName?: string) => {
    // Nếu đã chọn brand này rồi thì không làm gì
    if (selectedBrand === brandId) return;

    setSelectedBrand(brandId);

    if (brandId !== null && brandName) {
      sortByBrand(brandName);
    }

    setIsLoading(true);
  };

  return (
    <div className="bg-orange-50 p-6 rounded-lg mb-5">
      <div className="mb-4.5">
        <h5 className="text-lg font-semibold">Thương hiệu</h5>
      </div>
      <div className="brands-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul className="list-none p-0 m-0">
            <li
              onClick={() => handleBrandClick(null)}
              className={`font-${
                selectedBrand === null ? "bold" : "normal"
              } cursor-${
                selectedBrand === null ? "default" : "pointer"
              } ${
                selectedBrand === null ? "bg-gray-100" : ""
              } p-2 rounded border ${
                selectedBrand === null
                  ? "border-primary"
                  : "border-transparent"
              } mb-1.25`}
            >
              <label
                className="flex items-center cursor-pointer text-sm"
                style={{
                  color: selectedBrand === null ? "#007bff" : "inherit",
                  margin: 0,
                }}
              >
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === null}
                  onChange={() => {}}
                  className="mr-2"
                />
                Tất cả thương hiệu
              </label>
            </li>
            {brands.map((brand: any) => (
              <li
                key={brand._id}
                onClick={() => handleBrandClick(brand._id, brand.brandName)}
                className={`font-${
                  selectedBrand === brand._id ? "bold" : "normal"
                } cursor-${
                  selectedBrand === brand._id ? "default" : "pointer"
                } p-2 rounded border ${
                  selectedBrand === brand._id
                    ? "border-primary bg-gray-100"
                    : "border-transparent"
                } mb-1.25`}
              >
                <label
                  htmlFor={`brand-${brand._id}`}
                  className="flex items-center text-sm"
                  style={{
                    color: selectedBrand === brand._id ? "#007bff" : "inherit",
                    margin: 0,
                  }}
                >
                  <input
                    id={`brand-${brand._id}`}
                    type="radio"
                    name="brand"
                    checked={selectedBrand === brand._id}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  {brand.brandName}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Brands;
