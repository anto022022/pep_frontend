import Typography from "@/app/[locale]/_components/Base/Typography";
import ThumbsGallerySlider from "@/app/[locale]/_components/Carousel/ThumbsGallerySlider";
import { ExpandIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import {
  BulkPricing,
  PreviewData,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useGetProductPreviewDetailsQuery } from "@/app/[locale]/_store/apiReducer/productsApi";
import { setPreview } from "@/app/[locale]/_store/reducers/preview_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PlaceholderGallerySlider from "../../Carousel/PlaceholderGallerySlider";
import { VariantsColorPipe } from "../../Pipe/VariantsColorPipe";
import PreviewSidebar from "./ProductPreviewSidebar";

// Define the structure of previewData
export const colorType: Array<string> = [
  "color",
  "Color",
  "COLOR",
  "colors",
  "Colors",
  "COLORS",
  "colour",
  "Colour",
  "COLOUR",
  "colours",
  "Colours",
  "COLOURS",
  "Color Options",
  "color options",
];

const SalesProductPreview = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useAppDispatch();
  const [isPreviewSidebarOpen, setIsPreviewSidebarOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const { data, isSuccess, refetch } = useGetProductPreviewDetailsQuery(
    id ?? undefined,
    { skip: !id }
  );
  const t = useTranslations("salesProduct.previewSidebar");

  useEffect(() => {
    if (isSuccess && data) {
      setPreviewData(data.data);
      dispatch(setPreview(data.data));
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (id) refetch();
  }, [id]);

  return (
    <div className="t-c-l-r-center">
      {/* Header */}
      <div className="t-c-l-r-c-header">
        <div className="t-c-l-r-c-left">
          {/* <button className="btn-icon close-btn">
            <CloseIcon />
          </button> */}
          <div className="sku-title-block">
            <Typography variant="span" className="sku-txt">
              {"SKU: " + (previewData?.skuCode ?? "--")}
            </Typography>
            <Typography variant="h2" className="product-title-txt">
              {previewData?.productName ?? t("productName")}
            </Typography>
          </div>
        </div>
        <div
          className="t-c-l-r-c-right"
          onClick={() => setIsPreviewSidebarOpen(true)}
        >
          <button className="btn-icon expand-btn">
            <ExpandIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="t-c-l-r-c-body">
        {/* Render ThumbsGallerySlider only if previewData is not null */}
        {previewData?.productImage ? (
          <ThumbsGallerySlider sliderImages={previewData.productImage} />
        ) : (
          <PlaceholderGallerySlider />
        )}
        <div className="product-info-block">
          <div className="product-orders-pairs-block">
            <span className="badge-comp badge-lght-grey">
              {t("minOrderQty")} :{" "}
              {previewData?.minOrderQuantity && previewData?.moqUnit
                ? `${previewData?.minOrderQuantity} ${previewData?.moqUnit}`
                : "--"}
            </span>
            {previewData?.pricing &&
              previewData?.pricing.pricingType === PricingType.FIXED && (
                <div className="pairs-count">
                  <span className="p-c-label">{t("price")}</span>
                  <span className="p-c-value">{`${previewData.currency?.symbol}${previewData?.pricing.unitPrice}`}</span>
                </div>
              )}

            {previewData?.pricing &&
              previewData?.pricing.pricingType === PricingType.PRICE_RANGE && (
                <div className="pairs-count">
                  <span className="p-c-label">{t("price")}</span>
                  <span className="p-c-value">{`${previewData.currency?.symbol}${previewData?.pricing.minPrice}-${previewData.currency?.symbol}${previewData?.pricing.maxPrice}`}</span>
                </div>
              )}

            {previewData?.pricing &&
              previewData?.pricing.pricingType === PricingType.BULK &&
              previewData?.pricing.bulkPrices.length > 0 &&
              previewData?.pricing.bulkPrices.map((bulkPrice, i) => {
                const bulkPricing = previewData?.pricing as BulkPricing;
                return (
                  <div className="pairs-count" key={i}>
                    <span className="p-c-label">{`${bulkPrice.minQty}-${bulkPrice.maxQty} ${bulkPricing.unit}`}</span>
                    <span className="p-c-value">{`${previewData.currency?.symbol}${bulkPrice.price}`}</span>
                  </div>
                );
              })}
          </div>
          {previewData?.variantAttributes &&
            previewData?.variantAttributes.length > 0 &&
            previewData?.variantAttributes.map((attributes, i) => {
              const attributeKey = attributes.key;
              let attributeValue: string[] = [];
              let isColorType = false;

              if (!colorType.includes(attributeKey)) {
                attributeValue = attributes.values;
              } else {
                const extractedValues = (previewData?.variants ?? [])
                  .filter((v) => v?.available && v?.attributes?.[attributeKey])
                  .map((v) => v.attributes[attributeKey]);

                attributeValue =
                  extractedValues.length > 0
                    ? extractedValues
                    : attributes.values;
                isColorType = extractedValues.length > 0;
              }

              return (
                <div className="sizesbutton-comp" key={i}>
                  <label className="s-c-label">{attributeKey}</label>
                  <div className="s-c-buttons-block">
                    {attributeValue.map((item, index) => {
                      return isColorType ? (
                        <VariantsColorPipe
                          attributeKey={attributeKey ?? ""}
                          attributeValue={item ?? ""}
                          variants={previewData?.variants ?? []}
                          key={index}
                        />
                      ) : (
                        <button className={`btn-comp`} key={index}>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <PreviewSidebar
        isPreviewSidebarOpen={isPreviewSidebarOpen}
        setIsPreviewSidebarOpen={setIsPreviewSidebarOpen}
        previewData={previewData}
      />
    </div>
  );
};

export default SalesProductPreview;
