"use client";

import SettingsButtons from "@/app/[locale]/_components/MicroComponents/SettingsButtons";
import UploadCard from "@/app/[locale]/_components/SettingsComponents/ProfileUpload";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";
import { capitalizeFirstLetter } from "@/app/[locale]/_hooks/utility";
import {
  DocumentInfo,
  NationalIdDropdown,
} from "@/app/[locale]/_interface/SettingsInterface";
import { ProfileSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetProfileDetailsQuery,
  useLazyGetCountryDocumentsQuery,
  useUpdateProfileDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppSelector } from "@/app/[locale]/_store/store";
import { profileSchema } from "@/app/[locale]/_validationSchema/settings";
import '@/app/[locale]/dev_styles.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch } from "react-redux";
import Typography from "../../_components/Base/Typography";
import {
  CircleChevronDownIcon,
  CircleChevronRightIcon,
} from "../../_components/Icons/SVGIcons";
import DateTimePickerCalender from "../../_components/StoreFront/Forms/DateTimePickerCalender";
import InputField from "../../_components/StoreFront/Forms/InputField";
import Select from "../../_components/StoreFront/Forms/Select";

const documentInfo = (): DocumentInfo => ({
  src: "",
  alt: "",
  exten: "",
  size: 0,
});

const defaultInfo = (): any => ({
  document: documentInfo(),
});

export interface CountryOfOrigin {
  code: string;
  name: string;
}

export type PhoneNumber = {
  countryCode: string;
  number: string;
};

type FormValues = {
  firstName: string;
  middleName?: string;
  lastName: string;
  jobTitle: string;
  dateOfBirth: Date;
  nationalIdNo: string;
  WhatsAppNo?: PhoneNumber;
  nationalIdType: string;
  personalAddress: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
    country: {
      name: string;
      code: string;
    };
  };
  workEmail: string;
  workPhoneNo: PhoneNumber;
  additionalDocument?: {
    document?: {
      src: string;
      alt: string;
      exten: string;
      size: number;
    } | null;
  };
};

const defaultValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  jobTitle: "",
  dateOfBirth: undefined,
  nationalIdNo: "",
  profilePic: "",
  WhatsAppNo: {
    countryCode: "+91",
    number: "",
  },
  nationalIdType: "",
  personalAddress: {
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    country: {
      name: "",
      code: "",
    },
  },
  workEmail: "",
  workPhoneNo: {
    countryCode: "+91",
    number: "",
  },
  additionalDocument: defaultInfo(),
};

