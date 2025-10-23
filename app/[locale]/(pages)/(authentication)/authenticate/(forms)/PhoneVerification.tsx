"use client";

import React, { useState } from "react";
import Typography from "../../../../_components/Base/Typography";
// import CountryPlaceholder from "../../../../../../assets/img/india-flag.png";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import {
  AuthPayloads,
  VerificationStage,
} from "@/app/[locale]/_interface/AuthInterface";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type PhoneVerificationProps = {
  setVerificationStage: (val: VerificationStage) => void;
  setOtpType: (val: string) => void;
  setPayload: (val: AuthPayloads) => void;
};

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  setVerificationStage,
  setOtpType,
  setPayload,
}) => {
  const [phone, setPhone] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const cookies = useCookies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  let country = useAppSelector((state: RootState) => state.location);
  const [countryCode, setCountryCode] = useState<string>(
    country?.country_calling_code
  );

  const dispatch = useAppDispatch();
  const t = useTranslations("userVerification");

  const submitPhone = async () => {
    try {
      const phoneRegex = /^\+?\d{0,4}[-.\s]?\d{8,12}$/;
      let phoneError: string = !phone.trim()
        ? t("errors.phoneNumberRequired")
        : !phoneRegex.test(phone)
          ? t("errors.invalidPhoneNumber")
          : "";
      setErrors(phoneError);
      if (phoneError) return;
      let authSession = cookies.getCookie("authSession");
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_IDN || "https://identity-api.sandbox.pepagora.org/"}auth/sendPhoneOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authSession && { authSession: authSession }),
          },
          body: JSON.stringify({
            phoneNo: phone,
            countryCode: countryCode,
          }),
        }
      );
      setIsSubmitting(false);
      const resData = await response.json();
      if (!response.ok) {
        setErrors(resData?.message || t("errors.sendingOtpFailed"));
        return;
      }
      if (resData.statusCode === 201) {
        dispatch(
          showToast({
            title: t("toast.successTitle"),
            message: t("toast.otpSent"),
            theme: "success",
          })
        );
        setVerificationStage({
          stage: "otpVerification",
        });
        setOtpType("phone");
        setPayload({ phone: phone, countryCode: countryCode });
      } else {
        setErrors(t("errors.sendingOtpFailed"));
      }
    } catch (error) {
      setIsSubmitting(false);
      setErrors(t("errors.sendingOtpFailed"));
    }
  };

  const handleOnChange = (value: string, country: any) => {
    // Extract country code
    const extractedCountryCode = `+${country.dialCode}`;

    // Extract phone number by removing country code
    const phoneNumber = value.replace(country.dialCode, "").trim();

    setPhone(phoneNumber); // Set only the phone number
    setCountryCode(extractedCountryCode); // Set country code separately
  };

  return (
    <div className="form-box-shadow forms-container forms-button-gaps">
      <div className="form-title-wrap">
        <Typography variant="h1" className="title-txt">
          {t("title")}
        </Typography>
        <Typography variant="h2" className="sub-txt">
          {t("description")}{" "}
        </Typography>
      </div>
      <div className="forms-button-gaps">
        <div className="forms-group">
          <div className="label-flex">
            <label htmlFor="phnumber">{t("phoneLabel")}</label>
          </div>
          <div className="input-group-left">
            {/* <input
              className="forms-input"
              onChange={(e) => {
                setErrors("");
                setPhone(e.target.value);
              }}
            /> */}
            {/* <div className="i-g-l-placeholder">
              <Image
                src={CountryPlaceholder}
                width={20}
                height={20}
                alt="Placeholder"
              ></Image>
              <Typography variant="span" className="i-g-l-p-txt">
                +91
              </Typography>
            </div> */}
            {/* <CountryCode setCountryCode={setCountryCode} country_code={country_code}/> */}
            <PhoneInput
              value={`${countryCode?.replace("+", "")}${phone}`} // Ensure proper formatting
              country={country?.country_code.toLowerCase() || "in"}
              onChange={(value: string, country: any) =>
                handleOnChange(value, country)
              }
              inputStyle={{ width: "100%" }}
            />
          </div>
          {errors && (
            <Typography variant="span" className="error-txt">
              {errors}
            </Typography>
          )}
        </div>
        <button
          onClick={submitPhone}
          disabled={isSubmitting}
          className="btn-comp btn-c-primary btn-c-lg"
        >
          {isSubmitting ? t("button.submitting") : t("button.continue")}
        </button>
      </div>
    </div>
  );
};

export default PhoneVerification;
