'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner'; // Import toast để hiển thị thông báo
import { formatCurrency } from '@/utils/currencyFormatter';
import { useUserStore } from '@/stores';
import { CartItem } from '@/stores/cartStore';

interface CartTotalsProps {
  cart: CartItem[];
}

const CartTotals = ({ cart }: CartTotalsProps) => {
  // Lấy trạng thái người dùng từ Zustand
  const { user } = useUserStore();

  // Tính tổng giá ban đầu và tổng số tiền giảm giá
  const { totalPrice, totalDiscount } = cart.reduce(
    (acc, product) => {
      const originalPrice = product.selectedPrice || product.price;
      const discountAmount = originalPrice * ((product.discount || 0) / 100) || 0;
      acc.totalPrice += originalPrice * product.count;
      acc.totalDiscount += discountAmount * product.count;
      return acc;
    },
    { totalPrice: 0, totalDiscount: 0 }
  );

  // Tính tổng tiền cuối cùng sau khi giảm giá
  const finalTotal = totalPrice - totalDiscount;

  // Hàm xử lý khi nhấn vào Link
  const handleCheckout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      // Show toast warning, but let navigation proceed and rely on proxy.ts
      toast.warning('Bạn cần đăng nhập tài khoản để mua hàng');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div>
        {/* ======= Tiêu đề ======= */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Tổng giỏ hàng</h4>
        </div>
        {/* ======= Tổng giá ban đầu ======= */}
        <div className="flex justify-between items-center mb-2.5">
          <h6>Giá ban đầu</h6>
          <p>
            <span>{formatCurrency(totalPrice, 'VND')}</span>
          </p>
        </div>
        {/* ======= Số tiền giảm giá ======= */}
        <div className="flex justify-between items-center mb-2.5">
          <h6>Giảm giá</h6>
          <p>
            <span>-{formatCurrency(totalDiscount, 'VND')}</span>
          </p>
        </div>
        {/* ======= Tổng số tiền sau khi giảm giá ======= */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-2.5">
          <h5 className="text-lg font-semibold">Tổng tiền</h5>
          <p>
            <span className="text-primary font-bold">{formatCurrency(finalTotal, 'VND')}</span>
          </p>
        </div>
      </div>
      {/* ======= Nút thanh toán ======= */}
      <div className="mt-6">
        <Link
          href="/checkout"
          className="block w-full text-center bg-primary text-white py-3 rounded hover:bg-red-700 transition-all duration-300"
          onClick={handleCheckout}
        >
          Thanh toán
        </Link>
      </div>
    </div>
  );
};

export default CartTotals;
