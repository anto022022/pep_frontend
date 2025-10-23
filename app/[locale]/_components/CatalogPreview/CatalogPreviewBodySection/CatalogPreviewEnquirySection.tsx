import Button from "@/app/[locale]/_components/Buttons/Button";
import Inputs from "@/app/[locale]/_components/form/Inputs";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import { countryCodesInterface, phoneNumberInterface } from "@/app/[locale]/_interface/BusinessProfile";
import { CategoriesListInterface } from "@/app/[locale]/_interface/OnboardInterface";
import {
  useCreateEnquiryFormMutation,
  useUpdateCatalogImpressionsMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";
import { useLazyGetCategoryListQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppSelector } from "@/app/[locale]/_store/store";
import { CatalogSupplierSchema } from "@/app/[locale]/_validationSchema/catalog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { useDispatch } from "react-redux";

interface CatalogSupplierInterface {
  supplierName: string;
  supplierEmail: string;
  supplierMobileNo: phoneNumberInterface;
  supplierCountry: countryCodesInterface;
  supplierMessage: string;
}

const CatalogPreviewEnquirySection = ({ data, subDomain }) => {
  const t = useTranslations("freeCatalog.catalog");
  const id = data;
  console.log('id', data);
  const dispatch = useDispatch();
  const [updateCatalogImpressions] = useUpdateCatalogImpressionsMutation();

  let country = useAppSelector((state: any) => state.location);
  const [triggerFetch, { isFetching }] = useLazyGetCategoryListQuery();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CatalogSupplierInterface>({
    defaultValues: {
      supplierName: '',
      supplierEmail: '',
      supplierMobileNo: {},
      supplierCountry: {
        name: '',
        code: ''
      },
      supplierMessage: ''
    },
    mode: 'onBlur',
    resolver: zodResolver(CatalogSupplierSchema)
  })

  const [countriesOptions, setCountriesOptions] = useState<
    { name: string; code: string }[]
  >([]);
  const [options, setOptions] = useState<CategoriesListInterface[]>([]);

  const fetchCategories = async (search = "") => {
    const res = await triggerFetch({ search });
    if ("data" in res && res.data?.data) {
      const optionsList = res.data.data.map((d) => {
        const { liveUrl, ...restData } = d;
        return restData;
      });
      setOptions(optionsList);
    }
  };

  useEffect(() => {
    fetchCategories();
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  async function handleImpression() {
    await updateCatalogImpressions({ subdomain: subDomain });
  }
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   mobile: "",
  //   country: "",
  //   message: "",
  // });

  // const [errors, setErrors] = useState({
  //   name: "",
  //   email: "",
  //   mobile: "",
  //   country: "",
  //   message: "",
  // });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createEnquiryForm] = useCreateEnquiryFormMutation();

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = t("enquirySection.validation.nameRequired");
        } else if (value.trim().length < 2) {
          error = t("enquirySection.validation.nameMinLength");
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = t("enquirySection.validation.nameFormat");
        }
        break;

      case "email":
        if (!value.trim()) {
          error = t("enquirySection.validation.emailRequired");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = t("enquirySection.validation.emailFormat");
        }
        break;

      case "mobile":
        if (!value.trim()) {
          error = t("enquirySection.validation.mobileRequired");
        } else if (!/^\+?[\d\s\-()]{10,}$/.test(value.trim())) {
          error = t("enquirySection.validation.mobileFormat");
        }
        break;

      case "country":
        if (!value) {
          error = t("enquirySection.validation.countryRequired");
        }
        break;

      case "message":
        if (!value.trim()) {
          error = t("enquirySection.validation.messageRequired");
        } else if (value.trim().length < 10) {
          error = t("enquirySection.validation.messageMinLength");
        } else if (value.length > 5000) {
          error = t("enquirySection.validation.messageMaxLength");
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      mobile: "",
      country: "",
      message: "",
    };

    // Object.keys(formData).forEach((key) => {
    //   const error = validateField(key, formData[key]);
    //   if (error) {
    //     newErrors[key] = error;
    //   }
    // });

    // setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (e: any) => {
    // const { name, value } = e.target;
    const name = e.target?.name;
    const value = e.target?.value;
    console.log('name', name, 'value', e);


    // Truncate message if it exceeds 5000 characters
    let processedValue = value;
    if (name === "message" && value.length > 5000) {
      processedValue = value.substring(0, 5000);
    }

    // setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      // setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // country on-change function
  const handleOnChange = (value: string, country: any) => {
    const dialCode = country?.dialCode || "";
    const phoneNumber = value.replace(dialCode, "");
    setValue("supplierMobileNo", {
      countryCode: dialCode,
      number: phoneNumber,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      // setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const onsubmit = async (data: CatalogSupplierInterface) => {
    console.log('data', data);


    // if (!validateForm()) {
    //   dispatch(
    //     showToast({
    //       title: t("enquirySection.toast.validationError.title"),
    //       message: t("enquirySection.toast.validationError.message"),
    //       theme: "error",
    //     })
    //   );
    //   return;
    // }

    const payload = {
      name: data?.supplierName,
      email: data?.supplierEmail,
      mobile: data?.supplierMobileNo,
      country: data?.supplierCountry,
      message: data?.supplierMessage
    };

    if (!id) {
      console.error("No ID provided");
      dispatch(
        showToast({
          title: t("enquirySection.toast.error.title"),
          message: t("enquirySection.toast.error.noId"),
          theme: "error",
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // const payload = { ...formData };

      const res = await createEnquiryForm({ id, payload, }).unwrap();
      handleImpression();
      if (res.message === "Already enquired") {
        dispatch(
          showToast({
            title: t("enquirySection.toast.warning.title"),
            message: t("enquirySection.toast.warning.alreadyEnquired"),
            theme: "Waring",
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
      reset();

      // Reset form after successful submission
      // resetForm();
    } catch (err) {
      console.error("Error:", err);
      dispatch(
        showToast({
          title: t("enquirySection.toast.error.title"),
          message: err?.data?.message || t("enquirySection.toast.error.failed"),
          theme: "error",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.warn('errors', errors);
  }

  return (
    <div className="ct-sub-section pa d-flex">
      <div className="ct-sub-section-header">
        <h3 className="form-title">{t("enquirySection.title")}</h3>
      </div>
      <form className="catalog-enquiry-form">
        <div className="form-row">
          <div className="form-group">
            <label className="f-g-label">{t("enquirySection.fields.name")} :</label>
            <Controller
              name="supplierName"
              control={control}
              render={({ field }) => (
                <Inputs type='text'
                  placeholder={t("enquirySection.placeholders.fullName")}
                  {...field}
                />
              )} />
            {errors.supplierName?.message && <span className="error-text">{errors.supplierName.message}</span>}
          </div>
          <div className="form-group">
            <label className="f-g-label">{t("enquirySection.fields.email")} :</label>
            <Controller
              name="supplierEmail"
              control={control}
              render={({ field }) => (
                <Inputs type='email'
                  placeholder={t("enquirySection.placeholders.businessEmail")}
                  {...field}
                />
              )} />
            {/* <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder={t("enquirySection.placeholders.businessEmail")}
              className={errors.email ? "error" : ""}
            /> */}
            {errors.supplierEmail?.message &&
              <span className="error-text">{errors.supplierEmail?.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="f-g-label">{t("enquirySection.fields.mobile")}:</label>
            {/* <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder={t("enquirySection.placeholders.mobileWhatsapp")}
              className={errors.mobile ? "error" : ""}
            /> */}
            <Controller
              name="supplierMobileNo"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country={country?.country_code.toLowerCase() || "in"}
                  value={`+${field.value?.countryCode ?? ""}${field.value?.number ?? ""}`}
                  onChange={(value: string, country: any) => {

                    const dialCode = country.dialCode || "";
                    const phoneNumber = value
                      .replace(dialCode, "")
                      .replace(/^\+/, "");
                    console.log('countryCode', field.value?.countryCode, 'number', field.value?.number,
                      'dialCode', dialCode, 'phoneNumber', phoneNumber
                    );

                    field.onChange({
                      countryCode: dialCode,
                      number: phoneNumber,
                    });
                    handleOnChange(value, country);
                  }}
                  inputStyle={{ width: "100%", paddingLeft: '45px' }}
                />
              )}
            />
            {errors.supplierMobileNo?.number && (
              <span className="error-text">{errors.supplierMobileNo.number.message}</span>
            )}
          </div>
          <div className="form-group ">
            <label className="f-g-label">{t("enquirySection.fields.country")}:</label>
            {/* <div className="form-select-wrapper"> */}
            {/* <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={errors.country ? "error" : ""}
            >
              <option value="">{t("enquirySection.selectOption")}</option>
              {countryOptions.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.name}
                </option>
              ))}
            </select> */}
            <Controller
              name="supplierCountry"
              control={control}
              render={({ field }) => (
                <Select options={countriesOptions}
                  value={field.value}
                  onChange={(selected) => {
                    field.onChange(selected);
                  }}
                  virtualScrollerOptions={{
                    itemSize: 40,
                  }}
                  filterBy="name"
                  filter={true} />
              )} />

            {/* <Image
              src={arrowDown}
              alt={"dropdown arrow"}
              width="25"
              height="25"
              className="f-s-w-icon"
            /> */}
            {/* </div> */}
            {errors.supplierCountry?.name && (
              <span className="error-text">{errors.supplierCountry?.name?.message}</span>
            )}
          </div>
        </div>

        {/* className="form-group full-width" */}
        <div className="form-group">
          <label className="f-g-label">{t("enquirySection.fields.message")}:</label>
          {/* <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            required
            placeholder={t("enquirySection.placeholders.message")}
          // className={errors.message ? "error" : ""}
          /> */}
          <Controller
            name="supplierMessage"
            control={control}
            render={({ field }) => {
              const currentLength = field.value?.length || 0;
              return (
                <div>
                  <TextArea
                    {...field}
                    value={field.value}
                    onChange={(value: string) => {
                      field.onChange(value);
                    }}
                    placeholder={t("enquirySection.placeholders.message")}
                  // className={errors.message ? "error" : ""}
                  />
                  <div
                    className="char-limit-container"
                    style={{
                      marginTop: "8px",
                      textAlign: "left",
                      fontSize: "12px",
                      color: currentLength > 5000 ? "#e53e3e" : "#6b7280",
                    }}
                  >
                    {currentLength}/5000
                  </div>
                  {errors.supplierMessage && (
                    <span className="error-text">{errors.supplierMessage.message}</span>
                  )}
                </div>
              )
            }}
          />

        </div>

        <div className="form-actions">
          <Button type="submit" className="submit-btn"
            onClick={handleSubmit(onsubmit, onError)}
            text={isSubmitting ? t("enquirySection.sending") : t("enquirySection.send")} />
        </div>
      </form>
    </div>
  );
};

export default CatalogPreviewEnquirySection;
