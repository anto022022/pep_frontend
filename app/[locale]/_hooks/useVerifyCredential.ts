"use client";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useSession from "@/app/[locale]/_hooks/useSession";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VerifyProps {
  locale: string;
  userId: string;
  otp: string;
}

export function useVerifyCredential() {
  const router = useRouter();
  const cookies = useCookies();
  const { loadSession } = useSession();

  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const verify = async ({ locale, userId, otp }: VerifyProps) => {
    try {
      setIsVerifyLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL_IDN ||
        "https://identity-api.sandbox.pepagora.org/"
        }auth/super_admin_verification`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          otp,
        }),
      });

      const resData = await response.json();
      if (resData.statusCode !== 200 || !response.ok) {
        setIsVerifyLoading(false);
        return;
      }
      if (resData?.data?.userVerified && resData?.data?.onboardSession) {
        cookies.setCookie("onboardSession", resData.data.onboardSession, 2);
        cookies.deleteCookie("authSession");
        router.push(`/${locale}/onboard`);
        return;
      }
      if (resData?.data?.userVerified && resData?.data?.userSession) {
        cookies.setCookie("userSession", resData.data.userSession, 2);
        loadSession();
        cookies.deleteCookie("onboardSession");
        cookies.deleteCookie("authSession");
        router.push(`/${locale}/app`);
        return;
      }
      if (!resData?.data?.clientSessionId) return;
      cookies.setCookie("authSession", resData?.data?.clientSessionId, 1);
    } catch (err) {
      console.error("Error during OTP verification", err);
    } finally {
      setTimeout(() => {
        setIsVerifyLoading(false);
      }, 2000);
    }
  };
  return { isVerifyLoading, verify };
}
