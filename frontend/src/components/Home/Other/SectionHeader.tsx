import React from 'react';
import Link from 'next/link';
import { ISectionHeaderProps } from '@/types/types';

const SectionHeader: React.FC<ISectionHeaderProps> = ({ title }) => {
    return (
        <div className="section-header flex justify-between items-center">
            <div className="left-side">
                <div className="section-title">
                    <h4 className="text-lg font-semibold">{title}</h4>
                </div>
            </div>
            <div className="right-side">
                <Link href="/shop" className="text-blue-600 hover:text-blue-800 transition-colors">Xem tất cả</Link>
            </div>
        </div>
    )
};

export default SectionHeader;