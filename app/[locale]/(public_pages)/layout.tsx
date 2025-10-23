"use client";
import FooterPage from "@/app/[locale]/_components/Common/FooterPage";
import ResponsiveNavbar from "@/app/[locale]/_components/Common/ResponsiveNavbar";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import styles from "@/assets/styles-modules/dashboard.module.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  return (
    <div className={`page-layout-main ${styles.layout}`}>
      <div className="p-l-m-top">
        <ResponsiveNavbar />
        {children}
      </div>
      {!isMobile && (
        <div className="p-l-m-bottom">
          <FooterPage />
        </div>
      )}
    </div>
  );
}
