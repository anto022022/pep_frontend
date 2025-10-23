"use client";

import MobPageNavbar from "@/app/[locale]/_components/Common/MobPageNavbar";
import DashboardNavbar from "@/app/[locale]/_components/Common/Navbar/DashboardNavbar";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import React from "react";
interface ResponsiveNavbarInterface {
  onClick?: () => void;
  showSearchDropdown?: boolean;
  isActive?: boolean;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarInterface> = (props) => {
  const { onClick, showSearchDropdown = true, isActive = false } = props;

  const isMobile = useIsMobile();
  const mobilePath = useAppSelector(
    (state: RootState) => state.navbar.mobilePath
  );
  const mobileTitle = useAppSelector(
    (state: RootState) => state.navbar.mobileTitle
  );

  return isMobile ? (
    <MobPageNavbar path={mobilePath} title={mobileTitle} onClick={onClick} />
  ) : (
    <DashboardNavbar searchDropdown={showSearchDropdown} isActive={isActive} />
  );
};

export default ResponsiveNavbar;
