import Typography from "@/app/[locale]/_components/Base/Typography";
import TryAnotherWayOptions from "@/app/[locale]/_components/OnBoarding/TryAnotherWayOptions";
import {
  ContactType
} from "@/app/[locale]/_interface/AuthInterface";
import Link from "next/link";
import React from "react";
import LinkNumber from "../../../../../../assets/img/icons/link-number.svg";
import Sms from "../../../../../../assets/img/icons/sms.svg";
import Telegram from "../../../../../../assets/img/icons/telegram.svg";
import WeChat from "../../../../../../assets/img/icons/wechat.svg";

type TryAnotherWayProps = {
  hashCredential: string;
};

const TryAnotherWay: React.FC<TryAnotherWayProps> = ({
  hashCredential
}) => {
  const options = [
    {
      id: 1,
      name: "Whatsapp",
      type: "Whatsapp",
      subTitle: "We’ll send code over Wifi.",
      icon: WeChat,
      disabled: false,
    },
    {
      id: 2,
      name: "Wechat",
      type: "WeChat",
      subTitle: "We’ll send code over Wifi.",
      icon: WeChat,
      disabled: true,
    },
    {
      id: 3,
      name: "Telegram",
      type: "Telegram",
      subTitle: "We’ll send code over Wifi.",
      icon: Telegram,
      disabled: true,
    },
    {
      id: 4,
      name: "SMS",
      type: "SMS",
      subTitle: "We’ll text you a code. standard rate apply*",
      icon: Sms,
      disabled: true,
    },
    {
      id: 5,
      name: "Link new number",
      type: "LinkNumber",
      subTitle: "We’ll text you a code. standard rate apply*",
      icon: LinkNumber,
      disabled: true,
    },
  ];

  const sendOtp = (type: ContactType) => {
    if (!type) return;
    if (type !== "Whatsapp") return;
    submitPhone();
  };

  const submitPhone = async () => {
    //   try {
    //     const phoneRegex = /^\+?\d{0,4}[-.\s]?\d{8,12}$/;
    //     let phoneError: string = !phone.trim()
    //       ? t("errors.phoneNumberRequired")
    //       : !phoneRegex.test(phone)
    //       ? t("errors.invalidPhoneNumber")
    //       : "";
    //     setErrors(phoneError);
    //     if (phoneError) return;
    //     let authSession = cookies.getCookie("authSession");
    //     setIsSubmitting(true);
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL_IDN||"https://identity-api.sandbox.pepagora.org/"}auth/sendPhoneOtp`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           ...(authSession && { authSession: authSession }),
    //         },
    //         body: JSON.stringify({
    //           phoneNo: phone,
    //           countryCode: countryCode,
    //         }),
    //       }
    //     );
    //     setIsSubmitting(false);
    //     const resData = await response.json();
    //     if (!response.ok) {
    //       setErrors(resData?.message || t("errors.sendingOtpFailed"));
    //       return;
    //     }
    //     if (resData.statusCode === 201) {
    //       dispatch(
    //         showToast({
    //           title: t("toast.successTitle"),
    //           message: t("toast.otpSent"),
    //           theme: "success",
    //         })
    //       );
    //       setVerificationStage({
    //         stage: "otpVerification",
    //       });
    //       setOtpType("phone");
    //       setPayload({ phone: phone, countryCode: countryCode });
    //     } else {
    //       setErrors(t("errors.sendingOtpFailed"));
    //     }
    //   } catch (error) {
    //     setIsSubmitting(false);
    //     setErrors(t("errors.sendingOtpFailed"));
    //   }
  };

  return (
    <div className="form-box-shadow form-gaps forms-container">
      <div className="form-title-wrap">
        <Typography variant="h1" className="title-txt">
          Try another way
        </Typography>
        <Typography variant="h2" className="sub-txt">
          Choose another way to get verification code at{" "}
          <Typography variant="span" className="dark-txt">
            {hashCredential}
          </Typography>
        </Typography>
      </div>
      <div className="radio-card-group">
        {options.map((item, index) => {
          return (
            <TryAnotherWayOptions
              key={index}
              isDisabled={item.disabled}
              name={item.name}
              subTitle={item.subTitle}
              icon={item.icon}
              htmlFor={item.name}
              id={item.name}
              defaultChecked={index == 0 && true}
              alt={item.name}
              type={item.type as ContactType}
              sendOtp={(type: ContactType) => sendOtp(type)}
            />
          );
        })}
      </div>
      <Link
        href={"/onboarding/choose-service"}
        className="btn-comp btn-c-secondary btn-c-lg"
      >
        Resend code
      </Link>
    </div>
  );
};

export default TryAnotherWay;
