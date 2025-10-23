import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import NestedCategorySelect from "@/app/[locale]/_components/form/NestedCategorySelect";
import {
  InfoIcon,
  RightArrowIcon,
  TradeInformationIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import AlertMessage from "@/app/[locale]/_components/Messages/AlertMessage";
import DndImageUpload from "@/app/[locale]/_components/StoreFront/Forms/DndImageUpload";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import useAiGenerator from "@/app/[locale]/_hooks/useGeneratewithAi";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import { CategoriesListInterface } from "@/app/[locale]/_interface/common";
import { SuggestCategory } from "@/app/[locale]/_interface/SalesProductInterface";
import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useAddProductInformationMutation,
  useGetProductFormDetailsQuery,
  useLazyGetCategoryAiSuggestionsQuery,
  useUpdateProductInformationMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { salesProductInformationSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Messages } from "primereact/messages";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface CountryOfOrigin {
  code: string;
  name: string;
}

export interface ProductFormValues {
  productName: string;
  category?: Partial<CategoriesListInterface>;
  subCategory?: Partial<CategoriesListInterface>;
  productCategory?: Partial<CategoriesListInterface>;
  categorySuggestion?: Partial<SuggestCategory>;
  productBrochure?: productBrochure;
  productDescription: string;
  countryOfOrigin: CountryOfOrigin;
  productImage: UploadedImage[];
  skuCode?: string;
}

export interface UploadedImage {
  src: string;
  alt: string;
  exten: string;
  size: number;
}
export interface productBrochure {
  src: string;
  alt: string;
  exten: string;
  size: number;
}
const ProductInformation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const dispatch = useAppDispatch();
  const f = useTranslations("freeCatalog");
  const [addProductInformation] = useAddProductInformationMutation();
  const [updateProductInformation] = useUpdateProductInformationMutation();
  const t = useTranslations("salesProduct");
  const common = useTranslations("common");
  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );
  const [descriptionIsLoading, setDescriptionIsLoadingIsLoading] =
    useState(false);
  const [isActive, setIsActive] = useState(true);
  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    {
      id: id ?? "",
      stage: ProductStageKey.ProductInformation,
    },
    {
      skip: !id,
    }
  );

  const [countriesOptions, setCountriesOptions] = React.useState<
    { name: string; code: string }[]
  >([]);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      productName: "",
      category: {},
      subCategory: {},
      productCategory: {},
      categorySuggestion: {},
      productDescription: "",
      countryOfOrigin: {},
      productImage: [],
      skuCode: "",
    },
    mode: "onBlur",
    resolver: zodResolver(salesProductInformationSchema),
  });

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.ProductInformation] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.ProductInformation]]);

  const [getCategoryAiSuggestions, { data: aiGeneratedCategoryList }] =
    useLazyGetCategoryAiSuggestionsQuery();

  useEffect(() => {
    if (isSuccess && data) {
      reset({
        productName: data.data.productName || "",
        category: data.data.category || {},
        subCategory: data.data.subCategory || {},
        productCategory: data.data.productCategory || {},
        categorySuggestion: data.data.categorySuggestion || {},
        productBrochure: data.data.productBrochure || undefined,
        productDescription: data.data.productDescription || "",
        countryOfOrigin: data.data.countryOfOrigin || {},
        productImage: data.data.productImage || [],
        skuCode: data.data.skuCode || "",
      });
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  const formValues = watch();

  useEffect(() => {
    if (currentStepperStatus) {
      setIsActive(
        !!(
          currentStepperStatus?.[ProductStageKey.ProductInformation] !==
          "completed" &&
          (formValues.productName?.trim() ||
            (formValues.category && formValues.category._id?.trim()))
        )
      );
    }
  }, [currentStepperStatus, formValues]);

  useEffect(() => {
    useClearLocalStorageOnExit();
  }, [formValues.productName]);

  const onSubmit = async (data: ProductFormValues, skipCacheUpdate = false) => {
    try {
      if (!id) {
        const response = await addProductInformation({
          ...data,
          skipCacheUpdate,
        }).unwrap();
        const productId = response?.data?.productId;
        if (productId) {
          router.push(`?${new URLSearchParams({ id: productId })}`);
          dispatch(setCurrentForm(ProductStageKey.PricingAndMoq));
        }
      } else {
        await updateProductInformation({
          ...data,
          skipCacheUpdate,
          id,
        }).unwrap();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.PricingAndMoq));
        }
      }
      useClearLocalStorageOnExit();
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Invalid Inputs",
          theme: "error",
        })
      );
    }
  };

  const showAlertMessage = (msgsRef: React.RefObject<Messages | null>) => {
    if (msgsRef.current) {
      msgsRef.current.clear();
      msgsRef.current.show([
        {
          sticky: true,
          severity: "info",
          icon: <InfoIcon className={"alert-icon"} />,
          detail: f("homepage.alert.productVisible")
        },
      ]);
    }
  };

  const handleSaveAndContinue = async (data: ProductFormValues) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const triggerAiCategory = () => {
    if (!getValues("productName")) return;
    getCategoryAiSuggestions({
      product_name: getValues("productName") ?? "",
    });
  };

  const setDescriptions = (description: any) => {
    setValue("productDescription", description);
  };

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

  const { regenerate } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-short-description`,
    storageKey: "pt_sd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.productDescription,
    max_length: 250,
    setIsLoading: setDescriptionIsLoadingIsLoading,
    setDescription: setDescriptions,
    requestBody,
    value: "description",
  });

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <FormTitle variant={"h1"} text={t("productInformation.title")} >
            <TradeInformationIcon />
          </FormTitle>
          <AlertMessage showMessage={showAlertMessage} />
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">
                {t("productInformation.fields.productName.label")}
              </label>

              <Controller
                name="productName"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t(
                      "productInformation.fields.productName.placeholder"
                    )}
                    onBlur={() => {
                      triggerAiCategory();
                      field.onBlur();
                    }}
                  />
                )}
              />
              {errors.productName && (
                <span className="error-txt">{errors.productName.message}</span>
              )}
            </div>
            <div className="forms-group">
              <Controller
                name="productDescription"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label={t(
                      "productInformation.fields.shortDescription.label"
                    )}
                    placeholder={t(
                      "productInformation.fields.shortDescription.placeholder"
                    )}
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
              {errors.productDescription && (
                <span className="error-txt">
                  {errors.productDescription.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("productInformation.fields.sku&Model.label")}
              </label>

              <Controller
                name="skuCode"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t(
                      "productInformation.fields.sku&Model.placeholder"
                    )}
                  />
                )}
              />
              {errors.skuCode && (
                <span className="error-txt">{errors.skuCode.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("productInformation.fields.category.label")}
              </label>
              <NestedCategorySelect
                setValue={(field: any, value: any) => setValue(field, value)}
                control={control}
                errors={errors}
                aiGeneratedContent={aiGeneratedCategoryList?.data ?? []}
                isFormActive={
                  !currentStepperStatus[ProductStageKey.ProductInformation] ||
                    currentStepperStatus[ProductStageKey.ProductInformation] ===
                    "active"
                    ? true
                    : false
                }
                placeholder={t(
                  "productInformation.fields.category.placeholder"
                )}
              />
              {errors.category && (
                <span className="error-txt">{errors.category.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="image">
                {t("productInformation.fields.productImage.label")}
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
                <span className="error-txt">{errors.productImage.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="brochure">
                {t("productInformation.fields.productBrochure.label")}{" "}
                <span className="f-g-label-dim">
                  (
                  {t("productInformation.fields.productBrochure.optionalLabel")}
                  )
                </span>
              </label>
              <Controller
                name="productBrochure"
                control={control}
                render={({ field }) => (
                  <DndImageUpload
                    value={
                      Array.isArray(field.value)
                        ? field.value[0]
                        : field.value || undefined
                    }
                    onChange={(file) => {
                      if (Array.isArray(file)) {
                        field.onChange(file[0]);
                      } else {
                        field.onChange(file);
                      }
                    }}
                    single={true}
                    allowedFileTypes={["application/pdf"]}
                    placeHolder={t(
                      "productInformation.fields.productBrochure.placeholder"
                    )}
                    // maxHeight={900}
                    // maxWidth={500}
                    from={`brochre`}
                  />
                )}
              />

              {errors.productBrochure && (
                <span className="error-txt">
                  {errors.productBrochure.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="countryOrigin">
                {t("productInformation.fields.countryOfOrigin.label")}{" "}
              </label>
              <Controller
                name="countryOfOrigin"
                control={control}
                render={({ field }) => (
                  <Select
                    options={countriesOptions}
                    value={field.value}
                    onChange={field.onChange}
                    filter={true}
                    filterBy="name"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                    placeholder={t(
                      "productInformation.fields.countryOfOrigin.placeholder"
                    )}
                  />
                )}
              />
              {errors.countryOfOrigin && (
                <span className="error-txt">
                  {t("productInformation.fields.countryOfOrigin.placeholder")}{" "}
                </span>
              )}
            </div>
          </form>
          {/* <ProductGroupDailog /> */}
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
            disabled={isSubmitting}
          />
          <ButtonIconRight
            name={common("Continue")}
            onClick={handleSubmit((data) => onSubmit(data))}
            disabled={isSubmitting}
          >
            <RightArrowIcon />
          </ButtonIconRight>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
