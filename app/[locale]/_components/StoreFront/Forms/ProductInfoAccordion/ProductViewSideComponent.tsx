import { RowStatus } from "@/app/[locale]/_components/Common/dataTable/RowStatus";
import useProgressCalculation from "@/app/[locale]/_hooks/useProgressCalculation";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AnalyticsIcon, InquiriesIcon } from "../../../Icons/SVGIcons";
import ProgressBar from "../../../Misc/ProgressBar";

const ProductViewSideComponent = ({
  previewData,
  isRePostBtnHide = false,
}: {
  previewData: PreviewData;
  isRePostBtnHide?: boolean;
}) => {
  const [percentageValue, setPercentageValue] = useState(0);
  const t = useTranslations("salesProduct.viewPage");

  useEffect(() => {
    if (previewData?.productStage) {
      const percentage = useProgressCalculation(previewData?.productStage);
      setPercentageValue(percentage);
    }
  }, [previewData.productStage]);

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
                Visibility
              </label>
            </div>
            <ToggleInputs  htmlFor={'visibility'} />
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
              <label className="a-o-i-label">Shares</label>
              <span className="a-o-i-txt">10</span>
            </div>
            <div className="a-o-item">
              <label className="a-o-i-label">Likes</label>
              <span className="a-o-i-txt">10</span>
            </div>
            <div className="a-o-item">
              <label className="a-o-i-label">Clicks</label>
              <span className="a-o-i-txt">530</span>
            </div> */}
            <div className="a-o-item">
              <label className="a-o-i-label">{t("view")}</label>
              <span className="a-o-i-txt">
                {previewData?.analytics?.views ?? 0}
              </span>
            </div>
          </div>
          {previewData?.leadsReceived > 0 && (
            <div className="inquiries-request-block">
              <div className="previous-btn-comp">
                <button className="btn-comp btn-icon">
                  <InquiriesIcon />
                </button>
                <div className="i-r-b-i-info">
                  <span className="i-r-b-i-i-label">{t("leads")}</span>
                  <span className="i-r-b-i-i-txt">
                    {previewData?.leadsReceived}
                  </span>
                </div>
              </div>
              {/* <ButtonIconLeftOutline
              name={"See Requests"}
              className={"bg-outline-grey"}
            ></ButtonIconLeftOutline> */}
            </div>
          )}
        </div>
        <div className="p-r-i-item">
          <div className="icon-label">
            <label className="i-l-txt" htmlFor="Status">
              {t("status")}
            </label>
          </div>
          <RowStatus rowData={previewData} status={previewData.status} />
        </div>
        {!isRePostBtnHide && (
          <div className="p-r-i-item">
            <button
              className="btn-comp btn-c-primary wid-100 btn-c-dark re-post-btn"
              disabled
            >
              <span className="b-c-txt">{t("rePost")}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProductViewSideComponent;
