"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ProductListingCard from "@/app/[locale]/_components/Cards/ProductsListingCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import SkeletonProductCard from "@/app/[locale]/_components/Skeleton/SkeletonProductCard";
import { ProductListInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useGetCategoryProductListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import React from "react";
export interface SimilarProductsProps {
  productData: PreviewData;
  refQuery: string;
  productId?: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  productData,
  refQuery,
  productId,
}) => {
  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );
  const { data: ProductList } = useGetCategoryProductListQuery(
    {
      specificSort: "mostViewed",
      page: 1,
      limit: 8,
      currencyCode: currencyCode ?? "",
      ...(productId && { similarTo: productId }),
      subCategory_id: productData?.subCategory?.uniqueId
        ? [productData?.subCategory?.uniqueId]
        : [],
    },
    { skip: !currencyCode }
  );

  const productLists = ProductList?.data?.listData || [];
  const t = useTranslations("productDetailPage");

  return (
    <section className="section-block product-list-block">
      <div className="s-b-head p-mob-pad">
        <div className="s-b-h-left">
          <div className="title-block">
            <Typography className="cat-title cat-title-sm" variant="h4">
              {t("similar_product")}
            </Typography>
          </div>
        </div>
      </div>
      {productLists ? (
        <>
          <ReusableSwiper
            slides={productLists}
            slidesPerView={"auto"}
            spaceBetween={10}
            slidesOffsetAfter={0}
            loop
            freeMode={true}
            autoplay={1500}
            navigation={true}
            pagination={false}
            paginationClass="r-s-pagination"
            className="reusable-swiper card-max-width"
            renderItem={(item, index) => {
              const product = item as unknown as ProductListInterface;
              return (
                <ProductListingCard
                  link={`/p/${product.liveUrl}`}
                  key={index}
                  product={product}
                  refQuery={refQuery}
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
  );
};

export default SimilarProducts;
