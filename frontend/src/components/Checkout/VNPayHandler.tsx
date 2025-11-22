'use client';

import {
  createOrder,
  fetchCurrentUser,
  handleVNPayPaymentReturn,
  markVoucherAsUsed,
} from '@/services/client';
import { useCartStore, useUserStore } from '@/stores';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export default function VNPayHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user } = useUserStore();

  const handlePaymentSubmit = useCallback(
    async (method: string, orderCode: string) => {
      try {
        let currentUser = user;
        if (!currentUser?.id) {
          try {
            currentUser = await fetchCurrentUser();
          } catch (error) {
            toast.error('Không thể xác thực người dùng. Vui lòng đăng nhập lại.');
            router.push('/');
            return;
          }
        }

        const selectedAddressBookId = localStorage.getItem('selectedAddressBookId');

        if (!selectedAddressBookId) {
          throw new Error('Không tìm thấy địa chỉ giao hàng.');
        }

        const storedVoucher = localStorage.getItem('voucher');
        let voucherId: string | null = null;
        let discount = 0;

        if (storedVoucher) {
          const voucher = JSON.parse(storedVoucher);
          voucherId = voucher.id;
          discount = voucher.discount;
        }

        await createOrder(cart, method, orderCode, selectedAddressBookId, discount, currentUser.id);
        toast.success('Đặt hàng thành công');

        if (voucherId) {
          await markVoucherAsUsed(voucherId);
          toast.success('Mã giảm giá đã được sử dụng');
          localStorage.removeItem('voucher');
        }

        clearCart();
        localStorage.removeItem('selectedAddressBookId');

        router.push(`/checkoutsuccess?orderCode=${orderCode}`);
      } catch (error: any) {
        console.error('Error creating order:', error);
        const errorMessage = error?.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng.';
        toast.error(errorMessage);
        router.push('/');
      }
    },
    [cart, clearCart, router, user]
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(searchParams.toString());

    if (queryParams.toString().length === 0) {
      return;
    }

    const requestParams = Object.fromEntries(queryParams.entries());

    handleVNPayPaymentReturn(requestParams)
      .then((response) => {
        const { status, message } = response;

        switch (status) {
          case 'SUCCESS': {
            const orderCode = queryParams.get('vnp_OrderInfo') || '';
            handlePaymentSubmit('VNPay', orderCode);
            break;
          }
          case 'FAILED':
            toast.error(message || 'Giao dịch thất bại.');
            router.push('/');
            break;
          case 'INVALID':
            toast.error(message || 'Giao dịch không hợp lệ.');
            router.push('/');
            break;
          default:
            toast.error(message || 'Lỗi không xác định.');
            router.push('/');
            break;
        }
      })
      .catch((error) => {
        console.error('Error handling VNPay payment return:', error);
        toast.error('Lỗi xử lý thanh toán VNPay.');
        router.push('/');
      });
  }, [handlePaymentSubmit, router, searchParams]);

  return <div>Đang xử lý thanh toán...</div>;
}
