"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import SettingsButtons from "@/app/[locale]/_components/MicroComponents/SettingsButtons";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessDetailsQuery,
  useUpdatebusinessTaxInfoMutation,
} from "@/app/[locale]/_store/apiReducer/settingsApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { taxFormSchema } from "@/app/[locale]/_validationSchema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo } from "react";
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useDispatch } from "react-redux";
import { z } from "zod";
import InputField from "../../_components/StoreFront/Forms/InputField";
import Select from "../../_components/StoreFront/Forms/Select";
import { taxOptions } from "../../_models/taxSettings";

interface CountrySelectProps {
  control: Control<any>;
  index: number;
  countryOptions: { label: string; value: string }[];
}

type FormValues = z.infer<typeof taxFormSchema>;

const defaultTaxFormItem: FormValues["taxes"][number] = {
  country: "",
  country_code: "",
  currency: "",
  tax_id_label: "",
  tax_types: "",
  default_tax_rates: "",
};

const TaxSettings = () => {
  const dispatch = useDispatch();
  const { nextStep } = useSettingNextStep();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      taxes: [defaultTaxFormItem],
    },
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "taxes",
  });

  const countries = useWatch({
    control,
    name: "taxes",
  });

  useEffect(() => {
    countries.forEach((taxEntry, index) => {
      if (!taxEntry) return;
      const selectedCountryData = taxOptions.find(
        (c) => c.country === taxEntry.country
      );

      if (selectedCountryData) {
        if (
          selectedCountryData.currency &&
          taxEntry.currency !== selectedCountryData.currency
        ) {
          setValue(`taxes.${index}.currency`, selectedCountryData.currency);
        }
      }
    });
  }, [countries, setValue]);

  const handleCountryChange = (index: number) => {
    const taxEntry = getValues(`taxes.${index}`);

    if (!taxEntry?.country) return;

    const selectedCountryData = taxOptions.find(
      (c) => c.country === taxEntry.country
    );

    if (!selectedCountryData) return;

    setValue(
      `taxes.${index}.country_code`,
      selectedCountryData?.country_code || ""
    );

    const currency = selectedCountryData.currency ?? "";
    if (taxEntry.currency !== currency) {
      setValue(`taxes.${index}.currency`, currency);
    }
    if (!selectedCountryData.default_tax_rates?.length) {
      setValue(`taxes.${index}.default_tax_rates`, "");
    }

    if (!selectedCountryData.tax_types?.length) {
      setValue(`taxes.${index}.tax_types`, "");
    }
    if (!selectedCountryData.tax_id_label) {
      setValue(`taxes.${index}.tax_id_label`, "");
    }
  };

  const [updateBusinessTaxInfo, { isLoading }] =
    useUpdatebusinessTaxInfoMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const cleanedTaxes = data?.taxes?.map((tax) => ({
      ...tax,
      default_tax_rates: Number(tax.default_tax_rates),
    }));

    const response = await updateBusinessTaxInfo(cleanedTaxes);

    if (response?.data?.statusCode === 200) {
      dispatch(
        showToast({
          title: "Success",
          message: response.data.message,
          theme: "success",
        })
      );
      nextStep(AccountSettingsStageKey.DataPrivacySettings);
    }
  };

  const CountrySelect: React.FC<CountrySelectProps> = React.memo(
    ({ control, index, countryOptions }) => (
      <Controller
        control={control}
        name={`taxes.${index}.country` as const}
        render={({ field }) => (
          <Select
            {...field}
            optionLabel="label"
            optionValue="value"
            options={countryOptions}
            onChange={(value) => {
              field.onChange(value); // ensure RHF tracks the change
              setValue(`taxes.${index}.country`, value);
              handleCountryChange(index); // only update that row
            }}
            placeholder={accSetLang("taxSettings.placeholder.Select")}
            filter
            filterBy="label"
            virtualScrollerOptions={{ itemSize: 40 }}
          />
        )}
      />
    )
  );

  const countryOptions = useMemo(() => {
    return taxOptions.map((item) => ({
      label: item.country,
      value: item.country,
    }));
  }, [taxOptions]);

  if (!taxOptions || taxOptions.length === 0) {
    return <div>Loading...</div>;
  }
  const { data } = useGetBusinessDetailsQuery();

  useEffect(() => {
    if (data?.data?.businessTaxInfo) {
      reset({
        taxes: data?.data?.businessTaxInfo.length > 0 ? data?.data?.businessTaxInfo?.map((tax) => ({
          ...tax,
          country_code: tax.country_code || "",
          currency: tax.currency || "",
          tax_id_label: tax.tax_id_label || "",
          tax_types: tax.tax_types || "",
          default_tax_rates: tax.default_tax_rates
            ? String(tax.default_tax_rates)
            : "",
        })) : [defaultTaxFormItem],
      });
    }
  }, [data, reset]);

  const accSetLang = useTranslations("accountSettings");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="forms-block">
      <div className="body-settings">
        {fields.map((field, index) => {
          const selectedCountry = countries?.[index]?.country || "";
          const selectedCountryData = taxOptions.find(
            (c) => c.country === selectedCountry
          );

          return (
            <div key={field.id} className="forms-group-block">
              <div className="forms-group">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100 tax-field">
                    <label className="f-g-label">
                      {accSetLang("taxSettings.fields.RegisteredCountry")}
                    </label>

                    <CountrySelect
                      control={control}
                      index={index}
                      countryOptions={countryOptions}
                    />
                    {errors.taxes?.[index]?.country && (
                      <small className="error-txt">
                        {errors.taxes[index]?.country?.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group wid-100 tax-field">
                    <label className="f-g-label">
                      {accSetLang("taxSettings.fields.Currency")}
                    </label>
                    <InputField
                      type="text"
                      disabled={!!selectedCountryData?.currency}
                      placeholder={accSetLang(
                        "taxSettings.placeholder.EnterCurrency"
                      )}
                      {...register(`taxes.${index}.currency`)}
                    />
                    {errors.taxes?.[index]?.currency && (
                      <small className="error-txt">
                        {errors.taxes[index]?.currency?.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="forms-group tax-field">
                <label className="f-g-label">
                  {accSetLang("taxSettings.fields.TaxIdentificationNumber")}
                  {selectedCountryData?.tax_id_label &&
                    ` - ${selectedCountryData.tax_id_label}`}
                </label>
                <InputField
                  type="text"
                  {...register(`taxes.${index}.tax_id_label`)}
                />
                {!selectedCountryData?.tax_id_label && (
                  <Typography variant="p" className="p-d-c-c-subtxt-sm st-mb-0">
                    {accSetLang("taxSettings.helperText.EnterTaxIDNumber")}
                  </Typography>
                )}
                {errors.taxes?.[index]?.tax_id_label && (
                  <small className="error-txt">
                    {errors.taxes[index]?.tax_id_label?.message}
                  </small>
                )}
              </div>

              <div className="forms-group tax-field">
                <div className="f-g-input-horiz">
                  <div className="forms-group wid-100">
                    <label className="f-g-label">
                      {accSetLang("taxSettings.fields.ApplicableTaxType")}
                    </label>
                    {selectedCountryData?.tax_types?.length ? (
                      <Controller
                        control={control}
                        name={`taxes.${index}.tax_types`}
                        render={({ field }) => (
                          <Select
                            {...field}
                            optionLabel="label"
                            optionValue="value"
                            options={selectedCountryData.tax_types.map(
                              (t: string) => ({
                                label: t,
                                value: t,
                              })
                            )}
                            placeholder={accSetLang(
                              "taxSettings.placeholder.Select"
                            )}
                          />
                        )}
                      />
                    ) : (
                      <InputField
                        type="text"
                        placeholder={accSetLang(
                          "taxSettings.placeholder.EnterTaxType"
                        )}
                        {...register(`taxes.${index}.tax_types`)}
                      />
                    )}
                    {errors.taxes?.[index]?.tax_types && (
                      <small className="error-txt">
                        {errors.taxes[index]?.tax_types?.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group wid-100 ">
                    <label className="f-g-label st-space-mt">
                      {accSetLang("taxSettings.fields.TaxRate")}
                    </label>
                    {selectedCountryData?.default_tax_rates?.length ? (
                      <Controller
                        control={control}
                        name={`taxes.${index}.default_tax_rates`}
                        render={({ field }) => (
                          <Select
                            {...field}
                            optionLabel="label"
                            optionValue="value"
                            options={selectedCountryData.default_tax_rates.map(
                              (rate: string) => ({
                                label: rate,
                                value: rate,
                              })
                            )}
                            placeholder={accSetLang(
                              "taxSettings.placeholder.Select"
                            )}
                          />
                        )}
                      />
                    ) : (
                      <InputField
                        type="text"
                        placeholder={accSetLang(
                          "taxSettings.placeholder.EnterTaxRate"
                        )}
                        {...register(`taxes.${index}.default_tax_rates`)}
                      />
                    )}
                    {errors.taxes?.[index]?.default_tax_rates && (
                      <small className="error-txt">
                        {errors.taxes[index]?.default_tax_rates?.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {fields.length > 1 && (
                <div className="text-right">
                  <Buttons
                    text={accSetLang("taxSettings.fields.Remove")}
                    className="btn-plain-txt"
                    type="button"
                    onClick={() => remove(index)}
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-2">
          <Buttons
            text={accSetLang("taxSettings.fields.AddAnotherTaxType")}
            className="btn-plain-txt"
            subClassName="link-btn-dark"
            type="button"
            onClick={() => append(defaultTaxFormItem)}
          />
        </div>
      </div>

      <SettingsButtons cancelRoute={`./`} isSubmitting={isLoading} />
    </form>
  );
};

export default TaxSettings;
