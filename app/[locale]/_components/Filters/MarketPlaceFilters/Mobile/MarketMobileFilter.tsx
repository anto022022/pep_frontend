import MobileSidebarFilter from "@/app/[locale]/_components/Filters/MarketPlaceFilters/Mobile/MobileSidebarFilter";
import MobileSidebarSort from "@/app/[locale]/_components/Filters/MarketPlaceFilters/Mobile/MobileSidebarSort";
import {
  ArrowSwapIcon,
  FilterIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { FiltersModuleTypes } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

type MobileFilterProps = {
  type: FiltersModuleTypes;
  mappedId?: string;
};
export const MarketMobileFilter: React.FC<MobileFilterProps> = ({
  type,
  mappedId,
}) => {
  const t = useTranslations("categoryPage");
  const filterQueryLength = useAppSelector(
    (state) => state.filterData.filterQuery.length
  );
  const [isMobSortSidebarOpen, setIsMobSortSidebarOpen] =
    useState<boolean>(false);
  const [isMobFilterSidebarOpen, setIsMobFilterSidebarOpen] =
    useState<boolean>(false);
  return (
    <>
      <div className="p-l-m-footer">
        <>
          <div className="mob-filter-nav">
            <div
              className="bottom-nav"
              onClick={() => setIsMobSortSidebarOpen(true)}
            >
              <ArrowSwapIcon />
              <span className="b-n-txt">{t("common.sortBy")}</span>
            </div>
            <div
              className="bottom-nav"
              onClick={() => setIsMobFilterSidebarOpen(true)}
            >
              <FilterIcon />
              <span className="b-n-txt">{t("common.filterBy")}</span>
              {filterQueryLength > 0 && <span className="b-n-badge"></span>}
            </div>
          </div>
        </>
      </div>
      {isMobFilterSidebarOpen && (
        <MobileSidebarFilter
          open={isMobFilterSidebarOpen}
          setOpen={(val) => setIsMobFilterSidebarOpen(val)}
          type={type}
          mappedId={mappedId}
        />
      )}

      {isMobSortSidebarOpen && (
        <MobileSidebarSort
          open={isMobSortSidebarOpen}
          setOpen={(val) => setIsMobSortSidebarOpen(val)}
          type={type}
        />
      )}
    </>
  );
};
