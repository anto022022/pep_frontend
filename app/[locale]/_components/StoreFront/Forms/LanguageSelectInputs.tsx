"use client";
import { Locale } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { GlobeIcon } from "../../Icons/SVGIcons";
const LanguageSelectInputs = () => {
  const router = useRouter();

  const locale = useLocale();
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


  return (
    <>
      <div className="language-input-comp" style={{ cursor: "pointer" }}>
        <GlobeIcon />
        <Dropdown
          value={selectedLanguage}
          onChange={(e) => onSelectChange(e.value)}
          options={languages}
          optionLabel="name"
          className="language-input"
          panelClassName="custom-dropdown"
        ></Dropdown>
      </div>
    </>
  );
};

export default LanguageSelectInputs;
