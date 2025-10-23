"use client";

import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useSession from "@/app/[locale]/_hooks/useSession";
import {
  BusinessRepresentativeData,
  BusinessTypePathEnum,
  OnBoardingFormEnum,
} from "@/app/[locale]/_interface/OnboardInterface";
import {
  useGetStageDetailDataQuery,
  useUpdateRepresentativeDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { businessRepresentativeSchema } from "@/app/[locale]/_validationSchema/onboard";
import "@/app/[locale]/dev_styles.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import RightArrow from "../../../../../../../assets/img/icons/arrow-right.svg";
import Typography from "../../../../../_components/Base/Typography";
import ButtonIconRight from "../../../../../_components/Buttons/ButtonIconRight";

export default function Page({ params }: { params: Promise<any> }) {
  const cookies = useCookies();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("businessRepresentative");

  const phone = useAppSelector(
    (state: RootState) => state.onboardingData.phoneNo
  );
  const userCountryCode = useAppSelector(
    (state: RootState) => state.onboardingData.countryCode
  );
  const userEmail = useAppSelector(
    (state: RootState) => state.onboardingData.email
  );

  const businessType = useAppSelector(
    (state: RootState) => state.onboardingData.businessType
  );
  const stage = useAppSelector(
    (state: RootState) => state.onboardingData.stage
  );

  const country = useAppSelector(
    (state: RootState) => state.location.country_code
  );
  const { loadSession } = useSession();

  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessRepresentativeData>({
    resolver: zodResolver(businessRepresentativeSchema(businessType)) as any,
    // mode:"onChange",
    defaultValues: {
      jobTitle: "",
      firstName: "",
      middleName: "",
      lastName: "",
      workEmail: userEmail ?? "",
      workPhoneNo: {
        countryCode: userCountryCode ?? "",
        number: phone ?? "",
      },
    },
  });

  const { data, isSuccess, refetch } = useGetStageDetailDataQuery(
    {
      stage: OnBoardingFormEnum.businessRepresentative,
    },
    { skip: stage[OnBoardingFormEnum.businessRepresentative] !== "completed" }
  );

  const [updateRepresentativeDetails] =
    useUpdateRepresentativeDetailsMutation();

  useEffect(() => {
    if (stage[OnBoardingFormEnum.businessRepresentative] === "completed")
      refetch();
  }, [stage]);

  useEffect(() => {
    if (data && isSuccess) {
      reset({
        workPhoneNo: data?.data?.workPhoneNo ?? {},
        workEmail: data?.data?.workEmail ?? "",
        firstName: data?.data?.firstName ?? "",
        middleName: data?.data?.middleName ?? "",
        lastName: data?.data?.lastName ?? "",
        jobTitle: data?.data?.jobTitle ?? "",
      });
    }
  }, [data, isSuccess]);

  const onSubmit = async (data: BusinessRepresentativeData) => {
    const skipCacheUpdate = businessType !== "unregister";
    try {
      const response = await updateRepresentativeDetails({
        ...data,
        skipCacheUpdate,
      }).unwrap();
      // debugger;
      if (businessType !== "unregister" && response?.data?.userVerified) {
        cookies.deleteCookie("onboardSession");
        cookies.setCookie("userSession", response?.data?.userSession, 2);
        router.push(`/${locale}/app`);
        loadSession();
      }
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Error updating business representative details",
          theme: "error",
        })
      );
    }
  };

  const handleBackClick = () => {
    businessType === "unregister"
      ? router.push(
          `/${locale}/onboard/${BusinessTypePathEnum.businessDetails}`
        )
      : router.push(
          `/${locale}/onboard/${BusinessTypePathEnum.contactInformation}`
        );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="forms-container form-gaps pad-unset form-arrow"
    >
      <button
        type="button"
        className="btn-comp form-back"
        onClick={handleBackClick}
      >
        <span className="material-symbols-rounded">chevron_left</span>
      </button>

      <div className="form-gaps">
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("title")}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {t("description")}
          </Typography>
        </div>

        <div className="forms-button-gaps">
          {/* First Name */}
          <div className="forms-group">
            <label className="f-g-label">{t("firstName.label")}</label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  // placeholder={t("firstName.placeholder")}
                />
              )}
            />
            {errors.firstName && (
              <span className="error-txt">{errors.firstName.message}</span>
            )}
            {!errors.firstName && (
              <span className="helper-txt">{t("firstName.helper")}</span>
            )}
          </div>

          {/* Middle Name */}
          <div className="forms-group">
            <label className="f-g-label">{t("midName.label")}</label>
            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  // placeholder={t("midName.placeholder")}
                />
              )}
            />
            {errors.middleName && (
              <span className="error-txt">{errors.middleName.message}</span>
            )}
            {!errors.middleName && (
              <span className="helper-txt">{t("midName.helper")}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="forms-group">
            <label className="f-g-label">{t("lastName.label")}</label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  // placeholder={t("lastName.placeholder")}
                />
              )}
            />
            {errors.lastName && (
              <span className="error-txt">{errors.lastName.message}</span>
            )}
            {!errors.lastName && (
              <span className="helper-txt">{t("lastName.helper")}</span>
            )}
          </div>

          {/* Email */}
          <div className="forms-group">
            <label className="f-g-label">{t("email.label")}</label>
            <Controller
              name="workEmail"
              control={control}
              render={({ field }) => (
                <InputField {...field} placeholder={t("email.placeholder")} />
              )}
            />
            {errors.workEmail && (
              <span className="error-txt">{errors.workEmail.message}</span>
            )}
            {!errors.workEmail && (
              <span className="helper-txt">{t("email.helper")}</span>
            )}
          </div>

          {/* Job Title */}
          {businessType !== "unregister" && (
            <div className="forms-group">
              <label className="f-g-label">{t("jobTitle.label")}</label>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder={t("jobTitle.placeholder")}
                  />
                )}
              />
              {errors.jobTitle && (
                <span className="error-txt">{errors.jobTitle.message}</span>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div className="forms-group">
            <label className="f-g-label">{t("phoneNo.label")}</label>
            {/* <PhoneInput
                country={watch("country") || country?.country_code}
                value={`${countryCode.replace("+", "")}${
                  watch("phoneNo") || ""
                }`}
                onChange={handleOnChange}
              /> */}
            <Controller
              name="workPhoneNo"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country={country?.toLowerCase()}
                  value={
                    field.value?.countryCode && field.value?.number
                      ? `${field.value.countryCode.replace("+", "")}${
                          field.value.number
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
                  placeholder={t("phoneNo.placeholder")}
                />
              )}
            />
            {errors.workPhoneNo?.number && (
              <span className="error-txt">
                {errors.workPhoneNo.number.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <ButtonIconRight
        name={isSubmitting ? t("buttons.processing") : t("buttons.continue")}
        icon={RightArrow}
        className={"wid-100"}
        onClick={handleSubmit(onSubmit)}
        disabled={
          isSubmitting ||
          !(
            stage?.[OnBoardingFormEnum.businessRepresentative] ===
              "completed" ||
            stage?.[OnBoardingFormEnum.businessRepresentative] === "active"
          )
        }
      />
    </form>
  );
}
