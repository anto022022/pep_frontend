"use client";
import { useTranslations } from "next-intl";
import React, { JSX, useState } from "react";
import { listCounts } from "../../_interface/SalesProductInterface";

export interface TabItem {
  name: string;
  keyName?: string;
  id: number;
  status: string;
  icon?: JSX.Element;
}

interface TabsProps {
  isIcon?: boolean;
  activeTab?: string;
  listCounts?: listCounts;
  setListStatus: (val: string) => void;
  className?: string;
  tabsName: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({
  isIcon = false,
  activeTab = "",
  listCounts,
  setListStatus,
  className,
  tabsName,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(activeTab);
  const t = useTranslations();
  const handleTabClick = (status: string) => {
    setSelectedTab(status);
  };

  console.log("activeTab",activeTab)
 
  return (
    <div className={`tabs-comp ${className}`}>
      {tabsName?.map((item: TabItem) => (
        
        <button
          className={`btn-comp t-c-btn ${
            item.status === selectedTab ? "active" : ""
          }`}
          onClick={() => {
            setListStatus?.(item.status); // optional chaining for safety
            handleTabClick(item.status);
          }}
          key={item.id}
        >
          {!isIcon ? t(item.name) : item.icon}
          {listCounts?.[item.keyName as keyof listCounts] !== undefined
            ? `(${listCounts[item.keyName as keyof listCounts]})`
            : ""}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
