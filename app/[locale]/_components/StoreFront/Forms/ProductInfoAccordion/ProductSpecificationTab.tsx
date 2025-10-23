import {
  BulkPricing,
  PreviewData,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";

const ProductSpecificationTab = ({
  previewData,
}: {
  previewData: PreviewData;
}) => {
  const t = useTranslations("salesProduct.viewPage.pricing");
  return (
    <div className="tabs-content">
      {/* <div className='tabs-form-group'>
                <label htmlFor="Reference Code" className='t-f-g-label'>Reference Code</label>
                <span className='t-f-g-txt'>#453747</span>
            </div> */}
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("currency")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.currency
            ? `${previewData.currency?.symbol} - ${previewData?.currency?.code}`
            : ""}
        </span>
      </div>
      {previewData?.pricing &&
        previewData?.pricing?.pricingType === PricingType.FIXED && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("fixed")}</label>
            <span className="t-f-g-txt">{`${previewData.currency?.symbol}${previewData?.pricing?.unitPrice}`}</span>
          </div>
        )}

      {previewData?.pricing &&
        previewData?.pricing?.pricingType === PricingType.PRICE_RANGE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("priceRange")}</label>
            <span className="t-f-g-txt">{`${previewData.currency?.symbol}${previewData?.pricing?.minPrice}-
                        ${previewData.currency?.symbol}${previewData?.pricing?.maxPrice}`}</span>
          </div>
        )}
      {previewData?.pricing &&
        previewData?.pricing?.pricingType === PricingType.BULK && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("bulkPricing")}</label>
            <div className="variants-table-responsive bulk-pricing-table-responsive">
              <table className="variants-table">
                <thead>
                  <tr>
                    <th>{t("qtyFrom")}</th>
                    <th>{t("qtyTo")}</th>
                    <th>{t("price")}</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData?.pricing?.bulkPrices.map((price, i) => {
                    const bulkPricing = previewData?.pricing as BulkPricing;
                    return (
                      <tr key={i}>
                        <td>{`${price.minQty} ${bulkPricing.unit}`}</td>
                        <td>{`${price.maxQty} ${bulkPricing.unit}`}</td>
                        <td>{`${previewData.currency?.symbol}${price.price}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      {previewData?.pricing &&
        previewData?.pricing?.pricingType === PricingType.REQUEST_QUOTE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("request_quote")}</label>
            <span className="t-f-g-txt">--</span>
          </div>
        )}
      {previewData?.pricing &&
        previewData?.pricing?.pricingType === PricingType.NEGOTIABLE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("negotiable")}</label>
            <span className="t-f-g-txt">--</span>
          </div>
        )}
      <div className="tabs-form-group">
        <label htmlFor="MinimumOrderQuantity" className="t-f-g-label">
          {t("minOrderQuantity")}
        </label>
        <span className="t-f-g-txt">{`${previewData.minOrderQuantity} ${previewData.moqUnit}`}</span>
      </div>
    </div>
  );
};

export default ProductSpecificationTab;
