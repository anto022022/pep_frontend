"use client";

import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import QuantityInput from "@/app/[locale]/_components/Common/QuantityInput";
import { CloseIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/CompanyDetails";
import OfferPriceDetails from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/OfferPriceDetails";
import { VariantQuantity } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailCard";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import MinOrderQtyPipe from "@/app/[locale]/_components/Pipe/MinOrderQtyPipe";
import RFQPricePipe from "@/app/[locale]/_components/Pipe/RFQPricePipe";
import LeadTimePipe from "@/app/[locale]/_components/Pipe/TotalLeadTime";
import { VariantsColorPipe } from "@/app/[locale]/_components/Pipe/VariantsColorPipe";
import { colorType } from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesProductPreview";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import {
  BulkPricing,
  VariantAttribute,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useAddToRfqCartMutation } from "@/app/[locale]/_store/apiReducer/rfqCartApi";
import { useTranslations } from "next-intl";
import { Sidebar } from "primereact/sidebar";
import { FC, useState } from "react";

interface SelectVariantsSidebarProp {
  isShow: boolean;
  setIsShow: (value: boolean) => void;
  productData: ProductDetailPageProps["productData"];
  availableAttributes: VariantAttribute[];
  selectedAttributes: Record<string, string>;
  availableVariants: Variant[];
  handleAttributeSelect: (key: string, value: string) => void;
  variantQuantities: VariantQuantity;
  findCurrentVariantId: (key: string, value: string) => string | null;
  handleVariantQuantity: (key: string, value: string, newQty: number) => void;
  totalQuantity: number;
  setIsReqQuoteShow: (val: boolean) => void;
}

