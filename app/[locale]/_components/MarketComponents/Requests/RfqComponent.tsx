"use client";

import WhyBusiness from "@/app/[locale]/(public_pages)/categories/(sections)/why-business";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import BreadCrumbs from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import PageBarTitle from "@/app/[locale]/_components/Common/PageBarTitle";
import { MarketMobileFilter } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/Mobile/MarketMobileFilter";
import { SelectedFiltersTab } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/SelectedFiltersTab";
import { FilterIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import FilterSidebar from "@/app/[locale]/_components/MarketComponents/FilterSidebar";
import RfqList from "@/app/[locale]/_components/MarketComponents/Requests/RFQList";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { rfqSortingList } from "@/app/[locale]/_models/common";
import { useGetFiltersListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { setRfqSortBy } from "@/app/[locale]/_store/reducers/filters_store";
import { setIsFilterSideBarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import {
  BreadcrumbItemWithRef,
  updateBreadcrumbTrail,
} from "@/app/[locale]/_utility/breadcrumbTrail";
import BarImage from "@/public/img/page-bar-img.svg";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const RfqComponent = () => {
  const dispatch = useAppDispatch();
  const { isFilterSidebarOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const t = useTranslations("categoryPage.rfq");
  const [refQuery, setRefQuery] = useState<string>("");
  const [breadCrumpData, setBreadCrumpData] = useState<BreadcrumbItemWithRef[]>(
    []
  );
  const rfqSort = useAppSelector((state) => state.filterData.rfqSort);
  const rfqFiltersLength = useAppSelector(
    (state) => state.filterData.rfqFilterData.length
  );
  useGetFiltersListQuery(
    { type: "RFQ" },
    {
      skip: rfqFiltersLength !== 0,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const ref = searchParams.get("ref") ?? undefined;

    const { refQuery, breadCrumpData } = updateBreadcrumbTrail(ref, {
      type: "sc-2",
      name: "RFQS",
      path: "rfqs",
    });

    setRefQuery(refQuery);
    setBreadCrumpData(breadCrumpData);
  }, [searchParams]);

  return (
    <>
      <div className="p-l-m-t-body">
        <PageBarTitle name={t("title")} image={BarImage} />
        <div
          className={`page-wrapper page-wrapper-with-side-filter ${
            isFilterSidebarOpen ? "sidebar-close" : ""
          }`}
        >
          <div className="p-w-sidebar">
            <FilterSidebar type="RFQ" mappedId={""} />
          </div>
          <div className="p-w-main page-container category-page-main category-detail-page-main">
            <BreadCrumbs data={breadCrumpData} />
            <div className="section-block-group">
              <div className="overview-filter-block">
                <section className="section-block cate-info-tabs-block">
                  <div className="s-b-head">
                    <div className="s-b-h-left">
                      <div className="title-block sub-cat-title-block">
                        <Typography className="cat-title" variant="h1">
                          {t("title")}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="tabs-block-group"></div>
                </section>

                <section className="section-block filter-list-sort-block p-mob-pad">
                  <div className="s-b-head">
                    <div className="s-b-h-left filter-list-group">
                      <ButtonIconLeftOutline
                        className={
                          "bg-outline-grey btn-filter-select filter-btn"
                        }
                        onClick={() =>
                          dispatch(setIsFilterSideBarOpen(!isFilterSidebarOpen))
                        }
                      >
                        <FilterIcon />
                      </ButtonIconLeftOutline>
                      <SelectedFiltersTab type="RFQ" />
                    </div>
                    <div className="s-b-h-right">
                      <Select
                        options={rfqSortingList}
                        value={rfqSort}
                        onChange={(val) => dispatch(setRfqSortBy(val))}
                        placeholder={"Sort by relevance"}
                      />
                    </div>
                  </div>
                  <RfqList refQuery={refQuery} specificSort={rfqSort} />
                </section>
              </div>
              <WhyBusiness />
            </div>
          </div>
        </div>
      </div>
      {isMobile && <MarketMobileFilter type={"RFQ"} mappedId={""} />}
    </>
  );
};
