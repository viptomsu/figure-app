'use client';

import { ISliderDataTypes } from '@/types/types';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SliderData: ISliderDataTypes[] = [
  {
    id: '1',
    img: '/banner/gundam-banner-1.png',
  },
  {
    id: '2',
    img: '/banner/gundam-banner-2.png',
  },
  {
    id: '3',
    img: '/banner/gundam-banner-3.png',
  },
];

const Slider = () => {
  const [tabIndex, setTabIndex] = useState<number>(1);

  const handleRightBtnClick = (): void => {
    setTabIndex(tabIndex + 1);
    if (tabIndex >= 3) setTabIndex(1);
  };

  const handleLeftBtnClick = (): void => {
    setTabIndex(tabIndex - 1);
    if (tabIndex <= 1) setTabIndex(3);
  };

  return (
    <div className="relative w-full h-full">
      {/* ======= Slide item ======= */}
      {SliderData.map((item) => (
        <div
          key={item.id}
          className={item.id === tabIndex.toString() ? 'block w-full h-full' : 'hidden'}
        >
          <Link href="/shop" className="block w-full h-full">
            <img src={item.img} alt="slide-img" className="w-full h-full object-cover" />
          </Link>
        </div>
      ))}
      {/* ======= Slider buttons ======= */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={handleLeftBtnClick}
          className="flex items-center justify-center w-16 h-16 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300"
        >
          <FaChevronLeft size={60} color="#fff" />
        </button>
        <button
          onClick={handleRightBtnClick}
          className="flex items-center justify-center w-16 h-16 bg-black/30 hover:bg-black/50 rounded-full transition-all duration-300"
        >
          <FaChevronRight size={60} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default Slider;
