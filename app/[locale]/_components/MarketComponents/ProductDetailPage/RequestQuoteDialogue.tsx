"use client";

import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import TextEditor from "@/app/[locale]/_components/Common/TextEditor";
import { CloseIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import QuoteRequestCard from "@/app/[locale]/_components/MarketComponents/EnquiryCart/QuoteRequestCard";
import {
  BusinessInfoDetail,
  UserInfoAddition,
} from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import DeliveryDatePipe from "@/app/[locale]/_components/Pipe/DeliveryDatePipe";
import MinOrderQtyPipe from "@/app/[locale]/_components/Pipe/MinOrderQtyPipe";
import { RFQErrorInterface } from "@/app/[locale]/_interface/RfqInterface";
import {
  PreviewData,
  VariantAttribute,
} from "@/app/[locale]/_interface/SalesProductInterface";
import {
  useAddToRfqCartMutation,
  usePostRfqRequestMutation,
} from "@/app/[locale]/_store/apiReducer/rfqCartApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { FC, useEffect, useState } from "react";
import truBasic from "../../../../../public/img/TruBasic.svg";
import verifyImg from "../../../../../public/img/true-verified.png";

interface RequestQuoteDialogueProp {
  isShow: boolean;
  setIsShow: (value: boolean) => void;
  productData: PreviewData & UserInfoAddition & BusinessInfoDetail;
  availableAttributes: VariantAttribute[];
  availableVariants: Variant[];
  variantQuantities: { _id: string; quantity: number }[];
  handleTotalQuantity: (newQty: number) => void;
  handleVariantQtyById: (id: string, newQty: number) => void;
  handleReplaceVariant: (oldVariantId: string, newVariantId: string) => void;
  handleDelVariant: (variantId: string) => void;
  clearState: () => void;
  totalQuantity: number;
}

const RequestQuoteDialogue: FC<RequestQuoteDialogueProp> = ({
  isShow,
  setIsShow,
  productData,
  availableAttributes,
  availableVariants,
  variantQuantities,
  handleVariantQtyById,
  handleReplaceVariant,
  handleTotalQuantity,
  handleDelVariant,
  clearState,
  totalQuantity,
}) => {
  const t = useTranslations("productDetailPage.productDetailCard");
  const dispatch = useAppDispatch();
  const [selectedVariants, setSelectedVariants] = useState<
    { _id: string; quantity: number }[]
  >([]);
  const [messageContent, setMessageContent] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isErrorOnVariant, setIsErrorOnVariant] = useState<boolean>(false);

  const userData = useAppSelector((state: RootState) => state.userData);

  const [postRfqRequest] = usePostRfqRequestMutation();
  const [addToRfqCart] = useAddToRfqCartMutation();

  useEffect(() => {
    setSelectedVariants(variantQuantities || []);
  }, [variantQuantities]);

  const handleVariantQuantityById = (variantId: string, newQty: number) => {
    if (!variantId) return;
    const updatedQuantities = selectedVariants.map((variant) => {
      if (variant._id === variantId) {
        return { ...variant, quantity: newQty };
      }
      return variant;
    });
    setSelectedVariants(updatedQuantities);
    handleVariantQtyById(variantId, newQty);
  };

  const handleVariantChangeConfirm = (
    oldVariantId: string,
    newVariantId: string
  ) => {
    const isExist = selectedVariants.find((v) => v._id === newVariantId);
    if (isExist) {
      dispatch(
        showToast({
          title: "Info",
          message: "Variant is already selected.",
          theme: "info",
        })
      );
      return;
    }
    const oldVariant = selectedVariants.find((v) => v._id === oldVariantId);
    if (!oldVariant) return;

    setSelectedVariants((prev) =>
      prev.map((v) =>
        v._id === oldVariantId
          ? { _id: newVariantId, quantity: oldVariant.quantity }
          : v
      )
    );
    handleReplaceVariant(oldVariantId, newVariantId);
  };

  const handleDeleteVariant = (variantId: string) => {
    setSelectedVariants((prev) =>
      prev.filter((variant) => variant._id !== variantId)
    );
    handleDelVariant(variantId);
  };

  const handleAddToRfqList = async () => {
    if (
      totalQuantity <
      MinOrderQtyPipe({
        minOrderQty: productData?.minOrderQuantity || 0,
        offerInfo: productData?.activeOffer?.offerInfo,
      })
    ) {
      dispatch(
        showToast({
          title: "Info",
          message: "Please fill in all required fields.",
          theme: "info",
        })
      );
      setIsErrorOnVariant(true);
      return;
    }
    try {
      const response = await addToRfqCart({
        productId: productData?._id,
        selectedVariants,
        totalOrderQuantity: totalQuantity,
      }).unwrap();
      dispatch(
        showToast({
          title: "Success",
          message: response?.message,
          theme: "success",
        })
      );
      setSelectedVariants([]);
      setMessageContent("");
      setIsAgreed(false);
      setIsShow(false);
      clearState();
    } catch (error) {
      console.error("Error adding to RFQ cart:", error);
      dispatch(
        showToast({
          title: "Error",
          message: error?.data?.message ?? "Requesting quote failed",
          theme: "error",
        })
      );
    }
  };

  const handleRequestSubmit = async () => {
    try {
      const requestData = {
        items: [
          {
            productId: productData._id,
            rfqDescription: messageContent,
            selectedVariants,
            totalOrderQuantity: totalQuantity,
          },
        ],
      };
      const response = await postRfqRequest(requestData).unwrap();
      dispatch(
        showToast({
          title: "Success",
          message: response?.message,
          theme: "success",
        })
      );
      setSelectedVariants([]);
      setMessageContent("");
      setIsAgreed(false);
      setIsShow(false);
      clearState();
    } catch (error) {
      let errResponse = error as RFQErrorInterface;
      console.error("Error submitting request:", error);
      dispatch(
        showToast({
          title: "Error",
          message: errResponse?.data?.message ?? "Requesting quote failed",
          theme: "error",
        })
      );
    }
  };

  return (
    <Sidebar
      visible={isShow}
      position="right"
      onHide={() => setIsShow(false)}
      className="offcanvas-sidebar-comp request-quote-sidebar"
      content={() => (
        <>
          <div className="o-s-c-top">
            <div className="o-s-c-header">
              <Typography variant="h4" className="o-s-c-h-title">
                {t("requestQuote")}
              </Typography>
              <CloseIcon onClick={() => setIsShow(false)} />
            </div>
            <div className="o-s-c-body">
              <div className="request-quote-main-block">
                {/* from block */}
                <div className="r-q-m-b-item">
                  <div className="r-q-form-group">
                    <label htmlFor="from" className="r-q-f-g-label">
                      {t("from")}:
                    </label>
                    <div className="request-quote-form-box">
                      <div className="r-q-f-b-item">
                        <div className="from-detail">
                          <Typography variant="span" className="f-d-name">
                            {userData?.userName ?? "User"}
                          </Typography>
                          {userData?.businessEmail && (
                            <Typography variant="span" className="f-d-email">
                              {userData?.businessEmail ?? " "}
                            </Typography>
                          )}
                        </div>
                      </div>
                      {(userData?.businessName ||
                        userData?.country?.code ||
                        userData?.kybVerification ||
                        userData?.uboVerification ||
                        userData?.country ||
                        userData?.kycVerified ||
                        userData?.years) && (
                        <div className="r-q-f-b-item">
                          <div className="company-info">
                            <div className="c-i-details">
                              {userData?.businessName && (
                                <span className="c-i-d-title dark-txt">
                                  {userData?.businessName ?? ""}
                                </span>
                              )}
                              <div className="company-meta-badge">
                                {userData?.kybVerification &&
                                userData?.uboVerification ? (
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
                                  userData?.kycVerified && (
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

                                {userData?.country?.code && (
                                  <div className="c-m-b-item">
                                    <Image
                                      src={`https://flagcdn.com/w320/${userData?.country?.code.toLowerCase()}.png`}
                                      width={19}
                                      height={12}
                                      alt={userData?.country?.name}
                                      sizes="100vw"
                                    ></Image>
                                    <span className="c-m-b-i-country">
                                      {userData?.country?.name ?? " "}
                                    </span>
                                  </div>
                                )}

                                {userData?.years && (
                                  <div className="c-m-b-item">
                                    <span className="c-m-b-i-txt">
                                      {userData?.years != null
                                        ? `${userData?.years}yrs`
                                        : " "}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* To block */}
                <div className="r-q-m-b-item">
                  <div className="r-q-form-group">
                    <label htmlFor="to" className="r-q-f-g-label">
                      {t("to")}:
                    </label>
                    <QuoteRequestCard
                      businessInfo={productData?.businessInfo}
                      productInfo={{
                        _id: productData?._id ?? "",
                        name: productData?.productName ?? "",
                        minOrderQuantity: productData?.minOrderQuantity ?? 0,
                        moqUnit: productData?.moqUnit ?? "",
                        imageUrl: productData.productImage[0].src,
                        deliveryDate: DeliveryDatePipe({
                          production: productData.productionLeadTime,
                          dispatch: productData.dispatchLeadTime,
                        }),
                        currency: productData.currency,
                        pricing: productData.pricing,
                        stockAvailability:
                          productData?.stockAvailability ?? "outOfStock",
                        offerDetails: productData?.activeOffer?.offerInfo,
                      }}
                      selectedVariants={selectedVariants}
                      availableAttributes={availableAttributes}
                      availableVariants={availableVariants}
                      className={"request-quote-form-box"}
                      isCheckboxVisible={false}
                      isMessageVisible={false}
                      toggleActionButtons={false}
                      totalOrderQuantity={totalQuantity}
                      handleTotalQuantity={handleTotalQuantity}
                      handleVariantQuantityById={handleVariantQuantityById}
                      handleVariantChangeConfirm={handleVariantChangeConfirm}
                      handleDeleteVariant={handleDeleteVariant}
                    />
                    {(showErrors || isErrorOnVariant) &&
                      totalQuantity <
                        MinOrderQtyPipe({
                          minOrderQty: productData?.minOrderQuantity || 0,
                          offerInfo: productData?.activeOffer?.offerInfo,
                        }) && (
                        <span className="error-txt">
                          {t("minOrderQtyError", {
                            minOrderQty: MinOrderQtyPipe({
                              minOrderQty: productData?.minOrderQuantity || 0,
                              offerInfo: productData?.activeOffer?.offerInfo,
                            }),
                            unit: productData?.moqUnit,
                          })}
                        </span>
                      )}
                  </div>
                </div>
                {/* message block */}
                <div className="r-q-m-b-item">
                  <div className="r-q-form-group">
                    <label htmlFor="message" className="r-q-f-g-label">
                      {t("message")}:
                    </label>
                    <TextEditor
                      value={messageContent}
                      onChange={setMessageContent}
                      placeholder={t("messagePlaceholder")}
                    />
                    {showErrors && !messageContent && (
                      <span className="error-txt">{t("messageError")}</span>
                    )}
                  </div>
                </div>
                {/* terms and condition block */}
                <div className="r-q-m-b-item">
                  <div className="agree-submit-block">
                    <label className={`forms-checkbox`} htmlFor="agree">
                      <input
                        type="checkbox"
                        id={"agree"}
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      <span className="custom-checkbox"></span>
                      <span className="f-r-label">
                        {t("agreeToTerms.part1")}{" "}
                        <Link href="/s/legal#privacy-policy" target="_blank" >
                          {t("agreeToTerms.part2")}
                        </Link>{" "}
                        {t("agreeToTerms.part3")}{" "}
                        <Link href="/s/legal#privacy-policy" target="_blank" >
                          {t("agreeToTerms.part4")}
                        </Link>{" "}
                      </span>
                    </label>
                    {showErrors && !isAgreed && (
                      <span className="error-txt">{t("agreeError")}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="o-s-c-footer">
            <div className="o-s-c-f-left">
              <Buttons
                className={"btn-outline bg-outline-dark"}
                text={t("addToRfqList")}
                onClick={handleAddToRfqList}
              />
            </div>
            <div className="o-s-c-f-right">
              <div className="o-s-c-btn-group">
                <Buttons
                  className={"btn-c-primary"}
                  text={t("requestQuote")}
                  onClick={() => {
                    const hasErrors =
                      !isAgreed ||
                      !messageContent ||
                      totalQuantity <
                        MinOrderQtyPipe({
                          minOrderQty: productData?.minOrderQuantity || 0,
                          offerInfo: productData?.activeOffer?.offerInfo,
                        });

                    if (hasErrors) {
                      dispatch(
                        showToast({
                          title: "Info",
                          message: "Please fill in all required fields.",
                          theme: "info",
                        })
                      );
                      setShowErrors(true);
                      return;
                    }
                    handleRequestSubmit(); // your submit logic
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    />
  );
};

export default RequestQuoteDialogue;
