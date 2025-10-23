"use client";

// ---------------------------------------------
// React & Next
// ---------------------------------------------
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

// ---------------------------------------------
// Redux Store & State
// ---------------------------------------------
import {
  setCurrentForm,
  setStepperStatus,
} from "@/app/[locale]/_store/reducers/stepper_status_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";

// ---------------------------------------------
// Models & Constants
// ---------------------------------------------
import {
  FreeCatalogStageKey,
  freeCatalogStepper,
  Step,
} from "@/app/[locale]/_models/StoreFront";

// ---------------------------------------------
// Components
// ---------------------------------------------
import Stepper from "@/app/[locale]/_components/StoreFront/Stepper";

// ---------------------------------------------
// Hooks
// ---------------------------------------------
import useProgressCalculation from "@/app/[locale]/_hooks/useProgressCalculation";
import useStepperStatus from "@/app/[locale]/_hooks/useStepperStatus";

// ---------------------------------------------
// API Queries
// ---------------------------------------------
import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { useGetCatalogFormStepStatusQuery } from "@/app/[locale]/_store/apiReducer/catalogApi";

const layout = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    data: apiData,
    isError,
    isLoading,
  } = useGetCatalogFormStepStatusQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(1200);
  const [stepper, setStepper] = useState<Step[]>(freeCatalogStepper);
  const [percentageValue, setPercentageValue] = useState(0);
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const isFirstLoad = useRef(true);

  // Set stepper status from API response
  // useEffect(() => {
  //   if (apiData) {
  //     dispatch(setStepperStatus(apiData?.data?.stageStatus));
  //     const curForm = FreeCatalogStageKey.homepage;
  //     dispatch(setCurrentForm(curForm));
  //   }
  // }, [apiData]);
  useEffect(() => {
    if (apiData) {
      const stageStatus = apiData?.data?.stageStatus || {};
      dispatch(setStepperStatus(stageStatus));

      // First render logic
      if (isFirstLoad.current) {
        isFirstLoad.current = false; // mark as visited
        dispatch(setCurrentForm(freeCatalogStepper[0].value)); // first stage
        return;
      }

      // Normal navigation logic after first load
      let activeStage = Object.keys(stageStatus).find(
        (key) => stageStatus[key] === "active"
      );

      if (!activeStage) {
        const completedStages = Object.keys(stageStatus).filter(
          (key) => stageStatus[key] === "completed"
        );

        if (completedStages.length > 0) {
          activeStage = completedStages[completedStages.length - 1];
        } else {
          activeStage = FreeCatalogStageKey.homepage;
        }
      }

      dispatch(setCurrentForm(activeStage));
    }
  }, [apiData]);

  // Update UI based on stepper status
  useEffect(() => {
    if (Object.values(currentStepperStatus).length > 0 && stepper.length > 0) {
      const updatedSections = useStepperStatus(stepper, currentStepperStatus);
      setStepper(updatedSections);

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
  }, [currentStepperStatus]);

  const stepChangerFunc = (value: string) => {
    const statuses: string[] = Object.values(currentStepperStatus);
    if (statuses.length === 0) {
      dispatch(
        setStepperStatus({
          ...currentStepperStatus,
          [FreeCatalogStageKey.homepage]: "active",
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
            currentStep={currentProductForm}
          />
        </div>
      </div>
      <div className="t-c-l-center">{children}</div>
    </div>
  );
};

export default layout;
