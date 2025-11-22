import React from 'react';

import { IPayment } from '../../../types/types';

const FooterBottom: React.FC = () => {
  const PaymentData: IPayment[] = [
    {
      id: '1',
      img: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png',
    },
    { id: '2', img: 'https://canhme.com/wp-content/uploads/2016/01/Paypal.png' },
    { id: '3', img: '/img/payment/master-card.png' },
    { id: '5', img: '/img/payment/visa.png' },
  ];

  return (
    <div className="border-t border-border py-8 text-sm bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-muted-foreground text-sm">
              © 2024 Figure Store. All Rights Reserved.
            </p>
          </div>
          <div className="flex items-center justify-end gap-4">
            <div className="hidden md:block">
              <p className="text-muted-foreground text-sm">Secure Payment:</p>
            </div>
            <div>
              <ul className="flex items-center gap-4 m-0 p-0">
                {PaymentData.map((item) => (
                  <li key={item.id} className="h-8 w-auto">
                    <img
                      src={item.img}
                      alt="payment method"
                      className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
