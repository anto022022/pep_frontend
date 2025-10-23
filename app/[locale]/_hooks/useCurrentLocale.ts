import { useParams } from "next/navigation"; 
import { LocaleType } from "../_models/StoreFront";

export const useCurrentLocale = (): LocaleType => {
  const params = useParams();
  const locale = params?.locale;

  const currentLocale: LocaleType = Array.isArray(locale)
    ? (locale[0] as LocaleType)
    : (locale as LocaleType) || "en";

  return currentLocale;
};
