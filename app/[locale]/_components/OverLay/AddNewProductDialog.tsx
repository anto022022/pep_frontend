"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import Inputs from '../Forms/Inputs';
import Typography from "../Base/Typography";
import {
  CloseIcon,
  InfoIcon,
  PlusIcon,
  RightArrowIcon,
  TrashTableIcon,
} from "../Icons/SVGIcons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Sidebar } from "primereact/sidebar";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { UploadedImage } from "../../(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";
import useAiGenerator from "../../_hooks/useGeneratewithAi";
import { useLocalizedOptions } from "../../_hooks/useLocalizedOptions";
import { CategoriesListInterface } from "../../_interface/common";
import {
  currencyList,
  pricingOptions,
  PricingType,
  ProductOfferKey,
  unitOption,
} from "../../_models/StoreFront";
import {
  useAddProductQuickInsertMutation,
  useLazyGetCategoryAiSuggestionsQuery,
} from "../../_store/apiReducer/productsApi";
import {
  setIsAddNewProductSidebarOpen,
  setNewProductAddSuccessfullyDialog,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppSelector } from "../../_store/store";
import { offerProductDetailsSchema } from "../../_validationSchema/salesProduct";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import SuccessDialog from "../dialog/SuccessDialog";
import NestedCategorySelect from "../form/NestedCategorySelect";
import DndImageUpload from "../StoreFront/Forms/DndImageUpload";
import InputField from "../StoreFront/Forms/InputField";
import Select from "../StoreFront/Forms/Select";
import TextArea from "../StoreFront/Forms/TextArea";

import {
  Currency,
  ProductPricing,
  SuggestCategory,
} from "../../_interface/SalesProductInterface";
import ButtonIcon from "../Buttons/ButtonIcon";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";

export interface ProductDetailsValues {
  productName: string;
  category?: Partial<CategoriesListInterface>;
  subCategory?: Partial<CategoriesListInterface>;
  productCategory?: Partial<CategoriesListInterface>;
  categorySuggestion?: Partial<SuggestCategory>;
  brandName?: string;
  productDescription: string;
  productImage: UploadedImage[];
  currency: Currency;
  pricing: ProductPricing;
  minOrderQuantity: number;
  moqUnit: string;
}

interface DialogProps {
  onContinue: (id: string) => Promise<any>;
}

const AddNewProductDialog: FC<DialogProps> = ({ onContinue }) => {
  const t = useTranslations("salesOffer.addNewProduct");
  const o = useTranslations("salesProduct");
  const common = useTranslations("common");
  const [Loading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);

  const [addQuickProduct] = useAddProductQuickInsertMutation();
  const [getCategoryAiSuggestions, { data: aiGeneratedCategoryList }] =
    useLazyGetCategoryAiSuggestionsQuery();

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductDetailsValues>({
    defaultValues: {
      productName: "",
      category: {},
      subCategory: {},
      productCategory: {},
      categorySuggestion: {},
      brandName: "",
      productDescription: "",
      productImage: [],
      currency: {},
      pricing: {
        pricingType: PricingType.FIXED,
        unitPrice: undefined,
      },
      minOrderQuantity: undefined,
      moqUnit: "",
    },
    mode: "onBlur",
    resolver: zodResolver(offerProductDetailsSchema),
  });

  const formValues = watch();
  console.log(errors);
  const requestBody = useMemo(() => {
    return {
      lan: "en",
      max_length: 250,
      productName: formValues?.productName,
      category: formValues?.category?.name,
      subCategory: formValues?.subCategory?.name,
      productCategory: formValues?.productCategory?.name,
    };
  }, [formValues]);

  const setDetailedDescriptions = (description: any) => {
    setValue("productDescription", description?.description);
  };

  const dispatch = useDispatch();

  const quickInsert = async (data: ProductDetailsValues) => {
    try {
      const response = await addQuickProduct(data).unwrap();
      if (response) {
        dispatch(setIsAddNewProductSidebarOpen(false));
        dispatch(setNewProductAddSuccessfullyDialog(true));
        // debugger;
        // const offerId = offer?.data?.sellOfferId;
        // router.push(`?${new URLSearchParams({ id: offerId })}`);

        setTimeout(async () => {
          dispatch(setNewProductAddSuccessfullyDialog(false));
          await onContinue(response.data.productId);
        }, 2000);
      }
    } catch (error) {}
  };
  const { isAddNewProductSidebarOpen, newProductAddSuccessfullyDialog } =
    useAppSelector((state: RootState) => state.uiData);

  const currentStepperStatus = useSelector(
    (state: any) => state.stepperStatus.stepperStatus
  );

  const triggerAiCategory = () => {
    if (!getValues("productName")) return;
    getCategoryAiSuggestions({
      product_name: getValues("productName") ?? "",
    });
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pricing.bulkPrices",
    shouldUnregister: false,
  });

  const setMoqUnit = (val: string) => {
    setValue("moqUnit", val);
  };

  const setMinOrderQuantity = () => {
    if (formValues.pricing.pricingType === PricingType.BULK) {
      const minQty = Math.min(
        ...getValues("pricing.bulkPrices").map((p: any) => p.minQty)
      );
      setValue("minOrderQuantity", minQty);
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

  const { regenerate: regenerateDescription } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG||"https://api.sandbox.pepagora.org/"}sales/ai/get-short-description`,
    storageKey: "pt_dd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.productDescription as string,
    max_length: 250,
    setIsLoading: setIsLoading,
    setDescription: setDetailedDescriptions,
    requestBody,
    value: "description",
  });

  const setPricing = (pricingType: string) => {
    if (pricingType === PricingType.FIXED) {
      setValue("pricing", {
        pricingType: PricingType.FIXED,
        unitPrice: undefined as unknown as number,
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
        minPrice: undefined as unknown as number,
        maxPrice: undefined as unknown as number,
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

  useEffect(() => {
    reset();
  }, [isAddNewProductSidebarOpen]);

  useEffect(() => {
    if (currentStepperStatus) {
      setIsActive(
        !!(
          formValues.productName?.trim() ||
          (formValues.category && formValues.category._id?.trim())
        )
      );
    }
  }, [currentStepperStatus, formValues]);
  return (
    <>
      <Sidebar
        visible={isAddNewProductSidebarOpen}
        position="right"
        onHide={() => dispatch(setIsAddNewProductSidebarOpen(false))}
        className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {t("newProduct.title")}
                </Typography>
                <CloseIcon
                  onClick={() => dispatch(setIsAddNewProductSidebarOpen(false))}
                />
              </div>
              <div className="o-s-c-body">
                <div className="o-s-c-b-right">
                  <div className="forms-block">
                    <div className="forms-group">
                      <label className="f-g-label f-g-l-lg">
                        {t("newProduct.subtitle")}
                      </label>
                      <div className="alert-message-custom info-bg a-m-c-sm">
                        <div className="a-m-c-left">
                          <div className="a-m-c-icon-message">
                            <InfoIcon />
                            <span className="a-m-c-message">{t("alert")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product name*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("newProduct.fields.productName.label")}
                      </label>

                      <Controller
                        name="productName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t(
                              "newProduct.fields.productName.placeholder"
                            )}
                            onBlur={() => {
                              triggerAiCategory();
                              field.onBlur();
                            }}
                          />
                        )}
                      />
                      {errors.productName && (
                        <span className="error-txt">
                          {errors.productName.message}
                        </span>
                      )}
                    </div>
                    {/*Category*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("newProduct.fields.category.label")}
                      </label>
                      <NestedCategorySelect
                        setValue={(field: any, value: any) =>
                          setValue(field, value)
                        }
                        control={control}
                        errors={errors}
                        aiGeneratedContent={aiGeneratedCategoryList?.data ?? []}
                        isFormActive={
                          !currentStepperStatus[
                            ProductOfferKey.ProductDetails
                          ] ||
                          currentStepperStatus[
                            ProductOfferKey.ProductDetails
                          ] === "active"
                            ? true
                            : false
                        }
                        placeholder={t(
                          "newProduct.fields.category.placeholder"
                        )}
                      />
                    </div>
                    {/* Product image*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("newProduct.fields.productImage.label")}
                      </label>
                      <Controller
                        name="productImage"
                        control={control}
                        render={({ field }) => (
                          <DndImageUpload
                            maxUpload={7}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errors.productImage && (
                        <span className="error-txt">
                          {errors.productImage.message}
                        </span>
                      )}
                    </div>
                    {/* Product description*/}
                    <div className="forms-group">
                      <Controller
                        name="productDescription"
                        control={control}
                        render={({ field }) => (
                          <TextArea
                            {...field}
                            label={t("newProduct.fields.Description.label")}
                            placeholder={t(
                              "newProduct.fields.Description.placeholder"
                            )}
                            value={field.value}
                            onChange={(value: string) => field.onChange(value)}
                            aiFunc={regenerateDescription}
                            loading={Loading}
                            isActive={isActive}
                          />
                        )}
                      />

                      {errors.productDescription && (
                        <span className="error-txt">
                          {errors.productDescription.message}
                        </span>
                      )}
                    </div>
                    {/*brand name*/}
                    <div className="forms-group">
                      <label className="f-g-label mr-15px" htmlFor="brandName">
                        {t("newProduct.fields.brand.label")}{" "}
                        <span className="f-g-label-dim">
                          ({t("newProduct.fields.brand.optional")})
                        </span>
                      </label>
                      <Controller
                        name="brandName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t(
                              "newProduct.fields.brand.placeholder"
                            )}
                          />
                        )}
                      />

                      {errors.brandName && (
                        <span className="error-txt">
                          {errors.brandName.message}
                        </span>
                      )}
                    </div>
                    {/* currency name*/}

                    {/* Pricing*/}
                    <div className="c-f-b-t-body">
                      <form className="forms-block">
                        <div className="forms-group">
                          <label className="f-g-label" htmlFor="">
                            {t("newProduct.fields.currency.label")}
                          </label>
                          <Controller
                            name="currency"
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={localizedCurrencyList}
                                optionLabel={`name`}
                                value={field.value}
                                placeholder={t(
                                  "newProduct.fields.currency.placeholder"
                                )}
                                onChange={field.onChange}
                                itemTemplate={(opt) =>
                                  `${opt.symbol} - ${opt.code}`
                                }
                                valueTemplate={(value) =>
                                  !value
                                    ? t(
                                        "newProduct.fields.currency.placeholder"
                                      )
                                    : `${value?.symbol} - ${value?.code}`
                                }
                              />
                            )}
                          />
                          {errors.currency && (
                            <span className="error-txt">
                              {errors?.currency?.code?.message}
                            </span>
                          )}
                        </div>
                        <div className="forms-group">
                          <label className="f-g-label">
                            {t("newProduct.fields.pricing.label")}
                          </label>
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
                                        setPricing(e.target.value);
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
                        </div>
                        {/* Fixed Price */}
                        {formValues.pricing.pricingType ===
                          PricingType.FIXED && (
                          <div className="price-forms-block pricing-moq">
                            <div className="forms-group">
                              <label className="f-g-label">
                                {t("newProduct.fields.fixed_pricing.label")}
                              </label>
                              <Controller
                                name="pricing.unitPrice"
                                control={control}
                                render={({ field }) => (
                                  <InputField
                                    {...field}
                                    placeholder={t(
                                      "newProduct.fields.fixed_pricing.placeholder"
                                    )}
                                    value={field.value?.toString() ?? ""}
                                    onChange={(e) => {
                                      const numberValue = parseFloat(
                                        e.target.value
                                      );
                                      field.onChange(
                                        isNaN(numberValue)
                                          ? undefined
                                          : numberValue
                                      );
                                    }}
                                  />
                                )}
                              />
                              {errors.pricing &&
                                "unitPrice" in errors.pricing && (
                                  <span className="error-txt">
                                    {(errors.pricing as any).unitPrice?.message}
                                  </span>
                                )}
                            </div>
                          </div>
                        )}

                        {/* Variable Price */}
                        {formValues.pricing.pricingType ===
                          PricingType.PRICE_RANGE && (
                          <div className="price-forms-block pricing-moq">
                            <div className="forms-group">
                              <label className="f-g-label" htmlFor="priceRange">
                                {t("newProduct.fields.variable_pricing.label")}
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
                                          "newProduct.fields.variable_pricing.minPrice_placeholder"
                                        )}
                                        value={field.value?.toString() ?? ""}
                                        onChange={(e) => {
                                          const numberValue = parseFloat(
                                            e.target.value
                                          );
                                          field.onChange(
                                            isNaN(numberValue)
                                              ? undefined
                                              : numberValue
                                          );
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.pricing &&
                                    "minPrice" in errors.pricing && (
                                      <span className="error-txt">
                                        {
                                          (errors.pricing as any).minPrice
                                            ?.message
                                        }
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
                                          "newProduct.fields.variable_pricing.maxPrice_placeholder"
                                        )}
                                        value={field.value?.toString() ?? ""}
                                        onChange={(e) => {
                                          const numberValue = parseFloat(
                                            e.target.value
                                          );
                                          field.onChange(
                                            isNaN(numberValue)
                                              ? undefined
                                              : numberValue
                                          );
                                        }}
                                      />
                                    )}
                                  />
                                  {errors.pricing &&
                                    "maxPrice" in errors.pricing && (
                                      <span className="error-txt">
                                        {
                                          (errors.pricing as any).maxPrice
                                            ?.message
                                        }
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bulk Pricing */}
                        {formValues.pricing.pricingType ===
                          PricingType.BULK && (
                          <div className="price-forms-block pricing-moq">
                            <div className="forms-group">
                              <span className="pricing-block-title">
                                {t("newProduct.fields.bulk_pricing.label")}
                              </span>
                              <div className="forms-group-spacing-column">
                                <div className="forms-group f-g-s-c-item">
                                  <div className="forms-group">
                                    <label className="f-g-label">
                                      {t(
                                        "newProduct.fields.bulk_pricing.unitTypeLabel"
                                      )}
                                    </label>
                                    <Controller
                                      name={`pricing.unit`}
                                      control={control}
                                      render={({ field }) => (
                                        <Select
                                          options={localizedUnitList}
                                          optionLabel={`name`}
                                          optionValue="value"
                                          placeholder={t(
                                            "newProduct.fields.bulk_pricing.placeholder"
                                          )}
                                          value={field.value}
                                          onChange={(val) => {
                                            field.onChange(val);
                                            setMoqUnit(val);
                                          }}
                                        />
                                      )}
                                    />
                                    {errors.pricing &&
                                      "unit" in errors.pricing && (
                                        <span className="error-txt">
                                          {
                                            (errors.pricing as any).unit
                                              ?.message
                                          }
                                        </span>
                                      )}
                                  </div>
                                  <div className="forms-helper-txt-group">
                                    {formValues.pricing.pricingType ===
                                      PricingType.BULK &&
                                      fields.length > 0 &&
                                      fields.map((price, index) => (
                                        <div
                                          className="forms-split"
                                          key={price.id}
                                        >
                                          <div className="forms-group wid-100">
                                            <label
                                              className="f-g-label"
                                              htmlFor="AddQuantityRange"
                                            >
                                              {t(
                                                "newProduct.fields.add_tier.add_qty_label"
                                              )}
                                            </label>
                                            <div className="f-g-input-horiz">
                                              <div className="forms-group f-g-w100">
                                                <Controller
                                                  name={`pricing.bulkPrices.${index}.minQty`}
                                                  control={control}
                                                  render={({ field }) => (
                                                    <InputField
                                                      {...field}
                                                      placeholder={t(
                                                        "newProduct.fields.add_tier.quantity_from_placeholder"
                                                      )}
                                                      value={
                                                        field.value?.toString() ??
                                                        ""
                                                      }
                                                      onChange={(e) => {
                                                        const numberValue =
                                                          parseFloat(
                                                            e.target.value
                                                          );
                                                        field.onChange(
                                                          isNaN(numberValue)
                                                            ? undefined
                                                            : numberValue
                                                        );
                                                        if (!isNaN(numberValue))
                                                          setMinOrderQuantity();
                                                      }}
                                                    />
                                                  )}
                                                />
                                                {formValues.pricing
                                                  .pricingType ===
                                                  PricingType.BULK &&
                                                  errors.pricing &&
                                                  "bulkPrices" in
                                                    errors.pricing &&
                                                  Array.isArray(
                                                    errors.pricing.bulkPrices
                                                  ) &&
                                                  errors.pricing?.bulkPrices?.[
                                                    index
                                                  ]?.minQty?.message && (
                                                    <span className="error-txt">
                                                      {
                                                        errors.pricing
                                                          .bulkPrices[index]
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
                                                        "newProduct.fields.add_tier.quantity_to_placeholder"
                                                      )}
                                                      value={
                                                        field.value?.toString() ??
                                                        ""
                                                      }
                                                      onChange={(e) => {
                                                        const numberValue =
                                                          parseFloat(
                                                            e.target.value
                                                          );
                                                        field.onChange(
                                                          isNaN(numberValue)
                                                            ? undefined
                                                            : numberValue
                                                        );
                                                      }}
                                                    />
                                                  )}
                                                />
                                                {formValues.pricing
                                                  .pricingType ===
                                                  PricingType.BULK &&
                                                  errors.pricing &&
                                                  "bulkPrices" in
                                                    errors.pricing &&
                                                  Array.isArray(
                                                    errors.pricing.bulkPrices
                                                  ) &&
                                                  errors.pricing?.bulkPrices?.[
                                                    index
                                                  ]?.maxQty?.message && (
                                                    <span className="error-txt">
                                                      {
                                                        errors.pricing
                                                          .bulkPrices[index]
                                                          .maxQty.message
                                                      }
                                                    </span>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="forms-group wid-200px">
                                            <label
                                              className="f-g-label"
                                              htmlFor="price"
                                            >
                                              {t(
                                                "newProduct.fields.add_tier.price_label"
                                              )}
                                            </label>
                                            <div className="forms-group f-g-w100">
                                              <Controller
                                                name={`pricing.bulkPrices.${index}.price`}
                                                control={control}
                                                render={({ field }) => (
                                                  <InputField
                                                    {...field}
                                                    placeholder={t(
                                                      "newProduct.fields.add_tier.price_placeholder"
                                                    )}
                                                    value={
                                                      field.value?.toString() ??
                                                      ""
                                                    }
                                                    onChange={(e) => {
                                                      const numberValue =
                                                        parseFloat(
                                                          e.target.value
                                                        );
                                                      field.onChange(
                                                        isNaN(numberValue)
                                                          ? undefined
                                                          : numberValue
                                                      );
                                                    }}
                                                  />
                                                )}
                                              />
                                              {formValues.pricing
                                                .pricingType ===
                                                PricingType.BULK &&
                                                errors.pricing &&
                                                "bulkPrices" in
                                                  errors.pricing &&
                                                Array.isArray(
                                                  errors.pricing.bulkPrices
                                                ) &&
                                                errors.pricing?.bulkPrices?.[
                                                  index
                                                ]?.price?.message && (
                                                  <span className="error-txt">
                                                    {
                                                      errors.pricing.bulkPrices[
                                                        index
                                                      ].price.message
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
                                      (errors.pricing.bulkPrices as any)?.root
                                        ?.message && (
                                        <span className="error-txt">
                                          {
                                            (errors.pricing.bulkPrices as any)
                                              .root.message
                                          }
                                        </span>
                                      )}
                                    <span className="helper-txt">
                                      {t("newProduct.fields.add_tier.helper")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="add-option-block">
                                <ButtonIconLeftOutline
                                  name={t("newProduct.fields.add_tier.label")}
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
                        {formValues.pricing.pricingType !==
                          PricingType.BULK && (
                          <div className="forms-group">
                            <label
                              className="f-g-label"
                              htmlFor="MinimumOrderQuantity"
                            >
                              {t("newProduct.fields.moq.label")}
                            </label>
                            <div className="f-g-input-horiz">
                              <div className="forms-group f-g-w100">
                                <Controller
                                  name="minOrderQuantity"
                                  control={control}
                                  render={({ field }) => (
                                    <InputField
                                      {...field}
                                      placeholder={t(
                                        "newProduct.fields.moq.placeholder"
                                      )}
                                      value={field.value?.toString() ?? ""}
                                      onChange={(e) => {
                                        const numberValue = parseFloat(
                                          e.target.value
                                        );
                                        field.onChange(
                                          isNaN(numberValue)
                                            ? undefined
                                            : numberValue
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
                                      placeholder={t(
                                        "newProduct.fields.moq.unit_placeholder"
                                      )}
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
                </div>
              </div>
            </div>
            <div className="o-s-c-footer">
              <div className="o-s-c-f-left"></div>
              <div className="o-s-c-f-right">
                <div className="o-s-c-btn-group">
                  <ButtonIconRight
                    name={common("Continue")}
                    onClick={handleSubmit((data) => quickInsert(data))}
                  >
                    <RightArrowIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
          </>
        )}
      ></Sidebar>

      {/* Modals */}
      {/* <FindCategoryDialog /> */}
      {/* <BrowseCategoryDialog /> */}
      <SuccessDialog
        visible={newProductAddSuccessfullyDialog}
        title={"New Product Added"}
        subTxt={
          "Continue creating Sell offer with the newly added product.  You can find this product in your listing as drafts."
        }
      />
    </>
  );
};

export default AddNewProductDialog;
