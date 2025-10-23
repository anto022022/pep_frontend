"use client";
import { formIconMap } from "@/app/[locale]/(pages)/app/business-profile/page";
import Typography from "@/app/[locale]/_components/Base/Typography";
import { LeftArrowIcon, ProductInfoIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import ProgressBarDashed from "@/app/[locale]/_components/Misc/ProgressBarDashed";
import MobileNavBar from "@/app/[locale]/_components/Navbar/MobileNavBar";
import StepperCardDialog from "@/app/[locale]/_components/OverLay/StepperCardDialog";
import Stepper from "@/app/[locale]/_components/StoreFront/Stepper";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import useProgressCalculation from "@/app/[locale]/_hooks/useProgressCalculation";
import useStepperStatus from "@/app/[locale]/_hooks/useStepperStatus";
import {
  BusinessProfileStageKey,
  businessProfileStepper,
  Step,
} from "@/app/[locale]/_models/StoreFront";
import { useGetProfileStageStatusQuery } from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import {
  setCurrentForm,
  setStepperStatus,
} from "@/app/[locale]/_store/reducers/stepper_status_store";
import { setIsAccountSettingsSidebarOpen, showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export const requiredForms = [
  BusinessProfileStageKey.BusinessDetails,
  BusinessProfileStageKey.CompanyRegistrationDetails,
  BusinessProfileStageKey.MarketLogistics,
  BusinessProfileStageKey.ShippingPaymentTerms,
  BusinessProfileStageKey.FactoryWarehouseDetails
];

const layout = ({ children }: { children: ReactNode }) => {
  const [stepper, setStepper] = useState<Step[]>(businessProfileStepper);
  const [percentageValue, setPercentageValue] = useState(0);

  const dispatch = useAppDispatch();
  const { data, isSuccess, refetch } = useGetProfileStageStatusQuery();
  const isMobile = useIsMobile(1200);
  const businessProfileT = useTranslations(
    "businessProfile.businessInformation"
  );

  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const isAccountSettingsSidebarOpen = useAppSelector(
    (state: RootState) => state.uiData.isAccountSettingsSidebarOpen
  );


  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    dispatch(
      setStepperStatus({
        ...currentStepperStatus,
        [BusinessProfileStageKey.BusinessDetails]: "active",
        [BusinessProfileStageKey.CompanyRegistrationDetails]: "active",
        [BusinessProfileStageKey.Additional]: "active",
      })
    );
    return () => {
      dispatch(setStepperStatus({}));
      dispatch(setCurrentForm(""));
    };
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setStepperStatus(data?.data?.stageStatus));
    }
  }, [isSuccess, data]);

  // useEffect(() => {
  //   if (Object.values(currentStepperStatus).length > 0 && stepper.length > 0) {
  //     const updatedSections = useStepperStatus(stepper, currentStepperStatus);
  //     setStepper(updatedSections);
  //     const activeKey = Object.keys(currentStepperStatus).find(
  //       (key) =>
  //         currentStepperStatus[key as keyof typeof currentStepperStatus] ===
  //         "active"
  //     );
  //     if (activeKey) {
  //       dispatch(setCurrentForm(activeKey));
  //     }
  //     const percentage = useProgressCalculation(currentStepperStatus);
  //     setPercentageValue(percentage);
  //   }
  // }, [currentStepperStatus]);

  useEffect(() => {
    if (Object.values(currentStepperStatus).length > 0 && stepper.length > 0) {
      const updatedSections = useStepperStatus(stepper, currentStepperStatus);
      setStepper(updatedSections);

      const activeRequiredKey = requiredForms.find(
        (key) => currentStepperStatus[key] === "active"
      );

      if (activeRequiredKey) {
        dispatch(setCurrentForm(activeRequiredKey));
      } else {
        const fallbackKey = Object.keys(currentStepperStatus).find(
          (key) =>
            currentStepperStatus[key as keyof typeof currentStepperStatus] ===
            "active"
        );
        if (fallbackKey) {
          dispatch(setCurrentForm(fallbackKey));
        }
      }

      const percentage = useProgressCalculation(currentStepperStatus);
      setPercentageValue(percentage);
    }
  }, [currentStepperStatus]);

  const stepChangerFunc = (value: string) => {
    dispatch(setCurrentForm(value));
    dispatch(setIsAccountSettingsSidebarOpen(false))
    if ((value === 'Additional' || value === 'BrandingMedia' || value === "MarketLogistics") && ((stepper[0]?.children?.[0]?.status == 'active' || stepper[0]?.children?.[0]?.status == 'pending') ||
      (stepper[0]?.children?.[1]?.status == 'active' || stepper[0]?.children?.[1]?.status == 'pending'))) {
      dispatch(
        showToast({
          title: "Warning!",
          message: "Please fill Business Details and Company Registration forms",
          theme: "info",
        })
      );
    }
    // else if (value === 'BrandingMedia' && ((stepper[0]?.children?.[0]?.status == 'active' || stepper[0]?.children?.[0]?.status == 'pending') ||
    //   (stepper[0]?.children?.[1]?.status == 'active' || stepper[0]?.children?.[1]?.status == 'pending'))) {
    //   dispatch(
    //     showToast({
    //       title: "Warning!",
    //       message: "Please fill Business Details and Company Registration forms",
    //       theme: "info",
    //     })
    //   );
    // }
    // else if (value === "MarketLogistics" && ((stepper[0]?.children?.[0]?.status == 'active' || stepper[0]?.children?.[0]?.status == 'pending') ||
    //   (stepper[0]?.children?.[1]?.status == 'active' || stepper[0]?.children?.[1]?.status == 'pending'))) {
    //   dispatch(
    //     showToast({
    //       title: "Warning!",
    //       message: "Please fill Business Details and Company Registration forms",
    //       theme: "info",
    //     })
    //   );
    // }
    else if (value === "ShippingPaymentTerms" && ((stepper[0]?.children?.[0]?.status == 'active' || stepper[0]?.children?.[0]?.status == 'pending') ||
      (stepper[0]?.children?.[1]?.status == 'active' || stepper[0]?.children?.[1]?.status == 'pending') ||
      (stepper[2]?.children?.[1]?.status == 'active' || stepper[2]?.children?.[1]?.status == 'pending'))) {
      dispatch(
        showToast({
          title: "Warning!",
          message: "Please fill Business Details  Company Registration and Market & logistics forms",
          theme: "info",
        })
      );
    }
    // (stepper[0]?.children?.[0]?.status == 'active' || stepper[0]?.children?.[0]?.status == 'pending') ||
    //   (stepper[0]?.children?.[1]?.status == 'active' || stepper[0]?.children?.[1]?.status == 'pending') ||
    else if ((value === "AdditionalTradeDetails" || value === "FactoryWarehouseDetails") && (
      (stepper[2]?.children?.[0]?.status == 'active' || stepper[2]?.children?.[0]?.status == 'pending') ||
      (stepper[2]?.children?.[1]?.status == 'active' || stepper[2]?.children?.[1]?.status == 'pending'))) {
      dispatch(
        showToast({
          title: "Warning!",
          message: "Please fill Business Details, Company Registration, Market & logistics and Shipping & payment forms",
          theme: "info",
        })
      );
    }
    // else if (value === "FactoryWarehouseDetails" && (stepper[3]?.status == 'active' || stepper[3]?.status == 'pending')) {
    //   dispatch(
    //     showToast({
    //       title: "Warning!",
    //       message: "Please fill Business Details, Company Registration, Market & logistics and Shipping & payment forms",
    //       theme: "info",
    //     })
    //   );
    // }
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

  return (
    <>
      {!isMobile ? (
        <div className="three-column-layout t-c-l-1">
          <div className="t-c-l-left">
            <div className="d-flex flex-col gap-20px">
              <div className="previous-btn-comp">
                <Link href={"/app"} className="arrow-red-icon">
                  <LeftArrowIcon />
                </Link>
                <Typography variant="span" className="p-b-c-txt">
                  {businessProfileT("businessProfile")}
                </Typography>
              </div>
              <div className="stepper-card-block">
                <Stepper
                  stepperList={stepper}
                  stepChangerFunc={stepChangerFunc}
                  mobStepChangerFunc={mobStepChangerFunc}
                  currentStep={currentProductForm}
                />
              </div>
            </div>
          </div>
          <div className="t-c-l-center">{children}</div>
        </div>
      ) : (
        <>
          <div className="body-preview-mob three-col-form-mob">
            {/* <MobileMetaSetter path="" title={"Business Information"} /> */}
            {/* <ResponsiveNavbar onClick={() => dispatch(setIsAccountSettingsSidebarOpen(true))} /> */}
            <MobileNavBar
              path=""
              title={currentProductForm}
              headIcon={formIconMap[currentProductForm] ?? <ProductInfoIcon />}
              onClick={() => dispatch(setIsAccountSettingsSidebarOpen(true))}
            />
            <div className="b-p-m-body">
              <div className="compliance-mob-wrapper">{children}</div>
            </div>
            <div className="b-p-m-footer b-p-m-f-progressbar">
              <ProgressBarDashed value={percentageValue} />
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {isMobile && (
        <StepperCardDialog
          title={"Business Profile"}
          visible={isAccountSettingsSidebarOpen}
          handleClose={() => dispatch(setIsAccountSettingsSidebarOpen(false))}
        >
          <div className="stepper-card-block">
            <Stepper
              stepperList={stepper}
              stepChangerFunc={stepChangerFunc}
              mobStepChangerFunc={mobStepChangerFunc}
              currentStep={currentProductForm}
            />
          </div>
        </StepperCardDialog>
      )}
      {/* <GetVerifiedDialog /> */}
    </>
  );
};

export default layout;