'use client';

import React from 'react';
import DropdownCart from './DropdownCart';
import { FiBarChart2 } from 'react-icons/fi';
import { BsHeart, BsBag } from 'react-icons/bs';
import { IoIosSearch } from 'react-icons/io';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  useCartStore,
  useWishlistStore,
  useCompareStore,
  useUIStore,
  useUserStore,
} from '@/stores';
import { logout as logoutService } from '@/services/client';
import { IActionDataTypes } from '@/types/types';
import { User } from '@/services/types';

interface ActionsProps {
  user: User | null;
}

const Actions = ({ user }: ActionsProps) => {
  const { cart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { compare } = useCompareStore();
  const { showSearchArea, toggleDropdownCart, setShowSearchArea } = useUIStore();
  const { logout } = useUserStore(); // Keep only for mutations
  const router = useRouter();

  const showOrHideDropCart = (e: React.MouseEvent<HTMLAnchorElement>) => {
    toggleDropdownCart();
  };

  const ActionsData: IActionDataTypes[] = [
    {
      id: '1',
      href: '/compare',
      sup: compare.length,
      icon: <FiBarChart2 color="#ffffff" />,
      class: 'second-link',
    },
    {
      id: '2',
      href: '/wishlist',
      sup: wishlist.length,
      icon: <BsHeart />,
      class: 'second-link',
    },
    {
      id: '3',
      href: '#/',
      sup: cart.length,
      icon: <BsBag />,
      class: 'third-link',
      dropdownContent: <DropdownCart />,
      func: showOrHideDropCart,
    },
  ];

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logoutService();
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      router.push('/login');
      toast.error('Đăng xuất thất bại');
    }
  };

  return (
    <div className="header-top-actions flex">
      <div className="left-actions">
        <ul className="list-none m-0 p-0">
          <li className="relative">
            <button
              type="button"
              className="search-btnn"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                setShowSearchArea(true);
              }}
            >
              <IoIosSearch />
            </button>
          </li>
          {ActionsData.map((item) => (
            <li key={item.id} className="relative">
              {item.href === '#/' ? (
                <a
                  href={item.href}
                  className={`${item.class} relative text-white transition-(--transition-normal) hover:text-red-600`}
                  onClick={item.func}
                >
                  {item.icon}
                  {item.sup > 0 && (
                    <sup className="absolute top-2.25 right-[-10px] text-[12px] flex items-center justify-center bg-black text-white w-5 h-5 rounded-full">
                      {item.sup}
                    </sup>
                  )}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className={`${item.class} relative text-white transition-(--transition-normal) hover:text-red-600`}
                  onClick={item.func}
                >
                  {item.icon}
                  {item.sup > 0 && (
                    <sup className="absolute top-2.25 right-[-10px] text-[12px] flex items-center justify-center bg-black text-white w-5 h-5 rounded-full">
                      {item.sup}
                    </sup>
                  )}
                </Link>
              )}
              {item.dropdownContent}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-actions flex">
        <div className="user-icon h-10 w-11 pr-2.5">
          {/* Kiểm tra nếu có user và avatar */}
          {user && user.avatar ? (
            <Link href="/profile">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
          ) : (
            <Link href="/login">
              <img
                src={'https://i.pinimg.com/originals/94/e4/cb/94e4cb5ae194975f6dc84d1495c3abcd.gif'}
                alt="User Icon"
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
          )}
        </div>

        <div className="links flex items-center">
          {/* Nếu user đã đăng nhập */}
          {user && user.fullName ? (
            <>
              <span className="font-bold max-w-36 whitespace-nowrap overflow-hidden text-ellipsis text-white">
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2.5 p-1.25 text-[14px] whitespace-nowrap cursor-pointer text-white"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                className="font-bold max-w-36 whitespace-nowrap overflow-hidden text-ellipsis text-white"
                href="/login"
              >
                Đăng nhập
              </Link>
              <Link
                className="font-bold max-w-36 whitespace-nowrap overflow-hidden text-ellipsis text-white"
                href="/register"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
