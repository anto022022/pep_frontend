"use client";

import { SectionProps } from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import FeatureGrid from "@/app/[locale]/_components/Cards/FeatureGrid";
import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import { useGetOfferDiscountListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

function OffersDiscounts({ refQuery }: SectionProps) {
  const t = useTranslations("categoryPage");
  const isMobile = useIsMobile();
  const router = useRouter();
  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );

  const params = useParams();
  const category = typeof params?.category === "string" ? params.category : "";
  const { id } = parseCategoryString(category);
  const {
    data: dealCardListData,
    isLoading: dealLoading,
    isSuccess,
    isError,
    isFetching,
  } = useGetOfferDiscountListQuery(
    {
      category_id: [id],
      specificSort: "mostViewed",
      page: 1,
      limit: 4,
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );

  const dealCardList = dealCardListData?.data?.listData || [];
  const hasDeals = dealCardList.length > 0;
  if (dealLoading || isFetching) {
    return (
      <div className="skel-cards-listing-group cards-listing-group c-l-g-5 pl-mob-pad">
        {Array.from({ length: 5 }).map((_, index) => {
          return <SkeletonProductCard key={index} />;
        })}
      </div>
    );
  }
  if (isError || !hasDeals) {
    return <></>;
  }
  return (
    <section className="section-block">
      <div className="s-b-head p-mob-pad">
        <div className="s-b-h-left">
          <div className="title-block">
            <Typography className="cat-title cat-title-md" variant="h3">
              {t("offersAndDiscounts.title")}
            </Typography>
            <Typography className="cat-subtxt" variant="p">
              {t("offersAndDiscounts.description")}
            </Typography>
          </div>
        </div>
        <div className="s-b-h-right">
          <Link href={`/offers?ref=${refQuery}`} className="mob-view-all">
            <RightArrowIcon />
          </Link>
          <FeatureGrid
            textOne={t("offersAndDiscounts.deals")}
            textTwo={t("offersAndDiscounts.offers")}
            textThree={t("offersAndDiscounts.categories")}
            textFour={t("offersAndDiscounts.discounts")}
          />
        </div>
      </div>
      {!dealLoading && !isFetching && isSuccess ? (
        <>
          {hasDeals ? (
            !isMobile ? (
              <div className="cards-listing-group c-l-g-5">
                {dealCardList.map((item: any, index: number) => {
                  return (
                    <ProductListingCard
                      link={`/p/${item?.liveUrl}`}
                      key={index}
                      product={item}
                      refQuery={refQuery}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mob-carousel pl-mob-pad">
                <ReusableSwiper
                  slides={dealCardList}
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
                      link={`/p/${item?.liveUrl}`}
                      key={index}
                      product={item}
                      refQuery={refQuery}
                    />
                  )}
                />
              </div>
            )
          ) : (
            <div className="error-message">
              <p>Something went wrong while loading products.</p>
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
          <p>Something went wrong while loading offers.</p>
        </div>
      )}
      <div className="section-block-footer">
        <div className="s-b-f-left"></div>
        <div className="s-b-f-right">
          <Button
            onClick={() => router.push(`/offers?ref=${refQuery}`)}
            className={"btn-outline bg-outline-dark"}
            text={t("offersAndDiscounts.viewAll")}
          />
        </div>
      </div>
    </section>
  );
}

export default OffersDiscounts;
