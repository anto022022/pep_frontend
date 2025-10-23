"use client";

import React, { useRef, useState, useEffect } from "react";
import Typography from "../Base/Typography";
import CopyPaste from "./CopyPaste";
import { useTranslations } from "next-intl";

type OTPInputProps = {
  verifyCredential: (val: string) => void;
  resendOtp: (val: string) => void;
  setError: (val: string) => void;
  error: string;
  loading: boolean;
};

const OtpInput: React.FC<OTPInputProps> = ({
  verifyCredential,
  resendOtp,
  setError,
  error,
  loading,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(119);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const t = useTranslations("dynamicOtp");

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    setError("");
    const digit = value.replace(/\D/g, "").slice(0, 1); // allow only one digit
    if (digit === "") return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    checkIsOtpEntered(newOtp);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    setError("");
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const checkIsOtpEntered = (otpVal: string[]) => {
    if (otpVal.every((num) => num !== "")) {
      verifyCredential(otpVal.join(""));
    }
  };

  // const pasteData = async () => {
  //   try {
  //     setOtp(["", "", "", "", "", ""]);
  //     const text = await navigator.clipboard.readText();
  //     const digits = text.replace(/\D/g, "").slice(0, 6).split("");

  //     if (digits.length === 0) {
  //       setError("Cannot paste invalid characters");
  //       return;
  //     }

  //     while (digits.length < 6) {
  //       digits.push("");
  //     }

  //     setOtp(digits);
  //     inputRefs.current[digits.length - 1]?.focus();
  //     checkIsOtpEntered(digits);
  //   } catch (error) {
  //     console.error("Failed to paste data:", error);
  //   }
  // };

  const pasteData = async () => {
    // helper to process raw pasted text
    const processText = (text?: string) => {
      if (!text) {
        setError("Cannot paste invalid characters");
        return;
      }
      const digits = text.replace(/\D/g, "").slice(0, 6).split("");
      if (digits.length === 0) {
        setError("Cannot paste invalid characters");
        return;
      }
      while (digits.length < 6) digits.push("");
      setOtp(digits);
      // focus the last filled input (or first if none)
      const filledCount = digits.filter((d) => d !== "").length;
      const focusIndex = Math.max(
        0,
        Math.min(5, filledCount > 0 ? filledCount - 1 : 0)
      );
      inputRefs.current[focusIndex]?.focus();
      checkIsOtpEntered(digits);
    };

    try {
      setOtp(["", "", "", "", "", ""]);

      if (
        navigator.clipboard &&
        typeof navigator.clipboard.readText === "function"
      ) {
        try {
          const text = await navigator.clipboard.readText();
          processText(text);
          return;
        } catch (err) {
          console.warn("navigator.clipboard.readText failed:", err);
        }
      }

      const tempInput = document.createElement("input");
      tempInput.type = "text";
      tempInput.style.position = "fixed";
      tempInput.style.left = "-9999px";
      tempInput.style.top = "0";
      document.body.appendChild(tempInput);
      tempInput.focus();
      const pastedText: string = await new Promise((resolve) => {
        let settled = false;

        const cleanup = () => {
          tempInput.removeEventListener("paste", onPaste);
          tempInput.removeEventListener("blur", onBlur);
          if (tempInput.parentNode) tempInput.parentNode.removeChild(tempInput);
        };

        const finish = (val: string) => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve(val);
        };

        const onPaste = (ev: ClipboardEvent) => {
          ev.preventDefault();
          const cb = ev.clipboardData;
          const text =
            cb && typeof cb.getData === "function"
              ? cb.getData("text") || ""
              : "";
          if (text) {
            finish(text);
          } else {
            setTimeout(() => finish((tempInput.value || "").toString()), 0);
          }
        };

        const onBlur = () => finish((tempInput.value || "").toString());

        tempInput.addEventListener("paste", onPaste);
        tempInput.addEventListener("blur", onBlur);

        setTimeout(() => finish((tempInput.value || "").toString()), 10000);
      });

      processText(pastedText);
    } catch (error) {
      console.error("Failed to paste data:", error);
      setError("Failed to paste data");
    }
  };

  const handleKeyPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === 0) {
      setError("Cannot paste invalid characters");
      return;
    }

    const digits = pasteData.slice(0, 6).split("");
    while (digits.length < 6) {
      digits.push("");
    }

    setOtp(digits);
    inputRefs.current[digits.length - 1]?.focus();
    checkIsOtpEntered(digits);
  };

  const handleResendOtp = async () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setTimer(119);
    resendOtp("");
  };

  return (
    <div className="forms-button-gaps">
      <div className="forms-group">
        <div className="label-flex">
          <label htmlFor="otp">OTP</label>
        </div>

        <div className="otp-input-comp">
          <div className="otp-block">
            {otp.slice(0, 3).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                className="forms-otp"
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el: any) => (inputRefs.current[index] = el)}
                onPaste={handleKeyPaste}
              />
            ))}
          </div>
          <Typography variant="span" className="hypens"></Typography>
          <div className="otp-block">
            {otp.slice(3, 6).map((_, index) => (
              <input
                key={index + 3}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                className="forms-otp"
                value={otp[index + 3]}
                onChange={(e) => handleChange(index + 3, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index + 3, e)}
                ref={(el: any) => (inputRefs.current[index + 3] = el)}
                onPaste={handleKeyPaste}
              />
            ))}
          </div>
        </div>

        {error && !loading && (
          <Typography variant="span" className="error-txt">
            {error}
          </Typography>
        )}

        {!error && loading && (
          <Typography variant="span">{t("otpPage.submitting")}</Typography>
        )}
      </div>

      <div className="cpy-paste-resend-wrap">
        <CopyPaste initiatePaste={pasteData} t={t} />
        {timer > 0 ? (
          <Typography variant="span" className="resend-txt">
            {t("otpPage.resend.label", {
              minutes: Math.floor(timer / 60),
              seconds: String(timer % 60).padStart(2, "0"),
            })}
          </Typography>
        ) : (
          <Typography
            variant="span"
            className="resend-txt cursor-pointer"
            onClick={handleResendOtp}
          >
            {t("otpPage.resend.button")}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default OtpInput;
