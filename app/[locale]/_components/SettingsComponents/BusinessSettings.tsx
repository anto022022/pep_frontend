"use client";

import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { TickGreenIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import SettingsButtons from "@/app/[locale]/_components/MicroComponents/SettingsButtons";
import DynamicOtpDialog from "@/app/[locale]/_components/SettingsComponents/DynamicOtpDialog";
import {
  AuthPayloads,
  verifyPayload,
} from "@/app/[locale]/_interface/AuthInterface";
import { timeZoneOptions } from "@/app/[locale]/_models/common";
import {
  useGetBusinessDetailsQuery,
  useSendMailOtpMutation,
  useSendMobileOtpMutation,
  useUpdateBusinessSettingsMutation,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppSelector } from "@/app/[locale]/_store/store";
import { businessSchema } from "@/app/[locale]/_validationSchema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch } from "react-redux";
import InputField from "../../_components/StoreFront/Forms/InputField";
import Select from "../../_components/StoreFront/Forms/Select";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";
type FormValues = {
  accountID?: string;
  businessName: string;
  timeZone: string;
  phoneNo: string; // ✅ make required
  countryCode: string; // ✅ make required
  email: string;
  additionalPhoneNo?: {
    countryCode: string;
    number: string;
  }[];
  businessAddress: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
    country: {
      name: string;
      code: string;
    };
  };
  isEmailVerified?: boolean;
  isPhoneNoVerified?: boolean;
};

