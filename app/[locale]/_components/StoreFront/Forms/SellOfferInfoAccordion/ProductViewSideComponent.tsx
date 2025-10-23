import { RowStatus } from "@/app/[locale]/_components/Common/dataTable/RowStatus";
import useProgressCalculation from "@/app/[locale]/_hooks/useProgressCalculation";
import { SellOfferPreviewData } from "@/app/[locale]/_interface/SellOfferInterface";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AnalyticsIcon } from "../../../Icons/SVGIcons";
import ProgressBar from "../../../Misc/ProgressBar";

const ProductViewSideComponent = ({
  previewData,
}: {
  previewData: SellOfferPreviewData;
}) => {
  const [percentageValue, setPercentageValue] = useState(0);
  const t = useTranslations("salesOffer.sideView");
  useEffect(() => {
    if (previewData?.sellOfferStage) {
      const percentage = useProgressCalculation(previewData?.sellOfferStage);
      setPercentageValue(percentage);
    }
  }, [previewData.sellOfferStage]);
  return (
    <aside className="l-p-l-b-right">
      <div className="box-shads-2 product-right-info">
        <div className="p-r-i-item">
          <ProgressBar percentageValue={percentageValue} label={""} />
        </div>
        {/* <div className="p-r-i-item">
          <div className="space-btwn">
            <div className="icon-label">
              <VisibilityIcon />
              <label className="i-l-txt" htmlFor="visibility">
                {t("visibility")}
              </label>
            </div>
            <ToggleInputs  htmlFor={'visibility'} />
            <ToggleInputs name='samplesFree' register={""} />
          </div>
        </div> */}
        <div className="p-r-i-item">
          <div className="space-btwn">
            <div className="icon-label">
              <AnalyticsIcon />
              <label className="i-l-txt" htmlFor="Analytics">
                {t("analytics")}
              </label>
            </div>
          </div>
          <div className="analytics-options">
            {/* <div className="a-o-item">
              <label className="a-o-i-label">{t("shares")}</label>
              <span className="a-o-i-txt">10</span>
            </div>
            <div className="a-o-item">
              <label className="a-o-i-label">{t("likes")}</label>
              <span className="a-o-i-txt">10</span>
            </div>
            <div className="a-o-item">
              <label className="a-o-i-label">{t("clicks")}</label>
              <span className="a-o-i-txt">530</span>
            </div> */}
            <div className="a-o-item">
              <label className="a-o-i-label">{t("view")}</label>
              <span className="a-o-i-txt">
                {previewData?.analytics?.views ?? 0}
              </span>
            </div>
          </div>
          {/* <div className="inquiries-request-block">
            <div className="previous-btn-comp">
              <button className="btn-comp btn-icon">
                <InquiriesIcon />
              </button>
              <div className="i-r-b-i-info">
                <span className="i-r-b-i-i-label">{t("inquiries")}</span>
                <span className="i-r-b-i-i-txt">4</span>
              </div>
            </div>
            <ButtonIconLeftOutline
              name={t("see_requests")}
              className={"bg-outline-grey"}
            ></ButtonIconLeftOutline>
          </div> */}
        </div>
        <div className="p-r-i-item">
          <div className="icon-label">
            <label className="i-l-txt" htmlFor="Status">
              {t("status")}
            </label>
          </div>
          <RowStatus rowData={previewData} status={previewData.status} />
        </div>
        <div className="p-r-i-item">
          <button
            className="btn-comp btn-c-primary wid-100 btn-c-dark re-post-btn"
            disabled
          >
            <span className="b-c-txt">{t("re_post")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProductViewSideComponent;
