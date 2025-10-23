"use client";

import Typography from "../../../../_components/Base/Typography";
import React, { useState } from "react";
import { VerificationStage } from "@/app/[locale]/_interface/AuthInterface";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { AuthPayloads } from "@/app/[locale]/_interface/AuthInterface";

type EmailVerificationProps = {
  setVerificationStage: (val: VerificationStage) => void;
  setOtpType: (val: string) => void;
  setPayload: (val: AuthPayloads) => void;
};

const EmailVerification: React.FC<EmailVerificationProps> = ({
  setVerificationStage,
  setOtpType,
  setPayload,
}) => {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<string>("");
  const cookies = useCookies();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const t = useTranslations("userVerification");

  const handleChange = (value: string) => {
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // setErrors(
    //   !emailRegex.test(value)
    //     ? "invalid email number"
    //     : !value.trim()
    //     ? "email number is required"
    //     : ""
    // );
    setErrors("");
    setEmail(value);
  };

  const submitEmail = async () => {
    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let emailError: string = !email.trim()
        ? t("email_errors.invalidEmailNumber")
        : !emailRegex.test(email)
        ? t("email_errors.emailNumberRequired")
        : "";

      setErrors(emailError);
      if (emailError) return;
      let authSession = cookies.getCookie("authSession");
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_IDN||"https://identity-api.sandbox.pepagora.org/"}auth/sendEmailOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authSession && { authSession: authSession }),
          },
          body: JSON.stringify({
            email: email,
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
        setOtpType("email");
        setPayload({ email: email });
      } else {
        setErrors(t("errors.sendingOtpFailed"));
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-box-shadow forms-container forms-button-gaps">
      <div className="form-title-wrap">
        <Typography variant="h1" className="title-txt">
          {t("emailTitle")}{" "}
        </Typography>
        <Typography variant="h2" className="sub-txt">
          {t("emailDescription")}{" "}
        </Typography>
      </div>
      <div className="forms-button-gaps">
        <div className="forms-group">
          <div className="label-flex">
            <label>Email</label>
          </div>
          <div className="input-group-left">
            <input
              style={{ paddingLeft: "10px" }}
              className="forms-input"
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
          {errors && (
            <Typography variant="span" className="error-txt">
              {errors}
            </Typography>
          )}
        </div>
        <button
          onClick={submitEmail}
          disabled={isSubmitting}
          className="btn-comp btn-c-primary btn-c-lg"
        >
          {isSubmitting ? t("button.submitting") : t("button.continue")}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
