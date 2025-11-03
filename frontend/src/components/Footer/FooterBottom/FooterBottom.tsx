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
    { id: 3, img: MasterCardImg },
    { id: 5, img: VisaImg },
  ];

  return (
    <div className="border-t border-gray-700 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="copyright">
          <p className="text-gray-300 text-sm">
            © 2024 VieFigure Store.
          </p>
        </div>
        <div className="payment">
          <div className="payment-text mb-3">
            <p className="text-gray-300 text-sm">Chúng tôi sử dụng thanh toán an toàn cho:</p>
          </div>
          <div className="payment-cards">
            <ul className="flex space-x-3">
              {PaymentData.map((item) => (
                <li key={item.id}>
                  <img src={item.img} alt="thẻ thanh toán" className="h-8 object-contain" />
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
