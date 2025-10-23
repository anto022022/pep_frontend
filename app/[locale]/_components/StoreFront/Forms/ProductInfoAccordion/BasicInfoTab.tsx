"use client";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BrochureIcon } from "../../../Icons/SVGIcons";

const BasicInfoTab = ({ previewData }: { previewData: PreviewData }) => {
  const t = useTranslations("salesProduct.viewPage.productInformation");
  return (
    <div className="tabs-content">
      {/* <div className="two-col-layout">
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            Product Name
          </label>
          <span className="t-f-g-txt">
            {previewData?.productName ? previewData?.productName : ""}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Category" className="t-f-g-label">
            Product Category
          </label>
          <span className="t-f-g-txt">{`Category: Men’s Apparel > Subcategory: Jackets`}</span>
        </div>
      
        <div className="tabs-form-group">
          <label htmlFor="Product Group" className="t-f-g-label">
            Product Group
          </label>
          <span className="t-f-g-txt">
            {previewData?.productGroup ? previewData?.productGroup : ""}
          </span>
        </div>
   
        <div className="tabs-form-group">
          <label htmlFor="Brochure" className="t-f-g-label">
            Brochure
          </label>
          {previewData.productBrochure && (
            <Link
              href={getImageUrl(previewData.productBrochure)}
              className="brochure-document-block"
            >
              <BrochureIcon />
              <span className="b-d-b-filename">      
                {getDisplayName(previewData.productBrochure)}
              </span>
            </Link>
          )}
        </div>
      </div> */}

      <div className="tabs-form-group">
        <label htmlFor="Product Name" className="t-f-g-label">
          {t("productName")}{" "}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productName ? previewData?.productName : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("shortDescription")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productDescription
            ? previewData?.productDescription
            : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Category" className="t-f-g-label">
          {t("productCategory")}
        </label>
        {previewData?.category?.name ? (
          <span className="t-f-g-txt">{`Category: ${previewData?.category?.name} > Subcategory:  ${previewData?.subCategory?.name}`}</span>
        ) : previewData?.categorySuggestion?.suggestedCategory ? (
          <span className="t-f-g-txt">{`Suggest Category: ${previewData?.categorySuggestion?.suggestedCategory}`}</span>
        ) : (
          <span className="t-f-g-txt">{`Category: -`}</span>
        )}
      </div>
      {previewData.productBrochure?.src && (
        <div className="tabs-form-group">
          <label htmlFor="Brochure" className="t-f-g-label">
            {t("brochure")}
          </label>
          <Link
            href={getImageUrl(previewData.productBrochure?.src)}
            className="brochure-document-block"
          >
            <div className="b-d-b-left">
              <BrochureIcon />
              <span className="b-d-b-filename">
                {previewData.productBrochure?.alt}
              </span>
            </div>
            <div className="b-d-b-right">
              <span className="b-d-b-size">
                {" "}
                {previewData?.productBrochure?.size !== undefined
                  ? (previewData.productBrochure.size / (1024 * 1024)).toFixed(
                      2
                    ) + " MB"
                  : ""}
              </span>
            </div>
            {/* <CloseIcon className="close-icon" /> */}
          </Link>
        </div>
      )}
      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("SKU/Model")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.skuCode ? previewData?.skuCode : ""}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Description" className="t-f-g-label">
          {t("countryOfOrigin")}
        </label>
        <span className="t-f-g-txt">
          {(previewData?.countryOfOrigin as { name?: string })?.name || ""}
        </span>
      </div>
      {/* <div className="two-col-layout">
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            Pricing
          </label>
          <span className="t-f-g-txt">
            {previewData?.currency
              ? previewData?.priceRange
                ? `${previewData?.currency}${previewData?.minPrice}-${previewData?.currency}${previewData?.maxPrice} per ${previewData?.units}`
                : `${previewData?.currency}${previewData?.price} per ${previewData?.units}`
              : "No Pricing"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            FOB Price
          </label>
          <span className="t-f-g-txt">
            {previewData?.currency && previewData?.fob?.fobMinPrice && previewData?.fob?.fobMaxPrice
              ? `${previewData?.currency}${previewData?.fob?.fobMinPrice}-${previewData?.currency}${previewData?.fob?.fobMaxPrice} per ${previewData?.fob?.fobUnit}`
              : "No Fob"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            Slab Based Pricing
          </label>
          {previewData?.slabs && previewData?.slabs.length > 0
            ? previewData?.slabs.map((slab,i) =>
              <span className="t-f-g-txt" key={i}>
                {`${slab?.slabMinQty}-${slab?.slabMaxQty} pcs: ${previewData?.currency}${slab?.slabMinQty}`}
              </span>
            )
            :  <span className="t-f-g-txt">No Slab Based Price</span>}
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            MOQ
          </label>
          <span className="t-f-g-txt">
            {previewData?.minOrderQuantity ? previewData?.minOrderQuantity : "No MOQ"}
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default BasicInfoTab;
