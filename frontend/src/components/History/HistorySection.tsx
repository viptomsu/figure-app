'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import NiceModal from '@ebay/nice-modal-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import OrderDetailsModal from './OrderDetailsModal';
import { getOrdersForCurrentUser, updateOrderStatus } from '@/services/client';
import { formatCurrency } from '@/utils/currencyFormatter';
import { getOrderStatusVariant } from '@/utils/orderStatusHelper';

NiceModal.register('confirm-dialog', ConfirmDialog);

interface HistorySectionProps {
  initialOrders: any[];
  initialPagination: {
    page: number;
    totalPages: number;
    totalElements: number;
    limit: number;
  };
}

const HistorySection: React.FC<HistorySectionProps> = ({ initialOrders, initialPagination }) => {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const fetchUserOrders = async (currentPage = 1, limit = 5) => {
    setLoading(true);
    try {
      const result = await getOrdersForCurrentUser(currentPage, limit);
      const response = result.payload;

      if (!response) {
        throw new Error('Không có dữ liệu');
      }

      const content = response.content || [];
      const page = response.page || response.currentPage || 1;
      const totalPages = response.totalPages || 0;
      const totalElements = response.totalElements || response.totalItems || 0;

      if (currentPage > totalPages && totalPages > 0) {
        setPagination((prev) => ({ ...prev, page: totalPages }));
        return;
      }

      setOrders(content);
      setPagination({
        page,
        totalPages,
        totalElements,
        limit,
      });
    } catch (error: any) {
      toast.error('Không thể lấy thông tin đơn hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (
      pagination.page !== initialPagination.page ||
      pagination.limit !== initialPagination.limit
    ) {
      fetchUserOrders(pagination.page, pagination.limit);
    }
  }, [pagination.page, pagination.limit, initialPagination.page, initialPagination.limit]);

  const generateStatus = (status: string) => {
    const variant = getOrderStatusVariant(status);
    return <Badge variant={variant}>{status}</Badge>;
  };
  const handleCancelOrder = async (order: any) => {
    if (isConfirmDialogVisible) return;

    setIsConfirmDialogVisible(true);
    NiceModal.show('confirm-dialog', {
      title: 'Xác nhận huỷ đơn hàng',
      description: `Bạn có chắc chắn muốn huỷ đơn hàng ${order.code}?`,
      onConfirm: async () => {
        try {
          await updateOrderStatus(order.id, 'CANCELLED');
          toast.success('Đơn hàng đã được huỷ thành công');
          fetchUserOrders(pagination.page, pagination.limit);
        } catch (error) {
          toast.error('Không thể huỷ đơn hàng');
          throw error;
        } finally {
          setIsConfirmDialogVisible(false);
        }
      },
      onCancel: () => {
        setIsConfirmDialogVisible(false);
      },
      confirmText: 'Xác nhận',
      cancelText: 'Hủy',
      variant: 'destructive',
    });
  };

  const showOrderDetail = (order: any) => {
    NiceModal.show(OrderDetailsModal, { order });
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const getPageNumbers = () => {
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        'ellipsis',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages];
  };

  return (
    <div className="max-w-container mx-auto px-4">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người đặt hàng</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Không có đơn hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id || order.code}>
                    <TableCell>{order.addressBook.recipientName}</TableCell>
                    <TableCell>{`${order.addressBook.address}, ${order.addressBook.ward}, ${order.addressBook.district}, ${order.addressBook.city}`}</TableCell>
                    <TableCell>{order.addressBook.phoneNumber}</TableCell>
                    <TableCell>{order.addressBook.email}</TableCell>
                    <TableCell>{order.code}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell className="text-center">{generateStatus(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => showOrderDetail(order)}>
                          Xem chi tiết
                        </Button>
                        {order.status === 'PENDING' && (
                          <Button variant="destructive" onClick={() => handleCancelOrder(order)}>
                            Huỷ đơn hàng
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {orders.length > 0 && pagination.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
                    className={
                      pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum, index) =>
                  pageNum === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum as number)}
                        isActive={pagination.page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      pagination.page < pagination.totalPages &&
                      handlePageChange(pagination.page + 1)
                    }
                    className={
                      pagination.page === pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default HistorySection;
