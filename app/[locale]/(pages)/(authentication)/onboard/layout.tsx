"use client";
import { useRouter } from "next/navigation";
// import useCookies from "@/app/_hooks/useCookies";
import Loading from "@/app/[locale]/(pages)/(authentication)/onboard/loading";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useStepperData from "@/app/[locale]/_hooks/useStepperData";
import { BusinessTypePathEnum } from "@/app/[locale]/_interface/OnboardInterface";
import { useGetUserBusinessTypeAndStageQuery } from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import {
  setBusinessType,
  setShowSkip,
  setStage,
  setUserCountryCode,
  setUserEmail,
  setUserPhone,
  setUserType,
} from "@/app/[locale]/_store/reducers/onboarding_store";
import { setUserTypeInUserData } from "@/app/[locale]/_store/reducers/user_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { ReactNode, use, useEffect } from "react";

function OnBoardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<any>;
}) {
  const router = useRouter();
  const cookies = useCookies();
  const unwrappedParams = use(params);
  const dispatch = useAppDispatch();
  const stepper = useStepperData();
  const locale = unwrappedParams?.locale || "en";

  const { data, isSuccess, isLoading, isFetching, refetch } =
    useGetUserBusinessTypeAndStageQuery();

  useEffect(() => {
    refetch();
    return () => {
      dispatch(setShowSkip(false));
    };
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      let cookie = cookies.getCookie("onboardSession");
      let userCookie = cookies.getCookie("userSession");
      if (!cookie && !userCookie) {
        router.push(`/${locale}/authenticate`);
        return;
      }

      if (data?.data?.onBoardingComplete || data?.data?.onBoardingSkipped) {
        cookies.deleteCookie("onboardSession");
        router.push(`/${locale}/app`);
        return;
      }

      if (!data?.data?.userType) {
        router.push(`/${locale}/onboard/usertype`);
        return;
      }
      dispatch(setUserType(data?.data?.userType));
      dispatch(setUserTypeInUserData(data?.data?.userType));
      dispatch(setUserCountryCode(data?.data?.countryCode));
      dispatch(setUserPhone(data?.data?.phoneNo));
      dispatch(setUserEmail(data?.data?.email));
      if (data?.data?.userType === "buyer") {
        const activeKey =
          Object.keys(data?.data?.stage).find(
            (key: string) => data?.data?.stage[key] === "active"
          ) || "businessDetails";
        if (data?.data?.businessType) {
          dispatch(setBusinessType(data?.data?.businessType));
        }
        if (data?.data?.stage) {
          dispatch(setStage(data?.data?.stage));
        }
        stepper.getStepperData(data?.data?.stage ?? {}, data?.data?.userType);
        router.push(`/${locale}/onboard/${BusinessTypePathEnum[activeKey]}`);
        dispatch(setShowSkip(true));
        return;
      } else {
        const activeKey =
          Object.keys(data?.data?.stage).find(
            (key: string) => data?.data?.stage[key] === "active"
          ) || "businessDetails";
        if (data?.data?.businessType) {
          dispatch(setBusinessType(data?.data?.businessType));
        }
        if (data?.data?.stage) {
          dispatch(setStage(data?.data?.stage));
        }
        stepper.getStepperData(
          data?.data?.stage ?? {},
          data?.data?.businessType
        );
        router.push(`/${locale}/onboard/${BusinessTypePathEnum[activeKey]}`);
        dispatch(setShowSkip(true));
        return;
      }
    }
  }, [data, isSuccess, isFetching]);

  // const fetchUserStatus = async () => {
  //   try {
  //     let cookie = cookies.getCookie("onboardSession");
  //     if (!cookie) {
  //       router.push(`/${locale}/authenticate`);
  //     }
  //     // setLoading(true);
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL_IDN||"https://identity-api.sandbox.pepagora.org/"}onboarding/get-user-stage`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           onboardSession: cookie,
  //         },
  //       }
  //     );
  //     if (!response.ok) return;
  //     const result = await response.json();
  //     dispatch(setBusinessType({ businessType: result?.data?.businessType }));

  //     if (!result?.data?.userType) {
  //       router.push(`/${locale}/onboard/usertype`);
  //       return;
  //     }
  //     if (!result?.data?.businessType) {
  //       router.push(`/${locale}/onboard/business-details`);
  //       return;
  //     }
  //     const entries = Object.entries(result?.data?.stages);
  //     const activeStepIndex = entries.findIndex(
  //       // ([key, value]) => value === "active"
  //       ([value]) => value === "active"
  //     );
  //     const activeStep =
  //       activeStepIndex !== -1
  //         ? [...entries[activeStepIndex], activeStepIndex]
  //         : null;
  //     if (!activeStep) return;
  //     let stepperData = result.data;
  //     if (stepperData.userType) {
  //       delete stepperData.userType;
  //     }
  //     setStepper.getStepperData(
  //       result?.data?.stages,
  //       result?.data?.businessType
  //     );
  //     dispatch(setStageCount({ stage: activeStepIndex }));
  //     router.push(
  //       `/${locale}/onboard/${
  //         BusinessTypePathEnum[
  //           activeStep[0] as keyof typeof BusinessTypePathEnum
  //         ]
  //       }`
  //     );
  //   } catch (error) {
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  if (isLoading) {
    return <Loading />;
  }

  return <div>{children}</div>;
}

export default OnBoardLayout;
