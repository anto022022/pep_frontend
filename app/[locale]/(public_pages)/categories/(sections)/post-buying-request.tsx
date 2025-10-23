"use client";

import { SectionProps } from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import FeatureGrid from "@/app/[locale]/_components/Cards/FeatureGrid";
import PostNeedsCard from "@/app/[locale]/_components/Cards/PostNeedsCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import AddPostBuyingRequest from "@/app/[locale]/_components/OverLay/AddPostBuyingRequest";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import { useGetBuyingRequestListQuery } from "@/app/[locale]/_store/apiReducer/postBuyingRequestApi";
import { setIsAddPostBuyingRequestOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
function PostBuyingRequest({ refQuery }: SectionProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("categoryPage");
  const isMobile = useIsMobile();

  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );

  const params = useParams();
  const category = typeof params?.category === "string" ? params.category : "";
  const { id } = parseCategoryString(category);

  const {
    data: postNeedsListData,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useGetBuyingRequestListQuery(
    {
      filterBy: { companyName: "test" },
      page: 1,
      limit: 4,
      category_id: [id],
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );

  const postNeedsList = postNeedsListData?.data?.listData || [];
  const hasPostNeedList = postNeedsList.length > 0;
  const { isAddPostBuyingRequestOpen } =
    useAppSelector((state: RootState) => state.uiData);
  return (
    <>
      <section className="section-block">
        <div className="s-b-head p-mob-pad">
          <div className="s-b-h-left">
            <div className="title-block">
              <Typography className="cat-title cat-title-md" variant="h3">
                {t("postRequest.title")}
              </Typography>
              <Typography className="cat-subtxt" variant="p">
                {t("postRequest.description")}
              </Typography>
            </div>
          </div>
          <div className="s-b-h-right">
            <Link href={"/rfqs"} className="mob-view-all">
              <RightArrowIcon />
            </Link>
            <FeatureGrid
              subTextOne={t("postRequest.seller")}
              subTextTwo={t("postRequest.time")}
              subTextThree={t("postRequest.offer")}
              subTextFour={t("postRequest.network")}
            />
          </div>
        </div>
        {!isLoading && !isFetching && isSuccess ? (
          <>
            {hasPostNeedList ? (
              !isMobile ? (
                <div className="cards-listing-group c-l-g-5">
                  {postNeedsList.map((item: any, index: number) => {
                    return (
                      <PostNeedsCard
                        key={index}
                        reqData={item}
                        link={`/rfqs/${item?._id}`}
                        refQuery={refQuery}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="mob-carousel pl-mob-pad">
                  <ReusableSwiper
                    slides={postNeedsList}
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
                      410: {
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
                      <PostNeedsCard
                        key={index}
                        reqData={item}
                        link={`/rfqs/${item?._id}`}
                        refQuery={refQuery}
                      />
                    )}
                  />
                </div>
              )
            ) : (
              <div className="error-message">
                <p>Something went wrong while loading requests.</p>
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
            <p>Something went wrong while loading suppliers.</p>
          </div>
        )}
        <div className="section-block-footer">
          <div className="s-b-f-left"></div>
          <div className="s-b-f-right">
            <Button
              onClick={() => dispatch(setIsAddPostBuyingRequestOpen(true))}
              className={"btn-c-primary"}
              text={t("postRequest.post")}
            />
            <Link href={"/rfqs?ref=" + refQuery}>
              <Button
                onClick={() => {}}
                className={"btn-outline bg-outline-dark"}
                text={t("postRequest.explore")}
              />
            </Link>
          </div>
        </div>
      </section>

      {isAddPostBuyingRequestOpen && <AddPostBuyingRequest />}
    </>
  );
}

export default PostBuyingRequest;
