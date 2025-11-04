import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAddressBooksByUserId,
  createAddressBook,
  updateAddressBook,
  deleteAddressBook,
} from "../../services/addressBookService";
import AddressBookModal from "./components/AddressBookModal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import các icon
import { useRouter } from "next/navigation"; // Import useRouter

const AddressBook: React.FC<{ userId: number }> = ({ userId }) => {
  const [addressBooks, setAddressBooks] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  const router = useRouter(); // Sử dụng useRouter

  useEffect(() => {
    fetchAddressBooks();
  }, []);

  const fetchAddressBooks = async () => {
    try {
      const addresses = await getAddressBooksByUserId(userId);
      setAddressBooks(addresses);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách địa chỉ");
      console.error(error);
    }
  };

  const handleSaveAddress = async (values: any) => {
    try {
      if (isEditMode && currentAddress) {
        await updateAddressBook(
          currentAddress._id,
          values.recipientName,
          values.phoneNumber,
          values.address,
          values.ward,
          values.district,
          values.city,
          values.email
        );
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await createAddressBook(
          userId,
          values.recipientName,
          values.phoneNumber,
          values.address,
          values.ward,
          values.district,
          values.city,
          values.email
        );
        toast.success("Thêm địa chỉ mới thành công!");
      }
      fetchAddressBooks();
      setIsModalVisible(false);
    } catch (error) {
      toast.error("Lỗi khi lưu địa chỉ");
      console.error(error);
    }
  };

  const handleDeleteAddress = async (addressBookId: number) => {
    try {
      await deleteAddressBook(addressBookId);
      fetchAddressBooks();
      toast.success("Xóa địa chỉ thành công!");
    } catch (error) {
      toast.error("Lỗi khi xóa địa chỉ");
      console.error(error);
    }
  };

  const handleEditAddress = (address: any) => {
    setIsEditMode(true);
    setCurrentAddress(address);
    setIsModalVisible(true);
  };

  const handleCheckoutNavigate = () => {
    router.push("/checkout"); // Điều hướng sang trang checkout
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h6 className="text-xl font-semibold m-0">Quản lý địa chỉ giao hàng</h6>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
          onClick={() => {
            setIsEditMode(false);
            setCurrentAddress(null);
            setIsModalVisible(true);
          }}
        >
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="border border-gray-200 rounded">
        {addressBooks.length > 0 ? (
          addressBooks.map((address) => (
            <div
              key={address._id}
              className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
            >
              <div>
                <h6 className="font-semibold mb-1">{address.recipientName}</h6>
                <p className="text-sm text-gray-600 m-0">
                  {address.phoneNumber}, {address.email}, {address.address}, {address.ward}, {address.district}, {address.city}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-primary hover:text-red-700 transition-all duration-300"
                  onClick={() => handleEditAddress(address)}
                >
                  <EditOutlined />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-600">
            Chưa có địa chỉ nào. Hãy thêm địa chỉ mới!
          </div>
        )}
      </div>

      <AddressBookModal
        visible={isModalVisible}
        isEditMode={isEditMode}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveAddress}
        initialValues={currentAddress}
      />

      {/* Button điều hướng sang trang checkout */}
      <div className="text-center mt-5">
        <button
          className="bg-primary text-white px-5 py-2.5 rounded text-base hover:bg-red-700 transition-all duration-300"
          onClick={handleCheckoutNavigate} // Điều hướng khi bấm nút
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default AddressBook;
