"use client";

import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import ProgressBar from "@/app/[locale]/_components/Misc/ProgressBar";
import SalesSellOfferPreview from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesSellOfferPreview";
import Stepper from "@/app/[locale]/_components/StoreFront/Stepper";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import useProgressCalculation from "@/app/[locale]/_hooks/useProgressCalculation";
import {
  ProductOfferKey,
  salesSellOfferStepper,
  Step,
} from "@/app/[locale]/_models/StoreFront";
import { useGetOfferPreviewDetailsQuery } from "@/app/[locale]/_store/apiReducer/sellOfferApi";
import { setPreview } from "@/app/[locale]/_store/reducers/preview_store";
import {
  setCurrentForm,
  setStepperStatus,
} from "@/app/[locale]/_store/reducers/stepper_status_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const [stepper, setStepper] = useState<Step[]>(salesSellOfferStepper);
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentSellOfferForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(1200);
  const [percentageValue, setPercentageValue] = useState(0);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const editForm = searchParams.get("CurrentForm");
  const t = useTranslations("salesOffer");

  const { data, isSuccess, refetch } = useGetOfferPreviewDetailsQuery(
    id ?? undefined,
    { skip: !id }
  );

  useEffect(() => {
    if (!id) {
      dispatch(
        setStepperStatus({
          ...currentStepperStatus,
          [ProductOfferKey.ProductDetails]: "active",
        })
      );
      return () => {
        dispatch(setStepperStatus({}));
        // dispatch(setCurrentForm(""));
        dispatch(setPreview({}));
      };
    }
  }, []);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setPreview(data?.data));
      dispatch(setStepperStatus(data?.data?.sellOfferStage));
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (Object.values(currentStepperStatus).length > 0 && stepper.length > 0) {
      const updatedSections = stepper.map((section) => {
        if (section.children) {
          const updatedChildren = section.children.map((child) => ({
            ...child,
            status:
              currentStepperStatus[
                child.value as keyof typeof currentStepperStatus
              ] || child.status,
          }));
          return {
            ...section,
            children: updatedChildren,
            status: updatedChildren.every(
              (child) => child.status === "completed"
            )
              ? "completed"
              : updatedChildren.some((child) => child.status === "active")
              ? "active"
              : "pending",
          };
        }
        return {
          ...section,
          status:
            currentStepperStatus[
              section.value as keyof typeof currentStepperStatus
            ] || section.status,
        };
      });
      setStepper(updatedSections);
      if (id && Object.keys(currentStepperStatus).length > 1 && !editForm) {
        const activeKey = Object.keys(currentStepperStatus).find(
          (key) =>
            currentStepperStatus[key as keyof typeof currentStepperStatus] ===
            "active"
        );
        if (activeKey) {
          dispatch(setCurrentForm(activeKey));
        }
      }
    }
    const precentage = useProgressCalculation(currentStepperStatus);
    setPercentageValue(precentage);
  }, [currentStepperStatus, id, editForm]);

  useEffect(() => {
    if (
      editForm &&
      Object.values(ProductOfferKey).includes(editForm as ProductOfferKey)
    ) {
      dispatch(setCurrentForm(editForm));
    }
  }, [editForm]);

  const stepChangerFunc = (value: string) => {
    const statuses: string[] = Object.values(currentStepperStatus);
    if (statuses.length === 0) {
      dispatch(
        setStepperStatus({
          ...currentStepperStatus,
          [ProductOfferKey.ProductDetails]: "active",
        })
      );
    }
    dispatch(setCurrentForm(value));
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

  if (isMobile) {
    return <TempMobScreen />;
  }

  return (
    <div className="three-column-layout">
      <div className="t-c-l-left">
        <div className="stepper-card-block">
          <Stepper
            stepperList={stepper}
            stepChangerFunc={stepChangerFunc}
            mobStepChangerFunc={mobStepChangerFunc}
            currentStep={currentSellOfferForm}
          />
        </div>
      </div>
      <div className="t-c-l-center">{children}</div>
      <div className="t-c-l-right">
        <div className="t-c-l-r-top">
          <ProgressBar
            label={t("progressHeader")}
            percentageValue={percentageValue}
          />
        </div>
        <SalesSellOfferPreview />
      </div>
    </div>
  );
};

export default layout;
