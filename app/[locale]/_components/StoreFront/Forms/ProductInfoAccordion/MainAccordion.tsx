"use client";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import Typography from "../../../Base/Typography";
import AdditionalDetails from "./AdditionalDetails";
import AttributesVaraintsDetails from "./AttributesVariantsDetails";
import BasicInfoTab from "./BasicInfoTab";
import ProductSpecificationTab from "./ProductSpecificationTab";
import ProductTradeInformation from "./ProductTradeInformation";
import ShippingDetails from "./ShippingDetails";

const MainAccordion = ({ previewData }: { previewData: PreviewData }) => {
  const t = useTranslations("salesProduct.viewPage");

  const tabs: {
    header: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
  }[] = [
    {
      header: <Typography variant="h2">{t("productInfoLabel")}</Typography>,
      children: <BasicInfoTab previewData={previewData} />,
    },
    {
      header: <Typography variant="h2">{t("pricingLabel")}</Typography>,
      children: <ProductSpecificationTab previewData={previewData} />,
    },
    {
      header: <Typography variant="h2">{t("specificationLabel")}</Typography>,
      children: <AttributesVaraintsDetails previewData={previewData} />,
    },
    {
      header: <Typography variant="h3">{t("tradeDetailsLabel")}</Typography>,
      children: <ProductTradeInformation previewData={previewData} />,
    },
    {
      header: <Typography variant="h3">{t("shippingLabel")}</Typography>,
      children: <ShippingDetails previewData={previewData} />,
    },
    {
      header: (
        <Typography variant="h3">{t("additionalDetailsLabel")}</Typography>
      ),
      children: <AdditionalDetails previewData={previewData} />,
    },
  ];

  const activeIndex = tabs.map((_, index) => index);

  return (
    <div className="accordion-comp">
      <Accordion activeIndex={activeIndex} multiple>
        {tabs.map((tab, i) => (
          <AccordionTab key={i} header={tab.header} disabled={tab?.disabled}>
            {tab.children}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default MainAccordion;
