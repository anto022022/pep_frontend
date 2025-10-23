"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Typography from "../Base/Typography";
import {
  AiSuggestionsIcon,
  CloseIcon,
  RightArrowIcon,
} from "../Icons/SVGIcons";

import { Sidebar } from "primereact/sidebar";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import Select from "../StoreFront/Forms/Select";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useAiGenerator from "../../_hooks/useGeneratewithAi";
import { useLocalizedOptions } from "../../_hooks/useLocalizedOptions";
import { CategoriesListInterface } from "../../_interface/common";
import { currencyList, unitOption } from "../../_models/StoreFront";
import { useLazyGetCategoryAiSuggestionsQuery } from "../../_store/apiReducer/productsApi";
import {
  setIsAddPostBuyingRequestOpen,
  setPostBuyingRequestCreatedDialog,
} from "../../_store/reducers/ui_store";
import { RootState, useAppSelector } from "../../_store/store";
import SuccessDialog from "../dialog/SuccessDialog";
import NestedCategorySelect from "../form/NestedCategorySelect";
import InputField from "../StoreFront/Forms/InputField";
import TextArea from "../StoreFront/Forms/TextArea";

import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { useTranslations } from "next-intl";
import {
  Currency,
  SuggestCategory,
} from "../../_interface/SalesProductInterface";
import { useAddPostBuyingRequestMutation } from "../../_store/apiReducer/postBuyingRequestApi";
import { postBuyingRequestSchema } from "../../_validationSchema/postBuyingRequest";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import DateTimePickerCalender from "../StoreFront/Forms/DateTimePickerCalender";

export interface RequestDetailsValues {
  rfqTitle: string;
  productName: string;
  category?: Partial<CategoriesListInterface>;
  subCategory?: Partial<CategoriesListInterface>;
  productCategory?: Partial<CategoriesListInterface>;
  categorySuggestion?: Partial<SuggestCategory>;
  productDescription: string;
  estOrderQuantity: {
    quantity: number;
    unit: string;
  };
  preferredUnitPrice: {
    currency: Currency;
    priceRange: {
      minPrice: number;
      maxPrice: number;
    };
  };
  validityDate: Date;
  additionalBuyingReqDetails?: string;
}

