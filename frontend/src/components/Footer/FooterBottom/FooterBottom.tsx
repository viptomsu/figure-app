import React from "react";
import MasterCardImg from "../../../assets/img/payment/master-card.png";
import VisaImg from "../../../assets/img/payment/visa.png";
import { IPayment } from "../../../types/types";

const FooterBottom: React.FC = () => {
  const PaymentData: IPayment[] = [
    {
      id: 1,
      img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png",
    },
    { id: 2, img: "https://canhme.com/wp-content/uploads/2016/01/Paypal.png" },
    { id: 3, img: MasterCardImg.src },
    { id: 5, img: VisaImg.src },
  ];

  return (
    <div className="border-t border-gray-200 py-8.75 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="text-black text-sm">
            © 2024 Figure Store.
          </p>
        </div>
        <div className="flex items-center justify-end">
          <div className="pr-5">
            <p className="text-black text-sm">Chúng tôi sử dụng thanh toán an toàn cho:</p>
          </div>
          <div className="w-75">
            <ul className="flex items-center justify-between m-0 p-0">
              {PaymentData.map((item) => (
                <li key={item.id} className={item.id === 1 ? "w-15" : "w-11.25"}>
                  <img src={item.img} alt="thẻ thanh toán" className="w-full h-8 object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
