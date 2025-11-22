'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import Department from './HeaderBottom/Department';
import LangAndMonetaryUnit from './HeaderBottom/LangAndMonetaryUnit';
import { NavLinksData } from './HeaderBottom/HeaderBottomData';
import { useUIStore, useCartStore } from '../../stores';
import { User, Category } from '@/services/types';

interface HeaderInteractiveProps {
  user: User | null;
  categories: Category[];
}

const HeaderInteractive = ({ user, categories }: HeaderInteractiveProps) => {
  const [showDepartments, setShowDepartments] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const { cart } = useCartStore();
  const totalItems = cart.reduce((acc, item) => acc + item.count, 0);

  const {
    showSidebarCategories: showCategories,
    showSidebarMenu: showMenu,
    showSearchArea: showSearch,
    setShowSidebarMenu,
    setShowSidebarCategories,
    setShowSearchArea,
  } = useUIStore();

  const handleCloseMenu = () => {
    setShowSidebarMenu(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full z-50">
      <div
        className={`w-full transition-all duration-300 ${
          isSticky
            ? 'fixed top-0 left-0 right-0 glass-header animate-slide-up z-50'
            : 'relative bg-background border-b border-border/50'
        }`}
      >
        <div className="container-custom h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo & Departments Toggle */}
          <div className="flex items-center gap-6 h-full">
            <div
              className="relative h-full flex items-center cursor-pointer group"
              onMouseEnter={() => setShowDepartments(true)}
              onMouseLeave={() => setShowDepartments(false)}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Menu className="w-5 h-5" />
                </div>
                <span className="font-medium hidden lg:block">Danh mục</span>
              </div>

              {/* Departments Dropdown */}
              <div
                className={`absolute top-full left-0 w-65 bg-white shadow-xl rounded-xl border border-border/50 overflow-hidden transition-all duration-300 origin-top-left ${
                  showDepartments
                    ? 'opacity-100 scale-100 translate-y-2 visible'
                    : 'opacity-0 scale-95 translate-y-4 invisible'
                }`}
              >
                <Department categories={categories} />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 pr-4 py-2.5 bg-muted/30 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
              onClick={() => setShowSearchArea(!showSearch)}
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Cart */}
            <Link href="/cart">
              <div className="relative p-2 hover:bg-muted rounded-full transition-colors group">
                <ShoppingBag className="w-6 h-6 group-hover:text-primary transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs font-bold flex items-center justify-center rounded-full animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
              onClick={() => setShowSidebarMenu(!showMenu)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-background shadow-2xl transform transition-transform duration-300 z-50 ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={() => setShowSidebarMenu(false)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {NavLinksData.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setShowSidebarMenu(false)}
                >
                  {link.icon}
                  <span className="font-medium">{link.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-6 border-t border-border">
            <LangAndMonetaryUnit />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(showMenu || showCategories) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => {
            setShowSidebarMenu(false);
            setShowSidebarCategories(false);
          }}
        />
      )}
    </div>
  );
};

export default HeaderInteractive;
