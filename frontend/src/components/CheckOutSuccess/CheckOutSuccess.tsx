'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { getAllOrders, sendOrderConfirmationEmail } from '@/services/client';
import { formatCurrency } from '@/utils/currencyFormatter';
import { useUserStore } from '@/stores';

const CheckOutSuccess: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy trạng thái người dùng từ Zustand
  const { user } = useUserStore();

  // Lấy orderCode từ query parameter
  const orderCode = searchParams.get('orderCode');
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!orderCode) {
      router.push('/'); // Điều hướng về trang chủ nếu không có orderCode
      return;
    }

    // Gọi API để lấy chi tiết đơn hàng bằng orderCode
    const fetchOrderData = async () => {
      try {
        const result = await getAllOrders(1, 10, orderCode); // Gọi API với orderCode
        if (result.payload && result.payload.content && result.payload.content.length > 0) {
          const order = result.payload.content[0]; // Lấy dữ liệu từ content[0]
          setOrderData(order); // Lưu thông tin chi tiết đơn hàng vào state
        } else {
          console.error('Order not found or invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();

    const handleSendEmail = async () => {
      try {
        const result = await sendOrderConfirmationEmail(orderCode);
        console.log('Email confirmation sent successfully:', result);
      } catch (error) {
        console.error('Failed to send order confirmation email:', error);
      }
    };
    handleSendEmail();
  }, [orderCode, router]);

  if (!orderData) return null;

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px',
      }}
    >
      <div
        style={{
          gridColumn: 'span 2',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          padding: '24px',
        }}
      >
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src="/img/checkout.png"
            alt="Checkout Success"
            style={{ width: '48px', height: '48px', marginRight: '16px' }}
          />
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#38a169' }}>
              Đơn hàng đã được đặt, cảm ơn!
            </h2>
            <p>
              <strong>Mã đơn hàng: </strong>
              {orderData.code}
            </p>
            <p>Email xác nhận đã được gửi tới {orderData.addressBook.email}!</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Thông tin của bạn
            </h3>
            <p>
              <strong>Tên:</strong> {orderData.addressBook.recipientName}
            </p>
            <p>
              <strong>Email:</strong> {orderData.addressBook.email}
            </p>
            <p>
              <strong>Điện thoại:</strong> {orderData.addressBook.phoneNumber}
            </p>
          </div>
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Thông tin thanh toán
            </h3>
            <p>
              <strong>Phương thức thanh toán:</strong> {orderData.paymentMethod}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginTop: '24px',
          }}
        >
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600' }}>Địa chỉ giao hàng</h4>
            <p>
              {orderData.addressBook.address}, {orderData.addressBook.ward},{' '}
              {orderData.addressBook.district}, {orderData.addressBook.city}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          padding: '24px',
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
          Tóm tắt đơn hàng
        </h3>

        {orderData.orderDetails.map((item: any, index: number) => {
          const defaultImageUrl =
            item.product.images.find((img: any) => img.isDefault)?.imageUrl ||
            'URL của ảnh mặc định';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <img
                src={defaultImageUrl}
                alt={item.product.productName}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <div style={{ flex: '1', marginLeft: '16px' }}>
                <p style={{ fontWeight: '600' }}>{item.product.productName}</p>
                <p>Số lượng: {item.quantity}</p>
                <p>Lựa chọn: {item.productVariation?.attributeValue || 'Không có'}</p>
              </div>
              <p style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.quantity)}</p>
            </div>
          );
        })}

        <div style={{ marginTop: '24px' }}>
          {/* Tổng tiền trước khi giảm giá (tăng thêm 20%) */}
          <p
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
            }}
          >
            <span>Tổng tiền:</span>{' '}
            <span>{formatCurrency(orderData.totalPrice / (1 - orderData.discount / 100))}</span>
          </p>

          {/* Giảm giá nếu có */}
          {orderData.discount > 0 ? (
            <p
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
              }}
            >
              <span>Giảm giá:</span>{' '}
              <span>
                -{' '}
                {formatCurrency(
                  (orderData.totalPrice / (1 - orderData.discount / 100)) *
                    (orderData.discount / 100)
                )}
              </span>
            </p>
          ) : (
            <p
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
              }}
            >
              <span>Giảm giá:</span> <span>Không có</span>
            </p>
          )}

          {/* Tổng đơn hàng (sau khi giảm giá) */}
          <p
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: '700',
              marginTop: '16px',
            }}
          >
            <span>Tổng đơn hàng:</span> <span>{formatCurrency(orderData.totalPrice)}</span>
          </p>
        </div>

        {user && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={() => router.push('/history')}
              style={{
                backgroundColor: '#0060c9',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                border: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0060c9')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0060c9')}
            >
              Xem lịch sử đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutSuccess;
