'use client';
import React, { useState } from 'react';
import Description from './Description';
import Reviews from './Reviews';
import { ITabList } from '../../../types/types';

const ProductTabs: React.FC<any> = ({ product }) => {
  const [clickedBtn, setClickedBtn] = useState<string>('Mô tả');

  // Chỉ giữ lại 2 tab: Mô tả và Đánh giá
  const TabList: ITabList[] = [
    { id: '1', title: 'Mô tả' }, // Tab Mô tả
    { id: '2', title: 'Đánh giá', reviewCount: product?.reviewCount },
    { id: '3', title: '' },
    { id: '4', title: '' },
  ];

  return (
    <div className="pt-20 pb-7.5">
      {/* ======= Danh sách tab ======= */}
      <div className="border-b border-gray-200">
        <ul className="flex items-center justify-between w-[525px] h-12.5">
          {TabList.map((tabListItem) => (
            <li
              key={tabListItem.id}
              className="flex items-center justify-center h-full text-xl font-semibold text-gray-600 border-b-2 border-transparent transition-all duration-300"
            >
              <button
                type="button"
                className={`h-full ${
                  tabListItem.title === clickedBtn ? 'text-black border-b-2 border-black' : ''
                }`}
                onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                  setClickedBtn(tabListItem.title);
                }}
              >
                {tabListItem.reviewCount
                  ? tabListItem.title + ' (' + tabListItem.reviewCount + ')'
                  : tabListItem.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* ======= Nội dung tab ======= */}
      <div className="pt-5">
        {clickedBtn === 'Mô tả' && (
          <div>
            <Description product={product} />
          </div>
        )}
        {clickedBtn === 'Đánh giá' && (
          <div>
            <Reviews product={product} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
