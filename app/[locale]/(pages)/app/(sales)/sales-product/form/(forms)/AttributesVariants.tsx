import { UploadedImage } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/ProductInformation";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  BrandingAndMedia,
  PlusIcon,
  RightArrowIcon,
  SearchIcon,
  TrashTableIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import AddAttributeDialog from "@/app/[locale]/_components/OverLay/AddAttributeDialog";
import OverLaySelector from "@/app/[locale]/_components/OverLay/OverLaySelector";
import ChipInputDropDown from "@/app/[locale]/_components/StoreFront/Forms/ChipInputDropDown";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import VariantAttributeItem from "@/app/[locale]/_components/StoreFront/Forms/VariantAttributeItem";
import VariantsTable from "@/app/[locale]/_components/StoreFront/Forms/VariantsTable";
import useAiGenerator from "@/app/[locale]/_hooks/useGeneratewithAi";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import {
  generateVariants,
  groupByAttribute,
  validateVariantsAttributes,
} from "@/app/[locale]/_hooks/utility";
import { ProductPricing } from "@/app/[locale]/_interface/SalesProductInterface";
import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductFormDetailsQuery,
  useUpdateAttributesVariantsMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import {
  setShowAddAttributeDialog,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { attributesVariantSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { shallowEqual } from "react-redux";

export interface AttributeValue {
  name: string;
  isSelected: boolean;
  isRemoved: boolean;
}

export interface Attribute {
  key: string;
  values: AttributeValue[];
  isSuggested: boolean;
  isValid: number;
}

export interface VariantAttribute {
  tempKey?: string;
  key: string;
  values: string[];
  isEditing?: boolean;
}
export interface BaseVariant {
  _id?: string;
  index?: number;
  displayName?: string;
  variantName: string;
  variantImg: UploadedImage[];
  attributes: Record<string, string>;
  available: boolean;
}

// When available is false
export interface UnavailableVariant extends BaseVariant {
  available: false;
  pricing?: any;
  skuCode?: string;
  minOrderQuantity?: number;
  moqUnit?: string;
}

// When available is true
export interface AvailableVariant extends BaseVariant {
  available: true;
  pricing: ProductPricing; // assuming this matches your `pricingSchema`
  skuCode?: string;
  minOrderQuantity: number;
  moqUnit: string;
}

// Final discriminated union
export type Variant = AvailableVariant | UnavailableVariant;

export interface attributsVariantsFormValue {
  attributes: Attribute[];
  variantAttributes: VariantAttribute[];
  variants: Variant[];
}

const AttributesVariants = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const t = useTranslations("salesProduct.specifications");
  const common = useTranslations("common");

  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>,
    shallowEqual
  );

  const { pricingType } = useAppSelector(
    (state: RootState) => state.preview?.pricing || {}
  );

  const [updateAttributesVariants] = useUpdateAttributesVariantsMutation();
  const [groupBy, setGroupBy] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [groupedVariants, setGroupedVariants] = useState<
    Record<string, Variant[]>
  >({});
  const [groupSearch, setGroupSearch] = useState("");
  const [isActive, setIsActive] = useState(false);

  const { data, isSuccess, refetch } = useGetProductFormDetailsQuery(
    { id: id ?? "", stage: ProductStageKey.Specification },
    {
      skip: !(
        id &&
        currentStepperStatus[ProductStageKey.Specification] === "completed"
      ),
    }
  );
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<attributsVariantsFormValue>({
    defaultValues: {
      attributes: [],
      variantAttributes: [],
      variants: [],
    },
    mode: "all",
    resolver: zodResolver(attributesVariantSchema),
  });

  const setAttributes = (description: any) => {
    setValue("attributes", rewriteAiResponse(description));
  };
  const rewriteAiResponse = (data: VariantAttribute[]) => {
    const attributes = data
      ?.filter((item) => {
        if (
          typeof item.key === "string" &&
          item.key !== "" &&
          Array.isArray(item?.values)
        ) {
          return true;
        }
        return false;
      })
      .map((item: VariantAttribute, index) => {
        const key = item.key;
        const values = (item?.values || [])
          .filter(
            (val) =>
              val !== null &&
              val !== undefined &&
              !(typeof val === "string" && val.trim() === "")
          )
          .map((val) => ({
            name: String(val), // Convert both number and string to string
            isSelected: false,
            isRemoved: false,
          }));
        const isSuggested = index < 7 ? false : true;
        const isValid = 0;
        return { key, values, isSuggested, isValid };
      });
    return attributes;
  };
  const formValue = watch();

  useEffect(() => {
    if (
      id &&
      currentStepperStatus[ProductStageKey.Specification] === "completed"
    ) {
      refetch();
    }
  }, [id, currentStepperStatus[ProductStageKey.Specification]]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        attributes: data.data.attributes || [],
        variantAttributes: data.data.variantAttributes || [],
        variants: data.data.variants || [],
      });
      if (data?.data?.variantAttributes?.length > 0) {
        setGroupBy(data.data.variantAttributes[0].key);
      }
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (Object.keys(currentStepperStatus).length > 0) {
      setIsActive(
        currentStepperStatus?.[ProductStageKey.Specification] === "active"
      );
    }
  }, [currentStepperStatus]);

  useEffect(() => {
    if (isActive) {
      if (isActive) {
        fetchDescription();
      }
    }
  }, [isActive]);

  const requestBody = useMemo(() => {
    return { lan: "en", max_length: 10 };
  }, []);

  const { fetchDescription } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
      }sales/ai/get-ai-attribute/${id}`,
    storageKey: "prod=at",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: "",
    max_length: 7,
    setIsLoading,
    setDescription: setAttributes,
    requestBody,
    value: "attributes",
  });

  useEffect(() => {
    if (groupBy && formValue.variants.length > 0) {
      setGroupedVariants(
        groupByAttribute(formValue.variants, groupBy, groupSearch)
      );
    }
  }, [groupBy, formValue.variants, groupSearch]);

  // useEffect(() => {
  //   console.log("errors", errors);
  // }, [errors]);

  const { append: appendAttribute } = useFieldArray({
    control,
    name: "attributes",
  });

  const { append: appendVariantAttribute } = useFieldArray({
    control,
    name: "variantAttributes",
  });

  const onSubmit = async (
    data: attributsVariantsFormValue,
    skipCacheUpdate = false
  ) => {
    if (id) {
      try {
        await updateAttributesVariants({
          id,
          ...data,
          skipCacheUpdate,
        }).unwrap();
        useClearLocalStorageOnExit();
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductStageKey.ProductDescription));
        }
      } catch (error) {
        console.log("Error", error);
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

  const handleAttributsubmit = (attributeName: string) => {
    const isExist = formValue.attributes.find(
      (item) => item.key.toLowerCase() === attributeName.toLowerCase()
    );
    if (isExist) {
      dispatch(
        showToast({
          title: "Error",
          message: "Attribute Already Exist",
          theme: "error",
        })
      );
      return;
    }
    appendAttribute({
      key: attributeName,
      values: [],
      isSuggested: false,
      isValid: 0,
    });
  };

  const handleOnAdd = (
    name: string,
    valueNameArray: string[],
    item: Attribute,
    index: number
  ) => {
    if (valueNameArray.includes(name.toLowerCase())) return;

    const newValues = [
      ...item.values,
      { name, isSelected: true, isRemoved: false },
    ];

    setValue(`attributes.${index}.values`, newValues);
    setValue(
      `attributes.${index}.isValid`,
      newValues.filter((v) => v.isSelected && !v.isRemoved).length
    );
  };

  const handleOnRemove = (
    value: AttributeValue,
    item: Attribute,
    index: number
  ) => {
    if (value.isRemoved) return;
    const newValues = item.values.map((v) =>
      v.name === value.name
        ? {
          ...v,
          isRemoved: true,
          isSelected: false,
        }
        : v
    );

    setValue(`attributes.${index}.values`, newValues);
    setValue(
      `attributes.${index}.isValid`,
      newValues.filter((v) => v.isSelected && !v.isRemoved).length
    );
  };

  const handleOnSelect = (
    value: AttributeValue,
    item: Attribute,
    index: number
  ) => {
    if (!value.isRemoved && value.isSelected) return;
    const newValues = item.values.map((v) =>
      v.name === value.name
        ? {
          ...v,
          isSelected: true,
          isRemoved: false,
        }
        : v
    );

    setValue(`attributes.${index}.values`, newValues);
    setValue(
      `attributes.${index}.isValid`,
      newValues.filter((v) => v.isSelected && !v.isRemoved).length
    );
  };

  const handleOnSelectOnDropdown = (
    value: AttributeValue,
    item: Attribute,
    index: number
  ) => {
    const newValues = item.values.map((v) => {
      if (v.name === value.name) {
        const newIsSelected = !v.isSelected;
        return {
          ...v,
          isSelected: newIsSelected,
          isRemoved: newIsSelected ? false : v.isRemoved,
        };
      }
      return v;
    });

    setValue(`attributes.${index}.values`, newValues);
    setValue(
      `attributes.${index}.isValid`,
      newValues.filter((v) => v.isSelected && !v.isRemoved).length
    );
  };

  const handleSaveAndContinue = async (data: attributsVariantsFormValue) => {
    try {
      await onSubmit(data, true);
      router.push("./");
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  const handleRemoveAttributes = (index: number) => {
    const newAttributes = formValue?.attributes.filter((_, i) => i !== index);
    setValue("attributes", newAttributes);
  };

  return (
    <div className="center-form-block c-f-b-padding'">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <div className="title-subtxt-block">
            <FormTitle variant={"h1"} text={t("title")} >
              <BrandingAndMedia />
            </FormTitle>
            <Typography variant="h2" className="title-subtxt">
              {t("helper")}
            </Typography>
          </div>
        </div>
        <div className="c-f-b-t-body">
          <form className="form-block-main">
            <div
              className={`forms-block horiz-form-label-width ai-loading-hidden-block ${isLoading ? "ai-loading-block" : ""
                }`}
            >
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => (
                  <div className="forms-group f-g-horiz" key={i}>
                    <label className="f-g-label" htmlFor="Color">
                      Color
                    </label>
                    <InputField />
                  </div>
                ))
                : formValue?.attributes.map((item, index) => {
                  if (!item.isSuggested) {
                    const valueNameArray = item.values.map((val) =>
                      val?.name?.toLocaleLowerCase()
                    );
                    return (
                      <div className="forms-group f-g-horiz" key={index}>
                        <label className="f-g-label">{item.key}</label>
                        <ChipInputDropDown
                          item={item}
                          index={index}
                          handleOnAdd={(name) =>
                            handleOnAdd(name, valueNameArray, item, index)
                          }
                          handleOnRemove={(value) =>
                            handleOnRemove(value, item, index)
                          }
                          handleOnSelect={(attriValue) =>
                            handleOnSelect(attriValue, item, index)
                          }
                          handleOnSelectOnDropdown={(value) =>
                            handleOnSelectOnDropdown(value, item, index)
                          }
                        />
                        {formValue.attributes.length > 1 && (
                          <ButtonIcon
                            className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                            onClick={() => handleRemoveAttributes(index)}
                          >
                            <TrashTableIcon />
                          </ButtonIcon>
                        )}
                      </div>
                    );
                  }
                })}
            </div>
            <div className="forms-block">
              <div className="more-attributes-block">
                <div className="m-a-b-header-content">
                  <Typography variant="h3" className="m-a-b-txt m-a-b-title">
                    {t("fields.attributes.subtitle")}
                  </Typography>
                  <Typography variant="span" className="m-a-b-txt m-a-b-subtxt">
                    {t("fields.attributes.helper")}
                  </Typography>
                </div>
                <div className="m-a-b-btn-group">
                  {formValue.attributes.map((item, index) => {
                    if (item.isSuggested) {
                      return (
                        <ButtonIconLeftOutline
                          name={item.key}
                          className={
                            "bg-outline-grey btn-attributes light-blue"
                          }
                          key={index}
                          onClick={() => {
                            setValue(`attributes.${index}.isSuggested`, false);
                          }}
                        >
                          <PlusIcon />
                        </ButtonIconLeftOutline>
                      );
                    }
                  })}
                  <ButtonIconLeftOutline
                    name={t("fields.attributes.btn")}
                    className={"bg-outline-grey btn-attributes"}
                    onClick={() => dispatch(setShowAddAttributeDialog(true))}
                  >
                    <PlusIcon />
                  </ButtonIconLeftOutline>
                </div>
              </div>
            </div>
            <hr />
            <div className="forms-block types-block">
              <Typography variant="h3" className="t-b-title">
                {t("fields.variants.title")}
              </Typography>
              {formValue.variantAttributes.length > 0 &&
                formValue.variantAttributes.map((item, index) => (
                  <VariantAttributeItem
                    key={index}
                    item={item}
                    index={index}
                    formValue={formValue}
                    setValue={setValue}
                    getValues={getValues}
                    dispatch={dispatch}
                    groupBy={groupBy}
                    setGroupBy={setGroupBy}
                  />
                ))}
              {formValue.variantAttributes.length < 3 && (
                <OverLaySelector
                  title={t("fields.variants.btn")}
                  options={formValue.attributes.filter(
                    (item) => item.isValid > 0
                  )}
                  optionLable="key"
                  onSelect={(value) => {
                    const isExist = formValue.variantAttributes.find(
                      (item) =>
                        item.key.toLowerCase() === value.key.toLowerCase()
                    );
                    if (isExist) {
                      dispatch(
                        showToast({
                          title: "Error",
                          message: "Attribute Already Exist",
                          theme: "error",
                        })
                      );
                      return;
                    }
                    setValue("variantAttributes", [
                      ...formValue.variantAttributes,
                      {
                        key: value.key,
                        values: value.values.reduce(
                          (acc: string[], val: AttributeValue) => {
                            if (!val.isRemoved && val.isSelected) {
                              acc.push(val.name);
                            }
                            return acc;
                          },
                          []
                        ),
                        isEditing: false,
                      },
                    ]);
                    const updatedVariantAttribute =
                      getValues("variantAttributes");
                    setValue(
                      "variants",
                      generateVariants(updatedVariantAttribute, pricingType)
                    );
                    if (!groupBy) {
                      setGroupBy(updatedVariantAttribute[0].key);
                    }
                  }}
                  footerLable={t("fields.variants.custom_btn")}
                  footerFunc={() => {
                    appendVariantAttribute({
                      key: "",
                      values: [],
                      isEditing: true,
                    });
                  }}
                />
              )}
              {validateVariantsAttributes(formValue.variantAttributes).length >
                0 && (
                  <div className="variants-table-comp">
                    <div className="v-t-c-header">
                      <div className="forms-group f-g-horiz">
                        <label className="f-g-label" htmlFor="Group by">
                          {t("fields.variants.fields.group_by.label")}
                        </label>
                        <Select
                          value={groupBy}
                          options={formValue.variantAttributes}
                          optionLabel="key"
                          optionValue="key"
                          onChange={(value) => setGroupBy(value)}
                        />
                      </div>
                      <div className="icon-input-comp invert">
                        <SearchIcon />
                        <input
                          type="text"
                          placeholder={t(
                            "fields.variants.fields.search_product.placeholder"
                          )}
                          onChange={(e) => setGroupSearch(e.target.value)}
                          className="forms-input"
                        />
                      </div>
                    </div>
                    <VariantsTable
                      groupedVariant={groupedVariants}
                      setValue={setValue}
                      getValues={getValues}
                      register={register}
                      trigger={trigger}
                      errors={errors}
                    />
                  </div>
                )}
            </div>
            <AddAttributeDialog onSubmit={handleAttributsubmit} />
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
                (currentStepperStatus?.[ProductStageKey.Specification] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.Specification] ===
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
                (currentStepperStatus?.[ProductStageKey.Specification] ===
                  "completed" ||
                  currentStepperStatus?.[ProductStageKey.Specification] ===
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

export default AttributesVariants;
