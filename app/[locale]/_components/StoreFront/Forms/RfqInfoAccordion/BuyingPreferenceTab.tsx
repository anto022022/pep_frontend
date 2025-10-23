import { RfqData } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
import { FC } from "react";

export interface RfqProps {
  previewData?: RfqData | null
}

const BuyingPreferenceTab: FC<RfqProps> = ({ previewData }) => {
  const t = useTranslations("categoryPage.rfq.detailPage.buyingTab")
  return (
    <div className="tabs-content">
      <div className="two-col-layout">
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("sourcing")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.preferredSourcingRegion ?? "-"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("delivery")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.expectedDeliveryTime ?? "-"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("port")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.destinationPort ?? "-"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("contract")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.supplyContractType ?? "-"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("payment")}
          </label>
          <span className="t-f-g-txt">{previewData?.paymentTerms ?? "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default BuyingPreferenceTab;
