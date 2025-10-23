"use client";
import PostNeedsCard, {
  BuyingRequestValues,
} from "@/app/[locale]/_components/Cards/PostNeedsCard";
import HomepageCards from "@/app/[locale]/_components/HomePageCards";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import CreateBuyingRequestDialog from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { FilterModuleEnum } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useGetBuyingRequestListQuery } from "@/app/[locale]/_store/apiReducer/postBuyingRequestApi";
import { setIsAddPostBuyingRequestOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import noProduct from "@/assets/img/no-iteams.png";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
interface RFQListProps {
  refQuery?: string;
  specificSort: string;
}
const RfqList: FC<RFQListProps> = ({ refQuery, specificSort }) => {
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState<BuyingRequestValues[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );
  const dispatch = useAppDispatch();
  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const login = useLoginRedirect();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => dispatch(setIsAddPostBuyingRequestOpen(true)),
      onUnauthenticated: () => setUserSessionDialog(true),
    });
  };
  const filterQuery = useAppSelector(
    (state) => state.filterData.filterQuery[FilterModuleEnum.RFQ]
  );

  const {
    data: requestList,
    isFetching,
    isLoading,
    isError,
    isSuccess,
  } = useGetBuyingRequestListQuery(
    {
      specificSort,
      page,
      limit,
      filterBy: filterQuery,
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );

  const isFirstLoadDone = !isLoading && (requests.length > 0 || !hasMore);

  useEffect(() => {
    // setRequests([]);
    setPage(1);
    setHasMore(true);
    if (scrollRef.current) {
      const rect = scrollRef.current.getBoundingClientRect();
      const isInView =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (!isInView) {
        scrollRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [filterQuery, specificSort, currencyCode]);

  useEffect(() => {
    if (requestList && isSuccess) {
      const newProducts = requestList?.data?.listData || [];
      setRequests((prev) =>
        page === 1 ? newProducts ?? [] : [...prev, ...(newProducts ?? [])]
      );
      setHasMore(newProducts.length === limit);
    }
  }, [requestList, isSuccess]);

  useEffect(() => {
    if (!isFirstLoadDone || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
          debounceTimeout.current = setTimeout(() => {
            setPage((prev) => prev + 1);
          }, 300); // 300ms delay
        }
      },
      {
        root: null,
        threshold: 1.0,
      }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [isFirstLoadDone, hasMore, isFetching]);

  if (isError) {
    return <>Something went wrong</>;
  }

  return (
    <>
      {/* {isLoading==false && (requests.length > 0 || !hasMore) ? (
        <>
          {requests?.length > 0 ? (
            <>
              <div className={"cards-listing-group c-l-g-autofill c-l-g-5"}>
                {requests.map((item: BuyingRequestValues, index: number) => (
                  <PostNeedsCard
                    link={`/rfqs/${item?._id}`}
                    key={index}
                    reqData={item}
                    refQuery={refQuery}
                  />
                ))}
              </div>
              <div ref={sentinelRef} style={{ height: "1px" }} />
            </>
          ) : (
            <>No Requests</>
          )}
          {!isFetching && (
            <div
              className={
                // isProductListView === "Grid"?
                "cards-listing-group c-l-g-autofill c-l-g-5"
                // : "list-view-group"
              }
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))}
              Loading...
            </div>
          )}
        </>
      ) : (
        <div
          className={
            // isProductListView === "Grid"?
            "cards-listing-group c-l-g-autofill c-l-g-5"
            // : "list-view-group"
          }
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      )} */}

      {!isFirstLoadDone ? (
        <div className={"cards-listing-group c-l-g-autofill c-l-g-5"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {requests.length > 0 ? (
            <>
              <div ref={scrollRef} style={{ height: "1px" }}></div>
              <div className={"cards-listing-group c-l-g-autofill c-l-g-5"}>
                {requests.map((item: BuyingRequestValues, index: number) => (
                  <PostNeedsCard
                    link={`/rfqs/${item?._id}`}
                    key={index}
                    reqData={item}
                    refQuery={refQuery}
                  />
                ))}
              </div>
              <div ref={sentinelRef} style={{ height: "1px" }} />
            </>
          ) : (
            // <div>No Requests</div>
            <>
              <div className="no-items flex flex-col items-center justify-center p-6 text-gray-500">
                {/* <Image
                  src={noProduct} // replace with your "no items" illustration
                  alt="No items"
                  className="w-40 h-40 mb-4 opacity-80"
                /> */}

                <p className="text-lg font-medium">
                  Currently, No Request for Quotation (RFQ) items are listed.
                  Explore other categories listed below or{" "}
                  <span onClick={handleClick}>post your buying request</span>{" "}
                </p>
                <p className="text-sm text-gray-400"></p>
              </div>
              <HomepageCards />
            </>
          )}

          {isFetching && (
            <div
              className={
                //isProductListView === "Grid"
                "cards-listing-group c-l-g-autofill c-l-g-5"
                //: "list-view-group"
              }
            >
              {/* {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))} */}
              Loading...
            </div>
          )}
          <div ref={sentinelRef} style={{ height: "1px" }}></div>
        </>
      )}
      <AlertDialog
        visible={userSessionDialog}
        subTxt="You have to Login to Quote"
        continueOnclick={() => {
          setUserSessionDialog(false);
          login();
        }}
        cancelOnclick={() => {
          setUserSessionDialog(false);
        }}
      />
      <CreateBuyingRequestDialog />
    </>
  );
};

export default RfqList;
