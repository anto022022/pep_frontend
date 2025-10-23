"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import useIsMobile from "../../_hooks/useIsMobile";
import { Step } from "../../_models/StoreFront";
import {
  ActiveIcon,
  CollapseIcon,
  CompletedIcon,
  SubActiveIcon,
  SubCompletedIcon,
} from "../Icons/SVGIcons";

const Stepper = ({
  stepperList,
  stepChangerFunc,
  mobStepChangerFunc,
  currentStep,
}: {
  stepperList: Step[];
  stepChangerFunc: (value: string) => void;
  mobStepChangerFunc: (value: Step) => void;
  currentStep: string;
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const isMobile = useIsMobile();

  const t = useTranslations();

  const [heightMap, setHeightMap] = useState<{ [key: number]: number }>({});

  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const newHeightMap: { [key: number]: number } = {};
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        newHeightMap[index] = ref.scrollHeight;
      }
    });
    setHeightMap(newHeightMap);
  }, [stepperList]);

  useEffect(() => {
    stepperList.forEach((step) => {
      if (step?.children && step.status === "active") {
        setOpenSections((prev) => ({
          ...prev,
          [step.title]: true,
        }));
      }
    });
  }, [stepperList]);

  const toggleSection = (step: Step) => {
    !isMobile
      ? setOpenSections((prev) => ({
          ...prev,
          [step.title]: !prev[step.title],
        }))
      : mobStepChangerFunc(step);
  };

  return (
    <>
      {stepperList.map((step, index) =>
        step?.children ? (
          <div
            className={`stepper-card-comp ${step.status}`}
            key={index}
            onClick={() => toggleSection(step)}
          >
            <div
              className={`s-c-c-block ${
                openSections[step.title] ? "active" : ""
              }`}
            >
              <div className="s-c-c-b-header">
                <div className="s-c-c-b-h-left">
                  <ActiveIcon />
                  <CompletedIcon />
                  <div className="s-c-c-b-h-content">
                    <span className="title">{t(step.title)}</span>
                    {step?.description && (
                      <span className="subtitle">{t(step.description)}</span>
                    )}
                  </div>
                </div>
                <CollapseIcon className={"collapse-btn"} />
              </div>
              <div
                className="s-c-c-b-content"
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                style={{
                  height: openSections[step.title]
                    ? `${heightMap[index] || 0}px`
                    : "0px",
                  overflow: "hidden",
                  transition: "height 0.3s ease",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {step.children.map((childStep, index) => (
                  <div
                    className={`sub-stepper sub-${childStep.status} ${
                      currentStep === childStep.value ? "active" : ""
                    }`}
                    key={index}
                    onClick={() => stepChangerFunc(childStep.value)}
                  >
                    <span className="sub-pending-icon">
                      <span className="s-p-i-dot"></span>
                    </span>
                    <SubActiveIcon />
                    <SubCompletedIcon />
                    <span className="title">{t(childStep.title)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`stepper-card-comp ${step.status}`}
            key={index}
            onClick={() =>
              step.value ? stepChangerFunc(step.value) : undefined
            }
          >
            <div
              className={`s-c-c-block ${
                currentStep === step.value ? "active" : ""
              }`}
            >
              <div className="s-c-c-b-header">
                <div className="s-c-c-b-h-left">
                  <ActiveIcon />
                  <CompletedIcon />
                  <div className="s-c-c-b-h-content">
                    <span className="title">{t(step.title)}</span>
                    {step?.description && (
                      <span className="subtitle">{t(step.description)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Stepper;
