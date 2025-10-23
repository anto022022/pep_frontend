"use client";
import {
  AuthPayloads,
  Fields,
  VerificationStage,
} from "@/app/[locale]/_interface/AuthInterface";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import React, { useEffect, useState } from "react";
import Typography from "../../../../_components/Base/Typography";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // make sure styles are loaded
import "@/app/[locale]/dev_styles.css";
import SocialMediaLogin from "@/app/[locale]/(pages)/(authentication)/authenticate/(forms)/SocialMediaLogin";

// ✅ new import
import { parsePhoneNumberFromString } from "libphonenumber-js";

type AuthFormProps = {
  setVerificationStage: (val: VerificationStage) => void;
  setExistingUser: (val: boolean) => void;
  setOtpType: (val: string) => void;
  setPayload: (val: AuthPayloads) => void;
  payload: AuthPayloads;
};

const AuthForm: React.FC<AuthFormProps> = ({
  setVerificationStage,
  setExistingUser,
  setOtpType,
  setPayload,
  payload,
}) => {
  const [fields, setFields] = useState<Fields>({
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Fields>({
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const cookie = useCookies();
  let country = useAppSelector((state: RootState) => state.location);
  const [countryCode, setCountryCode] = useState<string>("91");
  const [countryISOCode, setCountryISOCode] = useState<string>(
    country?.country_code?.toLowerCase() ?? "in"
  );
  // country?.country_code

  useEffect(() => {
    cookie.deleteCookie("authSession");
    fetchErrors();
  }, []);

  useEffect(() => {
    if (payload.countryCode && payload.phone) {
      // debugger;
      let cleanedCountryCode = payload.countryCode.replace("+", "");
      setFields({
        email: "",
        phone: `${cleanedCountryCode}${payload.phone}`,
      });
      setCountryCode(payload.countryCode);
    }
  }, [payload.countryISOCode]);

  const t = useTranslations("loginPage");

  const fetchErrors = () => {
    let googleError = cookie.getCookie("ggl_err");
    let linkedInError = cookie.getCookie("ln_err");
    if (googleError) {
      setErrors({ email: googleError, phone: googleError });
    }
    if (linkedInError) {
      setErrors({ email: linkedInError, phone: linkedInError });
    }
  };

  const validatePhoneNumber = (phone: string) => {
    try {
      const fullNumber = `+${phone}`;
      const phoneNumber = parsePhoneNumberFromString(fullNumber);
      if (!phoneNumber) return t("phoneNoError.invalid");
      if (!phoneNumber.isValid()) return t("phoneNoError.invalid");

      return "";
    } catch {
      return t("phoneNoError.invalid");
    }
  };

  const submitPhone = async () => {
    try {
      let phoneError = validatePhoneNumber(fields.phone);
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      if (phoneError) return;
      const fullNumber = `+${fields.phone}`;
      const fixedNumber = fullNumber.replace(countryCode, "").trim();
      setIsSubmitting(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL_IDN ||
          "https://identity-api.sandbox.pepagora.org/"
        }auth/sendOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNo: fixedNumber,
            // phoneNo: fields.phone,
            countryCode: countryCode,
          }),
        }
      );
      setIsSubmitting(false);
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, email: "Sending OTP failed" }));
        return;
      }
      const resData = await response.json();
      dispatch(
        showToast({
          title: "Success",
          message: "OTP sent successfully!",
          theme: "success",
        })
      );
      setExistingUser(
        resData?.data?.existingUser ? resData.data.existingUser : false
      );
      setVerificationStage({
        stage: "otpVerification",
      });
      setOtpType("phone");
      setPayload({
        phone: fixedNumber,
        countryCode: countryCode,
        smsType: resData?.data?.channel,
        countryISOCode: countryISOCode,
      });
    } catch (error) {
      setErrors((prev) => ({ ...prev, phone: "Failed to send OTP" }));
      setIsSubmitting(false);
    }
  };

  const handleOnChange = (value: string, country: any) => {
    const extractedCountryCode = `+${country.dialCode}`;
    setCountryCode(extractedCountryCode);
    setCountryISOCode(country.countryCode);
    setFields((prevFields) => ({
      ...prevFields,
      phone: value,
    }));
  };

  // const iso = useMemo(() => {
  //   return (
  //     countryISOCode?.toLowerCase() ||
  //     country?.country_code?.toLowerCase() ||
  //     "in"
  //   );
  // }, [countryISOCode]);

  return (
    <div className="form-box-shadow form-gaps forms-container">
      <div className="form-title-wrap">
        <Typography variant="h1" className="title-txt">
          {t("title")}
        </Typography>
        <Typography variant="h2" className="sub-txt">
          {t("description")}
        </Typography>
      </div>

      {/* Phone Number Input BEGIN */}
      <div className="forms-button-gaps">
        <div className="forms-group">
          <div className="label-flex">
            <label htmlFor="phnumber">{t("manualLogin.phoneNo.title")}</label>
          </div>
          <PhoneInput
            inputStyle={{ width: "100%" }}
            country={country?.country_code?.toLowerCase() || "in"}
            autoFormat={true}
            value={fields?.phone}
            onChange={handleOnChange}
            placeholder={t("manualLogin.phoneNo.placeHolder")}
          />
          {errors.phone ? (
            <Typography variant="span" className="error-txt">
              {errors.phone}
            </Typography>
          ) : (
            <Typography variant="span" className="helper-txt">
              {t("manualLogin.phoneNo.helper")}
            </Typography>
          )}
        </div>
        <button
          onClick={submitPhone}
          className="btn-comp btn-c-primary btn-c-lg"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("manualLogin.phoneNo.submitting")
            : t("manualLogin.phoneNo.actionBtn")}
        </button>
      </div>

      <div className="or-divider">
        <Typography variant="span" className="o-d-txt">
          {t("hr")}
        </Typography>
      </div>
      <SocialMediaLogin />
    </div>
  );
};

export default AuthForm;
