"use client";

import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import ProgressBar from "@/app/[locale]/_components/Misc/ProgressBar";
import SalesProductPreview from "@/app/[locale]/_components/StoreFront/PreviewComponents/SalesProductPreview";
import Stepper from "@/app/[locale]/_components/StoreFront/Stepper";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
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
  const queryForm = searchParams.get("currentForm");

  const isMobile = useIsMobile(1200);

  const dispatch = useAppDispatch();

  const { data, isSuccess, refetch } = useGetProductDetailsQuery(
    id ?? undefined,
    { skip: !id }
  );

  const [stepper, setStepper] = useState<Step[]>(salesProductStepper);

  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const [percentageValue, setPercentageValue] = useState(0);

  useEffect(() => {
    if (!id) {
      dispatch(
        setStepperStatus({
          ...currentStepperStatus,
          [ProductStageKey.ProductInformation]: "active",
        })
      );
    }
    return () => {
      dispatch(setStepperStatus({}));
      dispatch(setCurrentForm(""));
    };
  }, []);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

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
        if (!queryForm && activeKey) {
          dispatch(setCurrentForm(activeKey));
        }
        const precentage = useProgressCalculation(currentStepperStatus);
        setPercentageValue(precentage);
      }
    }
  }, [currentStepperStatus, id]);

  useEffect(() => {
    if (queryForm) {
      dispatch(setCurrentForm(queryForm));
    }
  }, [queryForm]);

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
    <>
      {!isMobile ? (
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
      ) : (
        <>
          <TempMobScreen />
        </>
      )}
    </>
  );
};

export default layout;
