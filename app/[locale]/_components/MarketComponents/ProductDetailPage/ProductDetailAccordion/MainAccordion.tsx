"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ShippingLogisticsTab from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailAccordion/ShippingLogisticsTab";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import { productTabKeyToFields } from "@/app/[locale]/_models/marketModels";
import { useTranslations } from "next-intl";
import { Accordion, AccordionTab } from "primereact/accordion";
import React, { useEffect, useState } from "react";
import ApplicationsTab from "./ApplicationsTab";
import CertificationsTab from "./CertificationsTab";
import PaymentTermsTab from "./PaymentTermsTab";
import SpecificationTab from "./SpecificationTab";
import TradeDetailsTab from "./TradeDetailsTab";

interface MainAccordionProps extends ProductDetailPageProps {
  activeTabId: string | null;
}

const MainAccordion: React.FC<MainAccordionProps> = ({
  productData,
  activeTabId,
}) => {
  const t = useTranslations("productDetailPage");

  const defaultTabs = [
    {
      id: "specifications" as ProductTabKeyType,
      header: <Typography variant="h4">{t("specification.label")}</Typography>,
      children: <SpecificationTab productData={productData} />,
    },
    {
      id: "applications" as ProductTabKeyType,
      header: <Typography variant="h4">{t("application")}</Typography>,
      children: <ApplicationsTab productData={productData} />,
    },
    {
      id: "tradeDetail" as ProductTabKeyType,
      header: <Typography variant="h4">{t("tradeDetails.label")}</Typography>,
      children: <TradeDetailsTab productData={productData} />,
    },
    {
      id: "paymentTerms" as ProductTabKeyType,
      header: <Typography variant="h4">{t("paymentTerms.label")}</Typography>,
      children: <PaymentTermsTab productData={productData} />,
    },
    {
      id: "shippingLogistics" as ProductTabKeyType,
      header: <Typography variant="h4">{t("shipping.label")}</Typography>,
      children: <ShippingLogisticsTab productData={productData} />,
    },
    {
      id: "certificates" as ProductTabKeyType,
      header: <Typography variant="h4">{t("certificates")}</Typography>,
      children: <CertificationsTab productData={productData} />,
    },
  ];

  const [tabs, setTabs] = useState<typeof defaultTabs>([]);

  // open all visible tabs by default
  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  useEffect(() => {
    filterTabsByProduct();
  }, [productData]);

  useEffect(() => {}, [tabs, activeIndex]);

  function filterTabsByProduct() {
    const productKeys = Object.keys(productData);

    const filtered = defaultTabs.filter((tab) => {
      const requiredKeys = productTabKeyToFields[tab.id] || [];
      // ✅ keep tab if at least one required key exists in productData
      return requiredKeys.some((field) => productKeys.includes(field));
    });

    setTabs(filtered);
    setActiveIndex(filtered.map((_, i) => i)); // expand all by default
  }

  // function scrollWithOffset(id: string) {
  //   const el = document.getElementById(id);
  //   if (!el) return;
  //   const navbarHeight = 80;
  //   el.scrollIntoView({ behavior: "smooth", block: "start" });
  //   setTimeout(() => {
  //     let parent: HTMLElement | null = el.parentElement;
  //     let scrollable: HTMLElement | Window = window;
  //     while (parent) {
  //       const style = window.getComputedStyle(parent);
  //       if (
  //         /(auto|scroll)/.test(style.overflowY) &&
  //         parent.scrollHeight > parent.clientHeight
  //       ) {
  //         scrollable = parent;
  //         break;
  //       }
  //       parent = parent.parentElement;
  //     }
  //     if (scrollable === window) {
  //       window.scrollBy({ top: -navbarHeight, behavior: "smooth" });
  //     } else {
  //       (scrollable as HTMLElement).scrollBy({
  //         top: -navbarHeight,
  //         behavior: "smooth",
  //       });
  //     }
  //   }, 300);
  // }
  function scrollWithOffset(id: string, offset = 250) {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + document.body.scrollTop - offset;

    document.body.scrollTo({ top: y, behavior: "smooth" });
  }

  useEffect(() => {
    if (activeTabId) {
      setTimeout(() => {
        scrollWithOffset(activeTabId);
      }, 200);
    }
  }, [activeTabId, tabs]);

  return (
    <div className="accordion-comp product-detail-accordion">
      <Accordion
        activeIndex={activeIndex}
        multiple
        onTabChange={(e) => setActiveIndex(e.index as number[])}
      >
        {tabs.length > 0 ? (
          tabs.map((tab, index) => (
            <AccordionTab key={index} header={tab.header}>
              <div id={tab.id}>{tab.children}</div>
            </AccordionTab>
          ))
        ) : (
          <></>
        )}
      </Accordion>
    </div>
  );
};

export default MainAccordion;
