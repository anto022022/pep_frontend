"use client";
import FooterPage from "@/app/[locale]/_components/Common/FooterPage";
import ResponsiveNavbar from "@/app/[locale]/_components/Common/ResponsiveNavbar";
import "./catalog_style.css";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-layout-main ">
      <ResponsiveNavbar
      // showSearchDropdown={showSearchDropdown}
      // isActive={isActive}
      />
      {children}
      <FooterPage />
    </div>
  );
}
