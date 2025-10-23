"use client";

import React from "react";

import Typography from "@/app/[locale]/_components/Base/Typography";
import { useTranslations } from "next-intl";
import Image from "next/image";
import graph from "../../../../public/img/graph-svg.svg";

interface CategoryOverviewProps {
  marketSize?: string | number;
  annualGrowth?: string | number;
  avgMargin?: string | number;
}

const CategoryOverview: React.FC<CategoryOverviewProps> = ({
  marketSize,
  annualGrowth,
  avgMargin,
}) => {
  const t = useTranslations("categoryPage.subCategorySection");
  return (
    <div className="category-overview-card">
      <div className="c-o-c-item">
        <Typography className="c-o-c-i-label">{t("marketSize")}</Typography>
        <Typography className="c-o-c-i-value">{marketSize || "--"}</Typography>
      </div>
      <div className="c-o-c-item">
        <Typography className="c-o-c-i-label">{t("annualGrowth")}</Typography>
        <Typography className="c-o-c-i-value">
          {annualGrowth || "--"}
        </Typography>
      </div>
      <div className="c-o-c-item">
        <Typography className="c-o-c-i-label">{t("averageMargin")}</Typography>
        <Typography className="c-o-c-i-value">{avgMargin || "--"}</Typography>
      </div>
      <div className="c-o-c-item">
        <Image src={graph} width={93} height={38} sizes="100vw" alt="Chart" />
      </div>
    </div>
  );
};

export default CategoryOverview;
