import Typography from "@/app/[locale]/_components/Base/Typography";
import ThumbsGallerySlider from "@/app/[locale]/_components/Carousel/ThumbsGallerySlider";
import { ExpandIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { getOriginalPrice } from "@/app/[locale]/_hooks/utility";
import { BulkPricing } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  OfferType,
  SellOfferPreviewData,
} from "@/app/[locale]/_interface/SellOfferInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PlaceholderGallerySlider from "../../Carousel/PlaceholderGallerySlider";
import SellOfferPreviewSidebar from "./SellOfferPreviewSidebar";

const SalesSellOfferPreview = () => {
  const previewData: SellOfferPreviewData = useAppSelector(
    (state: RootState) => state.preview
  );
  const [isPreviewSidebarOpen, setIsPreviewSidebarOpen] = useState(false);
  const t = useTranslations("salesOffer.previewSidebar");

  // useEffect(() => {
  //   console.log("PREVIEW", previewData);
  // }, [previewData]);

  const offerInfo = previewData?.offerInfo || undefined;
  const productDetails = previewData?.productDetails || undefined;

  return (
    <div className="t-c-l-r-center">
      <div className="t-c-l-r-c-header">
        <div className="t-c-l-r-c-left">
          {/* <button className="btn-icon close-btn">
            <CloseIcon />
          </button> */}
          <div className="sku-title-block">
            <Typography variant="h2" className="product-title-txt fnt-w-500">
              {t("preview")}
            </Typography>
          </div>
        </div>
        <div className="t-c-l-r-c-right">
          <button
            className="btn-icon expand-btn"
            onClick={() => setIsPreviewSidebarOpen(true)}
          >
            <ExpandIcon />
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="t-c-l-r-c-body">
        {/* Render ThumbsGallerySlider only if previewData is not null */}
        {productDetails?.productImage ? (
          <ThumbsGallerySlider sliderImages={productDetails.productImage} />
        ) : (
          <PlaceholderGallerySlider />
        )}
        <div className="product-info-block">
          {/* Default */}
          {!offerInfo && (
            <div className="product-info-group">
              <div className="offer-price-block">
                <Typography variant="span" className="o-p-b-strike">
                  {t("pricePlaceHolder")}
                </Typography>
                <span className="badge-comp b-c-sm offer-price-badge">
                  -- %
                </span>
              </div>
              <Typography variant="span" className="offer-price-value">
                {t("rangePlaceHolder")} <span className="o-p-v-pc">/ pc</span>
              </Typography>
            </div>
          )}
          {/* Pricing Fixed */}
          {offerInfo?.pricing?.pricingType === PricingType.FIXED &&
            productDetails?.pricing?.pricingType === PricingType.FIXED &&
            offerInfo?.offerType !== OfferType.BUY_MORE && (
              <>
                <div className="product-info-group">
                  {offerInfo?.discountPercent && (
                    <div className="offer-price-block">
                      <Typography variant="span" className="o-p-b-strike">
                        {productDetails?.currency?.symbol
                          ? `${productDetails?.currency?.code}${productDetails?.currency?.symbol} ${productDetails?.pricing?.unitPrice}`
                          : "--"}
                      </Typography>
                      <span className="badge-comp b-c-sm offer-price-badge">
                        {offerInfo?.discountPercent} %
                      </span>
                    </div>
                  )}

                  <Typography variant="span" className="offer-price-value">
                    {offerInfo?.currency?.symbol
                      ? offerInfo?.discountPercent
                        ? `${offerInfo?.currency?.code}${offerInfo?.currency?.symbol} ${offerInfo?.pricing?.unitPrice}`
                        : `${productDetails?.currency?.symbol} ${productDetails?.pricing?.unitPrice}`
                      : "--"}
                    <span className="o-p-v-pc">/ {offerInfo?.unit}</span>
                  </Typography>
                </div>
                {offerInfo?.offerType === OfferType.LOW_MOQ &&
                  productDetails?.minOrderQuantity &&
                  offerInfo?.minQty && (
                    <div className="product-info-group">
                      {/* MOQQQQ */}
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
                        <span className="o-p-v-pc">
                          / {productDetails.moqUnit}
                        </span>
                      </Typography>
                    </div>
                  )}
              </>
            )}
          {/* Pricing Ranged */}
          {offerInfo?.pricing?.pricingType === PricingType.PRICE_RANGE &&
            productDetails?.pricing?.pricingType === PricingType.PRICE_RANGE &&
            offerInfo?.offerType !== OfferType.BUY_MORE && (
              <>
                <div className="product-info-group">
                  {offerInfo?.discountPercent && (
                    <div className="offer-price-block">
                      <Typography variant="span" className="o-p-b-strike">
                        {productDetails?.currency?.symbol
                          ? `${productDetails?.currency?.code}${productDetails?.currency?.symbol} ${productDetails?.pricing?.minPrice} - ${productDetails?.currency?.symbol} ${productDetails?.pricing?.maxPrice}`
                          : "--"}
                      </Typography>
                      <span className="badge-comp b-c-sm offer-price-badge">
                        {offerInfo?.discountPercent} %
                      </span>
                    </div>
                  )}
                  <Typography variant="span" className="offer-price-value">
                    {offerInfo?.currency?.symbol
                      ? offerInfo?.discountPercent
                        ? `${offerInfo?.currency?.code}${offerInfo?.currency?.symbol} ${offerInfo?.pricing?.minPrice} - ${offerInfo?.currency?.symbol} ${offerInfo?.pricing?.maxPrice}`
                        : `${productDetails?.currency?.code}${productDetails?.currency?.symbol} ${productDetails?.pricing?.minPrice} - ${productDetails?.currency?.symbol} ${productDetails?.pricing?.maxPrice}`
                      : "--"}
                    <span className="o-p-v-pc">/ {offerInfo?.unit}</span>
                  </Typography>
                </div>
                {offerInfo?.offerType === OfferType.LOW_MOQ &&
                  productDetails?.minOrderQuantity &&
                  offerInfo?.minQty && (
                    <div className="product-info-group">
                      {/* MOQQQQ */}
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
                        <span className="o-p-v-pc">
                          / {productDetails.moqUnit}
                        </span>
                      </Typography>
                    </div>
                  )}
              </>
            )}
          {/* negotiable and req quotes */}
          {((offerInfo?.pricing?.pricingType === PricingType.NEGOTIABLE &&
            productDetails?.pricing?.pricingType === PricingType.NEGOTIABLE) ||
            (offerInfo?.pricing?.pricingType === PricingType.REQUEST_QUOTE &&
              productDetails?.pricing?.pricingType ===
              PricingType.REQUEST_QUOTE)) &&
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
                  productDetails?.minOrderQuantity &&
                  offerInfo?.minQty && (
                    <div className="product-info-group">
                      {/* MOQQQQ */}
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
                        <span className="o-p-v-pc">
                          / {productDetails.moqUnit}
                        </span>
                      </Typography>
                    </div>
                  )}
              </>
            )}
          {/* Bulk Price */}
          {offerInfo?.pricing?.pricingType === PricingType.BULK &&
            productDetails?.pricing?.pricingType === PricingType.BULK &&
            offerInfo?.offerType !== OfferType.BUY_MORE && (
              <div className="product-info-group">
                {offerInfo?.pricing?.bulkPrices &&
                  offerInfo?.pricing?.bulkPrices.length > 0 && (
                    <div className="variants-table-responsive bulk-pricing-table-responsive full-wid">
                      <table className="variants-table">
                        <thead>
                          <tr>
                            <th>{t("qtyFrom")}</th>
                            <th>{t("qtyTo")}</th>
                            <th>{t("price")}</th>
                            {offerInfo?.discountPercent &&
                              offerInfo?.discountPercent > 0 && (
                                <th>{t("discountedPrice")}</th>
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {offerInfo?.pricing?.bulkPrices.map((price, i) => {
                            const bulkPricing =
                              offerInfo?.pricing as BulkPricing;
                            return (
                              <tr key={i}>
                                <td>{`${price.minQty} ${bulkPricing.unit}`}</td>
                                <td>{`${price.maxQty} ${bulkPricing.unit}`}</td>
                                <td>
                                  {offerInfo.discountPercent
                                    ? `${productDetails?.currency?.code}${productDetails?.currency?.symbol
                                    }${getOriginalPrice(
                                      price?.price,
                                      offerInfo?.discountPercent as number
                                    )}`
                                    : `${productDetails?.currency?.symbol}${price?.price}`}
                                </td>
                                {offerInfo.discountPercent && (
                                  <td>
                                    {`${productDetails?.currency?.code}${productDetails?.currency?.symbol}${price?.price}`}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}

          {/* Buy More block */}
          {offerInfo?.offerType === OfferType.BUY_MORE && (
            <>
              <div className="product-info-group">
                <Typography variant="span" className="offer-price-value">
                  {productDetails?.pricing?.pricingType === PricingType.FIXED &&
                    (productDetails?.currency?.symbol
                      ? `${productDetails?.currency?.code}${productDetails?.currency?.symbol} ${productDetails?.pricing?.unitPrice}`
                      : "--")}
                  {productDetails?.pricing?.pricingType ===
                    PricingType.PRICE_RANGE &&
                    (productDetails?.currency?.symbol
                      ? `${productDetails?.currency?.code}${productDetails?.currency?.symbol} ${productDetails?.pricing?.minPrice} - ${productDetails?.currency?.symbol} ${productDetails?.pricing?.maxPrice}`
                      : "--")}
                  <span className="o-p-v-pc">/ {productDetails?.moqUnit}</span>
                </Typography>
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
          <div className="product-info-group">
            <Typography variant="span" className="light-label">
              {t("discount")}
            </Typography>
            <Typography variant="span" className="discount-price-highlighted">
              {previewData?.offerTitle ?? "--"}
            </Typography>
          </div>
          <div className="product-info-group">
            <Typography variant="span" className=" light-label dark-label">
              {productDetails?.productName ?? t("productName")}
            </Typography>
            {productDetails?.category && productDetails?.subCategory ? (
              <Typography variant="span" className="light-label">
                {`${productDetails.category.name} >  ${productDetails.subCategory.name
                  } ${productDetails.productCategory
                    ? `> ${productDetails.productCategory?.name}`
                    : ""
                  }`}
              </Typography>
            ) : (
              <Typography variant="span" className="light-label">
                {`${t("category")} >  ${t("subCategory")} > ${t(
                  "productCategory"
                )}`}
              </Typography>
            )}
          </div>
        </div>
      </div>
      <SellOfferPreviewSidebar
        isPreviewSidebarOpen={isPreviewSidebarOpen}
        setIsPreviewSidebarOpen={setIsPreviewSidebarOpen}
        previewData={previewData}
      />
    </div>
  );
};

export default SalesSellOfferPreview;
