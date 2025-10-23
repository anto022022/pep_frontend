"use client";

import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useSession from "@/app/[locale]/_hooks/useSession";

import {
  BusinessOperationData,
  BusinessTypePathEnum,
  CategoriesListInterface,
  OnBoardingFormEnum,
} from "@/app/[locale]/_interface/OnboardInterface";
import { useLazyGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import {
  useGetStageDetailDataQuery,
  useUpdateBusinessOperationMutation,
} from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { businessOperationSchema } from "@/app/[locale]/_validationSchema/onboard";
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
  const dispatch = useAppDispatch();
  const t = useTranslations("businessOperation");
  const businessType = useAppSelector(
    (state: RootState) => state.onboardingData.businessType
  );
  const stage = useAppSelector(
    (state: RootState) => state.onboardingData.stage
  );

  const router = useRouter();
  const { loadSession } = useSession();

  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";

  const [options, setOptions] = useState<CategoriesListInterface[]>([]);
  const fetchedOnce = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessOperationData>({
    defaultValues: {
      legalBusinessName: "",
      industry: {},
      website: "",
      productBrief: "",
    },
    resolver: zodResolver(businessOperationSchema(businessType)) as any,
  });

  const {
    data: businessOperation,
    isSuccess,
    refetch,
  } = useGetStageDetailDataQuery(
    {
      stage: OnBoardingFormEnum.businessOperation,
    },
    { skip: stage[OnBoardingFormEnum.businessOperation] !== "completed" }
  );

  const [triggerFetch, { isFetching }] = useLazyGetCategoryListQuery();

  const [updateBusinessOperation] = useUpdateBusinessOperationMutation();

  useEffect(() => {
    if (stage[OnBoardingFormEnum.businessOperation] === "completed") refetch();
  }, [stage]);

  useEffect(() => {
    if (businessOperation && isSuccess) {
      reset({
        legalBusinessName: businessOperation?.data?.legalBusinessName ?? "",
        industry: businessOperation?.data?.industry ?? {},
        website: businessOperation?.data?.website ?? "",
        productBrief: businessOperation?.data?.productBrief ?? "",
      });
      setOptions(
        businessOperation?.data?.industry
          ? [businessOperation?.data?.industry]
          : []
      );
    }
  }, [businessOperation, isSuccess]);

  const onSubmit = async (data: BusinessOperationData) => {
    const skipCacheUpdate = businessType === "unregister";
    try {
      const response = await updateBusinessOperation({
        ...data,
        skipCacheUpdate,
      }).unwrap();
      if (businessType === "unregister" && response?.data?.userVerified) {
        cookies.deleteCookie("onboardSession");
        cookies.setCookie("userSession", response?.data?.userSession, 2);
        router.push(`/${locale}/app`);
        loadSession();
      }
    } catch (error) {
      // console.error("Error updating userType:", error);
      dispatch(
        showToast({
          title: "Error!",
          message: "Error updating business operation details",
          theme: "error",
        })
      );
    }
  };

  const handleBackClick = () => {
    businessType === "unregister"
      ? router.push(
          `/${locale}/onboard/${BusinessTypePathEnum.businessRepresentative}`
        )
      : router.push(
          `/${locale}/onboard/${BusinessTypePathEnum.businessDetails}`
        );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (search = "") => {
    const res = await triggerFetch({ search });
    if ("data" in res && res.data?.data) {
      // setOptions((prev) => {
      //     if (isFiltering) {
      //       //Replace options completely when filtering
      //       return res?.data?.data ?? prev;
      //     }
      //   const existingIds = new Set(prev.map((item) => item._id));
      //   const newItems = res.data!.data.filter(
      //     (item) => !existingIds.has(item._id)
      //   );
      //   return [...prev, ...newItems];
      // });
      // fetchedOnce.current = true;
      const optionsList = res.data.data.map((d) => {
        const { liveUrl, ...restData } = d;
        return restData;
      });
      setOptions(optionsList);
    }
  };

  const handleFilterChange = (data: string) => {
    fetchCategories(data);
  };

  const handleDropdownOpen = () => {
    if (!fetchedOnce.current) {
      fetchCategories();
    }
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

      <div className="form-gaps">
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("title")}{" "}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {t("subtitle")}
          </Typography>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="forms-button-gaps">
          {businessType !== "unregister" && (
            <div className="forms-group">
              <div className="label-flex">
                <label htmlFor="businessName" className="f-g-label">
                  {t("fields.businessName.label")}
                  <Typography variant="span" className="label-lght-txt">
                    {/* {t("fields.businessName.subtext")} */}
                  </Typography>
                </label>
              </div>
              <InputField
                {...register("legalBusinessName")}
                id="businessName"
                placeholder={t("fields.businessName.placeholder")}
                type="text"
              />
              {errors.legalBusinessName && (
                <span className="error-txt">
                  {String(errors.legalBusinessName.message)}
                </span>
              )}
              {!errors.legalBusinessName && (
                <span className="helper-txt">
                  <span className="helper-txt">
                    {t("fields.businessName.helper")}
                  </span>
                </span>
              )}
            </div>
          )}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="industry" className="f-g-label">
                {t("fields.industry.label")}
              </label>
            </div>
            <Controller
              control={control}
              name="industry"
              rules={{ required: t("fields.industry.error") }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={options}
                  optionLabel="name"
                  placeholder="Select Industry"
                  filter
                  // onFilterChange={(e) => {
                  //   handleFilterChange(e);
                  // }}
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
            <span className="helper-txt">
              <span className="helper-txt">{t("fields.industry.helper")}</span>
            </span>
            {errors.industry?._id && (
              <span className="error-txt">
                {String(errors.industry._id.message)}
              </span>
            )}
          </div>
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="website" className="f-g-label">
                {t("fields.website.label")}
              </label>
            </div>
            <InputField
              {...register("website")}
              id="website"
              placeholder={t("fields.website.placeholder")}
              type="text"
            />
            {errors.website && (
              <span className="error-txt">
                {String(errors.website.message)}
              </span>
            )}
            {!errors.website && (
              <span className="helper-txt">{t("fields.website.helper")}</span>
            )}
          </div>

          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="productServiceDescription" className="f-g-label">
                {t("fields.productServiceDescription.label")}{" "}
              </label>
            </div>
            <textarea
              {...register("productBrief", {
                required: t("fields.productServiceDescription.error"),
              })}
              className="forms-textarea"
              placeholder={t("fields.productServiceDescription.placeholder")}
            ></textarea>
            {errors.productBrief && (
              <span className="error-txt">
                {String(errors.productBrief.message)}
              </span>
            )}
          </div>
        </form>
      </div>
      <ButtonIconRight
        name={isSubmitting ? t("processing") : t("continue")}
        icon={RightArrow}
        className={"wid-100"}
        onClick={handleSubmit(onSubmit)}
        disabled={
          isSubmitting ||
          !(
            stage?.[OnBoardingFormEnum.businessOperation] === "completed" ||
            stage?.[OnBoardingFormEnum.businessOperation] === "active"
          )
        }
      />
    </div>
  );
}
