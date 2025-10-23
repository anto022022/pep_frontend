"use client";
import {
  DispatchLeadTime,
  ProductionLeadTime,
} from "@/app/[locale]/_interface/SalesProductInterface";
import React from "react";
interface LeadTimePipeProps {
  production?: ProductionLeadTime;
  dispatch?: DispatchLeadTime;
}

const LeadTimePipe: React.FC<LeadTimePipeProps> = ({
  production,
  dispatch,
}) => {
  const calculateTotalLeadTime = (
    production?: ProductionLeadTime,
    dispatch?: DispatchLeadTime
  ): { min: number | null; max: number | null } => {
    const minProd = production?.min_day ?? 0;
    const maxProd = production?.max_day ?? production?.min_day ?? 0;

    const minDispatch = dispatch?.min_day ?? 0;
    const maxDispatch = dispatch?.max_day ?? dispatch?.min_day ?? 0;

    const totalMin = minProd + minDispatch;
    const totalMax = maxProd + maxDispatch;

    return {
      min: isNaN(totalMin) ? null : totalMin,
      max: isNaN(totalMax) ? null : totalMax,
    };
  };

  const { min, max } = calculateTotalLeadTime(production, dispatch);

  if (min === null || max === null) {
    return <>--</>;
  }

  return <>{min === max ? `${min}` : `${min}-${max}`}</>;
};

export default LeadTimePipe;
