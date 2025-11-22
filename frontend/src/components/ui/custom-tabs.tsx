import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string | React.ReactNode;
  content: React.ReactNode;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export interface CustomTabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabTriggerClassName?: string;
  tabContentClassName?: string;
  activeColorClass?: string;
  gutterClass?: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  tabsListClassName,
  tabTriggerClassName,
  tabContentClassName,
  activeColorClass = 'text-primary border-primary',
  gutterClass = 'gap-7.5',
}) => {
  const resolvedDefaultValue = defaultValue || items[0]?.key;

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Tabs
      defaultValue={resolvedDefaultValue}
      value={value}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <TabsList
        className={cn(
          'w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0',
          gutterClass,
          tabsListClassName
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.key}
            value={item.key}
            disabled={item.disabled}
            className={cn(
              'data-[state=active]:border-b-2 rounded-none pb-2',
              `data-[state=active]:${activeColorClass}`,
              tabTriggerClassName,
              item.className
            )}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.key}
          value={item.key}
          className={cn(tabContentClassName, item.contentClassName)}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export { CustomTabs };
