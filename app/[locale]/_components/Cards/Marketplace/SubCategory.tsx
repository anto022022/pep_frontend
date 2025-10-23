import React from "react";

import { ChevronRightIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
interface SubCategoryProps {
  name: string;
  marketValue: string | number;
  annualValue: string | number;
  averageValue: string | number;
  link: string;
  img: string;
  refQuery?: string;
}

const SubCategory: React.FC<SubCategoryProps> = ({
  name,
  marketValue,
  annualValue,
  averageValue,
  link,
  img,
  refQuery,
}) => {
  const t = useTranslations("categoryPage.subCategorySection");
  return (
    <Link
      href={{
        pathname: link,
        query: { ref: refQuery },
      }}
      className="sub-category-comp"
    >
      <div className="s-c-c-header">
        <span className="s-c-c-title">{name}</span>
        <ChevronRightIcon />
      </div>
      <div className="s-c-c-body">
        <div className="s-c-c-b-left stats-card">
          <div className="stat-item">
            <div className="stat-label">{t("marketSize")}</div>
            <div className="stat-value">{marketValue}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">{t("annualGrowth")}</div>
            <div className="stat-value">{annualValue}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">{t("averageMargin")}</div>
            <div className="stat-value">{averageValue}</div>
          </div>
        </div>
        <div className="s-c-c-b-right s-c-c-b-img">
          <Image
            src={getImageUrl(img)}
            alt={name}
            sizes="100vw"
            width={110}
            height={124}
          />
        </div>
      </div>
    </Link>
  );
};

export default SubCategory;
