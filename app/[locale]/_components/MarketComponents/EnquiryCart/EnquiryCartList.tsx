"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import TextEditor from "@/app/[locale]/_components/Common/TextEditor";
import QuoteRequestCard from "@/app/[locale]/_components/MarketComponents/EnquiryCart/QuoteRequestCard";
import DeliveryDatePipe from "@/app/[locale]/_components/Pipe/DeliveryDatePipe";
import MinOrderQtyPipe from "@/app/[locale]/_components/Pipe/MinOrderQtyPipe";
import CheckBoxInput from "@/app/[locale]/_components/StoreFront/Forms/CheckBoxInputs";
import {
  RFQCartItem,
  SelectedVariants,
} from "@/app/[locale]/_interface/RfqCartInterface";
import {
  useGetRfqCartListQuery,
  usePostRfqRequestMutation,
  useRemoveFromRfqCartMutation,
  useUpdateRfqCartMutation,
} from "@/app/[locale]/_store/apiReducer/rfqCartApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { getAvailableAttributes } from "@/app/[locale]/_utility/enquiryUtility";
import "@/app/[locale]/dev_styles.css";
import Cart from "@/public/img/cart.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface RFQCartItemAdditional {
  isSelected?: boolean;
  message?: string;
  isAgreed?: boolean;
  showErrors?: boolean;
}
type EnquiryCartListProps = {
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
};
// const EnquiryCartList = () => {
export const EnquiryCartList: React.FC<EnquiryCartListProps> = ({
  setCategoryId,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currencyCode = useAppSelector(
    (state: RootState) => state.location.currency
  );
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.userData.isLoggedIn
  );
  const t = useTranslations("productDetailPage.enquiryCart");

  const { data, isLoading, isError } = useGetRfqCartListQuery(
    {
      rfqType: "long",
      currencyCode: currencyCode ?? "",
    },
    { skip: !currencyCode || !isLoggedIn }
  );

  const updateTimers = useRef<{ [itemId: string]: NodeJS.Timeout }>({});

  const [rfqCartList, setRfqCartList] = useState<
    (RFQCartItem & RFQCartItemAdditional)[]
  >([]);
  const [noOfSelectedCartItems, setNoOfSelectedCartItems] = useState(0);
  const [isMultiSend, setIsMultiSend] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [postRfqRequest] = usePostRfqRequestMutation();
  const [removeFromCartMutation] = useRemoveFromRfqCartMutation();
  const [updateRfqCart] = useUpdateRfqCartMutation();

  useEffect(() => {
    if (data) {
      const enrichedData = (data.data || []).map((item) => ({
        ...item,
        isSelected: true,
        selectedVariants: (item.selectedVariants || []).map((variant) => ({
          ...variant,
          isSelected: true,
        })),
      }));
      setCategoryId(data?.data[0]?.category);
      setRfqCartList(enrichedData);
      setNoOfSelectedCartItems(enrichedData.length);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      Object.values(updateTimers.current).forEach(clearTimeout);
    };
  }, []);

  const computeTotalOrderQuantity = (selectedVariants: SelectedVariants[]) => {
    return selectedVariants.reduce((sum, v) => sum + v.quantity, 0);
  };

  const computeTotalOrderQuantityWithIsSelected = (
    selectedVariants: SelectedVariants[]
  ) => {
    return selectedVariants.reduce(
      (sum, v) => (v.isSelected ? sum + v.quantity : sum),
      0
    );
  };

  const handleVariantQuantityById = (
    itemId: string,
    variantId: string,
    newQty: number
  ) => {
    setRfqCartList((prev) =>
      prev.map((item) => {
        if (item._id !== itemId) return item;

        const updatedVariants = item.selectedVariants.map((v) =>
          v._id === variantId ? { ...v, quantity: newQty } : v
        );

        if (updateTimers.current[itemId]) {
          clearTimeout(updateTimers.current[itemId]);
        }
        updateTimers.current[itemId] = setTimeout(() => {
          updateRfqCart({
            id: itemId,
            selectedVariants: updatedVariants,
            totalOrderQuantity: computeTotalOrderQuantity(updatedVariants),
          });
          // if (newQty <= 0) {
          //   handleDeleteVariant(itemId, variantId);
          //   if (computeTotalOrderQuantity(updatedVariants) <= 0) {
          //     handleDeleteCart(itemId);
          //   }
          // }
        }, 500);

        return {
          ...item,
          selectedVariants: updatedVariants,
          totalOrderQuantity:
            computeTotalOrderQuantityWithIsSelected(updatedVariants),
        };
      })
    );
  };

  const handleVariantChangeConfirm = (
    itemId: string,
    oldVariantId: string,
    newVariantId: string
  ) => {
    setRfqCartList((prev) => {
      const item = prev.find((it) => it._id === itemId);
      if (!item) return prev;

      const isNewVariantAlreadySelected = item.selectedVariants.some(
        (v) => v._id === newVariantId
      );

      if (isNewVariantAlreadySelected) {
        dispatch(
          showToast({
            title: "Info",
            message: "Variant is already selected.",
            theme: "info",
          })
        );
        return prev; // no changes
      }

      const updatedList = prev.map((it) => {
        if (it._id !== itemId) return it;

        const updatedVariants = it.selectedVariants.map((v) =>
          v._id === oldVariantId ? { ...v, _id: newVariantId } : v
        );

        const updatedTotalQty = computeTotalOrderQuantity(updatedVariants);

        updateRfqCart({
          id: itemId,
          selectedVariants: updatedVariants,
          totalOrderQuantity: updatedTotalQty,
        });

        return {
          ...it,
          selectedVariants: updatedVariants,
          totalOrderQuantity: updatedTotalQty,
        };
      });

      return updatedList;
    });
  };

  const handleDeleteVariant = (itemId: string, variantId: string) => {
    setRfqCartList((prev) =>
      prev.map((item) => {
        if (item._id !== itemId) return item;

        const updatedVariants = item.selectedVariants.filter(
          (v) => v._id !== variantId
        );

        updateRfqCart({
          id: itemId,
          selectedVariants: updatedVariants,
          totalOrderQuantity: computeTotalOrderQuantity(updatedVariants),
        });

        return {
          ...item,
          selectedVariants: updatedVariants,
          totalOrderQuantity:
            computeTotalOrderQuantityWithIsSelected(updatedVariants),
        };
      })
    );
  };

  const handleTotalQuantity = (itemId: string, newQty: number) => {
    setRfqCartList((prev) =>
      prev.map((item) => {
        if (item._id !== itemId || item.variants.length !== 0) return item;

        if (updateTimers.current[itemId]) {
          clearTimeout(updateTimers.current[itemId]);
        }

        updateTimers.current[itemId] = setTimeout(() => {
          updateRfqCart({
            id: itemId,
            totalOrderQuantity: newQty,
          });
          // if (newQty === 0) {
          //   handleDeleteCart(itemId);
          // }
        }, 500);

        return {
          ...item,
          totalOrderQuantity: newQty,
        };
      })
    );
  };

  const handleVariantSelect = (
    itemId: string,
    variantId: string,
    isSelected: boolean
  ) => {
    let shouldIncrement = false;
    let shouldDecrement = false;

    setRfqCartList((prev) =>
      prev.map((item) => {
        if (item._id !== itemId) return item;

        const updatedVariants = item.selectedVariants.map((v) =>
          v._id === variantId ? { ...v, isSelected } : v
        );

        const allVariantsSelected = updatedVariants.every((v) => v.isSelected);

        if (item.isSelected !== allVariantsSelected) {
          if (allVariantsSelected) shouldIncrement = true;
          else shouldDecrement = true;
        }

        return {
          ...item,
          selectedVariants: updatedVariants,
          isSelected: allVariantsSelected,
          totalOrderQuantity:
            computeTotalOrderQuantityWithIsSelected(updatedVariants),
        };
      })
    );
    setNoOfSelectedCartItems((prev) => {
      if (shouldIncrement) return prev + 1;
      if (shouldDecrement && prev > 0) return prev - 1;
      return prev;
    });
  };

  const handleCartSelect = (productId: string, isSelected: boolean) => {
    setRfqCartList((prev) => {
      return prev.map((item) => {
        return item.productInfo._id === productId
          ? {
            ...item,
            isSelected,
            selectedVariants: item.selectedVariants.map((v) => ({
              ...v,
              isSelected,
            })),
          }
          : item;
      });
    });
    setNoOfSelectedCartItems(
      (prev) => (isSelected ? prev + 1 : prev > 0 ? prev - 1 : 0) // Ensure it doesn't go below 0
    );
  };

  const updateItemField = (
    index: number,
    field: keyof (RFQCartItem & RFQCartItemAdditional),
    value: any
  ) => {
    setRfqCartList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSingleSubmit = async (
    item: RFQCartItem & RFQCartItemAdditional
  ) => {
    const requestData = {
      items: [
        {
          productId: item.productInfo._id,
          rfqDescription: item.message,
          selectedVariants: item.selectedVariants,
          totalOrderQuantity: item.totalOrderQuantity,
          cartId: item._id,
        },
      ],
    };
    try {
      await postRfqRequest(requestData).unwrap();
      // Optionally, you can show a success message or clear the cart
    } catch (error) {
      console.error("Error submitting RFQ request:", error);
    }
  };

  const handleMultiSubmit = async () => {
    const selectedItems = rfqCartList.filter(
      (item) =>
        item.isSelected &&
        item.totalOrderQuantity >=
        MinOrderQtyPipe({
          minOrderQty: item.productInfo?.minOrderQuantity,
          offerInfo: item.productInfo?.activeOffer?.offerInfo,
        })
    );

    if (selectedItems.length === 0) {
      return;
    }

    const requestData = {
      items: selectedItems.map((item) => ({
        productId: item.productInfo._id,
        rfqDescription: messageContent,
        selectedVariants: item.selectedVariants,
        totalOrderQuantity: item.totalOrderQuantity,
        cartId: item._id,
      })),
    };

    try {
      await postRfqRequest(requestData).unwrap();
      // Optionally, you can show a success message or clear the cart
    } catch (error) {
      console.error("Error submitting RFQ request:", error);
    }
  };

  const handleDeleteCart = async (cartId: string) => {
    try {
      await removeFromCartMutation(cartId).unwrap();
      setRfqCartList((prev) => prev.filter((item) => item._id !== cartId));
      setNoOfSelectedCartItems((prev) => (prev > 0 ? prev - 1 : 0)); // Ensure it doesn't go below 0
    } catch (error) {
      console.error("Error removing item from RFQ cart:", error);
    }
  };

  if (isLoading) {
    return <div className="s-b-g-left">Loading...</div>;
  }
  if (isError) {
    return <div className="s-b-g-left">Error loading RFQ cart list.</div>;
  }

  return (
    <div className="s-b-g-left">
      {rfqCartList.length > 0 ? (
        <>
          <div className="select-all-enquiry-block">
            <div className="s-a-e-b-left">
              <CheckBoxInput
                label={t("selectAll", { count: rfqCartList.length })}
                id={"selectAll"}
                className={"light-bg"}
                checked={noOfSelectedCartItems === rfqCartList.length}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setRfqCartList((prev) =>
                    prev.map((item) => ({
                      ...item,
                      isSelected: isChecked,
                      selectedVariants: item.selectedVariants.map((v) => ({
                        ...v,
                        isSelected: isChecked,
                      })),
                    }))
                  );
                  setNoOfSelectedCartItems(isChecked ? rfqCartList.length : 0);
                }}
              />
            </div>
            <div className="s-a-e-b-right">
              {noOfSelectedCartItems > 1 && !isMultiSend && (
                <Buttons
                  className={"btn-outline bg-outline-dark"}
                  text={t("sendAllEnquiry")}
                  onClick={() => {
                    setIsMultiSend(true);
                  }}
                />
              )}
            </div>
          </div>
          <div className="quote-request-card-group">
            {isMultiSend && (
              <div className="compose-card-comp">
                <div className="c-c-c-body">
                  <div className="compose-inputs-block">
                    <div className="r-q-m-b-item">
                      <div className="r-q-form-group">
                        <label htmlFor="message" className="r-q-f-g-label">
                          {t("message")}:
                        </label>
                        <TextEditor
                          value={messageContent}
                          onChange={setMessageContent}
                          placeholder={t("enterMsg")}
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
                            <Link href="/terms">{t("agreeToTerms.part2")}</Link>{" "}
                            {t("agreeToTerms.part3")}{" "}
                            <Link href="/privacy">
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

                  <div className="compose-bottom-action-block">
                    <div className="c-b-c-b-left">
                      <Buttons
                        className={"btn-c-primary"}
                        text={t("requestQuote")}
                        onClick={() => {
                          if (!messageContent || !isAgreed) {
                            // Handle validation error
                            setShowErrors(true);
                            return;
                          }
                          // Proceed with sending quotes
                          handleMultiSubmit();
                        }}
                      />
                    </div>
                    <div className="c-b-c-b-right">
                      {" "}
                      <Buttons
                        className={"bg-outline-dark btn-outline"}
                        text={t("cancel")}
                        onClick={() => {
                          setIsMultiSend(false);
                          setMessageContent("");
                          setIsAgreed(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {rfqCartList.map((item, index) => {
              const availableAttributes = getAvailableAttributes(
                item?.variants || []
              );

              return (
                <QuoteRequestCard
                  businessInfo={item?.businessInfo}
                  productInfo={{
                    _id: item?.productInfo?._id || "",
                    name: item?.productInfo?.productName || "",
                    imageUrl: item?.productInfo?.productImage[0]?.src || "",
                    minOrderQuantity: MinOrderQtyPipe({
                      minOrderQty: item?.productInfo?.minOrderQuantity,
                      offerInfo: item?.productInfo?.activeOffer?.offerInfo,
                    }),
                    moqUnit: item?.productInfo?.moqUnit ?? "",
                    deliveryDate: DeliveryDatePipe({
                      production: item?.productInfo?.productionLeadTime,
                      dispatch: item?.productInfo?.dispatchLeadTime,
                    }),
                    currency: item?.productInfo?.currency,
                    pricing: item?.productInfo?.pricing,
                    stockAvailability:
                      item?.productInfo?.stockAvailability ?? "inStock",
                    offerDetails: item?.productInfo?.activeOffer?.offerInfo,
                  }}
                  handleTotalQuantity={(qty) =>
                    handleTotalQuantity(item._id, qty)
                  }
                  selectedVariants={item?.selectedVariants}
                  availableAttributes={availableAttributes}
                  availableVariants={item?.variants}
                  totalOrderQuantity={item?.totalOrderQuantity ?? 0}
                  handleVariantQuantityById={(variantId, newQty) =>
                    handleVariantQuantityById(item._id, variantId, newQty)
                  }
                  handleVariantChangeConfirm={(oldId, newId) =>
                    handleVariantChangeConfirm(item._id, oldId, newId)
                  }
                  handleDeleteVariant={(variantId) =>
                    handleDeleteVariant(item._id, variantId)
                  }
                  handleVariantSelect={(variantId, isSelected) =>
                    handleVariantSelect(item._id, variantId, isSelected)
                  }
                  handleCartSelect={handleCartSelect}
                  isSelected={item?.isSelected ?? false}
                  message={item.message ?? ""}
                  onMessageChange={(msg) =>
                    updateItemField(index, "message", msg)
                  }
                  isAgreed={item.isAgreed ?? false}
                  onAgreeChange={(agree) =>
                    updateItemField(index, "isAgreed", agree)
                  }
                  showErrors={item.showErrors ?? false}
                  onSetShowErrors={(val) =>
                    updateItemField(index, "showErrors", val)
                  }
                  handleDeleteCart={() => handleDeleteCart(item._id)}
                  onSubmit={() => {
                    const hasError =
                      !item.message ||
                      !item.isAgreed ||
                      item.totalOrderQuantity <
                      MinOrderQtyPipe({
                        minOrderQty: item.productInfo?.minOrderQuantity,
                        offerInfo: item.productInfo?.activeOffer?.offerInfo,
                      });
                    if (hasError) {
                      updateItemField(index, "showErrors", true);
                      return;
                    }

                    handleSingleSubmit(item);
                  }}
                  key={item._id}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-cart-wrapper">
          <div className="empty-cart-content">
            <Image src={Cart} alt="Cart Image" className="empty-cart-image" />
            <Typography variant="h2">{t("emptyCart.title")}</Typography>
            <Typography variant="p">{t("emptyCart.subTitle")}</Typography>
            <Buttons
              className={"btn-c-primary"}
              text={
                isLoggedIn
                  ? t("emptyCart.browseProduct")
                  : t("emptyCart.loginAndBrowse")
              }
              onClick={() => {
                router.push(isLoggedIn ? "/products" : "/authenticate");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryCartList;
