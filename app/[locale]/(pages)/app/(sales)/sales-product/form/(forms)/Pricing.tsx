import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  PlusIcon,
  PricingMoqIcon,
  RightArrowIcon,
  TrashTableIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import {
  BulkPrice,
  BulkPricing,
  Currency,
  ProductPricing,
} from "@/app/[locale]/_interface/SalesProductInterface";
import {
  currencyList,
  pricingOptions,
  PricingType,
  ProductStageKey,
  unitOption,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useUpdateCapacityPricingMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { productCapacityPricingSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
// export interface Pricing {
//     pricingType: PricingType;
// }

// export interface FixedPricing extends Pricing {
//     pricingType: PricingType.FIXED;
//     unitPrice: number;
// }

// export interface PriceRangePricing extends Pricing {
//     pricingType: PricingType.PRICE_RANGE;
//     minPrice: number;
//     maxPrice: number;
// }

// export interface BulkPrice { minQty: number; maxQty: number; price: number }

// export interface BulkPricing extends Pricing {
//     pricingType: PricingType.BULK;
//     unit: string;
//     bulkPrices: BulkPrice[];
// }

// export interface NegotiablePricing extends Pricing {
//     pricingType: PricingType.NEGOTIABLE;
// }

// export interface QuotePricing extends Pricing {
//     pricingType: PricingType.REQUEST_QUOTE;
// }

// export type ProductPricing = FixedPricing | PriceRangePricing | BulkPricing | NegotiablePricing | QuotePricing;

// export interface Currency { code: string; name: string; symbol: string }

export interface productCapacityPricingFormValue {
  currency: Currency;
  pricing: ProductPricing;
  minOrderQuantity: number;
  moqUnit: string;
}

const ProductCapacityPricing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const o = useTranslations("salesProduct");
  const t = useTranslations("salesProduct.pricing_moq");

  const dispatch = useAppDispatch();

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.PricingAndMoq },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductStageKey.PricingAndMoq] === "completed"
      ),
    }
  );

  const common = useTranslations("common");
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingPricingType, setPendingPricingType] = useState<string | null>(
    null
  );

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<productCapacityPricingFormValue>({
    defaultValues: {
      currency: {},
      pricing: {
        pricingType: PricingType.FIXED,
        unitPrice: undefined,
      },
      minOrderQuantity: undefined,
      moqUnit: "",
    },
    shouldUnregister: false,
    mode: "onBlur",
    resolver: zodResolver(productCapacityPricingSchema),
  });

  const [updateCapacityPricing] = useUpdateCapacityPricingMutation();

  const isPricingStepCompleted =
    currentStepperStatus[ProductStageKey.PricingAndMoq] === "completed" &&
    currentStepperStatus[ProductStageKey.Specification] === "completed";

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.PricingAndMoq] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.PricingAndMoq]]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const {
        currency = {},
        minOrderQuantity,
        moqUnit = "",
        pricing,
      } = data.data;

      let normalizedPricing: ProductPricing;

      let bulkPrices: BulkPrice[] = [];

      switch (pricing?.pricingType) {
        case PricingType.BULK:
          bulkPrices = (pricing as BulkPricing).bulkPrices?.map((p) => ({
            minQty: p.minQty ?? undefined,
            maxQty: p.maxQty ?? undefined,
            price: p.price ?? undefined,
          })) ?? [
            {
              minQty: undefined,
              maxQty: undefined,
              price: undefined,
            },
          ];

          normalizedPricing = {
            pricingType: PricingType.BULK,
            unit: pricing.unit ?? "",
            bulkPrices,
          };
          break;

        case PricingType.PRICE_RANGE:
          normalizedPricing = {
            pricingType: PricingType.PRICE_RANGE,
            minPrice: pricing?.minPrice ?? undefined,
            maxPrice: pricing?.maxPrice ?? undefined,
          };
          break;

        case PricingType.NEGOTIABLE:
          normalizedPricing = {
            pricingType: PricingType.NEGOTIABLE,
          };
          break;

        case PricingType.REQUEST_QUOTE:
          normalizedPricing = {
            pricingType: PricingType.REQUEST_QUOTE,
          };
          break;

        case PricingType.FIXED:
        default:
          normalizedPricing = {
            pricingType: PricingType.FIXED,
            unitPrice: pricing?.unitPrice ?? undefined,
          };
          break;
      }

      reset({
        currency,
        pricing: normalizedPricing,
        minOrderQuantity: minOrderQuantity ?? undefined,
        moqUnit,
      });

      // 👇 Explicitly reset the field array if it's bulk pricing
      if (normalizedPricing.pricingType === PricingType.BULK) {
        replace(bulkPrices);
      }
    }
  }, [data, isSuccess, reset]);

  const formValues = watch();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "pricing.bulkPrices",
    shouldUnregister: false,
  });

  // useEffect(() => {
  //   console.log("formValues", formValues);
  // }, [formValues]);

  // useEffect(() => {
  //   console.log("errors", errors);
  // }, [errors]);

  const setPricing = (pricingType: string) => {
    if (pricingType === PricingType.FIXED) {
      setValue("pricing", {
        pricingType: PricingType.FIXED,
        unitPrice: null as unknown as number,
      });
    } else if (pricingType === PricingType.BULK) {
      setValue("pricing.pricingType", PricingType.BULK);
      setValue("pricing.unit", "");
      setValue("pricing.bulkPrices", [
        {
          minQty: null as unknown as number,
          maxQty: null as unknown as number,
          price: null as unknown as number,
        },
      ]);
    } else if (pricingType === PricingType.PRICE_RANGE) {
      setValue("pricing", {
        pricingType: PricingType.PRICE_RANGE,
        minPrice: null as unknown as number,
        maxPrice: null as unknown as number,
      });
    } else if (pricingType === PricingType.NEGOTIABLE) {
      setValue("pricing", {
        pricingType: PricingType.NEGOTIABLE,
      });
    } else if (pricingType === PricingType.REQUEST_QUOTE) {
      setValue("pricing", {
        pricingType: PricingType.REQUEST_QUOTE,
      });
    }
  };

  const handleAddBulkPrice = () => {
    const pricingType = watch("pricing.pricingType");
    const fields = getValues("pricing.bulkPrices");
    const last = fields[fields.length - 1];
    if (
      pricingType === PricingType.BULK &&
      fields.length > 0 &&
      (!last?.minQty || !last?.maxQty || !last?.price)
    ) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Must fill the previous before adding a new one.",
          theme: "error",
        })
      );
      return;
    }

    if (pricingType === PricingType.BULK && fields.length >= 5) {
      dispatch(
        showToast({
          title: "Error!",
          message: "You can only add up to 5 pricing tiers.",
          theme: "error",
        })
      );
      return;
    }

    append({
      minQty: null as unknown as number,
      maxQty: null as unknown as number,
      price: null as unknown as number,
    });
    setValue("pricing.bulkPrices", [...getValues("pricing.bulkPrices")]);
  };

  const removeAndCleanBulkPrice = (indexToRemove: number) => {
    // Remove the item from field array
    remove(indexToRemove);
    setMinOrderQuantity();
  };

  const onSubmit = async (
    data: productCapacityPricingFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        let { ...restData } = data;
        await updateCapacityPricing({
          id: id,
          ...restData,
          skipCacheUpdate,
        }).unwrap();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.Specification));
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
    data: productCapacityPricingFormValue
  ) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const setMoqUnit = (val: string) => {
    setValue("moqUnit", val);
  };

  const setMinOrderQuantity = () => {
    if (formValues.pricing.pricingType === PricingType.BULK) {
      const minQty = Math.min(
        ...getValues("pricing.bulkPrices").map((p) => p.minQty)
      );
      setValue("minOrderQuantity", minQty);
    }
  };
  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <div className="title-subtxt-block">
            <FormTitle variant={"h1"} text={t("title")}>
              <PricingMoqIcon />
            </FormTitle>
          </div>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label" htmlFor="">
                {t("fields.currency.label")}
              </label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedCurrencyList}
                    optionLabel={`name`}
                    // optionValue="code"
                    value={field.value}
                    placeholder={t("fields.currency.placeholder")}
                    onChange={field.onChange}
                    itemTemplate={(opt) => `${opt.symbol} - ${opt.code}`}
                    valueTemplate={(value) =>
                      !value
                        ? t("fields.currency.placeholder")
                        : `${value?.symbol} - ${value?.code}`
                    }
                  />
                )}
              />
              {errors?.currency?.code && (
                <span className="error-txt">
                  {errors?.currency?.code.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">{t("fields.pricing.label")}</label>
              <Controller
                name="pricing.pricingType"
                control={control}
                render={({ field }) => (
                  <div className="price-forms-radio split-2">
                    {pricingOptions.map((option, i) => (
                      <label
                        key={i}
                        htmlFor={option.value}
                        className="forms-radio-horiz"
                      >
                        <input
                          type="radio"
                          id={option.value}
                          className="forms-radio"
                          value={option.value}
                          checked={field.value === option.value}
                          onChange={(e) => {
                            const newType = e.target.value;
                            if (isPricingStepCompleted) {
                              setPendingPricingType(newType);
                              setShowConfirmationDialog(true);
                            } else {
                              setPricing(newType);
                            }
                          }}
                        />
                        <span className="f-r-h-label">
                          {o(option.name)}{" "}
                          <span className="f-g-label-dim">
                            {o(option.helper)}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              />
              {/* Single ConfirmDialog outside the map */}
              <AlertDialog
                visible={showConfirmationDialog}
                subTxt={t("confirmationMessage")}
                continueOnclick={() => {
                  if (pendingPricingType) {
                    setPricing(pendingPricingType);
                  }
                  setShowConfirmationDialog(false);
                  setPendingPricingType(null);
                }}
                cancelOnclick={() => {
                  setShowConfirmationDialog(false);
                  setPendingPricingType(null);
                }}
              />
            </div>
            {/* Fixed Price */}
            {formValues.pricing.pricingType === PricingType.FIXED && (
              <div className="price-forms-block pricing-moq">
                <div className="forms-group">
                  <label className="f-g-label">
                    {t("fields.fixed_pricing.label")}
                  </label>
                  <Controller
                    name="pricing.unitPrice"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder={t("fields.fixed_pricing.placeholder")}
                        value={field.value?.toString() ?? ""}
                        onChange={(e) => {
                          const numberValue = parseFloat(e.target.value);
                          field.onChange(
                            isNaN(numberValue) ? undefined : numberValue
                          );
                        }}
                      />
                    )}
                  />
                  {errors.pricing && "unitPrice" in errors.pricing && (
                    <span className="error-txt">
                      {(errors.pricing as any).unitPrice?.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Variable Price */}
            {formValues.pricing.pricingType === PricingType.PRICE_RANGE && (
              <div className="price-forms-block pricing-moq">
                <div className="forms-group">
                  <label className="f-g-label" htmlFor="priceRange">
                    {t("fields.variable_pricing.label")}
                  </label>
                  <div className="f-g-input-horiz">
                    <div className="forms-group f-g-w100">
                      <Controller
                        name="pricing.minPrice"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t(
                              "fields.variable_pricing.minPrice_placeholder"
                            )}
                            value={field.value?.toString() ?? ""}
                            onChange={(e) => {
                              const numberValue = parseFloat(e.target.value);
                              field.onChange(
                                isNaN(numberValue) ? undefined : numberValue
                              );
                            }}
                          />
                        )}
                      />
                      {errors.pricing && "minPrice" in errors.pricing && (
                        <span className="error-txt">
                          {(errors.pricing as any).minPrice?.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-group f-g-w100">
                      <Controller
                        name="pricing.maxPrice"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t(
                              "fields.variable_pricing.maxPrice_placeholder"
                            )}
                            value={field.value?.toString() ?? ""}
                            onChange={(e) => {
                              const numberValue = parseFloat(e.target.value);
                              field.onChange(
                                isNaN(numberValue) ? undefined : numberValue
                              );
                            }}
                          />
                        )}
                      />
                      {errors.pricing && "maxPrice" in errors.pricing && (
                        <span className="error-txt">
                          {(errors.pricing as any).maxPrice?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Pricing */}
            {formValues.pricing.pricingType === PricingType.BULK && (
              <div className="price-forms-block pricing-moq">
                <div className="forms-group">
                  <span className="pricing-block-title">
                    {t("fields.bulk_pricing.label")}
                  </span>
                  <div className="forms-group-spacing-column">
                    <div className="forms-group f-g-s-c-item">
                      <div className="forms-group">
                        <label className="f-g-label">
                          {t("fields.bulk_pricing.unitTypeLabel")}
                        </label>
                        <Controller
                          name={`pricing.unit`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={localizedUnitList}
                              optionLabel={`name`}
                              optionValue="value"
                              placeholder={t("fields.bulk_pricing.placeholder")}
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val);
                                setMoqUnit(val);
                              }}
                            />
                          )}
                        />
                        {errors.pricing && "unit" in errors.pricing && (
                          <span className="error-txt">
                            {(errors.pricing as any).unit?.message}
                          </span>
                        )}
                      </div>
                      <div className="forms-helper-txt-group">
                        {formValues.pricing.pricingType === PricingType.BULK &&
                          fields.length > 0 &&
                          fields.map((price, index) => (
                            <div className="forms-split" key={price.id}>
                              <div className="forms-group wid-100">
                                {index === 0 && (
                                  <label
                                    className="f-g-label"
                                    htmlFor="AddQuantityRange"
                                  >
                                    {t("fields.add_tier.add_qty_label")}
                                  </label>
                                )}
                                <div className="f-g-input-horiz">
                                  <div className="forms-group f-g-w100">
                                    <Controller
                                      name={`pricing.bulkPrices.${index}.minQty`}
                                      control={control}
                                      render={({ field }) => (
                                        <InputField
                                          {...field}
                                          type="number"
                                          step="0.01"
                                          placeholder={t(
                                            "fields.add_tier.quantity_from_placeholder"
                                          )}
                                          value={field.value?.toString() ?? ""}
                                          onChange={(e) => {
                                            const numberValue = parseFloat(
                                              e.target.value
                                            );
                                            field.onChange(
                                              isNaN(numberValue)
                                                ? null
                                                : numberValue
                                            );
                                            if (!isNaN(numberValue))
                                              setMinOrderQuantity();
                                          }}
                                        />
                                      )}
                                    />
                                    {formValues.pricing.pricingType ===
                                      PricingType.BULK &&
                                      errors.pricing &&
                                      "bulkPrices" in errors.pricing &&
                                      Array.isArray(
                                        errors.pricing.bulkPrices
                                      ) &&
                                      errors.pricing?.bulkPrices?.[index]
                                        ?.minQty?.message && (
                                        <span className="error-txt">
                                          {
                                            errors.pricing.bulkPrices[index]
                                              .minQty.message
                                          }
                                        </span>
                                      )}
                                  </div>
                                  <div className="forms-group f-g-w100">
                                    <Controller
                                      name={`pricing.bulkPrices.${index}.maxQty`}
                                      control={control}
                                      render={({ field }) => (
                                        <InputField
                                          {...field}
                                          placeholder={t(
                                            "fields.add_tier.quantity_to_placeholder"
                                          )}
                                          value={field.value?.toString() ?? ""}
                                          onChange={(e) => {
                                            const numberValue = parseFloat(
                                              e.target.value
                                            );
                                            field.onChange(
                                              isNaN(numberValue)
                                                ? null
                                                : numberValue
                                            );
                                          }}
                                        />
                                      )}
                                    />
                                    {formValues.pricing.pricingType ===
                                      PricingType.BULK &&
                                      errors.pricing &&
                                      "bulkPrices" in errors.pricing &&
                                      Array.isArray(
                                        errors.pricing.bulkPrices
                                      ) &&
                                      errors.pricing?.bulkPrices?.[index]
                                        ?.maxQty?.message && (
                                        <span className="error-txt">
                                          {
                                            errors.pricing.bulkPrices[index]
                                              .maxQty.message
                                          }
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>
                              <div className="forms-group wid-200px">
                                {index === 0 && (
                                  <label className="f-g-label" htmlFor="price">
                                    {t("fields.add_tier.price_label")}
                                  </label>
                                )}
                                <div className="forms-group f-g-w100">
                                  <Controller
                                    name={`pricing.bulkPrices.${index}.price`}
                                    control={control}
                                    render={({ field }) => (
                                      <InputField
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        placeholder={t(
                                          "fields.add_tier.price_placeholder"
                                        )}
                                        value={field.value?.toString() ?? ""}
                                        onChange={(e) => {
                                          const numberValue = parseFloat(
                                            e.target.value
                                          );
                                          field.onChange(
                                            isNaN(numberValue)
                                              ? null
                                              : numberValue
                                          );
                                        }}
                                      />
                                    )}
                                  />
                                  {formValues.pricing.pricingType ===
                                    PricingType.BULK &&
                                    errors.pricing &&
                                    "bulkPrices" in errors.pricing &&
                                    Array.isArray(errors.pricing.bulkPrices) &&
                                    errors.pricing?.bulkPrices?.[index]?.price
                                      ?.message && (
                                      <span className="error-txt">
                                        {
                                          errors.pricing.bulkPrices[index].price
                                            .message
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>
                              {formValues.pricing.pricingType ===
                                PricingType.BULK &&
                                fields.length > 1 && (
                                  <ButtonIcon
                                    className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                                    onClick={() =>
                                      removeAndCleanBulkPrice(index)
                                    }
                                  >
                                    <TrashTableIcon />
                                  </ButtonIcon>
                                )}
                            </div>
                          ))}
                        {errors.pricing &&
                          "bulkPrices" in errors.pricing &&
                          (errors.pricing.bulkPrices as any)?.root?.message && (
                            <span className="error-txt">
                              {(errors.pricing.bulkPrices as any).root.message}
                            </span>
                          )}
                        <span className="helper-txt">
                          {t("fields.add_tier.helper")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="add-option-block">
                    <ButtonIconLeftOutline
                      name={t("fields.add_tier.label")}
                      className={"bg-outline-grey btn-attributes"}
                      onClick={handleAddBulkPrice}
                    >
                      <PlusIcon />
                    </ButtonIconLeftOutline>
                  </div>
                </div>
              </div>
            )}
            {/*  */}
            {formValues.pricing.pricingType !== PricingType.BULK && (
              <div className="forms-group">
                <label className="f-g-label" htmlFor="MinimumOrderQuantity">
                  {t("fields.moq.label")}
                </label>
                <div className="f-g-input-horiz">
                  <div className="forms-group f-g-w100">
                    <Controller
                      name="minOrderQuantity"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          placeholder={t("fields.moq.placeholder")}
                          value={field.value?.toString() ?? ""}
                          onChange={(e) => {
                            const numberValue = parseFloat(e.target.value);
                            field.onChange(
                              isNaN(numberValue) ? undefined : numberValue
                            );
                          }}
                        />
                      )}
                    />
                    {errors.minOrderQuantity && (
                      <span className="error-txt">
                        {errors.minOrderQuantity.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group f-g-w100">
                    <Controller
                      name={"moqUnit"}
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={localizedUnitList}
                          optionLabel={`name`}
                          optionValue="value"
                          placeholder={t("fields.moq.unit_placeholder")}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.moqUnit && (
                      <span className="error-txt">
                        {errors.moqUnit.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
                (currentStepperStatus?.[ProductStageKey.PricingAndMoq] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.PricingAndMoq] ===
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
                (currentStepperStatus?.[ProductStageKey.PricingAndMoq] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.PricingAndMoq] ===
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

export default ProductCapacityPricing;
