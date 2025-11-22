'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Layers,
  Tag,
  ShoppingBag,
  ClipboardList,
  FileText,
  Gift,
  Star,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from 'lucide-react';
import { useState } from 'react';
import { logout } from '@/services/client/authService';
import { useRouter } from 'next/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Categories',
    path: '/admin/categories',
    icon: Layers,
  },
  {
    title: 'Brands',
    path: '/admin/brands',
    icon: Tag,
  },
  {
    title: 'Products',
    path: '/admin/products',
    icon: ShoppingBag,
  },
  {
    title: 'Orders',
    path: '/admin/orders',
    icon: ClipboardList,
  },
  {
    title: 'News',
    path: '/admin/news',
    icon: FileText,
  },
  {
    title: 'Vouchers',
    path: '/admin/vouchers',
    icon: Ticket,
  },
  {
    title: 'Reviews',
    path: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FigureAdmin
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon
                size={22}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={22} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
