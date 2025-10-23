// utils/useLoginRedirect.ts
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stripLocale = (path: string) =>
    path.replace(/^\/[a-z]{2}(?=\/|$)/i, "");

  return () => {
    const cleanPath = stripLocale(pathname);
    const fullPath =
      cleanPath +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");

    const redirectUrl = `/authenticate?redirect=${encodeURIComponent(
      fullPath
    )}`;
    router.push(redirectUrl);
  };
}

export function usePostLoginRedirect(defaultPath = "/app", locale?: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return () => {
    const redirectPath = searchParams.get("redirect");
    const stripLocale = (path: string) =>
      path.replace(/^\/[a-z]{2}(\/|$)/i, "");

    const cleanPath = redirectPath
      ? stripLocale(redirectPath) !== ""
        ? redirectPath
        : defaultPath
      : defaultPath;

    // If locale is provided and not empty, prefix it
    const finalPath =
      locale && locale.trim() !== "" ? `/${locale}${cleanPath}` : cleanPath;
    router.replace(finalPath);
  };
}
