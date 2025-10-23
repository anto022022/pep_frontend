// import { useRouter } from "next/navigation";
import useCookies from "@/app/[locale]/_hooks/useCookies";

export default function useLogout() {
  // const router = useRouter();
  const { deleteCookie } = useCookies();
  const logout = async () => {
    deleteCookie("userSession");
    // router.push("/authenticate");
    // router.refresh();
    window.location.href = "/authenticate";
  };
  return { logout };
}
