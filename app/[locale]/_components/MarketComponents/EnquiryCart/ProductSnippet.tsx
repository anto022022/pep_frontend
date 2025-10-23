import Typography from "@/app/[locale]/_components/Base/Typography";
import StockAvailabilityPipe from "@/app/[locale]/_components/Pipe/StockAvailabilty";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface ProductSnippetProps {
  children?: React.ReactNode;
  isProductInfo?: boolean;
  isCompanyName?: boolean;
  companyName?: string;
  image: string;
  name: string;
  minOrderQuantity?: number;
  moqUnit?: string;
  stockAvailability?: "inStock" | "outOfStock";
  deliveryDate?: string;
}

const ProductSnippet: React.FC<ProductSnippetProps> = ({
  children,
  isProductInfo = true,
  isCompanyName = false,
  companyName,
  image,
  name,
  minOrderQuantity,
  stockAvailability = "inStock",
  moqUnit,
  deliveryDate,
}) => {
  const t = useTranslations("productDetailPage.productDetailCard");
  return (
    <div className="product-snippet-comp">
      <div className="p-s-c-left">
        <div className="p-s-c-img">
          <Image
            src={getImageUrl(image)}
            alt={name}
            sizes="100vw"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="p-s-c-right">
        <div className="p-s-c-info-block">
          <Typography variant="span" className="p-s-c-i-b-name">
            {name}
          </Typography>
          <div className="stock-order-wrap">
            {isProductInfo && (
              <>
                <Typography className="stock-status in-stock" variant="span">
                  <StockAvailabilityPipe value={stockAvailability} />
                </Typography>
                <Typography className="min-order-txt" variant="span">
                  {t("minOrder")}: {minOrderQuantity} {moqUnit}
                </Typography>
                <Typography className="min-order-txt" variant="span">
                  {t("expectedDelivery")} {deliveryDate}
                </Typography>
              </>
            )}
            {isCompanyName && (
              <Typography className="company-name-grey" variant="span">
                {companyName}
              </Typography>
            )}
          </div>
        </div>
        <div className="price-quantity-block">
          <div className="s-s-c-i-price-quantity"> {children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnippet;
