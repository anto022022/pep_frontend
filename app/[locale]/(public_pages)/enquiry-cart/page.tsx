"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import MobileMetaSetter from "@/app/[locale]/_components/Common/MobileMetaSetter";
import EnquiryCartList from "@/app/[locale]/_components/MarketComponents/EnquiryCart/EnquiryCartList";
import { EnquiryCartComponent } from "@/app/[locale]/_components/MarketComponents/EnquiryCartComponent";
import { useTranslations } from "next-intl";
import { useState } from "react";

const page = () => {
  const [categoryId, setCategoryId] = useState<string>("");
  const t = useTranslations("productDetailPage.enquiryCart");

  return (
    <div className="p-l-m-t-body">
      <div className="page-wrapper">
        <div className="p-w-main page-container category-page-main">
          <div className="page-header-wrapper">
            <div className="page-title-block">
              <Typography variant="h1" className="p-t-b-title">
                {t("title")}
              </Typography>
              {/* <InfoIcon /> */}
            </div>
          </div>
          <div className="section-block-group s-b-g-split">
            <MobileMetaSetter title={t("title")} path={"./"} />
            <EnquiryCartList setCategoryId={setCategoryId} />
            <EnquiryCartComponent categoryId={categoryId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
