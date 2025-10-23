import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
// import useFiltersData from "@/app/[locale]/_hooks/useFiltersData";
import HomepageCards from "@/app/[locale]/_components/HomePageCards";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import CreateBuyingRequestDialog from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import { FilterModuleEnum } from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  useGetCategoryProductListQuery,
  useGetFiltersListQuery,
  useGetProductCategoryListQuery,
} from "@/app/[locale]/_store/apiReducer/marketApi";
import { setProductListPageNo } from "@/app/[locale]/_store/reducers/filters_store";
import {
  setIsAddPostBuyingRequestOpen,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { updateBreadcrumbTrail } from "@/app/[locale]/_utility/breadcrumbTrail";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";

interface ProductListProps {
  isProductListView?: string;
  activeIndex: number;
  refQuery?: string;
  isProduct?: boolean;
  // specificSort: string;
}

const ProductList: FC<ProductListProps> = ({
  isProductListView,
  activeIndex,
  refQuery,
  // specificSort,
}) => {
  // const [page, setPage] = useState(1);
  const page = useAppSelector((state) => state.filterData.productListPageNo);
  const [products, setProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const limit = 10;
  const productSearchQuery = useAppSelector(
    (state) => state.filterData.productSearchQuery
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const login = useLoginRedirect();
  const currencyCode = useAppSelector((state) => state.location.currency);
  const productFiltersLength = useAppSelector(
    (state) => state.filterData.productsFilterData.length
  );

  const searchParams = useSearchParams();
  // const productFilters = useAppSelector(
  //   (state) => state.filterData.productsFilterData
  // );

  const params = useParams();
  const subcategory =
    typeof params?.subcategory === "string" ? params.subcategory : "";
  const { id: subcategory_id } = parseCategoryString(subcategory);

  const productCategory =
    typeof params?.productCategory === "string" ? params.productCategory : "";
  const { id: productCategory_id } = parseCategoryString(productCategory);

  const filterQuery = useAppSelector(
    (state) => state.filterData.filterQuery[FilterModuleEnum.PRODUCTS]
  );
  const dispatch = useAppDispatch();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => dispatch(setIsAddPostBuyingRequestOpen(true)),
      onUnauthenticated: () => login(),
    });
  };
  useGetFiltersListQuery(
    { type: "Products" },
    {
      skip: productFiltersLength !== 0,
      refetchOnMountOrArgChange: true,
    }
  );

  // const { prepareQueryFilter } = useFiltersData();

  // const specificSort = useAppSelector((state) => state.filterData.specificSort);
  const ref = searchParams.get("ref") ?? undefined;
  const {
    categoryPaths: { category },
  } = updateBreadcrumbTrail(ref);

  const productSort = useAppSelector((state) => state.filterData.productSort);

  const {
    data: categoryProductList,
    isFetching,
    isLoading,
    isError,
    isSuccess,
  } = useGetCategoryProductListQuery(
    {
      category_id: category ? [category] : undefined,
      subCategory_id: subcategory_id ? [subcategory_id] : undefined,
      productCategory_id: productCategory_id ? [productCategory_id] : undefined,
      specificSort: productSort,
      page,
      limit,
      filterBy: filterQuery,
      currencyCode: currencyCode ?? "",
      productSearch: productSearchQuery,
    },
    {
      skip: activeIndex === 1 || !currencyCode,
    }
  );
  
  const isFirstLoadDone = !isLoading && (products.length > 0 || !hasMore);

  useEffect(() => {
    // debugger;
    setProducts([]);
    // setPage(1);
    dispatch(setProductListPageNo(1));
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
  }, [filterQuery, productSort, currencyCode]);

  useEffect(() => {
    // debugger;
    if (categoryProductList && isSuccess) {
      const newProducts = categoryProductList?.data?.listData || [];
      setProducts((prev) =>
        page === 1 ? newProducts ?? [] : [...prev, ...(newProducts ?? [])]
      );
      setHasMore(newProducts.length === limit);
    }
  }, [categoryProductList, isSuccess]);

  useEffect(() => {
    if (!isFirstLoadDone || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
          debounceTimeout.current = setTimeout(() => {
            dispatch(setProductListPageNo(page + 1));
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

  // useEffect(() => {
  //   prepareQueryFilter(productFilters);
  // }, []);

  useEffect(() => {
    if (isError) {
      dispatch(
        showToast({
          title: "Error",
          message: "Something went wrong",
          theme: "error",
        })
      );
    }
  }, [isError, dispatch]);

  return (
    <>
      {!isFirstLoadDone ? (
        <div
          className={
            isProductListView === "Grid"
              ? "cards-listing-group c-l-g-autofill c-l-g-5"
              : "list-view-group"
          }
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </div>
      ) : (
        <>
          <div ref={scrollRef} style={{ height: "1px" }}></div>
          {products.length > 0 ? (
            <>
              <div
                className={
                  isProductListView === "Grid"
                    ? "cards-listing-group c-l-g-autofill c-l-g-5"
                    : "list-view-group"
                }
              >
                {products.map((item, index) => (
                  <ProductListingCard
                    key={index}
                    link={`/p/${item?.liveUrl}`}
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
              <div ref={sentinelRef} style={{ height: "1px" }} />
            </>
          ) : (
            // <div>No Products</div>
            <>
              <div className="no-items flex flex-col items-center justify-center p-6 text-gray-500">
                {/* <Image
                  src={noProduct} // replace with your "no items" illustration
                  alt="No items"
                  className="w-40 h-40 mb-4 opacity-80"
                /> */}

                <p className="text-lg font-medium">
                  Currently, no products are listed. Explore other categories
                  listed below or{" "}
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

export default ProductList;
