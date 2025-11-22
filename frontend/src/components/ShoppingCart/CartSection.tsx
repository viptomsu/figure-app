'use client';

import React from 'react';
import CartTable from './CartTable';
import CartTotals from './CartTotals';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import Link from 'next/link';
import { useCartStore } from '../../stores';

const CartSection = () => {
  const { cart } = useCartStore();

  return (
    <section id="cart-section" className="py-22 pb-27.5">
      <div className="container">
        <div className="text-center pb-12.5">
          <h1>Giỏ hàng</h1>
        </div>
        {cart.length > 0 ? (
          <>
            <div className="w-full">
              {/* ======= Bảng giỏ hàng ======= */}
              <CartTable cart={cart} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div>
                {/* ======= Quay lại cửa hàng ======= */}
                <Link href="/shop" className="flex items-center">
                  <span>
                    <HiArrowNarrowLeft color="#ffffff" />
                  </span>
                  <p className="m-0 text-white">Quay lại</p>
                </Link>
              </div>
              <div>
                {/* ======= Tổng giỏ hàng ======= */}
                <CartTotals cart={cart} />
              </div>
            </div>
          </>
        ) : (
          // ======= Thông báo giỏ hàng trống ======= //
          <>
            <div className="text-center">
              <p>Giỏ hàng của bạn đang trống.</p>
            </div>
            <div className="mt-4">
              <Link href="/shop" className="flex items-center">
                <span>
                  <HiArrowNarrowLeft />
                </span>
                <p className="m-0">Quay lại</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartSection;
