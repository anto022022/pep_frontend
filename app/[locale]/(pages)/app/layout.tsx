"use client";
import { ReactNode, useEffect } from "react";
import { SideBar } from "../../_components/StoreFront/SideBar";
// import TopBar from "../../_components/StoreFront/TopBar";
import DashboardNavbar from "@/app/[locale]/_components/Common/Navbar/DashboardNavbar";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { useRouter } from "next/navigation";
// import styles from "@/assets/styles-modules/dashboard.module.css";
// import styles from "../../../../assets/styles-modules/dashboard.module.css";

const layout = ({
  children,
}: {
  children: ReactNode;
  params: Promise<any>;
}) => {
  const isMobile = useIsMobile(1200);
  const router = useRouter();
  const { getCookie } = useCookies();

  useEffect(() => {
    if (!getCookie("userSession")) {
      // debugger;
      router.push("/authenticate");
    }
  }, []);

  return (
    // <div className={styles.layout}>
    <div className="dashboard-layout">
      {!isMobile ? (
        <>
          <DashboardNavbar />
          <div className="d-l-wrapper">
            <SideBar />
            <div className="d-l-body">{children}</div>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default layout;