const AddPostBuyingRequestDialog: FC = () => {
  const [Loading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [rfqLoading, setIsRfqLoading] = useState(false);
  const login = useLoginRedirect();
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);
  const [addBuyRequest] = useAddPostBuyingRequestMutation();
  const [getCategoryAiSuggestions, { data: aiGeneratedCategoryList }] =
    useLazyGetCategoryAiSuggestionsQuery();
  const t = useTranslations("rfq.requestForm");
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<RequestDetailsValues>({
    defaultValues: {
      rfqTitle: "",
      productName: "",
      category: {},
      subCategory: {},
      productCategory: {},
      categorySuggestion: {},
      productDescription: "",
      estOrderQuantity: {
        quantity: undefined,
        unit: "",
      },
      preferredUnitPrice: {
        currency: {},
        priceRange: {
          minPrice: undefined,
          maxPrice: undefined,
        },
      },
      validityDate: undefined,
      additionalBuyingReqDetails: "",
    },
    mode: "onBlur",

    resolver: zodResolver(postBuyingRequestSchema),
  });

  const formValues = watch();

  // useEffect(() => {
  //   console.log("formError", errors);
  // }, [errors]);

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

  const rfqBody = useMemo(() => {
    return {
      lan: "en",
      productName: formValues?.productName,
      category: formValues?.category?.name,
      subCategory: formValues?.subCategory?.name,
      max_length: 12,
      quantity: JSON.stringify(formValues?.estOrderQuantity?.quantity),
      description: formValues?.productDescription,
      regenerate: true,
    };
  }, [formValues]);

  const setDetailedDescriptions = (description: any) => {
    setValue("productDescription", description?.description);
  };

  const setRfqTitle = (rfqTitle: any) => {
    setValue("rfqTitle", rfqTitle);
  };
  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsActive(
      !!(
        formValues.productName?.trim() ||
        (formValues.category && formValues.category._id?.trim())
      )
    );
  }, [formValues]);

  const { isAddPostBuyingRequestOpen, postBuyingRequestCreatedDialog } =
    useAppSelector((state: RootState) => state.uiData);

  useEffect(() => {
    reset();
  }, [isAddPostBuyingRequestOpen]);

  const triggerAiCategory = () => {
    if (!getValues("productName")) return;
    getCategoryAiSuggestions({
      product_name: getValues("productName") ?? "",
    });
  };

  const handleClick = (data: RequestDetailsValues) => {
    // e.preventDefault();
    // e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => {
        buyRequest(data)
      },
      onUnauthenticated: () => login(),
    });
  };
  const buyRequest = async (data: RequestDetailsValues) => {
    try {
      const response = await addBuyRequest(data).unwrap();
      if (response) {
        dispatch(setIsAddPostBuyingRequestOpen(false));
        dispatch(setPostBuyingRequestCreatedDialog(true));

        setTimeout(async () => {
          dispatch(setPostBuyingRequestCreatedDialog(false));
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(setIsAddPostBuyingRequestOpen(false));
  };

  const handleSaveAndContinue = () => {
    dispatch(setIsAddPostBuyingRequestOpen(false));
  };
  const { regenerate: regenerateDescription } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
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
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }source/ai/get-rfq-title`,
    storageKey: "pt_dd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.rfqTitle as string,
    max_length: 250,
    setIsLoading: setIsRfqLoading,
    setDescription: setRfqTitle,
    requestBody: rfqBody,
    value: "title",
  });

  return (
    <>
      <Sidebar
        visible={isAddPostBuyingRequestOpen}
        position="right"
        onHide={() => dispatch(setIsAddPostBuyingRequestOpen(false))}
        className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {t("title")}
                </Typography>
                <CloseIcon
                  onClick={() => dispatch(setIsAddPostBuyingRequestOpen(false))}
                />
              </div>

              <div className="o-s-c-body">
                <div className="o-s-c-b-right">
                  <div className="forms-block">
                    {/*RFQ Title*/}
                    <div className="forms-group">
                      <div className="f-g-label-flex">
                        <label className="f-g-label">{t("rfqTitle")}</label>
                        <button
                          type="button"
                          onClick={regenerateRfqTitle}
                          className="btn-comp black-icon-grey-txt"
                        >
                          <AiSuggestionsIcon />
                          <span className="b-i-txt">{t("aiSuggest")}</span>
                        </button>
                      </div>
                      <Controller
                        name="rfqTitle"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("titlePlaceholder")}
                          />
                        )}
                      />
                      {errors.rfqTitle && (
                        <span className="error-txt">
                          {errors.rfqTitle.message}
                        </span>
                      )}
                    </div>
                    {/* Product name*/}
                    <div className="forms-group">
                      <label className="f-g-label">{t("productName")}</label>
                      <Controller
                        name="productName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("namePlaceholder")}
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
                      <label className="f-g-label">{t("category")}</label>
                      <NestedCategorySelect
                        setValue={(field: any, value: any) =>
                          setValue(field, value)
                        }
                        control={control}
                        errors={errors}
                        aiGeneratedContent={aiGeneratedCategoryList?.data ?? []}
                        isFormActive={true}
                        placeholder="Search for Category"
                      />
                      {errors.category && (
                        <span className="error-txt">
                          {errors.category.message}
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
                            label={t("description")}
                            placeholder={t("indicateDesc")}
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

                    {/* Addn Request Details */}
                    <div className="forms-group">
                      <Controller
                        name="additionalBuyingReqDetails"
                        control={control}
                        render={({ field }) => (
                          <TextArea
                            {...field}
                            label={t("additional")}
                            placeholder={t("addnDetails")}
                            optionalTxt={t("optional")}
                            value={field.value}
                            onChange={(value: string) => field.onChange(value)}
                            aiFunc={regenerateDescription}
                            loading={Loading}
                            isActive={isActive}
                          />
                        )}
                      />

                      {errors.additionalBuyingReqDetails && (
                        <span className="error-txt">
                          {errors.additionalBuyingReqDetails.message}
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
                        {t("estOrderQuantity")}
                      </label>
                      <div className="f-g-input-horiz">
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="estOrderQuantity.quantity"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder="e.g:50"
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
                                placeholder="Units"
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
                    {/*PUP*/}
                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="">
                        {t("currency")}
                      </label>
                      <Controller
                        name="preferredUnitPrice.currency"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={localizedCurrencyList}
                            optionLabel={`name`}
                            value={field.value}
                            placeholder="INR"
                            onChange={field.onChange}
                            itemTemplate={(opt) =>
                              `${opt.symbol} - ${opt.code}`
                            }
                            valueTemplate={(value) =>
                              !value
                                ? "INR"
                                : `${value?.symbol} - ${value?.code}`
                            }
                          />
                        )}
                      />
                      {errors.preferredUnitPrice?.currency && (
                        <span className="error-txt">
                          {errors.preferredUnitPrice?.currency?.code?.message}
                        </span>
                      )}
                    </div>

                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="priceRange">
                        {t("priceRange")}
                      </label>
                      <div className="f-g-input-horiz">
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="preferredUnitPrice.priceRange.minPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder={t("minPrice")}
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
                          {errors.preferredUnitPrice?.priceRange?.minPrice && (
                            <span className="error-txt">
                              {
                                errors.preferredUnitPrice?.priceRange?.minPrice
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
                                placeholder={t("maxPrice")}
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
                          {errors.preferredUnitPrice?.priceRange?.maxPrice && (
                            <span className="error-txt">
                              {
                                errors.preferredUnitPrice?.priceRange?.maxPrice
                                  .message
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/*PUP*/}

                    <div className="forms-group wid-100">
                      <label className="f-g-label" htmlFor="EndDate">
                        {t("validityDate")}
                      </label>
                      <Controller
                        name="validityDate"
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
                      {errors.validityDate && (
                        <span className="error-txt">
                          {errors.validityDate.message}
                        </span>
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
                  <ButtonIconLeftOutline
                    type="button"
                    name={t("continue")}
                    className={"bg-outline-grey custom-width"}
                    onClick={handleSubmit(handleSaveAndContinue)}
                    disabled={false}
                  />
                  <ButtonIconRight
                    name={t("submit")}
                    onClick={handleSubmit((data) => handleClick(data))}
                  >
                    <RightArrowIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
          </>
        )}
      ></Sidebar>
      <AlertDialog
        visible={userSessionDialog}
        subTxt="You have to Login to Post Your Buying Request"
        continueOnclick={() => {
          setUserSessionDialog(false);
          login();
        }}
        cancelOnclick={() => {
          setUserSessionDialog(false);
        }}
      />
      <SuccessDialog
        visible={postBuyingRequestCreatedDialog}
        title={t("posted")}
      />
    </>
  );
};

export default AddPostBuyingRequestDialog;
