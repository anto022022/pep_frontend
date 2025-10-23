"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import PostNeedsCard from "@/app/[locale]/_components/Cards/PostNeedsCard";
import { RfqDetailCard } from "@/app/[locale]/_components/Cards/RfqDetailCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import RfqAccordion from "@/app/[locale]/_components/StoreFront/Forms/RfqAccordion";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { RfqData } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useGetBuyingRequestDetailsQuery } from "@/app/[locale]/_store/apiReducer/buyingRequestApi";
import { useGetBuyingRequestListQuery } from "@/app/[locale]/_store/apiReducer/postBuyingRequestApi";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

export interface DetailProps {
  id: string;
}
export const RfqDetailPage: FC<DetailProps> = ({ id }) => {
  const isMobile = useIsMobile();

  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );

  const {
    data: rfqApiData,
    isLoading: rfqLoading,
    isError: rfqError,
  } = useGetBuyingRequestDetailsQuery(id ?? undefined, { skip: !id });
  const [days, setDays] = useState<number>(0);
  const [rfqData, setRfqData] = useState<RfqData | null>(null);

  useEffect(() => {
    if (rfqApiData) {
      const { data } = rfqApiData;
      setRfqData(data ?? {});
    }
    validityFn();
  }, [rfqApiData]);

  const {
    data: postNeedsListData,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useGetBuyingRequestListQuery(
    {
      filterBy: { companyName: "test" },
      page: 2,
      limit: 14,
      category_id: ["CAee40f0e5be"],
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );
  const t = useTranslations("categoryPage.rfq.detailPage");

  // const validTill = data?.validityDate ? data?.validityDate : '-';
  const postNeedsList = postNeedsListData?.data?.listData || [];
  const hasPostNeedList = postNeedsList.length > 0;
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const today = new Date();
  const validityFn = () => {
    if (rfqData?.createdAt) {
      const posted = new Date(rfqData?.createdAt);
      const diffMs = today.getTime() - posted.getTime();
      setDays(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }
  };

  const startDate = new Date(rfqData?.createdAt);
  const currentDate = new Date();
  const diffInMs = currentDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    // Scroll after short delay to ensure accordion renders
    setTimeout(() => {
      const el = document.querySelector(`[data-tab-id="${tabId}"]`);
      if (el) {
        const yOffset = -40; // adjust this value to your fixed header height
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200);
  };

  return (
    <div className="p-l-m-t-body">
      <div className="page-wrapper">
        <div className="p-w-main page-container category-page-main">
          <div className="section-block-group s-b-g-split">
            <div className="s-b-g-left">
              <section className="section-block rfq-header-section">
                <div className="rfq-header-top">
                  <div className="rfq-tag-box">
                    <span className="rfq-label">{t("title")}</span>
                    {diffInDays > 0 && (
                      <span className="rfq-posted-time">
                        {t("posted")} {diffInDays} {t("days")}
                      </span>
                    )}
                  </div>

                  {rfqData?.validityDate && (
                    <div className="rfq-valid-till">
                      <span className="valid-date-text">{t("valid")} </span>
                      <span className="valid-date">
                        <DatePipe value={rfqData?.validityDate} type="date" />
                      </span>
                    </div>
                  )}
                </div>
                <div className="rfq-title-image-wrapper">
                  <div className="rfq-title-block">
                    <Typography variant="h3" className="rfq-title">
                      {rfqData?.rfqTitle ?? "RFQ Title"}
                    </Typography>
                    <p className="rfq-description">
                      {rfqData?.additionalBuyingReqDetails}
                    </p>
                  </div>

                  {rfqData?.productImageSrc?.src && (
                    <div className="rfq-image-box">
                      <Image
                        src={getImageUrl(rfqData?.productImageSrc?.src)}
                        width={300}
                        height={240}
                        sizes="100vw"
                        // src={rfqData?.productImage[0]?.src ?? ""}
                        alt={rfqData?.productImageSrc?.alt || "RFQ image"}
                        className="rfq-image"
                      />
                    </div>
                  )}
                </div>
              </section>

              <section className="section-block product-description-box">
                <Typography variant="h4" className="section-title">
                  {t("description")}
                </Typography>

                <div className="product-description-content">
                  <p>{rfqData?.productDescription}</p>

                  {/* <ul className="product-spec-list">
                                        <li><strong>Material:</strong> Genuine leather</li>
                                        <li><strong>Size range:</strong> S to XXL</li>
                                        <li><strong>Color options:</strong> Black, brown</li>
                                        <li><strong>Delivery timeline:</strong> Within 30 days</li>
                                    </ul> */}

                  {/* <button className="show-more-btn">{t("showMore")}</button> */}
                </div>
              </section>

              <section className="section-block section-margin-minus">
                <div className="tabs-accordion-block">
                  <div className="detail-navs-block">
                    <Link
                      href={"#buyingPreferences"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick("buyingPreference");
                      }}
                    >
                      {t("buying")}
                    </Link>
                    <Link
                      href={"#customization"}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTabClick("customization");
                      }}
                    >
                      {t("sampling")}
                    </Link>
                  </div>

                  <RfqAccordion
                    previewData={rfqApiData?.data}
                    activeTabId={activeTabId}
                  />
                </div>
              </section>
            </div>
            <div className="s-b-g-right">
              <div className="product-detail-card-sticky">
                <RfqDetailCard data={rfqData} />
              </div>
            </div>
          </div>
          <div className="section-block-group ">
            <section className="section-block product-list-block">
              <div className="s-b-head p-mob-pad">
                <div className="s-b-h-left">
                  <div className="title-block">
                    <Typography className="cat-title cat-title-sm" variant="h4">
                      {t("related")}
                    </Typography>
                  </div>
                </div>
              </div>
              {postNeedsList ? (
                <>
                  <ReusableSwiper
                    slides={postNeedsList}
                    slidesPerView={"auto"}
                    spaceBetween={10}
                    slidesOffsetAfter={0}
                    loop={false}
                    freeMode={true}
                    navigation={false}
                    pagination={false}
                    paginationClass="r-s-pagination"
                    className="reusable-swiper card-max-width"
                    renderItem={(item: any, index: number) => {
                      return (
                        <PostNeedsCard
                          key={index}
                          reqData={item}
                          link={`rfqs/${item?.liveUrl}`}
                        />
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="skel-cards-max-width">
                    {Array.from({ length: 5 }).map((_, index) => {
                      return <SkeletonProductCard key={index} />;
                    })}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
