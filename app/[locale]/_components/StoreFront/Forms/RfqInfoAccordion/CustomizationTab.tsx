import { RfqData } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
import { FC } from "react";


interface RfqProps {
  previewData?: RfqData | null
}

const CustomizationTab: FC<RfqProps> = ({ previewData }) => {
  const t = useTranslations("categoryPage.rfq.detailPage.customization");
  return (
    <div className="tabs-content">
      <div className="two-col-layout">
        <div className="tabs-form-group">
          <label htmlFor="Production Capacity" className="t-f-g-label">
            {t("title")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.customizationRequired ? "Required" : "Not Required"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Pricing" className="t-f-g-label">
            {t("sample")}
          </label>
          <span className="t-f-g-txt">
            {previewData?.sampleRequired ? "Required" : "Not Required"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomizationTab;
