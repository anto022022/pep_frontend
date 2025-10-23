"use client";

import useCookies from "@/app/[locale]/_hooks/useCookies";
import useStepperData from "@/app/[locale]/_hooks/useStepperData";
import { BusinessTypePathEnum } from "@/app/[locale]/_interface/OnboardInterface";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useRouter } from "next/navigation";
import { showToast } from "../_store/reducers/ui_store";

export default function useMoveStage() {
  const dispatch = useAppDispatch();
  const cookies = useCookies();
  const router = useRouter();
  const setStepper = useStepperData();

  const fetchAndMove = async (ele: any, index: number, locale: any) => {
    if (ele === "businessDetails") {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_IDN || "https://identity-api.sandbox.pepagora.org/"}onboarding/get-user-business-details`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            onboardSession: cookies.getCookie("onboardSession"),
          },
        }
      );

      if (!response.ok) return;

      const result = await response.json();
      // dispatch(setBusinessDetails({ businessDetails: result?.data }));
      // dispatch(setStageCount({ stage: index }));
      router.push(
        `/${locale}/onboard/${BusinessTypePathEnum[ele as keyof typeof BusinessTypePathEnum]
        }`
      );
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_IDN || "https://identity-api.sandbox.pepagora.org/"}onboarding/get-user-staging-data/${ele}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              onboardSession: cookies.getCookie("onboardSession"),
            },
          }
        );

        const result = await response.json();

        if (result.statusCode === 401) {
          dispatch(
            showToast({
              title: "Un Authorized!",
              message: result.message,
              theme: "warning",
            })
          );
          return;
        }

        if (!response.ok) {
          dispatch(
            showToast({
              title: "Error!",
              message: "Something went wrong",
              theme: "error",
            })
          );
          return;
        }

        const formData: { enum: string; data: any } = {
          enum: ele ?? "",
          data: result?.data?.[ele] ?? {},
        };

        // dispatch(setStageFormData({ stageFormData: formData }));
        setStepper.getStepperData(
          result?.data?.stageObj,
          result?.data?.businessType
        );
        router.push(
          `/${locale}/onboard/${BusinessTypePathEnum[ele as keyof typeof BusinessTypePathEnum]
          }`
        );
        // dispatch(setStageCount({ stage: index }));
      } catch (error) {
        console.error("Error fetching business details:", error);
      }
    }
  };

  return { fetchAndMove };
}
