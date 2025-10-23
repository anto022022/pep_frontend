"use client";

import ProgressBar from "@/app/[locale]/_components/Misc/ProgressBar";
import SalesProductPreview from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesProductPreview";
import Stepper from "@/app/[locale]/_components/StoreFront/Stepper";
import useProgressCalculation from "@/app/[locale]/_hooks/useProgressCalculation";
import useStepperStatus from "@/app/[locale]/_hooks/useStepperStatus";
import {
  ProductStageKey,
  salesProductStepper,
  Step,
} from "@/app/[locale]/_models/StoreFront";
import { useGetProductDetailsQuery } from "@/app/[locale]/_store/apiReducer/productsApi";
import {
  setCurrentForm,
  setStepperStatus,
} from "@/app/[locale]/_store/reducers/stepper_status_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const dispatch = useAppDispatch();

  const { data, isSuccess } =
    useGetProductDetailsQuery(id ?? undefined, { skip: !id });

  const [stepper, setStepper] = useState<Step[]>(salesProductStepper);
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const [percentageValue, setPercentageValue] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(setStepperStatus({}));
      dispatch(setCurrentForm(""));
    };
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setStepperStatus(data?.data?.productStage));
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (Object.values(currentStepperStatus).length > 0 && stepper.length > 0) {
      const updatedSections = useStepperStatus(stepper, currentStepperStatus);
      setStepper(updatedSections);
      if (id) {
        const activeKey = Object.keys(currentStepperStatus).find(
          (key) =>
            currentStepperStatus[key as keyof typeof currentStepperStatus] ===
            "active"
        );
        if (activeKey) {
          dispatch(setCurrentForm(activeKey));
        }
        const percentage = useProgressCalculation(currentStepperStatus);
        setPercentageValue(percentage);
      }
    }
  }, [currentStepperStatus, id]);

  const stepChangerFunc = (value: string) => {
    const statuses: string[] = Object.values(currentStepperStatus);
    if (statuses.length === 0) {
      dispatch(
        setStepperStatus({
          ...currentStepperStatus,
          [ProductStageKey.ProductInformation]: "active",
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

  return (
    <div className="three-column-layout">
      <div className="t-c-l-left">
        <div className="stepper-card-block">
          <Stepper
            stepperList={stepper}
            stepChangerFunc={stepChangerFunc}
            mobStepChangerFunc={mobStepChangerFunc}
            currentStep={currentProductForm}
          />
        </div>
      </div>
      <div className="t-c-l-center">{children}</div>
      <div className="t-c-l-right">
        <div className="t-c-l-r-top">
          <ProgressBar
            label="Product Information"
            percentageValue={percentageValue}
          />
        </div>
        <SalesProductPreview />
      </div>
    </div>
  );
};

export default layout;