const BusinessSettings = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      accountID: "",
      businessName: "",
      timeZone: "",
      phoneNo: "",
      email: "",
      businessAddress: {
        addressLine: "",
        city: "",
        state: "",
        pinCode: "",
        country: {
          name: "",
          code: "",
        },
      },
      countryCode: "+91",
      isEmailVerified: false,
      isPhoneNoVerified: false,
    }),
    []
  );
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resetOptions: {
      keepValues: true,
      keepDirtyValues: true,
    },
    resolver: zodResolver(businessSchema),
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
  const [coutryCode, SetCoutryCode] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const { data } = useGetBusinessDetailsQuery();
  const [otpPayload, setOtpPayload] = useState<AuthPayloads>({
    phone: "",
    countryCode: "",
    email: "",
  });

  const [isPhoneChanged, setIsPhoneChanged] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otpType, setOtpType] = useState<"phone" | "email">("phone");
  const accSetLang = useTranslations("accountSettings");
  const mounted = useRef(false);
  const { nextStep } = useSettingNextStep();
  useEffect(() => {
    if (data?.data && !mounted.current) {
      const businessData = data.data;
      reset({
        accountID: businessData.accountId,
        businessName: businessData.businessName,
        timeZone: businessData.timeZone,
        phoneNo: businessData.phoneNo,
        countryCode: businessData.countryCode,
        email: businessData.email,
        businessAddress: {
          addressLine: businessData?.businessAddress?.addressLine,
          city: businessData.businessAddress?.city,
          state: businessData.businessAddress?.state,
          pinCode: businessData.businessAddress?.pinCode,
          country: {
            name: businessData.businessAddress?.country.name,
            code: businessData.businessAddress?.country.code,
          },
        },
        additionalPhoneNo: [],
        isEmailVerified: businessData.isEmailVerified,
        isPhoneNoVerified: businessData.isPhoneNoVerified,
      });
      SetCoutryCode(businessData.countryCode);
      mounted.current = true;
    }
  }, [data, reset]);

  const [updateBusinessSettings, { isLoading }] =
    useUpdateBusinessSettingsMutation();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      isEmailVerified: emailVerified,
      isPhoneNoVerified: phoneVerified,
    };
    const response = await updateBusinessSettings(payload);
    if (response?.data?.statusCode === 200) {
      dispatch(
        showToast({
          title: "Success",
          message: response.data.message,
          theme: "success",
        })
      );
      nextStep(AccountSettingsStageKey.ComplianceSettings);
    }
  };

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries);
  }, []);

  let country = useAppSelector((state: any) => state.location);
  useEffect(() => {
    const countryCode = country;

    if (!countryCode) return;
    const stateNames = State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setStatesOptions(stateNames);
  }, [country]);

  const handleStateCityClick = async (
    country: {
      name: string;
      code: string;
    },
    stateName?: string
  ) => {
    setValue("businessAddress.state", "");
    setValue("businessAddress.city", "");

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
  const selectedCountry = watch("businessAddress.country")?.code;
  const selectedState = watch("businessAddress.state");
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
  }, [watch("businessAddress.country"), watch("businessAddress.state")]);

  const CountryVal = watch("businessAddress.country.name");
  const StateVal = watch("businessAddress.state");
  const CityVal = watch("businessAddress.city");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalPhoneNo",
  });
  const handleAddNumber = () => {
    append({ countryCode: "", number: "" });
  };
  const [sendMobileOtp] = useSendMobileOtpMutation(); // for phone
  const [sendMailOtp] = useSendMailOtpMutation();

  const handleSendPhoneOtp = async () => {
    setOtpType("phone");
    const values = getValues();

    // Ensure we have both phone number and country code
    if (!values.phoneNo || !values.countryCode) {
      dispatch(
        showToast({
          title: "Error",
          message: "Please enter both phone number and country code",
          theme: "error",
        })
      );
      return;
    }

    const payload: verifyPayload = {
      phoneNo: values.phoneNo,
      countryCode: values.countryCode,
      email: values.email,
    };

    try {
      const res = await sendMobileOtp(payload).unwrap();
      if (res?.statusCode === 201) {
        setOtpPayload(payload);
        setOpenOtpDialog(true);
      }
    } catch (error: any) {
      console.log(error, ">>error");
    }
  };

  const handleSendEmailOtp = async () => {
    setOtpType("email");

    const values = getValues();

    // Ensure we have both phone number and country code
    // if (!values.phoneNo || !values.countryCode) {
    //   dispatch(
    //     showToast({
    //       title: "Error",
    //       message: "Please enter both phone number and country code",
    //       theme: "error",
    //     })
    //   );
    //   return;
    // }

    const payload: verifyPayload = {
      phoneNo: values.phoneNo,
      countryCode: values.countryCode,
      email: values.email,
    };

    try {
      const res = await sendMailOtp(payload).unwrap();
      if (res?.statusCode === 201) {
        setOtpPayload(payload);
        setOpenOtpDialog(true);
        setEmailVerified(true);
      }
    } catch (error: any) {
      console.log(error, ">>error");
    }
  };
  const handleVerificationSuccess = () => {
    if (otpType === "phone") {
      setPhoneVerified(true);
      setIsPhoneChanged(false);
    } else if (otpType === "email") {
      setEmailVerified(true);
      setIsEmailChanged(false);
    }
    setOpenOtpDialog(false);
    setIsEditingPhone(false);
    setIsEditingEmail(false);
    reset(undefined, { keepValues: true });
  };
  const handleOnPhoneChange = (value: string, country: CountryData) => {
    const extractedCountryCode = `+${country.dialCode}`;
    const phoneNumber = value.replace(country.dialCode, "").trim();

    const data = {
      number: phoneNumber,
      countryCode: extractedCountryCode,
    };
    setValue("phoneNo", data.number);
    setValue("countryCode", data.countryCode);
  };
  const isSaveEnabled =
    (!isPhoneChanged && !isEmailChanged) || // nothing changed
    (isPhoneChanged && phoneVerified) || // phone changed & verified
    (isEmailChanged && emailVerified);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="forms-block">
      <div className="body-settings">
        <div className="input-badge-container">
          <input
            type="text"
            placeholder="Account Id"
            value={data?.data?.accountId ? ` ${data.data.accountId}` : ""}
            className="readonly-input"
            readOnly
          />
        </div>
        <div className="forms-group">
          <label className="f-g-label">
            {accSetLang("businessSettings.fields.BusinessName")}
          </label>
          <InputField
            type="text"
            placeholder={accSetLang(
              "businessSettings.placeholder.EnterBusinessName"
            )}
            {...register("businessName")}
          />
          {errors.businessName && (
            <small className="error-txt">{errors.businessName.message}</small>
          )}
        </div>
        <div className="forms-group">
          <label className="f-g-label">
            {accSetLang("businessSettings.fields.BusinessAddress")}
          </label>
          <InputField
            type="text"
            placeholder={accSetLang(
              "businessSettings.placeholder.EnterAddress"
            )}
            {...register("businessAddress.addressLine")}
          />
          {errors?.businessAddress?.addressLine && (
            <small className="error-txt">
              {errors?.businessAddress?.addressLine.message}
            </small>
          )}
        </div>

        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {accSetLang("businessSettings.fields.Country")}
              </label>
              <Controller
                control={control}
                name="businessAddress.country"
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
                    placeholder={accSetLang(
                      "businessSettings.placeholder.Select"
                    )}
                  />
                )}
              />
              {errors?.businessAddress?.country?.name && (
                <small className="error-txt">
                  {errors.businessAddress.country.name.message}
                </small>
              )}
            </div>
            <div className="forms-group wid-100">
              <label className="f-g-label st-space-mt">
                {accSetLang("businessSettings.fields.State")}
              </label>

              {!statesOptions.length && CountryVal ? (
                <InputField
                  type="text"
                  disabled={!CountryVal}
                  placeholder={accSetLang(
                    "businessSettings.placeholder.EnterState"
                  )}
                  {...register("businessAddress.state")}
                />
              ) : (
                <>
                  <Controller
                    control={control}
                    name="businessAddress.state"
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        optionLabel="label"
                        optionValue="value"
                        disabled={!CountryVal}
                        options={statesOptions}
                        placeholder={accSetLang(
                          "businessSettings.placeholder.Select"
                        )}
                        filter={true}
                        filterBy="label"
                        virtualScrollerOptions={{ itemSize: 40 }}
                      />
                    )}
                  />
                </>
              )}
              {errors?.businessAddress?.state && (
                <small className="error-txt">
                  {errors.businessAddress.state.message}
                </small>
              )}
            </div>
          </div>
        </div>
        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {accSetLang("businessSettings.fields.City")}
              </label>
              {!citiesOptions.length && CountryVal && StateVal ? (
                <InputField
                  type="text"
                  disabled={!(CountryVal && StateVal)}
                  placeholder={accSetLang(
                    "businessSettings.placeholder.EnterCity"
                  )}
                  {...register("businessAddress.city")}
                />
              ) : (
                <>
                  <Controller
                    control={control}
                    name="businessAddress.city"
                    render={({ field }) => (
                      <Select
                        {...field}
                        disabled={!(CountryVal && StateVal)}
                        options={citiesOptions}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        optionLabel="label"
                        optionValue="value"
                        placeholder={accSetLang(
                          "businessSettings.placeholder.Select"
                        )}
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
              {errors?.businessAddress?.city && (
                <small className="error-txt">
                  {errors.businessAddress.city.message}
                </small>
              )}
            </div>
            <div className="forms-group wid-100">
              <label className="f-g-label st-space-mt">
                {accSetLang("businessSettings.fields.Pincode")}
              </label>
              <InputField
                type="text"
                disabled={!(CountryVal && StateVal && CityVal)}
                placeholder={accSetLang(
                  "businessSettings.placeholder.EnterPincode"
                )}
                {...register("businessAddress.pinCode")}
              />
              {errors?.businessAddress?.pinCode && (
                <small className="error-txt">
                  {errors.businessAddress.pinCode.message}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {accSetLang("businessSettings.fields.TimeZone")}
              </label>

              <Controller
                control={control}
                name="timeZone"
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    options={timeZoneOptions}
                    placeholder={accSetLang(
                      "businessSettings.placeholder.Select"
                    )}
                    filter={true}
                    filterBy="name"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                  />
                )}
              />
              {errors.timeZone && (
                <small className="error-txt">{errors.timeZone.message}</small>
              )}
            </div>
            <div className="forms-group wid-100" />
          </div>
        </div>

        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {accSetLang("businessSettings.fields.PhoneNumber")}
              </label>

              {isEditingPhone || !data?.data?.phoneNo ? (
                <Controller
                  control={control}
                  name="phoneNo"
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput
                      inputStyle={{ width: "100%" }}
                      country={coutryCode?.toLowerCase() || "in"}
                      value={
                        value
                          ? `${watch("countryCode").replace("+", "")}${value}`
                          : ""
                      }
                      onChange={(phoneValue: string, country: CountryData) => {
                        const extractedCountryCode = `+${country.dialCode}`;
                        const phoneNumber = phoneValue
                          .replace(country.dialCode, "")
                          .trim();

                        setValue("countryCode", extractedCountryCode); // update country code separately
                        onChange(phoneNumber); // phoneNo stays just the number
                      }}
                    // placeholder={t("manualLogin.phoneNo.placeHolder")}
                    />
                  )}
                />
              ) : (
                <div className="input-badge-container">
                  <input
                    type="text"
                    placeholder="+91 76847 XXXXX"
                    value={
                      data?.data?.countryCode && data?.data?.phoneNo
                        ? `${data.data.countryCode} ${data.data.phoneNo}`
                        : ""
                    }
                    readOnly
                  />
                  {data?.data?.isPhoneNoVerified ? (
                    <span className="verified-badge">
                      <>
                        {" "}
                        <TickGreenIcon className="tick-icon" />{" "}
                        {accSetLang("businessSettings.fields.Verified")}
                      </>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {(errors?.phoneNo || isPhoneChanged) && (
                <small className="error-txt">{errors?.phoneNo?.message}</small>
              )}
            </div>

            <div className="forms-group wid-100">
              <>
                <div className="verification-group">
                  {data?.data?.phoneNo && (
                    <span>
                      <Buttons
                        type="button"
                        text={
                          isEditingPhone
                            ? accSetLang("businessSettings.fields.Cancel")
                            : accSetLang("businessSettings.fields.ChangeNumber")
                        }
                        className="btn-plain-txt"
                        subClassName="link-btn-dark"
                        onClick={() => {
                          setIsEditingPhone((prev) => {
                            const newEditingState = !prev;

                            if (newEditingState) {
                              // Entering edit mode
                              setPhoneVerified(false);
                              setIsPhoneChanged(true);
                            } else {
                              // Cancelling edit
                              setPhoneVerified(false);
                              setIsPhoneChanged(false);
                            }

                            return newEditingState;
                          });
                        }}
                      />
                    </span>
                  )}

                  {(isEditingPhone || !data?.data?.phoneNo) && (
                    <span>
                      <Buttons
                        type="button"
                        disabled={!getValues("phoneNo")?.trim()}
                        text={accSetLang(
                          "businessSettings.fields.VerifyNumber"
                        )}
                        className="btn-plain-txt st-space-ml-10"
                        subClassName="link-btn-dark btn-red-color"
                        onClick={handleSendPhoneOtp}
                      />
                    </span>
                  )}
                </div>
              </>
            </div>
          </div>

          {fields.map((item, index) => (
            <div className="forms-button-gaps" key={item.id}>
              <div className="forms-group">
                <div className="label-flex">
                  <label className="f-g-label">
                    {accSetLang(
                      "businessSettings.fields.AdditionalMobileNumber"
                    )}
                  </label>
                  <Buttons
                    type="button"
                    text="Remove"
                    className="btn-plain-txt"
                    subClassName="link-btn-dark"
                    onClick={() => remove(index)}
                  />
                </div>
                <div className="input-group-left">
                  <Controller
                    control={control}
                    name={`additionalPhoneNo.${index}`}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        country={country?.country_code.toLowerCase() || "in"}
                        value={`${(value?.countryCode || "+91").replace(
                          "+",
                          ""
                        )}${value?.number ?? ""}`}
                        onChange={(
                          phoneValue: string,
                          country: CountryData
                        ) => {
                          const countryCode = `+${country.dialCode}`;
                          const number = phoneValue
                            .replace(country.dialCode, "")
                            .replace(/^0+/, "");
                          onChange({ countryCode, number });
                        }}
                      />
                    )}
                  />
                </div>
                {errors.additionalPhoneNo?.[index] && (
                  <small className="error-txt">
                    {errors.additionalPhoneNo[index]?.number?.message ||
                      errors.additionalPhoneNo[index]?.countryCode?.message}
                  </small>
                )}
              </div>
            </div>
          ))}

          <div>
            <Buttons
              type="button"
              text={accSetLang("businessSettings.fields.AddNumber")}
              className="btn-plain-txt"
              subClassName="link-btn-dark"
              onClick={handleAddNumber}
            ></Buttons>
          </div>
        </div>

        <div className="forms-group">
          <div className="f-g-input-horiz">
            <div className="forms-group wid-100">
              <label className="f-g-label">
                {accSetLang("businessSettings.fields.Email")}
              </label>
              {isEditingEmail || !data?.data?.email ? (
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <InputField
                      placeholder={accSetLang(
                        "businessSettings.placeholder.EnterEmail"
                      )}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setIsEmailChanged(true);
                        setEmailVerified(false);
                      }}
                    />
                  )}
                />
              ) : (
                <div className="input-badge-container">
                  <input
                    type="text"
                    value={data?.data?.email ? `${data.data.email} ` : ""}
                    readOnly
                  />
                  {data?.data?.isEmailVerified ? (
                    <span className="verified-badge">
                      <>
                        {" "}
                        <TickGreenIcon className="tick-icon" />{" "}
                        {accSetLang("businessSettings.fields.Verified")}
                      </>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}
              {(errors?.email || isEditingEmail) && (
                <small className="error-txt">{errors?.email?.message}</small>
              )}
            </div>

            <div className="forms-group wid-100">
              <div className="verification-group">
                {data?.data?.email && (
                  <Buttons
                    type="button"
                    text={
                      isEditingEmail
                        ? accSetLang("businessSettings.fields.Cancel")
                        : accSetLang("businessSettings.fields.ChangeEmail")
                    }
                    className="btn-plain-txt"
                    subClassName="link-btn-dark"
                    onClick={() => {
                      setIsEditingEmail((prev) => {
                        const newEditingState = !prev;

                        if (newEditingState) {
                          // Entering email edit mode
                          setEmailVerified(false);
                          setIsEmailChanged(true);
                        } else {
                          // Cancelling email edit
                          if (!getValues("email")?.trim()) {
                            setError("email", {
                              type: "manual",
                              message: "Email is required",
                            });
                            setIsEmailChanged(true); // keep in edit mode until fixed
                          } else {
                            clearErrors("email");
                            setEmailVerified(false);
                            setIsEmailChanged(false);
                          }
                        }

                        return newEditingState;
                      });
                    }}
                  />
                )}

                {(isEditingEmail || !data?.data?.email) && (
                  <span>
                    <Buttons
                      type="button"
                      disabled={!getValues("email")?.trim()}
                      text={accSetLang("businessSettings.fields.VerifyEmail")}
                      className="btn-plain-txt st-space-ml-10"
                      subClassName="link-btn-dark btn-red-color"
                      onClick={handleSendEmailOtp}
                    ></Buttons>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SettingsButtons
        cancelRoute={`./`}
        isSubmitting={isLoading}
        disabled={!isSaveEnabled}
      />
      <DynamicOtpDialog
        visible={openOtpDialog}
        onClose={() => setOpenOtpDialog(false)}
        otpType={otpType}
        hashCredential=""
        payload={otpPayload}
        setOtpType={() => { }}
        setHashCredential={() => { }}
        setPatchCall={() => { }}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </form>
  );
};

export default BusinessSettings;
