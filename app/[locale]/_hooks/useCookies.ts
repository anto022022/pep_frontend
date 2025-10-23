"use client";

export default function useCookies() {
  const setCookie = (name: string, value: string, days: number): void => {
    if (typeof window === "undefined") return; // Server-side check

    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  };

  const getCookie = (name: string): string => {
    if (typeof window === "undefined") return ""; // Server-side check

    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return value;
    }
    return "";
  };

  const deleteCookie = (name: string) => {
    if (typeof window === "undefined") return; // Server-side check

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
  /*  */
  return { setCookie, getCookie, deleteCookie };
}
