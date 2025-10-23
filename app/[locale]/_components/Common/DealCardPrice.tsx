import Typography from "@/app/[locale]/_components/Base/Typography";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { ProductListInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";

interface DealCardPriceprops {
  product: ProductListInterface;
  validTill: Date | "-";
}

export const DealCardPrice: React.FC<DealCardPriceprops> = ({
  product,
  validTill,
}) => {
  const t = useTranslations("categoryPage.cards.productCardWithOffer");
  return (
    <>
      <div className="price-grouping">
        <Typography className="product-price" variant="h4">
          <PricePipe
            currency={product?.currency?.symbol}
            pricing={product?.activeOffer?.offerInfo?.pricing}
          />
        </Typography>
        {product?.activeOffer?.offerInfo?.discountPercent && (
          <span className="badge-comp b-c-sm offer-price-badge">
            -
            {parseFloat(
              product?.activeOffer?.offerInfo?.discountPercent.toFixed(2)
            )}
            %
          </span>
        )}
      </div>
      {!(
        product?.pricing?.pricingType === "requestQuote" ||
        product?.pricing?.pricingType === "negotiable"
      ) && (
        <div className="price-grouping">
          <Typography className="strike-product-price s-p-p-md" variant="span">
            <PricePipe
              currency={product?.currency?.symbol}
              pricing={product?.pricing}
            />
          </Typography>
        </div>
      )}

      <div className="stock-order-wrap">
        <Typography className="min-order-txt dark-grey" variant="h4">
          {t("minOrder")} : {product?.activeOffer?.offerInfo?.minQty}{" "}
          {product?.activeOffer?.offerInfo?.unit}
        </Typography>

        {product?.activeOffer?.offerInfo?.offerType === "lowMOQ" && (
          <Typography className="strike-product-price s-p-p-sm" variant="span">
            {product?.minOrderQuantity} {product?.moqUnit}
          </Typography>
        )}
      </div>

      <div className="stock-order-wrap">
        <Typography className="min-order-txt dark-grey" variant="h4">
          {t("validTill")} :{" "}
          <DatePipe value={validTill} type="customDayMonth" />
        </Typography>
      </div>
    </>
  );
};
