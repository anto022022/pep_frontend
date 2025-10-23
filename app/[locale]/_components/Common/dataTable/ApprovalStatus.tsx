import { BuyingRequestApprovalStatus } from "@/app/[locale]/_interface/RfqInterface";
import React from "react";

interface ApprovalStatusProps {
  status: BuyingRequestApprovalStatus;
}

const ApprovalStatus: React.FC<ApprovalStatusProps> = ({ status }) => {
  return (
    <span
      className={`table-badge-comp    ${
        status === BuyingRequestApprovalStatus.PENDING
          ? "approval-pending"
          : status === BuyingRequestApprovalStatus.Active
          ? "order-confirm"
          : status === BuyingRequestApprovalStatus.Awaiting_Response
          ? "awaiting"
          : status === BuyingRequestApprovalStatus.Quotes_Received
          ? "quotes-received"
          : status
      }`}
    >
      {status}
    </span>
  );
};

export default ApprovalStatus;
