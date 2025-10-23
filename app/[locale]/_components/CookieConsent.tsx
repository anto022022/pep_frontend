"use client";
import Link from "next/link";
import styles from "../../../assets/styles-modules/cookie-consent.module.css";
import { useEffect, useState } from "react";
import {
  useLazyGetConsentInfoQuery,
  useSetConsentInfoMutation,
} from "@/app/[locale]/_store/apiReducer/commonApi";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [setNewsLetterData] = useSetConsentInfoMutation();
  const [getConsentInfo] = useLazyGetConsentInfoQuery();
  useEffect(() => {
    renderConsent();
  }, []);

  const renderConsent = async () => {
    try {
      const consent = localStorage.getItem("cookie-consent");
      if (consent) return;
      let response = await getConsentInfo({});
      if (
        !response ||
        !response.data ||
        response.data?.statusCode !== 200 ||
        response.data?.data?.consent === undefined
      ) {
        setTimeout(() => setVisible(true), 500);
        return;
      }
      localStorage.setItem(
        "cookie-consent",
        response.data?.data?.consent ? "accepted" : "rejected"
      );
      return;
    } catch {
      setTimeout(() => setVisible(true), 500);
    }
  };

  const pushDL = (event: Record<string, any>) => {
    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(event);
    } catch {}
  };

  const accept = async () => {
    try {
      const payload = {
        consent: true,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        userId: "",
      };

      const response = await setNewsLetterData(payload).unwrap();

      if (!response || (response.ok === false && response.statusCode !== 200)) {
        console.error("Consent tracking failed", response);
      }
      localStorage.setItem("cookie-consent", "accepted");
    } catch (err) {
      console.error("Consent tracking failed", err);
    }

    pushDL({ event: "consent_granted", consent: "accepted" });
    setVisible(false);
  };

  const close = async () => {
    setVisible(false);
    const payload = {
      ip: "192.168.1.26",
      consent: false,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      userId: "",
    };

    const response = await setNewsLetterData(payload).unwrap();

    if (!response || (response.ok === false && response.statusCode !== 200)) {
      console.error("Consent tracking failed", response);
    }
    localStorage.setItem("cookie-consent", "rejected");
  };

  if (!visible) return null;

  return (
    <div
      className={`${styles.wrapper} ${visible ? styles.show : ""}`}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <p className={styles.msg}>
        We use cookies to personalize content, analyze traffic and provide
        advertising features. By clicking Accept you agree to our use of
        cookies.
        <Link
          href="/s/legal#privacy-policy"
          className={styles.consentPrivacyLink}
          aria-label="Privacy and cookie settings"
        >
          {" "}
          Learn more
        </Link>
      </p>

      <div className={styles.actions}>
        <button
          onClick={accept}
          className="btn-comp btn-c-primary btn-c-sm"
          aria-label="Accept cookies"
        >
          Accept
        </button>
        <button
          onClick={close}
          className={styles.closeBtn}
          aria-label="Close cookie consent"
        >
          ×
        </button>
      </div>
    </div>
  );
}
