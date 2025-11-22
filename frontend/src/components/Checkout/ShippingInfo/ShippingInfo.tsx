import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Import Button từ shadcn/ui
import { HiArrowNarrowLeft } from 'react-icons/hi';

import { AddressBook } from '@/services/types';

interface ShippingInfoProps {
  handleShippingSubmit: () => void;
  handlePrev: () => void; // Thêm hàm xử lý quay lại
  selectedAddress: AddressBook | null; // Nhận selectedAddress từ component Checkout
}

const ShippingInfo = (props: ShippingInfoProps) => {
  const [address, setAddress] = useState<any>({
    recipientName: '',
    phoneNumber: '',
    address: '',
    ward: '',
    district: '',
    city: '',
  });

  // Khi selectedAddress thay đổi, cập nhật form với giá trị từ địa chỉ đã chọn
  useEffect(() => {
    if (props.selectedAddress) {
      const selectedAddr = props.selectedAddress;
      setAddress({
        recipientName: selectedAddr.recipientName || '',
        phoneNumber: selectedAddr.phoneNumber || '',
        address: selectedAddr.address || '',
        ward: selectedAddr.ward || '',
        district: selectedAddr.district || '',
        city: selectedAddr.city || '',
        email: selectedAddr.email || '',
      });
    }
  }, [props.selectedAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault(); // Ngăn load lại trang
          props.handleShippingSubmit();
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mt-5">Thông tin thanh toán</h1>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h5 className="text-lg font-semibold mb-4">Thông tin người nhận</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Người nhận</label>
                <input
                  type="text"
                  placeholder="Người nhận"
                  name="recipientName"
                  value={address.recipientName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  name="phoneNumber"
                  value={address.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={address.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
              <div></div>
              <div className="md:col-span-2">
                <label className="block mb-2">Địa chỉ nhận hàng</label>
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  name="address"
                  value={address.address}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Phường/Xã"
                  name="ward"
                  value={address.ward}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Quận/Huyện"
                  name="district"
                  value={address.district}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Thành phố"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-6 flex justify-between">
          <Button variant="outline" onClick={props.handlePrev} className="flex items-center gap-2">
            <HiArrowNarrowLeft /> Quay lại
          </Button>
          <input
            type="submit"
            value="Tiếp tục đến vận chuyển"
            className="px-6 py-2.5 bg-primary text-white rounded hover:bg-red-700 transition-all duration-300 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default ShippingInfo;
