"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import RatingStar from "@/app/[locale]/_components/Common/RatingStar";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import Image from "next/image";
import { TabPanel, TabView } from "primereact/tabview";
import { FC, useEffect, useState } from "react";

import Loading from "@/app/[locale]/(pages)/(authentication)/onboard/loading";
import AddReviewDialog from "@/app/[locale]/_components/OverLay/AddReviewDialog";
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { GlobalRatings } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  EndorsmentFlagEnum,
  ReviewFlagEnum,
} from "@/app/[locale]/_interface/review";
import { ratingList, sortingList } from "@/app/[locale]/_models/common";
import {
  useCreateReviewMutation,
  useGetReviewsListQuery,
  useUpdateReviewMutation,
} from "@/app/[locale]/_store/apiReducer/reviewsApi";
import buyerEndorsementBadge from "@/assets/img/icons/endorsed-buyer.svg";
import verifiedPurchaseBadge from "@/assets/img/icons/verified-purchase.svg";

export const ReviewComponent: FC<{
  productId: string;
  globalRatings: GlobalRatings;
}> = ({ productId, globalRatings }) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeReviewFilter, setReviewFilter] = useState(0);
  const [successImportDialog, setSuccessImportDialog] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [isEndorse, setIsEndorse] = useState(false);
  const [reviewFlag, setReviewFlag] = useState<ReviewFlagEnum | null>(null);
  const { data, isLoading } = useGetReviewsListQuery({
    productId,
    page: 1,
    limit: 10,
    // status: ReviewStatusEnum.PENDING,
  });

  const reviewData = data?.data?.data?.listData?.result || [];

  // useEffect(() => {
  //   console.log("DATA", reviewData);
  // }, [reviewData]);

  const [updateReview] =
    useUpdateReviewMutation();
  const [createReview] =
    useCreateReviewMutation();
  const [endorsmentFlag, setEndorsmentFlag] = useState<EndorsmentFlagEnum>(
    EndorsmentFlagEnum.UNVERIFIED_PURCHASE
  );

  const handleClose = () => {
    setIsEndorse(false);
    setIsReview(false);
  };
  const handleReviewSubmit = (rating: number, text: string) => {
    createReview({
      productId,
      rating,
      review: text,
      endorsmentFlag: endorsmentFlag,
    });
    handleClose();
    setSuccessImportDialog(true);
    setTimeout(() => {
      setSuccessImportDialog(false);
    }, 2000);
  };

  useEffect(() => {
    if (!isReview) {
      setEndorsmentFlag(EndorsmentFlagEnum.ENDORSED_BY_BUYER);
    } else {
      setEndorsmentFlag(EndorsmentFlagEnum.UNVERIFIED_PURCHASE);
    }
  }, [isReview]);

  const averageRating = Math.floor(globalRatings?.averageRating) ?? "-";
  return (
    <>
      <div className="detail-box-wrapper reviews-box">
        <div className="r-b-head">
          <div className="r-b-h-left">
            <Typography variant="h6" className="d-b-w-title">
              Customer Feedback
            </Typography>
          </div>
          <div className="r-b-h-right">
            <Button
              className={"btn-outline bg-outline-dark"}
              text={"Endorse"}
              onClick={() => {
                setIsEndorse(true);
              }}
            />
            <Button
              className={"btn-c-primary"}
              text={"Add Review"}
              onClick={() => {
                setIsReview(true);
              }}
            />
          </div>
        </div>
        <div className="reviews-comp">
          <div className="tabs-block-group">
            <div className="tabs-block">
              <Button
                className={`btn-outline ${activeIndex == 0 ? "active" : ""}`}
                text={"All"}
                onClick={() => setActiveIndex(0)}
              />
              {/* <Button
                                className={`btn-outline ${activeIndex == 1 ? "active" : ""
                                    }`}
                                text={" Reviews"}
                                onClick={() => setActiveIndex(1)}
                            />
                            <Button
                                className={`btn-outline ${activeIndex == 2 ? "active" : ""
                                    }`}
                                text={"Endorsements"}
                                onClick={() => setActiveIndex(2)}
                            /> */}
            </div>
            <Typography variant="span" className="r-c-helper-txt">
              Real feedback from buyers who trust this business and its
              products.
            </Typography>
          </div>
          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="r-c-tabview"
          >
            <TabPanel className="tab-panel">
              <div className="overall-rating-list-block">
                <div className="overall-rating-filters-block">
                  {averageRating && (
                    <div className="overall-rating-block">
                      <Typography variant="h5" className="o-r-b-txt">
                        {averageRating}
                      </Typography>
                      <div className="star-rating-global">
                        <div className="star-statis">
                          <RatingStar value={averageRating} readOnly />
                          <Typography variant="span" className="statis-txt">
                            {averageRating >= 4
                              ? "Satisfied"
                              : averageRating >= 3
                                ? "Good"
                                : averageRating >= 1
                                  ? "Average"
                                  : "No Ratings yet"}
                          </Typography>
                        </div>
                        <Typography
                          variant="span"
                          className="global-rating-txt"
                        >
                          {globalRatings?.totalRatings} global ratings
                        </Typography>
                      </div>
                    </div>
                  )}
                  <div className="reviews-filters">
                    <div className="r-f-left">
                      <div className="filters-list-group">
                        <span
                          className={`badge-comp ${activeReviewFilter == 0 ? "active" : ""
                            }`}
                          onClick={() => setReviewFilter(0)}
                        >
                          All
                        </span>
                        <span
                          className={`badge-comp ${activeReviewFilter == 1 ? "active" : ""
                            }`}
                          onClick={() => setReviewFilter(1)}
                        >
                          With photos/videos (1)
                        </span>
                      </div>
                      <Select
                        options={ratingList}
                        placeholder={"Ratings"}
                        panelClassName={"custom-dropdown"}
                        className={"rounded-select"}
                        value={activeReviewFilter}
                        onChange={(e) => setReviewFilter(e.value)}
                      />
                    </div>
                    <div className="r-f-right">
                      <Select
                        options={sortingList}
                        placeholder={"Sort By"}
                        value={activeIndex}
                        onChange={(e) => setActiveIndex(e.value)}
                      />
                    </div>
                  </div>
                </div>
                {!isMobile ? (
                  <>
                    {reviewData.length > 0 && (
                      <div className="reviews-list-group">
                        {reviewData.map((item: any, index: number) => {
                          return (
                            <div className="reviews-item" key={index}>
                              <div className="r-i-header">
                                <div className="r-i-h-left">
                                  <div className="review-profile-info-block">
                                    <div className="r-p-i-b-img">
                                      <Typography
                                        variant="span"
                                        className="r-p-i-b-i-txt"
                                      >
                                        {item.reviewerName}
                                      </Typography>
                                    </div>
                                    <div className="r-p-i-b-details">
                                      <Typography
                                        variant="span"
                                        className="r-p-i-b-d-name"
                                      >
                                        {item.reviewerName}
                                      </Typography>
                                      {item.endorsmentFlag ===
                                        EndorsmentFlagEnum.VERIFIED_PURCHASE && (
                                          <Image
                                            src={verifiedPurchaseBadge}
                                            alt="Verified Purchase"
                                            width={12}
                                            height={12}
                                          ></Image>
                                        )}
                                      {item.endorsmentFlag ===
                                        EndorsmentFlagEnum.ENDORSED_BY_BUYER && (
                                          <Image
                                            src={buyerEndorsementBadge}
                                            alt="Verified Purchase"
                                            width={12}
                                            height={12}
                                          ></Image>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                <div className="r-i-h-right">
                                  <Typography
                                    variant="span"
                                    className="r-p-i-date"
                                  >
                                    {/* {item.createdAt.toLocaleDateString()} */}
                                  </Typography>
                                </div>
                              </div>
                              <div className="r-i-body">
                                <div className="rating-review-content">
                                  <RatingStar value={item.rating} readOnly />
                                  <Typography variant="p" className="r-r-c-txt">
                                    {item.review}
                                  </Typography>
                                </div>
                                <div className="help-report-group">
                                  <Button
                                    text="Helpful"
                                    onClick={() => {
                                      updateReview({
                                        reviewId: item._id,
                                        isHelpful: !item.isHelpful,
                                      });
                                    }}
                                    className={`btn-outline ${item.isHelpful ? "active" : ""
                                      }`}
                                  />
                                  <Select
                                    options={Object.values(ReviewFlagEnum).map(
                                      (item) => ({
                                        name: item,
                                        value: item,
                                      })
                                    )}
                                    placeholder={"Report"}
                                    panelClassName={"custom-dropdown"}
                                    className={"rounded-select"}
                                    value={reviewFlag}
                                    onChange={(e) => {
                                      setReviewFlag(e.value);
                                      updateReview({
                                        reviewId: item._id,
                                        flag: e.value,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {reviewData.length > 0 && (
                      <div className="reviews-list-group">
                        {reviewData
                          .slice(0, 1)
                          .map((item: any, index: number) => {
                            return (
                              <div className="reviews-item" key={index}>
                                <div className="r-i-header">
                                  <div className="r-i-h-left">
                                    <div className="review-profile-info-block">
                                      <div className="r-p-i-b-img">
                                        <Typography
                                          variant="span"
                                          className="r-p-i-b-i-txt"
                                        >
                                          {item.reviewerName}
                                        </Typography>
                                      </div>
                                      <div className="r-p-i-b-details">
                                        <Typography
                                          variant="span"
                                          className="r-p-i-b-d-name"
                                        >
                                          {item.reviewerName}
                                        </Typography>
                                        <Image
                                          src={verifiedPurchaseBadge}
                                          alt="Verified Purchase"
                                          width={127}
                                          height={20}
                                        ></Image>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="r-i-h-right">
                                    <Typography
                                      variant="span"
                                      className="r-p-i-date"
                                    >
                                      {/* {item.createdAt.toLocaleDateString()} */}
                                    </Typography>
                                  </div>
                                </div>
                                <div className="r-i-body">
                                  <div className="rating-review-content">
                                    <RatingStar value={item.rating} readOnly />
                                    <Typography
                                      variant="p"
                                      className="r-r-c-txt"
                                    >
                                      {item.review}
                                    </Typography>
                                  </div>
                                  <div className="help-report-group">
                                    <Button
                                      text={
                                        item.isHelpful
                                          ? "Helpful"
                                          : "Not Helpful"
                                      }
                                      onClick={() => {
                                        updateReview({
                                          reviewId: item._id,
                                          isHelpful: !item.isHelpful,
                                        });
                                      }}
                                      className={`btn-outline ${item.isHelpful ? "active" : ""
                                        }`}
                                    />
                                    <Select
                                      options={Object.values(
                                        ReviewFlagEnum
                                      ).map((item) => ({
                                        name: item,
                                        value: item,
                                      }))}
                                      placeholder={"Report"}
                                      panelClassName={"custom-dropdown"}
                                      className={"rounded-select"}
                                      value={reviewFlag}
                                      onChange={(e) => {
                                        setReviewFlag(e.value);
                                        updateReview({
                                          reviewId: item._id,
                                          flag: e.value,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        {/* <div
                                                    className="view-all-reviews-btn"
                                                    onClick={() => {
                                                        dispatch(
                                                            setIsAllReviewssidebarOpen(true)
                                                        )
                                                    }}
                                                >
                                                    <span className="v-a-r-b-txt">
                                                        View All Reviews
                                                    </span>
                                                    <ViewAllRightIcon />
                                                </div> */}
                      </div>
                    )}
                  </>
                )}
                {isLoading && <Loading />}
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <AddReviewDialog
        title={"Write a Review"}
        isShow={isReview}
        productId={productId}
        onClose={handleClose}
        handleSubmit={handleReviewSubmit}
      />
      <AddReviewDialog
        title={"Endorse Product"}
        isShow={isEndorse}
        productId={productId}
        onClose={handleClose}
        handleSubmit={handleReviewSubmit}
      />

      <SuccessDialog
        visible={successImportDialog}
        title={"Thank you for your review!"}
        subTxt={
          "Thank you for your feedback! Your review has been successfully submitted and will be visible once approved."
        }
      />
    </>
  );
};
