import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import QuantityInput from "@/app/[locale]/_components/Common/QuantityInput";
import TextEditor from "@/app/[locale]/_components/Common/TextEditor";
import {
  ChevronDownIcon,
  TrashTableIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import ProductSnippet from "@/app/[locale]/_components/MarketComponents/EnquiryCart/ProductSnippet";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import MinOrderQtyPipe from "@/app/[locale]/_components/Pipe/MinOrderQtyPipe";
import RFQPricePipe from "@/app/[locale]/_components/Pipe/RFQPricePipe";
import { VariantsColorPipe } from "@/app/[locale]/_components/Pipe/VariantsColorPipe";
import { colorType } from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesProductPreview";
import {
  BusinessInfo,
  OfferInfo,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  Currency,
  ProductPricing,
  VariantAttribute,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useRef, useState } from "react";
import truBasic from "../../../../../public/img/TruBasic.svg";
import verifyImg from "../../../../../public/img/true-verified.png";

interface QuoteRequestCardProps {
  businessInfo: BusinessInfo;
  productInfo: {
    _id: string;
    name: string;
    imageUrl: string;
    minOrderQuantity: number;
    moqUnit: string;
    deliveryDate: any;
    currency: Currency;
    pricing: ProductPricing;
    offerDetails?: OfferInfo["offerInfo"];
    stockAvailability: "inStock" | "outOfStock";
  };
  selectedVariants?: Array<{
    _id: string;
    quantity: number;
    isSelected?: boolean;
  }>;
  availableAttributes: VariantAttribute[];
  availableVariants: Variant[];
  isCheckboxVisible?: boolean;
  isMessageVisible?: boolean;
  toggleActionButtons?: boolean;
  className?: string;
  isSelected?: boolean;
  message?: string;
  totalOrderQuantity?: number;
  onMessageChange?: (val: string) => void;
  isAgreed?: boolean;
  onAgreeChange?: (val: boolean) => void;
  showErrors?: boolean;
  onSetShowErrors?: (val: boolean) => void;
  onSubmit?: () => void;
  handleVariantQuantityById: (id: string, newQty: number) => void;
  handleVariantChangeConfirm: (
    oldVariantId: string,
    newVariantId: string
  ) => void;
  handleTotalQuantity: (newQty: number) => void;
  handleDeleteVariant: (variantId: string) => void;
  handleVariantSelect?: (variantId: string, isSelected: boolean) => void;
  handleCartSelect?: (productId: string, isSelected: boolean) => void;
  handleDeleteCart?: () => void;
}

const QuoteRequestCard: React.FC<QuoteRequestCardProps> = ({
  businessInfo,
  productInfo,
  selectedVariants = [],
  availableAttributes,
  availableVariants,
  isCheckboxVisible = true,
  isMessageVisible = true,
  toggleActionButtons = true,
  className,
  isSelected = false,
  message = "",
  totalOrderQuantity = 0,
  onMessageChange,
  isAgreed = false,
  onAgreeChange,
  showErrors = false,
  onSubmit,
  handleTotalQuantity,
  handleVariantQuantityById,
  handleVariantChangeConfirm,
  handleDeleteVariant,
  handleVariantSelect,
  handleCartSelect,
  handleDeleteCart,
}) => {
  const overlayRefs = useRef<{ [key: string]: OverlayPanel | null }>({});

  const dispatch = useAppDispatch();
  const [isMessageActive, setIsMessageActive] = useState<boolean>(false);
  const [contactSupplier, setContactSupplier] = useState(false);
  const router = useRouter();
  const t = useTranslations("productDetailPage.productDetailCard");
  const [tempAttributesMap, setTempAttributesMap] = useState<
    Record<string, Record<string, string>>
  >({});

  const handleConfirmVariantChange = (
    variantId: string,
    e: React.MouseEvent
  ) => {
    const selectedAttrs = tempAttributesMap[variantId];
    if (!selectedAttrs) return;

    const newVariant = availableVariants.find((v) =>
      Object.entries(selectedAttrs).every(
        ([key, value]) => v.attributes[key] === value
      )
    );

    if (newVariant) {
      handleVariantChangeConfirm(variantId, newVariant._id as string);
    } else {
      dispatch(
        showToast({
          title: "Error!",
          message: "No matching variant found.",
          theme: "error",
        })
      );
    }

    overlayRefs.current[variantId]?.toggle(e);
  };

  return (
    <div className={`quote-request-card-comp ${className}`}>
      <div className="q-r-c-c-head">
        {isCheckboxVisible && (
          <div className="checkbox-block">
            <label className={`forms-checkbox`} htmlFor={productInfo._id}>
              <input
                type="checkbox"
                id={productInfo._id}
                checked={isSelected}
                onChange={(e) => {
                  if (handleCartSelect) {
                    handleCartSelect(productInfo._id, e.target.checked);
                  }
                }}
              />
              <span className="custom-checkbox"></span>
            </label>
          </div>
        )}
        <div className="company-details-product-info-block">
          <div className="c-d-wrapper">
            {businessInfo?.businessName ||
            businessInfo?.businessLocation ||
            businessInfo?.years ||
            businessInfo?.kybVerification ||
            businessInfo?.uboVerification ||
            businessInfo?.kycVerified ? (
              <div className="company-info">
                <div className="c-i-details">
                  {businessInfo?.businessName && (
                    <span className="c-i-d-title">
                      {businessInfo?.businessName ?? " "}
                    </span>
                  )}
                  <div className="company-meta-badge">
                    {businessInfo?.kybVerification &&
                    businessInfo?.uboVerification ? (
                      <div className="c-m-b-item">
                        <Image
                          src={verifyImg}
                          width={78}
                          height={22}
                          alt="Verified"
                          sizes="100vw"
                          className="img-contain"
                        ></Image>
                      </div>
                    ) : (
                      businessInfo?.kycVerified && (
                        <div className="c-m-b-item">
                          <Image
                            src={truBasic}
                            width={78}
                            height={22}
                            alt="Verified"
                            sizes="100vw"
                            className="img-contain"
                          ></Image>
                        </div>
                      )
                    )}

                    {businessInfo?.businessLocation && (
                      <div className="c-m-b-item">
                        <Image
                          src={`https://flagcdn.com/w320/${businessInfo?.businessLocation?.code.toLowerCase()}.png`}
                          width={19}
                          height={12}
                          alt={businessInfo?.businessLocation?.name}
                          sizes="100vw"
                        ></Image>
                        <span className="c-m-b-i-country">
                          {businessInfo?.businessLocation?.name ?? " "}
                        </span>
                      </div>
                    )}
                    {businessInfo?.years && (
                      <div className="c-m-b-item">
                        <span className="c-m-b-i-txt">
                          {businessInfo?.years != null
                            ? `${businessInfo.years}yrs`
                            : " "}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
            {/* </div> */}
            {toggleActionButtons ? (
              <div className="button-group-block">
                <ButtonIcon
                  className={"q-r-c-c-icon-btn"}
                  onClick={handleDeleteCart}
                >
                  <TrashTableIcon />
                </ButtonIcon>
                {/* <ButtonIcon className={"q-r-c-c-icon-btn"}>
                    <ChatDashIcon />
                  </ButtonIcon> */}
              </div>
            ) : (
              <Buttons
                text={t("seeProfile")}
                onClick={() => {
                  if (businessInfo?.isCatalogPublished) {
                    router.push(`/en/${businessInfo?.subDomain}`);
                  } else {
                    setContactSupplier(true);
                  }
                }}
                className={"btn-plain-txt"}
              ></Buttons>
            )}
          </div>
          <div className="p-i-b-wrapper">
            <ProductSnippet
              image={productInfo?.imageUrl}
              name={productInfo?.name}
              minOrderQuantity={MinOrderQtyPipe({
                minOrderQty: productInfo?.minOrderQuantity,
                offerInfo: productInfo?.offerDetails,
              })}
              moqUnit={productInfo?.moqUnit}
              stockAvailability={productInfo?.stockAvailability}
              deliveryDate={productInfo?.deliveryDate}
            >
              {availableVariants.length === 0 && (
                <div className="s-s-c-i-price-quantity">
                  <Typography variant="span" className="s-s-c-i-price">
                    <RFQPricePipe
                      pricing={productInfo?.pricing}
                      currency={productInfo?.currency}
                      multiplyByQuantity
                      totalOrderQuantity={totalOrderQuantity}
                      offer={productInfo?.offerDetails?.pricing}
                    />
                  </Typography>
                  <QuantityInput
                    quantity={totalOrderQuantity}
                    onChange={(newQty) => {
                      handleTotalQuantity(newQty);
                    }}
                  />
                </div>
              )}
            </ProductSnippet>
          </div>
        </div>
      </div>
      {availableVariants.length > 0 && (
        <div
          className={`q-r-c-c-body ${
            !isCheckboxVisible ? "checkbox-removed" : ""
          }`}
        >
          <div className="size-selection-comp">
            {selectedVariants.length > 0 ? (
              selectedVariants.map((variant) => {
                const fullVariant = availableVariants.find(
                  (v) => v._id === variant._id
                );
                const currentTempAttributes =
                  tempAttributesMap[variant._id] ||
                  fullVariant?.attributes ||
                  {};
                return (
                  <div className="s-s-c-item" key={variant._id}>
                    <div className="product-variant-option-comp">
                      {isCheckboxVisible && (
                        <label
                          className={`forms-checkbox`}
                          htmlFor={`${variant._id}`}
                        >
                          <input
                            type="checkbox"
                            id={`${variant._id}`}
                            checked={variant.isSelected}
                            onChange={(e) => {
                              if (handleVariantSelect) {
                                handleVariantSelect(
                                  variant._id,
                                  e.target.checked
                                );
                              }
                            }}
                          />
                          <span className="custom-checkbox"></span>
                        </label>
                      )}
                      <div className="order-selected-items">
                        <div className="o-s-i-left">
                          <div
                            className="size-color-badge"
                            onClick={(e) => {
                              overlayRefs.current[variant._id]?.toggle(e);
                              setTempAttributesMap((prev) => ({
                                ...prev,
                                [variant._id]: { ...fullVariant?.attributes },
                              }));
                            }}
                          >
                            {Object.entries(fullVariant?.attributes ?? {}).map(
                              ([key, value]) => (
                                <Typography
                                  variant="span"
                                  className="s-c-b-txt"
                                  key={key}
                                >
                                  {key}: {value}
                                </Typography>
                              )
                            )}
                            <ChevronDownIcon className={"open-icon"} />
                          </div>
                          {productInfo?.pricing?.pricingType !==
                            PricingType.NEGOTIABLE &&
                            productInfo?.pricing?.pricingType !==
                              PricingType.REQUEST_QUOTE && (
                              <Typography
                                variant="span"
                                className="o-s-i-price-txt"
                              >
                                <RFQPricePipe
                                  pricing={productInfo?.pricing}
                                  currency={productInfo?.currency}
                                  totalOrderQuantity={variant.quantity}
                                  offer={
                                    productInfo?.offerDetails?.pricing ??
                                    undefined
                                  }
                                />
                                {productInfo?.moqUnit &&
                                  ` / ${productInfo?.moqUnit}`}
                              </Typography>
                            )}
                        </div>
                        <OverlayPanel
                          ref={(el) => {
                            overlayRefs.current[variant._id] = el;
                          }}
                          className="selection-detail-overlaypanel"
                        >
                          <div className="selection-detail-block">
                            <div className="s-d-b-body">
                              <div className="selection-list-block">
                                {availableAttributes &&
                                  availableAttributes.length > 0 &&
                                  availableAttributes.map((attributes, i) => (
                                    <div
                                      className="sizesbutton-comp colorsbutton-comp colors-img-comp"
                                      key={i}
                                    >
                                      <label className="s-c-label">{`${attributes.key} (${attributes.values.length})`}</label>
                                      <div className="s-c-buttons-block">
                                        {attributes.values.map(
                                          (item, index) => {
                                            return colorType.includes(
                                              attributes.key
                                            ) ? (
                                              <VariantsColorPipe
                                                attributeKey={
                                                  attributes.key ?? ""
                                                }
                                                attributeValue={item ?? ""}
                                                variants={
                                                  availableVariants ?? []
                                                }
                                                key={index}
                                                isSelected={
                                                  currentTempAttributes[
                                                    attributes.key
                                                  ] === item
                                                }
                                                handleClick={() =>
                                                  setTempAttributesMap(
                                                    (prev) => ({
                                                      ...prev,
                                                      [variant._id]: {
                                                        ...prev[variant._id],
                                                        [attributes.key]: item,
                                                      },
                                                    })
                                                  )
                                                }
                                              />
                                            ) : (
                                              <button
                                                className={`btn-comp ${
                                                  currentTempAttributes[
                                                    attributes.key
                                                  ] === item
                                                    ? "active"
                                                    : ""
                                                }`}
                                                key={index}
                                                onClick={() =>
                                                  setTempAttributesMap(
                                                    (prev) => ({
                                                      ...prev,
                                                      [variant._id]: {
                                                        ...prev[variant._id],
                                                        [attributes.key]: item,
                                                      },
                                                    })
                                                  )
                                                }
                                              >
                                                {item}
                                              </button>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div className="s-d-b-footer">
                              <div className="s-d-b-f-left"></div>
                              <div className="s-d-b-f-right">
                                <div className="button-group-block">
                                  <Buttons
                                    className={
                                      "btn-outline bg-outline-grey btn-c-sm"
                                    }
                                    text={"Cancel"}
                                    onClick={(e) =>
                                      overlayRefs.current[variant._id]?.toggle(
                                        e
                                      )
                                    }
                                  />
                                  <Buttons
                                    className={"btn-c-primary btn-c-sm"}
                                    text={"Confirm"}
                                    onClick={(e) =>
                                      handleConfirmVariantChange(variant._id, e)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </OverlayPanel>
                      </div>
                    </div>
                    <div className="s-s-c-i-price-quantity">
                      <QuantityInput
                        quantity={variant.quantity}
                        onChange={(newQty) => {
                          handleVariantQuantityById(variant._id, newQty);
                        }}
                      />
                      {selectedVariants.length > 1 && (
                        <ButtonIcon
                          className={"q-r-c-c-icon-btn"}
                          onClick={() => {
                            handleDeleteVariant(variant._id);
                          }}
                        >
                          <TrashTableIcon />
                        </ButtonIcon>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <Typography variant="span">No variants selected.</Typography>
            )}
          </div>
        </div>
      )}
      {showErrors &&
        totalOrderQuantity <
          MinOrderQtyPipe({
            minOrderQty: productInfo?.minOrderQuantity,
            offerInfo: productInfo?.offerDetails,
          }) && (
          <span className="error-txt">
            {t("minOrderQtyError", {
              minOrderQty: MinOrderQtyPipe({
                minOrderQty: productInfo?.minOrderQuantity,
                offerInfo: productInfo?.offerDetails,
              }),
              unit: productInfo?.moqUnit,
            })}
          </span>
        )}
      {isMessageVisible && (
        <div className="q-r-c-c-footer">
          <div className="message-submit-block">
            <div className="forms-group">
              <div
                className={`label-toggle ${isMessageActive ? "active" : ""}`}
                onClick={() => setIsMessageActive(!isMessageActive)}
              >
                <Typography variant="span" className="l-t-txt">
                  {t("message")}
                </Typography>
                <ButtonIcon className={"q-r-c-c-icon-btn"}>
                  <ChevronDownIcon className={"open-icon"} />
                </ButtonIcon>
              </div>
              {isMessageActive && (
                <>
                  <TextEditor
                    value={message}
                    onChange={onMessageChange ?? (() => {})}
                    placeholder={t("messagePlaceholder")}
                  />
                  {showErrors && !message && (
                    <span className="error-txt">{t("messageError")}</span>
                  )}
                </>
              )}
            </div>
            {isMessageActive && (
              <div className="agree-submit-block">
                <label
                  className={`forms-checkbox`}
                  htmlFor={`agree-${productInfo._id}`}
                >
                  <input
                    type="checkbox"
                    id={`agree-${productInfo._id}`}
                    checked={isAgreed}
                    onChange={(e) => onAgreeChange?.(e.target.checked)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="f-r-label">
                    {t("agreeToTerms.part1")}{" "}
                    <Link href="/terms">{t("agreeToTerms.part2")}</Link>{" "}
                    {t("agreeToTerms.part3")}{" "}
                    <Link href="/privacy">{t("agreeToTerms.part4")}</Link>{" "}
                  </span>
                </label>
                {showErrors && !isAgreed && (
                  <span className="error-txt">{t("agreeError")}</span>
                )}
                <Buttons
                  className={"btn-c-primary"}
                  text={t("requestQuote")}
                  onClick={onSubmit}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <AlertDialog
        visible={contactSupplier}
        subTxt="Catalog of Supplier is not Published Yet"
        continueOnclick={() => {
          setContactSupplier(false);
        }}
      />
    </div>
  );
};

export default QuoteRequestCard;
