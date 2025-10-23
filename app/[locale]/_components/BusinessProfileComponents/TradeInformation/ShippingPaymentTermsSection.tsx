import Button from "@/app/[locale]/_components/Buttons/Button";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import PaymentMethods from "@/app/[locale]/_components/StoreFront/Forms/PaymentMethods";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import ShippingMethods from "@/app/[locale]/_components/StoreFront/Forms/ShippingMethods";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { Currency } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  BusinessProfileStageKey,
  currencyList,
  paymentMethodsData,
  PaymentTerm,
  paymentTermsOptions,
  shippingMethodsData,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateShippingPaymentTermsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { shippingSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface ShippingPaymentTermsSectionProps {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

export interface ShippingPayment {
  shippingMethod: string[];
  acceptedCurrency: Currency[];
  paymentMethods: string[];
  paymentTerms: PaymentTerm;
  otherPaymentMethod?: string;
  customPaymentTerm?: string;
}

const ShippingPaymentTermsSection: React.FC<
  ShippingPaymentTermsSectionProps
> = ({ isEdit, onSuccess, updateEditStatus }) => {
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShippingPayment>({
    defaultValues: {
      shippingMethod: [],
      acceptedCurrency: [],
      paymentMethods: [],
      paymentTerms: undefined,
      otherPaymentMethod: "",
      customPaymentTerm: "",
    },
    resolver: zodResolver(shippingSchema),
  });
  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const formValues = watch();
  const { data: shippingTermsData, isSuccess } = useGetBusinessInformationQuery(
    {
      stage: "ShippingPaymentTerms",
    },
    {
      skip:
        currentStepperStatus[BusinessProfileStageKey.ShippingPaymentTerms] ===
        "pending",
    }
  );
  const salesProduct = useTranslations("salesProduct");
  const t = useTranslations("businessProfile.shippingDetails");
  const localizedPaymentTerms = useLocalizedOptions(
    "salesProduct",
    paymentTermsOptions
  );
  const [updateShipping] = useUpdateShippingPaymentTermsMutation();
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const common = useTranslations("common");
  const handleFormSubmit = async (data: ShippingPayment) => {
    try {
      await updateShipping(data);
      reset();
      onSuccess();
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Invalid Inputs",
          theme: "error",
        })
      );
    }
    reset();
    onSuccess();
  };

  useEffect(() => {
    // if(!shippingTermsData?.data?.shippingMethod){
    //       updateEditStatus(BusinessProfileStageKey.ShippingPaymentTerms, true);
    //     }
    //     else{
    //       updateEditStatus(BusinessProfileStageKey.ShippingPaymentTerms,false)
    //     }
    if (
      currentStepperStatus[BusinessProfileStageKey.ShippingPaymentTerms] !==
      "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.ShippingPaymentTerms, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.ShippingPaymentTerms, false);
    }
    if (isSuccess) {
      reset({
        shippingMethod: shippingTermsData?.data?.shippingMethod ?? [],
        acceptedCurrency: shippingTermsData?.data?.acceptedCurrency ?? [],
        paymentMethods: shippingTermsData?.data?.paymentMethods ?? [],
        paymentTerms: shippingTermsData?.data?.paymentTerms ?? undefined,
        otherPaymentMethod:
          shippingTermsData?.data?.otherPaymentMethod ?? undefined,
      });
    }
  }, [isSuccess, shippingTermsData, reset]);

  const onError = () => {
    // Show toast only if there are validation errors
    dispatch(
      showToast({
        title: "Warning!",
        message: "Please fill in all required fields.",
        theme: "info",
      })
    );
  };

  return (
    <>
      {!isEdit ? (
        <div className="c-f-b-t-body label-grey-reverse">
          <div className="tabs-content">
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {t("shipment")}
              </label>
              <div className="t-f-g-wrapper gap-10px">
                <span
                  className="t-f-g-txt"
                  style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                >
                  {shippingTermsData?.data?.shippingMethod &&
                    shippingTermsData?.data?.shippingMethod.length > 0
                    ? shippingTermsData?.data?.shippingMethod.map(
                      (id: string, index: number) => {
                        const method = shippingMethodsData.find(
                          (item) => item.id === id
                        );

                        const showDivider =
                          shippingTermsData?.data?.shippingMethod.length > 1;
                        return (
                          <div
                            className="t-f-g-wrapper gap-10px"
                            key={index}
                            title={method?.label || ""}
                          >
                            {/* {method?.label}
                                    {method?.icon} */}
                            <div
                              className={`t-f-g-wrapper ${showDivider &&
                                index <
                                shippingTermsData?.data?.shippingMethod
                                  .length -
                                1
                                ? "divider-border-right"
                                : ""
                                }`}
                            >
                              {method?.icon}
                              <span className="t-f-g-txt">
                                {" "}
                                {salesProduct(method?.label)}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )
                    : ""}
                </span>
              </div>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {t("currency")}
              </label>
              {shippingTermsData?.data?.acceptedCurrency &&
                shippingTermsData?.data?.acceptedCurrency.length > 0
                ? shippingTermsData?.data?.acceptedCurrency?.map(
                  (item: Currency, index: number) => (
                    <span key={index}>
                      {item.name}
                      {index !==
                        shippingTermsData?.data?.acceptedCurrency.length -
                        1 && ", "}
                    </span>
                  )
                )
                : ""}
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {t("payment")}
              </label>
              <div className="t-f-g-wrapper gap-10px">
                <span
                  className="t-f-g-txt"
                  style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                >
                  {shippingTermsData?.data?.paymentMethods &&
                    shippingTermsData?.data?.paymentMethods.length > 0
                    ? shippingTermsData?.data?.paymentMethods.map(
                      (id: string, index: number) => {
                        const method = paymentMethodsData.find(
                          (item) => item.id === id
                        );
                        return (
                          <div
                            className="t-f-g-wrapper gap-10px"
                            key={index}
                            title={method?.label || ""}
                          >
                            {method?.icon}
                          </div>
                        );
                      }
                    )
                    : ""}
                </span>
              </div>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {t("paymentTerm")}
              </label>
              <span className="t-f-g-txt">
                {shippingTermsData?.data?.paymentTerms}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">{t("shipment")}</label>
              <Controller
                name="shippingMethod"
                control={control}
                render={({ field }) => {
                  const valueArray = field.value ?? [];

                  return (
                    <ShippingMethods
                      value={valueArray}
                      onChange={(value) => {
                        if (valueArray.includes(value)) {
                          const newArray = valueArray.filter(
                            (fieldValue) => fieldValue !== value
                          );
                          field.onChange(newArray);
                        } else {
                          field.onChange([...valueArray, value]);
                        }
                      }}
                    />
                  );
                }}
              />
              {errors.shippingMethod && (
                <span className="error-txt">
                  {errors.shippingMethod.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">{t("currency")}</label>
              <Controller
                name="acceptedCurrency"
                control={control}
                render={({ field }) => (
                  <MultiSelectInputs
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={localizedCurrencyList}
                    optionLabel="name"
                    filter={false}
                    selectAllLabel={common("selectAll")}
                    placeholder={t("accepted")}
                    maxSelectedLabels={5}
                    className="customize-dropdown"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                    appendTo={'self'}
                  />
                )}
              />
              {errors.acceptedCurrency && (
                <span className="error-txt">
                  {errors.acceptedCurrency.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">{t("payment")}</label>
              <Controller
                name="paymentMethods"
                control={control}
                render={({ field }) => {
                  const valueArray = field.value ?? [];
                  return (
                    <PaymentMethods
                      value={valueArray}
                      onChange={(value) => {
                        if (valueArray.includes(value)) {
                          const newArray = valueArray.filter(
                            (fieldValue) => fieldValue !== value
                          );
                          field.onChange(newArray);
                        } else {
                          field.onChange([...valueArray, value]);
                        }
                      }}
                    />
                  );
                }}
              />
              {errors.paymentMethods && (
                <span className="error-txt">
                  {errors.paymentMethods.message}
                </span>
              )}
              <div
                className={`wid-100 other-payment-input ${formValues.paymentMethods?.includes("others") ? "active" : ""
                  }`}
              >
                <Controller
                  name="otherPaymentMethod"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      className="wid-100"
                      placeholder={t("otherPayment")}
                      {...field}
                    />
                  )}
                />
                {errors.otherPaymentMethod && (
                  <span className="error-txt">
                    {errors.otherPaymentMethod.message}
                  </span>
                )}
              </div>
            </div>
            <div className="forms-group">
              <label className="f-g-label">{t("paymentTerm")}</label>
              <Controller
                name="paymentTerms"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedPaymentTerms}
                    optionLabel={`name`}
                    value={field.value}
                    placeholder={t("selectTerm")}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {errors.paymentTerms && (
                <span className="error-txt">{errors.paymentTerms.message}</span>
              )}

              <div
                className={`wid-100 other-payment-input ${formValues.paymentTerms?.includes(PaymentTerm.CUSTOM)
                  ? "active"
                  : ""
                  }`}
              >
                <Controller
                  name="customPaymentTerm"
                  control={control}
                  render={({ field }) => (
                    <InputField
                      className="wid-100"
                      placeholder={t("customTerm")}
                      {...field}
                    />
                  )}
                />
                {errors.customPaymentTerm && (
                  <span className="error-txt">
                    {errors.customPaymentTerm.message}
                  </span>
                )}
              </div>
            </div>
            <div className="button-group-block edit-save-btn-block">
              <Button
                className={"btn-outline bg-outline-dark btn-c-sm"}
                text={t("cancel")}
                onClick={onSuccess}
                disabled={isSubmitting ||
                  !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] === "completed" &&
                    currentStepperStatus?.[BusinessProfileStageKey.CompanyRegistrationDetails] === "completed" &&
                    currentStepperStatus?.[BusinessProfileStageKey.MarketLogistics] === "completed"
                  )
                }
              />
              <Button
                className={"btn-c-primary btn-c-sm"}
                text={t("save")}
                onClick={handleSubmit(handleFormSubmit, onError)}
                disabled={isSubmitting ||
                  !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] === "completed" &&
                    currentStepperStatus?.[BusinessProfileStageKey.CompanyRegistrationDetails] === "completed" &&
                    currentStepperStatus?.[BusinessProfileStageKey.MarketLogistics] === "completed"
                  )
                }
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ShippingPaymentTermsSection;
