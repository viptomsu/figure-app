import React from 'react';
import Link from 'next/link';
import { ISectionHeaderProps } from '@/types/types';

const SectionHeader: React.FC<ISectionHeaderProps> = ({ title }) => {
    return (
        <div className="flex justify-between items-center">
            <h4 className="text-2xl font-semibold">{title}</h4>
            <Link href="/shop" className="text-primary hover:text-red-700 transition-colors">
                Xem tất cả
            </Link>
        </div>
    )
};

export default SectionHeader;