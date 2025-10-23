"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import FeatureGrid from "@/app/[locale]/_components/Cards/FeatureGrid";
import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import Tabs from "@/app/[locale]/_components/Common/Tabs";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import { productTabs } from "@/app/[locale]/_models/common";
import { useGetCategoryProductListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import Link from "next/link";
import { useEffect } from "react";

import { SectionProps } from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
import Button from "@/app/[locale]/_components/Buttons/Button";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import { ProductSortByEnum } from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  resetFilters,
  setProductsSortBy,
} from "@/app/[locale]/_store/reducers/filters_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
// import { ProductStage } from "@/app/[locale]/_interface/SalesProductInterface";

function TrendingNowProducts({ refQuery }: SectionProps) {
  const t = useTranslations("categoryPage");
  const isMobile = useIsMobile();
  const router = useRouter();
  const params = useParams();
  const category = typeof params?.category === "string" ? params.category : "";
  const { id } = parseCategoryString(category);
  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );
  const dispatch = useAppDispatch();
  type AvailableTab =
    | ProductSortByEnum.MostViewed
    | ProductSortByEnum.RecentlyListed
    | ProductSortByEnum.ExportInterest;

  const availableTabArray: AvailableTab[] = [
    ProductSortByEnum.MostViewed,
    ProductSortByEnum.RecentlyListed,
    ProductSortByEnum.ExportInterest,
  ];

  const productSort = useAppSelector((state) => state.filterData.productSort);

  // const [filterBy, setFilterBy] = useState("mostViewed");
  const {
    data: trendingProductList,
    isLoading: productLoading,
    isSuccess,
    isError,
    isFetching,
  } = useGetCategoryProductListQuery(
    {
      category_id: [id],
      specificSort: availableTabArray.includes(productSort as AvailableTab)
        ? productSort
        : "",
      page: 1,
      limit: 8,
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );
  const productList = trendingProductList?.data?.listData || [];
  const hasProducts = productList.length > 0;

  useEffect(() => {
    // return () => {
    //   if (productSort) {
    //     dispatch(setProductsSortBy(""));
    //   }
    // };
    dispatch(resetFilters());
    dispatch(setProductsSortBy(ProductSortByEnum.MostViewed));
  }, []);

  const setActiveTabs = (val: any) => {
    if (!availableTabArray.includes(val)) return;
    dispatch(setProductsSortBy(val));
  };
  return (
    <section className="section-block">
      <div className="s-b-head p-mob-pad">
        <div className="s-b-h-left">
          <div className="title-block">
            <Typography className="cat-title cat-title-md" variant="h2">
              {t("trending.title")}
            </Typography>
            <Typography className="cat-subtxt" variant="p">
              {t("trending.subTitle")}
            </Typography>
          </div>
          <Tabs
            className={"white-bg"}
            tabsName={productTabs}
            activeTab={productSort}
            // setListStatus={setFilterBy}
            setListStatus={setActiveTabs}
          />
        </div>
        <div className="s-b-h-right">
          <Link href={`/products?ref=${refQuery}`} className="mob-view-all">
            <RightArrowIcon />
          </Link>
          <FeatureGrid
            textOne={t("trending.sourcingTrends.label")}
            subTextOne={t("trending.sourcingTrends.description")}
            textTwo={t("trending.supplierSpotlight.label")}
            subTextTwo={t("trending.supplierSpotlight.description")}
            textThree={t("trending.marketInsights.label")}
            subTextThree={t("trending.marketInsights.description")}
            textFour={t("trending.categoryLeaders.label")}
            subTextFour={t("trending.categoryLeaders.description")}
          />
        </div>
      </div>
      {!productLoading && !isFetching && isSuccess ? (
        <>
          {hasProducts ? (
            !isMobile ? (
              <div className="cards-listing-group c-l-g-5">
                {productList.map((item: any, index: number) => (
                  <ProductListingCard
                    link={`/p/${item?.liveUrl}`}
                    key={index}
                    product={item}
                    refQuery={refQuery}
                  />
                ))}
              </div>
            ) : (
              <div className="mob-carousel pl-mob-pad">
                <ReusableSwiper
                  slides={productList}
                  slidesPerView={1.2}
                  spaceBetween={10}
                  loop={false}
                  freeMode={false}
                  navigation={false}
                  pagination={true}
                  paginationClass="r-s-pagination"
                  className="reusable-swiper"
                  breakpoints={{
                    320: {
                      slidesPerView: 1.2,
                      spaceBetween: 10,
                    },
                    390: {
                      slidesPerView: 1.5,
                      spaceBetween: 10,
                    },
                    540: {
                      slidesPerView: 1.8,
                      spaceBetween: 10,
                    },
                    600: {
                      slidesPerView: 2.2,
                      spaceBetween: 15,
                    },
                    800: {
                      slidesPerView: 3.2,
                      spaceBetween: 15,
                    },
                    991: {
                      slidesPerView: 4,
                      spaceBetween: 20,
                    },
                  }}
                  renderItem={(item: any, index: number) => (
                    <ProductListingCard
                      key={index}
                      product={item}
                      link={`/p/${item?.liveUrl}`}
                      refQuery={refQuery}
                    />
                  )}
                />
              </div>
            )
          ) : (
            <div className="error-message">
              <p>No Products</p>
            </div>
          )}
        </>
      ) : !isError ? (
        <div className="skel-cards-listing-group cards-listing-group c-l-g-5 pl-mob-pad">
          {Array.from({ length: 5 }).map((_, index) => {
            return <SkeletonProductCard key={index} />;
          })}
        </div>
      ) : (
        <div className="error-message">
          <p>Something went wrong while loading products.</p>
        </div>
      )}
      <div className="section-block-footer">
        <div className="s-b-f-left"></div>
        <div className="s-b-f-right">
          <Button
            onClick={() => router.push(`/products?ref=${refQuery}`)}
            className={"btn-outline bg-outline-dark"}
            text={t("trending.viewAll")}
          />
        </div>
      </div>
    </section>
  );
}

export default TrendingNowProducts;
