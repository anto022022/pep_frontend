"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Typography from "../Base/Typography";
import {
  AiSuggestionsIcon,
  ChevronDownIcon,
  CloseIcon,
  RightArrowIcon,
  TradeInformationIcon,
} from "../Icons/SVGIcons";

import { Sidebar } from "primereact/sidebar";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import Select from "../StoreFront/Forms/Select";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAiGenerator from "../../_hooks/useGeneratewithAi";
import { useLocalizedOptions } from "../../_hooks/useLocalizedOptions";
import {
  CreateBuyingRequest,
  DeliveryTimeType,
  PaymentTerms,
  PreferredSourcingRegion,
} from "../../_interface/RfqInterface";
import {
  currencyList,
  shippingMethodsData,
  supplyContractType,
  unitOption,
} from "../../_models/StoreFront";
import {
  useCreateBuyingRequestMutation,
  useGetBuyingRequestDetailsQuery,
  useUpdateBuyingRequestMutation,
} from "../../_store/apiReducer/buyingRequestApi";
import { useLazyGetCategoryAiSuggestionsQuery } from "../../_store/apiReducer/productsApi";
import {
  setIsAddPostBuyingRequestOpen,
  setPostBuyingRequestCreatedDialog,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppSelector } from "../../_store/store";
import { postRequestDetailsSchema } from "../../_validationSchema/postBuyingRequest";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import SuccessDialog from "../dialog/SuccessDialog";
import MultiSelectInputs from "../form/MultiSelectDrapDown";
import NestedCategorySelect from "../form/NestedCategorySelect";
import DateTimePickerCalender from "../StoreFront/Forms/DateTimePickerCalender";
import DndImageUpload from "../StoreFront/Forms/DndImageUpload";
import InputField from "../StoreFront/Forms/InputField";
import TextArea from "../StoreFront/Forms/TextArea";
import ToggleInput from "../StoreFront/Forms/ToggleInputs";
interface CreateBuyingRequestDialogProps {
  selectedEditRfq?: string;
}
const CreateBuyingRequestDialog: FC<CreateBuyingRequestDialogProps> = ({
  selectedEditRfq,
}) => {
  const t = useTranslations("rfq.buyingRequest.buyingRequestForm");
  const common = useTranslations("common");
  const [Loading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [_titleLoading, setTitleLoading] = useState(false);
  const [showCustomization, setCustomization] = useState<boolean>(false);
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const localizedUnitList = useLocalizedOptions("common", unitOption);
  const [isAdvRequirementShow, setIsAdvRequirementShow] = useState(false);
  const localizedShippingMethods = useLocalizedOptions(
    "common",
    shippingMethodsData,
    "label",
    "label"
  );
  const localizedSupplyContractType = useLocalizedOptions(
    "common",
    supplyContractType
  );
  const [addBuyRequest] = useCreateBuyingRequestMutation();
  const [updateBuyRequest] = useUpdateBuyingRequestMutation();
  const [getCategoryAiSuggestions, { data: aiGeneratedCategoryList }] =
    useLazyGetCategoryAiSuggestionsQuery();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof postRequestDetailsSchema>>({
    defaultValues: {
      productName: "",
      rfqTitle: "",
      validityDate: new Date(),
      preferredUnitPrice: {
        currency: {
          code: "",
          name: "",
          symbol: "",
        },
        priceRange: {
          minPrice: undefined,
          maxPrice: undefined,
        },
      },
      estOrderQuantity: {
        quantity: 0,
        unit: "",
      },
      isDraft: false,
      sampleRequired: false,
      customizationRequired: false,
      productDescription: "",
      additionalBuyingReqDetails: "",
    },
    mode: "all",
    resolver: zodResolver(postRequestDetailsSchema),
  });

  const formValues = watch();
  // useEffect(() => {
  //   console.log("errors", errors);
  // }, [errors]);

  const requestBody = useMemo(() => {
    return {
      lan: "en",
      max_length: 250,
      productName: formValues?.productName,
      category: formValues?.category?.name,
      subCategory: formValues?.subCategory?.name,
      productCategory: formValues?.productCategory?.name,
      quantity: "250",
    };
  }, [formValues]);

  const setDetailedDescriptions = (description: any) => {
    setValue("productDescription", description?.description);
  };
  const setRfqTitle = (rfqTitle: any) => {
    setValue("rfqTitle", rfqTitle);
  };
  const dispatch = useDispatch();

  const { isAddPostBuyingRequestOpen, postBuyingRequestCreatedDialog } =
    useAppSelector((state: RootState) => state.uiData);

  const triggerAiCategory = () => {
    if (!getValues("productName")) return;
    getCategoryAiSuggestions({
      product_name: getValues("productName") ?? "",
    });
  };

  useEffect(() => {
    setIsActive(!!(formValues.productName?.trim() || formValues.rfqTitle));
  }, [formValues]);

  const submitBuyRequest = async (data: CreateBuyingRequest) => {
    try {
      const response = await addBuyRequest(data).unwrap();
      console.log("response", response);
      if (response) {
        dispatch(setIsAddPostBuyingRequestOpen(false));
        dispatch(setPostBuyingRequestCreatedDialog(true));
        reset();
        setTimeout(async () => {
          dispatch(setPostBuyingRequestCreatedDialog(false));
        }, 3000);
      }
    } catch (error) {
      if (error?.data?.statusCode === 403) {
        dispatch(
          showToast({
            title: "Error!",
            message: error?.data?.message,
            theme: "error",
          })
        );
      }
      console.log(error);
    }
    dispatch(setIsAddPostBuyingRequestOpen(false));
  };
  const updateBuyRequestMethod = async (
    data: CreateBuyingRequest,
    id: string
  ) => {
    try {
      const response = await updateBuyRequest({ data, id }).unwrap();
      if (response) {
        dispatch(setIsAddPostBuyingRequestOpen(false));
        dispatch(setPostBuyingRequestCreatedDialog(true));
        reset();
        setTimeout(async () => {
          dispatch(setPostBuyingRequestCreatedDialog(false));
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { regenerate: regenerateDescription } = useAiGenerator({
    apiEndpoint: `${
      process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
    }sales/ai/get-short-description`,
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

  const { regenerate: regenerateRfqTitle } = useAiGenerator({
    apiEndpoint: `${
      process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
    }source/ai/get-rfq-title`,
    storageKey: "pt_rfqtitle",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.productDescription as string,
    max_length: 20,
    setIsLoading: setTitleLoading,
    setDescription: setRfqTitle,
    requestBody,
    value: "title",
  });
  const preferredRegionOptions = [
    {
      name: t("preferredRegion.options.nearby"),
      value: PreferredSourcingRegion.Nearby,
    },
    {
      name: t("preferredRegion.options.withinMyCountry"),
      value: PreferredSourcingRegion.WithinMyCountry,
    },
    {
      name: t("preferredRegion.options.international"),
      value: PreferredSourcingRegion.International,
    },
  ];
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);
  useEffect(() => {
    const countryList = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const cityList = City.getCitiesOfCountry(selectedCountry.value) || [];
      setCities(
        cityList.map((city) => ({ label: city.name, value: city.name }))
      );
    } else {
      setCities([]);
    }
  }, [selectedCountry]);
  const skip = !selectedEditRfq || selectedEditRfq === "";

  const { data, isSuccess } = useGetBuyingRequestDetailsQuery(selectedEditRfq, {
    skip,
  });

  useEffect(() => {
    if (isSuccess && data) {
      if (selectedEditRfq) {
        reset({
          productName: data.data.productName,
          rfqTitle: data.data.rfqTitle,
          validityDate: new Date(data.data.validityDate),
          preferredUnitPrice: data.data.preferredUnitPrice,
          category: data.data.category,
          subCategory: data.data.subCategory,
          productCategory: data.data?.productCategory,
          productDescription: data.data.productDescription,
          additionalBuyingReqDetails: data.data.additionalBuyingReqDetails,
          productImage: data.data.ProductImage,
          preferredSourcingRegion: data.data.preferredSourcingRegion,
          preferredSourcingCountry: data.data.preferredSourcingCountry,
          preferredSourcingCity: data.data.preferredSourcingCity,
          expectedDeliveryTime: data.data.preferredSourcingCountry,
          destinationPort: data.data.destinationPort,
          supplyContractType: data.data.supplyContractType,
          paymentTerms: data.data.paymentTerms,
          shippingMethod: data.data.shippingMethod,
          annualPurchaseVolume: data.data.annualPurchaseVolume,
          sourcingFrequency: data.data.sourcingFrequency,
          sampleRequired: data.data.sampleRequired,
          customizationRequired: data.data.customizationRequired,
          customizationDetails: data.data.customizationDetails,

          // preferredUnitPrice: {
          //   currency: {
          //     code: "",
          //     name: "",
          //     symbol: "",
          //   },
          //   priceRange: {
          //     minPrice: 0,
          //     maxPrice: 0,
          //   },
          // },
          estOrderQuantity: data.data.estOrderQuantity,
          isDraft: false,
        });
      } else {
        reset({
          productName: "",
          rfqTitle: "",
          validityDate: new Date(),
          preferredUnitPrice: {
            currency: {
              code: "",
              name: "",
              symbol: "",
            },
            priceRange: {
              minPrice: undefined,
              maxPrice: undefined,
            },
          },
          estOrderQuantity: {
            quantity: 0,
            unit: "",
          },
          isDraft: false,
          sampleRequired: false,
          customizationRequired: false,
          productDescription: "",
          additionalBuyingReqDetails: "",
        });
      }
    }
  }, [data, isSuccess, selectedEditRfq]);

  return (
    <>
      <Sidebar
        visible={isAddPostBuyingRequestOpen}
        position="right"
        onHide={() => {
          dispatch(setIsAddPostBuyingRequestOpen(false));
          reset();
        }}
        className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar sidebar-md-image post-buying-request-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  <TradeInformationIcon />
                  {t("title")}
                </Typography>
                <CloseIcon
                  onClick={() => {
                    dispatch(setIsAddPostBuyingRequestOpen(false));
                    reset();
                  }}
                />
              </div>

              <div className="o-s-c-body">
                <div className="o-s-c-b-right">
                  <div className="forms-block">
                    {/* Product name*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("productName.label")}
                      </label>
                      <Controller
                        name="productName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("productName.placeHolder")}
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
                        {t("productCategory.label")}
                      </label>
                      <NestedCategorySelect
                        setValue={(field: any, value: any) => {
                          setValue(field, {
                            _id: value._id,
                            name: value.name,
                          });
                        }}
                        control={control}
                        errors={errors}
                        aiGeneratedContent={aiGeneratedCategoryList?.data ?? []}
                        isFormActive={true}
                        placeholder={t("productCategory.placeHolder")}
                      />
                    </div>

                    {/* Product description*/}
                    <div className="forms-group">
                      <Controller
                        name="productDescription"
                        control={control}
                        render={({ field }) => (
                          <TextArea
                            {...field}
                            label={t("productDescription.label")}
                            placeholder={t("productDescription.placeHolder")}
                            optionalTxt={t("productDescription.optional")}
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
                    {/*Additional Buying Request Details*/}
                    {/* <div className="forms-group">
                      <Controller
                        name="additionalBuyingReqDetails"
                        control={control}
                        render={({ field }) => (
                          <TextArea
                            {...field}
                            label={t("additionalBuyingReqDetails.label")}
                            placeholder={t(
                              "additionalBuyingReqDetails.placeHolder"
                            )}
                            optionalTxt={t(
                              "additionalBuyingReqDetails.optional"
                            )}
                            value={field.value}
                            onChange={(value: string) => field.onChange(value)}
                            // aiFunc={regenerateDescription}
                            // loading={Loading}
                            isActive={isActive}
                          />
                        )}
                      />
                    </div> */}

                    {/*RFQ Title*/}
                    <div className="forms-group">
                      <div className="f-g-label-flex">
                        <label className="f-g-label">
                          {t("rfqTitle.label")}
                        </label>

                        <button
                          type="button"
                          onClick={regenerateRfqTitle}
                          className="btn-comp black-icon-grey-txt"
                          disabled={!isActive || _titleLoading}
                        >
                          <AiSuggestionsIcon />
                          <span className="b-i-txt">
                            {_titleLoading
                              ? "Generating..."
                              : t("rfqTitle.aiSuggest")}
                          </span>
                        </button>
                      </div>
                      <Controller
                        name="rfqTitle"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("rfqTitle.placeHolder")}
                          />
                        )}
                      />
                      {errors.rfqTitle && (
                        <span className="error-txt">
                          {errors.rfqTitle.message}
                        </span>
                      )}
                    </div>
                    {/*EOQ*/}
                    <div className="forms-group">
                      <div className="f-g-input-horiz"></div>
                      <label
                        className="f-g-label"
                        htmlFor="MinimumOrderQuantity"
                      >
                        {t("estimatedOrderQuantity.label")}
                      </label>
                      <div className="f-g-input-horiz">
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="estOrderQuantity.quantity"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder={t(
                                  "estimatedOrderQuantity.placeholder"
                                )}
                                value={field.value?.toString() ?? ""}
                                onChange={(e) => {
                                  const numberValue = parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                }}
                              />
                            )}
                          />
                          {errors.estOrderQuantity?.quantity && (
                            <span className="error-txt">
                              {errors.estOrderQuantity.quantity.message}
                            </span>
                          )}
                        </div>
                        <div className="forms-group f-g-w100">
                          <Controller
                            name={"estOrderQuantity.unit"}
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={localizedUnitList}
                                optionLabel={`name`}
                                optionValue="value"
                                placeholder={t(
                                  "estimatedOrderQuantity.unitPlaceHolder"
                                )}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                          {errors.estOrderQuantity?.unit && (
                            <span className="error-txt">
                              {errors.estOrderQuantity.unit.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/*EOQ*/}

                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="priceRange">
                        {t("preferredUnitPrice.label")}
                      </label>
                      <div className="f-g-input-horiz">
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="preferredUnitPrice.priceRange.minPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder={t(
                                  "preferredUnitPrice.minPlaceholder"
                                )}
                                value={field.value?.toString() ?? ""}
                                onChange={(e) => {
                                  const numberValue = parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                }}
                              />
                            )}
                          />
                          {errors?.preferredUnitPrice?.priceRange?.minPrice
                            ?.message && (
                            <span className="error-txt">
                              {
                                errors.preferredUnitPrice.priceRange.minPrice
                                  .message
                              }
                            </span>
                          )}
                        </div>
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="preferredUnitPrice.priceRange.maxPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder={t(
                                  "preferredUnitPrice.maxPlaceholder"
                                )}
                                value={field.value?.toString() ?? ""}
                                onChange={(e) => {
                                  const numberValue = parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                }}
                              />
                            )}
                          />
                          {errors?.preferredUnitPrice?.priceRange?.maxPrice
                            ?.message && (
                            <span className="error-txt">
                              {
                                errors.preferredUnitPrice.priceRange.maxPrice
                                  .message
                              }
                            </span>
                          )}
                        </div>
                        {/*PUP*/}
                        <div className="forms-group">
                          <Controller
                            name="preferredUnitPrice.currency"
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={localizedCurrencyList}
                                optionLabel={`name`}
                                value={field.value}
                                placeholder={t(
                                  "preferredUnitPrice.currencyPlaceholder"
                                )}
                                onChange={field.onChange}
                                itemTemplate={(opt) =>
                                  `${opt.symbol} - ${opt.code}`
                                }
                                valueTemplate={(value) =>
                                  !value
                                    ? t(
                                        "preferredUnitPrice.currencyPlaceholder"
                                      )
                                    : `${value?.symbol} - ${value?.code}`
                                }
                              />
                            )}
                          />
                          {errors?.preferredUnitPrice?.currency?.code
                            ?.message && (
                            <span className="error-txt">
                              {
                                errors?.preferredUnitPrice?.currency?.code
                                  ?.message
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/*PUP*/}

                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="EndDate">
                        {t("rfqValidity.label")}
                      </label>
                      <Controller
                        name="validityDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePickerCalender
                            {...field}
                            placeholder="DD/MM/YY"
                            showTime={false}
                          />
                        )}
                      />

                      {errors.validityDate && (
                        <span className="error-txt">
                          {errors.validityDate.message}
                        </span>
                      )}
                    </div>
                    <div className="forms-block ">
                      <div
                        className={`adv-req-block ${
                          isAdvRequirementShow ? "active" : ""
                        }`}
                        onClick={() =>
                          setIsAdvRequirementShow(!isAdvRequirementShow)
                        }
                      >
                        <div className="a-r-b-content">
                          <div className="forms-group">
                            <label className="f-g-label">
                              {t("additionalRequirements.title")}
                            </label>
                          </div>
                          <Typography
                            variant="span"
                            className="a-r-b-c-helpertxt"
                          >
                            {t("additionalRequirements.subTitle")}
                          </Typography>
                        </div>
                        <ChevronDownIcon className={"trigger-icon"} />
                      </div>

                      <div className="forms-group">
                        <label className="f-g-label">{t("upload.label")}</label>
                        <Controller
                          name="productImage"
                          control={control}
                          render={({ field }) => (
                            <DndImageUpload
                              value={field.value || []}
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
                      <div className="forms-group radio-card-group">
                        <label className="f-g-label">
                          {t("preferredRegion.label")}
                        </label>
                        <div className="price-forms-radio split-3">
                          <Controller
                            name="preferredSourcingRegion"
                            control={control}
                            render={({ field }) => (
                              <>
                                {preferredRegionOptions.map((option, i) => (
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
                                      onChange={(e) =>
                                        field.onChange(e.target.value)
                                      }
                                    />
                                    <span className="f-r-h-label">
                                      {option.name}
                                    </span>
                                  </label>
                                ))}
                              </>
                            )}
                          />
                        </div>
                        {errors.preferredSourcingRegion && (
                          <span className="error-txt">
                            {errors.preferredSourcingRegion.message}
                          </span>
                        )}
                        {(formValues.preferredSourcingRegion ===
                          PreferredSourcingRegion.Nearby ||
                          formValues.preferredSourcingRegion ===
                            PreferredSourcingRegion.WithinMyCountry) && (
                          <Controller
                            name="preferredSourcingCountry"
                            control={control}
                            render={({ field }) => (
                              <select
                                className="forms-select"
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  setValue("preferredSourcingCity", "");
                                  const selectedValue = e.target.value;
                                  const selected =
                                    countries.find(
                                      (item) => item.value === selectedValue
                                    ) || null;
                                  setSelectedCountry(selected);
                                }}
                              >
                                <option value="">
                                  {t("preferredRegion.countriesPlaceHolder")}
                                </option>
                                {countries?.map((item, index) => (
                                  <option key={index} value={item?.value}>
                                    {item?.label}
                                  </option>
                                ))}
                                {/* <option value="India">India</option> */}
                              </select>
                            )}
                          />
                        )}
                        {formValues.preferredSourcingCountry &&
                          formValues.preferredSourcingRegion ===
                            PreferredSourcingRegion.Nearby && (
                            <Controller
                              name="preferredSourcingCity"
                              control={control}
                              render={({ field }) => (
                                <select
                                  className="forms-select"
                                  onChange={field.onChange}
                                >
                                  <option value="">
                                    {t("preferredRegion.citiesPlaceHolder")}
                                  </option>
                                  {cities?.map((item, index) => (
                                    <option key={index} value={item?.value}>
                                      {item?.label}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                          )}
                      </div>
                      <div className="forms-group">
                        <div className="f-g-input-horiz">
                          <div className="forms-group f-g-w100">
                            <label className="f-g-label">
                              {t("expectedDeliveryTime.label")}
                            </label>
                            <Controller
                              name="expectedDeliveryTime"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  options={Object.values(DeliveryTimeType).map(
                                    (term) => ({
                                      name: term,
                                      value: term,
                                    })
                                  )}
                                  optionLabel="name"
                                  optionValue="value"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                            {errors.expectedDeliveryTime && (
                              <span className="error-txt">
                                {errors.expectedDeliveryTime.message}
                              </span>
                            )}
                          </div>
                          <div className="forms-group f-g-w100">
                            <label className="f-g-label">
                              {t("destinationPort.label")}
                            </label>
                            <Controller
                              name="destinationPort"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  {...field}
                                  placeholder="e.g., Mumbai Port"
                                />
                              )}
                            />
                            {errors.destinationPort && (
                              <span className="error-txt">
                                {errors.destinationPort.message}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="forms-group">
                        <div className="f-g-input-horiz">
                          <div className="forms-group f-g-w100">
                            <label className="f-g-label">
                              {t("paymentTerms.label")}
                            </label>
                            <Controller
                              name="paymentTerms"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  options={Object.values(PaymentTerms).map(
                                    (term) => ({
                                      name: term,
                                      value: term,
                                    })
                                  )}
                                  optionLabel="name"
                                  optionValue="value"
                                  placeholder="Select Payment Terms"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                            {errors.paymentTerms && (
                              <span className="error-txt">
                                {errors.paymentTerms.message}
                              </span>
                            )}
                          </div>
                          <div className="forms-group f-g-w100">
                            <label className="f-g-label">
                              {t("supplyContractType.label")}
                            </label>
                            <Controller
                              name="supplyContractType"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  options={localizedSupplyContractType}
                                  optionLabel="name"
                                  optionValue="value"
                                  placeholder={t(
                                    "supplyContractType.placeHolder"
                                  )}
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              )}
                            />
                            {errors.supplyContractType && (
                              <span className="error-txt">
                                {errors.supplyContractType.message}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="forms-group f-g-w100">
                          <label className="f-g-label">
                            {t("shippingMethod.label")}
                          </label>

                          <Controller
                            name="shippingMethod"
                            control={control}
                            render={({ field }) => (
                              <MultiSelectInputs
                                options={localizedShippingMethods}
                                optionLabel="label"
                                optionValue="label"
                                placeholder={t("shippingMethod.placeHolder")}
                                value={field.value || []}
                                onChange={field.onChange}
                                // selectAllLabel={t("selectAll")}
                                // unselectAllLabel={t("unselectAll")}
                              />
                            )}
                          />
                          {errors.shippingMethod && (
                            <span className="error-txt">
                              {errors.shippingMethod.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="forms-group ">
                        <div className="f-g-input-horiz f-g-label-flex">
                          <label className="f-g-label forms-group f-g-w100 ">
                            {t("sampleRequired.label")}
                          </label>
                          <Controller
                            name="sampleRequired"
                            control={control}
                            render={({ field }) => (
                              <ToggleInput
                                className="forms-group f-g-w100"
                                checked={field.value ?? false}
                                onChange={(e) => {
                                  const value = e.target.checked;
                                  field.onChange(value);
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                              />
                            )}
                          />
                        </div>
                        {errors.sampleRequired && (
                          <span className="error-txt">
                            {errors.sampleRequired.message}
                          </span>
                        )}
                      </div>
                      <div className="forms-group">
                        <div className="f-g-input-horiz">
                          <label className="f-g-label  forms-group f-g-w100">
                            {t("customisationRequired.label")}
                          </label>
                          <Controller
                            name="customizationRequired"
                            control={control}
                            render={({ field }) => (
                              <ToggleInput
                                className="forms-group f-g-w100"
                                checked={field.value ?? false}
                                name={field.name}
                                onChange={(e) => {
                                  const value = e.target.checked;
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.customizationRequired && (
                          <span className="error-txt">
                            {errors.customizationRequired.message}
                          </span>
                        )}
                      </div>
                      {formValues?.customizationRequired && (
                        <div className="forms-group">
                          <label className="f-g-label  forms-group f-g-w100">
                            {t("customizationDetails.label")}
                          </label>
                          <Controller
                            name="customizationDetails"
                            control={control}
                            render={({ field }) => (
                              <TextArea
                                isActive={false}
                                {...field}
                                placeholder={t("customizationDetails.label")}
                                value={field.value}
                                onChange={(value: string) => {
                                  field.onChange(value);
                                }}
                              />
                            )}
                          />
                          {errors.customizationDetails && (
                            <span className="error-txt">
                              {errors.customizationDetails.message}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="o-s-c-footer">
              <div className="o-s-c-f-left"></div>
              <div className="o-s-c-f-right">
                <div className="o-s-c-btn-group">
                  {selectedEditRfq ? (
                    <ButtonIconRight
                      type="button"
                      name={common("update")}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit((data: CreateBuyingRequest) =>
                          updateBuyRequestMethod(
                            data as CreateBuyingRequest,
                            selectedEditRfq
                          )
                        )();
                      }}
                      disabled={isSubmitting}
                    >
                      <RightArrowIcon />
                    </ButtonIconRight>
                  ) : (
                    <>
                      {" "}
                      <ButtonIconLeftOutline
                        type="button"
                        name={common("saveAndContinue")}
                        className={"bg-outline-grey custom-width"}
                        onClick={handleSubmit((data: CreateBuyingRequest) => {
                          setValue("isDraft", true);
                          submitBuyRequest(data as CreateBuyingRequest);
                        })}
                        disabled={isSubmitting}
                      />
                      <ButtonIconRight
                        type="button"
                        name={common("Continue")}
                        onClick={(e) => {
                          e.preventDefault();
                          setValue("isDraft", false);
                          handleSubmit((data: CreateBuyingRequest) =>
                            submitBuyRequest(data as CreateBuyingRequest)
                          )();
                        }}
                        disabled={isSubmitting}
                      >
                        <RightArrowIcon />
                      </ButtonIconRight>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      />{" "}
      <SuccessDialog
        visible={postBuyingRequestCreatedDialog}
        title={
          selectedEditRfq
            ? "Buying Request Updated"
            : "New Post Buying Request posted"
        }
      />
    </>
  );
};

export default CreateBuyingRequestDialog;
