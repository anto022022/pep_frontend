"use client";
import PaymentMethodPipe from "@/app/[locale]/_components/Pipe/PaymentMethodPipe";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";

const ProductTradeInformation = ({
  previewData,
}: {
  previewData: PreviewData;
}) => {
  const t = useTranslations("salesProduct.viewPage.tradeDetails");

  return (
    <div className="tabs-content">
      <div className="two-col-layout">
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("productionLeadTime")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.productionLeadTime?.min_day &&
            previewData?.productionLeadTime?.max_day
              ? `${previewData.productionLeadTime.min_day}-${previewData.productionLeadTime.max_day} Days`
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("samplePrice")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.samplesAvailability?.samplePrice
              ? `${previewData?.samplesAvailability?.samplePrice}/${previewData?.samplesAvailability?.sampleUnit}`
              : "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("availableStock")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.stockAvailability
              ? `${previewData?.stockAvailability}`
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("sampleLeadTime")}
          </label>
          <span className="t-f-g-txt">
            
              {previewData?.samplesAvailability?.sampleLeadTime?.min_day &&
            previewData?.samplesAvailability?.sampleLeadTime?.max_day
              ? `${previewData.samplesAvailability.sampleLeadTime.min_day}-${previewData.samplesAvailability.sampleLeadTime.max_day} Days`
              : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("productionCapacity")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.productionCapacity?.quantity
              ? `${previewData?.productionCapacity?.quantity}  ${previewData?.productionCapacity?.unit}/${previewData?.productionCapacity?.duration}`
              : "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("paymentTerms")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.paymentTerms ? `${previewData?.paymentTerms} ` : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("sampleAvailability")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.samplesAvailability?.availabilityType === "noSample"
              ? "No"
              : `Yes - ${previewData?.samplesAvailability?.availabilityType}`}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("paymentMethod")}
          </label>
          <span className="t-f-g-txt">
            <PaymentMethodPipe value={previewData?.paymentMethods ?? []} />
          </span>
        </div>
        {/* <div className="tabs-form-group">
          <label htmlFor="FOB Price" className="t-f-g-label">
            Shipping & Packaging
          </label>
          <span className="t-f-g-txt">
            {previewData?.shippingType
              ? getShippingNameByValue(previewData?.shippingType, locale)
              : "No Shipping Types"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Slab Based Pricing" className="t-f-g-label">
            Accepted Payment Type
          </label>
          <span className="t-f-g-txt">
            {previewData?.paymentMethods &&
            previewData?.paymentMethods.length > 0
              ? previewData.paymentMethods
                  .map((method) => getPaymentLabelById(method, locale))
                  .join(", ")
              : "No Payment Methods"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="MOQ" className="t-f-g-label">
            Shipping Method
          </label>
          <span className="t-f-g-txt">
            {previewData?.shippingMethod
              ? getShippmentMethodLableById(previewData?.shippingMethod, locale)
              : "No Shippnig methods"}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default ProductTradeInformation;
