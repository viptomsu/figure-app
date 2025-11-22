'use client';

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/stores';

interface DepartmentLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const DepartmentLink: React.FC<DepartmentLinkProps> = ({ href, className, children }) => {
  const { setShowSidebarCategories } = useUIStore();

  const handleClick = () => {
    setShowSidebarCategories(false);
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default DepartmentLink;
