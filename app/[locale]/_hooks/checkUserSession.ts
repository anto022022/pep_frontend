// lib/checkUserSession.ts
"use client";

type CheckUserSessionOptions = {
  authenticated: () => void;

  onUnauthenticated: () => void;
};

export function checkUserSessionAndRedirect({
  authenticated,
  onUnauthenticated,
}: CheckUserSessionOptions): void {
  const hasSession = (() => {
    // if (sessionValue) return true;

    if (typeof document === "undefined") return false; // for SSR safety

    const cookies = document.cookie.split("; ").reduce((acc, curr) => {
      const [key, ...val] = curr.split("=");
      acc[key] = val.join("=");
      return acc;
    }, {} as Record<string, string>);

    return cookies.hasOwnProperty("userSession") && cookies["userSession"].trim() !== "";
  })();
  if (hasSession) {
    authenticated();
  } else {
    onUnauthenticated();
  }
}
