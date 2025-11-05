import React from 'react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-secondary-bg py-5", className)}>
      <nav aria-label="breadcrumb">
        <ul className="text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={index}
                className={cn(
                  "inline-block relative",
                  !isFirst && "pl-3 pr-2.5",
                  isFirst && "pl-0"
                )}
              >
                {!isFirst && (
                  <span className="absolute -left-1 top-0">/</span>
                )}
                {isLast ? (
                  <span className="uppercase text-base font-medium">
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href || '#'}
                    className="uppercase text-base font-medium transition-colors duration-300 hover:text-primary no-underline"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumb;
