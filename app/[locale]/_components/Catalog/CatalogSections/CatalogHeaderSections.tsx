"use client";
import { RootState } from "@/app/[locale]/_store/store";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import previewIcon from "../../../../../public/img/icons/preview-icon.svg";
import editIcon from "../../../../../public/img/icons/ci_expand.svg";
import Image from "next/image";
const CatalogHeaderSection = () => {
  const router = useRouter();
  const { locale } = useParams();
  const domain = useSelector((state: RootState) => state.location.domain);
  const t = useTranslations("freeCatalog.catalog");
  const handlePreview = () => {
    // router.push(`/${locale}/${domain}`);
    window.open(`/${locale}/${domain}`, "_blank");
  };
  const handleEdit = () => {
    router.push(`/${locale}/app/catalog/form`);
  };
  return (
    <div className="catalog-header">
      <div className="catalog-f1-heading">
        <h3>{t("header.title")}</h3>
      </div>
      <div className="catalog-f2-content"></div>

      <div className="catalog-f3-pr-edit">
        {/* <button className="catalog-pr-btn" onClick={handlePreview}>
          {t("header.preview")}
        </button>
        <button className="edit-icon" onClick={handleEdit}>
          {t("header.edit")}
        </button> */}
        <button onClick={handlePreview} className="catalog-c-preview-btn">
          <Image src={previewIcon} alt="preview" width={24} height={24} />

          <span> {t("header.preview")}</span>
        </button>

        <button onClick={handleEdit} className="catalog-c-edit-btn">
          {" "}
          <Image src={editIcon} alt="preview" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};
export default CatalogHeaderSection;
