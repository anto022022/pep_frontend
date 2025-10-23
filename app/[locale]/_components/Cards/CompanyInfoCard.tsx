import { useTranslations } from "next-intl";
import React from "react";
import {
  LeadsDetailsCompany,
  LeadsDetailsCustomer,
} from "../../_interface/LeadsInterface";

const CompanyInfoCard: React.FC<{
  contactInfo: LeadsDetailsCustomer;
  companyInfo: LeadsDetailsCompany;
}> = ({ companyInfo, contactInfo }) => {
  const t = useTranslations("leads.viewPage.companyInformation");

  return (
    // <div className="tabs-content">
    //   {contactInfo?.companyName && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="companyName" className="t-t-f-g-txt">
    //         {t("companyName")}
    //       </label>
    //       <span className="t-f-g-txt">{contactInfo?.companyName}</span>
    //     </div>
    //   )}
    //   {companyInfo?.businessLocation?.name && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="country" className="t-t-f-g-txt">
    //         {t("companyCountry")}
    //       </label>
    //       <span className="t-f-g-txt">
    //         {companyInfo?.businessLocation?.name}
    //       </span>
    //     </div>
    //   )}
    //   {companyInfo.street && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="address" className="t-t-f-g-txt">
    //         {t("companyAddress")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.street}</span>
    //       <span className="t-f-g-txt">{companyInfo.city}</span>
    //       <span className="t-f-g-txt">{companyInfo.state}</span>
    //       <span className="t-f-g-txt">{companyInfo.zip}</span>
    //     </div>
    //   )}
    //   {companyInfo.website && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="companyWebsite" className="t-t-f-g-txt">
    //         {t("companyWebsite")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.website}</span>
    //     </div>
    //   )}
    //   {companyInfo.size && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="companySize" className="t-t-f-g-txt">
    //         {t("companySize")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.size}</span>
    //     </div>
    //   )}
    //   {companyInfo.industry && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="companyIndustry" className="t-t-f-g-txt">
    //         {t("companyIndustry")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.industry}</span>
    //     </div>
    //   )}
    //   {companyInfo.type && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="businessType" className="t-t-f-g-txt">
    //         {t("companyIndustry")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.type}</span>
    //     </div>
    //   )}
    //   {companyInfo.permissionToContact && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="permissionToContact" className="t-t-f-g-txt">
    //         {t("permissionToContact")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.permissionToContact}</span>
    //     </div>
    //   )}
    //   {companyInfo.buyingRole && (
    //     <div className="tabs-form-group">
    //       <label htmlFor="buyingRole" className="t-t-f-g-txt">
    //         {t("buyingRole")}
    //       </label>
    //       <span className="t-f-g-txt">{companyInfo.buyingRole}</span>
    //     </div>
    //   )}
    // </div>
    <div className="tabs-content">
      {contactInfo?.companyName && (
        <div className="tabs-form-group">
          <label htmlFor="name" className="t-f-g-label">
            {t("companyName")}
          </label>
          <span className="t-f-g-txt">{contactInfo.companyName}</span>
        </div>
      )}
      {companyInfo?.businessLocation?.name && (
        <div className="tabs-form-group">
          <label htmlFor="country" className="t-f-g-label">
            {t("companyCountry")}
          </label>
          <span className="t-f-g-txt">{companyInfo.businessLocation.name}</span>
        </div>
      )}
      {companyInfo.businessAddress && (
        <div className="tabs-form-group">
          <label htmlFor="address" className="t-f-g-label">
            {t("companyAddress")}
          </label>
          <span className="t-f-g-txt">
            {companyInfo?.businessAddress?.addressLine}
          </span>
          <span className="t-f-g-txt">{companyInfo.businessAddress?.city}</span>
          <span className="t-f-g-txt">
            {companyInfo?.businessAddress?.state}
          </span>
          <span className="t-f-g-txt">
            {companyInfo?.businessAddress?.country.code}
          </span>
          <span className="t-f-g-txt">
            {companyInfo?.businessAddress?.pinCode}
          </span>
        </div>
      )}
      {companyInfo.website && (
        <div className="tabs-form-group">
          <label htmlFor="companyWebsite" className="t-f-g-label">
            {t("companyWebsite")}
          </label>
          <span className="t-f-g-txt">{companyInfo.website}</span>
        </div>
      )}
      {companyInfo.noOfEmployees && (
        <div className="tabs-form-group">
          <label htmlFor="companySize" className="t-f-g-label">
            {t("companySize")}
          </label>
          <span className="t-f-g-txt">{companyInfo.noOfEmployees}</span>
        </div>
      )}
      {companyInfo.industry?.name && (
        <div className="tabs-form-group">
          <label htmlFor="companyIndustry" className="t-f-g-label">
            {t("companyIndustry")}
          </label>
          <span className="t-f-g-txt">{companyInfo.industry?.name}</span>
        </div>
      )}
      {companyInfo.type && (
        <div className="tabs-form-group">
          <label htmlFor="businessType" className="t-f-g-label">
            {t("companyIndustry")}
          </label>
          <span className="t-f-g-txt">{companyInfo.type}</span>
        </div>
      )}
      {companyInfo.permissionToContact && (
        <div className="tabs-form-group">
          <label htmlFor="permissionToContact" className="t-f-g-label">
            {t("permissionToContact")}
          </label>
          <span className="t-f-g-txt">{companyInfo.permissionToContact}</span>
        </div>
      )}
      {companyInfo.buyingRole && (
        <div className="tabs-form-group">
          <label htmlFor="buyingRole" className="t-f-g-label">
            {t("buyingRole")}
          </label>
          <span className="t-f-g-txt">{companyInfo.buyingRole}</span>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoCard;
