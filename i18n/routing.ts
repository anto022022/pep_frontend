import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  // locales: ["en", "ar", "ta", "hi"],
  locales: ["en", "ta", "ar", "hi"],

  // Used when no locale matches
  defaultLocale: "en",

  // Remove or unify pathnames if you don't want the path to change
  // pathnames: {
  //   "/authenticate": {
  //     en: "/authenticate",
  //     ar: "/authenticate",
  //   },
  // },
});

// Lightweight wrappers around Next.js' navigation APIs
export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
