"use client";

import useCookies from "@/app/[locale]/_hooks/useCookies";
import useMoveStage from "@/app/[locale]/_hooks/useMoveStage";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import RightArrow from "../../../../../../../assets/img/icons/arrow-right.svg";
import Typography from "../../../../../_components/Base/Typography";
import ButtonIconRight from "../../../../../_components/Buttons/ButtonIconRight";

export default function Page({ params }: { params: Promise<any> }) {
  const [loading, setLoading] = useState(false);
  const complianceDetails = useAppSelector(
    (state: any) => state.onboardingData.stageFormData.complianceDetail
  );
  let stage = useAppSelector((state: any) => state.onboardingData.stage);

  const {
    register,
    handleSubmit,
    setValue, // Add setValue to update form values
    formState: { errors },
  } = useForm();

  const cookies = useCookies();
  const dispatch = useAppDispatch();
  const moveStage = useMoveStage();
  const t = useTranslations("compliance");
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";
  // Update form fields when complianceDetails changes
  useEffect(() => {
    if (complianceDetails) {
      setValue("businessName", complianceDetails.businessName || "");
      setValue(
        "companyRegisterNumber",
        complianceDetails.companyRegisterNumber || ""
      );
      setValue(
        "companyRegisterNumber",
        complianceDetails.companyRegisterNumber || ""
      );
      setValue("VATNumber", complianceDetails.VATNumber || "");
    }
  }, [complianceDetails, setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_IDN || "https://identity-api.sandbox.pepagora.org/"}onboarding/update-reg-compliance-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            onboardSession: cookies.getCookie("onboardSession"),
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        // router.push("/onboard/business-operation");
        // dispatch(incrementStageCount());
        moveStage.fetchAndMove("businessOperation", ++stage, locale);
      }
    } catch (error) {
      // console.error("Error updating userType:", error);
      dispatch(
        showToast({
          title: "Error!",
          message: "Error updating compliance details",
          theme: "error",
        })
      );
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    moveStage.fetchAndMove("businessDetails", --stage, locale);
    // router.push("/onboard/business-details");
  };

  return (
    <form
      className="forms-container form-gaps pad-unset form-arrow"
      onSubmit={handleSubmit(onSubmit)}
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
          {/* Legal Business Name */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="businessName" className="f-g-label">
                {t("fields.businessName.label")}
                <Typography variant="span" className="label-lght-txt">
                  {/* {t("fields.businessName.subtext")} */}
                </Typography>
              </label>
            </div>
            <input
              {...register("businessName", {
                required: t("fields.businessName.error"),
              })}
              className="forms-input"
              id="businessName"
              placeholder={t("fields.businessName.placeholder")}
              type="text"
            />
            {errors.businessName && (
              <span className="error-txt">
                {String(errors.businessName.message)}
              </span>
            )}
            {!errors.businessName && (
              <span className="helper-txt">
                <span className="helper-txt">
                  {t("fields.businessName.helper")}
                </span>
              </span>
            )}
          </div>

          {/* Company Registration Number */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="companyRegisterNumber" className="f-g-label">
                {t("fields.companyRegisterNumber.label")}
              </label>
            </div>
            <input
              {...register("companyRegisterNumber", {
                required: t("fields.companyRegisterNumber.error"),
                valueAsNumber: true,
              })}
              className="forms-input"
              id="companyRegisterNumber"
              placeholder="123456789"
              type="number"
            />
            {errors.companyRegisterNumber && (
              <span className="error-txt">
                {String(errors.companyRegisterNumber.message)}
              </span>
            )}
            {!errors.companyRegisterNumber && (
              <span className="helper-txt">
                <span className="helper-txt">
                  {t("fields.companyRegisterNumber.helper")}
                </span>
              </span>
            )}
          </div>

          {/* VAT Number (Optional) */}
          <div className="forms-group">
            <div className="label-flex">
              <label htmlFor="VATNumber" className="f-g-label">{t("fields.VATNumber.label")}</label>
            </div>
            <input
              {...register("VATNumber")}
              className="forms-input"
              id="VATNumber"
              placeholder={t("fields.VATNumber.placeholder")}
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <ButtonIconRight
        name={loading ? t("buttons.processing") : t("buttons.continue")}
        icon={RightArrow}
        className={"wid-100 btn-c-dark"}
        onClick={handleSubmit(onSubmit)}
        disabled={loading}
      />
    </form>
  );
}