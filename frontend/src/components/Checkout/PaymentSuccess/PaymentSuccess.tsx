import React from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import Link from "next/link";

interface IProps {
  orderCode: string;
}

const PaymentSuccess: React.FC<IProps> = (props) => {
  return (
    <div className="py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold mt-5">Thanh toán thành công</h1>
      </div>
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h5 className="text-xl font-semibold mb-4">Cảm ơn bạn! Đơn hàng của bạn đang được xử lý.</h5>
          <p className="mb-4">
            Mã đơn hàng của bạn là <strong>{props.orderCode}</strong>
          </p>
          <p className="mb-6">
            Một email sẽ được gửi chứa thông tin về đơn hàng của bạn. Nếu bạn
            có bất kỳ câu hỏi nào về đơn hàng, hãy gửi email cho chúng tôi tại{" "}
            <a href="mailto:admin@rhodishop.com" className="text-primary hover:underline">
              admin@rhodishop.com
            </a>
          </p>
          <Link href="/shop" className="flex items-center justify-center">
            <HiArrowNarrowLeft className="mr-2" />
            <p className="m-0">Quay lại</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
