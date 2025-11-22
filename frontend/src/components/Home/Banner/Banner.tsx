import React from 'react';
import Slider from './Slider';
import Link from 'next/link';
import { IBannerRightDataTypes } from '@/types/types';

const Banner: React.FC = () => {
  const BannerRightData: IBannerRightDataTypes[] = [
    {
      id: '1',
      img: '/banner/gundam-banner-4.png',
    },
    {
      id: '2',
      img: '/banner/gundam-banner-5.png',
    },
  ];

  return (
    <section className="bg-white py-8">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-stretch justify-evenly h-[415px]">
          <div className="banner-slider-wrapper flex-1 h-full">
            <Slider />
          </div>
          <div className="banner-right-imgs flex-1 max-w-[390px] h-full flex flex-col justify-between gap-4">
            {BannerRightData.map((item) => (
              <div key={item.id} className="banner-img-wrapper flex-1 h-[calc(50%-8px)]">
                <Link href="/shop" className="block w-full h-full">
                  <img src={item.img} alt="banner-img" className="w-full h-full object-cover" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
