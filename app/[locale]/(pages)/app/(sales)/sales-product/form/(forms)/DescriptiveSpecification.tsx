import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import { BrandingAndMedia, RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import useAiGenerator from "@/app/[locale]/_hooks/useGeneratewithAi";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useUpdateDescriptionSpecificationMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { descriptiveSpecificationSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface descriptiveSpecificationFormValue {
  detailedDescription?: string;
  productApplications?: string;
}

const DescriptiveSpecification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const dispatch = useAppDispatch();

  const [Loading, setIsLoading] = useState(false);
  const [productAppLoading, setProductAppIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.ProductDescription },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductStageKey.ProductDescription] === "completed"
      ),
    }
  );
  const [updateDescriptionSpecification] =
    useUpdateDescriptionSpecificationMutation();

  const common = useTranslations("common");

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<descriptiveSpecificationFormValue>({
    defaultValues: {
      detailedDescription: "",
      productApplications: "",
    },
    resolver: zodResolver(descriptiveSpecificationSchema),
  });

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.ProductDescription] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.ProductDescription]]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        detailedDescription: data.data.detailedDescription || "",
        productApplications: data.data.productApplications || "",
      });
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (Object.keys(currentStepperStatus).length > 0) {
      setIsActive(
        currentStepperStatus?.[ProductStageKey.ProductDescription] === "active"
      );
    }
  }, [currentStepperStatus]);

  const onSubmit = async (
    data: descriptiveSpecificationFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        await updateDescriptionSpecification({
          id: id,
          ...data,
          skipCacheUpdate,
        }).unwrap();
        useClearLocalStorageOnExit();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.ProductionAndStock));
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
  };

  const handleSaveAndContinue = async (
    data: descriptiveSpecificationFormValue
  ) => {
    try {
      await onSubmit(data, true);
      router.push("./");
      localStorage.removeItem("pt_dd");
      localStorage.removeItem("pt_sd_technical");
      localStorage.removeItem("pt_sd_applications");
    } catch (error) {
      console.error("Error saving form:", error);
      localStorage.removeItem("pt_dd");
      localStorage.removeItem("pt_sd_technical");
      localStorage.removeItem("pt_sd_applications");
    }
  };
  const formValues = watch();
  const setDetailedDescriptions = (description: any) => {
    setValue("detailedDescription", description?.description);
  };

  // const setTechnicalSpecification = (description: any) => {
  //   setValue("technicalSpecification", description?.description);
  // };

  const setProductApplications = (description: any) => {
    setValue("productApplications", description?.description);
  };
  const requestBody = useMemo(() => {
    return { lan: "en", max_length: 250 };
  }, []);
  const { regenerate: regenerateDescription } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"}sales/ai/get-description/${id}?page=product-detail-description`,
    storageKey: "pt_dd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.detailedDescription as string,
    max_length: 250,
    setIsLoading: setIsLoading,
    setDescription: setDetailedDescriptions,
    requestBody,
    value: "description",
  });

  const { regenerate: regenerateApplications } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"}sales/ai/get-description/${id}?page=product-applications`,
    storageKey: "pt_sd_ap",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.productApplications || "",
    max_length: 250,
    setIsLoading: setProductAppIsLoading,
    setDescription: setProductApplications,
    requestBody,
    value: "description",
  });
  const t = useTranslations("salesProduct");

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <FormTitle variant={"h1"} text={t("productDescription.title")} >
            <BrandingAndMedia />
          </FormTitle>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <Controller
                name="detailedDescription"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label={t(
                      "productDescription.fields.productDescription.label"
                    )}
                    placeholder={t(
                      "productDescription.fields.productDescription.placeholder"
                    )}
                    optionalTxt={`(${t("productDescription.optionalLabel")})`}
                    value={field.value}
                    onChange={(value: string) => field.onChange(value)}
                    aiFunc={regenerateDescription}
                    loading={Loading}
                    isActive={isActive}
                  />
                )}
              />

              {errors.detailedDescription && (
                <span className="error-txt">
                  {errors.detailedDescription.message}
                </span>
              )}
            </div>

            {/* <div className="forms-group">
              <Controller
                name="technicalSpecification"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label="Technical Specifications "
                    optionalTxt="(Optional)"
                    placeholder="Enter Text"
                    value={field.value}
                    onChange={(value: string) => field.onChange(value)}
                    aiFunc={regenerateTechnical}
                    loading={technicalSpecLoading}
                    isActive={isActive}
                  />
                )}
              />
              {errors.technicalSpecification && (
                <span className="error-txt">
                  {errors.technicalSpecification.message}
                </span>
              )}
            </div> */}

            <div className="forms-group">
              <Controller
                name="productApplications"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    label={t("productDescription.fields.applications.label")}
                    optionalTxt={`(${t("productDescription.optionalLabel")})`}
                    placeholder={t(
                      "productDescription.fields.applications.placeholder"
                    )}
                    value={field.value}
                    onChange={(value: string) => field.onChange(value)}
                    aiFunc={regenerateApplications}
                    loading={productAppLoading}
                    isActive={isActive}
                  />
                )}
              />
              {errors.productApplications && (
                <span className="error-txt">
                  {errors.productApplications.message}
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
                (currentStepperStatus?.[ProductStageKey.ProductDescription] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.ProductDescription] ===
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
                (currentStepperStatus?.[ProductStageKey.ProductDescription] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.ProductDescription] ===
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

export default DescriptiveSpecification;
