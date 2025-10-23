// hooks/useUserSession.ts
"use client";

import { useEffect } from "react";

type UseUserSessionProps = {
  initialSession?: string;
  logout: () => void;
};

export function useUserSession({ initialSession, logout }: UseUserSessionProps) {
  useEffect(() => {
    let session = initialSession;

    if (!session && typeof document !== "undefined") {
      const cookies = document.cookie.split(";").reduce((acc, curr) => {
        const [key, ...val] = curr.trim().split("=");
        acc[key] = val.join("=");
        return acc;
      }, {} as Record<string, string>);

      session = cookies["userSession"];
    }

    if (!session) {
      logout(); 
    }
  }, [initialSession, logout]);
}
