import SupplierCard from "@/app/[locale]/_components/Cards/SupplierCard";
import SupplierDetails from "@/app/[locale]/_components/Cards/SupplierDetails";
import SkeletonSupplierCard from "@/app/[locale]/_components/Skeleton/SkeletonSupplierCard";
// import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import HomepageCards from "@/app/[locale]/_components/HomePageCards";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import CreateBuyingRequestDialog from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import {
  FilterModuleEnum,
  SupplierListItemInterface,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  useGetFeaturedSupplierListQuery,
  useGetFiltersListQuery,
} from "@/app/[locale]/_store/apiReducer/marketApi";
import { setIsAddPostBuyingRequestOpen } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { updateBreadcrumbTrail } from "@/app/[locale]/_utility/breadcrumbTrail";
import { useParams, useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";

interface SupplierListProps {
  isProductListView: string;
  activeIndex: number;
  refQuery?: string;
  specificSort: string;
}
const SupplierList: FC<SupplierListProps> = ({
  isProductListView,
  activeIndex,
  specificSort,
}) => {
  const [page, setPage] = useState(1);
  const [suppliers, setSuppliers] = useState<SupplierListItemInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const productSearchQuery = useAppSelector(
    (state) => state.filterData.productSearchQuery
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // const supplierFilters = useAppSelector(
  //   (state) => state.filterData.suppliersFilterData
  // );
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? undefined;
  const {
    categoryPaths: { category },
  } = updateBreadcrumbTrail(ref);

  const params = useParams();
  const subcategory =
    typeof params?.subcategory === "string" ? params.subcategory : "";

  const productCategory =
    typeof params?.productCategory === "string" ? params.productCategory : "";
  const { id: productCategory_id } = parseCategoryString(productCategory);

  const { id: subcategory_id } = parseCategoryString(subcategory);
  const supplierFilterListLength = useAppSelector(
    (state) => state.filterData.suppliersFilterData.length
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => dispatch(setIsAddPostBuyingRequestOpen(true)),
      onUnauthenticated: () => setUserSessionDialog(true),
    });
  };
  useGetFiltersListQuery(
    { type: "Suppliers" },
    {
      skip: supplierFilterListLength !== 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const login = useLoginRedirect();
  const filterQuery = useAppSelector(
    (state) => state.filterData.filterQuery[FilterModuleEnum.SUPPLIERS]
  );

  const {
    data: supplierList,
    isFetching,
    isLoading,
    isSuccess,
    isError,
  } = useGetFeaturedSupplierListQuery(
    {
      category_id: category ? [category] : undefined,
      subCategory_id: subcategory_id ? [subcategory_id] : undefined,
      productCategory_id: productCategory_id ? [productCategory_id] : undefined,
      specificSort,
      page,
      limit,
      filterBy: filterQuery,
      productSearch: productSearchQuery,
    },
    {
      skip: activeIndex !== 1,
    }
  );
  // const { prepareQueryFilter } = useFiltersData();
  const isFirstLoadDone = !isLoading && (suppliers.length > 0 || !hasMore);

  useEffect(() => {
    setSuppliers([]);
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
  }, [filterQuery, specificSort]);

  useEffect(() => {
    if (supplierList && isSuccess && activeIndex === 1) {
      const newSuppliers = supplierList?.data?.listData ?? [];
      setSuppliers((prev) =>
        page === 1 ? newSuppliers : [...prev, ...newSuppliers]
      );
      setHasMore(newSuppliers.length === limit);
    }
  }, [supplierList, isSuccess]);

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

    // useEffect(() => {
    //   prepareQueryFilter(supplierFilters);
    // }, []);

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
      {isProductListView == "Grid" && (
        <>
          {isFirstLoadDone ? (
            <>
              <div ref={scrollRef} style={{ height: "1px" }}></div>
              {suppliers?.length > 0 ? (
                <>
                  <div className="feature-supplier-grid">
                    {suppliers?.map((item: any, index: number) => (
                      <SupplierCard key={index} supplier={item} />
                    ))}
                  </div>
                  <div ref={sentinelRef} style={{ height: "1px" }} />
                </>
              ) : (
                // <>No Suppliers</>
                <>
                  <div className="no-items flex flex-col items-center justify-center p-6 text-gray-500">
                    {/* <Image
                      src={noProduct} // replace with your "no items" illustration
                      alt="No items"
                      className="w-40 h-40 mb-4 opacity-80"
                    /> */}
                    <p className="text-lg font-medium">
                      Currently, No Suppliers are listed. Explore other
                      categories listed below or{" "}
                      <span
                        className="text-blue-900 underline cursor-pointer"
                        onClick={handleClick}
                      >
                        {" "}
                        post your buying request
                      </span>{" "}
                    </p>
                    <p className="text-sm text-gray-400"></p>
                  </div>
                  <HomepageCards />
                </>
              )}
              {isFetching && (
                <div className="feature-supplier-grid">
                  {/* {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonSupplierCard key={index} />
                  ))} */}
                  Loading...
                </div>
              )}
            </>
          ) : (
            <div className="feature-supplier-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonSupplierCard key={index} />
              ))}
            </div>
          )}
        </>
      )}

      {isProductListView == "List" && (
        <>
          {isFirstLoadDone ? (
            <>
              {suppliers?.length > 0 ? (
                <>
                  <div ref={scrollRef} style={{ height: "1px" }}></div>
                  <div className="supplier-details-group">
                    {suppliers?.map((item, index) => (
                      <SupplierDetails key={index} supplier={item} />
                    ))}
                  </div>
                  <div ref={sentinelRef} style={{ height: "1px" }} />
                </>
              ) : (
                // <>No Suppliers</>
                <>
                  <div className="no-items flex flex-col items-center justify-center p-6 text-gray-500">
                    {/* <Image
                      src={noProduct} // replace with your "no items" illustration
                      alt="No items"
                      className="w-40 h-40 mb-4 opacity-80"
                    /> */}
                    <p className="text-lg font-medium">
                      Currently, No Suppliers are listed. Explore other
                      categories listed below or{" "}
                      <span
                        className="text-blue-900 underline cursor-pointer"
                        onClick={handleClick}
                      >
                        {" "}
                        post your buying request
                      </span>{" "}
                    </p>
                    <p className="text-sm text-gray-400"></p>
                  </div>
                  <HomepageCards />
                </>
              )}
              {/* SKELETON TO BE CHANGED ACC TO LIST VIEW*/}
              {isFetching && (
                <div className="feature-supplier-grid">
                  {/* {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonSupplierCard key={index} />
                  ))} */}
                  Loading...
                </div>
              )}
            </>
          ) : (
            <div className="feature-supplier-grid">
              {/* SKELETON TO BE CHANGED ACC TO LIST VIEW*/}
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonSupplierCard key={index} />
              ))}
            </div>
          )}
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

export default SupplierList;
