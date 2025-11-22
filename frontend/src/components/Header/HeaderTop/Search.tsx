'use client';

import Rating from '@/components/Other/Rating';
import { getAllProducts } from '@/services/client';
import { formatCurrency } from '@/utils/currencyFormatter'; // Import hàm formatCurrency
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Product } from '@/services/types';

const Search = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [searchValue, setSearchValue] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]); // Lưu danh sách sản phẩm tìm được
  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const [showCloseBtn, setShowCloseBtn] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Nếu giá trị tìm kiếm trống hoặc null, ẩn kết quả tìm kiếm
    if (!value.trim()) {
      setShowSearchResult(false);
      setShowCloseBtn(false);
      setShowSpinner(false);
      return;
    }

    setShowSpinner(true);
    setShowSearchResult(false);
    setShowCloseBtn(false);

    try {
      const response = await getAllProducts(value, null, null, 1, 10); // Gọi API tìm kiếm sản phẩm
      setProducts(response.content || (response.payload as any).content); // Lưu kết quả tìm kiếm vào state
      setShowSearchResult(true);
      setShowCloseBtn(true);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleCloseBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowSearchResult(false);
    setSearchValue('');
    setShowCloseBtn(false);
  };

  const closeSearchUnder992 = () => {
    if (isClient && window.innerWidth < 992) {
      setShowSearchResult(false);
    }
  };

  return (
    <div className="relative">
      {/* ======= search-form ======= */}
      <form className="flex" onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
        <input
          type="text"
          value={searchValue}
          placeholder="Nhập từ khóa..."
          onChange={handleChange}
          className="bg-white rounded-l-[4px] w-full text-black h-10.5 border-none"
        />
        <button
          style={{ width: '180px' }}
          type="submit"
          className="max-w-32.5 px-6 text-sm text-white border-none font-bold rounded-r-[4px] bg-red-800"
        >
          Tìm kiếm
        </button>
        <button
          type="button"
          className="absolute right-28 top-2.5 hidden"
          onClick={() => setShowSearchResult(false)}
        >
          ✕
        </button>
        <button
          type="button"
          className={showCloseBtn ? 'absolute right-28 top-2.5' : 'hidden'}
          onClick={handleCloseBtnClick}
        >
          ✕
        </button>
        <div className={showSpinner ? 'absolute right-28 top-3 inline-block' : 'hidden'}></div>
      </form>
      {/* ======= search-result ======= */}
      <div
        className={
          showSearchResult
            ? 'absolute w-full p-5 bg-white border border-primary z-dropdown'
            : 'hidden'
        }
      >
        {products.length > 0 ? (
          <div className="max-h-400px min-h-30 overflow-y-auto">
            {products.map((product: Product, index: number) => {
              const defaultImage = product.images?.find((image: any) => image.isDefault)?.imageUrl;

              // Tính giá sau khi giảm nếu có discount
              const discountPrice =
                product.discount && product.discount > 0
                  ? product.price - (product.price * product.discount) / 100
                  : product.price;

              return (
                <div key={index} className="flex items-center py-4 border-b border-primary">
                  <div className="h-[55px]">
                    <img src={defaultImage} alt={product.productName} />
                  </div>
                  <div className="pl-6">
                    <Link
                      href={`/products/${product.id}`}
                      onClick={() => {
                        setShowSearchResult(false);
                        setShowCloseBtn(false);
                        setSearchValue('');
                        closeSearchUnder992();
                      }}
                      className="no-underline transition-all duration-300 ease hover:text-primary"
                    >
                      <h6 className="text-sm font-normal m-0">{product.productName}</h6>
                    </Link>
                    <div className="inline-block">
                      <Rating value={product.avgRating || 0} />
                    </div>

                    <div className="product-price">
                      {product.discount ? (
                        <div className="flex items-center">
                          {/* Giá gốc gạch ngang */}
                          <p className="m-0 text-gray-500 line-through mr-2.5">
                            {formatCurrency(product.price)}
                          </p>
                          {/* Giá sau khi giảm */}
                          <p className="m-0 text-primary font-bold">
                            {formatCurrency(discountPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="m-0 font-bold">{formatCurrency(product.price)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="my-2 text-sm">Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
