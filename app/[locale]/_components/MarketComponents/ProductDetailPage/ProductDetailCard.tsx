"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import saleBadge from "../../../../../public/img/sale-badge.svg";
import trueVerified from "../../../../../public/img/true-verified.png";

import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";

import OfferPriceDetails from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/OfferPriceDetails";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import RequestQuoteDialogue from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/RequestQuoteDialogue";
import SelectVariantsSidebar from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/SelectVariantsSidebar";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import InternationalShippingLabel from "@/app/[locale]/_components/Pipe/InternationalShippingLabel";
import MinOrderQtyPipe from "@/app/[locale]/_components/Pipe/MinOrderQtyPipe";
import { VariantsColorPipe } from "@/app/[locale]/_components/Pipe/VariantsColorPipe";
import { colorType } from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesProductPreview";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { useAvailableVariantsWithAttributeCounts } from "@/app/[locale]/_hooks/useVariantAttributes";
import { BulkPricing } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  PricingType,
  ShipInterNationalType,
} from "@/app/[locale]/_models/StoreFront";
import {
  setIsReqQuoteShow,
  setSelectVariantSidebarOpen,
} from "@/app/[locale]/_store/reducers/requestQuote_slice";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import truBasic from "../../../../../public/img/TruBasic.svg";
export type VariantQuantity = Record<string, number>;

