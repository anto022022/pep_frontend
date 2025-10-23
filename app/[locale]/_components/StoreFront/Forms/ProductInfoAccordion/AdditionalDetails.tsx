"use client";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BrochureIcon } from "../../../Icons/SVGIcons";
export const getDisplayName = (path: string): string => {
  // Get the filename with extension (e.g. "download_6b0e42ea-65ff-4fda-bd46-dae75546465f_1744780994716.jpeg")
  const fileNameWithExt = path.split("/").pop() || "";

  // Remove the extension if present
  const [fileName] = fileNameWithExt.split(".");

  // If the filename starts with "file_example", return that
  if (fileName.startsWith("file_example")) {
    return "file_example";
  }

  // Otherwise, split by underscore and return the first segment
  const parts = fileName.split("_");
  return parts[0] || fileName;
};
const AdditionalDetails = ({ previewData }: { previewData: PreviewData }) => {
  const t = useTranslations("salesProduct.viewPage.additionalDetails");

  return (
    <div className="tabs-content">
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("brand")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.brandName ? previewData?.brandName : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("productKeywords")}
        </label>
        {previewData?.productKeyword?.map((item, index) => (
          <span key={index} className="badge-comp b-c-sm">
            {item}
          </span>
        ))}
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("productGroup")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productGroup ? previewData?.productGroup : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("productVideo")}
        </label>
        {previewData.productVideo && (
          <Link
            href={getImageUrl(previewData.productVideo?.src)}
            className="brochure-document-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BrochureIcon />
            <span className="b-d-b-filename">
              {previewData.productVideo?.alt}
            </span>
            <div className="b-d-b-right">
              <span className="b-d-b-size">
                {previewData?.productVideo?.size !== undefined
                  ? (previewData.productVideo.size / (1024 * 1024)).toFixed(2) +
                    " MB"
                  : ""}
              </span>
            </div>
          </Link>
        )}
        {previewData.youtubeUrl && (
          <Link
            href={previewData.youtubeUrl}
            className="brochure-document-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="b-d-b-left">
              <BrochureIcon />
              <span className="b-d-b-filename">
                {getDisplayName(previewData.youtubeUrl)}
              </span>
            </div>
            <div className="b-d-b-right">
              {/* <span className="b-d-b-size">3.2 MB</span> */}
            </div>
          </Link>
        )}
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("certifications")}
        </label>
        <div className="two-col-layout gap-y">
          {previewData?.certificates?.map(
            (item, index) =>
              item?.src && (
                <div className="tabs-form-group" key={index}>
                  <label htmlFor="Shipping & Packaging" className="t-f-g-label">
                    {item?.name}
                  </label>
                  <Link
                    href={getImageUrl(item.src)}
                    className="brochure-document-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="b-d-b-left">
                      <BrochureIcon />
                      <span className="b-d-b-filename">{item.name}</span>
                    </div>
                    <div className="b-d-b-right">
                      <span className="b-d-b-size">
                        {" "}
                        {item?.size !== undefined
                          ? (item.size / (1024 * 1024)).toFixed(2) + " MB"
                          : ""}
                      </span>
                    </div>
                  </Link>
                </div>
              )
          )}
        </div>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("customizationAvailable")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.isCustomizable ? previewData?.isCustomizable : ""}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Shipping & Packaging" className="t-f-g-label">
          {t("specificCustomization")}
        </label>
        <span className="t-f-g-txt">
          <ol>
            {previewData?.customization?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </span>
      </div>
      <div className="tabs-form-group faq-qa-group">
        <label htmlFor="FAQs" className="t-f-g-label">
          FAQs
        </label>
        {Array.isArray(previewData?.faqs) && previewData.faqs.length > 0
          ? previewData.faqs.map((item, index) => (
              <div key={index} className="faq-qa-group">
                <span className="t-f-g-txt">Q: {item?.question}</span>
                <span className="t-f-g-txt">A: {item?.answer}</span>
              </div>
            ))
          : "No FAQs added"}
      </div>
    </div>
  );
};

export default AdditionalDetails;
