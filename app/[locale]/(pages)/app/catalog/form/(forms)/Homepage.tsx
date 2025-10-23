"use client";
// -------------------------------------------
// React & Hooks
// -------------------------------------------
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

// -------------------------------------------
// Form Management
// -------------------------------------------
import { catalogHomepageSchema } from "@/app/[locale]/_validationSchema/catalog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

// -------------------------------------------
// Translations & Routing
// -------------------------------------------
import { useTranslations } from "next-intl";

// -------------------------------------------
// Redux Store
// -------------------------------------------
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";

// -------------------------------------------
// API Hooks
// -------------------------------------------
import {
  useCreateNewCatalogFormMutation,
  useGetCatalogFormDetailsQuery,
  useUpdateCatalogFormMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";
import { useLazyGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";

// -------------------------------------------
// Component: UI Elements
// -------------------------------------------
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import { Messages } from "primereact/messages";

// -------------------------------------------
// Component: Buttons & Icons
// -------------------------------------------
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  InfoIcon,
  RightArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";

// -------------------------------------------
// Types
// -------------------------------------------
import { FreeCatalogStageKey } from "@/app/[locale]/_models/StoreFront";
import { setDomain } from "@/app/[locale]/_store/reducers/location_store";
// -------------------------------------------
// Interfaces
// -------------------------------------------
export interface CategoriesListInterface {
  _id: string;
  uniqueId: string;
  name: string;
  liveUrl?: string;
}
export interface CatalogHomepageFormValues {
  ownerName: string;
  businessType: string;
  businessTypeSpecific: string[];
  industry: CategoriesListInterface;
}

const Homepage = () => {
  const t = useTranslations("freeCatalog");
  const common = useTranslations("common");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const [options, setOptions] = useState<CategoriesListInterface[]>([]);
  const [triggerFetch, { isFetching }] = useLazyGetCategoryListQuery();
  const fetchedOnce = useRef(false);
  const fetchCategories = async (search = "") => {
    const res = await triggerFetch({ search });
    if ("data" in res && res.data?.data) {
      setOptions(res.data.data);
      fetchedOnce.current = true;
    }
  };
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CatalogHomepageFormValues>({
    defaultValues: {
      ownerName: "",
      businessType: "",
      businessTypeSpecific: [],
      industry: {},
    },
    mode: "onBlur",
    resolver: zodResolver(catalogHomepageSchema),
  });
  const formValues = watch();

  const {
    data: apiData,
    isLoading,
    isError,
  } = useGetCatalogFormDetailsQuery({
    stage: FreeCatalogStageKey.homepage || "homepage",
  });
  const [createNewCatalog] = useCreateNewCatalogFormMutation();
  const [updateCatalog] = useUpdateCatalogFormMutation();
  const BusinessTypeData: EmployeeRangeInterface[] = [
    { name: "Manufacturer", value: "Manufacturer" },
    { name: "Distributor / Wholesaler", value: "Distributor / Wholesaler" },
    { name: "Trading Company", value: "Trading Company" },
    { name: "Retailer", value: "Retailer" },
    { name: "Importer / Exporter", value: "Importer / Exporter" },
  ];
  useEffect(() => {
    if (apiData?.data && Object.keys(apiData.data).length > 0) {
      reset({
        ownerName: apiData.data.formData.ownerName || "",
        businessType: apiData.data.formData.businessType || "",
        businessTypeSpecific: apiData.data.formData.businessTypeSpecific || [],
        industry: apiData.data.formData.industry || "",
      });
    } else {
      // Reset to default if no data available
      reset({
        ownerName: "",
        businessType: "",
        businessTypeSpecific: [],
        industry: {},
      });
    }
    dispatch(setDomain(apiData?.data?.subDomain || ""));
  }, [apiData, reset]);
  useEffect(() => {
    fetchCategories();
  }, []);
  const showAlertMessage = (msgsRef: React.RefObject<Messages | null>) => {
    if (msgsRef.current) {
      msgsRef.current.clear();
      msgsRef.current.show([
        {
          sticky: true,
          severity: "info",
          icon: <InfoIcon className={"alert-icon"} />,
          detail: t("homepage.alert.productVisible"),
        },
      ]);
    }
  };

  const businessTypeOpt = [
    {
      id: 1,
      title: t("businessTypes.unregister.title"),
      subtitle: t("businessTypes.unregister.subtitle"),
      value: "unregister",
    },
    {
      id: 2,
      title: t("businessTypes.register.title"),
      subtitle: t("businessTypes.register.subtitle"),
      value: "register",
    },
    {
      id: 3,
      title: t("businessTypes.nonprofit.title"),
      subtitle: t("businessTypes.nonprofit.subtitle"),
      value: "nonprofit",
    },
  ];

  // Function to get display label for business type based on database value
  const getBusinessTypeLabel = (businessTypeValue: string): string => {
    const businessType = businessTypeOpt.find(
      (option) => option.value === businessTypeValue
    );
    return businessType ? businessType.title : businessTypeValue;
  };

  interface EmployeeRangeInterface {
    name: string;
    value: string;
  }

  interface IndustryListInterface {
    name: string;
    value: string;
  }
  const industryList = [
    {
      name: "Apparel & Fashion",
      value: "apparel & fashion",
    },

    {
      name: "Agriculture",
      value: "agriculture",
    },
    {
      name: "Machinery",
      value: "machinery",
    },
    {
      name: "Electronics",
      value: "electronics",
    },
    {
      name: "Services",
      value: "services",
    },
    {
      name: "Others",
      value: "others",
    },
  ];
  const onSubmit = async (data: CatalogHomepageFormValues) => {
    if (
      currentStepperStatus[FreeCatalogStageKey.homepage] &&
      currentStepperStatus[FreeCatalogStageKey.homepage] === "active"
    ) {
      return addNewCatalog(data);
    }
    if (
      currentStepperStatus[FreeCatalogStageKey.homepage] &&
      currentStepperStatus[FreeCatalogStageKey.homepage] === "completed"
    ) {
      return updateHomepage(data);
    }
    return;
  };
  const addNewCatalog = async (data: CatalogHomepageFormValues) => {
    try {
      const payload = { ...data };
      const response = await createNewCatalog({
        payload,
        stage: FreeCatalogStageKey.homepage,
      }).unwrap();
      if (response?.error) {
        return dispatch(
          showToast({
            title: "Error!",
            message: "Adding Homepage Data Failed",
            theme: "error",
          })
        );
      }
      dispatch(setCurrentForm(FreeCatalogStageKey.products));
      return dispatch(
        showToast({
          title: "Success!",
          message: "Adding Homepage Data",
          theme: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Adding Homepage Data Failed",
          theme: "error",
        })
      );
      console.log("Adding New Catalog Error", error);
    }
    return;
  };
  const updateHomepage = async (data: CatalogHomepageFormValues) => {
    try {
      const payload = { ...data };
      const response = await updateCatalog({
        payload,
        stage: FreeCatalogStageKey.homepage,
      }).unwrap();
      if (response?.error) {
        return dispatch(
          showToast({
            title: "Error!",
            message: "Updating Homepage Data Failed",
            theme: "error",
          })
        );
      }
      dispatch(setCurrentForm(FreeCatalogStageKey.products));
      // return dispatch(
      //   showToast({
      //     title: "Success!",
      //     message: "Homepage Data Updated",
      //     theme: "success",
      //   })
      // );
    } catch (error) {
      console.log("Updating Homepage Error", error);
    }
    return;
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="center-form-block">
      <div className="c-f-b-top">
        <div className="c-f-b-t-header">
          <FormTitle variant={"h1"} text={t("homepage.title")} />
          {/* <AlertMessage showMessage={showAlertMessage} /> */}
        </div>
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">
                {t("homepage.fields.ownerName.label")}
              </label>

              <Controller
                name="ownerName"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("homepage.fields.ownerName.placeholder")}
                    onBlur={() => {
                      //   triggerAiCategory();
                      //   field.onBlur();
                    }}
                  />
                )}
              />
              {errors.ownerName && (
                <span className="error-txt">{errors.ownerName.message}</span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="businessType">
                {t("homepage.fields.businessType.label")}{" "}
              </label>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <Select
                    options={businessTypeOpt}
                    value={field.value}
                    onChange={field.onChange}
                    optionLabel="title"
                    // filter={true}
                    // filterBy="name"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                    placeholder={t("homepage.fields.businessType.placeholder")}
                  />
                )}
              />
              {errors.businessType && (
                <span className="error-txt">
                  {t("homepage.fields.businessType.placeholder")}{" "}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {" "}
                {t("homepage.fields.businessTypeSpecific.label")}
              </label>
              <Controller
                name="businessTypeSpecific"
                control={control}
                rules={{ required: "Business Type is required" }}
                render={({ field }) => (
                  <MultiSelectInputs
                    options={BusinessTypeData}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder={t(
                      "homepage.fields.businessTypeSpecific.placeholder"
                    )}
                    selectAllLabel={`${common("selectAll")}`}
                  />
                )}
              />
              {errors.businessTypeSpecific && (
                <span className="error-txt">
                  {errors.businessTypeSpecific.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label" htmlFor="industry">
                {t("homepage.fields.industry.label")}
              </label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <Select
                    options={options}
                    value={
                      options.find((opt) => opt?._id === field.value?._id) ||
                      null
                    }
                    onChange={(selected) => field.onChange(selected)}
                    optionLabel="name"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                    placeholder={t("homepage.fields.industry.placeholder")}
                  />
                )}
              />
              {errors.industry && (
                <span className="error-txt">
                  {errors.industry.name?.message ||
                    t("homepage.fields.industry.placeholder")}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="c-f-b-bottom">
        <div className="c-f-b-b-left"></div>
        <div className="c-f-b-b-right">
          <ButtonIconRight
            name={common("Continue")}
            onClick={() => {
              handleSubmit(onSubmit, (validationErrors) => {
                console.warn("Validation failed:", validationErrors);
              })();
            }}
            disabled={isSubmitting}
          >
            <RightArrowIcon />
          </ButtonIconRight>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
