import React, { useState, useEffect } from "react";
import { Tag, Table, Avatar, message, Modal, Button } from "antd";
import {
  getOrdersByUserId,
  updateOrderStatus,
} from "../../services/orderService";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useUserStore } from "../../stores";

const HistorySection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalElements: 0,
    limit: 5,
  });
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Lấy thông tin người dùng từ Zustand store
  const { user } = useUserStore();
  const fetchUserOrders = async (currentPage = 1, limit = 5) => {
    if (user && user.userId) {
      const userId = user.userId;
      setLoading(true);
      try {
        const { content, page, totalPages, totalElements } =
          await getOrdersByUserId(userId, currentPage, limit);
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
    let colorClass = "";
    let borderClass = "";
    let bgClass = "";
    switch (status) {
      case "Chờ xác nhận":
        colorClass = "text-orange-500";
        borderClass = "border-orange-500";
        bgClass = "bg-orange-50";
        break;
      case "Đã xác nhận":
        colorClass = "text-blue-600";
        borderClass = "border-blue-600";
        bgClass = "bg-blue-50";
        break;
      case "Đã đóng gói":
        colorClass = "text-purple-600";
        borderClass = "border-purple-600";
        bgClass = "bg-purple-50";
        break;
      case "Đang vận chuyển":
        colorClass = "text-green-600";
        borderClass = "border-green-600";
        bgClass = "bg-green-50";
        break;
      case "Đã hủy":
        colorClass = "text-red-600";
        borderClass = "border-red-600";
        bgClass = "bg-red-50";
        break;
      case "Đã giao hàng":
        colorClass = "text-teal-600";
        borderClass = "border-teal-600";
        bgClass = "bg-teal-50";
        break;
      default:
        colorClass = "text-gray-500";
        borderClass = "border-gray-500";
        bgClass = "bg-gray-50";
    }
    return (
      <span
        className={`inline-block text-center px-2 py-1 rounded ${colorClass} ${borderClass} ${bgClass} border`}
      >
        {status}
      </span>
    );
  };
  const handleCancelOrder = async (order: any) => {
    Modal.confirm({
      title: "Xác nhận huỷ đơn hàng",
      content: `Bạn có chắc chắn muốn huỷ đơn hàng ${order.code}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await updateOrderStatus(order._id, "Đã hủy");
          message.success("Đơn hàng đã được huỷ thành công");
          // Làm mới dữ liệu
          fetchUserOrders();
        } catch (error) {
          message.error("Không thể huỷ đơn hàng");
        }
      },
    });
  };
  const columns = [
    {
      title: "Người đặt hàng",
      dataIndex: "addressBook",
      key: "addressBook",
      render: (addressBook: any) => (
        <div className="flex items-center gap-2">
          <span>{addressBook.recipientName}</span>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "addressBook",
      key: "address",
      render: (addressBook: any) =>
        `${addressBook.address}, ${addressBook.ward}, ${addressBook.district}, ${addressBook.city}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "addressBook",
      key: "address",
      render: (addressBook: any) => `${addressBook.phoneNumber}`,
    },
    {
      title: "Email",
      dataIndex: "addressBook",
      key: "address",
      render: (addressBook: any) => `${addressBook.email}`,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => `${formatCurrency(totalPrice)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      render: (status: string) => generateStatus(status),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button onClick={() => showOrderDetail(record)}>Xem chi tiết</Button>
          {record.status === "Chờ xác nhận" && (
            <Button danger onClick={() => handleCancelOrder(record)}>
              Huỷ đơn hàng
            </Button>
          )}
        </div>
      ),
    },
  ];

  const showOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Mã đơn hàng: {selectedOrder.code}
          </h2>
          <div className="flex items-center gap-4">
            <Tag color="orange">{selectedOrder.status}</Tag>
          </div>
        </div>
        <p className="text-gray-600">
          {new Date(selectedOrder.date).toLocaleString()}
        </p>

        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-2">Sản phẩm trong đơn hàng</h3>
          {selectedOrder.orderDetails.map((item: any) => {
            console.log(item);
            const defaultImageUrl =
              item.product.images.find((img: any) => img.isDefault)?.imageUrl ||
              "URL của ảnh mặc định";

            return (
              <div
                key={item._id}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={defaultImageUrl}
                    alt={item.product.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">
                      {item.product.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Lựa chọn:{" "}
                      {item.productVariation?.attributeValue || "Không có"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">x{item.quantity}</p>
                  <p className="font-semibold">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-2">Tóm tắt đơn hàng</h3>
          <div className="flex justify-between mb-2">
            <p>Tổng tiền</p>
            <p>
              {formatCurrency(
                selectedOrder.totalPrice / (1 - selectedOrder.discount / 100)
              )}
            </p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Giảm giá</p>
            {selectedOrder.discount ? (
              <p>
                -{" "}
                {formatCurrency(
                  (selectedOrder.totalPrice /
                    (1 - selectedOrder.discount / 100)) *
                    (selectedOrder.discount / 100)
                )}
              </p>
            ) : (
              <p>Không có</p>
            )}
          </div>
          <div className="flex justify-between font-bold text-lg">
            <p>Tổng đơn hàng</p>
            <p>{formatCurrency(selectedOrder.totalPrice)}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold mb-2">Thông tin người nhận</h3>
          <div>
            <div>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {selectedOrder.addressBook.recipientName}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.addressBook.email}
              </p>
            </div>
            <div>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {selectedOrder.addressBook.phoneNumber ||
                  "Không có số điện thoại"}
              </p>
            </div>
            <div>
              <p>
                <strong>Địa chỉ:</strong> {selectedOrder.addressBook.address},{" "}
                {selectedOrder.addressBook.ward},{" "}
                {selectedOrder.addressBook.district},{" "}
                {selectedOrder.addressBook.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTableChange = (pagination: any) => {
    setPagination((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.limit,
    }));
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey={(record) => record.orderId}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalElements,
        }}
        onChange={handleTableChange}
      />
      <Modal
        title="Chi tiết đơn hàng"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
      >
        {renderOrderDetails()}
      </Modal>
    </div>
  );
};

export default HistorySection;
