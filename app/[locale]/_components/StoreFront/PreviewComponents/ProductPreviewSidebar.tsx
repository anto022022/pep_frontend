import { VariantsColorPipe } from "@/app/[locale]/_components/Pipe/VariantsColorPipe";
import { colorType } from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesProductPreview";
import {
  BulkPricing,
  PreviewData,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";
import { Sidebar } from "primereact/sidebar";
import { FC } from "react";
import Typography from "../../Base/Typography";
import PlaceholderGallerySlider from "../../Carousel/PlaceholderGallerySlider";
import ThumbsGallerySlider from "../../Carousel/ThumbsGallerySlider";
import { CloseIcon } from "../../Icons/SVGIcons";

interface PreviewSidebarProps {
  isPreviewSidebarOpen: boolean;
  setIsPreviewSidebarOpen: (value: boolean) => void;
  previewData: PreviewData | null;
}
const PreviewSidebar: FC<PreviewSidebarProps> = ({
  isPreviewSidebarOpen,
  setIsPreviewSidebarOpen,
  previewData,
}) => {
  const t = useTranslations("salesProduct.previewSidebar");
  return (
    <>
      <Sidebar
        visible={isPreviewSidebarOpen}
        position="right"
        onHide={() => isPreviewSidebarOpen}
        className="preview-sidebar-comp"
        content={() => (
          <>
            <div className="three-column-layout">
              <div className="t-c-l-right">
                <div className="t-c-l-r-center">
                  <div className="t-c-l-r-c-header">
                    <div className="t-c-l-r-c-left">
                      <button
                        className="btn-icon close-btn"
                        onClick={() => setIsPreviewSidebarOpen(false)}
                      >
                        <CloseIcon />
                      </button>
                      <div className="sku-title-block">
                        <Typography variant="span" className="sku-txt">
                          {"SKU: " + (previewData?.skuCode ?? "--")}
                        </Typography>
                        <Typography variant="h2" className="product-title-txt">
                          {previewData?.productName ?? t("productName")}
                        </Typography>
                      </div>
                    </div>
                    <div className="t-c-l-r-c-right">
                      <button
                        className="btn-icon expand-btn"
                        onClick={() => setIsPreviewSidebarOpen(true)}
                      >
                        {/* <ExpandIcon /> */}
                      </button>
                    </div>
                  </div>
                  <div className="t-c-l-r-c-body">
                    {previewData?.productImage ? (
                      <ThumbsGallerySlider
                        sliderImages={previewData.productImage}
                      />
                    ) : (
                      <PlaceholderGallerySlider />
                    )}{" "}
                    <div className="product-info-block">
                      <div className="product-orders-pairs-block">
                        <span className="badge-comp badge-lght-grey">
                          {t("minOrderQty")} :{" "}
                          {previewData?.minOrderQuantity && previewData?.moqUnit
                            ? `${previewData?.minOrderQuantity} ${previewData?.moqUnit}`
                            : "--"}
                        </span>
                        {previewData?.pricing &&
                          previewData?.pricing.pricingType ===
                            PricingType.FIXED && (
                            <div className="pairs-count">
                              <span className="p-c-label">{t("price")}</span>
                              <span className="p-c-value">{`${previewData.currency?.symbol}${previewData?.pricing.unitPrice}`}</span>
                            </div>
                          )}

                        {previewData?.pricing &&
                          previewData?.pricing.pricingType ===
                            PricingType.PRICE_RANGE && (
                            <div className="pairs-count">
                              <span className="p-c-label">{t("price")}</span>
                              <span className="p-c-value">{`${previewData.currency?.symbol}${previewData?.pricing.minPrice}-${previewData.currency?.symbol}${previewData?.pricing.maxPrice}`}</span>
                            </div>
                          )}

                        {previewData?.pricing &&
                          previewData?.pricing.pricingType ===
                            PricingType.BULK &&
                          previewData?.pricing.bulkPrices.length > 0 &&
                          previewData?.pricing.bulkPrices.map(
                            (bulkPrice, i) => (
                              <div className="pairs-count" key={i}>
                                <span className="p-c-label">{`${
                                  bulkPrice.minQty
                                }-${bulkPrice.maxQty} ${
                                  (previewData.pricing as BulkPricing)?.unit
                                }`}</span>
                                <span className="p-c-value">{`${previewData.currency?.symbol}${bulkPrice.price}`}</span>
                              </div>
                            )
                          )}
                      </div>
                      {previewData?.variantAttributes &&
                        previewData?.variantAttributes.length > 0 &&
                        previewData?.variantAttributes.map((attributes, i) => {
                          const attributeKey = attributes.key;
                          let attributeValue: string[] = [];

                          if (!colorType.includes(attributeKey)) {
                            attributeValue = attributes.values;
                          } else {
                            const extractedValues = (
                              previewData?.variants ?? []
                            )
                              .filter(
                                (v) =>
                                  v?.available && v?.attributes?.[attributeKey]
                              )
                              .map((v) => v.attributes[attributeKey]);

                            attributeValue =
                              extractedValues.length > 0
                                ? extractedValues
                                : attributes.values;
                          }

                          return (
                            <div className="sizesbutton-comp" key={i}>
                              <label className="s-c-label">
                                {attributeKey}
                              </label>
                              <div className="s-c-buttons-block">
                                {attributeValue.map((item, index) => {
                                  return colorType.includes(attributeKey) ? (
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
                    {/* <div className="like-quote-block">
                      <div className="l-q-b-left">
                        <CommentIcon />
                        <LikeIcon />
                        <DislikeIcon />
                        <SaveLaterIcon />
                        <ShareIcon />
                      </div>
                      <Buttons
                        className={"btn-outline bg-outline-grey quote-btn"}
                        text={"Quote Now"}
                        onClick={() => { }}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <ButtonIconRight name={"Add Product"}>
                <RightArrowIcon />
              </ButtonIconRight> */}
            </div>
          </>
        )}
      ></Sidebar>
    </>
  );
};

export default PreviewSidebar;