const ProfileSettings = () => {
  const ps = useTranslations("profileSettings");
  const dispatch = useDispatch();
  const [isUploadAccordionShown, setIsUploadAccordionShown] =
    useState<boolean>(true);
  const [checkedWhatsapp, setCheckedWhatsapp] = useState<boolean>(false);
  const router = useRouter();
  const { nextStep } = useSettingNextStep();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(profileSchema),
  });
  const [countriesOptions, setCountriesOptions] = React.useState<
    { name: string; code: string }[]
  >([]);

  const [statesOptions, setStatesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [citiesOptions, setCitiesOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [nationalIdDropdown, setNationalIdDropdown] = useState<
    NationalIdDropdown[]
  >([]);

  let country = useAppSelector((state: any) => state.location);
  const { data, isSuccess } = useGetProfileDetailsQuery();
  const [fetchCountryDocuments] = useLazyGetCountryDocumentsQuery();
  const [updateProfileDetails, { isLoading }] =
    useUpdateProfileDetailsMutation();
  const CountryVal = watch("personalAddress.country.name");
  const StateVal = watch("personalAddress.state");
  const CityVal = watch("personalAddress.city");

  useEffect(() => {
    if (isSuccess && data?.data) {
      if (data.data.profilePic) {
        setIsUploadAccordionShown(!isUploadAccordionShown);
      }
      reset({
        ...data.data,
        additionalDocument: {
          document: data.data.profilePic
            ? {
              src: data.data.profilePic,
              alt: "Profile Picture",
              exten: "jpg",
              size: 0, // you can set 0 if unknown
            }
            : undefined,
        },
        dateOfBirth: data.data.dateOfBirth
          ? new Date(data.data.dateOfBirth)
          : undefined,
      });
    }
  }, [isSuccess, data, reset]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetchCountryDocuments({
        country_name: "India",
      }).unwrap();

      const documents = response?.data?.documents || [];

      const transformedDocuments = documents.map((doc: any, index: number) => ({
        id: index.toString(),
        label: doc.label,
        value: doc.value,
      }));

      setNationalIdDropdown(transformedDocuments);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries);
  }, []);

  useEffect(() => {
    const countryCode = country;

    if (!countryCode) return;
    const stateNames = State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setStatesOptions(stateNames);
  }, [country]);

  const selectedCountry = watch("personalAddress.country")?.code;
  const selectedState = watch("personalAddress.state");
  useEffect(() => {
    if (
      data?.data?.workPhoneNo?.countryCode ===
      data?.data?.WhatsAppNo?.countryCode &&
      data?.data?.workPhoneNo?.number === data?.data?.WhatsAppNo?.number
    ) {
      setCheckedWhatsapp(true);
    } else {
      setCheckedWhatsapp(false);
    }
  }, [data?.data]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateList = State.getStatesOfCountry(selectedCountry).map(
        (state) => ({
          label: state.name,
          value: state.name,
        })
      );
      setStatesOptions(stateList);
      const matchedState = State.getStatesOfCountry(selectedCountry).find(
        (s) => s.name === selectedState
      );

      if (matchedState) {
        const cities = City.getCitiesOfState(
          selectedCountry,
          matchedState.isoCode
        ).map((city) => ({
          label: city.name,
          value: city.name,
        }));
        setCitiesOptions(cities);
      }
    }
  }, [watch("personalAddress.country"), watch("personalAddress.state")]);

  const handleFetchNationalIdDocuments = async (country_name: string) => {
    const response = await fetchCountryDocuments({ country_name }).unwrap();

    const documents = response?.data?.documents || [];

    const transformedDocuments = documents.map((doc: any, index: number) => ({
      id: index.toString(),
      label: doc.label,
      value: doc.value,
    }));

    setNationalIdDropdown(transformedDocuments);
  };

  const handleStateCityClick = async (
    country: {
      name: string;
      code: string;
    },
    stateName?: string
  ) => {
    setValue("personalAddress.state", "");
    setValue("personalAddress.city", "");
    setValue("nationalIdType", "");

    await handleFetchNationalIdDocuments(country.name);

    const stateList = State.getStatesOfCountry(country.code).map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setStatesOptions(stateList);

    if (stateName) {
      const matchedState = State.getStatesOfCountry(country.code).find(
        (s) => s.name === stateName
      );

      if (matchedState) {
        const cities = City.getCitiesOfState(
          country.code,
          matchedState.isoCode
        );

        const cityOptions = cities.map((city) => ({
          label: city.name,
          value: city.name,
        }));

        setCitiesOptions(cityOptions);
      } else {
        setCitiesOptions([]);
      }
    } else {
      setCitiesOptions([]);
    }
  };
  const onSubmit = async (data: any) => {
    const profilePic = data?.additionalDocument?.document?.src || "";
    let firstName = capitalizeFirstLetter(data?.firstName);
    let middleName = capitalizeFirstLetter(data?.middleName);
    let lastName = capitalizeFirstLetter(data?.lastName);
    let param = {
      ...data,
      firstName,
      middleName,
      lastName,
      profilePic,
    };
    delete param.additionalDocument;
    const response = await updateProfileDetails(param);

    if (response.data.statusCode === 200) {
      dispatch(
        showToast({
          title: "Success",
          message: response.data.message,
          theme: "success",
        })
      );
      reset();
      nextStep(ProfileSettingsStageKey.NotificationPreferences);
    }
  };

  const handleOnChange = (
    type: "phone" | "whatsapp",
    value: string,
    country: CountryData
  ) => {
    const extractedCountryCode = `+${country.dialCode}`;
    const phoneNumber = value.replace(country.dialCode, "").trim();

    const data = {
      number: phoneNumber,
      countryCode: extractedCountryCode,
    };

    if (checkedWhatsapp) {
      setValue("workPhoneNo", data);
      setValue("WhatsAppNo", data);
    } else {
      if (type === "phone") {
        setValue("workPhoneNo", data);
      } else {
        setValue("WhatsAppNo", data);
      }
    }
  };

  const handleCheckWhatsapp = () => {
    const { countryCode, number } = getValues("workPhoneNo");
    setValue("WhatsAppNo", { countryCode, number });
  };

  const onError = (errors) => {
    // console.log("Validation errors:", errors);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="forms-block">
      <div className="body-settings">
        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.firstName")}
          </label>
          <InputField type="text" {...register("firstName")} />
          <Typography variant="p" className="p-d-c-c-subtxt-sm">
            {ps("profileSettings.formHelpers.firstName")}
          </Typography>
          {errors.firstName && (
            <small className="error-txt">{errors.firstName.message}</small>
          )}
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.middleNameOptional")}
          </label>
          <InputField type="text" {...register("middleName")} />
          <Typography variant="p" className="p-d-c-c-subtxt-sm">
            {ps("profileSettings.formHelpers.middleName")}
          </Typography>
          {errors.middleName && (
            <small className="error-txt">{errors.middleName.message}</small>
          )}
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.lastName")}
          </label>
          <InputField type="text" {...register("lastName")} />
          <Typography variant="p" className="p-d-c-c-subtxt-sm">
            {ps("profileSettings.formHelpers.lastName")}
          </Typography>
          {errors.lastName && (
            <small className="error-txt">{errors.lastName.message}</small>
          )}
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.workEmail")}
          </label>
          <InputField
            type="text"
            {...register("workEmail", { required: false })}
            className="p-inputtext p-autocomplete-input"
          />
          <Typography variant="p" className="p-d-c-c-subtxt-sm">
            {ps("profileSettings.formHelpers.workEmail")}
          </Typography>
          {errors.workEmail && (
            <small className="error-txt">{errors.workEmail.message}</small>
          )}
        </div>
        <div className="forms-button-gaps">
          <div className="forms-group">
            <div className="label-flex">
              <label className="f-g-label">
                {ps("profileSettings.fieldsAddress.mobileNumber")}
              </label>
            </div>
            <div className="input-group-left">
              <Controller
                control={control}
                name="workPhoneNo"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    country={country?.country_code.toLowerCase() || "in"}
                    value={`${value?.countryCode?.replace("+", "") ?? ""}${value?.number ?? ""
                      }`}
                    onChange={(phoneValue: string, country: CountryData) => {
                      const countryCode = `+${country.dialCode}`;
                      const number = phoneValue
                        .replace(country.dialCode, "")
                        .replace(/^0+/, "");
                      handleOnChange("phone", phoneValue, country);
                      onChange({ countryCode, number });
                    }}
                    inputStyle={{ width: "100%" }}
                  />
                )}
              />
            </div>
            {errors.workPhoneNo?.number && (
              <small className="error-txt">
                {errors.workPhoneNo.number.message}
              </small>
            )}
          </div>
        </div>

        <CheckBoxInputs
          label={ps("profileSettings.fieldsAddress.SameAsMobileNo")}
          className="my-checkbox"
          id="accept"
          checked={checkedWhatsapp}
          onchange={(e) => {
            setCheckedWhatsapp(e.target.checked);
            handleCheckWhatsapp();
          }}
        />

        <div className="forms-button-gaps">
          <div className="forms-group">
            <div className="label-flex">
              <label className="f-g-label">
                {ps("profileSettings.fieldsAddress.whatsappNumber")}
              </label>
            </div>
            <div className="input-group-left">
              <Controller
                control={control}
                name="WhatsAppNo"
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    disabled={checkedWhatsapp}
                    country={country?.country_code.toLowerCase() || "in"}
                    value={`${value?.countryCode?.replace("+", "") ?? ""}${value?.number ?? ""
                      }`}
                    onChange={(phoneValue: string, country: CountryData) => {
                      const countryCode = `+${country.dialCode}`;
                      const number = phoneValue
                        .replace(country.dialCode, "")
                        .replace(/^0+/, "");
                      handleOnChange("whatsapp", phoneValue, country);
                      onChange({ countryCode, number });
                    }}
                    inputStyle={{ width: "100%" }}
                  />
                )}
              />
            </div>
            <Typography variant="p" className="p-d-c-c-subtxt-sm">
              {ps("profileSettings.formHelpers.whatsapp")}
            </Typography>
            {!checkedWhatsapp && errors?.WhatsAppNo?.number && (
              <small className="error-txt">
                {errors?.WhatsAppNo?.number?.message}
              </small>
            )}
          </div>
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.jobTitle")}
          </label>
          <InputField
            type="text"
            maxLength={100}
            placeholder={ps("profileSettings.placeholder.EnterJobTitle")}
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <small className="error-txt">{errors.jobTitle.message}</small>
          )}
        </div>
        <div
          className={`adv-req-block ${isUploadAccordionShown ? "active" : ""}`}
          onClick={() => setIsUploadAccordionShown(!isUploadAccordionShown)}
        >
          <div className="a-r-b-content">
            <div className="section-header">
              <div className="forms-group">
                <label className="f-g-label-additional" htmlFor="brochure">
                  {ps(
                    "profileSettings.fieldsAddress.additionalInformationOptional"
                  )}{" "}
                  <span className="f-g-label-dim">
                    {ps("profileSettings.fieldsAddress.optional")}
                  </span>
                </label>
              </div>

              {isUploadAccordionShown ? (
                <CircleChevronDownIcon className="trigger-icon" />
              ) : (
                <CircleChevronRightIcon className="trigger-icon" />
              )}
            </div>
          </div>
        </div>

        {isUploadAccordionShown || (
          <div className="forms-group">
            <Controller
              name="additionalDocument.document"
              control={control}
              render={({ field }) => {
                const valueWithPath = field.value
                  ? { path: field.value?.src ?? "", ...field.value }
                  : {
                    src: "",
                    alt: "",
                    exten: "",
                    size: 0,
                    path: "",
                  };

                return (
                  <UploadCard
                    value={valueWithPath}
                    onChange={(file) => field.onChange(file)}
                  />
                );
              }}
            />
          </div>
        )}
        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.dateOfBirth")}
          </label>
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DateTimePickerCalender
                placeholder="DD/MM/YYYY"
                showTime={false}
                value={field.value ?? undefined}
                onChange={(date: Date | null) =>
                  field.onChange(date ?? undefined)
                }
                maxDate={new Date()}
                dateFormat="dd/mm/yy"
              />
            )}
          />
          <Typography variant="p" className="p-d-c-c-subtxt-sm">
            {ps("profileSettings.fieldsAddress.dobSubText")}
          </Typography>
          {errors.dateOfBirth && (
            <small className="error-txt">{errors.dateOfBirth.message}</small>
          )}
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.address")}
          </label>
          <InputField
            type="text"
            {...register("personalAddress.addressLine")}
            placeholder={ps("profileSettings.placeholder.EnterAddress")}
          />
          {errors?.personalAddress?.addressLine && (
            <small className="error-txt">
              {errors?.personalAddress?.addressLine.message}
            </small>
          )}
        </div>

        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {ps("profileSettings.fieldsAddress.country")}
              </label>
              <Controller
                control={control}
                name="personalAddress.country"
                render={({ field }) => (
                  <Select
                    options={countriesOptions}
                    value={field.value}
                    onChange={(value) => {
                      handleStateCityClick(value);
                      field.onChange(value);
                    }}
                    filter={true}
                    filterBy="name"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                    placeholder={ps("profileSettings.placeholder.Select")}
                  />
                )}
              />
              {errors?.personalAddress?.country?.name && (
                <small className="error-txt">
                  {errors.personalAddress.country.name.message}
                </small>
              )}
            </div>
            <div className="forms-group wid-100">
              <label className="f-g-label st-space-mt">
                {ps("profileSettings.fieldsAddress.state")}
              </label>

              {!statesOptions.length && CountryVal ? (
                <InputField
                  disabled={!CountryVal}
                  type="text"
                  {...register("personalAddress.state")}
                />
              ) : (
                <>
                  <Controller
                    control={control}
                    name="personalAddress.state"
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        optionLabel="label"
                        optionValue="value"
                        disabled={!CountryVal}
                        options={statesOptions}
                        placeholder={ps("profileSettings.placeholder.Select")}
                        filter={true}
                        filterBy="label"
                        virtualScrollerOptions={{ itemSize: 40 }}
                      />
                    )}
                  />
                </>
              )}
              {errors?.personalAddress?.state && (
                <small className="error-txt">
                  {errors.personalAddress.state.message}
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {ps("profileSettings.fieldsAddress.city")}
              </label>
              {!citiesOptions.length && CountryVal && StateVal ? (
                <InputField
                  type="text"
                  disabled={!(CountryVal && StateVal)}
                  {...register("personalAddress.city")}
                />
              ) : (
                <>
                  <Controller
                    control={control}
                    name="personalAddress.city"
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={!(CountryVal && StateVal)}
                        options={citiesOptions}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder={ps("profileSettings.placeholder.Select")}
                        filter={true}
                        filterBy="label"
                        virtualScrollerOptions={{
                          itemSize: 40,
                        }}
                      />
                    )}
                  />
                </>
              )}
              {errors?.personalAddress?.city && (
                <small className="error-txt">
                  {errors.personalAddress.city.message}
                </small>
              )}
            </div>
            <div className="forms-group wid-100">
              <label className="f-g-label st-space-mt">
                {ps("profileSettings.fieldsAddress.pinCode")}
              </label>
              <InputField
                disabled={!(CountryVal && StateVal && CityVal)}
                type="text"
                placeholder={ps("profileSettings.placeholder.EnterPinCode")}
                {...register("personalAddress.pinCode")}
              />
              {errors?.personalAddress?.pinCode && (
                <small className="error-txt">
                  {errors.personalAddress.pinCode.message}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.nationalIdType")}
          </label>
          {nationalIdDropdown.length === 0 ? (
            <>
              <InputField
                type="text"
                placeholder={ps(
                  "profileSettings.placeholder.EnterNationalIdType"
                )}
                {...register("nationalIdType")}
              />
              {errors?.nationalIdType && (
                <small className="error-txt">
                  {errors.nationalIdType.message}
                </small>
              )}
            </>
          ) : (
            <>
              <Controller
                control={control}
                name="nationalIdType"
                render={({ field }) => (
                  <Select
                    options={nationalIdDropdown}
                    placeholder={ps("profileSettings.placeholder.Select")}
                    optionLabel="label"
                    optionValue="value"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.nationalIdType && (
                <small className="error-txt">
                  {errors.nationalIdType.message}
                </small>
              )}
            </>
          )}
        </div>

        <div className="forms-group">
          <label className="f-g-label">
            {ps("profileSettings.fieldsAddress.nationalIdNumber")}
          </label>
          <InputField
            type="text"
            placeholder={ps("profileSettings.placeholder.nationalIdNumber")}
            {...register("nationalIdNo")}
          />
          {errors.nationalIdNo && (
            <small className="error-txt">{errors.nationalIdNo.message}</small>
          )}
        </div>
      </div>
      <SettingsButtons cancelRoute={`./`} isSubmitting={isLoading} />
    </form>
  );
};

export default ProfileSettings;
