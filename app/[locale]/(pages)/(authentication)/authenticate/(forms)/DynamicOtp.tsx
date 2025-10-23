"use client";

import useCookies from "@/app/[locale]/_hooks/useCookies";
import useSession from "@/app/[locale]/_hooks/useSession";
import {
  AuthPayloads,
  VerificationStage,
} from "@/app/[locale]/_interface/AuthInterface";
import { useTranslations } from "next-intl"; // For client-side
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BackLeft from "../../../../../../assets/img/icons/back-left.svg";
import Typography from "../../../../_components/Base/Typography";
import OtpInput from "../../../../_components/MicroComponents/OtpInput";

type AuthFormProps = {
  setVerificationStage: (val: VerificationStage) => void;
  setHashCredential: (val: string) => void;
  setOtpType: (val: string) => void;
  setPatchCall: (val: boolean) => void;
  otpType: string;
  existingUser: boolean;
  patchCall: boolean;
  hashCredential: string;
  payload: AuthPayloads;
  locale: string;
};

const DynamicOtp: React.FC<AuthFormProps> = ({
  setVerificationStage,
  setOtpType,
  setHashCredential,
  hashCredential,
  otpType,
  payload,
  setPatchCall,
  patchCall,
  locale,
}) => {
  const router = useRouter();
  const cookies = useCookies();
  // const postLogin = usePostLoginRedirect();
  const { loadSession } = useSession();
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

  const verifyCredential = async (otp: string) => {
    try {
      setLoading(true);
      if (!payload) return;
      let endPoint =
        otpType === "email" ? "upsertMailSession" : "phoneVerification";
      let url = `${
        process.env.NEXT_PUBLIC_API_URL_IDN ||
        "https://identity-api.sandbox.pepagora.org/"
      }auth/${endPoint}`;
      let authSession = cookies.getCookie("authSession");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authSession && { authSession: authSession }),
        },
        body: JSON.stringify({
          ...(patchCall && { patchCall: patchCall }),
          // [otpType === "email" ? otpType : "phoneNo"]: payload,
          ...(otpType === "email"
            ? { email: payload.email }
            : {
                phoneNo: payload.phone,
                countryCode: payload.countryCode,
              }),
          // ...(otpType === "phoneNo" && {
          //   phoneNo: payload.phone,
          //   countryCode: payload.countryCode,
          // }),
          otp: otp,
        }),
      });
      const resData = await response.json();
      if (patchCall) setPatchCall(false);
      if (resData.statusCode !== 200 || !response.ok) {
        setError(resData.message);
        return;
      }
      // dispatch(
      //   showToast({
      //     title: "Success",
      //     message: "OTP sent successfully!",
      //     theme: "success",
      //   })
      // );
      if (resData?.data?.userVerified && resData?.data?.onboardSession) {
        cookies.setCookie("onboardSession", resData.data.onboardSession, 2);
        cookies.deleteCookie("authSession");
        router.push(`/${locale}/onboard`);
        return;
      }
      if (resData?.data?.userVerified && resData?.data?.userSession) {
        cookies.setCookie("userSession", resData.data.userSession, 2);
        cookies.deleteCookie("onboardSession");
        cookies.deleteCookie("authSession");
        router.push(`/${locale}/app`);
        // postLogin();
        loadSession();
        return;
      }
      if (!resData?.data?.clientSessionId) return;
      cookies.setCookie("authSession", resData?.data?.clientSessionId, 1);
      setVerificationStage({
        stage: resData?.data?.existingUser
          ? "userVerification"
          : !resData?.data?.emailVerified
          ? "upsertMailSession"
          : "phoneVerification",
      });
      setHashCredential(resData?.data?.hintedText ?? resData?.data?.hintedText);
    } catch (err) {
      setError("OTP verification failed");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const backToPreviousStage = () => {
    let cookie = cookies.getCookie("authSession");
    if (hashCredential) {
      setOtpType(otpType === "email" ? "phone" : "email");
    }
    setVerificationStage({
      stage: hashCredential
        ? "userVerification"
        : cookie && otpType === "email"
        ? "upsertMailSession"
        : cookie && otpType === "phone"
        ? "phoneVerification"
        : "initial",
    });
  };

  const resendOtp = async () => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL_IDN ||
        "https://identity-api.sandbox.pepagora.org/"
      }auth/sendPhoneOtp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNo: payload.phone,
          countryCode: payload.countryCode,
        }),
      }
    );
    if (!response.ok) {
      return;
    }
  };

  return (
    <div className="wth-back-btn forms-container">
      <div onClick={() => backToPreviousStage()} className="back-block">
        <Image src={BackLeft} width={20} height={20} alt="Back"></Image>
        <Typography variant="span" className="b-b-txt">
          {t("otpPage.backButton")}
        </Typography>
      </div>
      <div className="form-box-shadow form-gaps otp-card">
        <div className="form-title-wrap">
          <Typography variant="h1" className="title-txt">
            {t("otpPage.title")}
          </Typography>
          <Typography variant="h2" className="sub-txt">
            {/* {t("otpPage.subtitle", {otpType === "email"
                ? payload?.email
                : `${payload?.countryCode} ${payload?.phone}`})} */}
            {/* {t(
              `${
                payload.smsType === "whatsapp"
                  ? "otpPage.subtitle-wa"
                  : "otpPage.subtitle-sms"
              }`,
              {
                payload:
                  otpType === "email"
                    ? payload?.email
                    : `${payload?.countryCode} ${payload?.phone}`,
              }
            )} */}
            {`${
              payload.smsType === "whatsapp"
                ? t("otpPage.subtitle-wa", {
                    payload:
                      otpType === "email"
                        ? payload?.email
                        : `${payload?.countryCode} ${payload?.phone}`,
                  })
                : t("otpPage.subtitle-sms", {
                    // title: otpType === "email" ? "Email" : "WhatsApp",
                    payload:
                      otpType === "email"
                        ? payload?.email
                        : `${payload?.countryCode} ${payload?.phone}`,
                  })
            }`}
          </Typography>
        </div>
        <div className="forms-button-gaps">
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
