"use client";
import { BulkPricing } from "@/app/[locale]/_interface/SalesProductInterface";
import { SellOfferPreviewData } from "@/app/[locale]/_interface/SellOfferInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";
import { DateIcon } from "../../../Icons/SVGIcons";
import { TableDatePipe } from "../../../Pipe/TableDatePipe";

const OfferDetails = ({
  previewData,
}: {
  previewData: SellOfferPreviewData;
}) => {
  const t = useTranslations("salesOffer.viewPage.offerDetails");
  const price = useTranslations("salesProduct.viewPage.pricing");

  // const [brochureSize, setBrochureSize] = useState<string | null>(null);
  // const fetchFileSizeViaGET = async (url: string) => {
  //   try {
  //     const res = await fetch(url);
  //     // if (!res.ok) throw new Error('Failed to fetch file');

  //     const blob = await res.blob();
  //     const sizeInMB = (blob.size / (1024 * 1024)).toFixed(1);
  //     return `${sizeInMB} MB`;
  //   } catch (err) {
  //     // console.error("Error fetching file size via GET:", err);
  //     return null;
  //   }
  // };

  return (
    <div className="tabs-content">
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("offerType")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.offerInfo?.offerType
            ? previewData?.offerInfo?.offerType
            : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("offerTitle")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.offerTitle ? previewData?.offerTitle : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("offerDescription")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.offerDescription ? previewData?.offerDescription : ""}
        </span>
      </div>

      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.FIXED && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("offerPrice")}</label>
            <span className="t-f-g-txt">{`${previewData?.productDetails?.currency?.symbol}${previewData?.productDetails?.pricing?.unitPrice}`}</span>
          </div>
        )}
      {previewData?.productDetails?.pricing &&
        previewData?.productDetails?.pricing?.pricingType ===
        PricingType.PRICE_RANGE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("offerPrice")}</label>
            <span className="t-f-g-txt">{`${previewData?.productDetails?.currency?.symbol}${previewData?.productDetails?.pricing?.minPrice}-
                                ${previewData?.productDetails?.currency?.symbol}${previewData?.productDetails?.pricing?.maxPrice}`}</span>
          </div>
        )}
      {previewData?.offerInfo?.pricing &&
        previewData?.offerInfo?.pricing?.pricingType === PricingType.BULK && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{t("offerPrice")}</label>
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
                  {previewData?.offerInfo?.pricing?.bulkPrices?.map(
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
      {previewData?.offerInfo?.pricing &&
        previewData?.offerInfo?.pricing?.pricingType ===
        PricingType.REQUEST_QUOTE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{price("request_quote")}</label>
            <span className="t-f-g-txt">--</span>
          </div>
        )}
      {previewData?.offerInfo?.pricing &&
        previewData?.offerInfo?.pricing?.pricingType ===
        PricingType.NEGOTIABLE && (
          <div className="tabs-form-group">
            <label className="t-f-g-label">{price("negotiable")}</label>
            <span className="t-f-g-txt">--</span>
          </div>
        )}
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("cratedDate")}{" "}
        </label>

        <div className="t-f-g-wrapper">
          <DateIcon />
          <span className="t-f-g-txt">
            {previewData?.offerStartDate ? (
              <TableDatePipe date={previewData?.offerStartDate} />
            ) : (
              ""
            )}
          </span>{" "}
        </div>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("endDate")}{" "}
        </label>

        <div className="t-f-g-wrapper">
          <DateIcon />
          <span className="t-f-g-txt">
            {previewData?.offerEndDate ? (
              <TableDatePipe date={previewData?.offerEndDate} />
            ) : (
              ""
            )}
          </span>{" "}
        </div>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("marketFocus")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.marketFocus && previewData.marketFocus.length > 0
            ? previewData.marketFocus.map((item, index) => (
              <span key={index}>
                {item.name}
                {index !== previewData.marketFocus.length - 1 && ", "}
              </span>
            ))
            : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("offerMOQ")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.offerInfo?.minQty ? previewData?.offerInfo?.minQty : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("offerMOQ")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.offerInfo?.maxQty ? previewData?.offerInfo?.maxQty : ""}
        </span>
      </div>
    </div>
  );
};

export default OfferDetails;
