import useCookies from "@/app/[locale]/_hooks/useCookies";
import { UserSessionDataInterface } from "@/app/[locale]/_interface/userInterface";
import { setUserSessionData } from "@/app/[locale]/_store/reducers/user_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";

export default function useSession() {
  const dispatch = useAppDispatch();
  const { getCookie } = useCookies();

  const loadSession = async () => {
    const hasUserSession = getCookie("userSession");

    if (!hasUserSession) return;

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL_IDN ||
          "https://identity-api.sandbox.pepagora.org/"
        }auth/session-data`,
        {
          headers: {
            "Content-Type": "application/json",
            userSession: hasUserSession,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch session data");

      const data: { data: UserSessionDataInterface & { username: string } } =
        await res.json();
      dispatch(
        setUserSessionData({
          ...data?.data,
          userName: data?.data?.username || "User",
          isLoggedIn: true,
        })
      );
    } catch (err) {
      console.error("Session fetch error:", err);
    }
  };

  return { loadSession };
}
