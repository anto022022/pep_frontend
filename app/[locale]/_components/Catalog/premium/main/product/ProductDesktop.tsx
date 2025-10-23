/**
 * ProductDesktop
 *
 * Responsibilities:
 * - Fetch and display product groups (tabs)
 * - Fetch paginated product list for active group + subdomain
 * - Maintain local product list (append on pagination, replace on reset)
 * - Expose simple UI for group selection and "Load more"
 *
 * Notes for future improvements:
 * - Add loading state
 */

import React, { useEffect, useRef, useState } from "react";

// Components
import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";

// Interfaces
import { SalesProductListInterface } from "@/app/[locale]/_interface/SalesProductInterface";

// Store / API
import {
  useGetCatalogProductsListPublicQuery,
  useGetProductGroupBySubdomainQuery,
  useUpdateCatalogImpressionsMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";

const ROW_LIMIT = 10;
const SUBDOMAIN = "rahul-store"; // <-- consider passing as prop if needed

const ProductDesktop: React.FC = () => {
  // Local UI state
  const [products, setProducts] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>(""); // empty = all groups
  const [hasMoreProducts, setHasMoreProducts] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Query params state used by RTK Query hook
  const [queryParams, setQueryParams] = useState<SalesProductListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: ROW_LIMIT,
    searchQuery: "",
    itemStatus: "",
  });

  // A ref to detect whether we should append or replace products when new data arrives.
  // We append only when page > 1. When page === 1 we replace (useful after group change).
  const prevPageRef = useRef<number>(queryParams.page);

  // RTK Query: products listing
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    refetch: refetchProducts,
  } = useGetCatalogProductsListPublicQuery(
    { ...queryParams, subdomain: SUBDOMAIN, groupId: activeGroup },
    {
      skip: !SUBDOMAIN,
      refetchOnMountOrArgChange: true,
    }
  );

  // RTK Query: product groups
  const { data: productGroupData } = useGetProductGroupBySubdomainQuery(
    { subDomain: SUBDOMAIN },
    {
      skip: !SUBDOMAIN,
      refetchOnMountOrArgChange: true,
    }
  );

  // Impression update mutation (placeholder usage)
  const [updateImpressions] = useUpdateCatalogImpressionsMutation();

  /**
   * Effect: handle productsData arrival
   * - If page === 1 => replace products
   * - If page > 1 => append products
   * - Determine hasMoreProducts based on returned count vs limit
   */
  useEffect(() => {
    const result = productsData?.data?.listData?.result;
    const returnedCount = Array.isArray(result) ? result.length : 0;
    const currentPage = queryParams.page;

    // Stop loading more when data arrives
    setIsLoadingMore(false);

    if (result) {
      if (currentPage === 1) {
        // First page or reset: replace
        setProducts(result);
      } else {
        // Append while avoiding duplicates (by 'id' if present or by index)
        setProducts((prev) => {
          // If items have an 'id' field, dedupe by id; otherwise just append.
          const hasId =
            prev.length && prev[0] && "id" in prev[0] && "id" in result[0];
          if (!hasId) return [...prev, ...result];

          const existingIds = new Set(prev.map((p: any) => p.id));
          const filteredNew = result.filter((p: any) => !existingIds.has(p.id));
          return [...prev, ...filteredNew];
        });
      }

      // If returned items less than limit, assume no more products
      setHasMoreProducts(returnedCount >= (queryParams.limit || ROW_LIMIT));
    } else {
      // No result payload; if page === 1, clear
      if (currentPage === 1) setProducts([]);
      setHasMoreProducts(false);
    }

    // save previous page
    prevPageRef.current = currentPage;
  }, [productsData, queryParams.limit, queryParams.page]);

  /**
   * Handler: load next page
   */
  const loadMore = () => {
    if (!hasMoreProducts || isLoadingMore) return;
    setIsLoadingMore(true);
    setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  /**
   * Optional: report impressions when products change (example usage)
   * This is just a placeholder call to the mutation — adapt fields as your API expects.
   */
  useEffect(() => {
    if (!products || products.length === 0) return;
    // Example payload — adjust to match your API contract
    const payload = {
      subdomain: SUBDOMAIN,
      groupId: activeGroup || null,
      impressions: products.length,
    } as any;

    // Fire and forget; you might want to throttle/debounce in production
    updateImpressions(payload).catch(() => {
      // swallow error for now; add logging/telemetry if desired
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  /* -------------------------
     Render helpers / UI
     ------------------------- */

  return (
    <div className="catalog-pg-product-root">
      <div className="catalog-pg-product-header">
        {" "}
        <h5 className="catalog-pg-product-title">Products</h5>
      </div>

      {/* Products */}
      <div className="catalog-pg-product-grid">
        {products.map((product, index) => (
          <ProductListingCard
            key={index}
            product={product}
            link={`/p/${product.liveUrl}`}
          />
        ))}

        {/* Show skeleton loading when loading more products */}
        {isLoadingMore && (
          <>
            {Array.from({ length: ROW_LIMIT }).map((_, index) => (
              <SkeletonProductCard key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Load more / status area */}
      {!isProductsFetching && hasMoreProducts && !isLoadingMore && (
        <div className="catalog-pg-product-load-more" onClick={loadMore}>
          <div>Show more products</div>
        </div>
      )}

      {/* Show loading state for initial load */}
      {isProductsLoading && products.length === 0 && (
        <div className="catalog-pg-product-grid">
          {Array.from({ length: ROW_LIMIT }).map((_, index) => (
            <SkeletonProductCard key={`initial-skeleton-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDesktop;
