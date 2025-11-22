'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currencyFormatter'; // Hàm format tiền tệ
import { toast } from 'sonner';
import { useCartStore, useProductsStore, useWishlistStore, useCompareStore } from '@/stores';
import { CartItem } from '@/stores/cartStore';

interface CartTableProps {
  cart: CartItem[];
}

const CartTable = ({ cart }: CartTableProps) => {
  const [size] = useState<number>(1);

  const { removeFromCart, increaseProductCount, decreaseProductCount } = useCartStore();
  const { makeIsInCartFalse } = useProductsStore();
  const { makeWishlistProductIsInCartFalse } = useWishlistStore();
  const { makeCompareProductIsInCartFalse } = useCompareStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* ======= Tiêu đề bảng ======= */}
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-5 pl-5 font-semibold">Sản phẩm</th>
            <th className="text-center py-5 font-semibold">Giá</th>
            <th className="text-center py-5 font-semibold">Số lượng</th>
            <th className="text-center py-5 font-semibold">Tổng</th>
            <th className="text-center py-5 font-semibold">Xóa</th>
          </tr>
        </thead>
        {/* ======= Nội dung bảng ======= */}
        <tbody>
          {cart.map((product, index) => {
            // Tính giá sau khi giảm giá
            const discountedPrice = product.selectedPrice
              ? product.selectedPrice * (1 - (product.discount || 0) / 100)
              : product.price * (1 - (product.discount || 0) / 100);

            return (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-5">
                  <div className="flex items-center">
                    {/* ======= Ảnh sản phẩm ======= */}
                    <div className="w-25 h-25 mr-3.75">
                      <Link href={`/products/${product.id}`}>
                        <img
                          className="w-full h-full object-contain"
                          src={product.images?.[0]?.imageUrl || '/images/placeholder.png'}
                          alt={product.productName}
                        />
                      </Link>
                    </div>
                    {/* ======= Tên sản phẩm ======= */}
                    <div>
                      <h6>
                        <Link
                          className="text-primary hover:underline"
                          href={`/products/${product.id}`}
                        >
                          {product.productName}
                        </Link>
                      </h6>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  {/* ======= Giá sản phẩm ======= */}
                  {product.discount ? (
                    <div className="flex items-center justify-center">
                      {/* Giá gốc gạch ngang */}
                      <p className="m-0 text-gray-500 line-through mr-2.5">
                        {formatCurrency(product.selectedPrice || product.price, 'VND')} đ
                      </p>
                      {/* Giá sau khi giảm */}
                      <p className="m-0 text-primary font-bold">
                        {formatCurrency(discountedPrice, 'VND')} đ
                      </p>
                    </div>
                  ) : (
                    <p className="m-0 font-bold">
                      {formatCurrency(product.selectedPrice || product.price)}
                    </p>
                  )}
                </td>

                <td className="text-center">
                  {/* ======= Số lượng ======= */}
                  <div className="flex items-center justify-center">
                    {/* Nút giảm số lượng */}
                    <button
                      type="button"
                      onClick={() => {
                        if (product.count > 1) {
                          decreaseProductCount(String(product.id));
                        }
                      }}
                      disabled={product.count === 1}
                      className={`w-10 h-10 rounded border-none text-base ${
                        product.count === 1
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-yellow-400 cursor-pointer'
                      } transition-all duration-300`}
                    >
                      -
                    </button>

                    {/* Hiển thị số lượng sản phẩm */}
                    <input
                      type="text"
                      size={size}
                      readOnly
                      value={product.count}
                      className="w-12 text-center border-x border-gray-300 py-2"
                    />

                    {/* Nút tăng số lượng */}
                    <button
                      type="button"
                      onClick={() => {
                        if (product.count < product.stock) {
                          increaseProductCount(String(product.id));
                        } else {
                          toast.warning(`Bạn chỉ có thể mua tối đa ${product.stock} sản phẩm.`);
                        }
                      }}
                      disabled={product.count >= product.stock}
                      className={`w-10 h-10 rounded border-none text-white text-base ml-2.5 ${
                        product.count >= product.stock
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:bg-red-700'
                      } transition-all duration-300`}
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="text-center">
                  {/* ======= Tổng tiền ======= */}
                  <p className="m-0 font-bold">{formatCurrency(discountedPrice * product.count)}</p>
                </td>
                <td className="text-center">
                  {/* ======= Nút xóa ======= */}
                  <button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      removeFromCart(String(product.id));
                      makeIsInCartFalse(String(product.id));
                      makeWishlistProductIsInCartFalse(String(product.id));
                      makeCompareProductIsInCartFalse(String(product.id));
                      toast.error('"' + product.productName + '" đã được xoá khỏi giỏ hàng.');
                    }}
                    className="text-gray-500 hover:text-primary text-xl"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;
