import React, { useCallback, useEffect, useMemo, useState } from "react";

// 3rd-party libraries
import { Country } from "country-state-city";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-input-2";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useDispatch } from "react-redux";

// Components (alphabetical)
import Button from "@/app/[locale]/_components/Buttons/Button";
import Inputs from "@/app/[locale]/_components/form/Inputs";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";

// Store / hooks (alphabetical inside each named import)
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppSelector } from "@/app/[locale]/_store/store";
import {
  useCreateEnquiryFormMutation,
  useUpdateCatalogImpressionsMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";

// Interfaces & validation (alphabetical)
import {
  countryCodesInterface,
  phoneNumberInterface,
} from "@/app/[locale]/_interface/BusinessProfile";
import { CatalogSupplierSchema } from "@/app/[locale]/_validationSchema/catalog";

interface ConnectUsProps {
  data: string | number | null; // id passed in (was `data` in original)
  subDomain: string;
}

interface CatalogSupplierInterface {
  supplierName: string;
  supplierEmail: string;
  supplierMobileNo: phoneNumberInterface;
  supplierCountry: countryCodesInterface;
  supplierMessage: string;
}

const MESSAGE_MAX_LENGTH = 5000;

const ConnectUs: React.FC<ConnectUsProps> = ({ data: id, subDomain }) => {
  const t = useTranslations("freeCatalog.catalog");
  const dispatch = useDispatch();

  // App-level state
  const location = useAppSelector((s: any) => s.location);

  // RTK Query hooks
  const [createEnquiryForm] = useCreateEnquiryFormMutation();
  const [updateCatalogImpressions] = useUpdateCatalogImpressionsMutation();

  // Form setup using react-hook-form + zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<CatalogSupplierInterface>({
    defaultValues: {
      supplierName: "",
      supplierEmail: "",
      supplierMobileNo: { countryCode: "", number: "" },
      supplierCountry: { name: "", code: "" },
      supplierMessage: "",
    },
    mode: "onBlur",
    resolver: zodResolver(CatalogSupplierSchema),
  });

  // Country list memoized (computed once)
  const countriesOptions = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      name: c.name,
      code: c.isoCode,
    }));
  }, []);

  // Helper: update impressions (fire & forget)
  const handleImpression = useCallback(async () => {
    if (!subDomain) return;
    try {
      // API expects { subdomain } (kept from original code)
      await updateCatalogImpressions({ subdomain: subDomain }).unwrap();
    } catch {
      // swallow error for now; optionally log telemetry
    }
  }, [subDomain, updateCatalogImpressions]);

  // Form submit handler
  const onSubmit = useCallback(
    async (formData: CatalogSupplierInterface) => {
      if (!id) {
        dispatch(
          showToast({
            title: t("enquirySection.toast.error.title"),
            message: t("enquirySection.toast.error.noId"),
            theme: "error",
          })
        );
        return;
      }

      // Ensure message length doesn't exceed max (defensive)
      const message =
        (formData.supplierMessage || "").slice(0, MESSAGE_MAX_LENGTH) ?? "";

      const payload = {
        name: formData.supplierName,
        email: formData.supplierEmail,
        mobile: formData.supplierMobileNo,
        country: formData.supplierCountry,
        message,
      };

      try {
        const res = await createEnquiryForm({ id, payload }).unwrap();
        await handleImpression();

        if (res?.message === "Already enquired") {
          dispatch(
            showToast({
              title: t("enquirySection.toast.warning.title"),
              message: t("enquirySection.toast.warning.alreadyEnquired"),
              theme: "warning",
            })
          );
        } else {
          dispatch(
            showToast({
              title: t("enquirySection.toast.success.title"),
              message: t("enquirySection.toast.success.created"),
              theme: "success",
            })
          );
        }

        reset(); // clear form
      } catch (err: any) {
        dispatch(
          showToast({
            title: t("enquirySection.toast.error.title"),
            message:
              err?.data?.message || t("enquirySection.toast.error.failed"),
            theme: "error",
          })
        );
      }
    },
    [createEnquiryForm, dispatch, handleImpression, id, reset, t]
  );

  // PhoneInput onChange handler helper
  const handlePhoneChange = useCallback(
    (value: string, country: any, onChange: (v: any) => void) => {
      const dialCode = country?.dialCode ? `+${country.dialCode}` : "";
      const numeric = value
        .replace(/^\+/, "")
        .replace(dialCode.replace(/^\+/, ""), "");
      onChange({
        countryCode: dialCode,
        number: numeric,
      });
    },
    []
  );

  return (
    <section className="ct-sub-section pa d-flex">
      <div className="ct-sub-section-header">
        <h3 className="form-title">{t("enquirySection.title")}</h3>
      </div>

      <form
        className="catalog-enquiry-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Row: Name & Email */}
        <div className="form-row">
          <div className="form-group">
            <label className="f-g-label">
              {t("enquirySection.fields.name")} :
            </label>
            <Controller
              name="supplierName"
              control={control}
              render={({ field }) => (
                <Inputs
                  {...field}
                  type="text"
                  placeholder={t("enquirySection.placeholders.fullName")}
                />
              )}
            />
            {errors.supplierName?.message && (
              <span className="error-text">{errors.supplierName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="f-g-label">
              {t("enquirySection.fields.email")} :
            </label>
            <Controller
              name="supplierEmail"
              control={control}
              render={({ field }) => (
                <Inputs
                  {...field}
                  type="email"
                  placeholder={t("enquirySection.placeholders.businessEmail")}
                />
              )}
            />
            {errors.supplierEmail?.message && (
              <span className="error-text">{errors.supplierEmail.message}</span>
            )}
          </div>
        </div>

        {/* Row: Mobile & Country */}
        <div className="form-row">
          <div className="form-group">
            <label className="f-g-label">
              {t("enquirySection.fields.mobile")}:
            </label>
            <Controller
              name="supplierMobileNo"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  inputStyle={{ width: "100%", paddingLeft: 45 }}
                  country={(location?.country_code || "IN").toLowerCase()}
                  value={`${field.value?.countryCode ?? ""}${
                    field.value?.number ?? ""
                  }`}
                  onChange={(val: string, country: any) =>
                    handlePhoneChange(val, country, field.onChange)
                  }
                />
              )}
            />
            {errors.supplierMobileNo?.number && (
              <span className="error-text">
                {errors.supplierMobileNo.number.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="f-g-label">
              {t("enquirySection.fields.country")}:
            </label>
            <Controller
              name="supplierCountry"
              control={control}
              render={({ field }) => (
                <Select
                  options={countriesOptions}
                  value={field.value}
                  onChange={(selected) => field.onChange(selected)}
                  virtualScrollerOptions={{ itemSize: 40 }}
                  filterBy="name"
                  filter
                />
              )}
            />
            {errors.supplierCountry?.name && (
              <span className="error-text">
                {errors.supplierCountry.name.message}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="form-group">
          <label className="f-g-label">
            {t("enquirySection.fields.message")}:
          </label>
          <Controller
            name="supplierMessage"
            control={control}
            render={({ field }) => {
              const currentLength = (field.value || "").length;
              return (
                <>
                  <TextArea
                    {...field}
                    value={field.value || ""}
                    onChange={(v: string) => {
                      field.onChange(v.slice(0, MESSAGE_MAX_LENGTH));
                    }}
                    placeholder={t("enquirySection.placeholders.message")}
                  />
                  <div className="char-limit-container" aria-live="polite">
                    {currentLength}/{MESSAGE_MAX_LENGTH}
                  </div>
                  {errors.supplierMessage && (
                    <span className="error-text">
                      {errors.supplierMessage.message}
                    </span>
                  )}
                </>
              );
            }}
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          <Button
            type="submit"
            className="submit-btn"
            text={
              isFormSubmitting || isFormSubmitting
                ? t("enquirySection.sending")
                : t("enquirySection.send")
            }
            disabled={isFormSubmitting}
          />
        </div>
      </form>
    </section>
  );
};

export default ConnectUs;
