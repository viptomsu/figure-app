'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createAddressBook, updateAddressBook, deleteAddressBook } from '@/services/client';
import AddressBookModal from './components/AddressBookModal';
import NiceModal from '@ebay/nice-modal-react';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AddressBook: React.FC<{ userId: string; initialAddressBooks: any[] }> = ({
  userId,
  initialAddressBooks,
}) => {
  const addressBooks = initialAddressBooks;
  const router = useRouter(); // Sử dụng useRouter

  const handleSaveAddress = async (values: any) => {
    try {
      if (values.id) {
        await updateAddressBook(
          values.id,
          values.recipientName,
          values.phoneNumber,
          values.address,
          values.ward,
          values.district,
          values.city,
          values.email
        );
        toast.success('Cập nhật địa chỉ thành công!');
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
        toast.success('Thêm địa chỉ mới thành công!');
      }
      router.refresh();
    } catch (error) {
      toast.error('Lỗi khi lưu địa chỉ');
      console.error(error);
    }
  };

  const handleDeleteAddress = async (addressBookId: string) => {
    try {
      await deleteAddressBook(addressBookId);
      router.refresh();
      toast.success('Xóa địa chỉ thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa địa chỉ');
      console.error(error);
    }
  };

  const handleEditAddress = (address: any) => {
    NiceModal.show(AddressBookModal, {
      isEditMode: true,
      onSave: handleSaveAddress,
      initialValues: address,
    });
  };

  const handleCheckoutNavigate = () => {
    router.push('/checkout'); // Điều hướng sang trang checkout
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h6 className="text-xl font-semibold m-0">Quản lý địa chỉ giao hàng</h6>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300"
          onClick={() => {
            NiceModal.show(AddressBookModal, {
              isEditMode: false,
              onSave: handleSaveAddress,
              initialValues: null,
            });
          }}
        >
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="border border-gray-200 rounded">
        {addressBooks.length > 0 ? (
          addressBooks.map((address) => (
            <div
              key={address.id}
              className="flex justify-between items-center p-4 border-b border-gray-200 last:border-b-0"
            >
              <div>
                <h6 className="font-semibold mb-1">{address.recipientName}</h6>
                <p className="text-sm text-gray-600 m-0">
                  {address.phoneNumber}, {address.email}, {address.address}, {address.ward},{' '}
                  {address.district}, {address.city}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-primary hover:text-red-700 transition-all duration-300"
                  onClick={() => handleEditAddress(address)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="text-red-600 hover:text-red-700 transition-all duration-300"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
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
