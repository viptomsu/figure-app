'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Search from "./HeaderTop/Search";
import Actions from "./HeaderTop/Actions";
import Department from "./HeaderBottom/Department";
import LangAndMonetaryUnit from "./HeaderBottom/LangAndMonetaryUnit";
import { NavLinksData } from "./HeaderBottom/HeaderBottomData";
import { useUIStore } from "../../stores";
import { useIsClient } from "../../hooks/useIsClient";
import { User } from '@/services/types';

interface HeaderInteractiveProps {
  user: User | null;
}

const HeaderInteractive: React.FC<HeaderInteractiveProps> = ({ user }) => {
  const [showDepartments, setShowDepartments] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const isClient = useIsClient();

  const {
    showSidebarCategories: showCategories,
    showSidebarMenu: showMenu,
    showSearchArea: showSearch,
    setShowSidebarMenu,
    setShowSidebarCategories,
    setShowSearchArea,
  } = useUIStore();

  const handleCloseMenu = (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => {
    setShowSidebarMenu(false);
  };

  // Theo dõi kích thước màn hình
  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      const isLarge = window.innerWidth > 992;
      setIsLargeScreen(isLarge);
      setShowSearchArea(isLarge);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // gọi ngay khi mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setShowSearchArea, isClient]);

  // Ẩn Search nếu là mobile khi mount
  useEffect(() => {
    if (!isClient || window.innerWidth < 992) {
      setShowSearchArea(false);
    }
  }, [setShowSearchArea, isClient]);

  // Lắng nghe scroll khi màn hình lớn
  useEffect(() => {
    if (!isClient || window.innerWidth <= 992) return;

    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowDepartments(true);
      } else {
        setShowDepartments(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // gọi ngay để cập nhật trạng thái ban đầu

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isClient]);

  return (
    <div className="bg-primary z-header w-full border border-primary rounded-[12px]">
      {/* ======= Header-top ======= */}
      <div className="relative h-header-height">
        <div className="bg-primary fixed top-0 right-0 w-full z-header">
          <div className="container">
            <div className="h-header-height flex flex-row items-center justify-between w-full px-4">
              <div
                className={showDepartments ? "flex items-center justify-between w-full max-w-65 h-full relative cursor-pointer before:absolute before:top-0 before:left-0 before:w-full before:h-0.08rem before:bg-black before:scale-x-0 before:origin-right before:transition-transform before:transition-smooth hover:before:scale-x-1 hover:transform hover:-translate-y-5.25" : "hidden"}
              >
                <Department />
              </div>
              <div className={showDepartments ? "hidden" : "flex items-center justify-center w-full max-w-68 h-full"}>
                <Link href="/" className="flex items-center justify-center h-full w-auto object-contain">
                  <img src={"/logo-header.png"} alt="logo" />
                </Link>
              </div>
              {/* Hiển thị Search nếu màn hình lớn */}
              {isLargeScreen && (
                <div className={showSearch ? "relative w-full" : "hidden"}>
                  <Search />
                </div>
              )}
              <div className="flex">
                <Actions user={user} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= Header-bottom ======= */}
      <div className="h-12 flex items-center justify-between gap-5 px-5 text-lg font-semibold box-border">
        <div
          className={
            showCategories
              ? "flex items-center justify-between w-full max-w-65 h-full cursor-pointer relative bg-white shadow-lg fixed top-0 right-0 bottom-0 w-65 max-w-65 transition-all duration-300 transform translate-x-270 z-modal md:relative md:w-full md:max-w-65 md:bg-primary md:shadow-none md:transform-none md:z-auto"
              : "flex items-center justify-between w-full max-w-65 h-full cursor-pointer relative"
          }
        >
          <Department />
        </div>
        <div
          className={
            showMenu ? "flex items-center justify-between w-full max-w-80 h-full cursor-pointer relative bg-white shadow-lg fixed top-0 right-0 bottom-0 w-65 max-w-65 transition-all duration-300 transform translate-x-270 z-modal md:relative md:w-full md:max-w-80 md:bg-primary md:shadow-none md:transform-none md:z-auto" : "flex items-center justify-between w-full max-w-80 h-full cursor-pointer relative"
          }
        >
          <div className="flex flex-row items-center justify-between px-4 text-primary">
            <h6>MENU</h6>
            <button type="button" onClick={handleCloseMenu}>
              ✕
            </button>
          </div>
          <ul className="flex gap-12 pb-1 list-none m-0">
            {NavLinksData.map((link) =>
              link.id === 1 ? (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={link.class}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      setShowSidebarMenu(false);
                    }}
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                </li>
              ) : (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={link.class}
                    onClick={handleCloseMenu}
                  >
                    {link.icon}
                    {link.title}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="flex items-center justify-between w-48">
          <LangAndMonetaryUnit />
        </div>
      </div>

      {/* ======= dark bg-color overlay ======= */}
      <div
        className={showMenu || showCategories ? "bg-black/50 fixed top-0 left-0 bottom-0 w-full z-modal" : "hidden"}
        onClick={() => {
          setShowSidebarMenu(false);
          setShowSidebarCategories(false);
        }}
      ></div>
    </div>
  );
};

export default HeaderInteractive;
