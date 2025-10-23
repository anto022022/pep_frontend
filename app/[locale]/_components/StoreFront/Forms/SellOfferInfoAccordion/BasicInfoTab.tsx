"use client";
import { BulkPricing } from "@/app/[locale]/_interface/SalesProductInterface";
import { SellOfferPreviewData } from "@/app/[locale]/_interface/SellOfferInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";

const BasicInfoTab = ({
  previewData,
}: {
  previewData: SellOfferPreviewData;
}) => {
  const t = useTranslations("salesOffer.viewPage.productInformation");
  const price = useTranslations("salesProduct.viewPage.pricing");

  return (
    <div className="tabs-content">
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("productName")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDetails?.productName
            ? previewData?.productDetails?.productName
            : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Category" className="t-f-g-label">
          {t("productCategory")}
        </label>
        {previewData?.productDetails?.category?.name &&
          previewData?.productDetails?.subCategory?.name ? (
          <span className="t-f-g-txt">{` ${previewData?.productDetails?.category?.name} >  ${previewData?.productDetails?.subCategory?.name} > ${previewData?.productDetails?.productCategory?.name}`}</span>
        ) : (
          ""
        )}

        {previewData?.productDetails?.category?.name ? (
          <span className="t-f-g-txt">{`Category: ${previewData?.productDetails?.category?.name} > Subcategory:  ${previewData?.productDetails?.category?.name}`}</span>
        ) : previewData?.productDetails?.categorySuggestion
          ?.suggestedCategory ? (
          <span className="t-f-g-txt">{`Suggest Category: ${previewData?.productDetails?.categorySuggestion?.suggestedCategory}`}</span>
        ) : (
          <span className="t-f-g-txt">{`Category: -`}</span>
        )}
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("brand")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDetails?.brandName
            ? previewData?.productDetails?.brandName
            : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("shortDescription")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDetails?.productDescription
            ? previewData?.productDetails?.productDescription
            : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("currency")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDetails?.currency?.code
            ? `${previewData?.productDetails?.currency?.symbol} - ${previewData?.productDetails?.currency?.code}`
            : ""}
        </span>
      </div>
      {/* <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
        {t("price")} 
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDetails?.productDescription
            ? previewData?.productDetails?.productDescription
            : ""}
        </span>
        </div> */}
      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.FIXED && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("price")}</label>
            <span className="t-f-g-txt">{`${previewData?.productDetails?.currency?.symbol}${previewData?.productDetails?.pricing?.unitPrice}`}</span>
          </div>
        )}

      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.PRICE_RANGE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{price("priceRange")}</label>
            <span className="t-f-g-txt">{`${previewData?.productDetails?.currency?.symbol}${previewData?.productDetails?.pricing?.minPrice}-
                                ${previewData?.productDetails?.currency?.symbol}${previewData?.productDetails?.pricing?.maxPrice}`}</span>
          </div>
        )}
      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.BULK && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{price("bulkPricing")}</label>
            <div className="variants-table-responsive bulk-pricing-table-responsive">
              <table className="variants-table">
                <thead>
                  <tr>
                    <th>{price("qtyFrom")}</th>
                    <th>{price("qtyTo")}</th>
                    <th>{price("price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData?.productDetails?.pricing?.bulkPrices.map(
                    (price, i) => {
                      const bulkPricing = previewData?.productDetails
                        ?.pricing as BulkPricing;
                      return (
                        <tr key={i}>
                          <td>{`${price.minQty} ${bulkPricing.unit}`}</td>
                          <td>{`${price.maxQty} ${bulkPricing.unit}`}</td>
                          <td>{`${previewData?.productDetails?.currency?.symbol}${price.price}`}</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.REQUEST_QUOTE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{price("request_quote")}</label>
            <span className="t-f-g-txt">--</span>
          </div>
        )}
      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.NEGOTIABLE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{price("negotiable")}</label>
            <span className="t-f-g-txt">--</span>
          </div>
        )}
      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("moq")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDetails?.minOrderQuantity
            ? `${previewData?.productDetails?.minOrderQuantity}  ${previewData?.productDetails?.moqUnit}`
            : ""}
        </span>
      </div>
    </div>
  );
};

export default BasicInfoTab;
