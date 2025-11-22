'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiArrowNarrowLeft } from 'react-icons/hi';
import { formatCurrency } from '@/utils/currencyFormatter';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import {
  createOrder,
  checkVoucher,
  markVoucherAsUsed,
  createVNPayPayment,
} from '@/services/client';
import { useCartStore, useUserStore } from '@/stores';

import { CartItem } from '@/stores/cartStore';
import { AddressBook } from '@/services/types';

interface PaymentProps {
  cart: CartItem[];
  back: () => void;
  handlePaymentSubmit: () => void;
  selectedAddress: AddressBook;
  setOrderCode: (code: string) => void;
}

const Payment = (props: PaymentProps) => {
  const { clearCart } = useCartStore();
  const { user } = useUserStore();
  const router = useRouter(); // Sử dụng useRouter cho Next.js
  const [showCodContent, setShowCodContent] = useState<boolean>(true);
  const [showPaypalContent, setShowPaypalContent] = useState<boolean>(false);
  const [showVNPayContent, setShowVNPayContent] = useState<boolean>(false); // Thêm state cho VNPay
  const [voucherCode, setVoucherCode] = useState<string>(''); // State để lưu mã voucher
  const [discount, setDiscount] = useState<number>(0); // State để lưu giá trị giảm giá
  const [voucherMessage, setVoucherMessage] = useState<string>(''); // State để lưu thông báo mã voucher
  const [voucherId, setVoucherId] = useState<number | null>(null); // Thêm state để lưu voucherId
  const { cart } = props;

  // Giả định tỉ lệ chuyển đổi từ VND sang USD
  const exchangeRate = 24000; // 1 USD = 24,000 VND
  const generateOrderCode = (): string => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Tạo mã 8 số ngẫu nhiên
    return `ORD${randomNumber}`;
  };
  const calculateDiscountedPrice = (product: CartItem) => {
    const priceToUse = product.selectedPrice ? product.selectedPrice : product.price;
    const discountedPrice = product.discount
      ? priceToUse - (priceToUse * product.discount) / 100
      : priceToUse;
    return discountedPrice;
  };

  const handleVNPayPayment = async () => {
    try {
      const orderCode = generateOrderCode();
      const finalPrice = discount ? discountedPrice : totalPriceVND;
      // Gọi API tạo thanh toán VNPay
      const response = await createVNPayPayment(finalPrice, orderCode, document.location.origin);

      if (response) {
        // Điều hướng tới URL thanh toán VNPay trả về
        window.location.href = response; // Điều hướng người dùng tới trang thanh toán
      } else {
        toast.error('Lỗi tạo thanh toán VNPay');
      }
    } catch (error) {
      console.error('Error creating VNPay payment:', error);
      toast.error('Lỗi khi tạo thanh toán VNPay.');
    }
  };

  const handlePaymentSubmit = async (method: string) => {
    try {
      if (!user?.id) {
        toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const orderCode = generateOrderCode();
      const response = await createOrder(
        cart,
        method,
        orderCode,
        props.selectedAddress.id,
        discount,
        user.id
      );
      props.setOrderCode(orderCode);
      toast.success('Đặt hàng thành công');

      // Nếu có voucher, gọi API đánh dấu mã đã sử dụng
      if (voucherId) {
        await markVoucherAsUsed(voucherId);
        toast.success('Mã giảm giá đã được sử dụng');
        localStorage.removeItem('voucher');
      }

      router.push('/checkoutsuccess?orderCode=' + orderCode);
      clearCart();
    } catch (error: any) {
      console.error('Error creating order:', error);
      const errorMessage = error?.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng.';
      toast.error(errorMessage);
    }
  };
  const handleApplyVoucher = async () => {
    try {
      const response = await checkVoucher(voucherCode);
      if (response?.payload) {
        const { discount, isUsed, _id } = response.payload; // Lưu voucherId

        if (isUsed) {
          setVoucherMessage('Mã giảm giá đã được sử dụng.');
        } else {
          setDiscount(discount);
          setVoucherMessage(
            `Đã áp dụng mã giảm giá, bạn tiết kiệm được ${formatCurrency(
              (totalPriceVND * discount) / 100
            )}!`
          );
          setVoucherId(_id); // Lưu voucherId vào state

          // Lưu toàn bộ response.payload vào localStorage với tên 'voucher'
          localStorage.setItem('voucher', JSON.stringify(response.payload));
        }
      }
    } catch (error) {
      setVoucherMessage('Mã giảm giá không hợp lệ.');
      console.error('Error applying voucher:', error);
    }
  };

  const handleRemoveVoucher = () => {
    setDiscount(0);
    setVoucherId(null);
    setVoucherCode('');
    localStorage.removeItem('voucher');
    setVoucherMessage('Voucher đã được loại bỏ.');
  };

  const totalPriceVND = cart.reduce(
    (total, product) => total + calculateDiscountedPrice(product) * product.count,
    0
  );

  const discountedPrice = totalPriceVND - (totalPriceVND * discount) / 100;

  // Chuyển đổi từ VND sang USD
  const totalPriceUSD = discountedPrice / exchangeRate;

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold mt-5">Thanh toán</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-5 shadow-sm mb-5">
            <h5 className="text-lg font-semibold mb-2.5">Áp dụng mã giảm giá</h5>
            <input
              type="text"
              placeholder="Nhập mã giảm giá"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-2.5 text-base"
            />
            <div className="flex gap-2.5">
              <button
                type="button"
                className="h-12.5 px-7.5 bg-primary text-white font-semibold text-base rounded transition-all duration-300 hover:bg-red-700"
                onClick={handleApplyVoucher}
              >
                Áp dụng Voucher
              </button>
              {discount && (
                <button
                  type="button"
                  className="h-12.5 px-7.5 bg-black text-white font-semibold text-base rounded transition-all duration-300 hover:bg-gray-800"
                  onClick={handleRemoveVoucher}
                >
                  Không dùng voucher
                </button>
              )}
            </div>
            <p className={`mt-2.5 ${discount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {voucherMessage}
            </p>
          </div>

          <form>
            <div>
              <h5 className="text-lg font-semibold mb-4">Phương thức thanh toán</h5>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    checked={showCodContent === true}
                    onChange={() => {
                      setShowCodContent(true);
                      setShowPaypalContent(false);
                      setShowVNPayContent(false);
                    }}
                    className="mr-3"
                  />
                  <label htmlFor="cod" className="font-bold text-lg">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="paypalMethod"
                    checked={showPaypalContent === true}
                    onChange={() => {
                      setShowCodContent(false);
                      setShowPaypalContent(true);
                      setShowVNPayContent(false);
                    }}
                    className="mr-3"
                  />
                  <label htmlFor="paypalMethod" className="font-bold text-lg">
                    PayPal
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="vnpayMethod"
                    checked={showVNPayContent === true}
                    onChange={() => {
                      setShowCodContent(false);
                      setShowPaypalContent(false);
                      setShowVNPayContent(true);
                    }}
                    className="mr-3"
                  />
                  <label htmlFor="vnpayMethod" className="font-bold text-lg">
                    VNPay
                  </label>
                </div>
                <div className="mt-6">
                  {/* === COD === */}
                  {showCodContent && (
                    <div>
                      <button
                        type="button"
                        className="h-12.5 px-7.5 bg-primary text-white font-semibold text-base rounded transition-all duration-300 hover:bg-red-700"
                        onClick={() => handlePaymentSubmit('COD')}
                      >
                        Thanh toán khi nhận hàng
                      </button>
                    </div>
                  )}

                  {/* === Paypal === */}
                  {showPaypalContent && (
                    <PayPalScriptProvider
                      options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                          if (actions && actions.order) {
                            return actions.order.create({
                              intent: 'CAPTURE',
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: 'USD',
                                    value: totalPriceUSD.toFixed(2),
                                  },
                                },
                              ],
                            });
                          }
                          return Promise.reject(new Error('Order creation failed'));
                        }}
                        onApprove={async (data, actions) => {
                          if (actions && actions.order) {
                            try {
                              const details = await actions.order.capture();
                              const givenName = details?.payer?.name?.given_name || 'Khách hàng';
                              handlePaymentSubmit('Paypal');
                              toast.success(`Giao dịch thành công! Xin chào, ${givenName}`);
                            } catch (error) {
                              console.error('Lỗi khi hoàn thành thanh toán:', error);
                              toast.error('Lỗi khi hoàn thành thanh toán.');
                            }
                          } else {
                            return Promise.reject(new Error('Order capture failed'));
                          }
                        }}
                        onError={(err) => {
                          console.error('Lỗi khi thanh toán PayPal:', err);
                          toast.error('Lỗi khi thanh toán PayPal.');
                        }}
                      />
                    </PayPalScriptProvider>
                  )}

                  {/* === VNPay === */}
                  {showVNPayContent && (
                    <button
                      type="button"
                      className="h-12.5 px-7.5 bg-primary text-white font-semibold text-base rounded transition-all duration-300 hover:bg-red-700"
                      onClick={handleVNPayPayment}
                    >
                      Thanh toán qua VNPay
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h6 className="font-semibold">SẢN PHẨM</h6>
              <h6 className="font-semibold">TỔNG</h6>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <ul className="space-y-3">
                {cart.map((product) => (
                  <li key={product.id} className="flex justify-between">
                    <div>
                      <Link href={`/products/${product.id}`}>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-600">
                          Số lượng: <span>{product.count}</span>
                        </p>
                      </Link>
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatCurrency(calculateDiscountedPrice(product) * product.count)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <h6 className="font-semibold">TẠM TÍNH</h6>
                <p>{formatCurrency(totalPriceVND)}</p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <h6 className="font-semibold">GIẢM GIÁ</h6>
                  <p>- {formatCurrency((totalPriceVND * discount) / 100)}</p>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <h6 className="text-lg font-bold">TỔNG</h6>
                <p className="text-primary font-bold text-lg">{formatCurrency(discountedPrice)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          type="button"
          className="flex items-center text-gray-700 hover:text-primary transition-colors"
          onClick={() => props.back()}
        >
          <HiArrowNarrowLeft className="mr-2" />
          <p>Quay lại bước vận chuyển</p>
        </button>
      </div>
    </div>
  );
};

export default Payment;
