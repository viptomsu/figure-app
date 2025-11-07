'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import { VscChevronRight } from 'react-icons/vsc';
import { useUIStore } from '@/stores';
import { getAllCategories } from '@/services/client'; // Import hàm gọi API

const Department: React.FC = () => {
  const { setShowSidebarCategories } = useUIStore();
  const [categories, setCategories] = useState<any[]>([]); // State để lưu dữ liệu danh mục
  const [loading, setLoading] = useState<boolean>(true); // State để kiểm tra trạng thái loading

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(1, 1000); // Gọi API với page=1, size=1000
        setCategories(data.content); // Cập nhật state với dữ liệu danh mục
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false); // Kết thúc loading dù thành công hay lỗi
      }
    };

    fetchCategories();
  }, []);

  const handleCloseCategories = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => {
    setShowSidebarCategories(false);
  };

  if (loading) {
    return <div>Đang tải danh mục...</div>; // Hiển thị trạng thái loading
  }

  return (
    <div className="department flex items-center justify-between h-full w-full max-w-65 cursor-pointer relative">
      <div className="icon">
        <span>
          <GiHamburgerMenu color="#ffffff" />
        </span>
      </div>

      <div className="text pl-3" style={{ color: '#ffffff' }}>
        <h6 className="font-semibold m-0">Danh mục sản phẩm</h6>
      </div>
      <div className="title" style={{ color: '#ffffff' }}>
        <h6>Danh mục sản phẩm</h6>
        <button type="button" onClick={handleCloseCategories}>
          ✕
        </button>
      </div>
      {/* ===== Departments ===== */}
      <ul
        className="departments"
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          scrollbarWidth: 'thin', // Dành cho Firefox
          scrollbarColor: '#cccccc transparent',
        }}
      >
        {categories.map((item: any) =>
          item.submenu ? (
            <li key={item.categoryId} className="relative w-full transition-(--transition-normal)">
              <Link
                href="/shop"
                onClick={handleCloseCategories}
                className="flex justify-between w-full text-black block py-2.5 no-underline"
              >
                <p className="m-0 p-0">
                  <span>
                    {/* Nếu cần, hiển thị biểu tượng hoặc hình ảnh tại đây */}
                    <img src={item.image} alt={item.categoryName} className="w-6 h-6" />
                  </span>{' '}
                  {item.categoryName}
                </p>
                <span className="right-arrow">
                  <VscChevronRight />
                </span>
              </Link>
              {/* Thêm logic submenu nếu có */}
            </li>
          ) : (
            <li key={item._id} className="relative w-full transition-(--transition-normal)">
              <Link
                href={`/shop?category=${item.categoryId}`}
                onClick={handleCloseCategories}
                className="text-black block w-full py-2.5 no-underline"
              >
                <span>
                  {/* Hiển thị hình ảnh danh mục */}
                  <img src={item.image} alt={item.categoryName} className="w-6 h-6" />
                </span>{' '}
                {item.categoryName}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Department;
