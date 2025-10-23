"use client";
import { useGetEasyStepQuery } from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { useGetDashboardCardDetailsQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Typography from "../Base/Typography";
import {
  ChevronRightIcon,
  CollapseCardIcon,
  CompletedIcon,
  ExpandCardIcon,
  PendingDottedIcon,
} from "../Icons/SVGIcons";

const EasyGuide = () => {
  const [toggleGuide, setToggleGuide] = useState<boolean>(true);
  const [bodyHeight, setBodyHeight] = useState<number | 0>(0);

  const heightRef = useRef<HTMLDivElement | null>(null);
  const businessProfileT = useTranslations("businessProfile.easyGuide");

  useEffect(() => {
    if (toggleGuide && heightRef.current) {
      setBodyHeight(heightRef.current.scrollHeight);
    }
  }, [bodyHeight]);

  // user type api
  const { data: dashboardDetails, refetch: dashboardRefetch } =
    useGetDashboardCardDetailsQuery();

  const { data: easyInfo, refetch } = useGetEasyStepQuery();
  const router = useRouter();

  const userType = dashboardDetails?.data?.userType;
  const isKycKybComplete = (() => {
    if (userType === "buyer") {
      return easyInfo?.data?.isKYCCompleted;
    }
    if (userType === "seller" || userType === "both") {
      return easyInfo?.data?.isKYCCompleted && easyInfo?.data?.isKYBCompleted;
    }
    return false;
  })();

  const requiredSteps = [
    {
      key: "businessProfile",
      isComplete: easyInfo?.data?.isBusinessProfileComplete,
    },
    {
      key: "kycKyb",
      isComplete: isKycKybComplete,
    },
  ];

  if (userType === "seller" || userType === "both") {
    requiredSteps.push({
      key: "product",
      isComplete: easyInfo?.data?.isProductAdded,
    });
  }
  const completedStepsCount = requiredSteps.filter(
    (step) => step.isComplete
  ).length;
  const totalSteps = requiredSteps.length;

  useEffect(() => {
    refetch();
    dashboardRefetch();
  }, []);

  return (
    <>
      <div className="easy-guide-comp">
        <div className="e-g-c-head">
          <div className="e-g-c-h-left">
            <Typography variant="span" className="e-g-c-h-title">
              {businessProfileT("easySetupGuide")}
            </Typography>
            <Typography variant="span" className="e-g-c-h-subtxt">
              {completedStepsCount} of {totalSteps}{" "}
              {businessProfileT("stepsCompleted")}
            </Typography>
          </div>
          <div className="e-g-c-h-right">
            {toggleGuide ? (
              <CollapseCardIcon onClick={() => setToggleGuide(!toggleGuide)} />
            ) : (
              <ExpandCardIcon onClick={() => setToggleGuide(!toggleGuide)} />
            )}
          </div>
        </div>
        <div
          className={`e-g-c-body ${!toggleGuide ? "toggle-guide-close" : ""}`}
          ref={heightRef} style={{ height: "auto" }}
        >
          <div className="stepper-card-block s-c-b-12px">
            <div
              className={`stepper-card-comp easy-guide-card-comp completed ${!easyInfo?.data?.isBusinessProfileComplete
                ? "pending"
                : "completed"
                }`}
              style={{
                cursor: "default",
              }}
            >
              <div className="s-c-c-block ">
                <div className="s-c-c-b-header">
                  <div className="s-c-c-b-h-left">
                    {easyInfo?.data?.isBusinessProfileComplete && (
                      <CompletedIcon />
                    )}
                    {!easyInfo?.data?.isBusinessProfileComplete && (
                      <PendingDottedIcon
                        className={"status-icon active-dotted-icon"}
                      />
                    )}
                    <div className="s-c-c-b-h-content">
                      <span className="title">
                        {businessProfileT("completeYourBusinessProfile")}
                      </span>
                      <span className="subtitle">
                        {businessProfileT("completeYourSetup")}
                      </span>
                    </div>
                  </div>
                  {!easyInfo?.data?.isBusinessProfileComplete && (
                    <div
                      className="s-c-c-b-h-right" style={{ cursor: !easyInfo?.data?.isBusinessProfileComplete ? 'pointer' : 'default' }}
                      onClick={() => router.push("/app/business-profile")}
                    >
                      <ChevronRightIcon />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* KYC & KYB */}
            <div
              className={`stepper-card-comp easy-guide-card-comp completed ${!easyInfo?.data?.isKYCCompleted ||
                !easyInfo?.data?.isKYBCompleted
                ? "pending"
                : "completed"
                }`}
              style={{
                cursor:
                  !easyInfo?.data?.isKYCCompleted ||
                    !easyInfo?.data?.isKYBCompleted
                    ? "pointer"
                    : "default",
              }}
              onClick={() =>
                router.push(
                  "/app/settings/account-settings?type=compliance-settings"
                )
              }
            >
              <div className="s-c-c-block">
                <div className="s-c-c-b-header">
                  <div className="s-c-c-b-h-left">
                    {easyInfo?.data?.isKYCCompleted &&
                      easyInfo?.data?.isKYBCompleted &&
                      (userType === "seller" || userType === "both") ? (
                      <CompletedIcon />
                    ) : // : easyInfo?.data?.isKYBCompleted ? (
                      //   <CompletedIcon />
                      // )
                      easyInfo?.data?.isKYCCompleted && userType === "buyer" ? (
                        <CompletedIcon />
                      ) : (
                        <PendingDottedIcon
                          className={"status-icon active-dotted-icon"}
                        />
                      )}

                    {/* <ActiveDottedIcon className={"status-icon active-icon"} /> */}
                    <div className="s-c-c-b-h-content">
                      <span className="title">
                        {!easyInfo?.data?.isKYCCompleted &&
                          !easyInfo?.data?.isKYBCompleted &&
                          (userType === "seller" || userType === "both")
                          ? businessProfileT("KYCAndKYBVerification")
                          : // : (!easyInfo?.data?.isKYBCompleted && (userType === "seller" || userType === "both"))
                          //   ? businessProfileT("KYBVerification")
                          !easyInfo?.data?.isKYCCompleted &&
                            userType === "buyer"
                            ? businessProfileT("KYCVerification")
                            : businessProfileT(
                              userType === "buyer"
                                ? "KYCVerification"
                                : "KYCAndKYBVerification"
                            )}
                      </span>
                    </div>
                  </div>
                  {(!easyInfo?.data?.isKYCCompleted ||
                    !easyInfo?.data?.isKYBCompleted) && (
                      <div
                        className="s-c-c-b-h-right"
                      // onClick={() =>
                      //   router.push(
                      //     "settings/account-settings?type=compliance-settings"
                      //   )
                      // }
                      >
                        <ChevronRightIcon />
                      </div>
                    )}
                </div>
              </div>
            </div>
            {/* Add Product */}
            {(userType === "seller" || userType === "both") && (
              <div
                className={`stepper-card-comp easy-guide-card-comp ${!easyInfo?.data?.isProductAdded ? "pending" : "completed"
                  }`}
                style={{
                  cursor: !easyInfo?.data?.isProductAdded
                    ? "pointer"
                    : "default",
                }}
                onClick={() => router.push("/app/sales-product/form")}
              >
                <div className="s-c-c-block">
                  <div className="s-c-c-b-header">
                    <div className="s-c-c-b-h-left">
                      {easyInfo?.data?.isProductAdded && <CompletedIcon />}
                      {!easyInfo?.data?.isProductAdded && (
                        <PendingDottedIcon
                          className={"status-icon active-dotted-icon"}
                        />
                      )}
                      {/* <CompletedIcon /> */}
                      <div className="s-c-c-b-h-content">
                        <span className="title">
                          {businessProfileT("firstProduct")}
                        </span>
                      </div>
                    </div>
                    {!easyInfo?.data?.isProductAdded && (
                      <div
                        className="s-c-c-b-h-right"
                      // onClick={() => router.push("sales-product/form")}
                      >
                        <ChevronRightIcon />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EasyGuide;
