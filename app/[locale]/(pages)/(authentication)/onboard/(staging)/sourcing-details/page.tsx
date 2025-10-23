"use client";

import ChipInputs from "@/app/[locale]/_components/StoreFront/Forms/ChipInputs";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useSession from "@/app/[locale]/_hooks/useSession";
import { CategoriesListInterface } from "@/app/[locale]/_interface/common";
import {
  BusinessTypePathEnum,
  OnBoardingFormEnum,
  SourcingDetailsData,
} from "@/app/[locale]/_interface/OnboardInterface";
import { useLazyGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import {
  useGetStageDetailDataQuery,
  useUpdateSourcingDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { sourcingDetailsSchema } from "@/app/[locale]/_validationSchema/onboard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import RightArrow from "../../../../../../../assets/img/icons/arrow-right.svg";
import Typography from "../../../../../_components/Base/Typography";
import ButtonIconRight from "../../../../../_components/Buttons/ButtonIconRight";

export default function Page({ params }: { params: Promise<any> }) {
  const cookies = useCookies();
  const t = useTranslations("personalInformation");
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loadSession } = useSession();
  let stage = useAppSelector((state: RootState) => state.onboardingData.stage);
  const userEmail = useAppSelector(
    (state: RootState) => state.onboardingData.email
  );
  const [options, setOptions] = useState<CategoriesListInterface[]>([]);
  const fetchedOnce = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SourcingDetailsData>({
    resolver: zodResolver(sourcingDetailsSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      workEmail: userEmail ?? "",
      industry: {},
      mainProducts: [],
      website: "",
      legalBusinessName: "",
    },
  });

  const { data, isSuccess, refetch } = useGetStageDetailDataQuery(
    {
      stage: OnBoardingFormEnum.sourcingDetails,
    },
    { skip: stage[OnBoardingFormEnum.sourcingDetails] !== "completed" }
  );

  const [triggerFetch, { isFetching }] = useLazyGetCategoryListQuery();

  const [updateSourcingDetails] = useUpdateSourcingDetailsMutation();

  useEffect(() => {
    if (stage[OnBoardingFormEnum.sourcingDetails] === "completed") refetch();
  }, [stage]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      reset({
        firstName: data?.data?.firstName || "",
        middleName: data?.data?.middleName || "",
        lastName: data?.data?.lastName || "",
        workEmail: data?.data?.workEmail || "",
        industry: data?.data?.industry || {},
        mainProducts: data?.data?.productISource || [],
        website: data?.data?.website || "",
        legalBusinessName: data?.data?.legalBusinessName || "",
      });
      setOptions(data?.data?.industry ? [data?.data?.industry] : []);
    }
  }, [data, isSuccess]);

  const onSubmit = async (data: SourcingDetailsData) => {
    try {
      const response = await updateSourcingDetails({
        ...data,
        skipCacheUpdate: true,
      }).unwrap();
      // debugger;
      if (response?.data?.userVerified) {
        cookies.deleteCookie("onboardSession");
        cookies.setCookie("userSession", response?.data?.userSession, 2);
        router.push(`/${locale}/app`);
        loadSession();
      }
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Error updating sourcing details",
          theme: "error",
        })
      );
    }
  };

  const handleBackClick = () => {
    router.push(`/${locale}/onboard/${BusinessTypePathEnum.businessDetails}`);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (search = "") => {
    const res = await triggerFetch({ search });
    if ("data" in res && res.data?.data) {
      // setOptions((prev) => {
      //   const existingIds = new Set(prev.map((item) => item._id));
      //   const newItems = res.data!.data.filter(
      //     (item) => !existingIds.has(item._id)
      //   );
      //   return [...prev, ...newItems];
      // });
      // fetchedOnce.current = true;
      // const optionsList = res.data.data.map((d) => {
      //   const { liveUrl, ...restData } = d;
      //   return restData;
      // });
      const optionsList = res.data.data.map((d) => ({
        _id: d?._id,
        uniqueId: d?.uniqueId,
        name: d?.name,
        liveUrl: d?.liveUrl ?? "",
      }));

      setOptions(optionsList);
    }
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
            {t("subtitle")}
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
                  placeholder={t("firstName.placeholder")}
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
                <InputField {...field} placeholder={t("midName.placeholder")} />
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
                  placeholder={t("lastName.placeholder")}
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

          {/* Industry */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="industry" className="f-g-label">
                {t("industry.label")}
              </label>
            </div>
            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={options}
                  optionLabel="name"
                  placeholder={t("industry.placeholder")}
                  filter
                  // onFilterChange={handleFilterChange}
                  filterBy="name"
                  virtualScrollerOptions={{
                    itemSize: 40,
                    // lazy: true,
                    // loading: isFetching,
                    // showLoader: true,
                    // onLazyLoad: () => handleDropdownOpen(),
                  }}
                  className="category-multi-select"
                />
              )}
            />
            {errors.industry?._id && (
              <span className="error-txt">
                {String(errors.industry._id.message)}
              </span>
            )}
          </div>

          {/* Product I source */}
          <div className="forms-group">
            <div className="label-flex">
              <label className="f-g-label">{t("productISource.label")}</label>
            </div>
            <Controller
              control={control}
              name="mainProducts"
              render={({ field }) => (
                <ChipInputs
                  value={field.value}
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
                  placeholder={t("productISource.placeholder")}
                />
              )}
            />
            {errors.mainProducts && (
              <span className="error-txt">{errors.mainProducts.message}</span>
            )}
            {Array.isArray(errors?.mainProducts) &&
              errors?.mainProducts?.map(
                (err, idx) =>
                  err?.message && (
                    <span key={idx} className="error-txt">
                      {`Item ${idx + 1}: ${err.message}`}
                    </span>
                  )
              )}
            {!errors.mainProducts && (
              <span className="helper-txt">{t("productISource.helper")}</span>
            )}
          </div>
          {/* Website */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="website" className="f-g-label">
                {t("website.label")}
              </label>
            </div>
            <InputField
              {...register("website")}
              id="website"
              placeholder={t("website.placeholder")}
              type="text"
            />
            {errors.website && (
              <span className="error-txt">
                {String(errors.website.message)}
              </span>
            )}
            {!errors.website && (
              <span className="helper-txt">{t("website.helper")}</span>
            )}
          </div>

          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="businessName" className="f-g-label">
                {t("businessName.label")}
              </label>
            </div>
            <InputField
              {...register("legalBusinessName")}
              id="businessName"
              placeholder={t("businessName.placeholder")}
              type="text"
            />
            {errors.legalBusinessName && (
              <span className="error-txt">
                {String(errors.legalBusinessName.message)}
              </span>
            )}
          </div>
        </div>
      </div>

      <ButtonIconRight
        name={isSubmitting ? t("processing") : t("continue")}
        icon={RightArrow}
        className={"wid-100 btn-c-dark"}
        onClick={handleSubmit(onSubmit)}
        disabled={
          isSubmitting ||
          !(
            stage?.[OnBoardingFormEnum.sourcingDetails] === "completed" ||
            stage?.[OnBoardingFormEnum.sourcingDetails] === "active"
          )
        }
      />
    </form>
  );
}
