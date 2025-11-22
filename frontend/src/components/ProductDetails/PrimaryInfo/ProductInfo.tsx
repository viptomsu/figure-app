'use client';

import { Product, ProductVariation } from '@/services/types';
import { useState } from 'react';
import { BsHeart } from 'react-icons/bs';
import { FiBarChart2 } from 'react-icons/fi';
import { toast } from 'sonner';
import { useCartStore, useCompareStore, useWishlistStore } from '@/stores';
import { formatCurrency } from '@/utils/currencyFormatter';
import Rating from '../../Other/Rating';

interface ProductInfoProps {
  product: Product & {
    isInCart?: boolean;
    isInWishlist?: boolean;
    isInCompare?: boolean;
    reviewCount?: number;
    category?: { categoryName: string };
    brand?: { brandName: string };
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(
    product?.variations ? product?.variations[0] : null
  ); // Biến thể được chọn mặc định là cái đầu tiên

  const { cart, addToCart, makeIsInCartTrue } = useCartStore();
  const { wishlist, addToWishlist } = useWishlistStore();
  const { compare, addToCompare } = useCompareStore();

  cart.map((cartProduct) => cartProduct.id === product.id && (product.isInCart = true));
  wishlist.map(
    (wishlistProduct) => wishlistProduct.id === product.id && (product.isInWishlist = true)
  );
  compare.map((compareProduct) => compareProduct.id === product.id && (product.isInCompare = true));

  // Xử lý khi chọn biến thể
  const handleVariationChange = (variation: ProductVariation) => {
    setSelectedVariation(variation);
  };

  const displayedPrice = selectedVariation?.price
    ? selectedVariation.price * (1 - (product.discount || 0) / 100) // Nếu có biến thể, tính theo giá biến thể và discount
    : product.price
      ? product.price * (1 - (product.discount || 0) / 100)
      : 0; // Nếu không có biến thể, tính theo giá sản phẩm và discount

  // Group variations by attributeName
  const groupedVariations =
    product?.variations?.reduce(
      (acc, variation) => {
        if (!acc[variation.attributeName]) {
          acc[variation.attributeName] = [];
        }
        acc[variation.attributeName].push(variation);
        return acc;
      },
      {} as Record<string, ProductVariation[]>
    ) || {};

  return (
    <div className="pr-12.5">
      {/* ===== Tiêu đề và xếp hạng ===== */}
      <div>
        <h5 className="text-2xl font-medium mb-2">{product?.productName}</h5>
        <div className="flex items-center gap-2">
          <Rating value={product?.avgRating || 0} />
          <small className="text-gray-600 text-sm">({product?.reviewCount} đánh giá)</small>
        </div>
      </div>

      <div className="mt-4">
        <div>
          {/* Nếu có discount và có giá cũ (từ selectedVariation hoặc product.price), hiển thị giá cũ */}
          {(selectedVariation?.price || product?.price) && product?.discount && (
            <div className="flex items-center">
              <del className="text-gray-500">
                {formatCurrency(selectedVariation?.price ?? product.price ?? 0)}
              </del>
            </div>
          )}

          {/* Hiển thị giá mới sau khi đã tính discount */}
          <p className="text-primary text-xl font-bold mt-1">
            {formatCurrency(
              selectedVariation?.price
                ? displayedPrice
                : product?.discount
                  ? product.price * (1 - product.discount / 100)
                  : product.price
            )}
          </p>
        </div>
      </div>

      {/* ===== Biến thể (Variations) ===== */}
      <div className="mt-4">
        {/* Render variations grouped by attributeName */}
        {Object.keys(groupedVariations).map((attributeName) => (
          <div key={attributeName} className="mt-3">
            <p className="font-semibold">{attributeName}:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {groupedVariations[attributeName].map((variation) => (
                <div
                  key={variation.id}
                  className={`px-2.5 py-2 rounded border text-center cursor-pointer transition-all duration-300 ${
                    selectedVariation?.id === variation.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  onClick={() => handleVariationChange(variation)}
                >
                  <p className="text-sm">{variation.attributeValue}</p>
                </div>
              ))}
            </div>
            {/* Divider between different attribute groups */}
            <hr className="w-full my-2.5" />
          </div>
        ))}
      </div>

      {/* ===== Số lượng và nút thêm vào giỏ hàng ===== */}
      <div className="mt-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center border border-gray-300 rounded">
            <button className="px-3 py-2" disabled>
              −
            </button>
            <input
              type="text"
              readOnly
              value={1}
              className="w-12 text-center border-x border-gray-300 py-2"
            />
            <button className="px-3 py-2" disabled>
              +
            </button>
          </div>
          <div>
            {/* Nút thêm vào giỏ hàng */}
            <button
              type="button"
              className="bg-primary text-white px-6 py-2.5 rounded hover:bg-red-700 transition-all duration-300"
              title="Thêm vào giỏ hàng"
              onClick={() => {
                addToCart({
                  ...product,
                  count: 1,
                  isInCart: product.isInCart || false,
                  selectedAttribute: selectedVariation?.attributeValue, // Lưu giá trị biến thể được chọn
                  selectedPrice: selectedVariation?.price, // Lưu giá của biến thể được chọn
                });
                makeIsInCartTrue(product.id);
                toast.success(
                  '"' +
                    product.productName +
                    '" đã được thêm vào giỏ hàng' +
                    (selectedVariation?.attributeValue
                      ? ' với lựa chọn ' + selectedVariation?.attributeName
                      : '')
                );
              }}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="flex gap-2">
            <div>
              {product.isInWishlist ? (
                <button
                  type="button"
                  title="Đã thêm vào Wishlist"
                  className="bg-gray-400 text-white p-2 rounded cursor-not-allowed"
                  disabled
                >
                  <BsHeart />
                </button>
              ) : (
                <button
                  type="button"
                  title="Thêm vào Wishlist"
                  className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => {
                    addToWishlist(product);
                    toast.success('"' + product.productName + '" đã được thêm vào Wishlist.');
                  }}
                >
                  <BsHeart />
                </button>
              )}
            </div>
            <div>
              {product.isInCompare ? (
                <button
                  type="button"
                  title="Đã thêm vào so sánh"
                  className="bg-gray-400 text-white p-2 rounded cursor-not-allowed"
                  disabled
                >
                  <FiBarChart2 />
                </button>
              ) : (
                <button
                  type="button"
                  title="Thêm vào so sánh"
                  className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => {
                    addToCompare(product);
                    toast.success('"' + product.productName + '" đã được thêm vào so sánh.');
                  }}
                >
                  <FiBarChart2 />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SKU, Danh mục, Thương hiệu ===== */}
      <div className="mt-6 space-y-2">
        <div>
          <span className="text-sm font-medium">Còn lại:</span>
          <p className="text-sm">{product.stock} sản phẩm</p>
        </div>
        <div>
          <span className="text-sm font-medium">SKU:</span>
          <p className="text-sm">{product.id}</p>
        </div>
        <div>
          <span className="text-sm font-medium">Danh mục: {product.category?.categoryName}</span>
          <p></p>
        </div>
        <div>
          <span className="text-sm font-medium">Thương hiệu: {product.brand?.brandName}</span>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
