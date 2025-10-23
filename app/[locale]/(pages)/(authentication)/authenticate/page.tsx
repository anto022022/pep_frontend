"use client";

import AuthForm from "@/app/[locale]/(pages)/(authentication)/authenticate/(forms)/AuthForm";
import DynamicOtp from "@/app/[locale]/(pages)/(authentication)/authenticate/(forms)/DynamicOtp";
// import EmailVerification from "@/app/[locale]/(pages)/(authentication)/authenticate/(forms)/EmailVerification";
import Loading from "@/app/[locale]/_components/Common/Loading";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import { useVerifyCredential } from "@/app/[locale]/_hooks/useVerifyCredential";
import {
  AuthPayloads,
  VerificationStage,
} from "@/app/[locale]/_interface/AuthInterface";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import PhoneVerification from "./(forms)/PhoneVerification";
// import TryAnotherWay from "./(forms)/TryAnotherWay";
// import UserVerification from "./(forms)/UserVerification";

const page = ({ params }: { params: Promise<any> }) => {
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const otp = searchParams.get("otp") || "";

  const { isVerifyLoading, verify } = useVerifyCredential();
  useEffect(() => {
    if (userId && otp) {
      verify({ locale, userId, otp });
    }
  }, [userId, otp]);

  if (userId && otp && isVerifyLoading) {
    return <Loading />;
  }

  const [verificationStage, setVerificationStage] = useState<VerificationStage>(
    {
      stage: "loading",
    }
  );
  const [otpType, setOtpType] = useState<string>("");
  const [payload, setPayload] = useState<AuthPayloads>({
    email: "",
    phone: "",
    countryCode: "",
    countryISOCode: "",
  });
  const [hashCredential, setHashCredential] = useState<string>("");
  const [existingUser, setExistingUser] = useState<boolean>(true);
  const [patchCall, setPatchCall] = useState<boolean>(false);
  const cookie = useCookies();
  const router = useRouter();

  useEffect(() => {
    redirectUser();
  }, []);

  const redirectUser = () => {
    if (cookie.getCookie("onboardSession")) {
      router.push(`/${locale}/onboard`);
      return;
    }
    let authSession = cookie.getCookie("authSession") ?? "";
    if (!authSession) {
      setVerificationStage({ stage: "initial" });
      return;
    }
    let decodeData: any = decodeToken(authSession);
    if (decodeData?.hashedNumber) {
      setOtpType("email");
      setPayload((prev) => ({
        ...prev,
        email: decodeData?.email,
      }));
      setVerificationStage({ stage: "userVerification" });
      setHashCredential(decodeData?.hashedNumber);
      return;
    }
    setOtpType("phone");
    // setPayload(decodeData?.phoneNo);
    setPayload((prev) => ({
      ...prev,
      phone: decodeData?.phoneNo,
    }));
    setVerificationStage({ stage: "phoneVerification" });
  };

  const decodeToken = (token: string) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (searchParams.get("redirect")) {
      cookie.setCookie(
        "redirectTo",
        Buffer.from(searchParams.get("redirect") || "").toString("base64"),
        1
      );
    }
  }, [searchParams]);

  useEffect(() => {
    redirectUser();
  }, []);

  const renderVerificationUI = () => {
    switch (verificationStage.stage) {
      case "initial":
      default:
        return (
          <AuthForm
            setVerificationStage={(val: VerificationStage) =>
              setVerificationStage(val)
            }
            setExistingUser={(val: boolean) => setExistingUser(val)}
            setOtpType={(val: string) => setOtpType(val)}
            setPayload={(val: AuthPayloads) => setPayload(val)}
            payload={payload}
          />
        );
      case "otpVerification":
        return (
          <DynamicOtp
            setVerificationStage={(val: VerificationStage) =>
              setVerificationStage(val)
            }
            setHashCredential={(val: string) => setHashCredential(val)}
            setOtpType={(val: string) => setOtpType(val)}
            hashCredential={hashCredential}
            existingUser={existingUser}
            otpType={otpType}
            payload={payload}
            patchCall={patchCall}
            setPatchCall={(val: boolean) => setPatchCall(val)}
            locale={locale}
          />
        );
      // case "userVerification":
      //   return (
      //     <UserVerification
      //       setVerificationStage={(val: VerificationStage) =>
      //         setVerificationStage(val)
      //       }
      //       hashCredential={hashCredential}
      //       otpType={otpType}
      //       payload={payload}
      //       setOtpType={(val: string) => setOtpType(val)}
      //       setPayload={(val: AuthPayloads) => setPayload(val)}
      //       setPatchCall={(val: boolean) => setPatchCall(val)}
      //       locale={locale}
      //     />
      //   );
      // case "upsertMailSession":
      //   return (
      //     <EmailVerification
      //       setVerificationStage={(val: VerificationStage) =>
      //         setVerificationStage(val)
      //       }
      //       setOtpType={(val: string) => setOtpType(val)}
      //       setPayload={(val: AuthPayloads) => setPayload(val)}
      //     />
      //   );
      case "phoneVerification":
        return (
          <PhoneVerification
            setVerificationStage={(val: VerificationStage) =>
              setVerificationStage(val)
            }
            setOtpType={(val: string) => setOtpType(val)}
            setPayload={(val: AuthPayloads) => setPayload(val)}
          />
        );
      // case "tryAnotherWay":
      //   return (
      //     <TryAnotherWay
      //       hashCredential={hashCredential}
      //     />
      //   );
      case "loading":
        return <div className="loading-spinner"></div>;
    }
  };

  return <>{renderVerificationUI()}</>;
};

export default page;
