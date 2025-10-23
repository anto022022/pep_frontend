import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import { RightArrowIcon, ShippingIcons } from "@/app/[locale]/_components/Icons/SVGIcons";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import ShippingMethods from "@/app/[locale]/_components/StoreFront/Forms/ShippingMethods";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import {
  dispatchLeadTimeOptions,
  incoTermsOptions,
  internationalShipping,
  packagingTypeOptions,
  ProductStageKey,
  ShipInterNationalType,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useUpdateShippingDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { shippingDetailsSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
export interface DispatchLeadTime {
  min_day?: number | null;
  max_day?: number | null;
}
export interface shippingPackagingDetailsFormValue {
  internationalShipping: string;
  shippingMethod: string[];
  incoTerms: string;
  portOfDispatch?: string;
  shippingUnit?: string;
  shippingQty?: number;
  shipmentIdentifier?: string;
  dispatchLeadTime: DispatchLeadTime;
}

const ShippingPackagingDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const dispatch = useAppDispatch();

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );

  const t = useTranslations("salesProduct.shipping_logistics");
  const common = useTranslations("common");
  const localizedIncoTerms = useLocalizedOptions(
    "salesProduct",
    incoTermsOptions
  );
  const localizedShippingUnits = useLocalizedOptions(
    "salesProduct",
    packagingTypeOptions
  );

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.ShippingDetails },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductStageKey.ShippingDetails] === "completed"
      ),
    }
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<shippingPackagingDetailsFormValue>({
    defaultValues: {
      internationalShipping: ShipInterNationalType.NO,
      shippingMethod: [],
      incoTerms: undefined,
      portOfDispatch: "",
      shippingQty: undefined,
      shipmentIdentifier: "",
      dispatchLeadTime: {},
    },
    resolver: zodResolver(shippingDetailsSchema),
  });

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.ShippingDetails] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.ShippingDetails]]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        shippingMethod: data.data.shippingMethod ?? [],
        incoTerms: data.data.incoTerms ?? undefined,
        internationalShipping:
          data.data.internationalShipping ?? ShipInterNationalType.NO,
        portOfDispatch: data.data.portOfDispatch ?? "",
        shippingUnit: data.data.shippingUnit ?? undefined,
        shippingQty: data.data.shippingQty ?? undefined,
        shipmentIdentifier: data.data.shipmentIdentifier ?? "",
        dispatchLeadTime: data.data.dispatchLeadTime ?? {},
      });
    }
  }, [data, isSuccess]);

  const [updateShippingDetails] = useUpdateShippingDetailsMutation();

  const onSubmit = async (
    data: shippingPackagingDetailsFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        const { ...restData } = data;
        await updateShippingDetails({
          id: id,
          ...restData,
          skipCacheUpdate,
        }).unwrap();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.AdditionalDetails));
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
  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <div className="title-subtxt-block">
            <FormTitle variant={"h1"} text={t("title")}>
              <ShippingIcons />
            </FormTitle>
          </div>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
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
            <div className="forms-group">
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.incoterms.label")}
              </label>
              <Controller
                name="incoTerms"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedIncoTerms}
                    optionLabel={`name`}
                    optionValue="code"
                    value={field.value}
                    placeholder={t("fields.incoterms.placeholder")}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {errors.incoTerms && (
                <span className="error-txt">{errors.incoTerms.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.portOfDispatch.label")}{" "}
                <span className="f-g-label-dim">
                  ({t("fields.portOfDispatch.optionalLabel")})
                </span>
              </label>

              <Controller
                name="portOfDispatch"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("fields.portOfDispatch.placeholder")}
                  />
                )}
              />

              {errors.portOfDispatch && (
                <span className="error-txt">
                  {errors.portOfDispatch.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.dispatchLeadTime.label")}{" "}
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
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.packagingType.label")}
                <span className="f-g-label-dim">
                  ({t("fields.portOfDispatch.optionalLabel")})
                </span>
              </label>
              <Controller
                name="shippingUnit"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedShippingUnits}
                    optionLabel={`name`}
                    optionValue="value"
                    value={field.value}
                    placeholder={t("fields.packagingType.placeholder")}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.shippingUnit && (
                <span className="error-txt">{errors.shippingUnit.message}</span>
              )}
            </div>

            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.unitsPerPackage.label")}
                <span className="f-g-label-dim">
                  ({t("fields.portOfDispatch.optionalLabel")})
                </span>
              </label>

              <Controller
                name="shippingQty"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("fields.unitsPerPackage.placeholder")}
                    value={field.value?.toString() ?? ""}
                    onChange={(e) => {
                      // debugger;
                      const numberValue = parseFloat(e.target.value);
                      field.onChange(
                        isNaN(numberValue) ? undefined : numberValue
                      );
                    }}
                  />
                )}
              />

              {errors.shippingQty && (
                <span className="error-txt">{errors.shippingQty.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">{t("fields.barcode.label")}</label>

              <Controller
                name="shipmentIdentifier"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("fields.barcode.placeholder")}
                  />
                )}
              />

              {errors.shipmentIdentifier && (
                <span className="error-txt">
                  {errors.shipmentIdentifier.message}
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
                (currentStepperStatus?.[ProductStageKey.ShippingDetails] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.ShippingDetails] ===
                  "active")
              )
            }
          />
          <ButtonIconRight
            name={
              currentStepperStatus?.[ProductStageKey.ShippingDetails] ===
                "completed"
                ? "Update"
                : common("Continue")
            }
            onClick={handleSubmit((data) => onSubmit(data))}
            disabled={
              isSubmitting ||
              !(
                id &&
                (currentStepperStatus?.[ProductStageKey.ShippingDetails] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.ShippingDetails] ===
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

export default ShippingPackagingDetails;
