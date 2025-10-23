import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import { SalesProductListInterface } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";

interface Group {
  _id: string;
  groupName: string;
}
interface CatalogProductListPreviewProps {
  data: {
    data: any;
    isLoading: boolean;
    groupItems: Group[];
    activeGroup: string;
    handleActiveGroup: (groupId: string) => void;
  };
  onFilterChange: (filters: Partial<SalesProductListInterface>) => void;
}

const CatalogProductListPreview = ({
  data: { data, isLoading, groupItems, activeGroup, handleActiveGroup },
  onFilterChange,
}: CatalogProductListPreviewProps) => {
  const { locale } = useParams();
  const router = useRouter();
  const login = useLoginRedirect();
  const t = useTranslations("freeCatalog.catalog");
  const handleFilterChange = (filters: Partial<SalesProductListInterface>) => {
    onFilterChange(filters);
  };

  const apiProducts = data?.data?.listData?.result || [];

  // Apply local filters (group filtering, etc.) if needed
  const products = [...apiProducts];

  return (
    <div className="p-l-m-t-body p-4">
      <div className="catalog-product">
        <div className="catalog-product-header">
          {/* <FilterDropdown onFilterChange={handleFilterChange} /> */}
          <p>{t("tabs.products")}</p>
        </div>
        <div className="ct-group-items">
          {groupItems?.length > 0 && (
            <ul>
              <li
                className={activeGroup === "" ? "ct-active-group" : ""}
                onClick={() => handleActiveGroup("")}
              >
                {t("productList.all")}
              </li>
              {groupItems.map((item, index) => (
                <li
                  key={index}
                  className={item._id === activeGroup ? "ct-active-group" : ""}
                  onClick={() => handleActiveGroup(item._id)}
                >
                  {item.groupName || t("productList.notAvailable")}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="p-tabview p-component">
        <div className="p-tabview-panels">
          <div className="pr_id_4840_content catalog-product-list-preview">
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
                    // <a
                    //   className="product-listing-card-comp floating-bottom-hover"
                    //   key={product._id || index}
                    // >
                    //   <div className="p-l-c-c-slides">
                    //     <div className="single-image-slider-comp-main">
                    //       <div className="swiper swiper-initialized swiper-horizontal swiper-backface-hidden single-image-slider-comp">
                    //         <div className="swiper-wrapper">
                    //           <div className="swiper-slide swiper-slide-active s-i-s-c-img">
                    //             <img
                    //               src={
                    //                 product.productImageSrc?.startsWith("http")
                    //                   ? product.productImageSrc
                    //                   : `${
                    //                       process.env.NEXT_PUBLIC_BUCKET_URL
                    //                     }${product.productImageSrc.replace(
                    //                       /^\/+/,
                    //                       ""
                    //                     )}`
                    //               }
                    //               alt={product.productName}
                    //             />
                    //           </div>
                    //         </div>
                    //       </div>
                    //     </div>
                    //   </div>

                    //   <div className="p-l-c-c-details">
                    //     <div className="p-l-c-c-d-top">
                    //       <h3 className="product-card-name">
                    //         {product.productName}
                    //       </h3>
                    //       <div className="product-card-info">
                    //         <h4 className="product-price">
                    //           {product.currency?.symbol}
                    //           {product.pricing?.unitPrice ??
                    //             t("productList.notAvailable")}
                    //         </h4>
                    //         <div className="stock-order-wrap">
                    //           <h4
                    //             className={`stock-status ${
                    //               product.stockAvailability === "inStock"
                    //                 ? "in-stock"
                    //                 : "out-of-stock"
                    //             }`}
                    //           >
                    //             {product.stockAvailability === "inStock"
                    //               ? t("filters.stockStatus.inStock")
                    //               : t("filters.stockStatus.outOfStock")}
                    //           </h4>
                    //           <h4 className="min-order-txt">
                    //             {t("productList.minOrder")}: 1
                    //           </h4>
                    //         </div>
                    //       </div>
                    //     </div>

                    //     <div
                    //       className="p-l-c-c-d-bottom-wrapper floating-bottom-wrapper"
                    //       style={{ borderTop: "none" }}
                    //     >
                    //       {/* <div className="p-l-c-c-d-bottom">
                    //         <h6 className="company-name-grey">
                    //           {product.categoryName}
                    //         </h6>
                    //         <div className="company-meta-badge">
                    //           <div className="c-m-b-item rating-item">
                    //             ⭐ 4.8
                    //           </div>
                    //           <div className="c-m-b-item c-m-b-i-txt txt-grey">
                    //             6 yrs
                    //           </div>
                    //         </div>
                    //       </div> */}
                    //       <div className="p-l-c-c-d-cta-btns floating-block">
                    //         <button
                    //           type="button"
                    //           className="btn-comp btn-c-primary btn-c-sm"
                    //           onClick={() => {
                    //             const productSlug = product?.liveUrl;
                    //             // ? product.liveUrl
                    //             // : product?.productName && product?._id
                    //             // ? `${slugify(product.productName)}_${product._id}`
                    //             // : undefined;
                    //             const link =
                    //               locale && productSlug
                    //                 ? `/${locale}/p/${productSlug}`
                    //                 : undefined;
                    //             if (!link) return;
                    //             const refQuery = undefined as
                    //               | string
                    //               | undefined;
                    //             checkUserSessionAndRedirect({
                    //               authenticated: () =>
                    //                 router.push(
                    //                   refQuery
                    //                     ? `${link}?ref=${refQuery}`
                    //                     : link
                    //                 ),
                    //               onUnauthenticated: login,
                    //             });
                    //           }}
                    //         >
                    //           <span className="b-c-txt">
                    //             {t("actions.requestQuote")}
                    //           </span>
                    //         </button>
                    //       </div>
                    //     </div>
                    //   </div>
                    // </a>
                    <React.Fragment key={index}>
                      <ProductListingCard
                        product={product}
                        link={`/p/${product.liveUrl}`}
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

export default CatalogProductListPreview;
