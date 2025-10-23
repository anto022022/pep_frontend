import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import FilterDropdown from "@/app/[locale]/_components/Catalog/FilterDropdown";
import { SalesProductListInterface } from "@/app/[locale]/_interface/SalesProductInterface";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import { useTranslations } from "next-intl";
import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";

const CatalogProductList = ({
  data: { data, isLoading },
}: {
  data: { data: any; isLoading: boolean };
}) => {
  const router = useRouter();
  const { locale } = useParams();
  const login = useLoginRedirect();
  const t = useTranslations("freeCatalog.catalog");
  const row = 7;
  const [queryParams, setQueryParams] = useState<SalesProductListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    itemStatus: "",
  });

  const handleFilterChange = (filters: Partial<SalesProductListInterface>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  const apiProducts = data?.data?.listData?.result || [];

  const filteredApiProducts = apiProducts.filter((product: any) => {
    const unitPrice = product.pricing?.unitPrice ?? 0;
    const minPrice = (queryParams as any).minPrice ?? 0;
    const maxPrice = (queryParams as any).maxPrice ?? Infinity;

    const stockMatch =
      !queryParams.itemStatus ||
      product.stockAvailability === queryParams.itemStatus;
    const priceMatch = unitPrice >= minPrice && unitPrice <= maxPrice;

    return stockMatch && priceMatch;
  });

  const slugify = (txt: string) =>
    txt
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const products = [...filteredApiProducts];
  return (
    <div className="p-l-m-t-body">
      <div className="catalog-product">
        {/* <FilterDropdown onFilterChange={handleFilterChange} /> */}
        <p>{t("tabs.products")}</p>
      </div>

      <div className="p-tabview p-component">
        <div className="p-tabview-panels">
          <div className="pr_id_4840_content">
            <section className="section-block filter-list-sort-block p-mob-pad">
              {isLoading ? (
                <div className="skel-cards-listing-group cards-listing-group c-l-g-5 pl-mob-pad">
                  {Array.from({ length: 5 }).map((_, index) => {
                    return <SkeletonProductCard key={index} />;
                  })}
                </div>
              ) : products.length === 0 ? (
                <div>{t("productList.noProducts")}</div>
              ) : (
                <div className="cards-listing-group c-l-g-autofill c-l-g-5">
                  {products.map((product: any, index: number) => (
                    <React.Fragment key={index}>
                      <ProductListingCard
                        product={product}
                        link={`/p/${product.liveUrl}`}
                        key={index}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogProductList;
