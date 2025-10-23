import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import HomepageCards from "@/app/[locale]/_components/HomePageCards";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import CreateBuyingRequestDialog from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import {
  FilterModuleEnum,
  ProductListInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useGetOfferDiscountListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { setIsAddPostBuyingRequestOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { updateBreadcrumbTrail } from "@/app/[locale]/_utility/breadcrumbTrail";
import noProduct from "@/assets/img/no-iteams.png";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";

interface SellOfferListProps {
  isProductListView: string;
  refQuery?: string;
  specificSort: string;
}

const SellOfferList: FC<SellOfferListProps> = ({
  isProductListView,
  refQuery,
  specificSort,
}) => {
  const [page, setPage] = useState(1);
  const [offers, setOffers] = useState<ProductListInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const login = useLoginRedirect();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );

  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const filterQuery = useAppSelector(
    (state) => state.filterData.filterQuery[FilterModuleEnum.OFFERS]
  );

  const ref = searchParams.get("ref") ?? undefined;
  const {
    categoryPaths: { category },
  } = updateBreadcrumbTrail(ref);

  const {
    data: sellOfferList,
    isFetching,
    isLoading,
    isError,
    isSuccess,
  } = useGetOfferDiscountListQuery(
    {
      category_id: category ? [category] : undefined,
      specificSort,
      page,
      limit,
      filterBy: filterQuery,
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );

  const isFirstLoadDone = !isLoading && (offers.length > 0 || !hasMore);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => dispatch(setIsAddPostBuyingRequestOpen(true)),
      onUnauthenticated: () => setUserSessionDialog(true),
    });
  };
  useEffect(() => {
    setOffers([]);
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
    if (sellOfferList && isSuccess) {
      const newProducts = sellOfferList?.data?.listData || [];
      setOffers((prev) =>
        page === 1 ? newProducts ?? [] : [...prev, ...(newProducts ?? [])]
      );
      setHasMore(newProducts.length === limit);
    }
  }, [sellOfferList, isSuccess]);

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
      {isFirstLoadDone ? (
        <>
          <div ref={scrollRef} style={{ height: "1px" }}></div>
          {offers?.length > 0 ? (
            <div
              className={
                isProductListView === "Grid"
                  ? "cards-listing-group c-l-g-autofill c-l-g-5"
                  : "list-view-group"
              }
            >
              {offers.map((item: ProductListInterface, index: number) => (
                <ProductListingCard
                  link={`/p/${item?.liveUrl}`}
                  key={index}
                  product={item}
                  refQuery={refQuery}
                  className={
                    isProductListView === "List"
                      ? "product-listing-card-comp-row"
                      : ""
                  }
                />
              ))}
            </div>
          ) : (
            // <>No Offers</>
            <>
              <div className="no-items flex flex-col items-center justify-center p-6 text-gray-500">
                {/* <Image
                  src={noProduct} // replace with your "no items" illustration
                  alt="No items"
                  className="w-40 h-40 mb-4 opacity-80"
                /> */}
                <p className="text-lg font-medium">
                  Currently, No Offers are listed. Explore other categories
                  listed below or{" "}
                  <span
                    className="text-blue-900 underline cursor-pointer"
                    onClick={handleClick}
                  >
                    {" "}
                    post your buying request
                  </span>{" "}
                </p>
                {/* <p className="text-sm text-gray-400">
                  Check back later for updates
                </p> */}
              </div>
              <HomepageCards />
            </>
          )}
          {isFetching && (
            <div
              className={
                isProductListView === "Grid"
                  ? "cards-listing-group c-l-g-autofill c-l-g-5"
                  : "list-view-group"
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
      ) : (
        <div
          className={
            isProductListView === "Grid"
              ? "cards-listing-group c-l-g-autofill c-l-g-5"
              : "list-view-group"
          }
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
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

export default SellOfferList;
