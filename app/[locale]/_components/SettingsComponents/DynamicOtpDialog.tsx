"use client";

import DynamicOtp from "@/app/[locale]/_components/SettingsComponents/DynamicOtp";
import {
  verifyPayload
} from "@/app/[locale]/_interface/AuthInterface";
import { Dialog } from "primereact/dialog";
import React from "react";

interface DynamicOtpDialogProps {
  visible: boolean;
  onClose: () => void;
  // Props for DynamicOtp
  setHashCredential: (val: string) => void;
  setOtpType: (val: string) => void;
  setPatchCall: (val: boolean) => void;
  otpType: string;

  hashCredential: string;
  payload: verifyPayload;
  onVerificationSuccess: () => void;
}

const DynamicOtpDialog: React.FC<DynamicOtpDialogProps> = ({
  visible,
  onClose,
  setOtpType,
  otpType,
  hashCredential,
  payload,
  onVerificationSuccess,
}) => {
  return (
    <Dialog
      visible={visible}
      modal
      className="modal-comp otp-dialog-modal"
      closable={true}
      onHide={onClose}
    >
      <DynamicOtp
        setOtpType={setOtpType}
        otpType={otpType}
        hashCredential={hashCredential}
        payload={payload}
        onVerificationSuccess={onVerificationSuccess}
      />
    </Dialog>
  );
};

export default DynamicOtpDialog;
