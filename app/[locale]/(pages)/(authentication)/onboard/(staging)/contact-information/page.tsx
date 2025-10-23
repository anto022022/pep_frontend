"use client";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { countryBasedStates } from "@/app/[locale]/_interface/BusinessProfile";
import {
  BusinessTypePathEnum,
  ContactInformationData,
  OnBoardingFormEnum,
} from "@/app/[locale]/_interface/OnboardInterface";
import {
  useGetStageDetailDataQuery,
  useUpdateContactInformationMutation,
} from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { contactInformationSchema } from "@/app/[locale]/_validationSchema/onboard";
import '@/app/[locale]/dev_styles.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import RightArrow from "../../../../../../../assets/img/icons/arrow-right.svg";
import Typography from "../../../../../_components/Base/Typography";
import ButtonIconRight from "../../../../../_components/Buttons/ButtonIconRight";

export default function Page({ params }: { params: Promise<any> }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("contactInformation");
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";

  const country = useAppSelector(
    (state: RootState) => state.location.country_code
  );

  const phone = useAppSelector(
    (state: RootState) => state.onboardingData.phoneNo
  );
  const userCountryCode = useAppSelector(
    (state: RootState) => state.onboardingData.countryCode
  );
  const userEmail = useAppSelector(
    (state: RootState) => state.onboardingData.email
  );
  let stage = useAppSelector((state: RootState) => state.onboardingData.stage);

  const [countries, setCountries] = useState<
    {
      label: string;
      value: { name: string; code: string };
    }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<countryBasedStates[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<countryBasedStates | null>(
    null
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactInformationData>({
    defaultValues: {
      businessPhoneNo: {
        countryCode: userCountryCode ?? "",
        number: phone ?? ""
      },
      businessEmail: userEmail ?? "",
      businessAddress: {},
    },
    resolver: zodResolver(contactInformationSchema),
  });

  const {
    data: contactInformation,
    isSuccess,
    refetch,
  } = useGetStageDetailDataQuery(
    {
      stage: OnBoardingFormEnum.contactInformation,
    },
    { skip: stage[OnBoardingFormEnum.contactInformation] !== "completed" }
  );

  const [updateContactInformation] = useUpdateContactInformationMutation();

  useEffect(() => {
    if (stage[OnBoardingFormEnum.contactInformation] === "completed") refetch();
  }, [stage]);

  useEffect(() => {
    const countryList = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: { name: country.name, code: country.isoCode },
    }));
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
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
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry?.code && selectedState?.isoCode) {
      const selectCity = City.getCitiesOfState(
        selectedCountry?.code,
        selectedState?.isoCode
      ).map((city) => ({ label: city.name, value: city.name }));
      setCities(selectCity);
    }
  }, [selectedState, selectedCountry]);

  useEffect(() => {
    if (contactInformation && isSuccess) {
      reset({
        businessPhoneNo: contactInformation?.data?.businessPhoneNo ?? {},
        businessEmail: contactInformation?.data?.businessEmail ?? "",
        businessAddress: contactInformation?.data?.businessAddress ?? {},
      });
      setSelectedCountry(
        contactInformation?.data?.businessAddress?.country ?? null
      );
      const countryBasedStateList = State?.getStatesOfCountry(
        contactInformation?.data?.businessAddress?.country?.code
      )?.map((stateDetails) => ({
        name: stateDetails?.name ?? "",
        longitude: stateDetails?.longitude ?? null,
        latitude: stateDetails?.latitude ?? null,
        isoCode: stateDetails?.isoCode ?? "",
        countryCode: stateDetails?.countryCode ?? "",
      }));
      const matchedState = countryBasedStateList?.find(
        (state) =>
          state?.name === contactInformation?.data?.businessAddress?.state
      );
      setSelectedState(matchedState as countryBasedStates);
    }
  }, [contactInformation, isSuccess]);

  const onSubmit = async (data: ContactInformationData) => {
    try {
      await updateContactInformation(data).unwrap();
    } catch (error) {
      // console.error("Error updating contact information:", error);
      dispatch(
        showToast({
          title: "Error!",
          message: "Error updating contact information",
          theme: "error",
        })
      );
    }
  };

  const handleBackClick = () => {
    router.push(`/${locale}/onboard/${BusinessTypePathEnum.businessOperation}`);
  };

  return (
    <div className="forms-container form-gaps pad-unset form-arrow">
      <button
        type="button"
        className="btn-comp form-back"
        onClick={handleBackClick}
      >
        <span className="material-symbols-rounded">chevron_left</span>
      </button>

      <form className="form-gaps" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("title")}{" "}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {t("subtitle")}
          </Typography>
        </div>

        <div className="forms-button-gaps">
          {/* Phone Number */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="businessPhoneNo" className="f-g-label">
                {t("fields.phoneNo.label")}
              </label>
            </div>
            <Controller
              name="businessPhoneNo"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country={country?.toLowerCase()}
                  value={
                    field.value?.countryCode && field.value?.number
                      ? `${field.value.countryCode.replace("+", "")}${field.value.number
                      }`
                      : ""
                  }
                  onChange={(value, country: CountryData) => {
                    const dialCode = country?.dialCode || "";
                    const nationalNumber = value.slice(dialCode.length);
                    field.onChange({
                      countryCode: `+${dialCode}`,
                      number: nationalNumber,
                    });
                  }}
                  inputProps={{
                    name: field.name,
                    id: "businessPhoneNo",
                  }}
                  inputStyle={{
                    width: "100%",
                  }}
                  placeholder="9876543210"
                />
              )}
            />
            {errors.businessPhoneNo?.number && (
              <span className="error-txt">
                {errors.businessPhoneNo.number.message}
              </span>
            )}
            {!errors.businessPhoneNo?.number && (
              <span className="helper-txt">
                <span className="helper-txt">{t("fields.phoneNo.helper")}</span>
              </span>
            )}
          </div>

          {/* Business Email */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="businessEmail" className="f-g-label">{t("fields.email.label")}</label>
            </div>
            <InputField
              {...register("businessEmail")}
              id="businessEmail"
              placeholder="example@gmail.com"
              type="email"
            />
            {errors.businessEmail && (
              <span className="error-txt">{errors.businessEmail.message}</span>
            )}
            {!errors.businessEmail && (
              <span className="helper-txt">{t("fields.email.helper")}</span>
            )}
          </div>

          {/* Address Section */}
          <div className="forms-group">
            <div className="label-flex l-f-col">
              <label htmlFor="businessAddress" className="f-g-label">
                {t("fields.businessAddress.title")}
              </label>
              {/* {!errors.businessAddress?.country && (
                <Typography variant="span" className="helper-txt">
                  {t("fields.businessAddress.helper")}
                </Typography>
              )} */}
            </div>
            <div className="inputs-wrap">
              {/* Country */}
              <Controller
                control={control}
                name="businessAddress.country"
                rules={{ required: t("fields.businessAddress.country.error") }}
                render={({ field }) => (
                  <Select
                    options={countries || []}
                    optionValue="value"
                    optionLabel="label"
                    placeholder={t(
                      "fields.businessAddress.country.placeholder"
                    )}
                    value={field.value}
                    // onChange={(val) => {
                    //   if (val?.code !== field.value.code) {
                    //     setSelectedState(null);
                    //     setValue("businessAddress.state", "");
                    //     setValue("businessAddress.city", "");
                    //   }
                    //   setSelectedCountry(val);
                    //   field.onChange(val);
                    // }}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedCountry(e);
                    }}
                    filter={true}
                    filterBy="label"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                  />
                )}
              />
              {errors.businessAddress?.country && (
                <span className="error-txt">
                  {errors.businessAddress.country.message}
                </span>
              )}

              {/* Street Address */}
              <InputField
                {...register("businessAddress.addressLine")}
                placeholder={t(
                  "fields.businessAddress.streetAddress.placeholder"
                )}
                type="text"
              />
              {errors.businessAddress?.addressLine && (
                <span className="error-txt">
                  {errors.businessAddress.addressLine.message}
                </span>
              )}

              {/*State*/}
              {/* <input
                {...register("businessAddress.state")}
                className="forms-input"
                placeholder={t(
                  "fields.businessAddress.apartmentUnitOrOther.placeholder"
                )}
                type="text"
              /> */}
              <Controller
                name="businessAddress.state"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      disabled={stateOptions?.length === 0}
                      options={stateOptions}
                      optionLabel="name"
                      value={selectedState}
                      onChange={(e) => {
                        if (e.name !== selectedState?.name) {
                          setSelectedState(e);
                          setValue("businessAddress.city", "");
                        }
                        field.onChange(e.name);
                      }}
                      filter={true}
                      filterBy="name"
                      virtualScrollerOptions={{
                        itemSize: 40,
                      }}
                      placeholder={t(
                        "fields.businessAddress.apartmentUnitOrOther.placeholder"
                      )}
                    />
                  );
                }}
              />
              {errors.businessAddress?.state && (
                <span className="error-txt">
                  {errors.businessAddress?.state?.message}
                </span>
              )}

              {/* City/Town */}
              <Controller
                control={control}
                name="businessAddress.city"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={cities}
                    optionLabel="label"
                    optionValue="value"
                    disabled={cities.length === 0}
                    placeholder={t(
                      "fields.businessAddress.cityTown.placeholder"
                    )}
                    onChange={(value) => field.onChange(value)}
                    filter={true}
                    filterBy="label"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                  />
                )}
              />
              {errors.businessAddress?.city && (
                <span className="error-txt">
                  {errors.businessAddress.city.message}
                </span>
              )}

              {/* Postal Code */}
              <InputField
                {...register("businessAddress.pinCode")}
                placeholder={t("fields.businessAddress.postalCode.placeholder")}
                type="text"
              />
              {errors.businessAddress?.pinCode && (
                <span className="error-txt">
                  {errors.businessAddress.pinCode.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
      <ButtonIconRight
        name={isSubmitting ? t("buttons.processing") : t("buttons.continue")}
        icon={RightArrow}
        className={"wid-100 btn-c-dark"}
        onClick={handleSubmit(onSubmit)}
        disabled={
          isSubmitting ||
          !(
            stage?.[OnBoardingFormEnum.contactInformation] === "completed" ||
            stage?.[OnBoardingFormEnum.contactInformation] === "active"
          )
        }
      />
    </div>
  );
}
