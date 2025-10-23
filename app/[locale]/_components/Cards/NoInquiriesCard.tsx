import React from "react";
import Typography from "../Base/Typography";

import ComposeCard from "@/app/[locale]/_components/Cards/ComposeCard";
import { Dropdowndata } from "@/app/[locale]/_interface/ConnectInterface";
import { useTranslations } from "next-intl";
interface cardProps {
  listData: Dropdowndata[];
  id: string,
  pageType: string
}
const NoInquiresCard: React.FC<cardProps> = ({ listData, id,pageType }) => {
  const t = useTranslations("salesConnect.noInquiry")
  return (
    <div className="no-inquires-card-comp">
      <div className="noinquires-info-block">
        <Typography variant="h2" className="n-i-b-title">
          {t("title")}
        </Typography>
        <Typography variant="p" className="n-i-b-subtxt">
          {t("subTitle")}
        </Typography>
      </div>
      <ComposeCard data={listData} pageType={pageType} pageId={id}  />
    </div>
  );
};

export default NoInquiresCard;
