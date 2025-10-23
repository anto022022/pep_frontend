"use client";
// import Typography from "@/app/[locale]/_components/Base/Typography";
import CompanyDetails from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/CompanyDetails";
import MainAccordion from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailAccordion/MainAccordion";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { productTabKeyToFields } from "@/app/[locale]/_models/marketModels";
import ProductDescription from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailAccordion/ProductDescription";

const ProductInformation: React.FC<ProductDetailPageProps> = ({
  productData,
}) => {
  const t = useTranslations("productDetailPage");
  const [activeTabId, setActiveTabId] = useState<ProductTabKeyType | null>(
    null
  );

  const [tabs, setTabs] = useState<ProductTabItemInterface[]>([]);
  const defaultTabs: ProductTabItemInterface[] = [
    { key: "description", label: t("description") },
    { key: "specifications", label: t("specification.label") },
    { key: "applications", label: t("application") },
    { key: "tradeDetail", label: t("tradeDetails.label") },
    { key: "paymentTerms", label: t("paymentTerms.label") },
    { key: "shippingLogistics", label: t("shipping.label") },
    { key: "certificates", label: t("certificates") },
  ];
  useEffect(() => {
    filterTabsByProduct();
  }, [productData]);

  const handleTabClick = (tabId: ProductTabKeyType) => {
    setActiveTabId(tabId);
  };

  function filterTabsByProduct() {
    const productKeys = Object.keys(productData);
    setTabs(
      defaultTabs.filter((tab) => {
        const requiredKeys = productTabKeyToFields[tab.key] || [];
        return requiredKeys.some((field) => productKeys.includes(field));
      })
    );
  }

  return (
    <section className="section-block section-margin-minus">
      <div className="tabs-accordion-block">
        {/* Tabs Row */}
        <div className="detail-navs-block">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleTabClick(tab.key);
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Description Section */}
        {productData?.detailedDescription && (
          <ProductDescription description={productData.detailedDescription} />
        )}

        {/* Accordion */}
        <MainAccordion productData={productData} activeTabId={activeTabId} />
        <CompanyDetails productData={productData} />
      </div>
    </section>
  );
};

export default ProductInformation;
