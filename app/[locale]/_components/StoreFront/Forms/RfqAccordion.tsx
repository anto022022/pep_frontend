"use client";
import { Accordion, AccordionTab } from "primereact/accordion";
import { FC, useEffect, useState } from "react";

import Typography from "@/app/[locale]/_components/Base/Typography";
import { TabItem } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailAccordion/MainAccordion";
import BuyingPreferenceTab from "@/app/[locale]/_components/StoreFront/Forms/RfqInfoAccordion/BuyingPreferenceTab";
import CustomizationTab from "@/app/[locale]/_components/StoreFront/Forms/RfqInfoAccordion/CustomizationTab";
import { RfqData } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";

export interface RfqProps {
  previewData?: RfqData | null;
  activeTabId: string | null;
}
const RfqAccordion: FC<RfqProps> = ({ previewData, activeTabId }) => {
  const t = useTranslations("categoryPage.rfq.detailPage");
  const tabs: TabItem[] = [
    {
      id: "buyingPreference",
      header: <Typography variant="h2">{t("buying")}</Typography>,
      children: <BuyingPreferenceTab previewData={previewData} />,
    },
    {
      id: "customization",
      header: <Typography variant="h2">{t("sampling")}</Typography>,
      children: <CustomizationTab previewData={previewData} />,
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | number[] | null>(null);

  useEffect(() => {
    if (activeTabId) {
      const index = tabs.findIndex(tab => tab.id === activeTabId);
      if (index !== -1) {
        setActiveIndex([index]);
      }
    }
  }, [activeTabId]);




  const createDynamicTabs = () =>
    tabs.map((tab, index) => (
      <AccordionTab key={index} header={tab.header} disabled={tab.disabled} data-tab-id={tab.id}>
        <div data-tab-id={tab.id}>
          {tab.children}
        </div>
      </AccordionTab>
    ));


  return (
    <div className="accordion-comp product-detail-accordion">
      <Accordion activeIndex={activeIndex} multiple onTabChange={(e) => {
        const indexArray = Array.isArray(e.index) ? e.index : [e.index];
        setActiveIndex(indexArray);
      }}>
        {createDynamicTabs()}
      </Accordion>
    </div>
  );
};

export default RfqAccordion;
