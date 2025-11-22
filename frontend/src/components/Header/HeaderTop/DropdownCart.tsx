import React from 'react';
import Link from 'next/link';
import {
  useCartStore,
  useUIStore,
  useUserStore,
  useProductsStore,
  useWishlistStore,
  useCompareStore,
} from '@/stores';
import { CartItem } from '@/stores/cartStore';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/currencyFormatter'; // Hàm format tiền tệ

const DropdownCart = () => {
  const { cart, removeFromCart } = useCartStore();
  const { showOrHideDropdownCart, toggleDropdownCart } = useUIStore();
  const { user } = useUserStore();
  const { makeIsInCartFalse } = useProductsStore();
  const { makeWishlistProductIsInCartFalse } = useWishlistStore();
  const { makeCompareProductIsInCartFalse } = useCompareStore();
  const showOrHideDropdCart = showOrHideDropdownCart;

  // Tính giá sau khi áp dụng discount cho từng sản phẩm
  const calculateDiscountedPrice = (product: CartItem) => {
    const priceToUse = product.selectedPrice || product.price; // Sử dụng selectedPrice nếu có, nếu không thì sử dụng price gốc
    const discountedPrice = product.discount
      ? priceToUse * (1 - product.discount / 100)
      : priceToUse;
    return discountedPrice;
  };

  // Tính tổng giá trị của giỏ hàng (subtotal)
  const totalPrice = cart.reduce(
    (total: number, product: CartItem) =>
      (total += calculateDiscountedPrice(product) * product.count),
    0
  );

  const closeDropdownCart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    toggleDropdownCart();
  };

  // Hàm xử lý khi nhấn nút "Thanh toán"
  const handleCheckout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      // Show toast warning, but let navigation proceed and rely on proxy.ts
      toast.warning('Bạn cần đăng nhập tài khoản để mua hàng');
    }
  };

  return (
    <div
      className={
        showOrHideDropdCart ? 'dropdownCart-wrapper show-dropdownCart' : 'dropdownCart-wrapper'
      }
    >
      <div className="dropdownCart">
        {cart.length > 0 ? (
          <>
            {/* ======= Bảng giỏ hàng ======= */}
            <table>
              <tbody className="table-body">
                {cart.map((product: CartItem, index: number) => (
                  <tr key={index}>
                    <td>
                      {/* ======= Nút xoá ======= */}
                      <div className="remove-btn">
                        <button
                          type="button"
                          className="pr-4 text-base transition-(--transition-normal) hover:text-red-600"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            removeFromCart(product.id);
                            makeIsInCartFalse(product.id as string);
                            makeWishlistProductIsInCartFalse(product.id);
                            makeCompareProductIsInCartFalse(product.id);
                            toast.error('"' + product.productName + '" đã được xoá khỏi giỏ hàng.');
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                    <td>
                      {/* ======= Hình ảnh sản phẩm ======= */}
                      <div className="product-img">
                        <Link
                          href={`/products/${product.id}`}
                          onClick={closeDropdownCart}
                          className="no-underline"
                        >
                          <div className="img-wrapper h-[65px] w-[45px]">
                            <img
                              className="w-full h-full object-cover"
                              src={product.images && product.images[0]?.imageUrl}
                              alt={product.productName}
                            />
                          </div>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <ul className="flex flex-col items-start p-0 m-0">
                        {/* ======= Tên sản phẩm ======= */}
                        <li>
                          <h6 className="product-title m-0">
                            <Link
                              href={`/products/${product.id}`}
                              onClick={closeDropdownCart}
                              className="text-red-400 no-underline text-sm"
                            >
                              {product.productName}
                            </Link>
                          </h6>
                        </li>
                        {/* ======= Biến thể đã chọn ======= */}
                        <li>
                          <small className="text-gray-500">
                            Lựa chọn:{' '}
                            {product.selectedAttribute ? product.selectedAttribute : 'Không có'}
                          </small>
                        </li>
                        {/* ======= Số lượng và giá ======= */}
                        <li className="count-and-price">
                          <small className="flex">
                            <p className="total-price price flex items-center m-0">
                              <span>
                                {/* Hiển thị giá sau khi đã áp dụng giảm giá */}
                                {formatCurrency(calculateDiscountedPrice(product), 'VND')} đ
                              </span>
                            </p>
                            <span className="multiplication mx-1.25">×</span>
                            <span className="book-count">{product.count}</span>
                          </small>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ======= Tổng tiền (subtotal) ======= */}
            <div className="total-area border-t border-gray-300 mt-7.5 pt-3.5">
              <div className="top-content flex justify-between pb-3.5">
                <h6 className="font-semibold text-lg m-0">Tổng cộng</h6>
                <p className="font-semibold text-lg m-0">
                  <span>{formatCurrency(totalPrice, 'VND')} đ</span>
                </p>
              </div>
              <div className="links flex items-center justify-between">
                <div className="view-cart-btn text-center">
                  <Link
                    href="/cart"
                    onClick={closeDropdownCart}
                    className="inline-block bg-transparent border-2 border-red-600 text-red-600 py-2.5 px-8.75 text-center no-underline transition-(--transition-normal) hover:bg-red-600 hover:text-white"
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
                <div className="checkout-btn flex">
                  <Link
                    href="/checkout"
                    className="bg-red-600 text-white py-2.5 px-8.75 text-center no-underline transition-(--transition-normal) hover:bg-red-700 w-full"
                    onClick={(e) => {
                      handleCheckout(e);
                      closeDropdownCart(e); // Đóng dropdown sau khi nhấn Thanh Toán
                    }}
                  >
                    Thanh toán
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ======= Thông báo giỏ hàng trống ======= //
          <div className="empty-cart">
            <div className="alert-text text-center">
              <p className="paragraph mb-1 text-sm">Giỏ hàng hiện đang trống.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownCart;
