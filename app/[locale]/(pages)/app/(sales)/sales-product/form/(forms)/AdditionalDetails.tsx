import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  AiSuggestionsIcon,
  PlusIcon,
  RightArrowIcon,
  ShippingDetailsIcons,
  TrashTableIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import ProductGroupDailog from "@/app/[locale]/_components/OverLay/ProductGroupDialog";
import SuccessModel from "@/app/[locale]/_components/OverLay/SuccessModel";
import ChipInputs from "@/app/[locale]/_components/StoreFront/Forms/ChipInputs";
import DndImageUpload from "@/app/[locale]/_components/StoreFront/Forms/DndImageUpload";
import DndVideoUpload from "@/app/[locale]/_components/StoreFront/Forms/DndVideoUpload";
import FaqTextArea from "@/app/[locale]/_components/StoreFront/Forms/FaqTextArea";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import ToggleInput from "@/app/[locale]/_components/StoreFront/Forms/ToggleInputs";
import useAiGenerator from "@/app/[locale]/_hooks/useGeneratewithAi";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useGetProductGroupListQuery,
  useUpdateAdditionalDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import {
  setShowProductGroupDialog,
  setShowSuccessModel,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { additionalDetailsSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Certificate {
  name?: string;
  src?: string;
  alt?: string;
  exten?: string;
  size?: number;
}
export interface ProductVideo {
  src: string;
  alt: string;
  exten: string;
  size: number;
}

export interface additionalDetailsFormValue {
  isCustomizable: boolean;
  customization?: Array<string>;
  faqs?: FAQ[];
  brandName?: string;
  productGroup?: string;
  certificates: Certificate[];
  productVideo?: ProductVideo;
  youtubeUrl?: string;
  productKeyword: string[];
}

const AdditionalDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [faqLoading, setFaqIsLoading] = useState(false);
  const [_keywordLoading, setKeywordIsLoading] = useState(false);
  const [productKeyword, setProductKeyWord] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);

  const dispatch = useAppDispatch();
  const common = useTranslations("common");
  const [productGroupOptions, setProductGroupOptions] = useState<
    { _id: string; groupName: string }[]
  >([]);
  const [queryString, setQueryString] = useState("");

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.AdditionalDetails },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductStageKey.AdditionalDetails] === "completed"
      ),
    }
  );
  const [updateAdditionalDetails] = useUpdateAdditionalDetailsMutation();
  const { data: productGroupData, isSuccess: productGroupIsSuccess } =
    useGetProductGroupListQuery(queryString ? { query: queryString } : {});

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<additionalDetailsFormValue>({
    defaultValues: {
      isCustomizable: false,
      faqs: [
        {
          question: "",
          answer: "",
        },
      ],
      customization: undefined,
      brandName: "",
      certificates: [{}],
      productKeyword: [],
      youtubeUrl: "",
    },
    resolver: zodResolver(additionalDetailsSchema),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "faqs",
  });

  const customization = useWatch({
    control,
    name: "customization",
  });

  const {
    fields: certificatesFields,
    append: appendCertificates,
    remove: removeCertificates,
  } = useFieldArray({
    control,
    name: "certificates",
  });

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.AdditionalDetails] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.AdditionalDetails]]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const faqsData = data.data.faqs?.length
        ? data.data.faqs
        : [{ question: "", answer: "" }];

      // Reset entire form
      reset({
        faqs: faqsData,
        isCustomizable: data?.data?.isCustomizable ?? false,
        customization: data?.data?.customization ?? [],
        brandName: data?.data?.brandName ?? "",
        productGroup: data?.data?.productGroup ?? "",
        certificates:
          data?.data?.certificates?.length > 0 ? data?.data?.certificates : [{}],
        productVideo: data?.data?.productVideo ?? undefined,
        youtubeUrl: data?.data?.youtubeUrl ?? "",
        productKeyword: data?.data?.productKeyword ?? [],
      });
      replace(faqsData);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (currentStepperStatus[ProductStageKey.AdditionalDetails] === "active") {
      setIsActive(true);
    }
  }, [currentStepperStatus]);

  useEffect(() => {
    if (isActive) {
      regenerateProductKeyWord();
    }
  }, [isActive]);

  useEffect(() => {
    if (productGroupIsSuccess && productGroupData) {
      setProductGroupOptions([
        ...productGroupData.data,
        { _id: "add_new", groupName: "Add New Group" },
      ]);
    }
  }, [productGroupData, productGroupIsSuccess]);

  const formValues = watch();

  const handleAddFaq = () => {
    const faqs = formValues.faqs || [];

    if (faqs.length >= 5) {
      dispatch(
        showToast({
          title: "Error!",
          message: "You can only add up to 5 FAQs.",
          theme: "error",
        })
      );
      return;
    }
    if (faqs.length === 0) {
      append({ question: "", answer: "" });
      return;
    }
    const lastFaq = faqs[faqs.length - 1];
    if (!lastFaq.question || !lastFaq.answer) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Must fill the previous FAQ before adding a new one.",
          theme: "error",
        })
      );
      return;
    }
    append({ question: "", answer: "" });
  };

  const handleAddCustamization = () => {
    // debugger;
    const customization = getValues("customization") || [];

    if (customization.length >= 5) {
      dispatch(
        showToast({
          title: "Error!",
          message: "You can only add up to 5 customization options.",
          theme: "error",
        })
      );
      return;
    }

    if (
      customization.length > 0 &&
      !customization[customization.length - 1]?.trim()
      // !customization[customization.length - 1]?.value?.trim()
    ) {
      dispatch(
        showToast({
          title: "Error!",
          message:
            "Must fill the previous customization before adding a new one.",
          theme: "error",
        })
      );
      return;
    }
    setValue("customization", [...customization, ""]);
  };

  const removeField = (index: number) => {
    if (Array.isArray(customization)) {
      const newFields = [...customization];
      newFields.splice(index, 1);
      setValue("customization", newFields);
    }
  };

  const handleAddCertificates = () => {
    const certificates = getValues("certificates") || [];

    if (certificates.length >= 5) {
      dispatch(
        showToast({
          title: "Error!",
          message: "You can only add up to 5 certifications options.",
          theme: "error",
        })
      );
      return;
    }

    if (
      certificates.length > 0 &&
      !certificates[certificates.length - 1]?.name?.trim() &&
      !certificates[certificates.length - 1]?.src?.trim()
    ) {
      dispatch(
        showToast({
          title: "Error!",
          message:
            "Must fill the previous certification details before adding a new one.",
          theme: "error",
        })
      );
      return;
    }

    appendCertificates({});
  };

  const onSubmit = async (
    data: additionalDetailsFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        await updateAdditionalDetails({
          id: id,
          ...data,
          skipCacheUpdate,
        }).unwrap();
        useClearLocalStorageOnExit();
        localStorage.removeItem("pt_ad");
        if (
          currentStepperStatus[ProductStageKey.AdditionalDetails] === "active"
        ) {
          if (!skipCacheUpdate) {
            dispatch(setShowSuccessModel(true));
          }
          setTimeout(() => {
            dispatch(setShowSuccessModel(false));
            setTimeout(() => {
              router.push(`./${id}`);
            }, 300);
          }, 1500);
        } else {
          router.push(`./${id}`);
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

  const handleSaveAndContinue = async (data: additionalDetailsFormValue) => {
    try {
      await onSubmit(data);
      router.push("./");
      localStorage.removeItem("pt_ad");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };
  const requestBody = useMemo(() => {
    return { lan: "en", max_length: 250 };
  }, []);

  const keyWordRequestBody = useMemo(() => {
    return { lan: "en", max_length: 8 };
  }, []);

  const setFaq = (description: any) => {
    const newFaqs = Array.isArray(description) ? description.slice(0, 5) : [];
    setValue("faqs", newFaqs); // Optional if you want to update the form state
    replace(newFaqs);
  };

  const setKeyWord = (description: any[]) => {
    const productKeyword = Array.isArray(description) ? [...description] : [];
    // setValue("productKeyword", productKeyword); // Optional if you want to update the form state
    // replace(newFaqs);
    setProductKeyWord(productKeyword);
  };

  const { regenerate: regenerateFaq } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-description/${id}?page=product-faq`,
    storageKey: "pt_qa",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.productKeyword
      ? formValues.productKeyword.join(",")
      : "",
    max_length: 3,
    setIsLoading: setFaqIsLoading,
    setDescription: setFaq,
    requestBody: requestBody,
    value: "faq",
  });

  const { regenerate: regenerateProductKeyWord } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-ai-product-keyword/${id}`,
    storageKey: "Prod_kw",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: "",
    max_length: 13,
    setIsLoading: setKeywordIsLoading,
    setDescription: setKeyWord,
    requestBody: keyWordRequestBody,
    value: "keywords",
  });
  const t = useTranslations("salesProduct.additionalDetails");
  const productGrpItemTemplate = (option: any) => {
    if (option._id === "add_new") {
      return (
        <div className="add-custom-block">
          <PlusIcon />
          <span className="p-dropdown-item-label a-c-b-i-txt">
            {t("fields.productGroup.addNewGroup")}
          </span>
        </div>
      );
    }
    return <span className="p-dropdown-item-label">{option.groupName}</span>;
  };
  // function seQueryStrings(search: string): void {
  //   throw new Error("Function not implemented.");
  // }
  const currentKeywords = getValues("productKeyword") || [];

  // useEffect(() => {
  //   console.log("errors", errors);
  // }, [errors]);

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <FormTitle variant={"h1"} text={t("title")} >
            <ShippingDetailsIcons />
          </FormTitle>
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group f-g-horiz">
              <label className="f-g-label mr-15px" htmlFor="customizeAvail">
                {t("fields.customizationAvailability.label")}{" "}
                <span className="f-g-label-dim">
                  ({t("fields.customizationAvailability.optionalLabel")} )
                </span>
              </label>
              <Controller
                name="isCustomizable"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <ToggleInput
                    name="isCustomizable"
                    checked={field.value}
                    onChange={(e) => {
                      const value = e.target.checked;
                      field.onChange(value);
                      if (value) {
                        setValue("customization", [""]);
                      } else {
                        setValue("customization", undefined);
                      }
                    }}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.isCustomizable && (
                <span className="error-txt">
                  {errors.isCustomizable.message}
                </span>
              )}
            </div>
            {formValues.isCustomizable && (
              <div className="forms-group">
                <label className="f-g-label" htmlFor="">
                  {t("fields.specifyCustomization.label")}{" "}
                  <span className="f-g-label-dim">
                    ( {t("fields.specifyCustomization.optionalLabel")})
                  </span>
                </label>

                {formValues.isCustomizable &&
                  customization &&
                  customization.length > 0 &&
                  customization.map((_field, index) => (
                    <React.Fragment key={index}>
                      <div className="loop-block" key={index}>
                        <Controller
                          control={control}
                          name={`customization.${index}`}
                          render={({ field }) => (
                            <InputField
                              {...field}
                              className="wid-100"
                              placeholder={t(
                                "fields.specifyCustomization.placeholder"
                              )}
                            />
                          )}
                        />
                        {customization.length > 1 && (
                          <ButtonIcon
                            className="b-c-i-rounded b-c-i-danger"
                            onClick={() => removeField(index)}
                          >
                            <TrashTableIcon />
                          </ButtonIcon>
                        )}
                      </div>
                      {errors.customization?.[index] && (
                        <span className="error-txt">
                          {errors.customization[index]?.message}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                {errors.customization && (
                  <span className="error-txt">
                    {errors.customization.message}
                  </span>
                )}
                <div className="add-slap-btn">
                  <ButtonIconRight
                    name={t("fields.specifyCustomization.addButton")}
                    className={"btn-c-secondary btn-plain-txt"}
                    onClick={handleAddCustamization}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div>
              </div>
            )}

            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.productKeywords.label")}{" "}
                <span className="f-g-label-dim">
                  ({t("fields.productKeywords.optionalLabel")})
                </span>
              </label>

              <Controller
                name="productKeyword"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  return (
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
                      placeholder={t("fields.productKeywords.placeholder")}
                    />
                  );
                }}
              />
              {productKeyword.length > 0 && (
                <div className="more-attributes-block margin-t-unset">
                  <div className="m-a-b-btn-group">
                    {productKeyword.map((item, index) => {
                      const isAlreadyAdded = currentKeywords.includes(item);

                      return (
                        <ButtonIconLeftOutline
                          name={item}
                          key={index}
                          disabled={isAlreadyAdded}
                          className="bg-outline-grey btn-attributes light-blue"
                          onClick={() => {
                            const updatedKeywords = [...currentKeywords, item];
                            setValue("productKeyword", updatedKeywords);

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
              {errors.productKeyword && (
                <span className="error-txt">
                  {errors.productKeyword.message}
                </span>
              )}
            </div>
            {errors?.productKeyword && (
              <span className="error-txt">
                {errors?.productKeyword.message}
              </span>
            )}
            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.brand.label")}{" "}
                <span className="f-g-label-dim">
                  {t("fields.brand.optionalLabel")}{" "}
                </span>
              </label>
              <Controller
                name="brandName"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("fields.brand.placeholder")}
                  />
                )}
              />

              {errors.brandName && (
                <span className="error-txt">{errors.brandName.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="productGroup">
                {t("fields.productGroup.label")}
              </label>
              <Controller
                name="productGroup"
                control={control}
                render={({ field }) => (
                  <Select
                    options={productGroupOptions}
                    panelClassName={"fixed-label-bottom"}
                    optionLabel="groupName"
                    optionValue="_id"
                    placeholder={t("fields.productGroup.placeholder")}
                    value={field.value}
                    onChange={(selectedValue) => {
                      if (selectedValue === "add_new") {
                        dispatch(setShowProductGroupDialog(true));
                      } else {
                        field.onChange(selectedValue);
                      }
                    }}
                    filter
                    filterBy="groupName"
                    itemTemplate={productGrpItemTemplate}
                    emptyMessage={
                      <div
                        className="add-custom-block"
                        onClick={() => {
                          dispatch(setShowProductGroupDialog(true));
                        }}
                      >
                        <PlusIcon />
                        <span className="p-dropdown-item-label a-c-b-i-txt">
                          {t("fields.productGroup.addNewGroup")}
                        </span>
                      </div>
                    }
                    onFilterChange={(search) => setQueryString(search)}
                    appendTo={"self"}
                  />
                )}
              />
              {errors.productGroup && (
                <span className="error-txt">{errors.productGroup.message}</span>
              )}
              <ProductGroupDailog />
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {t("fields.uploadProductVideo.label")}
                <span className="f-g-label-dim">
                  ({t("fields.uploadProductVideo.optionalLabel")})
                </span>
              </label>
              <Controller
                name="productVideo"
                control={control}
                render={({ field: videoField }) => (
                  <Controller
                    name="youtubeUrl"
                    control={control}
                    render={({ field: youtubeField }) => (
                      <DndVideoUpload
                        // value={videoField.value || ""}
                        // onChange={videoField.onChange}
                        value={
                          Array.isArray(videoField.value)
                            ? videoField.value[0] // if it's an array, pass the first one
                            : videoField.value || undefined // if it's a single object or null
                        }
                        onChange={(file) => {
                          // force value to always be a single UploadedImage
                          if (Array.isArray(file)) {
                            videoField.onChange(file[0]);
                          } else {
                            videoField.onChange(file);
                          }
                        }}
                        youtubeUrl={youtubeField.value || ""}
                        onYoutubeUrlChange={youtubeField.onChange}
                      />
                    )}
                  />
                )}
              />

              {errors.productVideo && (
                <span className="error-txt">{errors.productVideo.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="uploadProductVideo">
                {t("fields.certifications.label")}{" "}
              </label>

              <div className="add-certifications-block-group">
                {certificatesFields.map((certificate, index) => (
                  <div className="loop-block" key={certificate.id || index}>
                    <div className="add-certifications-block">
                      <Controller
                        name={`certificates.${index}.name`}
                        control={control}
                        render={({ field: field1 }) => (
                          <>
                            <InputField
                              {...field1}
                              placeholder={t(
                                "fields.certifications.namePlaceholder"
                              )}
                            />
                            {errors?.certificates?.[index]?.name && (
                              <span className="error-txt">
                                {errors.certificates[index].name.message}
                              </span>
                            )}
                            <Controller
                              name={`certificates.${index}`}
                              control={control}
                              render={({ field }) => (
                                <DndImageUpload
                                  value={
                                    Array.isArray(field.value)
                                      ? field.value[0] // if it's an array, pass the first one
                                      : field.value || undefined // if it's a single object or null
                                  }
                                  onChange={(file) => {
                                    const newFile = Array.isArray(file)
                                      ? file[0]
                                      : file;

                                    if (
                                      newFile &&
                                      typeof newFile === "object"
                                    ) {
                                      field.onChange({
                                        name: field1.value,
                                        src: newFile.src,
                                        alt: newFile.alt || "",
                                        exten: newFile.exten,
                                        size: newFile.size,
                                      });
                                    }
                                  }}
                                  single={true}
                                  allowedFileTypes={["application/pdf"]}
                                  placeHolder={t(
                                    "fields.certifications.placeholder"
                                  )}
                                // maxHeight={900}
                                // maxWidth={500}
                                />
                              )}
                            />
                            {errors?.certificates?.[index]?.src && (
                              <span className="error-txt">
                                {errors.certificates[index].src.message}
                              </span>
                            )}
                          </>
                        )}
                      />
                    </div>
                    {certificatesFields.length > 1 && (
                      <ButtonIcon
                        className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                        onClick={() => removeCertificates(index)}
                      >
                        <TrashTableIcon />
                      </ButtonIcon>
                    )}
                  </div>
                ))}

                <div className="add-option-block margin-l-auto">
                  <ButtonIconRight
                    name={t("fields.certifications.addLabel")}
                    className={"btn-c-secondary btn-plain-txt"}
                    onClick={handleAddCertificates}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>

            {/* 
            <div className="add-slap-btn">
              
            </div> */}
            <div className="forms-group">
              <div className="f-g-label-flex">
                <label className="f-g-label" htmlFor="">
                  {t("fields.faqs.label")}
                  <span className="f-g-label-dim">
                    ( {t("fields.faqs.optionalLabel")})
                  </span>
                </label>
                <button
                  type="button"
                  onClick={regenerateFaq}
                  className="btn-comp black-icon-grey-txt"
                >
                  <AiSuggestionsIcon />
                  <span className="b-i-txt">
                    {faqLoading
                      ? `${t("fields.faqs.aiGenerate")}`
                      : `${t("fields.faqs.aiSuggest")}`}
                  </span>
                </button>
              </div>
              <div className="add-faq-block">
                {fields.map((field, index) => (
                  <div className="loop-block" key={index}>
                    <div
                      className={`add-faq-comp ${faqLoading ? "ai-loading" : ""
                        } wid-100`}
                      key={field.id}
                    >
                      <Controller
                        control={control}
                        name={`faqs.${index}.question`}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            name={`faqs.${index}.question`}
                            placeholder={t("fields.faqs.questionPlaceholder")}
                            className="forms-input-border-bottom"
                          />
                        )}
                      />
                      {errors.faqs?.[index]?.question && (
                        <span className="error-txt">
                          {errors.faqs?.[index].question.message}
                        </span>
                      )}
                      <Controller
                        control={control}
                        name={`faqs.${index}.answer`}
                        render={({ field }) => (
                          <FaqTextArea
                            {...field}
                            placeholder={t("fields.faqs.answerPlaceholder")}
                            className="forms-input-border-bottom"
                            register={register}
                          />
                        )}
                      />
                      {errors.faqs?.[index]?.answer && (
                        <span className="error-txt">
                          {errors.faqs[index].answer.message}
                        </span>
                      )}
                    </div>

                    {fields.length > 1 && (
                      <ButtonIcon
                        className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                        onClick={() => remove(index)}
                      >
                        <TrashTableIcon />
                      </ButtonIcon>
                    )}
                  </div>
                ))}
                {/* <div className="add-option-block margin-l-auto">
                  <ButtonIconRight
                    name={"Add FAQ"}
                    className="bg-outline-grey btn-attributes"
                    onClick={handleAddFaq}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div> */}
                {fields.length < 5 && (
                  <div className="add-option-block margin-l-auto">
                    <ButtonIconLeftOutline
                      name={t("fields.faqs.addFAQ")}
                      className="bg-outline-grey btn-attributes"
                      onClick={handleAddFaq}
                    >
                      <PlusIcon />
                    </ButtonIconLeftOutline>
                  </div>
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
                (currentStepperStatus?.[ProductStageKey.AdditionalDetails] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.AdditionalDetails] ===
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
                (currentStepperStatus?.[ProductStageKey.AdditionalDetails] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.AdditionalDetails] ===
                  "active")
              )
            }
          >
            <RightArrowIcon />
          </ButtonIconRight>
        </div>
      </div>
      <SuccessModel text="New product added successfully!" />
    </div>
  );
};

export default AdditionalDetails;
