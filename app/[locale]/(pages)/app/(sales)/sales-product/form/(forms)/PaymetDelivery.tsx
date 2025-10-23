import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import { RightArrowIcon, TradeDetailsIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import PaymentMethods from "@/app/[locale]/_components/StoreFront/Forms/PaymentMethods";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import {
  PaymentTerm,
  paymentTermsOptions,
  ProductStageKey,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useUpdatePaymentDeliveryMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { paymentDeliverySchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export interface paymentDeliveryFormValue {
  paymentMethods: string[];
  paymentTerms?: PaymentTerm;
  otherPaymentMethod?: string;
  customPaymentTerm?: string;
}

const PaymetDelivery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const dispatch = useAppDispatch();

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );

  const common = useTranslations("common");
  const t = useTranslations("salesProduct.paymentTerms");
  const localizedPaymentTerms = useLocalizedOptions(
    "salesProduct",
    paymentTermsOptions
  );

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.PaymentTerms },
    {
      skip: !(
        id && currentStepperStatus[ProductStageKey.PaymentTerms] === "completed"
      ),
    }
  );
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<paymentDeliveryFormValue>({
    defaultValues: {
      paymentMethods: [],
      paymentTerms: undefined,
      otherPaymentMethod: "",
      customPaymentTerm: "",
    },
    resolver: zodResolver(paymentDeliverySchema),
  });

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.PaymentTerms] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.PaymentTerms]]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        paymentMethods: data.data.paymentMethods ?? [],
        paymentTerms: data?.data?.paymentTerms ?? undefined,
        otherPaymentMethod: data?.data?.otherPaymentMethod ?? undefined,
        customPaymentTerm: data?.data?.customPaymentTerm ?? "",
      });
    }
  }, [data, isSuccess]);

  const formValues = watch();

  const [updatePaymentDelivery] = useUpdatePaymentDeliveryMutation();

  const onSubmit = async (
    data: paymentDeliveryFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        const { ...restData } = data;
        await updatePaymentDelivery({
          id: id,
          ...restData,
          skipCacheUpdate,
        }).unwrap();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.ShippingDetails));
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

  const handleSaveAndContinue = async (data: paymentDeliveryFormValue) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <div className="title-subtxt-block">
            <FormTitle variant={"h1"} text={t("title")}>
              <TradeDetailsIcon />
            </FormTitle>
          </div>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.paymentTerms.label")}
                {`(${t("fields.paymentTerms.optionalLabel")})`}
              </label>
              <Controller
                name="paymentTerms"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedPaymentTerms}
                    optionLabel={`name`}
                    value={field.value}
                    placeholder={t("fields.paymentTerms.placeholder")}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {errors.paymentTerms && (
                <span className="error-txt">{errors.paymentTerms.message}</span>
              )}
            </div>
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
                (currentStepperStatus?.[ProductStageKey.PaymentTerms] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.PaymentTerms] ===
                  "active")
              )
            }
          />
          <ButtonIconRight
            name={common("Continue")}
            onClick={handleSubmit((data) => onSubmit(data))}
            disabled={
              isSubmitting ||
              !(
                id &&
                (currentStepperStatus?.[ProductStageKey.PaymentTerms] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.PaymentTerms] ===
                  "active")
              )
            }
          >
            <RightArrowIcon />
          </ButtonIconRight>
        </div>
      </div>
    </div>
  );
};

export default PaymetDelivery;
