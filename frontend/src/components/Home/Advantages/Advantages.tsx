import React from 'react';
import { BiRocket } from 'react-icons/bi';
import { AiOutlineSync } from 'react-icons/ai';
import { GoCreditCard } from 'react-icons/go';
import { ImBubbles3, ImGift } from 'react-icons/im';
import { IAdvantagesDataTypes } from '../../../types/types';

const Advantages: React.FC = () => {
  const AdvantagesData: IAdvantagesDataTypes[] = [
    {
      id: '1',
      icon: <BiRocket />,
      title: 'Miễn Phí Giao Hàng',
      paragraph: 'Cho tất cả đơn hàng trên 2.000.000đ',
    },
    {
      id: '2',
      icon: <AiOutlineSync />,
      title: 'Đổi Trả Trong 7 Ngày',
      paragraph: 'Nếu sản phẩm có vấn đề',
    },
    {
      id: '3',
      icon: <GoCreditCard />,
      title: 'Thanh Toán An Toàn',
      paragraph: 'Bảo mật thanh toán 100%',
    },
    {
      id: '4',
      icon: <ImBubbles3 />,
      title: 'Hỗ Trợ 24/7',
      paragraph: 'Hỗ trợ tận tình',
    },
    {
      id: '5',
      icon: <ImGift />,
      title: 'Dịch Vụ Quà Tặng',
      paragraph: 'Hỗ trợ dịch vụ quà tặng',
    },
  ];

  return (
    <section id="advantages" className="bg-white pb-7.5">
      <div className="container">
        <div className="p-7.5 border border-gray-200">
          <ul className="flex items-center justify-around m-0 p-0 md:flex-wrap md:justify-start sm:flex-col sm:gap-10">
            {AdvantagesData.map((item) => (
              <li key={item.id} className="sm:first:pt-5 sm:last:pb-10 sm:px-0 sm:w-full">
                <div className="flex sm:items-center text-center sm:text-left">
                  <div className="shrink-0 sm:mr-6 sm:mb-1.5 sm:w-auto">
                    <div className="text-4xl sm:text-4.6xl text-primary mb-5 sm:mb-0 sm:inline-block">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-medium text-gray-900 mb-1">{item.title}</h5>
                    <p className="text-sm text-gray-600 m-0">{item.paragraph}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
