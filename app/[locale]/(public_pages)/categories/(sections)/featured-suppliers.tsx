"use client";

import { useGetFeaturedSupplierListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import Typography from "@/app/[locale]/_components/Base/Typography";
import SupplierCard from "@/app/[locale]/_components/Cards/SupplierCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
// import Tabs from "@/app/[locale]/_components/Common/Tabs";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import SkeletonSupplierCard from "@/app/[locale]/_components/Skeleton/SkeletonSupplierCard";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
// import { supplierTabs } from "@/app/[locale]/_models/common";
import { SupplierSortByEnum } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
// import { useAppDispatch } from "@/app/[locale]/_store/store";
// import { setSupplierSortBy } from "@/app/[locale]/_store/reducers/filters_store";

function FeaturedSuppliers() {
  const t = useTranslations("categoryPage");
  const isMobile = useIsMobile();
  const params = useParams();
  // const dispatch = useAppDispatch();
  const category = typeof params?.category === "string" ? params.category : "";
  const { id } = parseCategoryString(category);
  // type AvailableTab =
  //   | SupplierSortByEnum.TopManufacturer
  //   | SupplierSortByEnum.HighlyEngaged
  //   | SupplierSortByEnum.MostRecommended;

  // const availableTabArray: AvailableTab[] = [
  //   SupplierSortByEnum.TopManufacturer,
  //   SupplierSortByEnum.HighlyEngaged,
  //   SupplierSortByEnum.MostRecommended,
  // ];
  // const supplierSort = useAppSelector((state) => state.filterData.supplierSort);
  const {
    data: featuredSupplierList,
    isLoading,
    isSuccess,
    isError,
    isFetching,
  } = useGetFeaturedSupplierListQuery({
    category_id: [id],
    specificSort: SupplierSortByEnum.HighlyEngaged,
    page: 1,
    limit: 4,
  });
  const supplierList = featuredSupplierList?.data?.listData || [];
  const hasSuppliers = supplierList.length > 0;

  // const setActiveTabs = (val: any) => {
  //   if (!availableTabArray.includes(val)) return;
  //   dispatch(setSupplierSortBy(val));
  // };

  return (
    <section className="section-block">
      <div className="s-b-head p-mob-pad">
        <div className="s-b-h-left s-b-left-alone">
          <div className="title-block">
            <Typography className="cat-title cat-title-md" variant="h2">
              {t("featuredSuppliers.title")}
            </Typography>
            <Typography className="cat-subtxt" variant="p">
              {t("featuredSuppliers.description")}
            </Typography>
          </div>
          {/* <Tabs
            className={"white-bg"}
            tabsName={supplierTabs}
            activeTab={supplierSort}
            setListStatus={setActiveTabs}
          /> */}
        </div>
        <div className="s-b-h-right">
          <Link href={""} className="mob-view-all">
            <RightArrowIcon />
          </Link>
        </div>
      </div>
      {!isLoading && !isFetching && isSuccess ? (
        <>
          {hasSuppliers ? (
            !isMobile ? (
              <div className="feature-supplier-grid">
                {supplierList.map((item: any, index: number) => {
                  return <SupplierCard key={index} supplier={item} />;
                })}
              </div>
            ) : (
              <div className="mob-carousel pl-mob-pad">
                <ReusableSwiper
                  slides={supplierList}
                  slidesPerView={"auto"}
                  spaceBetween={10}
                  loop={false}
                  freeMode={false}
                  navigation={false}
                  pagination={true}
                  paginationClass="r-s-pagination"
                  className="reusable-swiper mob-feature-supplier-swiper"
                  renderItem={(item: any, index: number) => (
                    <SupplierCard key={index} supplier={item} />
                  )}
                />
              </div>
            )
          ) : (
            <div className="error-message">
              <p>No Suppliers</p>
            </div>
          )}
        </>
      ) : !isError ? (
        <div className="skel-cards-listing-group cards-listing-group c-l-g-5 pl-mob-pad">
          {Array.from({ length: 5 }).map((_, index) => {
            return <SkeletonSupplierCard key={index} />;
          })}
        </div>
      ) : (
        <div className="error-message">
          <p>Something went wrong while loading suppliers.</p>
        </div>
      )}
    </section>
  );
}

export default FeaturedSuppliers;
