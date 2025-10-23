"use client";

import ResponsiveNavbar from "@/app/[locale]/_components/Common/ResponsiveNavbar";
import { useAppSelector } from "@/app/[locale]/_store/store";
import FooterPage from "@/app/[locale]/_components/Common/FooterPage";

export default function Layout({ children }: { children: React.ReactNode }) {
  const showSearchDropdown = useAppSelector(
    (state) => state.uiData.isShowSearchDropDown
  );
  const isActive = useAppSelector((state) => state.uiData.isNavActive);



  return (
    <>
      <div className="page-layout-main home-page">
        <ResponsiveNavbar
          showSearchDropdown={showSearchDropdown}
          isActive={isActive}
        />
        {children}
        <FooterPage/>
      </div>
    </>
  );
}
