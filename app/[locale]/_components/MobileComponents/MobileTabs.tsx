"use client";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { listCounts } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import { FC, JSX } from "react";

export interface MobileTabItem {
  name: string;
  keyName?: string;
  id: number;
  status: string | number;
  icon?: JSX.Element;
}

interface MobileTabsProps {
  activeTab?: string | number;
  listCounts?: listCounts;
  setListStatus: (val: string | number) => void;
  className?: string;
  tabsName: MobileTabItem[];
}
const MobileTabs: FC<MobileTabsProps> = ({
  activeTab,
  setListStatus,
  listCounts,
  tabsName,
}) => {
  const t = useTranslations();
  return (
    <div className="tabs-block t-b-main">
      {tabsName?.map((item: MobileTabItem, index) => (
        <Buttons
          key={index}
          className={`btn-outline ${item.status === activeTab ? "active" : ""}`}
          text={`${t(item.name)} ${
            listCounts?.[item.keyName as keyof listCounts] !== undefined
              ? `(${listCounts[item.keyName as keyof listCounts]})`
              : ""
          }`}
          onClick={() => setListStatus(item.status)}
        />
      ))}
    </div>
  );
};

export default MobileTabs;
