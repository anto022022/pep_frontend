"use client";
import CatalogPage from "@/app/[locale]/_components/Catalog/CatalogPage";
import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import React from "react";
const Page = () => {
  const isMobile = useIsMobile(1200);

  if (isMobile) {
    return <TempMobScreen />;
  }

  return (
    <React.Fragment>
      <CatalogPage />
    </React.Fragment>
  );
};

export default Page;
