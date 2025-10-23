import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  RightArrowIcon,
  TradeDetailsIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import ProductionLeadTimeDialog from "@/app/[locale]/_components/OverLay/ProductionLeadTime";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import {
  durationOption,
  ProductStageKey,
  SampleAvailability,
  sampleAvailability,
  sampleLeadTime,
  stockAvailabilityOptions,
  unitOption,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useGetProductionLeadTimeListQuery,
  useUpdateAvailabilityOriginMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import {
  setShowProductionLeadTimeDialog,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { availabilityOriginSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

export interface productionCapacity {
  quantity?: number;
  unit?: string;
  duration?: string;
}
interface ProductionLeadTimeOption {
  min_day?: number;
  max_day?: number;
  min_quantity?: number;
  max_quantity?: number;
  unit?: string;
}

export type SampleAvailabilityType =
  | "free"
  | "refundable"
  | "paid"
  | "noSample";
export interface sampleLeadTime {
  min_day?: number | null;
  max_day?: number | null;
}
interface availabilityOriginFormValue {
  productionCapacity?: productionCapacity;
  stockAvailability: "inStock" | "outOfStock";
  productionLeadTime: ProductionLeadTimeOption;
  samplesAvailability: {
    availabilityType: SampleAvailabilityType;
    samplePrice?: number;
    sampleUnit?: string;
    sampleLeadTime?: sampleLeadTime;
  };
}

const ProductionAndStock = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useAppDispatch();

  const common = useTranslations("common");
  const t = useTranslations("salesProduct.production_stock");
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);
  const localizedDurationOption = useLocalizedOptions(
    "salesProduct",
    durationOption
  );
  const localizedStockAvailabilityOptions = useLocalizedOptions(
    "salesProduct",
    stockAvailabilityOptions
  );
  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );
  const [productionLeadTimeOptions, setProductionLeadTimeOptions] = useState<
    {}[]
  >([]);

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.ProductionAndStock },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductStageKey.ProductionAndStock] === "completed"
      ),
    }
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<availabilityOriginFormValue>({
    defaultValues: {
      productionCapacity: {
        quantity: undefined,
        unit: "",
        duration: "",
      },
      stockAvailability: "outOfStock",
      productionLeadTime: {},
      samplesAvailability: {
        availabilityType: "noSample",
        samplePrice: undefined,
        sampleUnit: "",
        sampleLeadTime: {
          min_day: undefined,
          max_day: undefined,
        },
      },
    },
    mode: "all",
    resolver: zodResolver(availabilityOriginSchema),
  });

  const selectedAvailability = useWatch({
    control,
    name: "samplesAvailability.availabilityType",
  });
  const {
    data: productionLeadTimeData,
    isSuccess: productionLeadTimeIsSuccess,
  } = useGetProductionLeadTimeListQuery();

  const [updateAvailabilityOrigin] = useUpdateAvailabilityOriginMutation();

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.ProductionAndStock] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.ProductionAndStock]]);

  useEffect(() => {
    if (productionLeadTimeIsSuccess && productionLeadTimeData) {
      setProductionLeadTimeOptions([
        ...productionLeadTimeData.data,
        // { _id: "add_new", groupName: "Add Custom Lead Time" },
      ]);
    }
  }, [productionLeadTimeData, productionLeadTimeIsSuccess]);

  // useEffect(() => {
  //   console.log("errors", errors);
  // }, [errors]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        productionCapacity: data.data.productionCapacity ?? {
          quantity: undefined,
          unit: "",
          duration: "",
        },
        stockAvailability: data.data.stockAvailability ?? undefined,
        productionLeadTime: data.data.productionLeadTime ?? {
          _id: "",
          min_day: 0,
          max_day: 0,
          min_quantity: 0,
          max_quantity: 0,
        },
        samplesAvailability: data.data.samplesAvailability ?? {
          availabilityType: "noSample",
          samplePrice: undefined,
          sampleUnit: "",
          sampleLeadTime: {},
        },
      });
    }
  }, [data, isSuccess]);

  const onSubmit = async (
    data: availabilityOriginFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        const response = await updateAvailabilityOrigin({
          id: id,
          ...data,
          skipCacheUpdate,
        }).unwrap();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.PaymentTerms));
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

  const handleSaveAndContinue = async (data: availabilityOriginFormValue) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const productionLeadTimeItemTemplate = (option: any) => {
    if (!option) return;
    return (
      <span>
        {option.min_day} - {option.max_day} Days
      </span>
    );
  };

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <FormTitle variant={"h1"} text={t("title")}>
            <TradeDetailsIcon />
          </FormTitle>{" "}
          <Typography variant="h2" className="title-subtxt">
            {t("supTittle")}
          </Typography>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label" htmlFor="productGroup">
                {t("fields.productionLeadTime.label")}
              </label>
              <Controller
                name="productionLeadTime"
                control={control}
                render={({ field }) => (
                  <Select
                    options={productionLeadTimeOptions}
                    optionLabel="min_day- max_day Days"
                    placeholder={t("fields.productionLeadTime.placeholder")}
                    value={field.value}
                    onChange={(selectedValue) => {
                      if (selectedValue?._id === "add_new") {
                        dispatch(setShowProductionLeadTimeDialog(true));
                      } else {
                        field.onChange(selectedValue);
                      }
                    }}
                    itemTemplate={productionLeadTimeItemTemplate}
                    valueTemplate={(vlu) =>
                      vlu ? `${vlu?.min_day}-${vlu?.max_day} Days` : t("Select")
                    }
                  />
                )}
              />
              {errors.productionLeadTime && (
                <span className="error-txt">
                  {errors.productionLeadTime.message}
                </span>
              )}
              <ProductionLeadTimeDialog />
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="productionCapacity">
                {t("fields.productionCapacity.label")}{" "}
                <span className="f-g-label-dim">
                  ({t("fields.productionCapacity.optionalLabel")} )
                </span>
              </label>
              <div className="f-g-input-horiz">
                <div className="forms-group f-g-w100">
                  <Controller
                    name="productionCapacity.quantity"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        value={field.value?.toString() ?? ""}
                        placeholder={t(
                          "fields.productionCapacity.quality_placeholder"
                        )}
                        onChange={(e) => {
                          const numberValue = parseFloat(e.target.value);
                          field.onChange(
                            isNaN(numberValue) ? undefined : numberValue
                          );
                        }}
                      />
                    )}
                  />
                  {errors.productionCapacity?.quantity && (
                    <span className="error-txt">
                      {errors.productionCapacity?.quantity.message}
                    </span>
                  )}
                </div>
                <div className="forms-group f-g-w100">
                  <Controller
                    name="productionCapacity.unit"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={localizedUnitList}
                        optionLabel={`name`}
                        optionValue="value"
                        placeholder={t(
                          "fields.productionCapacity.unit_placeholder"
                        )}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.productionCapacity?.unit && (
                    <span className="error-txt">
                      {errors.productionCapacity?.unit.message}
                    </span>
                  )}
                </div>
                <div className="forms-group f-g-w100">
                  <Controller
                    name="productionCapacity.duration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={localizedDurationOption}
                        optionLabel={`name`}
                        optionValue="value"
                        placeholder={t(
                          "fields.productionCapacity.duration_placeholder"
                        )}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.productionCapacity?.duration && (
                    <span className="error-txt">
                      {errors.productionCapacity?.duration.message}
                    </span>
                  )}
                </div>
              </div>
              {errors.productionCapacity && (
                <span className="error-txt">
                  {errors.productionCapacity.message}
                </span>
              )}
            </div>

            <div className="forms-group">
              <label className="f-g-label" htmlFor="stockAvail">
                {t("fields.availableStock.label")}{" "}
              </label>
              <Controller
                name="stockAvailability"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedStockAvailabilityOptions}
                    optionLabel={`name`}
                    optionValue="value"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.stockAvailability && (
                <span className="error-txt">
                  {errors.stockAvailability.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.sampleAvailability.label")}
              </label>
              <div className="price-forms-radio split-2">
                {sampleAvailability.map((option, i) => (
                  <label
                    key={i}
                    htmlFor={option.value}
                    className="forms-radio-horiz"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      className="forms-radio"
                      {...register("samplesAvailability.availabilityType")}
                      value={option.value}
                    />
                    <span className="f-r-h-label">{t(option.name)} </span>
                  </label>
                ))}
              </div>
            </div>
            {(selectedAvailability === SampleAvailability.RefundableSample ||
              selectedAvailability === SampleAvailability.PaidSample) && (
                <>
                  <div className="forms-group">
                    <label className="f-g-label" htmlFor="MinimumOrderQuantity">
                      {t("fields.samplePrice.label")}
                    </label>
                    <div className="f-g-input-horiz">
                      <div className="forms-group f-g-w100">
                        <Controller
                          name="samplesAvailability.samplePrice"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              placeholder={t(
                                "fields.samplePrice.price_placeholder"
                              )}
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
                        {errors?.samplesAvailability?.samplePrice && (
                          <span className="error-txt">
                            {errors.samplesAvailability.samplePrice.message}
                          </span>
                        )}
                      </div>
                      <div className="forms-group f-g-w100">
                        <Controller
                          name={"samplesAvailability.sampleUnit"}
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={localizedUnitList}
                              optionLabel={`name`}
                              optionValue="value"
                              placeholder={t(
                                "fields.samplePrice.unit_placeholder"
                              )}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                        {errors?.samplesAvailability?.sampleUnit && (
                          <span className="error-txt">
                            {errors.samplesAvailability.sampleUnit.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label" htmlFor="stockAvail">
                      {t("fields.sampleLeadTime.label")}
                    </label>
                    {/* <Controller
                    name={"samplesAvailability.sampleLeadTime"}
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={sampleLeadTime}
                        optionLabel={`name`}
                        value={field.value}
                        placeholder={t("fields.sampleLeadTime.placeholder")}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    )}
                  /> */}
                    <Controller
                      name="samplesAvailability.sampleLeadTime"
                      control={control}
                      render={({ field }) => {
                        const selectedValue = sampleLeadTime.find(
                          (opt) =>
                            opt &&
                            opt.min_day === field.value?.min_day &&
                            opt.max_day === field.value?.max_day
                        );
                        return (
                          <Select
                            options={sampleLeadTime}
                            placeholder={t("fields.sampleLeadTime.placeholder")}
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
                                  ? `${option.min_day}-${option.max_day} Days`
                                  : `${option.min_day}-${option.max_day} Days`;
                              }
                              if (option.min_day === null) {
                                return t("fields.sampleLeadTime.madeToOrder");
                              }
                              return `${option.min_day}-${option.max_day} Days`;
                            }}
                            valueTemplate={(option) => {
                              if (!option)
                                return t("fields.sampleLeadTime.placeholder");
                              if (
                                option.max_day &&
                                option.min_day === option.max_day
                              ) {
                                return option.min_day === 1
                                  ? `${option.min_day}-${option.max_day} Days`
                                  : `${option.min_day}-${option.max_day} Days`;
                              }
                              if (option.min_day === null) {
                                return t("fields.sampleLeadTime.madeToOrder");
                              }
                              return `${option.min_day}-${option.max_day} Days`;
                            }}
                          />
                        );
                      }}
                    />
                    {errors?.samplesAvailability?.sampleLeadTime && (
                      <span className="error-txt">
                        {errors.samplesAvailability.sampleLeadTime.message}
                      </span>
                    )}
                  </div>
                </>
              )}
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
                (currentStepperStatus?.[ProductStageKey.ProductionAndStock] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.ProductionAndStock] ===
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
                (currentStepperStatus?.[ProductStageKey.ProductionAndStock] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.ProductionAndStock] ===
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

export default ProductionAndStock;
