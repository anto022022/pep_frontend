"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import BreadCrumbs from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import MobileMetaSetter from "@/app/[locale]/_components/Common/MobileMetaSetter";
import Tabs from "@/app/[locale]/_components/Common/Tabs";
import { MarketMobileFilter } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/Mobile/MarketMobileFilter";
import { SelectedFiltersTab } from "@/app/[locale]/_components/Filters/MarketPlaceFilters/SelectedFiltersTab";
import { FilterIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import FilterSidebar from "@/app/[locale]/_components/MarketComponents/FilterSidebar";
import SellOfferList from "@/app/[locale]/_components/MarketComponents/Offers/SellOfferList";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { catDetailTabs, offerSortingList } from "@/app/[locale]/_models/common";
import { useGetFiltersListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { setOfferSortBy } from "@/app/[locale]/_store/reducers/filters_store";
import {
  setIsFilterSideBarOpen,
  setOfferListView,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import {
  BreadcrumbItemWithRef,
  updateBreadcrumbTrail,
} from "@/app/[locale]/_utility/breadcrumbTrail";
import { getMetaFromBreadcrumbs } from "@/app/[locale]/_utility/getMetaFromBreadcrumbs ";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";

export const OfferComponent: FC = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const offerListView = useAppSelector((state) => state.uiData.offerListView);
  const [refQuery, setRefQuery] = useState<string>("");
  const [breadCrumpData, setBreadCrumpData] = useState<BreadcrumbItemWithRef[]>(
    []
  );
  const offerSort = useAppSelector((state) => state.filterData.offerSort);
  const offerFiltersLength = useAppSelector(
    (state) => state.filterData.offersFilterData.length
  );
  const { isFilterSidebarOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );
  useGetFiltersListQuery(
    { type: "Offers" },
    {
      skip: offerFiltersLength !== 0,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    const ref = searchParams.get("ref") ?? undefined;

    const { refQuery, breadCrumpData } = updateBreadcrumbTrail(ref, {
      type: "sc-2",
      name: "Offers",
      path: "offers",
    });

    setRefQuery(refQuery);
    setBreadCrumpData(breadCrumpData);
    // setCategory(category);
  }, [searchParams]);

  const { title, path } = getMetaFromBreadcrumbs(breadCrumpData);

  return (
    <>
      <div
        className={`page-wrapper page-wrapper-with-side-filter ${
          isFilterSidebarOpen ? "sidebar-close" : ""
        }`}
      >
        {/* <div className={`page-wrapper ${isFiltersidebarOpen ? 'sidebar-close' : ''}`}> */}
        <div className="p-w-sidebar">
          <FilterSidebar type="Offers" mappedId={""} />
        </div>
        <div className="p-w-main page-container category-page-main category-detail-page-main">
          <MobileMetaSetter title={title} path={path} />
          <BreadCrumbs data={breadCrumpData} />
          <div className="section-block-group">
            <div className="overview-filter-block">
              <section className="section-block cate-info-tabs-block">
                <div className="s-b-head">
                  <div className="s-b-h-left">
                    <div className="title-block sub-cat-title-block">
                      <Typography className="cat-title" variant="h1">
                        {"Offers"}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="tabs-block-group">
                  <div className="tabs-block">
                    {/* <button className="btn-comp btn-outline active">
                      <span className="btn-comp btn-outline active">dfs</span>
                    </button> */}
                    <div
                      style={{
                        padding: "10.5px 0",
                        lineHeight: "24px",
                        width: "40%",
                      }}
                    >
                      <span className="btn-comp btn-outline active"></span>
                    </div>
                  </div>
                  <Tabs
                    tabsName={catDetailTabs}
                    isIcon={true}
                    className="grid-view-switch"
                    activeTab={offerListView}
                    setListStatus={(val) => {
                      dispatch(setOfferListView(val));
                    }}
                  />
                </div>
              </section>

              <section className="section-block filter-list-sort-block p-mob-pad">
                <div className="s-b-head">
                  <div className="s-b-h-left filter-list-group">
                    {!isMobile && (
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
                    )}
                    <SelectedFiltersTab type="Offers" />
                  </div>
                  <div className="s-b-h-right">
                    <Tabs
                      tabsName={catDetailTabs}
                      isIcon={true}
                      className="grid-view-switch"
                      activeTab={offerListView}
                      setListStatus={(val) => {
                        dispatch(setOfferListView(val));
                      }}
                    />
                    <Select
                      options={offerSortingList}
                      value={offerSort}
                      onChange={(val) => {
                        dispatch(setOfferSortBy(val));
                      }}
                      placeholder={"Sort by relevance"}
                    />
                  </div>
                </div>
                <SellOfferList
                  refQuery={refQuery}
                  isProductListView={offerListView}
                  specificSort={offerSort}
                />
              </section>
            </div>
          </div>
        </div>
      </div>

      {isMobile && <MarketMobileFilter type="Offers" mappedId={""} />}
    </>
  );
};
