import { Home, ShoppingBag, FileText, Phone } from 'lucide-react';
import { INavMenuDataTypes } from '../../../types/types';

export const NavLinksData: INavMenuDataTypes[] = [
  {
    id: '1',
    icon: <Home className="w-5 h-5" />,
    title: 'Trang chủ',
    href: '/',
    class: 'first-li',
  },
  {
    id: '2',
    icon: <ShoppingBag className="w-5 h-5" />,
    title: 'Sản phẩm',
    href: '/shop',
    class: 'third-li',
  },
  {
    id: '3',
    icon: <FileText className="w-5 h-5" />,
    title: 'Bài viết',
    href: '/about',
    class: 'second-li',
  },
  {
    id: '4',
    icon: <Phone className="w-5 h-5" />,
    title: 'Liên hệ',
    href: '/contact',
    class: 'fourth-li',
  },
];
