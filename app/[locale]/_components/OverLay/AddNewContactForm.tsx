import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import {
  CloseIcon,
  RightArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import CheckBoxInputs from "@/app/[locale]/_components/StoreFront/Forms/CheckBoxInputs";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import {
  CustomerSource,
  phoneNumberInterface,
} from "@/app/[locale]/_interface/ConnectInterface";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";
import { sourceList } from "@/app/[locale]/_models/common";
import {
  useAddNewContactMutation,
  useUpdateCustomerInformationMutation,
} from "@/app/[locale]/_store/apiReducer/connectApi";
import {
  setIsAddNewContactOpen,
  setNewContactCreatedDialog,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { addNewContactSchema } from "@/app/[locale]/_validationSchema/salesConnect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import { Sidebar } from "primereact/sidebar";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
interface formProps {
  data?: ContactFormValues;
}
export interface ContactFormValues {
  _id?: string;
  contactName: string;
  companyName: string;
  email: string;
  phoneNo: phoneNumberInterface;
  whatsAppNo: phoneNumberInterface;
  country: CountryOfOrigin;
  source: CustomerSource;
}

const AddNewContactForm: FC<formProps> = (data) => {
  const dispatch = useAppDispatch();
  const t = useTranslations("salesConnect.contactForm");
  const [phoneDisabled, setDisabled] = useState<boolean>(false);
  const { isAddNewContactOpen, newContactCreatedDialog } = useAppSelector(
    (state: RootState) => state.uiData
  );
  // let country = useAppSelector((state: any) => state.location);
  const [checked, setChecked] = useState<boolean>(false);
  // const [countryCode, setCountryCode] = useState<string>(country?.country_code);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [countriesOptions, setCountriesOptions] = useState<
    { name: string; code: string }[]
  >([]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries);
  }, []);

  let country = useAppSelector((state: any) => state.location);
  const [addNewContact] = useAddNewContactMutation();
  const [updateContactInformation] = useUpdateCustomerInformationMutation();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      contactName: "",
      companyName: "",
      email: "",
      phoneNo: {},
      whatsAppNo: {},
      country: {},
      source: undefined,
    },
    mode: "onChange",

    resolver: zodResolver(addNewContactSchema),
  });

  const formValues = watch();

  useEffect(() => {
    if (data?.data) {
      setIsEdit(true);
      reset({
        contactName: data.data.contactName ?? "",
        companyName: data.data.companyName ?? "",
        email: data.data.email ?? "",
        phoneNo: data.data.phoneNo ?? {},
        whatsAppNo: data.data.whatsAppNo ?? {},
        country: data.data.country ?? {},
        source: data.data.source ?? "",
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (
      data?.data?.phoneNo?.countryCode ===
        data?.data?.whatsAppNo?.countryCode &&
      data?.data?.phoneNo?.number === data?.data?.whatsAppNo?.number
    ) {
      setChecked(true);
    }
  }, [data]);

  useEffect(() => {
    if (checked) {
      setValue(
        "whatsAppNo.countryCode",
        formValues?.phoneNo?.countryCode ?? "",
        {
          shouldValidate: true,
        }
      );
      setValue("whatsAppNo.number", formValues?.phoneNo?.number ?? "", {
        shouldValidate: true,
      });
      setDisabled(true);
    } else if (!isEdit) {
      setValue("whatsAppNo.countryCode", country?.countryCode ?? "", {
        shouldValidate: true,
      });
      setValue("whatsAppNo.number", "", { shouldValidate: true });
      setDisabled(false);
    } else {
      setDisabled(false);
    }
  }, [checked, formValues?.phoneNo, setValue]);

  const handleOnChange = (value: string, country: any) => {
    const dialCode = country?.dialCode || "";
    const phoneNumber = value.replace(dialCode, "");
    setValue("phoneNo", {
      countryCode: dialCode,
      number: phoneNumber,
    });
  };

  const handleWhatsApp = (value: string, country: any) => {
    const dialCode = country?.dialCode || "";
    const phoneNumber = value.replace(dialCode, "");
    setValue("whatsAppNo", {
      countryCode: dialCode,
      number: phoneNumber,
    });
  };

  const addContact = async (formData: ContactFormValues) => {
    if (isEdit) {
      try {
        const response = await updateContactInformation({
          id: data?.data?._id,
          data: formData,
          skipCacheUpdate: false,
        }).unwrap();
        if (response) {
          dispatch(setIsAddNewContactOpen(false));
          dispatch(setNewContactCreatedDialog(true));

          setTimeout(async () => {
            dispatch(setNewContactCreatedDialog(false));
          }, 3000);
        }
      } catch (error) {
        console.log(error);
        dispatch(
          showToast({
            title: "Error",
            message: "Adding Contact Failed",
            theme: "error",
          })
        );
      }
    } else {
      try {
        const response = await addNewContact(formData).unwrap();
        if (response) {
          dispatch(setIsAddNewContactOpen(false));
          dispatch(setNewContactCreatedDialog(true));

          setTimeout(async () => {
            dispatch(setNewContactCreatedDialog(false));
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }

    dispatch(setIsAddNewContactOpen(false));
    reset();
  };
  useEffect(() => {
    reset();
    setChecked(false);
  }, [isAddNewContactOpen]);
  return (
    <>
      <Sidebar
        visible={isAddNewContactOpen}
        position="right"
        onHide={() => dispatch(setIsAddNewContactOpen(false))}
        className="offcanvas-sidebar-comp variants-sidebar "
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {t("title")}
                </Typography>
                <CloseIcon
                  onClick={() => {
                    dispatch(setIsAddNewContactOpen(false));
                    reset();
                  }}
                />
              </div>

              <div className="o-s-c-body">
                <div className="o-s-c-b-right">
                  <div className="forms-block">
                    {/* Product name*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("contactName.label")}
                      </label>
                      <Controller
                        name="contactName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("contactName.placeHolder")}
                          />
                        )}
                      />
                      {errors.contactName && (
                        <Typography variant="span" className="error-txt">
                          {errors?.contactName?.message}
                        </Typography>
                      )}
                    </div>
                    {/* Company Name */}

                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("companyName.label")}
                      </label>
                      <Controller
                        name="companyName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("companyName.placeHolder")}
                          />
                        )}
                      />
                      {errors.companyName && (
                        <Typography variant="span" className="error-txt">
                          {errors?.companyName?.message}
                        </Typography>
                      )}
                    </div>

                    {/* EmailId */}

                    <div className="forms-group">
                      <label className="f-g-label">{t("emailId.label")}</label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            type="email"
                            placeholder={t("emailId.placeHolder")}
                          />
                        )}
                      />
                      {errors.email && (
                        <Typography variant="span" className="error-txt">
                          {errors?.email?.message}
                        </Typography>
                      )}
                    </div>

                    {/* Phone number*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("phoneNumber.label")}
                      </label>

                      <Controller
                        name="phoneNo"
                        control={control}
                        render={({ field }) => (
                          // <InputField
                          //   {...field}
                          //   placeholder={t("phoneNumber.placeHolder")}
                          // />
                          <PhoneInput
                            value={`${field.value?.countryCode ?? ""}${
                              field.value?.number ?? ""
                            }`} // Ensure proper formatting
                            country={
                              country?.country_code.toLowerCase() || "in"
                            }
                            onChange={(value: string, country: any) => {
                              const dialCode = country.dialCode || "";
                              const phoneNumber = value
                                .replace(dialCode, "")
                                .replace(/^\+/, "");
                              field.onChange({
                                countryCode: dialCode,
                                number: phoneNumber,
                              });
                              handleOnChange(value, country);
                            }}
                            inputStyle={{ width: "100%" }}
                          />
                        )}
                      />

                      {errors.phoneNo && (
                        <Typography variant="span" className="error-txt">
                          {errors?.phoneNo?.message}
                        </Typography>
                      )}
                    </div>

                    {/* WhatsApp */}

                    <div className="forms-group">
                      <label className="f-g-label">{t("whatsapp.label")}</label>

                      <Controller
                        name="whatsAppNo"
                        control={control}
                        render={({ field }) => (
                          // <InputField
                          //   {...field}
                          //   placeholder={t("whatsapp.placeHolder")}
                          //   disabled={phoneDisabled}
                          // />
                          <PhoneInput
                            value={`${field.value?.countryCode ?? ""}${
                              field.value?.number ?? ""
                            }`} // Ensure proper formatting
                            country={
                              country?.country_code.toLowerCase() || "in"
                            }
                            onChange={(value: string, country: any) => {
                              const dialCode = country.dialCode || "";
                              const phoneNumber = value
                                .replace(dialCode, "")
                                .replace(/^\+/, "");
                              field.onChange({
                                countryCode: dialCode,
                                number: phoneNumber,
                              });
                              handleWhatsApp(value, country);
                            }}
                            inputStyle={{ width: "100%" }}
                          />
                        )}
                      />

                      {errors.whatsAppNo && (
                        <Typography variant="span" className="error-txt">
                          {errors?.whatsAppNo?.message}
                        </Typography>
                      )}

                      <CheckBoxInputs
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        label={t("helperText.sameAsPhoneNumber")}
                      />
                    </div>

                    {/* Country */}
                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="country">
                        {t("country.label")}{" "}
                      </label>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={countriesOptions}
                            value={field.value}
                            onChange={field.onChange}
                            filter={true}
                            filterBy="name"
                            virtualScrollerOptions={{
                              itemSize: 40,
                            }}
                            placeholder={t("country.placeHolder")}
                          />
                        )}
                      />
                      {errors.country && (
                        <span className="error-txt">
                          {errors?.country?.code?.message}
                        </span>
                      )}
                    </div>

                    {/* Source */}

                    <div className="forms-group">
                      <label className="f-g-label">{t("source.label")} </label>
                      <Controller
                        name="source"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={sourceList}
                            value={field.value}
                            onChange={field.onChange}
                            filter={true}
                            filterBy="value"
                            virtualScrollerOptions={{
                              itemSize: 40,
                            }}
                            placeholder={t("source.placeHolder")}
                          />
                        )}
                      />
                      {errors.source && (
                        <span className="error-txt">
                          {errors?.source?.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="o-s-c-footer">
              <div className="o-s-c-f-left"></div>
              <div className="o-s-c-f-right">
                <div className="o-s-c-btn-group">
                  <ButtonIconRight
                    name={t("button.Submit")}
                    onClick={handleSubmit((formData) => addContact(formData))}
                  >
                    <RightArrowIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
          </>
        )}
      ></Sidebar>

      <SuccessDialog
        visible={newContactCreatedDialog}
        title={
          isEdit
            ? t("successDialog.contactUpdated")
            : t("successDialog.contactAdded")
        }
      />
    </>
  );
};
export default AddNewContactForm;
