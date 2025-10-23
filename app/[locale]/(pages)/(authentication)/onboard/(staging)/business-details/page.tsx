"use client";

import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import {
  BusinessDetailsData,
  OnBoardingFormEnum,
} from "@/app/[locale]/_interface/OnboardInterface";
import {
  useGetStageDetailDataQuery,
  usePostBusinessDetailsMutation,
  useUpdateBusinessDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { businessDetailsSchema } from "@/app/[locale]/_validationSchema/onboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RightArrow from "../../../../../../../assets/img/icons/arrow-right.svg";
import Typography from "../../../../../_components/Base/Typography";
import ButtonIconRight from "../../../../../_components/Buttons/ButtonIconRight";
import BusinessTypeCard from "../../../../../_components/OnBoarding/BusinessTypeCard";

const Page = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations("businessDetails");
  const reduxStage = useAppSelector(
    (state: RootState) => state.onboardingData.stage
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailsData>({
    defaultValues: {
      businessLocation: {},
      businessType: undefined,
    },
    resolver: zodResolver(businessDetailsSchema),
  });

  const [countries, setCountries] = useState<
    { label: string; value: { code: string; name: string } }[]
  >([]);

  const {
    data: businessDetails,
    isSuccess,
    refetch,
  } = useGetStageDetailDataQuery(
    {
      stage: OnBoardingFormEnum.businessDetails,
    },
    { skip: reduxStage[OnBoardingFormEnum.businessDetails] !== "completed" }
  );

  const countryCode = useAppSelector(
    (state: RootState) => state.location.country_code
  );

  
  const [postBusinessDetails] = usePostBusinessDetailsMutation();

  const [updateBusinessDetails] = useUpdateBusinessDetailsMutation();

  useEffect(() => {
    if (reduxStage[OnBoardingFormEnum.businessDetails] === "completed")
      refetch();
  }, [reduxStage]);

  useEffect(() => {
    if (businessDetails && isSuccess) {
      reset({
        businessLocation: businessDetails.data.businessLocation,
        businessType: businessDetails.data.businessType,
      });
    }
  }, [businessDetails, isSuccess]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const countryList = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: { code: country.isoCode, name: country.name },
      }));
      setCountries(countryList);
    }
  }, []);

  useEffect(() => {
    if (!businessDetails?.data?.businessLocation && countries.length > 0) {
      const country = countries.find((c) => c.value.code === countryCode);
      if (country) setValue("businessLocation", country.value);
    }
  }, [businessDetails?.data?.businessLocation, countryCode, countries]);

  const businessTypeList = [
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

  const onSubmit = async (data: BusinessDetailsData) => {
    try {
      const isCompleted =
        reduxStage[OnBoardingFormEnum.businessDetails] === "completed";

      if (isCompleted) {
        await updateBusinessDetails(data).unwrap();
      } else {
        await postBusinessDetails(data).unwrap();
      }
    } catch (error) {
      // console.error("Error updating business details:", error);
      dispatch(
        showToast({
          title: "Error!",
          message: "Error updating business details",
          theme: "error",
        })
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="forms-container form-gaps pad-unset"
    >
      <div className="form-gaps">
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("title")}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {t("subtitle")}
          </Typography>
        </div>

        {/* Business Location */}
        <div className="forms-group">
          <div className="label-flex">
            <label htmlFor="businessLocation">{t("businessLocation")}</label>
          </div>
          <Controller
            control={control}
            name="businessLocation"
            rules={{ required: t("errors.businessLocation") }}
            render={({ field }) => (
              <Select
                id="businessLocation"
                options={countries || []}
                optionValue="value"
                optionLabel="label"
                placeholder={t("businessLocationPlaceholder")}
                value={field.value}
                onChange={field.onChange}
                filter={true}
                filterBy="label"
                virtualScrollerOptions={{
                  itemSize: 40,
                }}
              />
            )}
          />
          {errors?.businessLocation?.name && (
            <p className="error-txt">
              {String(errors.businessLocation.name.message)}
            </p>
          )}
        </div>

        {/* Business Type */}
        <div className="forms-group">
          <div className="label-flex">
            <label>{t("businessType")}</label>
          </div>
          <div className="business-type-group">
            {businessTypeList.map((type) => (
              <BusinessTypeCard
                key={type.id}
                htmlFor={type.value}
                name={type.title}
                subtitle={type.subtitle}
                value={type.value}
                register={register}
              />
            ))}
          </div>
          {errors.businessType && (
            <p className="error-txt">{String(errors.businessType.message)}</p>
          )}
        </div>
      </div>

      <ButtonIconRight
        name={isSubmitting ? t("processing") : t("continue")}
        icon={RightArrow}
        className={"wid-100"}
        disabled={
          isSubmitting
          // ||
          // !(
          //   reduxStage?.[OnBoardingFormEnum.businessDetails] === "completed" ||
          //   reduxStage?.[OnBoardingFormEnum.businessDetails] === "active"
          // )
        }
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
};

export default Page;
