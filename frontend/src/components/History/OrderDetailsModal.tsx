import React from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/currencyFormatter';
import { getOrderStatusVariant } from '@/utils/orderStatusHelper';

const OrderDetailsModal = NiceModal.create<{ order: any }>(({ order }) => {
  const modal = useModal();

  return (
    <Dialog
      open={modal.visible}
      onOpenChange={(open) => {
        if (!open) {
          modal.hide();
          setTimeout(() => modal.remove(), 300);
        }
      }}
    >
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Mã đơn hàng: {order.code}</h2>
          <div className="flex items-center gap-4">
            <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
          </div>
        </div>
        <p className="text-gray-600">{new Date(order.date).toLocaleString()}</p>

        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-2">Sản phẩm trong đơn hàng</h3>
          {order.orderDetails.map((item: any) => {
            const defaultImageUrl =
              item.product.images.find((img: any) => img.isDefault)?.imageUrl ||
              'URL của ảnh mặc định';

            return (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={defaultImageUrl}
                    alt={item.product.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{item.product.productName}</p>
                    <p className="text-sm text-gray-600">
                      Lựa chọn: {item.productVariation?.attributeValue || 'Không có'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">x{item.quantity}</p>
                  <p className="font-semibold">{formatCurrency(item.price)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-2">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between mb-2">
            <p>Tổng tiền</p>
            <p>{formatCurrency(order.totalPrice / (1 - order.discount / 100))}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Giảm giá</p>
            {order.discount ? (
              <p>
                -{' '}
                {formatCurrency(
                  (order.totalPrice / (1 - order.discount / 100)) * (order.discount / 100)
                )}
              </p>
            ) : (
              <p>Không có</p>
            )}
          </div>
          <div className="flex justify-between font-bold text-lg">
            <p>Tổng đơn hàng</p>
            <p>{formatCurrency(order.totalPrice)}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-2">Thông tin người nhận</h3>
          <div>
            <div>
              <p>
                <strong>Khách hàng:</strong> {order.addressBook.recipientName}
              </p>
              <p>
                <strong>Email:</strong> {order.addressBook.email}
              </p>
            </div>
            <div>
              <p>
                <strong>Số điện thoại:</strong>{' '}
                {order.addressBook.phoneNumber || 'Không có số điện thoại'}
              </p>
            </div>
            <div>
              <p>
                <strong>Địa chỉ:</strong> {order.addressBook.address}, {order.addressBook.ward},{' '}
                {order.addressBook.district}, {order.addressBook.city}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default OrderDetailsModal;
