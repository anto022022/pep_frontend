"use client";
import { Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LanguageLinks = ({ className = 'p-m-l-l-actions' }: { className: string }) => {
  const router = useRouter();
  const pathname: any = usePathname();
  const t = useTranslations("home");
  const languages = [
    { name: t("footer.globalSites.languages.en"), code: "en" },
    { name: t("footer.globalSites.languages.ta"), code: "ta" },
    { name: t("footer.globalSites.languages.ar"), code: "ar" },
    { name: t("footer.globalSites.languages.hi"), code: "hi" },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<{ name: string; code: string } | null>(null);

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const currentLanguage = segments[0];
    const foundLang = languages.find((lang) => lang.code === currentLanguage);
    setSelectedLanguage(foundLang || languages[0]);
  }, [pathname]);

  const onLanguageClick = (lang: { name: string; code: string }) => {
    setSelectedLanguage(lang);
    const nextLocale = lang.code as Locale;

    const segments = pathname.split("/").filter(Boolean);
    segments[0] = nextLocale;
    const newPath = "/" + segments.join("/");

    router.replace(newPath);
  };

  return (
    <div className={className}>
      {languages.map((lang, index) => (
        <span key={lang.code}>
          <a
            href={`/${lang.code}`}
            onClick={(e) => {
              e.preventDefault();
              onLanguageClick(lang);
            }}
            style={{
              fontWeight: lang.code === selectedLanguage?.code ? "bold" : "normal",
              textDecoration: lang.code === selectedLanguage?.code ? "underline" : "none",
            }}
          >
            {lang.name}
          </a>
          {index < languages.length - 1 && " | "}
        </span>
      ))}
    </div>
  );
};

export default LanguageLinks;
