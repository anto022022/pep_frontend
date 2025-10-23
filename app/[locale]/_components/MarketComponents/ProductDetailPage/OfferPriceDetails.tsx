import Typography from "@/app/[locale]/_components/Base/Typography";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import MinOrderQtyPipe from "@/app/[locale]/_components/Pipe/MinOrderQtyPipe";
import { BulkPricing } from "@/app/[locale]/_interface/SalesProductInterface";
import { OfferType } from "@/app/[locale]/_interface/SellOfferInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";

const OfferPriceDetails: React.FC<ProductDetailPageProps> = ({
  productData,
}) => {
  const offerInfo = productData?.activeOffer?.offerInfo || undefined;
  // const productDetails = productData || undefined;
  const t = useTranslations("salesOffer.previewSidebar");
  const p = useTranslations("productDetailPage.productDetailCard");

  return (
    <>
      {/* Pricing Fixed */}

      <span className="badge-comp badge-lght-grey">
        {p("minOrderQty")}:{" "}
        {`${MinOrderQtyPipe({
          minOrderQty: productData?.minOrderQuantity ?? 0,
          offerInfo: productData?.activeOffer?.offerInfo,
        })} ${productData?.activeOffer?.offerInfo?.unit}`}
      </span>

      {offerInfo?.pricing?.pricingType === PricingType.FIXED &&
        productData?.pricing?.pricingType === PricingType.FIXED &&
        offerInfo?.offerType !== OfferType.BUY_MORE && (
          <>
            <div className="product-info-group">
              {offerInfo?.discountPercent && (
                <>
                  <div className="pairs-count">
                    <span className="p-c-label">{t("price")}</span>
                    <div className="d-flex gap-5px">
                      <span className="p-c-value ">{`${productData.currency?.symbol}${offerInfo?.pricing?.unitPrice}`}</span>
                      <span className="strike-product-price">{`${productData.currency?.symbol}${productData?.pricing?.unitPrice}`}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* {offerInfo?.offerType === OfferType.LOW_MOQ &&
              productDetails?.minOrderQuantity &&
              offerInfo?.minQty && (
                <div className="product-info-group">
                  <Typography variant="span" className="light-label">
                    MOQ
                  </Typography>

                  <Typography variant="span" className="offer-price-value">
                    {offerInfo?.minQty}
                    <div className="offer-price-block">
                      <span className="o-p-b-strike">
                        {productDetails?.minOrderQuantity}
                      </span>
                    </div>
                    <span className="o-p-v-pc">/ {productDetails.moqUnit}</span>
                  </Typography>
                </div>
              )} */}
          </>
        )}
      {/* Pricing Ranged */}
      {offerInfo?.pricing?.pricingType === PricingType.PRICE_RANGE &&
        productData?.pricing?.pricingType === PricingType.PRICE_RANGE &&
        offerInfo?.offerType !== OfferType.BUY_MORE && (
          <>
            <div className="product-info-group">
              {offerInfo?.discountPercent && (
                // <div className="offer-price-block">
                //   <Typography variant="span" className="o-p-b-strike">
                //     {productDetails?.currency?.symbol
                //       ? `${productDetails?.currency?.code}${productDetails?.currency?.symbol} ${productDetails?.pricing?.minPrice} - ${productDetails?.currency?.symbol} ${productDetails?.pricing?.maxPrice}`
                //       : "--"}
                //   </Typography>
                //   <span className="badge-comp b-c-sm offer-price-badge">
                //     {offerInfo?.discountPercent} %
                //   </span>
                // </div>
                <>
                  <div className="pairs-count">
                    <span className="p-c-label">{t("price")}</span>
                    <span className="p-c-value ">{`${productData.currency?.symbol}${offerInfo?.pricing?.minPrice}-${productData.currency?.symbol}${offerInfo?.pricing?.maxPrice}`}</span>

                    <span className="strike-product-price">{`${productData.currency?.symbol}${productData?.pricing?.minPrice}-${productData.currency?.symbol}${productData?.pricing?.maxPrice}`}</span>
                  </div>
                </>
              )}
              <Typography variant="span" className="offer-price-value">
                {offerInfo?.currency?.symbol
                  ? offerInfo?.discountPercent
                    ? `${offerInfo?.currency?.code}${offerInfo?.currency?.symbol} ${offerInfo?.pricing?.minPrice} - ${offerInfo?.currency?.symbol} ${offerInfo?.pricing?.maxPrice}`
                    : `${productData?.currency?.code}${productData?.currency?.symbol} ${productData?.pricing?.minPrice} - ${productData?.currency?.symbol} ${productData?.pricing?.maxPrice}`
                  : "--"}
                <span className="o-p-v-pc">/ {offerInfo?.unit}</span>
              </Typography>
            </div>
            {/* {offerInfo?.offerType === OfferType.LOW_MOQ &&
              productDetails?.minOrderQuantity &&
              offerInfo?.minQty && (
                <div className="product-info-group">
                  <Typography variant="span" className="light-label">
                    MOQ
                  </Typography>

                  <Typography variant="span" className="offer-price-value">
                    {offerInfo?.minQty}
                    <div className="offer-price-block">
                      <span className="o-p-b-strike">
                        {productDetails?.minOrderQuantity}
                      </span>
                    </div>
                    <span className="o-p-v-pc">/ {productDetails.moqUnit}</span>
                  </Typography>
                </div>
              )} */}
          </>
        )}
      {/* negotiable and req quotes */}
      {((offerInfo?.pricing?.pricingType === PricingType.NEGOTIABLE &&
        productData?.pricing?.pricingType === PricingType.NEGOTIABLE) ||
        (offerInfo?.pricing?.pricingType === PricingType.REQUEST_QUOTE &&
          productData?.pricing?.pricingType === PricingType.REQUEST_QUOTE)) &&
        offerInfo?.offerType !== OfferType.BUY_MORE && (
          <>
            <div className="product-info-group">
              <Typography variant="span" className="light-label">
                Price
                {offerInfo?.discountPercent && (
                  <span className="badge-comp b-c-sm offer-price-badge">
                    {offerInfo?.discountPercent} %
                  </span>
                )}
              </Typography>
              <Typography variant="span" className="light-label dark-label">
                {offerInfo?.pricing?.pricingType === PricingType.NEGOTIABLE
                  ? "Negotiable Price"
                  : "Request Quote"}
              </Typography>
            </div>
            {offerInfo?.offerType === OfferType.LOW_MOQ &&
              productData?.minOrderQuantity &&
              offerInfo?.minQty && (
                <div className="product-info-group">
                  <Typography variant="span" className="light-label">
                    MOQ
                  </Typography>

                  <Typography variant="span" className="offer-price-value">
                    {offerInfo?.minQty}
                    <div className="offer-price-block">
                      <span className="o-p-b-strike">
                        {productData?.minOrderQuantity}
                      </span>
                    </div>
                    <span className="o-p-v-pc">/ {productData.moqUnit}</span>
                  </Typography>
                </div>
              )}
          </>
        )}
      {/* Bulk Price */}
      {offerInfo?.pricing?.pricingType === PricingType.BULK &&
        productData?.pricing?.pricingType === PricingType.BULK &&
        offerInfo?.offerType !== OfferType.BUY_MORE && (
          <div className="product-info-group">
            {offerInfo?.pricing?.bulkPrices &&
              offerInfo?.pricing?.bulkPrices.length > 0 && (
                <>
                  {/* {offerInfo?.pricing?.bulkPrices.map((price, i) => {
                    const bulkPricing = offerInfo?.pricing as BulkPricing;
                    return (
                      <div className="pairs-count" key={i}>
                        <span className="p-c-label">{`${price.minQty}-${
                          price.maxQty
                        } ${(productData.pricing as BulkPricing)?.unit}`}</span>
                        <div className="d-flex gap-5px">
                          <span className="p-c-value">{`${productData.currency?.symbol}${price.price}`}</span>

                          <span className="strike-product-price">{`${
                            productData.currency?.symbol
                          }${getOriginalPrice(
                            price?.price,
                            offerInfo?.discountPercent as number
                          )}`}</span>
                        </div>
                      </div>
                    );
                  })} */}
                  {(productData?.pricing as BulkPricing)?.bulkPrices?.map(
                    (price, i) => {
                      const unit = (productData.pricing as BulkPricing)?.unit;
                      const currencySymbol = productData.currency?.symbol || "";
                      const offerPrices =
                        (offerInfo?.pricing as BulkPricing)?.bulkPrices || [];

                      // Try to find a matching offer for this tier (by minQty)
                      const matchingOffer = offerPrices.find(
                        (offer) =>
                          offer.minQty === price.minQty &&
                          offer.maxQty === price.maxQty
                      );

                      const hasOffer = !!matchingOffer;
                      const originalPrice = price.price;

                      return (
                        <div className="pairs-count" key={i}>
                          <span className="p-c-label">{`${price.minQty}-${price.maxQty} ${unit}`}</span>
                          <div className="d-flex gap-5px">
                            <span className="p-c-value">
                              {currencySymbol}
                              {hasOffer ? matchingOffer!.price : originalPrice}
                            </span>

                            {hasOffer && (
                              <span className="strike-product-price">
                                {currencySymbol}
                                {originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </>
              )}
          </div>
        )}

      {/* Buy More block */}
      {offerInfo?.offerType === OfferType.BUY_MORE && (
        <>
          <div className="product-info-group">
            <>
              <span className="badge-comp badge-lght-grey">
                {t("minOrderQty")}:{" "}
                {`${productData?.minOrderQuantity} ${productData?.moqUnit}`}
              </span>
              {productData?.pricing &&
                productData?.pricing.pricingType === PricingType.FIXED && (
                  <div className="pairs-count">
                    <span className="p-c-label">{t("price")}</span>
                    <span className="p-c-value">{`${productData.currency?.symbol}${productData?.pricing.unitPrice}`}</span>
                  </div>
                )}

              {productData?.pricing &&
                productData?.pricing.pricingType ===
                  PricingType.PRICE_RANGE && (
                  <div className="pairs-count">
                    <span className="p-c-label">{t("price")}</span>
                    <span className="p-c-value">{`${productData.currency?.symbol}${productData?.pricing.minPrice}-${productData.currency?.symbol}${productData?.pricing.maxPrice}`}</span>
                  </div>
                )}

              {productData?.pricing &&
                productData?.pricing.pricingType === PricingType.BULK &&
                productData?.pricing.bulkPrices.length > 0 &&
                productData?.pricing.bulkPrices.map((bulkPrice, i) => (
                  <div className="pairs-count" key={i}>
                    <span className="p-c-label">{`${bulkPrice.minQty}-${
                      bulkPrice.maxQty
                    } ${(productData.pricing as BulkPricing)?.unit}`}</span>
                    <span className="p-c-value">{`${productData.currency?.symbol}${bulkPrice.price}`}</span>
                  </div>
                ))}
            </>
          </div>
          <div className="product-info-group">
            <Typography variant="span" className="light-label">
              {t("buyQty")}
            </Typography>
            <Typography
              variant="span"
              className="light-label dark-label"
            >{`${offerInfo?.buyQty} / ${offerInfo?.unit}`}</Typography>
          </div>
          <div className="product-info-group">
            <Typography variant="span" className="light-label">
              {t("freeQty")}
            </Typography>
            <Typography
              variant="span"
              className="light-label dark-label"
            >{`${offerInfo?.freeQty} / ${offerInfo?.unit}`}</Typography>
          </div>
        </>
      )}
    </>
  );
};
export default OfferPriceDetails;
