'use client';

import React from 'react';
import Link from 'next/link';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CgMenuGridO } from 'react-icons/cg';
import { FiBarChart2 } from 'react-icons/fi';
import { BsHeart } from 'react-icons/bs';
import { useUIStore } from '@/stores';

const NavigationList: React.FC = () => {
  const { setShowSidebarCategories, setShowSidebarMenu } = useUIStore();

  const handleShowMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowSidebarMenu(true);
  };

  const handleShowCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShowSidebarCategories(true);
  };

  return (
    <div
      id="navigation-list"
      className="hidden lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 py-3 flex justify-center items-center z-dropdown"
    >
      <div className="flex justify-between items-center w-[calc(50%+40px)]">
        <button type="button" className="flex flex-col items-center" onClick={handleShowMenu}>
          <span>
            <GiHamburgerMenu />
          </span>
          <p className="m-0">Menu</p>
        </button>
        <button type="button" className="flex flex-col items-center" onClick={handleShowCategories}>
          <span className="text-2xl">
            <CgMenuGridO />
          </span>
          <p className="m-0">Danh mục</p>
        </button>
        <Link href="/compare" className="flex flex-col items-center text-black no-underline">
          <span className="text-xl border-2 border-black rounded-[2px]">
            <FiBarChart2 />
          </span>
          <p className="m-0">phần quan tâm</p>
        </Link>
        <Link href="/wishlist" className="flex flex-col items-center text-black no-underline">
          <span className="text-xl">
            <BsHeart />
          </span>
          <p className="m-0">Yêu thích</p>
        </Link>
      </div>
    </div>
  );
};

export default NavigationList;
