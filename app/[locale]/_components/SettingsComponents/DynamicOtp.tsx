"use client";

import useCookies from "@/app/[locale]/_hooks/useCookies";
import {
  verifyPayload
} from "@/app/[locale]/_interface/AuthInterface";
import { useTranslations } from "next-intl"; // For client-side
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import BackLeft from "../../../../../../assets/img/icons/back-left.svg";
import Typography from "@/app/[locale]/_components/Base/Typography";
import OtpInput from "@/app/[locale]/_components/MicroComponents/OtpInput";
import { useSendOptVerificaionMutation } from "@/app/[locale]/_store/apiReducer/settingsApi";

type AuthFormProps = {
  setOtpType: (val: string) => void;
  otpType: string;
  hashCredential: string;
  payload: verifyPayload;
  onVerificationSuccess: () => void;
};

const DynamicOtp: React.FC<AuthFormProps> = ({
  hashCredential,
  otpType,
  payload,
  onVerificationSuccess,
}) => {
  const router = useRouter();
  const cookies = useCookies();
  const t = useTranslations("dynamicOtp");
  const [timer, setTimer] = useState(119);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  const [sendOtpVerification] = useSendOptVerificaionMutation();

  const verifyCredential = async (otp: string) => {
    // debugger;
    try {
      const response = await sendOtpVerification({
        otp,
        ...(otpType === "email"
          ? { email: payload.email }
          : {
            phoneNo: payload.phoneNo,
            countryCode: payload.countryCode,
          }),
        hashCredential,
      }).unwrap();
      if (response.statusCode === 200 || response.statusCode === 201) {
        onVerificationSuccess();
      }
    } catch (err) {
      setError(`OTP verification failed - ${err?.data?.message}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_IDN ||
      "https://identity-api.sandbox.pepagora.org/"
      }auth/${otpType === "email" ? "sendEmailOtp" : "sendPhoneOtp"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // ...(otpType === "email" ? { email: payload } : { phoneNo: payload }),
          ...(otpType === "email" && { email: payload.email }),
          ...(otpType === "phoneNo" && payload),
        }),
      }
    );
    if (!response.ok) {
      return;
    }
  };

  return (
    <div className="wth-back-btn forms-container">
      <div className="form-box-shadow form-gaps otp-card">
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("otpPage.title")}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {/* {t("otpPage.subtitle", {otpType === "email"
                ? payload?.email
                : `${payload?.countryCode} ${payload?.phone}`})} */}

            {t("otpPage.subtitle", {
              title: otpType === "email" ? "Email" : "Whatsapp",
              payload:
                otpType === "email"
                  ? payload?.email
                  : `${payload?.countryCode} ${payload?.phoneNo}`,
            })}
          </Typography>
        </div>
        <div className="auth-layout forms-button-gaps">
          <OtpInput
            error={error}
            setError={(val: string) => setError(val)}
            verifyCredential={(val: string) => verifyCredential(val)}
            resendOtp={() => resendOtp()}
            loading={loading}
          ></OtpInput>
        </div>
      </div>
    </div>
  );
};

export default DynamicOtp;
