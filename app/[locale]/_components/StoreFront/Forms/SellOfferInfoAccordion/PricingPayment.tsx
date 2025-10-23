"use client";
import { SellOfferPreviewData } from "@/app/[locale]/_interface/SellOfferInterface";
import {
  paymentMethodsData,
  shippingMethodsData,
} from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";

const PricingPayment = ({
  previewData,
}: {
  previewData: SellOfferPreviewData;
}) => {
  const shippingMethods: any = previewData.shippingMethod;
  const t = useTranslations("salesOffer.viewPage.pricingPayment");
  const salesProduct = useTranslations("salesProduct");

  return (
    <div className="tabs-content">
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("paymentTerm")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.paymentTerms && previewData.paymentTerms.length > 0
            ? previewData.paymentTerms.map((item, index) => (
              <span key={index}>
                {item}
                {index !== previewData.paymentTerms.length - 1 && ", "}
              </span>
            ))
            : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("paymentMethod")}
        </label>
        <span
          className="t-f-g-txt"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
        >
          {previewData?.paymentMethods && previewData.paymentMethods.length > 0
            ? previewData.paymentMethods.map((id, index) => {
              const method = paymentMethodsData.find(
                (item) => item.id === id
              );
              return (
                <div
                  className="t-f-g-wrapper gap-10px"
                  key={index}
                  title={method?.label || ""}
                >
                  {method?.icon}
                </div>
              );
            })
            : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("shippingModes")}
        </label>
        <span
          className="t-f-g-txt"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
        >
          {previewData?.shippingMethod && previewData?.shippingMethod.length > 0
            ? previewData?.shippingMethod.map((id, index) => {
              const method = shippingMethodsData.find(
                (item) => item.id === id
              );

              const showDivider = shippingMethods.length > 1;
              return (
                <div
                  className="t-f-g-wrapper gap-10px"
                  key={index}
                  title={method?.label || ""}
                >
                  {/* {method?.label}
                    {method?.icon} */}
                  <div className={`t-f-g-wrapper ${showDivider && index < shippingMethods.length - 1
                      ? "divider-border-right"
                      : ""
                    }`}>
                    {method?.icon}
                    <span className="t-f-g-txt">
                      {" "}
                      {salesProduct(method?.label)}
                    </span>
                  </div>
                </div>
              );
            })
            : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("dispatchLeadTime")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.dispatchLeadTime
            ? ` Ships in ${previewData?.dispatchLeadTime?.min_day}-${previewData?.dispatchLeadTime?.max_day} Days`
            : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("shipsInternationally")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.internationalShipping
            ? previewData?.internationalShipping
            : ""}
        </span>
      </div>
    </div>
  );
};

export default PricingPayment;