const SelectVariantsSidebar: FC<SelectVariantsSidebarProp> = ({
  isShow,
  setIsShow,
  productData,
  availableAttributes,
  selectedAttributes,
  availableVariants,
  handleAttributeSelect,
  variantQuantities,
  findCurrentVariantId,
  handleVariantQuantity,
  totalQuantity,
  setIsReqQuoteShow,
}) => {
  const t = useTranslations("productDetailPage.productDetailCard");

  const [showError, setShowError] = useState(false);

  const [addToRfqCart] = useAddToRfqCartMutation();

  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const login = useLoginRedirect();

  // Helper to check if a variant combination is available
  const isVariantAvailable = (selection: Record<string, string>) => {
    return availableVariants.some((variant) =>
      Object.entries(selection).every(([k, v]) => variant.attributes[k] === v)
    );
  };

  const handleAddToRfqList = async () => {
    if (
      totalQuantity <
      MinOrderQtyPipe({
        minOrderQty: productData?.minOrderQuantity || 0,
        offerInfo: productData?.activeOffer?.offerInfo,
      })
    ) {
      setShowError(true);
      return;
    }
    const selectedVariants = Object.entries(variantQuantities).map(
      ([key, value]) => {
        if (key) {
          return {
            _id: key,
            quantity: value || 0,
          };
        }
      }
    );
    try {
      await addToRfqCart({
        productId: productData?._id,
        selectedVariants,
        totalOrderQuantity: totalQuantity,
      }).unwrap();
      setIsShow(false);
      setShowError(false);
    } catch (error) {
      console.error("Error adding to RFQ cart:", error);
    }
  };

  const handleCLickReqQuote = () => {
    checkUserSessionAndRedirect({
      authenticated: () => {
        setIsShow(false);
        setIsReqQuoteShow(true);
      },
      onUnauthenticated: () => setUserSessionDialog(true),
    });
  };

  const handleClickAddToRfq = () => {
    checkUserSessionAndRedirect({
      authenticated: () => handleAddToRfqList(),
      onUnauthenticated: () => setUserSessionDialog(true),
    });
  };

  return (
    <>
      <Sidebar
        visible={isShow}
        position="right"
        onHide={() => setIsShow(false)}
        className="offcanvas-sidebar-comp select-variant-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {t("selectVarQty")}
                </Typography>
                <CloseIcon onClick={() => setIsShow(false)} />
              </div>
              <div className="o-s-c-body">
                <div className="product-info-block pad-spacing">
                  <div className="product-orders-pairs-block">
                    {!productData?.activeOffer?.validOffer && (
                      <>
                        <span className="badge-comp badge-lght-grey">
                          {t("minOrderQty")}:{" "}
                          <b>{`${productData?.minOrderQuantity ?? 1} ${
                            productData?.moqUnit ?? ""
                          }`}</b>
                        </span>

                        {productData?.pricing &&
                          productData?.pricing.pricingType ===
                            PricingType.FIXED && (
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
                          productData?.pricing.pricingType ===
                            PricingType.BULK &&
                          productData?.pricing.bulkPrices.length > 0 &&
                          productData?.pricing.bulkPrices.map(
                            (bulkPrice, i) => (
                              <div className="pairs-count" key={i}>
                                <span className="p-c-label">{`${
                                  bulkPrice.minQty
                                }-${bulkPrice.maxQty} ${
                                  (productData.pricing as BulkPricing)?.unit
                                }`}</span>
                                <span className="p-c-value">{`${productData.currency?.symbol}${bulkPrice.price}`}</span>
                              </div>
                            )
                          )}
                      </>
                    )}
                    {productData?.activeOffer?.validOffer && (
                      <OfferPriceDetails productData={productData} />
                    )}
                  </div>
                </div>
                <div className="border-divider"></div>
                <div className="selection-block pad-spacing">
                  {availableAttributes &&
                    availableAttributes.length > 0 &&
                    availableAttributes.map((attributes, i) => {
                      if (i !== availableAttributes.length - 1) {
                        return (
                          <div
                            className="sizesbutton-comp colorsbutton-comp colors-img-comp"
                            key={i}
                          >
                            <label className="s-c-label">
                              {`${attributes.key} (${attributes.values.length})`}
                            </label>
                            <div className="s-c-buttons-block">
                              {attributes.values.map((item, index) => {
                                return colorType.includes(attributes.key) ? (
                                  <VariantsColorPipe
                                    attributeKey={attributes.key ?? ""}
                                    attributeValue={item ?? ""}
                                    variants={productData?.variants ?? []}
                                    key={index}
                                    isSelected={
                                      selectedAttributes[attributes.key] ===
                                      item
                                    }
                                    handleClick={handleAttributeSelect}
                                  />
                                ) : (
                                  <button
                                    className={`btn-comp ${
                                      selectedAttributes[attributes.key] ===
                                      item
                                        ? "active"
                                        : ""
                                    }`}
                                    key={index}
                                    onClick={() =>
                                      handleAttributeSelect(
                                        attributes.key,
                                        item
                                      )
                                    }
                                  >
                                    {item}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="size-selection-block " key={i}>
                            <Typography variant="span" className="s-s-b-label">
                              {`${attributes.key} (${attributes.values.length})`}
                            </Typography>
                            <div className="size-selection-comp">
                              {attributes.values.map((item, index) => {
                                const variantId = findCurrentVariantId(
                                  attributes.key,
                                  item
                                );
                                return colorType.includes(attributes.key) ? (
                                  <div className="s-s-c-item" key={index}>
                                    {/* <span className="size-bagde">S</span> */}
                                    <VariantsColorPipe
                                      attributeKey={attributes.key ?? ""}
                                      attributeValue={item ?? ""}
                                      variants={productData?.variants ?? []}
                                      isSelected={
                                        selectedAttributes[attributes.key] ===
                                        item
                                      }
                                    />
                                    <div className="s-s-c-i-price-quantity">
                                      <Typography
                                        variant="span"
                                        className="s-s-c-i-price"
                                      >
                                        <RFQPricePipe
                                          pricing={productData?.pricing}
                                          totalOrderQuantity={totalQuantity}
                                          currency={productData?.currency}
                                          offer={
                                            productData?.activeOffer?.offerInfo
                                              ?.pricing
                                          }
                                        />
                                      </Typography>

                                      <QuantityInput
                                        quantity={
                                          variantId
                                            ? variantQuantities[variantId] ?? 0
                                            : 0
                                        }
                                        onChange={(value) =>
                                          handleVariantQuantity(
                                            attributes.key,
                                            item,
                                            value
                                          )
                                        }
                                        disabled={
                                          !isVariantAvailable({
                                            ...selectedAttributes,
                                            [attributes.key]: item,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="s-s-c-item" key={index}>
                                    <span className="size-bagde">{item}</span>
                                    <div className="s-s-c-i-price-quantity">
                                      <Typography
                                        variant="span"
                                        className="s-s-c-i-price"
                                      >
                                        <RFQPricePipe
                                          pricing={productData?.pricing}
                                          totalOrderQuantity={totalQuantity}
                                          currency={productData?.currency}
                                          offer={
                                            productData?.activeOffer?.offerInfo
                                              ?.pricing
                                          }
                                        />
                                      </Typography>
                                      <QuantityInput
                                        quantity={
                                          variantId
                                            ? variantQuantities[variantId] ?? 0
                                            : 0
                                        }
                                        onChange={(value) =>
                                          handleVariantQuantity(
                                            attributes.key,
                                            item,
                                            value
                                          )
                                        }
                                        disabled={
                                          !isVariantAvailable({
                                            ...selectedAttributes,
                                            [attributes.key]: item,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                    })}
                  <span className="error-txt">
                    {showError &&
                      t("minOrderQtyError", {
                        minOrderQty: MinOrderQtyPipe({
                          minOrderQty: productData?.minOrderQuantity || 0,
                          offerInfo: productData?.activeOffer?.offerInfo,
                        }),
                        unit: productData?.moqUnit,
                      })}
                  </span>
                </div>
                <div className="border-divider"></div>
                <div className="shipping-info-block pad-spacing">
                  <Typography variant="h5" className="s-i-b-title">
                    {t("shipping")}
                  </Typography>
                  <div className="s-i-b-details">
                    <Typography variant="h6" className="s-i-b-label">
                      {t("express")}
                    </Typography>
                    {productData?.shippingFee && (
                      <Typography variant="span" className="s-i-b-info">
                        {t("shippingFee", {
                          fee: productData?.shippingFee ?? "--",
                        })}
                      </Typography>
                    )}
                    {(productData?.productionLeadTime ||
                      productData?.dispatchLeadTime) && (
                      <Typography variant="span" className="s-i-b-info">
                        {t("estimatedDel")}{" "}
                        <LeadTimePipe
                          production={productData?.productionLeadTime}
                          dispatch={productData?.dispatchLeadTime}
                        />{" "}
                        {t("businessDays")}
                      </Typography>
                    )}
                  </div>
                  {productData?.shippingFee && (
                    <Typography
                      variant="span"
                      className=".s-i-b-info s-i-b-note-txt"
                    >
                      {t("shippingDet")}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
            <div className="o-s-c-footer">
              <div className="view-summary-block">
                <div className="v-s-b-item">
                  <Typography variant="span" className="v-s-b-i-txt">
                    {t("itemSubtotal", {
                      variationCount: Object.keys(variantQuantities).length,
                      totalItems: totalQuantity,
                    })}
                  </Typography>
                  <Typography variant="span" className="v-s-b-i-txt">
                    <RFQPricePipe
                      pricing={productData?.pricing}
                      totalOrderQuantity={totalQuantity}
                      currency={productData?.currency}
                      multiplyByQuantity
                      offer={productData?.activeOffer?.offerInfo?.pricing}
                    />
                  </Typography>
                </div>
                {productData?.shippingFee && (
                  <div className="v-s-b-item">
                    <Typography variant="span" className="v-s-b-i-txt">
                      {t("shippingTotal")}
                    </Typography>
                    <Typography variant="span" className="v-s-b-i-txt">
                      {t("est")} {productData?.shippingFee ?? "--"}
                    </Typography>
                  </div>
                )}
                {productData?.pricing.pricingType !== PricingType.NEGOTIABLE &&
                  productData?.pricing.pricingType !==
                    PricingType.REQUEST_QUOTE && (
                    <div className="v-s-b-item">
                      <Typography
                        variant="span"
                        className="v-s-b-i-txt v-s-b-i-bold"
                      >
                        {t("subTotal")}
                      </Typography>
                      <Typography
                        variant="span"
                        className="v-s-b-i-txt v-s-b-i-bold"
                      >
                        {t("est")}{" "}
                        <RFQPricePipe
                          pricing={productData?.pricing}
                          totalOrderQuantity={totalQuantity}
                          currency={productData?.currency}
                          multiplyByQuantity
                          shippingFee={productData?.shippingFee}
                          offer={productData?.activeOffer?.offerInfo?.pricing}
                        />
                      </Typography>
                    </div>
                  )}
              </div>
              <div className="o-s-c-f-right">
                <div className="o-s-c-btn-group btn-max-width">
                  <Buttons
                    className={"btn-outline bg-outline-dark"}
                    text={t("addToRfqList")}
                    onClick={handleClickAddToRfq}
                  />
                  <Buttons
                    className={"btn-c-primary"}
                    text={t("requestQuote")}
                    onClick={() => {
                      if (
                        totalQuantity <
                        MinOrderQtyPipe({
                          minOrderQty: productData?.minOrderQuantity || 0,
                          offerInfo: productData?.activeOffer?.offerInfo,
                        })
                      ) {
                        setShowError(true);
                        return;
                      }
                      handleCLickReqQuote();
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      ></Sidebar>
      <AlertDialog
        visible={userSessionDialog}
        subTxt="You have to Login to Quote"
        continueOnclick={() => {
          setUserSessionDialog(false);
          login();
        }}
        cancelOnclick={() => {
          setUserSessionDialog(false);
        }}
      />
    </>
  );
};

export default SelectVariantsSidebar;
