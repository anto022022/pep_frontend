"use client";
import CatalogPreviewView from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewView";
import React from "react";
import { useTranslations } from "next-intl";
// import CatalogCreate from "./CatalogCreate";

const CatalogPage = () => {
  const t = useTranslations("freeCatalog.catalog");

  return (
    <React.Fragment>
      {/* <CatalogCreate /> */}
      <div className="bg-colr">
        <CatalogPreviewView />
      </div>
    </React.Fragment>
  );
};

export default CatalogPage;
