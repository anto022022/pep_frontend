"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import { LeftArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import StepperCardDialog from "@/app/[locale]/_components/OverLay/StepperCardDialog";
import Stepper from "@/app/[locale]/_components/StoreFront/Stepper";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import useStepperStatus from "@/app/[locale]/_hooks/useStepperStatus";
import {
  AccountSettingsStage,
  AccountSettingsStageKey,
  accountSettingsStepper,
  Step,
} from "@/app/[locale]/_models/StoreFront";
import {
  setCurrentForm,
  setStepperStatus,
} from "@/app/[locale]/_store/reducers/stepper_status_store";
import { setIsAccountSettingsSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const [stepper, setStepper] = useState<Step[]>(accountSettingsStepper);
  const isMobile = useIsMobile(1200);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const accSetLang = useTranslations("accountSettings");
  const userType = useAppSelector((state) => state.userData.userType);
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const isAccountSettingsSidebarOpen = useAppSelector(
    (state: RootState) => state.uiData.isAccountSettingsSidebarOpen
  );

  useEffect(() => {
    dispatch(
      setStepperStatus({
        ...currentStepperStatus,
        // [AccountSettingsStageKey.BusinessSettings]: "pending",
        // [AccountSettingsStageKey.ComplianceSettings]: "active",
        // [AccountSettingsStageKey.TexSettings]: "pending",
        // [AccountSettingsStageKey.DataPrivacySettings]: "pending",
        // [AccountSettingsStageKey.SubscriptionDetails]: "pending",
        // [AccountSettingsStageKey.UserSettings]: "pending",
      })
    );
    return () => {
      dispatch(setStepperStatus({}));
    };
  }, []);
  useEffect(() => {
    let updatedStepper = [...stepper];

    if (userType === "buyer") {
      updatedStepper = updatedStepper.filter(
        (step) => step.value !== AccountSettingsStageKey.BusinessSettings
      );
    }

    if (
      Object.values(currentStepperStatus).length > 0 &&
      updatedStepper.length > 0
    ) {
      const updatedSections = useStepperStatus(
        updatedStepper,
        currentStepperStatus
      );
      setStepper(updatedSections);

      const activeKey = Object.keys(currentStepperStatus).find(
        (key) =>
          currentStepperStatus[key as keyof typeof currentStepperStatus] ===
          "active"
      );

      if (activeKey) {
        dispatch(setCurrentForm(activeKey));
      }
    } else {
      setStepper(updatedStepper);
    }
  }, [currentStepperStatus, userType]);

  const stepChangerFunc = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    router.replace(`?${params.toString()}`);
    dispatch(setCurrentForm(value));
    dispatch(setIsAccountSettingsSidebarOpen(false));
  };

  const mobStepChangerFunc = (value: Step) => {
    const activeIndex = value.children?.findIndex(
      (childStep) => childStep.status === "active"
    );
    if (value.children && activeIndex !== undefined && activeIndex >= 0) {
      dispatch(setCurrentForm(value.children[activeIndex].value));
      return;
    }
    if (value.children) {
      dispatch(setCurrentForm(value.children[0].value));
    }
  };

  console.log("steppervvv", stepper);

  return (
    <>
      {!isMobile ? (
        <div className="three-column-layout t-c-l-1">
          <div className="t-c-l-left">
            <div className="d-flex flex-col gap-20px">
              <div className="previous-btn-comp">
                <Link href={"/app/settings"} className="arrow-red-icon">
                  <LeftArrowIcon />
                </Link>
                <Typography variant="span" className="p-b-c-txt">
                  {accSetLang("moduleName")}
                </Typography>
              </div>
              <div className="stepper-card-block">
                <Stepper
                  stepperList={stepper}
                  stepChangerFunc={stepChangerFunc}
                  mobStepChangerFunc={mobStepChangerFunc}
                  currentStep={currentForm}
                />
              </div>
            </div>
          </div>

          <div className="p-bg-white t-c-l-center">{children}</div>
        </div>
      ) : (
        <>{children}</>
      )}

      {/* Modals */}
      {isMobile && (
        <StepperCardDialog
          title={accSetLang("moduleName")}
          visible={isAccountSettingsSidebarOpen}
          handleClose={() => dispatch(setIsAccountSettingsSidebarOpen(false))}
        >
          <div className="stepper-card-block">
            <Stepper
              stepperList={stepper}
              stepChangerFunc={stepChangerFunc}
              mobStepChangerFunc={mobStepChangerFunc}
              currentStep={currentForm}
            />
          </div>
        </StepperCardDialog>
      )}
    </>
  );
};

export default layout;
