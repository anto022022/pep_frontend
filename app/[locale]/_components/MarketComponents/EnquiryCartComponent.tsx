"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import RFQProductCard from "@/app/[locale]/_components/Cards/RfqProductCard";
import { ProductListInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useGetCategoryProductListQuery } from "@/app/[locale]/_store/apiReducer/marketApi";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
type EnquiryCartComponentProps = {
  categoryId: string;
};
export const EnquiryCartComponent: React.FC<EnquiryCartComponentProps> = ({
  categoryId,
}) => {
  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );

  const t = useTranslations("productDetailPage.enquiryCart");

  const [products, setProducts] = useState<ProductListInterface[]>([]);
  const {
    data: trendingProductList,
    isLoading,
    isError,
    isSuccess,
  } = useGetCategoryProductListQuery(
    {
      category_id: categoryId ? [categoryId] : undefined,
      page: 1,
      limit: 4,
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode }
  );
  useEffect(() => {
    setProducts(trendingProductList?.data?.listData || []);
  }, [trendingProductList, isSuccess]);

  if (isLoading) {
    return <div className="s-b-g-right">Loading...</div>;
  }
  if (isError) {
    return <div className="s-b-g-right">Error related to RFQ cart list.</div>;
  }

  return (
    <div className="s-b-g-right">
      <div className="related-products">
        <Typography variant="span" className="r-p-label">
          {categoryId ? t("relatedProducts") : t("products")}
        </Typography>
        {products?.length > 0 && (
          <div className="r-p-group">
            {products.map((item: ProductListInterface, index: number) => {
              return (
                <Link
                  href={`/p/${item.liveUrl}`}
                  className="r-p-g-item"
                  key={index}
                >
                  <RFQProductCard product={item} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
