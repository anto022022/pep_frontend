import Typography from "@/app/[locale]/_components/Base/Typography";
import BusinessDetailsViewPage from "@/app/[locale]/_components/BusinessProfileComponents/BusinessInformation/BusinessDetailsViewPage";
import Button from "@/app/[locale]/_components/Buttons/Button";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import Inputs from "@/app/[locale]/_components/form/Inputs";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import BusinessTypeCard from "@/app/[locale]/_components/OnBoarding/BusinessTypeCard";
import ChipInputs from "@/app/[locale]/_components/StoreFront/Forms/ChipInputs";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import {
  countryBasedStates,
  countryCodesInterface,
  EmployeeRangeInterface,
  FormData,
} from "@/app/[locale]/_interface/BusinessProfile";

import { CategoriesListInterface } from "@/app/[locale]/_interface/OnboardInterface";
import { BusinessTypeData, EmployeeRange } from "@/app/[locale]/_models/common";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateBusinessDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { useLazyGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import {
  setCountryCode,
  setCountryName,
} from "@/app/[locale]/_store/reducers/businessProfile_store";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { businessDetailSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import '@/app/[locale]/dev_styles.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useTranslations } from "next-intl";
import { FC, forwardRef, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface BusinessInformationInterface {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

const BusinessDetailsSection: FC<BusinessInformationInterface> = ({
  isEdit,
  updateEditStatus,
  onSuccess,
}) => {
  const t = useTranslations("businessDetails");
  const common = useTranslations("common");
  const dispatch = useAppDispatch();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      legalBusinessName: "",
      businessName: "",
      ownerName: "",
      businessTypeSpecific: [],
      businessAddress: {
        addressLine: "",
        city: {},
        state: {},
        pinCode: "",
        country: {
          code: "",
          name: "",
        },
      },
      phoneNumber: {},
      email: "",
      industry: {},
      establishment: "",
      employeeCount: "",
      mainProduct: [],
      shipAddress: false,
      businessType: "",
    },
    mode: "onBlur",
    resolver: zodResolver(businessDetailSchema),
  });
  let country = useAppSelector((state: any) => state.location);

  const businessProfileT = useTranslations(
    "businessProfile.businessInformation"
  );

  const businessType = [
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

  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );

  // Business Details(Get)
  const {
    data: businessDetailsInfo,
    isSuccess,
    refetch,
  } = useGetBusinessInformationQuery(
    {
      stage: "BusinessDetails",
    },
    {
      skip:
        currentStepperStatus[BusinessProfileStageKey.BusinessDetails] ===
        "pending",
    }
  );

  // business details update api
  const [updateBusinessDetails] = useUpdateBusinessDetailsMutation();

  const [triggerFetch] = useLazyGetCategoryListQuery();

  useEffect(() => {
    triggerFetch({ search: "" });
    fetchCategories();
  }, [triggerFetch]);

  const [countriesOptions, setCountriesOptions] = useState<{ name: string; code: string }[]>([]);
  const [options, setOptions] = useState<CategoriesListInterface[]>([]);
  const [selectedCountry, setSelectedCountry] =
    useState<countryCodesInterface | null>(null);
  const [selectedState, setSelectedState] = useState<countryBasedStates | null>(
    null
  );
  const [stateOptions, setStateOptions] = useState<countryBasedStates[]>([]);
  const [cityOptions, setCityOptions] = useState<countryBasedStates[]>([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<
    EmployeeRangeInterface[]
  >(BusinessTypeData);

  const getStateOptionsByCountryCode = (countryCode?: string) => {
    if (!countryCode) return [];

    return State?.getStatesOfCountry(countryCode)?.map((stateDetails) => ({
      name: stateDetails?.name ?? "",
      longitude: stateDetails?.longitude ?? null,
      latitude: stateDetails?.latitude ?? null,
      isoCode: stateDetails?.isoCode ?? "",
      countryCode: stateDetails?.countryCode ?? "",
    })) ?? [];
  };

  const getCityOptionsByState = (countryCode?: string, stateIsoCode?: string) => {
    if (!countryCode || !stateIsoCode) return [];

    return City.getCitiesOfState(
      countryCode,
      stateIsoCode
    )?.map((cityDetails: countryBasedStates) => ({
      name: cityDetails?.name ?? "",
      longitude: cityDetails?.longitude ?? null,
      latitude: cityDetails?.latitude ?? null,
      countryCode: cityDetails?.countryCode ?? "",
      stateCode: cityDetails?.stateCode ?? "",
    })) ?? [];
  };

  useEffect(() => {
    fetchCategories();
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  useEffect(() => {
    const selectState = State.getStatesOfCountry(selectedCountry?.code)?.map(
      (stateDetails) => ({
        name: stateDetails?.name ?? "",
        longitude: stateDetails?.longitude ?? null,
        latitude: stateDetails?.latitude ?? null,
        isoCode: stateDetails?.isoCode,
        countryCode: stateDetails?.countryCode,
      })
    );
    setStateOptions(selectState);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry?.code && selectedState?.isoCode) {
      const selectCity = City.getCitiesOfState(
        selectedCountry?.code,
        selectedState?.isoCode
      ).map((cityDetails) => ({
        name: cityDetails?.name ?? "",
        longitude: cityDetails?.longitude ?? null,
        latitude: cityDetails?.latitude ?? null,
        countryCode: cityDetails?.countryCode ?? "",
        stateCode: cityDetails?.stateCode ?? "",
      }));
      setCityOptions(selectCity);
    }
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.BusinessDetails] !==
      "pending"
    ) {
      refetch();
    }
  }, [currentStepperStatus[BusinessProfileStageKey.BusinessDetails]]);

  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.BusinessDetails] !== "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.BusinessDetails, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.BusinessDetails, false);
    }
    const getCountryCode = businessDetailsInfo?.data?.businessAddress?.country?.code;

    const countryBasedStateList = getStateOptionsByCountryCode(getCountryCode);

    const matchedState = countryBasedStateList?.find(
      (state) =>
        state?.name === businessDetailsInfo?.data?.businessAddress?.state
    );
    let cityBasedOnState;
    if (getCountryCode && matchedState) {
      cityBasedOnState = getCityOptionsByState(getCountryCode, matchedState?.isoCode);
    }
    const matchedCity = cityBasedOnState?.find(
      (city: countryBasedStates) =>
        city?.name === businessDetailsInfo?.data?.businessAddress?.city
    );
    const selectedIndustry = businessDetailsInfo?.data?.industry;

    setStateOptions(countryBasedStateList);
    setCityOptions(cityBasedOnState);
    setCountryName(
      businessDetailsInfo?.data?.businessAddress?.country?.name ?? ""
    );
    setCountryCode(
      businessDetailsInfo?.data?.businessAddress?.country?.code ?? ""
    );

    if (isSuccess) {
      reset({
        legalBusinessName: businessDetailsInfo?.data?.legalBusinessName ?? "",
        businessName: businessDetailsInfo?.data?.businessName ?? "",
        ownerName: businessDetailsInfo?.data?.legalOwnerName ?? "",
        businessType: businessDetailsInfo?.data?.businessType ?? "",
        businessTypeSpecific: Array.isArray(
          businessDetailsInfo?.data?.businessTypeSpecific
        )
          ? businessDetailsInfo.data.businessTypeSpecific
          : (businessDetailsInfo?.data?.businessTypeSpecific ?? "")
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
        businessAddress: {
          addressLine:
            businessDetailsInfo?.data?.businessAddress?.addressLine ?? "",
          city: matchedCity ?? {},
          state: matchedState ?? {},
          pinCode: String(
            businessDetailsInfo?.data?.businessAddress?.pinCode ?? ""
          ),
          country: businessDetailsInfo?.data?.businessAddress?.country ?? {},
        },
        phoneNumber: businessDetailsInfo?.data?.businessPhoneNo ?? {},
        email: businessDetailsInfo?.data?.businessEmail ?? "",
        industry: businessDetailsInfo?.data?.industry ?? {},
        establishment: String(businessDetailsInfo?.data?.yearOfEstablishment),
        employeeCount: businessDetailsInfo?.data?.noOfEmployees ?? "",
        mainProduct: businessDetailsInfo?.data?.mainProducts,
        shipAddress: businessDetailsInfo?.data?.isShippingAddress,
      });
      if (selectedIndustry) {
        setOptions((prevOptions) => {
          const isAlreadyIncluded = prevOptions.some(
            (opt) => opt._id === selectedIndustry._id
          );
          return isAlreadyIncluded
            ? prevOptions
            : [selectedIndustry, ...prevOptions];
        });
      }
      if (isSuccess && businessDetailsInfo?.data?.businessTypeSpecific) {
        const apiValues = Array.isArray(businessDetailsInfo.data.businessTypeSpecific)
          ? businessDetailsInfo.data.businessTypeSpecific
          : businessDetailsInfo.data.businessTypeSpecific
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);

        setBusinessTypeOptions((prev) => {
          const merged = [...prev];
          apiValues.forEach((val) => {
            if (!merged.some((opt) => opt.value === val)) {
              merged.push({ name: val, value: val });
            }
          });
          return merged;
        });
      }
    }
  }, [isSuccess, businessDetailsInfo, reset]);

  const fetchCategories = async (search = "") => {
    const res = await triggerFetch({ search });
    if ("data" in res && res.data?.data) {
      const optionsList = res.data.data.map((d) => {
        const { liveUrl, ...restData } = d;
        return restData;
      });
      setOptions(optionsList);
    }
  };

  const handleOnChange = (value: string, country: any) => {
    const dialCode = country?.dialCode || "";
    const phoneNumber = value.replace(dialCode, "");
    setValue("phoneNumber", {
      countryCode: dialCode,
      number: phoneNumber,
    });
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      legalBusinessName: data.legalBusinessName,
      businessName: data?.businessName,
      legalOwnerName: data?.ownerName,
      businessType: data.businessType,
      businessTypeSpecific: data.businessTypeSpecific,
      businessAddress: {
        addressLine: data.businessAddress.addressLine ?? "",
        city: data?.businessAddress?.city.name ?? "",
        state: data?.businessAddress.state?.name ?? "",
        pinCode: data?.businessAddress?.pinCode ?? "",
        country: data?.businessAddress?.country ?? { code: "", name: "" },
      },
      businessPhoneNo: {
        countryCode: data.phoneNumber.countryCode.startsWith("+")
          ? data.phoneNumber.countryCode
          : `+${data.phoneNumber.countryCode}`,
        number: data.phoneNumber.number,
      },
      businessEmail: data.email,
      industry: data.industry,
      yearOfEstablishment: Number(data.establishment),
      noOfEmployees: data.employeeCount,
      mainProducts: data.mainProduct,
      isShippingAddress: data.shipAddress ?? false,
      ...(data.shipAddress
        ? {
          shippingAddress: {
            addressLine: data.businessAddress?.addressLine ?? "",
            city: data?.businessAddress?.city.name ?? "",
            state: data?.businessAddress?.state?.name ?? "",
            pinCode: data?.businessAddress?.pinCode ?? "",
            country: data?.businessAddress?.country ?? { code: "", name: "" },
          },
        }
        : {}),
    };
    try {
      await updateBusinessDetails(payload).unwrap();
      reset();
      onSuccess();
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: error?.data?.message,
          theme: "error",
        })
      );
    }
  };

  const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { helperTxt?: string }>(
    ({ type, placeholder, helperTxt, ...rest }, ref) => {
      return (
        <div className="input-wrapper">
          <input
            type={type}
            placeholder={placeholder}
            {...rest}
            ref={ref}
            className="forms-input"
          />
          {helperTxt && <small className="helper-text">{helperTxt}</small>}
        </div>
      );
    }
  );
  Input.displayName = "Input";

  const onError = (errors: any) => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      setFocus(firstError as keyof FormData);
    }
    console.warn("company reg123", errors);

    dispatch(
      showToast({
        title: "Warning!",
        message: "Please fill in all required fields.",
        theme: "info",
      })
    );
  };

  const handleCancelButton = () => {
    const getCountryCode = businessDetailsInfo?.data?.businessAddress?.country?.code;
    const matchedState = getStateOptionsByCountryCode(getCountryCode)?.find(
      (state) => state?.name === businessDetailsInfo?.data?.businessAddress?.state
    );
    const matchedCity = getCityOptionsByState(getCountryCode, matchedState?.isoCode)?.find(
      (city: countryBasedStates) =>
        city?.name === businessDetailsInfo?.data?.businessAddress?.city
    );
    reset({
      legalBusinessName: businessDetailsInfo?.data?.legalBusinessName ?? "",
      businessName: businessDetailsInfo?.data?.businessName ?? "",
      ownerName: businessDetailsInfo?.data?.legalOwnerName ?? "",
      businessType: businessDetailsInfo?.data?.businessType ?? "",
      businessTypeSpecific: Array.isArray(
        businessDetailsInfo?.data?.businessTypeSpecific
      )
        ? businessDetailsInfo.data.businessTypeSpecific
        : (businessDetailsInfo?.data?.businessTypeSpecific ?? "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      businessAddress: {
        addressLine:
          businessDetailsInfo?.data?.businessAddress?.addressLine ?? "",
        city: matchedCity ?? {},
        state: matchedState ?? {},
        pinCode: String(
          businessDetailsInfo?.data?.businessAddress?.pinCode ?? ""
        ),
        country: businessDetailsInfo?.data?.businessAddress?.country ?? {},
      },
      phoneNumber: businessDetailsInfo?.data?.businessPhoneNo ?? {},
      email: businessDetailsInfo?.data?.businessEmail ?? "",
      industry: businessDetailsInfo?.data?.industry ?? {},
      establishment: String(businessDetailsInfo?.data?.yearOfEstablishment),
      employeeCount: businessDetailsInfo?.data?.noOfEmployees ?? "",
      mainProduct: businessDetailsInfo?.data?.mainProducts,
      shipAddress: businessDetailsInfo?.data?.isShippingAddress,
    });
    onSuccess();
  };

  return (
    <>
      {isEdit && (
        <>
          <form className="c-f-b-t-body">
            <div className="forms-block">
              {/* Business legal name and business name */}
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT("businessDetails.legalBusinessName")}
                    </label>
                    <Controller
                      name="legalBusinessName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={businessProfileT(
                            "businessDetails.legalBusinessNamePlaceholder"
                          )}
                          helperTxt={businessProfileT(
                            "businessDetails.legalBusinessNameHelperText"
                          )}
                          {...field}
                        />
                      )}
                    />
                    {errors.legalBusinessName && (
                      <span className="error-txt">
                        {errors.legalBusinessName.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT("businessDetails.businessName")}
                    </label>
                    <Controller
                      name="businessName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="text"
                          placeholder={businessProfileT(
                            "businessDetails.businessNamePlaceholder"
                          )}
                          helperTxt={businessProfileT(
                            "businessDetails.businessNameHelperText"
                          )}
                          {...field}
                        />
                      )}
                    />
                    {errors.businessName && (
                      <span className="error-txt">
                        {errors.businessName.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* {isMobile ? ( */}

                {/* ) : (
                  <Controller
                    name="legalBusinessName"
                    control={control}
                    render={({ field }) => (
                      <Inputs
                        type="text"
                        placeholder={businessProfileT(
                          "businessDetails.legalBusinessNamePlaceholder"
                        )}
                        helperTxt={businessProfileT(
                          "businessDetails.legalBusinessNameHelperText"
                        )}
                        {...field}
                      />
                    )}
                  />
                )} */}


              </div>
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("businessDetails.legalOwnerName")}
                </label>
                <Controller
                  name="ownerName"
                  control={control}
                  render={({ field }) => (
                    <Inputs
                      type="text"
                      placeholder={businessProfileT(
                        "businessDetails.legalOwnerNamePlaceholder"
                      )}
                      {...field}
                    />
                  )}
                />
                {errors.ownerName && (
                  <span className="error-txt">{errors.ownerName.message}</span>
                )}
              </div>
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("businessDetails.legalStatus")}
                </label>
                <div className="business-type-group col-2-layout">
                  {businessType.map((type, index: number) => {
                    return (
                      <BusinessTypeCard
                        key={index}
                        disabled={
                          businessDetailsInfo?.data?.businessType ? true : false
                        }
                        htmlFor={type.value}
                        name={type.title}
                        subtitle={type.subtitle}
                        value={type.value}
                        register={register}
                      />
                    );
                  })}
                </div>
                {errors.businessType && (
                  <span className="error-txt">
                    {errors.businessType.message}
                  </span>
                )}
              </div>
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("businessDetails.businessType")}
                </label>
                <Controller
                  name="businessTypeSpecific"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectInputs
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={businessTypeOptions}
                      optionLabel="name"
                      filter={false}
                      placeholder={businessProfileT(
                        "businessDetails.businessTypePlaceholder"
                      )}
                      maxSelectedLabels={2}
                      selectAllLabel={`${common("selectAll")}`}
                      className="customize-dropdown"
                      virtualScrollerOptions={{
                        itemSize: 40,
                      }}
                      appendTo={"self"}
                    />
                  )}
                />
                {errors.businessTypeSpecific && (
                  <span className="error-txt">
                    {errors.businessTypeSpecific.message}
                  </span>
                )}
              </div>
              {/* No. of Employees and Main Products */}
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT("businessDetails.employee.title")}
                    </label>
                    <Controller
                      name="employeeCount"
                      control={control}
                      render={({ field }) => {
                        return (
                          <Select
                            options={EmployeeRange}
                            placeholder={businessProfileT(
                              "businessDetails.employee.placeholder"
                            )}
                            {...field}
                          />
                        );
                      }}
                    />
                    {errors.employeeCount && (
                      <span className="error-txt">
                        {errors.employeeCount.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT("businessDetails.mainProduct.title")}
                    </label>
                    <Controller
                      name="mainProduct"
                      control={control}
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
                            placeholder={businessProfileT(
                              "businessDetails.mainProduct.placeholder"
                            )}
                            helperText={
                              "The value will be added only after pressing Enter."
                            }
                          />
                        );
                      }}
                    />
                    {errors.mainProduct && (
                      <span className="error-txt">
                        {errors.mainProduct.message}
                      </span>
                    )}
                    {Array.isArray(errors?.mainProduct) &&
                      errors?.mainProduct?.map(
                        (err, idx) =>
                          err?.message && (
                            <span key={idx} className="error-txt">
                              {`Item ${idx + 1}: ${err.message}`}
                            </span>
                          )
                      )}
                  </div>
                </div>
              </div>
              {/* Industry and Year of Establishment */}
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT("businessDetails.Industry.title")}
                    </label>
                    <Controller
                      name="industry"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={field.onChange}
                          options={options}
                          optionLabel="name"
                          // optionValue="_id"
                          placeholder={businessProfileT(
                            "businessDetails.Industry.placeholder"
                          )}
                          filter
                          filterBy="name"
                          virtualScrollerOptions={{
                            itemSize: 40,
                          }}
                          className="category-multi-select"
                        />
                      )}
                    />
                    {errors.industry?.name?.message && (
                      <span className="error-txt">
                        {errors.industry?.name.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT("businessDetails.year.title")}
                    </label>
                    <Controller
                      name="establishment"
                      control={control}
                      render={({ field }) => (
                        <Inputs
                          type="number"
                          placeholder={businessProfileT(
                            "businessDetails.year.placeholder"
                          )}
                          {...field}
                        />
                      )}
                    />
                    {errors.establishment && (
                      <span className="error-txt">
                        {errors.establishment.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="separation-block"></div>
              <div className="a-h-l-content-wrapper">
                <Typography variant="h2" className="a-h-l-title">
                  {businessProfileT("businessDetails.contactInfo.title")}
                </Typography>
                <Typography variant="span" className="a-h-l-subtxt">
                  {businessProfileT("businessDetails.AllFieldsAreRequired")}
                </Typography>
              </div>
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("businessDetails.contactInfo.country")}
                </label>
                <Controller
                  name="businessAddress.country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={countriesOptions}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        setSelectedCountry(e);
                      }}
                      filter={true}
                      filterBy="name"
                      virtualScrollerOptions={{
                        itemSize: 40,
                      }}
                      placeholder={businessProfileT(
                        "businessDetails.contactInfo.country"
                      )}
                    />
                  )}
                />
                {errors.businessAddress?.country?.name && (
                  <span className="error-txt">
                    {errors.businessAddress?.country?.name?.message}
                  </span>
                )}
              </div>
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("businessDetails.businessAddress")}
                </label>
                <Controller
                  name="businessAddress.addressLine"
                  control={control}
                  render={({ field }) => (
                    <Inputs
                      type="text"
                      placeholder={businessProfileT(
                        "businessDetails.businessAddressPlaceholder"
                      )}
                      {...field}
                    />
                  )}
                />
                {errors.businessAddress?.addressLine && (
                  <span className="error-txt">
                    {errors.businessAddress?.addressLine.message}
                  </span>
                )}
              </div>
              {/* State and City */}
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessDetails.contactInfo.address.state"
                      )}
                    </label>
                    <Controller
                      name="businessAddress.state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          disabled={stateOptions?.length > 0 ? false : true}
                          options={stateOptions}
                          value={field.value}
                          // onChange={field.onChange}
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedState(e);
                          }}
                          filter={true}
                          filterBy="name"
                          virtualScrollerOptions={{
                            itemSize: 40,
                          }}
                          placeholder={businessProfileT(
                            "businessDetails.contactInfo.address.state"
                          )}
                        />
                      )}
                    />
                    {errors.businessAddress?.state?.name && (
                      <span className="error-txt">
                        {errors.businessAddress?.state.name?.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessDetails.contactInfo.address.city"
                      )}
                    </label>
                    <Controller
                      name="businessAddress.city"
                      control={control}
                      render={({ field }) => (
                        <Select
                          disabled={cityOptions?.length > 0 ? false : true}
                          options={cityOptions}
                          value={field.value}
                          // onChange={field.onChange}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          filter={true}
                          filterBy="name"
                          virtualScrollerOptions={{
                            itemSize: 40,
                          }}
                          placeholder={businessProfileT(
                            "businessDetails.contactInfo.address.city"
                          )}
                        />
                      )}
                    />
                    {errors.businessAddress?.city?.name && (
                      <span className="error-txt">
                        {errors.businessAddress?.city?.name?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Pincode */}
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT(
                    "businessDetails.contactInfo.address.pincode"
                  )}
                </label>
                <Controller
                  name="businessAddress.pinCode"
                  control={control}
                  rules={{ required: "pincode is required" }}
                  render={({ field }) => (
                    <Inputs
                      type="text"
                      placeholder={businessProfileT(
                        "businessDetails.contactInfo.address.pincode"
                      )}
                      {...field}
                      value={field.value?.toString() ?? ""}
                    />
                  )}
                />
                {errors.businessAddress?.pinCode && (
                  <span className="error-txt">
                    {errors.businessAddress?.pinCode.message}
                  </span>
                )}
                <Controller
                  name="shipAddress"
                  control={control}
                  render={({ field }) => (
                    <CheckBoxInputs
                      label={businessProfileT(
                        "businessDetails.shippingAddress"
                      )}
                      id={"shipAddress"}
                      className={"light-bg"}
                      {...field}
                      checked={!!field.value}
                      onchange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </div>
              {/* Mobile Number and Business Email */}
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessDetails.contactInfo.address.mobile"
                      )}
                    </label>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        // <Inputs
                        //   type="text"
                        //   placeholder="+91 75894 XXXXX"
                        //   {...field}
                        // />
                        <PhoneInput
                          value={`${field.value?.countryCode ?? ""}${field.value?.number ?? ""
                            }`} // Ensure proper formatting
                          country={country?.country_code.toLowerCase() || "in"}
                          onChange={(value: string, country: any) => {
                            const dialCode = country.dialCode || "";
                            const phoneNumber = value
                              .replace(dialCode, "")
                              .replace(/^\+/, "");
                            field.onChange({
                              countryCode: dialCode,
                              cellNo: phoneNumber,
                            });
                            handleOnChange(value, country);
                          }}
                          inputStyle={{ width: "100%" }}
                        />
                      )}
                    />
                    {errors.phoneNumber?.number?.message && (
                      <span className="error-txt">
                        {errors.phoneNumber?.number?.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessDetails.contactInfo.address.bEmail"
                      )}
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      rules={{ required: "email is required" }}
                      render={({ field }) => (
                        <Inputs
                          type="email"
                          placeholder="Businessemail@gmail.com"
                          {...field}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="error-txt">{errors.email.message}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="button-group-block edit-save-btn-block">
                <Button
                  className={"btn-outline bg-outline-dark btn-c-sm"}
                  text={businessProfileT("businessDetails.cancel")}
                  onClick={handleCancelButton}
                />
                <Button
                  className={"btn-c-primary btn-c-sm"}
                  text={businessProfileT("businessDetails.save")}
                  onClick={handleSubmit(onSubmit, onError)}
                />
              </div>
            </div>
          </form>
        </>
      )}
      {!isEdit && (
        <BusinessDetailsViewPage businessDetailsInfo={businessDetailsInfo} />
      )}
    </>
  );
};

export default BusinessDetailsSection;
