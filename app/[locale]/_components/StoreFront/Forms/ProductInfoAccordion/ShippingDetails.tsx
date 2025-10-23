"use client";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";

const ShippingDetails = ({ previewData }: { previewData: PreviewData }) => {
  const t = useTranslations("salesProduct.viewPage.shippingDetails");

  return (
    <div className="tabs-content">
      <div className="two-col-layout">
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("shippingModes")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.shippingMethod
              ? `${previewData?.shippingMethod} `
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("portOfDispatch")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.portOfDispatch
              ? `${previewData?.portOfDispatch} `
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("incoterms")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.incoTerms ? `${previewData?.incoTerms} ` : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("packagingType")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.shippingUnit ? `${previewData?.shippingUnit} ` : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("packagingType")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.shippingUnit ? `${previewData?.shippingUnit} ` : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("shippingInternationally")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.internationalShipping
              ? `${previewData?.internationalShipping} `
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("unitsPerPackage")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.shippingQty ? `${previewData?.shippingQty} ` : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("dispatchLeadTime")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.dispatchLeadTime?.min_day
              ? `Ships in ${previewData?.dispatchLeadTime?.min_day} Days`
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("HSN")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.shipmentIdentifier
              ? `${previewData?.shipmentIdentifier} `
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
