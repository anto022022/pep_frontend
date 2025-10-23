import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import {
  AiSuggestionsIcon,
  PlusIcon,
  RightArrowIcon,
  TradeInformationIcon
} from "@/app/[locale]/_components/Icons/SVGIcons";
import ChipInputs from "@/app/[locale]/_components/StoreFront/Forms/ChipInputs";
import DateTimePickerCalender from "@/app/[locale]/_components/StoreFront/Forms/DateTimePickerCalender";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import ToggleInput from "@/app/[locale]/_components/StoreFront/Forms/ToggleInputs";
import useAiGenerator from "@/app/[locale]/_hooks/useGeneratewithAi";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import {
  BulkPrice,
  Currency,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { OfferType } from "@/app/[locale]/_models/sales/sellOffer";
import {
  offerTypeOptions,
  PricingType,
  ProductOfferKey,
  unitOption,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetOfferFormDetailsQuery,
  useGetPricingDetailOfOfferQuery,
  useUpdateOfferDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/sellOfferApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { offerDetailsScheme } from "@/app/[locale]/_validationSchema/salesSellOffer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { productCapacityPricingFormValue } from "../../../sales-product/form/(forms)/Pricing";
import { CountryOfOrigin } from "../../../sales-product/form/(forms)/ProductInformation";

export interface offers {
  offerTitle: string;
  offerDescription: string;
  offerInfo: OfferInfo;
  keyword?: Array<string>;
  marketFocus?: CountryOfOrigin[];
  offerStartDate: Date;
  offerEndDate: Date;
  immediateStart: boolean;
}

export interface OfferInfo {
  offerType: OfferType;
  discountPercent?: number;
  minOrderQuantity?: number;
  minQty?: number;
  maxQty?: number;
  unit: string;
  currency?: Currency;
  pricing?: {
    pricingType: PricingType;
    unit?: string;
    unitPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    bulkPrices?: BulkPrice[];
  };
  buyQty?: number;
  freeQty?: number;
}

const OfferDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const editForm = searchParams.get("CurrentForm");

  const dispatch = useAppDispatch();

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );
  const [isActive, setIsActive] = useState(false);
  const [keyword, setKeyword] = useState<any[]>([]);
  const [keywordLoading, setKeyWordLoading] = useState(false);
  const [_titleLoading, setTitleLoading] = useState(false);
  const [descriptionIsLoading, setDescriptionIsLoadingIsLoading] =
    useState(false);
  const { data, isSuccess } = useGetPricingDetailOfOfferQuery(id ?? undefined, {
    skip: !id,
  });

  const t = useTranslations("salesOffer.offerDetails");
  const common = useTranslations("common");
  const localizedDiscountOptions = useLocalizedOptions(
    "salesOffer",
    offerTypeOptions
  );
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);

  const [offerPricingDetail, setOfferPricing] = useState<
    productCapacityPricingFormValue | undefined
  >(undefined);
  const [countriesOptions, setCountriesOptions] = React.useState<
    { name: string; code: string }[]
  >([]);

  const [updateOfferDetails] = useUpdateOfferDetailsMutation();
  const {
    data: apiFormData,
    isSuccess: apiFormSuccess,
  }: {
    data?: any;
    isSuccess: boolean;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  } = useGetOfferFormDetailsQuery(
    {
      id: id ?? "",
      stage: ProductOfferKey.OfferDetails,
    },
    {
      skip: !(
        id && currentStepperStatus[ProductOfferKey.OfferDetails] === "completed"
      ),
    }
  );

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<offers>({
    defaultValues: {
      offerTitle: "",
      offerDescription: "",
      offerInfo: {
        offerType: OfferType.FIXED_DISCOUNT,
        discountPercent: undefined,
        minOrderQuantity: undefined,
        minQty: undefined,
        maxQty: undefined,
        currency: undefined,
        unit: "",
        buyQty: undefined,
        freeQty: undefined,
        pricing: {
          pricingType: PricingType.FIXED,
          unit: "",
          unitPrice: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          bulkPrices: undefined,
        },
      },
      immediateStart: false,
      offerStartDate: undefined,
      offerEndDate: undefined,
      marketFocus: [],
      keyword: [],
    },
    shouldUnregister: false,
    mode: "onChange",
    resolver: zodResolver(offerDetailsScheme),
  });

  const formValues = watch();

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  // useEffect(() => {
  //   console.log("formError", errors);
  // }, [errors]);

  useEffect(() => {
    if (apiFormData && apiFormSuccess) {
      const data = apiFormData.data;
      reset({
        offerTitle: data?.offerTitle ?? "",
        offerDescription: data?.offerDescription ?? "",
        immediateStart: data?.immediateStart ?? false,
        offerStartDate: data?.offerStartDate
          ? new Date(data.offerStartDate)
          : undefined,
        offerEndDate: data?.offerEndDate
          ? new Date(data.offerEndDate)
          : undefined,
        keyword: data?.keyword ?? [],
        marketFocus: data?.marketFocus ?? [],
        offerInfo: {
          currency: data?.offerInfo?.currency ?? undefined,
          offerType: data?.offerInfo?.offerType ?? OfferType.FIXED_DISCOUNT,
          discountPercent: data?.offerInfo?.discountPercent ?? undefined,
          minQty: data?.offerInfo?.minQty ?? undefined,
          maxQty: data?.offerInfo?.maxQty ?? undefined,
          unit: data?.offerInfo?.unit ?? "",
          minOrderQuantity: formValues.offerInfo.minOrderQuantity ?? undefined,

          buyQty: data?.offerInfo?.buyQty ?? undefined,
          freeQty: data?.offerInfo?.freeQty ?? undefined,

          pricing: {
            pricingType:
              data?.offerInfo?.pricing?.pricingType ?? PricingType.FIXED,
            unit: data?.offerInfo?.pricing?.unit ?? "",
            unitPrice: data?.offerInfo?.pricing?.unitPrice ?? undefined,
            minPrice: data?.offerInfo?.pricing?.minPrice ?? undefined,
            maxPrice: data?.offerInfo?.pricing?.maxPrice ?? undefined,
            bulkPrices: data?.offerInfo?.pricing?.bulkPrices ?? [],
          },
        },
      });
    }
  }, [apiFormData, apiFormSuccess]);

  useEffect(() => {
    if (isSuccess && data) {
      const apiData = data.data;
      setOfferPricing(apiData);
      if (currentStepperStatus[ProductOfferKey.OfferDetails] !== "completed") {
        reset({
          offerInfo: {
            currency: apiData?.currency ?? "",
            minOrderQuantity: apiData?.minOrderQuantity ?? "",
            unit: apiData?.moqUnit ?? "",
            pricing: {
              ...apiData?.pricing,
            },
          },
        });
      } else {
        setValue("offerInfo.minOrderQuantity", apiData?.minOrderQuantity ?? "");
      }
    }
  }, [data, isSuccess, currentStepperStatus]);

  const onSubmit = async (data: offers, skipCacheUpdate = false) => {
    if (id) {
      try {
        const lastData = { id, skipCacheUpdate, ...data };

        const response = await updateOfferDetails(lastData).unwrap();

        if (response) {
          if (editForm) {
            router.push(`./${id}`);
          } else {
            if (!skipCacheUpdate) {
              dispatch(setCurrentForm(ProductOfferKey.PaymentShipping));
            }
          }
        }
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
    // else {
    //   console.log("isEditing");
    // }
  };

  const handleSaveAndContinue = async (data: offers) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const calculateDiscountedPrice = (
    originalPrice: number,
    discountPercent: number
  ): number => {
    const discountAmount = (originalPrice * discountPercent) / 100;
    const discountedPrice = originalPrice - discountAmount;
    return parseFloat(discountedPrice.toFixed(2));
  };

  const updateOfferPricing = () => {
    const discount = getValues("offerInfo.discountPercent") || 0;
    const moq = getValues("offerInfo.minQty") || 0;

    if (discount > 100) return;

    const pricing = offerPricingDetail?.pricing;
    if (!pricing) return;

    if (offerPricingDetail?.pricing.pricingType === PricingType.BULK) {
      const originalBulkPrices = offerPricingDetail?.pricing.bulkPrices || [];
      let result: typeof originalBulkPrices = [];

      if (moq === 0) {
        result = originalBulkPrices;
      } else {
        const inRangeSlabs = originalBulkPrices.filter(
          (slab) => moq >= slab.minQty && moq <= slab.maxQty
        );

        if (inRangeSlabs.length > 0) {
          const inRangeSlab = inRangeSlabs.reduce((prev, curr) =>
            curr.minQty < prev.minQty ? curr : prev
          );
          result.push(inRangeSlab);
        }

        const futureSlabs = originalBulkPrices
          .filter((slab) => moq < slab.minQty)
          .sort((a, b) => a.minQty - b.minQty);

        if (futureSlabs.length > 0) {
          const futureSlab = futureSlabs[0];
          if (
            !result.find(
              (slab) =>
                slab.minQty === futureSlab.minQty &&
                slab.maxQty === futureSlab.maxQty
            )
          ) {
            result.push(futureSlab);
          }
        }
      }

      const discounted = result.map((slab) => ({
        ...slab,
        price: calculateDiscountedPrice(slab.price, discount),
      }));

      setValue("offerInfo.pricing.bulkPrices", discounted);
    }

    if (pricing.pricingType === PricingType.FIXED && pricing.unitPrice) {
      setValue(
        "offerInfo.pricing.unitPrice",
        calculateDiscountedPrice(pricing.unitPrice, discount)
      );
    }

    if (pricing.pricingType === PricingType.PRICE_RANGE) {
      setValue(
        "offerInfo.pricing.minPrice",
        calculateDiscountedPrice(pricing.minPrice, discount)
      );
      setValue(
        "offerInfo.pricing.maxPrice",
        calculateDiscountedPrice(pricing.maxPrice, discount)
      );
    }
  };

  const setOfferTitle = (offerTitle: string) => {
    setValue("offerTitle", offerTitle);
  };

  const setDescriptions = (description: any) => {
    setValue("offerDescription", description);
  };

  const keywordRequestBody = useMemo(() => {
    return {
      regenerate: true,
      lan: "en",
      max_length: 5,
      offerDescription: formValues.offerDescription || "",
      offerTitle: formValues.offerDescription || "",
      offerType: formValues.offerDescription || "",
      offerInfo: formValues.offerInfo,
      keyword: formValues.offerDescription,
    };
  }, [formValues]);

  const requestBody = useMemo(() => {
    return {
      regenerate: true,
      lan: "en",
      max_length: 300,
      offerDescription: formValues.offerDescription || "",
      offerTitle: formValues.offerDescription || "",
      offerType: formValues.offerDescription || "",
      offerInfo: formValues.offerInfo,
      keyword: formValues.offerDescription,
    };
  }, [formValues]);

  const { regenerate } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-sell-offer-description/${id}?page=sell-offer-description`,
    storageKey: "pt_sd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.offerDescription,
    max_length: 250,
    setIsLoading: setDescriptionIsLoadingIsLoading,
    setDescription: setDescriptions,
    requestBody,
    value: "sell_offer_description",
  });
  const setKeyWord = (description: any[]) => {
    const keyword = Array.isArray(description) ? [...description] : [];
    setKeyword(keyword);
  };

  const { regenerate: regenerateKeyWord } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-sell-offer-description/${id}?page=sell-offer-keyword`,
    storageKey: "pt_sd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.offerDescription,
    max_length: 250,
    setIsLoading: setKeyWordLoading,
    setDescription: setKeyWord,
    requestBody: keywordRequestBody,
    value: "sell_offer_keywords",
  });

  const { regenerate: regenerateTitle } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-sell-offer-description/${id}?page=sell-offer-title`,
    storageKey: "pt_sd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.offerDescription,
    max_length: 8,
    setIsLoading: setTitleLoading,
    setDescription: setOfferTitle,
    requestBody,
    value: "sell_offer_title",
  });

  useEffect(() => {
    if (currentStepperStatus) {
      setIsActive(
        !!(
          currentStepperStatus?.[ProductOfferKey.OfferDetails] == "active" &&
          (formValues.offerTitle?.trim() ||
            formValues.offerInfo?.offerType ||
            formValues?.offerDescription?.trim())
        )
      );
    }
  }, [currentStepperStatus, formValues]);
  const currentKeywords = getValues("keyword") || [];

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <FormTitle variant={"h1"} text={t("title")}>
            <TradeInformationIcon />
          </FormTitle>
        </div>
        <div className="c-f-b-t-body">
          <div className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">{t("fields.offerType.label")}</label>
              <Controller
                name="offerInfo.offerType"
                control={control}
                render={({ field }) => (
                  <Select
                    options={localizedDiscountOptions}
                    optionLabel="name"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.offerInfo?.offerType && (
                <span className="error-txt">
                  {errors.offerInfo.offerType.message}
                </span>
              )}
            </div>
            {formValues.offerInfo.offerType !== OfferType.BUY_MORE ? (
              <>
                <div className="forms-group">
                  <label className="f-g-label">
                    {t("fields.discountPercentage.label")}
                  </label>
                  <Controller
                    name="offerInfo.discountPercent"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        placeholder={t("fields.discountPercentage.placeHolder")}
                        value={field.value?.toString() ?? ""}
                        type="number"
                        step="any"
                        onChange={(e) => {
                          const rawValue = e.target.value;
                          const numberValue = parseFloat(rawValue);
                          field.onChange(
                            isNaN(numberValue) ? undefined : numberValue
                          );
                          updateOfferPricing();
                        }}
                      />
                    )}
                  />
                  {errors.offerInfo?.discountPercent && (
                    <span className="error-txt">
                      {errors.offerInfo.discountPercent.message}
                    </span>
                  )}
                </div>
                {formValues.offerInfo.offerType === OfferType.LOW_MOQ && (
                  <div className="forms-group">
                    <label className="f-g-label">
                      {t("fields.actualMoq.label")}
                    </label>
                    <Controller
                      name="offerInfo.minOrderQuantity"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          value={field.value?.toString() ?? ""}
                          disabled={true}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const numberValue = parseFloat(rawValue);
                            field.onChange(
                              isNaN(numberValue) ? undefined : numberValue
                            );
                          }}
                        />
                      )}
                    />
                    {errors.offerInfo?.minOrderQuantity && (
                      <span className="error-txt">
                        {errors.offerInfo.minOrderQuantity.message}
                      </span>
                    )}
                  </div>
                )}
                <div className="forms-split">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {t("fields.offMinOrderQuantity.label")}
                    </label>
                    <Controller
                      name="offerInfo.minQty"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          placeholder={t(
                            "fields.offMinOrderQuantity.placeHolder"
                          )}
                          value={field.value?.toString() ?? ""}
                          onChange={(e) => {
                            const numberValue = parseFloat(e.target.value);
                            field.onChange(
                              isNaN(numberValue) ? undefined : numberValue
                            );
                            updateOfferPricing();
                          }}
                        />
                      )}
                    />
                    {errors.offerInfo?.minQty && (
                      <span className="error-txt">
                        {errors.offerInfo.minQty.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {t("fields.offMaxOrderQuantity.label")}
                    </label>
                    <Controller
                      name="offerInfo.maxQty"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          placeholder={t(
                            "fields.offMaxOrderQuantity.placeHolder"
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
                    {errors.offerInfo?.maxQty && (
                      <span className="error-txt">
                        {errors.offerInfo.maxQty.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="forms-group wid-100">
                  <Controller
                    name="offerInfo.unit"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={localizedUnitList}
                        optionLabel="name"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!!field.value}
                      />
                    )}
                  />
                  {errors.offerInfo?.unit && (
                    <span className="error-txt">
                      {errors.offerInfo.unit.message}
                    </span>
                  )}
                </div>
                <div className="forms-group">
                  <label className="f-g-label">
                    {t("fields.pricing.label")}
                  </label>
                  {formValues.offerInfo.pricing?.pricingType ===
                    PricingType.FIXED && (
                      <div className="forms-group">
                        <Controller
                          name="offerInfo.pricing.unitPrice"
                          control={control}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              placeholder={t(
                                "fields.pricing.unitPricePlaceholder"
                              )}
                              disabled={true}
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
                        {errors.offerInfo?.pricing?.unitPrice && (
                          <span className="error-txt">
                            {errors.offerInfo.pricing?.unitPrice.message}
                          </span>
                        )}
                      </div>
                    )}
                  {formValues.offerInfo.pricing?.pricingType ===
                    PricingType.PRICE_RANGE && (
                      <div className="f-g-input-horiz">
                        <div className="forms-group wid-100">
                          <Controller
                            name="offerInfo.pricing.minPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder={t(
                                  "fields.pricing.minPricePlaceholder"
                                )}
                                disabled={true}
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
                          {errors.offerInfo?.pricing?.minPrice && (
                            <span className="error-txt">
                              {errors.offerInfo.pricing?.minPrice.message}
                            </span>
                          )}
                        </div>
                        <div className="forms-group wid-100">
                          <Controller
                            name="offerInfo.pricing.maxPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder={t(
                                  "fields.pricing.maxPricePlaceholder"
                                )}
                                disabled={true}
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
                          {errors.offerInfo?.pricing?.maxPrice && (
                            <span className="error-txt">
                              {errors.offerInfo.pricing?.maxPrice.message}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  {formValues.offerInfo.pricing?.pricingType ===
                    PricingType.BULK &&
                    formValues.offerInfo.pricing?.bulkPrices &&
                    formValues.offerInfo.pricing?.bulkPrices.length > 0 &&
                    formValues.offerInfo.pricing?.bulkPrices?.map(
                      (price, idx) => (
                        <div className="forms-split" key={idx}>
                          <div className="forms-group wid-100">
                            <InputField disabled={true} value={price.minQty} />
                          </div>
                          <div className="forms-group wid-100">
                            <InputField disabled={true} value={price.maxQty} />
                          </div>
                          <div className="forms-group wid-100">
                            <InputField
                              disabled={true}
                              value={`${formValues?.offerInfo?.currency?.symbol} ${price.price}`}
                            />
                          </div>
                        </div>
                      )
                    )}
                </div>
              </>
            ) : (
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {t("fields.buyMore.buyQtyLabel")}
                    </label>
                    <Controller
                      name="offerInfo.buyQty"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          placeholder={t("fields.buyMore.placeholder")}
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
                    {errors.offerInfo?.buyQty && (
                      <span className="error-txt">
                        {errors.offerInfo.buyQty.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {t("fields.buyMore.freeQtyLabel")}
                    </label>
                    <Controller
                      name="offerInfo.freeQty"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          {...field}
                          placeholder={t("fields.buyMore.placeholder")}
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
                    {errors.offerInfo?.freeQty && (
                      <span className="error-txt">
                        {errors.offerInfo.freeQty.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label visibility-hidden">
                      Invisible Label
                    </label>
                    <Controller
                      name="offerInfo.unit"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={localizedUnitList}
                          optionLabel="name"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!!field.value}
                        />
                      )}
                    />
                    {errors.offerInfo?.unit && (
                      <span className="error-txt">
                        {errors.offerInfo.unit.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="forms-group">
              <div className="f-g-label-flex">
                <label className="f-g-label">
                  {t("fields.offerTitle.label")}
                </label>
                <button
                  type="button"
                  onClick={regenerateTitle}
                  className="btn-comp black-icon-grey-txt"
                  disabled={!isActive}
                >
                  <AiSuggestionsIcon />
                  <span className="b-i-txt">
                    {t("fields.offerTitle.aiSuggest")}
                  </span>
                </button>
              </div>
              <Controller
                name="offerTitle"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("fields.offerTitle.placeHolder")}
                  />
                )}
              />
              {errors.offerTitle && (
                <span className="error-txt">{errors.offerTitle.message}</span>
              )}
            </div>
            <div className="forms-group">
              <Controller
                name="offerDescription"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label={t("fields.offerDescription.label")}
                    placeholder={t("fields.offerDescription.placeholder")}
                    value={field.value}
                    onChange={(value: string) => {
                      field.onChange(value);
                    }}
                    aiFunc={regenerate}
                    loading={descriptionIsLoading}
                    isActive={isActive}
                  />
                )}
              />
              {errors.offerDescription && (
                <span className="error-txt">
                  {errors.offerDescription.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.immediateStart.label")}
              </label>
              <span className="f-g-label txt-lght-grey fnt-w-400">
                {t("fields.immediateStart.helper")}
              </span>
              <div className="f-g-input-horiz">
                <Controller
                  name="immediateStart"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label
                        className="f-g-label cursor-pointer"
                        htmlFor={field.name}
                      >
                        {t("fields.immediateStart.toggleLabel")}
                      </label>
                      <ToggleInput
                        name={field.name}
                        onChange={(on) => {
                          field.onChange(on);
                          setValue(
                            "offerStartDate",
                            on ? new Date() : (undefined as any)
                          );
                        }}
                        checked={field.value}
                      />
                    </>
                  )}
                />
                {errors.immediateStart && (
                  <span className="error-txt">
                    {errors.immediateStart.message}
                  </span>
                )}
              </div>
            </div>
            <div className="forms-group">
              <div className="f-g-input-horiz">
                <div className="forms-group wid-100">
                  <label className="f-g-label" htmlFor="StartDate">
                    {t("fields.offerStartDate.label")}
                  </label>
                  <Controller
                    name="offerStartDate"
                    control={control}
                    render={({ field }) => (
                      <DateTimePickerCalender
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={"DD/MM/YY"}
                        showTime={false}
                        disabled={getValues("immediateStart")}
                      />
                    )}
                  />
                  {errors.offerStartDate && (
                    <span className="error-txt">
                      {errors.offerStartDate.message}
                    </span>
                  )}
                </div>
                <div className="forms-group wid-100">
                  <label className="f-g-label" htmlFor="EndDate">
                    {t("fields.offerEndDate.label")}
                  </label>
                  <Controller
                    name="offerEndDate"
                    control={control}
                    render={({ field }) => (
                      <DateTimePickerCalender
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={"DD/MM/YY"}
                        showTime={false}
                      />
                    )}
                  />
                  {errors.offerEndDate && (
                    <span className="error-txt">
                      {errors.offerEndDate.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="forms-group ">
              <label className="f-g-label">
                {t("fields.marketFocus.label")}
                <span className="f-g-label-dim">
                  {t("fields.marketFocus.optionLabels")}
                </span>
              </label>
              <Controller
                name="marketFocus"
                control={control}
                render={({ field }) => (
                  <MultiSelectInputs
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={countriesOptions}
                    optionLabel="name"
                    filter={true}
                    placeholder={t("fields.marketFocus.placeholder")}
                    maxSelectedLabels={5}
                    className="customize-dropdown"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                  />
                )}
              />
              {errors.marketFocus && (
                <span className="error-txt">{errors.marketFocus.message}</span>
              )}
            </div>
            <div className="forms-group mt-10px">
              <div className="f-g-label-flex">
                <label className="f-g-label">
                  {t("fields.keyword.label")}{" "}
                  <span className="f-g-label-dim">
                    {t("fields.marketFocus.optionLabels")}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={regenerateKeyWord}
                  className="btn-comp black-icon-grey-txt"
                  disabled={!isActive}
                >
                  <AiSuggestionsIcon />
                  <span className="b-i-txt">
                    {keywordLoading ? `Generating...` : "Ai Suggest"}
                  </span>
                </button>
              </div>

              <Controller
                name="keyword"
                control={control}
                render={({ field }) => (
                  <ChipInputs
                    value={field.value || []}
                    onChange={field.onChange}
                    handleOnAdd={(value) => {
                      const updated = [...(field.value || []), value];
                      field.onChange(updated);
                    }}
                    handleOnRemove={(valueToRemove) => {
                      const updated = (field.value || []).filter(
                        (item: any) => item !== valueToRemove
                      );
                      field.onChange(updated);
                    }}
                    itemTemplate={(item) => <span> {item}</span>}
                    placeholder={t("fields.keyword.placeholder")}
                  />
                )}
              />

              {/* AI Render for keyword suggestion */}
              {keyword.length > 0 && (
                <div className="more-attributes-block margin-t-unset">
                  <div className="m-a-b-btn-group">
                    {keyword.map((item, index) => {
                      const isAlreadyAdded = currentKeywords.includes(item);

                      return (
                        <ButtonIconLeftOutline
                          name={item}
                          key={index}
                          disabled={isAlreadyAdded}
                          className="bg-outline-grey btn-attributes light-blue"
                          onClick={() => {
                            const updatedKeywords = [...currentKeywords, item];
                            setValue("keyword", updatedKeywords);

                            // Optionally handle attribute update
                            // setValue(`attributes.${index}.isSuggested`, false);
                          }}
                        >
                          <PlusIcon />
                        </ButtonIconLeftOutline>
                      );
                    })}
                  </div>
                </div>
              )}
              {errors.keyword && (
                <span className="error-txt">{errors.keyword.message}</span>
              )}
            </div>
          </div>
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
                currentStepperStatus?.[ProductOfferKey.OfferDetails] ===
                "completed"
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
                (currentStepperStatus?.[ProductOfferKey.OfferDetails] ===
                  "completed" ||
                  currentStepperStatus?.[ProductOfferKey.OfferDetails] ===
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

export default OfferDetails;
