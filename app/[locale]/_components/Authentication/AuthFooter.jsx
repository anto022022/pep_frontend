"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const AuthFooter = () => {
  const t = useTranslations("loginPage");

  return (
    <div className="auth-footer-comp">
      <p className="site-protection-txt">
        {/* This site is protected by reCAPTCHA Enterprise.  */}
        {t("terms-info")}
        {/* By signing in/up, you agree to the applicable Privacy Policy and Terms
        of Service of both Google and LinkedIn. */}
      </p>
      {/* <ul className="auth-footer-links">
        <li>
          <Link href={"/help"}>Help</Link>
        </li>
        <li>
          <Link href={"/privacy"}>Privacy</Link>
        </li>
        <li>
          <Link href={"/terms"}>Terms</Link>
        </li>
      </ul> */}
    </div>
  );
};

export default AuthFooter;
