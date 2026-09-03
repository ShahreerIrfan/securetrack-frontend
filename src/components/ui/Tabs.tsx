"use client";

import { ReactNode, useState } from "react";
import clsx from "clsx";

export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}

export function Tabs({ items, defaultActiveKey, activeKey, onChange, className }: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveKey ?? items[0]?.key);
  const isControlled = activeKey !== undefined;
  const active = isControlled ? activeKey : internalActive;

  const handleSelect = (key: string) => {
    if (!isControlled) setInternalActive(key);
    onChange?.(key);
  };

  const activeItem = items.find((item) => item.key === active);

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 border-b border-border">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.key === active}
            onClick={() => handleSelect(item.key)}
            className={clsx(
              "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              item.key === active
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-4">
        {activeItem?.content}
      </div>
    </div>
  );
}
