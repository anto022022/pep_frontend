"use client";
import React from "react";
import { useTranslations } from "next-intl";
import CatalogView from "./CatalogView";
import "../../catlog.css";
const CatalogPage = () => {
  return (
    <div className="catalog-creation-page">
      <CatalogView />
    </div>
  );
};

export default CatalogPage;
