"use client";
import { useTranslations } from "next-intl";
import React from "react";
// import Link from 'next/link'
import Typography from "@/app/[locale]/_components/Base/Typography";
import {
  ChevronRightIcon,
  TimeStopperIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";

interface ProgressStepItemInterface {
  label: string;
  description: string;
  time: string;
  progress: number;
  link: string;
}

const ProgressStepItem: React.FC<ProgressStepItemInterface> = (props) => {
  const { label, description, time, progress, link } = props;
  const router = useRouter();
  const t = useTranslations("businessProfile.profileCompletion");

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <li>
      <div className="progress-stepper-comp">
        <div className="p-s-c-left">
          <Typography variant="span" className="p-s-c-label">
            {label}
          </Typography>
          <Typography variant="span" className="p-s-c-subtxt">
            {description}
          </Typography>
          <div className="approx-time-badge">
            <div className="a-t-b-left">
              <TimeStopperIcon />
              <Typography variant="span" className="a-t-b-label">
                {t("approx")}
              </Typography>
            </div>
            <div className="a-t-b-right">
              <Typography variant="span" className="a-t-b-time">
                {time}
              </Typography>
            </div>
          </div>
        </div>
        <div
          className="p-s-c-right"
          onClick={() => handleNavigation(link)}
          role="button"
        >
          <ChevronRightIcon />
        </div>
      </div>
      <div className="circular-progress-bar">
        <CircularProgressbar value={progress} />
      </div>
    </li>
  );
};

export default ProgressStepItem;
