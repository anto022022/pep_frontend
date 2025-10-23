// PaymentStatus.tsx
import { ActiveDottedIcon, CompletedIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import React from "react";

interface PaymentStatusProps {
  status: "processing" | "paid";
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  if (status === "processing") {
    return (
      <span className="status-badge processing">
        <span className="spinner" />
        Processing
      </span>
    );
  }

  if (status === "paid") {
    return (
      <span className="status-badge paid">
        <span className="check">
          {" "}
         <CompletedIcon />
        </span>
        Paid
      </span>
    );
  }

  return null;
};
