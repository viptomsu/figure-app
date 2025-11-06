import React, { useState, useEffect } from "react";
import { message } from "antd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NiceModal from "@ebay/nice-modal-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import OrderDetailsModal from "./OrderDetailsModal";
import {
  getOrdersByUserId,
  updateOrderStatus,
} from "../../services/orderService";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useUserStore } from "../../stores";
import { getOrderStatusVariant } from "../../utils/orderStatusHelper";

NiceModal.register('confirm-dialog', ConfirmDialog);

const HistorySection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    limit: 5,
  });
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);

  // Lấy thông tin người dùng từ Zustand store
  const { user } = useUserStore();
  const fetchUserOrders = async (currentPage = 1, limit = 5) => {
    if (user && user.userId) {
      const userId = user.userId;
      setLoading(true);
      try {
        const { content, page, totalPages, totalElements } =
          await getOrdersByUserId(userId, currentPage, limit);

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
        message.error("Không thể lấy thông tin đơn hàng: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      message.warning("Không tìm thấy thông tin người dùng trong Redux");
    }
  };
  useEffect(() => {
    fetchUserOrders(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, user]);

  const generateStatus = (status: string) => {
    const variant = getOrderStatusVariant(status);
    return <Badge variant={variant}>{status}</Badge>;
  };
  const handleCancelOrder = async (order: any) => {
    if (isConfirmDialogVisible) return;

    setIsConfirmDialogVisible(true);
    NiceModal.show('confirm-dialog', {
      title: "Xác nhận huỷ đơn hàng",
      description: `Bạn có chắc chắn muốn huỷ đơn hàng ${order.code}?`,
      onConfirm: async () => {
        try {
          await updateOrderStatus(order._id, "Đã hủy");
          message.success("Đơn hàng đã được huỷ thành công");
          fetchUserOrders(pagination.page, pagination.limit);
        } catch (error) {
          message.error("Không thể huỷ đơn hàng");
          throw error;
        } finally {
          setIsConfirmDialogVisible(false);
        }
      },
      onCancel: () => {
        setIsConfirmDialogVisible(false);
      },
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      variant: "destructive"
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
      return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
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
                  <TableRow key={order._id || order.code}>
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
                        <Button variant="outline" onClick={() => showOrderDetail(order)}>Xem chi tiết</Button>
                        {order.status === "Chờ xác nhận" && (
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
                    className={pagination.page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum, index) => (
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
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => pagination.page < pagination.totalPages && handlePageChange(pagination.page + 1)}
                    className={pagination.page === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
