"use client";

import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useSession from "@/app/[locale]/_hooks/useSession";
import { useUpdateSkipOnboardingMutation } from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { Locale } from "@/i18n/routing"; // if you need these for locales
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import CloseIcon from "../../../../assets/img/icons/close-icon.svg";
import Logo from "../../../../assets/img/site-logo.svg";

const AuthNavBar = () => {
  const cookies = useCookies();
  const router = useRouter();
  const locale = useLocale();
  const { loadSession } = useSession();
  const showSkip = useAppSelector(
    (state: RootState) => state.onboardingData.showSkip
  );
  const pathname: any = usePathname();
  const languages = [
    { name: "EN", code: "en" },
    { name: "TA", code: "ta" },
    { name: "AR", code: "ar" },
    { name: "HI", code: "hi" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(
    () => languages.find((lang) => lang.code === locale) || languages[0]
  );

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    let currentLanguage = segments[0];
    for (let i = 0; i < languages.length; i++) {
      if (languages[i].code !== currentLanguage) continue;
      setSelectedLanguage(languages[i]);
      break;
    }
  }, []);

  const onSelectChange = (selected: { name: string; code: string }) => {
    setSelectedLanguage(selected);
    const nextLocale = selected.code as Locale;

    const segments = pathname.split("/").filter(Boolean);
    segments[0] = nextLocale; // Replace the current locale
    const newPath = "/" + segments.join("/");

    router.replace(newPath); // Change the locale in URL
  };

  const [updateSkipOnboarding] = useUpdateSkipOnboardingMutation();

  // function onSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
  //   const nextLocale = e.target.value as Locale;
  //   // You can build the new URL manually if needed.
  //   // For example, assuming your routing structure supports locale as the first segment:
  //   const segments = pathname.split("/").filter(Boolean);
  //   // Replace the current locale segment with the new one:
  //   segments[0] = nextLocale;
  //   const newPath = "/" + segments.join("/");
  //   router.replace(newPath);

  //   // For server-side rending
  //   // router.replace(
  //   //   // @ts-expect-error -- TypeScript will validate that only known `params`
  //   //   // are used in combination with a given `pathname`. Since the two will
  //   //   // always match for the current route, we can skip runtime checks.
  //   //   { pathname, params },
  //   //   { locale: nextLocale as Locale }
  //   // );
  // }

  const handleSkipOnboarding = async () => {
    try {
      const response = await updateSkipOnboarding().unwrap();
      if (response?.data?.userVerified) {
        cookies.deleteCookie("onboardSession");
        cookies.setCookie("userSession", response?.data?.userSession, 2);
        router.push(`/${locale}/app`);
        loadSession();
      }
    } catch (e) {
      console.log("Error", e);
    }
  };
  return (
    <div className="auth-navbar-comp">
      <Link href={"/"} className="site-logo">
        <Image src={Logo} width={200} height={40} alt="Logo" />
      </Link>
      {showSkip ? (
        <div className="a-n-c-wrapper" onClick={() => handleSkipOnboarding()}>
          <span>
            <Image src={CloseIcon} width={24} height={24} alt="Close"></Image>
          </span>
          <Buttons className={"btn-plain-txt"} text={"Skip"} />
        </div>
      ) : (
        <Dropdown
          value={selectedLanguage}
          onChange={(e) => onSelectChange(e.value)}
          options={languages}
          optionLabel="name"
          className="language-input align-cntr"
          panelClassName="custom-dropdown"
        ></Dropdown>
      )}
    </div>
  );
};

export default AuthNavBar;
