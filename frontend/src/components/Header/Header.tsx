import React, { useState, useEffect } from "react";
import Link from "next/link";
import Search from "./HeaderTop/Search";
import Actions from "./HeaderTop/Actions";
import Department from "./HeaderBottom/Department";
import LangAndMonetaryUnit from "./HeaderBottom/LangAndMonetaryUnit";
import { NavLinksData } from "./HeaderBottom/HeaderBottomData";
import { useUIStore } from "../../stores";
import { useIsClient } from "../../hooks/useIsClient";

const Header: React.FC = () => {
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
    <div className="bg-red-600 z-999 w-full border border-red-600 rounded-xl">
      {/* ======= Header-top ======= */}
      <div className="relative h-20">
        <div className="bg-red-600 fixed top-0 right-0 w-full z-999">
          <div className="container">
            <div className="h-20 flex flex-row items-center justify-between w-full px-4">
              <div
                className={showDepartments ? "department-wrapper" : "hidden"}
              >
                <Department />
              </div>
              <div className={showDepartments ? "hidden" : "brand w-full max-w-68 h-full"}>
                <Link href="/" className="flex items-center justify-center h-full w-auto object-contain">
                  <img src={"/logo-header.png"} alt="logo" />
                </Link>
              </div>
              {/* Hiển thị Search nếu màn hình lớn */}
              {isLargeScreen && (
                <div className={showSearch ? "search-wrapper w-full" : "hidden"}>
                  <Search />
                </div>
              )}
              <div className="header-top-actions-wrapper">
                <Actions />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= Header-bottom ======= */}
      <div className="header-bottom-wrapper">
        <div className="h-12 flex items-center justify-between gap-5 px-5 text-lg font-semibold box-border">
          <div
            className={
              showCategories
                ? "department-wrapper show-sidebar"
                : "department-wrapper"
            }
          >
            <Department />
          </div>
          <div
            className={
              showMenu ? "nav-links-wrapper show-sidebar" : "nav-links-wrapper"
            }
          >
            <div className="flex flex-row items-center justify-between px-4 text-white">
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
          <div className="lang-and-monetary-unit-wrapper">
            <LangAndMonetaryUnit />
          </div>
        </div>
      </div>

      {/* ======= dark bg-color overlay ======= */}
      <div
        className={showMenu || showCategories ? "bg-black bg-opacity-50 fixed top-0 left-0 bottom-0 w-full z-9999" : "hidden"}
        onClick={() => {
          setShowSidebarMenu(false);
          setShowSidebarCategories(false);
        }}
      ></div>
    </div>
  );
};

export default Header;
