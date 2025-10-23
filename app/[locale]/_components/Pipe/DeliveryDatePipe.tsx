"use client";
import React from "react";
import {
  DispatchLeadTime,
  ProductionLeadTime,
} from "@/app/[locale]/_interface/SalesProductInterface";

interface DeliveryDatePipeProps {
  production?: ProductionLeadTime;
  dispatch?: DispatchLeadTime;
}

const DeliveryDatePipe: React.FC<DeliveryDatePipeProps> = ({
  production,
  dispatch,
}) => {
  const calculateDeliveryDate = (
    production?: ProductionLeadTime,
    dispatch?: DispatchLeadTime
  ): Date | null => {
    const maxProd = production?.max_day ?? production?.min_day ?? 0;
    const maxDispatch = dispatch?.max_day ?? dispatch?.min_day ?? 0;

    const totalDays = maxProd + maxDispatch;
    if (isNaN(totalDays)) return null;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + totalDays);

    return deliveryDate;
  };

  const deliveryDate = calculateDeliveryDate(production, dispatch);

  if (!deliveryDate) {
    return <>--</>;
  }

  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    month: "long", // e.g. April
    day: "numeric", // e.g. 20
  });

  return formattedDate??"";
};

export default DeliveryDatePipe;
