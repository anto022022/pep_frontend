"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import {
  AuthPayloads,
  Fields,
  VerificationStage,
} from "@/app/[locale]/_interface/AuthInterface";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type UserVerificationProps = {
  setVerificationStage: (val: VerificationStage) => void;
  otpType: string;
  payload: AuthPayloads;
  hashCredential: string;
  setOtpType: (val: string) => void;
  setPatchCall: (val: boolean) => void;
  setPayload: (val: AuthPayloads) => void;
  locale: string;
};

const UserVerification: React.FC<UserVerificationProps> = ({
  setVerificationStage,
  setOtpType,
  setPayload,
  setPatchCall,
  otpType,
  payload,
  hashCredential,
}) => {
  const dispatch = useAppDispatch();
  const [fields, setFields] = useState<Fields>({
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Fields>({
    email: "",
    phone: "",
  });
  const cookies = useCookies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("userVerification");
  let country = useAppSelector((state: RootState) => state.location);
  const [countryCode, setCountryCode] = useState<string>(country?.country_code);
  const verifyUser = async () => {
    try {
      if (!payload) return;
      if (otpType !== "email") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let emailError: string = "";
        if (!fields.email.trim()) {
          emailError = t("emailError.required");
        } else if (!emailRegex.test(fields.email)) {
          emailError = t("emailError.invalid");
        }
        setErrors((prev) => ({ ...prev, email: emailError }));
        if (emailError) return;
      } else {
        const phoneRegex = /^\+?\d{0,4}[-.\s]?\d{8,12}$/;
        let phoneError: string = "";
        if (!fields.phone.trim()) {
          phoneError = t("phoneNoError.required");
        } else if (!phoneRegex.test(fields.phone)) {
          phoneError = t("phoneNoError.invalid");
        }
        setErrors((prev) => ({ ...prev, phone: phoneError }));
        if (phoneError) return;
      }

      let url = `${process.env.NEXT_PUBLIC_API_URL_IDN || "https://identity-api.sandbox.pepagora.org/"}auth/userVerification`;
      let authSession = cookies.getCookie("authSession");
      let body = {
        ...(otpType === "email" && { phoneNo: fields.phone }),
        ...(otpType === "phone" && { email: fields.email }),
        countryCode: countryCode,
      };
      setIsSubmitting(true);
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authSession && { authSession: authSession }),
        },
        body: JSON.stringify(body),
      });
      setIsSubmitting(false);
      const resData = await response.json();
      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          ...(otpType === "email" && { phone: resData?.message }),
          ...(otpType === "phone" && { phone: resData?.message }),
        }));
        return;
      }
      //   {
      //   throw new Error("Failed to send data");
      // }
      if (resData.statusCode !== 200) {
        setErrors((prev) => ({
          ...prev,
          ...(otpType === "email" && { phone: resData.message }),
          ...(otpType === "phone" && { email: resData.message }),
        }));
        return;
      }
      dispatch(
        showToast({
          title: "Success",
          message: "OTP sent successfully!",
          theme: "success",
        })
      );
      setVerificationStage({
        stage: "otpVerification",
      });
      setOtpType(otpType === "email" ? "phone" : "email");
      // setPayload(otpType === "email" ? fields.phone : fields.email);
      setPayload({
        ...(otpType === "email"
          ? { phone: fields.phone, countryCode: countryCode }
          : { email: fields.email }),
        // ...(otpType === "email" && {phone:fields.phone, countryCode:countryCode }),
        // phone: fields?.phone,
        // countryCode: countryCode,
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleChange = (type: keyof Fields, value: string) => {
    setErrors({
      email: "",
      phone: "",
    });
    // let errorObj: Partial<Fields> = {
    //   email: "",
    //   phone: "",
    // };
    // if (!value.trim()) {
    //   errorObj = {
    //     [type]: `${type} cannot be empty`,
    //   };
    // }
    // if (type === "email") {
    //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //   errorObj = {
    //     [type]: !emailRegex.test(value) ? "invalid email address" : "",
    //   };
    // }
    // if (type === "phone") {
    //   const phoneRegex = /^[0-9]{10}$/;
    //   errorObj = {
    //     [type]: !phoneRegex.test(value) ? "invalid phone number" : "",
    //   };
    // }
    // let error = errorObj[type] ?? "";
    // setErrors((prev) => ({ ...prev, [type]: error }));

    setFields((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const linkNewNumber = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPatchCall(true);
    setVerificationStage({
      stage: "phoneVerification",
    });
  };

  const handleOnChange = (value: string, country: any) => {
    // Extract country code
    const extractedCountryCode = `+${country.dialCode}`;

    // Extract phone number by removing country code
    const phoneNumber = value.replace(country.dialCode, "").trim();

    setFields((prevFields) => ({
      ...prevFields, // Keep previous values
      phone: phoneNumber, // Update only phone
    }));

    setCountryCode(extractedCountryCode); // Set country code separately
  };

  return (
    <div className="form-box-shadow forms-container form-gaps">
      <div className="forms-button-gaps">
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("title")}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {t("linkDescriptio1")}{" "}
            <Typography variant="span" className="dark-txt">
              {t("linkDescriptio2", { hashCredential })}
            </Typography>
          </Typography>
        </div>
        <div className="forms-button-gaps">
          {otpType === "email" ? (
            <div className="forms-group">
              <div className="label-flex">
                <label htmlFor="phnumber"> {t("phoneLabel")}</label>
              </div>
              <div className="input-group-left">
                {/* <input
                  className="forms-input"
                  value={fields.phone}
                  onChange={(ele) => handleChange("phone", ele.target.value)}
                />
                <div className="i-g-l-placeholder">
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

                <PhoneInput
                  country={country?.country_code.toLowerCase() || "in"} // Default country
                  value={`${countryCode?.replace("+", "")}${fields?.phone}`} // Ensure proper formatting
                  onChange={handleOnChange}
                  inputStyle={{ width: "100%" }}
                />
              </div>
              {errors.phone && (
                <Typography variant="span" className="error-txt">
                  {errors.phone}
                </Typography>
              )}
            </div>
          ) : (
            <div className="forms-group">
              <div className="label-flex">
                <label htmlFor="phone_number">{t("emailLabel")}</label>
              </div>
              <div className="input-group-left">
                <input
                  className="forms-input"
                  style={{ paddingLeft: "10px" }}
                  value={fields.email}
                  onChange={(ele) => handleChange("email", ele.target.value)}
                />
              </div>
              {errors.email && (
                <Typography variant="span" className="error-txt">
                  {errors.email}
                </Typography>
              )}
            </div>
          )}
          <button
            onClick={verifyUser}
            disabled={isSubmitting}
            className="btn-comp btn-c-primary btn-c-lg"
          >
            {isSubmitting ? t("button.submitting") : t("sendCode")}
          </button>
        </div>
      </div>
      <div className="other-option">
        <Link
          href="#"
          onClick={() => setVerificationStage({ stage: "tryAnotherWay" })}
        >
          <Typography variant="span" className="o-o-txt">
            {t("tryAnotherWay")}
          </Typography>
        </Link>
        <Link
          href="#"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => linkNewNumber(e)}
        >
          <Typography variant="span" className="o-o-txt">
            {t("linkNo")}
          </Typography>
        </Link>
      </div>
    </div>
  );
};

export default UserVerification;
