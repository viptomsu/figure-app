'use client';

import React from 'react';
import { useUIStore } from '@/stores';

const DepartmentCloseButton: React.FC = () => {
  const { setShowSidebarCategories } = useUIStore();

  return (
    <button type="button" onClick={() => setShowSidebarCategories(false)}>
      ✕
    </button>
  );
};

export default DepartmentCloseButton;
