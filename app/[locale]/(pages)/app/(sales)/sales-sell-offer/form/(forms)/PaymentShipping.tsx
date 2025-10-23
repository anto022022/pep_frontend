import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import {
  RightArrowIcon,
  TradeInformationIcon
} from "@/app/[locale]/_components/Icons/SVGIcons";
import SuccessModel from "@/app/[locale]/_components/OverLay/SuccessModel";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import PaymentMethods from "@/app/[locale]/_components/StoreFront/Forms/PaymentMethods";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import ShippingMethods from "@/app/[locale]/_components/StoreFront/Forms/ShippingMethods";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import {
  dispatchLeadTimeOptions,
  internationalShipping,
  PaymentTerm,
  paymentTermsOptions,
  ProductOfferKey,
  ShipInterNationalType,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetOfferFormDetailsQuery,
  useGetShippingDetailsOfOfferQuery,
  useUpdatePaymentShippingMutation,
} from "@/app/[locale]/_store/apiReducer/sellOfferApi";
import {
  setShowSuccessModel,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { paymentShippingSchema } from "@/app/[locale]/_validationSchema/salesSellOffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
interface DispatchLeadTime {
  min_day?: number | null;
  max_day?: number | null;
}
export interface shippingPackagingDetailsFormValue {
  internationalShipping: "yes" | "no" | "uponRequest";
  shippingMethod: string[];
  dispatchLeadTime?: DispatchLeadTime;
  paymentMethods: string[];
  paymentTerms?: PaymentTerm[];
  otherPaymentMethod?: string;
  customPaymentTerm?: string;
}

const PaymentShipping = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const editForm = searchParams.get("CurrentForm");
  const dispatch = useAppDispatch();

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );

  const t = useTranslations("salesOffer.shippingPayment");
  const common = useTranslations("common");

  const localizedPaymentTerms = useLocalizedOptions(
    "salesProduct",
    paymentTermsOptions
  );

  const { data, isSuccess } = useGetOfferFormDetailsQuery(
    { id: id ?? "", stage: ProductOfferKey.PaymentShipping },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductOfferKey.PaymentShipping] === "completed"
      ),
    }
  );

  const { data: productDetails, isSuccess: productDetailsSuccess } =
    useGetShippingDetailsOfOfferQuery(id ?? undefined, {
      skip:
        !id &&
        currentStepperStatus[ProductOfferKey.PaymentShipping] === "completed",
    });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<shippingPackagingDetailsFormValue>({
    defaultValues: {
      internationalShipping: ShipInterNationalType.NO,
      shippingMethod: [],
      dispatchLeadTime: {},
      paymentMethods: [],
      paymentTerms: [],
      otherPaymentMethod: "",
      customPaymentTerm: "",
    },
    resolver: zodResolver(paymentShippingSchema),
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        shippingMethod: data.data.shippingMethod ?? [],
        internationalShipping:
          data.data.internationalShipping ?? ShipInterNationalType.NO,
        dispatchLeadTime: data.data.dispatchLeadTime ?? {},
        paymentMethods: data.data.paymentMethods ?? [],
        paymentTerms: data?.data?.paymentTerms ?? [],
        otherPaymentMethod: data?.data?.otherPaymentMethod ?? undefined,
        customPaymentTerm: data?.data?.customPaymentTerm ?? "",
      });
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (
      currentStepperStatus[ProductOfferKey.PaymentShipping] !== "completed" &&
      productDetailsSuccess &&
      productDetails
    ) {
      reset({
        shippingMethod: productDetails?.data.shippingMethod ?? [],
        internationalShipping:
          productDetails?.data.internationalShipping ??
          ShipInterNationalType.NO,
        dispatchLeadTime: productDetails?.data.dispatchLeadTime ?? {},
        paymentMethods: productDetails?.data.paymentMethods ?? [],
        paymentTerms: productDetails?.data?.paymentTerms
          ? [productDetails?.data?.paymentTerms]
          : undefined,
        otherPaymentMethod:
          productDetails?.data?.otherPaymentMethod ?? undefined,
        customPaymentTerm: productDetails?.data?.customPaymentTerm ?? "",
      });
    }
  }, [productDetails, productDetailsSuccess, currentStepperStatus]);

  const [updateShippingDetails] = useUpdatePaymentShippingMutation();

  const onSubmit = async (
    data: shippingPackagingDetailsFormValue,
    skipCacheUpdate = false
  ) => {
    //      if (id && formRouting(isEditing , `./${id}`)) {
    //   return;
    // }
    if (id) {
      try {
        const { ...restData } = data;
        const response = await updateShippingDetails({
          id: id,
          ...restData,
          skipCacheUpdate,
        }).unwrap();

        if (response) {
          if (editForm) {
            router.push(`./${id}`);
          } else {
            if (
              currentStepperStatus[ProductOfferKey.PaymentShipping] !==
              "completed"
            ) {
              dispatch(setShowSuccessModel(true));
              setTimeout(() => {
                dispatch(setShowSuccessModel(false));
                router.push(`./${id}`);
              }, 1500);
            } else {
              router.push(`./${id}`);
            }
          }
        }
        useClearLocalStorageOnExit();
      } catch (error) {
        console.log("Error:", error);
        dispatch(
          showToast({
            title: "Error!",
            message: "Invalid Inputs",
            theme: "error",
          })
        );
      }
    }
  };

  const handleSaveAndContinue = async (
    data: shippingPackagingDetailsFormValue
  ) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };
  const formValues = watch();
  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <div className="title-subtxt-block">
            <FormTitle variant={"h1"} text={t("title")}>
              <TradeInformationIcon />
            </FormTitle>
          </div>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label" htmlFor="paymentMethod">
                {t("fields.paymentMethod.label")}
              </label>
              <Controller
                name="paymentMethods"
                control={control}
                render={({ field }) => (
                  <PaymentMethods
                    value={field.value}
                    onChange={(value) => {
                      if (field.value.includes(value)) {
                        const newArray = field.value.filter(
                          (fieldValue) => fieldValue !== value
                        );
                        field.onChange(newArray);
                        return;
                      }
                      field.onChange([...field.value, value]);
                    }}
                  />
                )}
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
                      placeholder={t(
                        "fields.paymentMethod.otherPaymentPlaceHolder"
                      )}
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
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.paymentTerms.label")}
                {`(${t("fields.paymentTerms.optionalLabel")})`}
              </label>
              <Controller
                name="paymentTerms"
                control={control}
                render={({ field }) => (
                  <MultiSelectInputs
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={localizedPaymentTerms}
                    optionLabel="name"
                    optionValue="value"
                    placeholder={t("fields.paymentTerms.placeholder")}
                    className="customize-dropdown"
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
                      placeholder={t("fields.paymentTerms.customPaymentTerm")}
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
            <div className="forms-group">
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.dispatchLeadTime.label")}
                {`(${t("fields.paymentTerms.optionalLabel")})`}
              </label>

              <Controller
                name="dispatchLeadTime"
                control={control}
                render={({ field }) => {
                  const selectedValue = dispatchLeadTimeOptions.find(
                    (opt) =>
                      opt &&
                      opt.min_day === field.value?.min_day &&
                      opt.max_day === field.value?.max_day
                  );
                  return (
                    <Select
                      options={dispatchLeadTimeOptions}
                      placeholder="Select Lead Time"
                      value={selectedValue}
                      onChange={(selectedValue) => {
                        field.onChange(selectedValue);
                      }}
                      itemTemplate={(option) => {
                        if (
                          option.max_day &&
                          option.min_day === option.max_day
                        ) {
                          return option.min_day === 1
                            ? t("fields.dispatchLeadTime.dispatchDayLabel", {
                              days: option.min_day,
                            })
                            : t("fields.dispatchLeadTime.dispatchDaysLabel", {
                              days: option.min_day,
                            });
                        }
                        if (option.min_day === null) {
                          return t("fields.dispatchLeadTime.madeToOrder");
                        }
                        return t("fields.dispatchLeadTime.dispatchDaysLabel", {
                          days: `${option.min_day}+`,
                        });
                      }}
                      valueTemplate={(option) => {
                        if (!option)
                          return t("fields.dispatchLeadTime.placeholder");
                        if (
                          option.max_day &&
                          option.min_day === option.max_day
                        ) {
                          return option.min_day === 1
                            ? t("fields.dispatchLeadTime.dispatchDayLabel", {
                              days: option.min_day,
                            })
                            : t("fields.dispatchLeadTime.dispatchDaysLabel", {
                              days: option.min_day,
                            });
                        }
                        if (option.min_day === null) {
                          return t("fields.dispatchLeadTime.madeToOrder");
                        }
                        return t("fields.dispatchLeadTime.dispatchDaysLabel", {
                          days: `${option.min_day}+`,
                        });
                      }}
                    />
                  );
                }}
              />
              {errors.dispatchLeadTime && (
                <span className="error-txt">
                  {errors.dispatchLeadTime.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.shipsInternationally.label")}
              </label>
              <div className="price-forms-radio ">
                {internationalShipping.map((option, i) => (
                  <label
                    key={i}
                    htmlFor={option.value}
                    className="forms-radio-horiz"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      className="forms-radio"
                      {...register("internationalShipping")}
                      value={option.value}
                    />
                    <span className="f-r-h-label">{t(option.name)} </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="ShippingMethod">
                {t("fields.shippingModes.label")}{" "}
              </label>
              <Controller
                name="shippingMethod"
                control={control}
                render={({ field }) => (
                  <ShippingMethods
                    value={field.value}
                    onChange={(value) => {
                      if (field.value.includes(value)) {
                        const newArray = field.value.filter(
                          (fieldValue) => fieldValue !== value
                        );
                        field.onChange(newArray);
                        return;
                      }
                      field.onChange([...field.value, value]);
                    }}
                  />
                )}
              />
              {errors.shippingMethod && (
                <span className="error-txt">
                  {errors.shippingMethod.message}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="c-f-b-bottom">
        <div className="c-f-b-b-left"></div>
        <div className="c-f-b-b-right">
          <ButtonIconLeftOutline
            type="button"
            name={common("saveAndContinue")}
            className={"bg-outline-grey custom-width"}
            onClick={handleSubmit(handleSaveAndContinue)}
            disabled={
              isSubmitting ||
              !(
                id &&
                (currentStepperStatus?.[ProductOfferKey.PaymentShipping] ===
                  "completed" ||
                  currentStepperStatus?.[ProductOfferKey.PaymentShipping] ===
                  "active")
              )
            }
          />
          <ButtonIconRight
            name={
              currentStepperStatus?.[ProductOfferKey.PaymentShipping] ===
                "completed"
                ? "Update"
                : common("Continue")
            }
            onClick={handleSubmit((data) => onSubmit(data))}
            disabled={
              isSubmitting ||
              !(
                id &&
                (currentStepperStatus?.[ProductOfferKey.PaymentShipping] ===
                  "completed" ||
                  currentStepperStatus?.[ProductOfferKey.PaymentShipping] ===
                  "active")
              )
            }
          >
            <RightArrowIcon />
          </ButtonIconRight>
          {/* <SellOfferCreatedDialog /> */}
          <SuccessModel text="Your sell offer has been submitted successfully. It will be reviewed by the admin and will go live once approved" />
        </div>
      </div>
    </div>
  );
};

export default PaymentShipping;
