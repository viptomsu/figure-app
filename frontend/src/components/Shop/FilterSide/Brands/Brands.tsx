import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SortByBrand } from "../../../../redux/actions/productActions";
import { GetTitle, IsLoading } from "../../../../redux/actions/primaryActions";
import { getAllBrands } from "../../../../services/brandService";

interface BrandsProps {
  setSelectedBrand: (brandId: string | null) => void;
  selectedBrand?: string | null; // Thêm prop để nhận brand hiện tại
}

const Brands: React.FC<BrandsProps> = ({ setSelectedBrand, selectedBrand }) => {
  const dispatch = useDispatch();
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
        dispatch(SortByBrand(brand.brandName));
        // Không cần dispatch GetTitle ở đây vì đã có logic ở Categories
      }
    }
  }, [selectedBrand, brands, dispatch]);

  const handleBrandClick = (brandId: string | null, brandName?: string) => {
    // Nếu đã chọn brand này rồi thì không làm gì
    if (selectedBrand === brandId) return;

    setSelectedBrand(brandId);

    if (brandId !== null && brandName) {
      dispatch(SortByBrand(brandName));
    }

    dispatch(IsLoading(true));
  };

  return (
    <div className="brands">
      <div className="brands-title">
        <h5>Thương hiệu</h5>
      </div>
      <div className="brands-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul>
            <li
              onClick={() => handleBrandClick(null)}
              style={{
                fontWeight: selectedBrand === null ? "bold" : "normal",
                cursor: selectedBrand === null ? "default" : "pointer",
                backgroundColor:
                  selectedBrand === null ? "#f0f0f0" : "transparent",
                padding: "8px 12px",
                borderRadius: "5px",
                marginBottom: "5px",
                border:
                  selectedBrand === null
                    ? "2px solid #007bff"
                    : "1px solid transparent",
              }}
            >
              <label
                className="d-flex align-items-center"
                style={{
                  cursor: selectedBrand === null ? "default" : "pointer",
                  color: selectedBrand === null ? "#007bff" : "inherit",
                  margin: 0,
                }}
              >
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === null}
                  onChange={() => {}}
                  style={{ marginRight: "8px" }}
                />
                Tất cả thương hiệu
              </label>
            </li>
            {brands.map((brand: any) => (
              <li
                key={brand._id}
                onClick={() => handleBrandClick(brand._id, brand.brandName)}
                style={{
                  fontWeight: selectedBrand === brand._id ? "bold" : "normal",
                  cursor: selectedBrand === brand._id ? "default" : "pointer",
                  backgroundColor:
                    selectedBrand === brand._id ? "#f0f0f0" : "transparent",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  border:
                    selectedBrand === brand._id
                      ? "2px solid #007bff"
                      : "1px solid transparent",
                }}
              >
                <label
                  htmlFor={`brand-${brand._id}`}
                  className="d-flex align-items-center"
                  style={{
                    cursor: selectedBrand === brand._id ? "default" : "pointer",
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
                    style={{ marginRight: "8px" }}
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
