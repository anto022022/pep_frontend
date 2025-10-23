import React from "react";
import Image from "next/image";
import Typography from "@/app/[locale]/_components/Base/Typography";
// import Apple from "@/assets/img/social-logo/apple.svg";
import Google from "@//assets/img/social-logo/google.svg";
import LinkedIn from "@/assets/img/social-logo/linkedin.svg";
import { useLocale, useTranslations } from "next-intl";

const SocialMediaLogin = () => {
  const locale = useLocale(); // Get the current language
  const t = useTranslations("loginPage");

  const handleLogin = (url: string) => {
    window.location.href = url;
  };
  return (
    <div className="providers-group">
      <div
        className="providers-button"
        onClick={() => handleLogin(`/api/auth/google?${locale}`)}
      >
        <Image
          src={Google}
          width={14}
          height={14}
          alt="Google"
          sizes="100vw"
        ></Image>
        <Typography variant="span" className="p-b-txt">
          {t("socialMediaLogin.google")}
        </Typography>
      </div>
      {/* <div className="providers-button">
          <Image
            src={Apple}
            width={14}
            height={14}
            alt="Apple"
            sizes="100vw"
          ></Image>
          <Typography variant="span" className="p-b-txt">
            {t("socialMediaLogin.apple")}
          </Typography>
        </div> */}
      <div
        className="providers-button"
        onClick={() => handleLogin(`/api/auth/linkedin?${locale}`)}
      >
        <Image
          src={LinkedIn}
          width={14}
          height={14}
          alt="LinkedIn"
          sizes="100vw"
        ></Image>
        <Typography variant="span" className="p-b-txt">
          {t("socialMediaLogin.linkedIn")}
        </Typography>
      </div>
    </div>
  );
};

export default SocialMediaLogin;