const ProductDetailCard: React.FC<ProductDetailPageProps> = ({
  productData,
}) => {
  const dispatch = useAppDispatch();
  const isShow = useAppSelector(
    (state: RootState) => state.requestQuoteData.isSelectVariantSidebarOpen
  );
  const isMobile = useIsMobile();

  const isReqQuoteShow = useAppSelector(
    (state: RootState) => state.requestQuoteData.isReqQuoteShow
  );
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});

  const [variantQuantities, setVariantQuantities] = useState<VariantQuantity>(
    {}
  );

  const t = useTranslations("productDetailPage.productDetailCard");
  const router = useRouter();
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const [contactSupplier, setContactSupplier] = useState(false);
  const login = useLoginRedirect();

  const { availableVariants, attributeCounts, availableAttributes } =
    useAvailableVariantsWithAttributeCounts(productData?.variants ?? []);

  useEffect(() => {
    if (availableAttributes.length) {
      const selectedAttributes = availableAttributes.reduce<
        Record<string, string>
      >((acc, attribute) => {
        if (!acc[attribute.key]) {
          acc[attribute.key] = attribute.values[0];
        }
        return acc;
      }, {});
      setSelectedAttributes(selectedAttributes);
    }
  }, [availableAttributes]);

  const clearState = () => {
    setSelectedAttributes({});
    setVariantQuantities({});
    setTotalQuantity(0);
  };

  const handleAttributeSelect = (key: string, value: string) => {
    setSelectedAttributes((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
    if (!isShow) {
      dispatch(setSelectVariantSidebarOpen(true));
    }
  };

  const findCurrentVariantId = (key: string, value: string) => {
    const tempSelectedAttributes = {
      ...selectedAttributes,
      [key]: value,
    };

    const variant = availableVariants.find((v) =>
      Object.entries(tempSelectedAttributes).every(
        ([k, val]) => v.attributes[k] === val
      )
    );

    return variant?._id ?? null;
  };

  const handleVariantQuantity = (
    key: string,
    value: string,
    newQuantity: number
  ) => {
    const variantId = findCurrentVariantId(key, value);
    if (!variantId) return;

    setVariantQuantities((prev) => ({
      ...prev,
      [variantId]: newQuantity,
    }));

    const total = Object.values({
      ...variantQuantities,
      [variantId]: newQuantity,
    }).reduce((sum, qty) => sum + qty, 0);

    setTotalQuantity(total);

    const tempSelectedAttributes = {
      ...selectedAttributes,
      [key]: value,
    };
    setSelectedAttributes(tempSelectedAttributes);
  };

  const handleVariantQuantityById = (variantId: string, newQty: number) => {
    if (!variantId) return;

    setVariantQuantities((prev) => ({
      ...prev,
      [variantId]: newQty,
    }));

    const total = Object.values({
      ...variantQuantities,
      [variantId]: newQty,
    }).reduce((sum, qty) => sum + qty, 0);

    setTotalQuantity(total);
  };

  const handleReplaceVariant = (oldVariantId: string, newVariantId: string) => {
    const oldVariant = variantQuantities[oldVariantId];
    if (!oldVariant) return;

    setVariantQuantities((prev) => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[oldVariantId];
      updatedQuantities[newVariantId] = oldVariant;
      return updatedQuantities;
    });
  };

  const handleDelVariant = (variantId: string) => {
    setVariantQuantities((prev) => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[variantId];
      return updatedQuantities;
    });
    setTotalQuantity(() => {
      const newTotal = Object.values(variantQuantities).reduce(
        (sum, qty) => sum + qty,
        0
      );
      return newTotal - (variantQuantities[variantId] || 0);
    });
    setSelectedAttributes((prev) => {
      const updatedAttributes = { ...prev };
      Object.keys(updatedAttributes).forEach((key) => {
        if (updatedAttributes[key] === variantId) {
          delete updatedAttributes[key];
        }
      });
      return updatedAttributes;
    });
  };

  const handleReqQuote = () => {
    if (availableAttributes.length === 0) {
      setTotalQuantity(1);
      dispatch(setIsReqQuoteShow(true));
      return;
    }

    if (
      totalQuantity >
      MinOrderQtyPipe({
        minOrderQty: productData?.minOrderQuantity || 0,
        offerInfo: productData?.activeOffer?.offerInfo,
      })
    ) {
      dispatch(setIsReqQuoteShow(true));
    } else {
      dispatch(setSelectVariantSidebarOpen(true));
    }
  };

  function isExpiringInTwoDays(expiryDateStr?: Date): boolean {
    if (!expiryDateStr) return false;
    const now = new Date();
    const expiryDate = new Date(expiryDateStr);
    const diffInMs = expiryDate.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays <= 2 && diffInMs > 0;
  }

  function getTimeLeft(expiryDate: string | Date | undefined) {
    if (!expiryDate) {
      return { days: "00", hours: "00", minutes: "00" };
    }

    const now = new Date();
    const expiry = new Date(expiryDate);

    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) {
      return { days: "00", hours: "00", minutes: "00" };
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(diffMinutes / (60 * 24));
    const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
    const minutes = diffMinutes % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return {
      days: pad(days),
      hours: pad(hours),
      minutes: pad(minutes),
    };
  }

  const isExpireSoonOfferActive = isExpiringInTwoDays(
    productData?.activeOffer?.expires
  );
  const { days, hours, minutes } = getTimeLeft(
    productData?.activeOffer?.expires
  );

  const handleTotalQuantity = (newQty: number) => {
    if (availableVariants.length === 0) {
      setTotalQuantity(newQty);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => handleReqQuote(),
      onUnauthenticated: () => login(),
    });
  };

  const handleSupplierContact = () => {
    if (productData?.businessInfo?.isCatalogPublished) {
      window.open(`/en/${productData?.businessInfo?.subDomain}`, "_blank");
    } else {
      setContactSupplier(true);
    }
  };
  return (
    <>
      <div className="product-detail-Card-comp">
        {productData?.activeOffer?.offerInfo?.discountPercent && (
          <div className="sale-badge">
            <Image
              src={saleBadge}
              sizes="100vw"
              alt={"discount percent"}
              width={110}
              height={110}
              className="badge-image"
            />
            <div className="sale-badge-info">
              <span className="s-b-title">Sale</span>
              {productData?.activeOffer?.offerInfo?.discountPercent && (
                <div className="s-b-percent">
                  {Math.ceil(
                    productData?.activeOffer?.offerInfo?.discountPercent
                  )}
                  <span className="s-b-p-symbols">%</span>
                </div>
              )}

              <p className="s-b-discount">Discount</p>
            </div>
          </div>
        )}
        <div className="p-d-c-c-block product-detail-block">
          <div className="product-detail-info">
            {productData?.skuCode && (
              <Typography variant="span" className="sku-txt">
                {t("sku")}: {productData?.skuCode ?? "--"}
              </Typography>
            )}
            <Typography variant="h1" className="product-title">
              {productData?.productName}
            </Typography>
            {/* <div className="company-meta-badge">
              <div className="c-m-b-item rating-item">
                <StarIcon />
                <span className="c-m-b-i-txt">{"4.8/5"}</span>
              </div>
              <div className="c-m-b-item">
                <span className="c-m-b-i-txt txt-lght-grey-1">
                  {t("reviews", { reviews: 125 })}
                </span>
              </div>
              <div className="c-m-b-item">
                <span className="c-m-b-i-txt txt-lght-grey-1">
                  {t("sold", { sold: 150 })}
                </span>
              </div>
            </div> */}
            <Typography variant="h1" className="product-description">
              {productData?.productDescription}
            </Typography>
          </div>
          <div className="product-info-block">
            {isExpireSoonOfferActive && productData?.activeOffer?.offerInfo && (
              <div className="discount-timer-banner">
                <div className="discount-number-block">
                  <span className="d-n-b-number">-10%</span>
                  <span className="d-n-b-badge">
                    {productData?.activeOffer?.offerInfo?.offerType}
                  </span>
                </div>
                <div className="expire-detail-block">
                  <div className="e-d-b-wrapper">
                    <span className="expire-txt">Expiring Soon:</span>
                    <span className="expire-time">
                      <span className="expire-text">
                        <span className="expire-num">{days}</span> Day
                        <span className="expire-num">:{hours}</span> Hrs
                        <span className="expire-num">:{minutes}</span> Min
                      </span>
                    </span>
                  </div>
                  <Buttons
                    text={"View offer Details"}
                    className={"btn-plain-txt"}
                  ></Buttons>
                </div>
              </div>
            )}

            {productData?.activeOffer?.offerInfo &&
              !isExpireSoonOfferActive && (
                <div className="expire-detail-block">
                  <div className="discount-number-block">
                    {productData?.activeOffer?.offerInfo?.discountPercent && (
                      <span className="d-n-b-number">
                        -
                        {Math.ceil(
                          productData?.activeOffer?.offerInfo?.discountPercent
                        )}
                        %
                      </span>
                    )}

                    <span className="d-n-b-badge">
                      {productData?.activeOffer?.offerInfo?.offerType}
                    </span>
                  </div>
                  {/* <Buttons
                    text={"View offer Details"}
                    className={"btn-plain-txt"}
                  ></Buttons> */}
                </div>
              )}
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
              )}
              {productData?.activeOffer?.validOffer && (
                <OfferPriceDetails productData={productData} />
              )}
            </div>
          </div>
          {availableAttributes &&
            availableAttributes.length > 0 &&
            availableAttributes.map((attributes, i) => (
              <div
                className="sizesbutton-comp colorsbutton-comp colors-img-comp"
                key={i}
              >
                <label className="s-c-label">{`${attributes.key} (${attributes.values.length})`}</label>
                <div className="s-c-buttons-block">
                  {attributes.values.map((item, index) => {
                    return colorType.includes(attributes.key) ? (
                      <VariantsColorPipe
                        attributeKey={attributes.key ?? ""}
                        attributeValue={item ?? ""}
                        variants={productData?.variants ?? []}
                        key={index}
                        isSelected={selectedAttributes[attributes.key] === item}
                        handleClick={handleAttributeSelect}
                      />
                    ) : (
                      <button
                        className={`btn-comp ${
                          selectedAttributes[attributes.key] === item
                            ? "active"
                            : ""
                        }`}
                        key={index}
                        onClick={() =>
                          handleAttributeSelect(attributes.key, item)
                        }
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          {Object.entries(attributeCounts).length > 0 && (
            <div className="total-avail-option-comp">
              <div className="t-a-o-c-left">
                <Typography variant="span" className="t-a-o-c-label">
                  {t("totalAvailableOptions")}:{" "}
                  {Object.entries(attributeCounts).length}
                </Typography>
                <div className="t-a-o-c-option">
                  {Object.entries(attributeCounts).map(
                    ([attribute, count], i) => (
                      <Typography
                        variant="span"
                        className="t-a-o-c-label t-a-o-c-value"
                        key={i}
                      >
                        <Typography variant="span" className="t-a-o-c-count">
                          {count}
                        </Typography>{" "}
                        {attribute}
                      </Typography>
                    )
                  )}
                </div>
              </div>

              <div className="t-a-o-c-right">
                <Buttons
                  text={t("selectMultiVar")}
                  className={"btn-plain-txt"}
                  onClick={() => dispatch(setSelectVariantSidebarOpen(true))}
                ></Buttons>
              </div>
            </div>
          )}
        </div>
        <div className="p-d-c-c-block shipping-detail-block border-top">
          <div className="shipping-detail-comp">
            <div className="s-d-c-info">
              <Typography variant="h3" className="p-d-c-c-title-sm">
                {t("shipping")}
              </Typography>
              <Typography variant="p" className="p-d-c-c-subtxt-sm">
                {t("shippingSubtitle")}
              </Typography>
            </div>
            <div className="s-d-c-delivery-info">
              {Object.values(ShipInterNationalType).includes(
                productData?.internationalShipping as ShipInterNationalType
              ) && (
                <div className="s-d-c-d-i-item">
                  <Typography variant="span" className="s-d-c-d-i-i-label">
                    {t("shippingInternationally")}
                  </Typography>
                  <Typography variant="span" className="s-d-c-d-i-i-value">
                    <InternationalShippingLabel
                      value={productData?.internationalShipping}
                    />
                  </Typography>
                </div>
              )}
              {/* <div className="s-d-c-d-i-item">
                <Typography variant="span" className="s-d-c-d-i-i-label">
                  {t("estimatedDelivery")}
                </Typography>
                <Typography variant="span" className="s-d-c-d-i-i-value">
                  <LeadTimePipe
                    production={productData?.productionLeadTime}
                    dispatch={productData?.dispatchLeadTime}
                  />{" "}
                  {t("businessDays")}
                </Typography>
              </div> */}
              {isMobile && (
                <div className="button-group-block">
                  {/* <Buttons
                    className={"btn-outline bg-outline-dark"}
                    text={t("chatNow")}
                  /> */}
                  <Buttons
                    className={"btn-c-primary"}
                    text={t("requestQuote")}
                    onClick={handleReqQuote}
                  />
                </div>
              )}
            </div>

            <div className="button-group-block">
              <Buttons
                onClick={handleSupplierContact}
                className="btn-outline bg-outline-dark"
                text={t("contactSupplier")}
              />

              <Buttons
                className={"btn-c-primary"}
                text={t("requestQuote")}
                onClick={handleClick}
              />
            </div>
          </div>
        </div>
        {productData?.businessInfo?.businessName && (
          <div className="p-d-c-c-block company-profile-block border-top">
            <div className="company-info">
              <div className="c-i-details">
                <span
                  className="c-i-d-title cursor-pointer"
                  onClick={handleSupplierContact}
                >
                  {productData?.businessInfo?.businessName ?? " "}
                </span>
                <div className="company-meta-badge">
                  {productData?.businessInfo?.kybVerification &&
                  productData?.businessInfo?.uboVerification ? (
                    <div className="c-m-b-item">
                      <Image
                        src={trueVerified}
                        width={78}
                        height={22}
                        alt="Verified"
                        sizes="100vw"
                      ></Image>
                    </div>
                  ) : (
                    productData?.businessInfo?.kycVerified && (
                      <div className="c-m-b-item">
                        <Image
                          src={truBasic}
                          width={78}
                          height={22}
                          alt="Verified"
                          sizes="100vw"
                        ></Image>
                      </div>
                    )
                  )}
                  <div className="c-m-b-item">
                    {productData?.businessInfo?.businessLocation && (
                      <Image
                        src={`https://flagcdn.com/w320/${productData?.businessInfo?.businessLocation?.code.toLowerCase()}.png`}
                        width={19}
                        height={12}
                        alt={productData?.businessInfo?.businessLocation?.name}
                        sizes="100vw"
                      ></Image>
                    )}
                    {productData?.businessInfo?.businessAddress && (
                      <span className="c-m-b-i-country">
                        {productData?.businessInfo?.businessAddress?.state ??
                          " "}
                        ,{" "}
                        {productData?.businessInfo?.businessAddress?.country
                          ?.name ?? " "}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="badge-group">
              {productData?.businessInfo?.industry && (
                <span className="badge-comp">
                  {productData?.businessInfo?.industry?.name ?? " "}
                </span>
              )}

              {productData?.businessInfo?.businessTypeSpecific?.[0] && (
                <span className="badge-comp">
                  {productData?.businessInfo?.businessTypeSpecific?.[0]}
                </span>
              )}
            </div>
            {/* <div className="border-top"></div>
          <div className="supplier-details-card">
            <div className="s-d-c-footer">
              <div className="s-d-c-f-left trusted-img-group">
                <Image
                  src={trusted1}
                  alt="Trusted"
                  width={30}
                  height={30}
                  sizes="100vw"
                ></Image>
                <Image
                  src={trusted2}
                  alt="Trusted"
                  width={24}
                  height={24}
                  sizes="100vw"
                ></Image>
                <Image
                  src={trusted3}
                  alt="Trusted"
                  width={32}
                  height={32}
                  sizes="100vw"
                ></Image>
              </div>
              <div className="s-d-c-f-right">
                <Buttons
                  text={t("viewDetails")}
                  className={"btn-plain-txt"}
                ></Buttons>
              </div>
            </div>
          </div> */}
          </div>
        )}
      </div>
      <SelectVariantsSidebar
        productData={productData}
        isShow={isShow}
        setIsShow={(val: boolean) => dispatch(setSelectVariantSidebarOpen(val))}
        availableAttributes={availableAttributes}
        selectedAttributes={selectedAttributes}
        handleAttributeSelect={handleAttributeSelect}
        availableVariants={availableVariants}
        variantQuantities={variantQuantities}
        handleVariantQuantity={handleVariantQuantity}
        findCurrentVariantId={findCurrentVariantId}
        totalQuantity={totalQuantity}
        setIsReqQuoteShow={(val: boolean) => dispatch(setIsReqQuoteShow(val))}
      />
      <RequestQuoteDialogue
        productData={productData}
        isShow={isReqQuoteShow}
        setIsShow={(val: boolean) => dispatch(setIsReqQuoteShow(val))}
        availableAttributes={availableAttributes}
        availableVariants={availableVariants}
        variantQuantities={Object.entries(variantQuantities).map(
          ([key, value]) => {
            return {
              _id: key,
              quantity: value,
            };
          }
        )}
        handleTotalQuantity={handleTotalQuantity}
        handleVariantQtyById={handleVariantQuantityById}
        handleReplaceVariant={handleReplaceVariant}
        handleDelVariant={handleDelVariant}
        totalQuantity={totalQuantity}
        clearState={clearState}
      />
      <AlertDialog
        visible={userSessionDialog}
        subTxt="You have to Login to Quote"
        continueOnclick={() => {
          setUserSessionDialog(false);
          login();
          setTimeout(() => {
            if (availableAttributes.length === 0) {
              dispatch(setIsReqQuoteShow(true));
              return;
            } else {
              dispatch(setSelectVariantSidebarOpen(true));
            }
          }, 1000);
        }}
        cancelOnclick={() => {
          setUserSessionDialog(false);
        }}
      />
      <AlertDialog
        visible={contactSupplier}
        subTxt="Catalog of Supplier is not Published Yet"
        continueOnclick={() => {
          setContactSupplier(false);
        }}
      />
    </>
  );
};

export default ProductDetailCard;
