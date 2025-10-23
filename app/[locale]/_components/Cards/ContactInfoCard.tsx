"use client";
import { useTranslations } from "next-intl";
import React from "react";
import {
  LeadsDetailsCustomer
} from "../../_interface/LeadsInterface";

const ContactInfoCard: React.FC<{
  contactInfo: LeadsDetailsCustomer;
}> = ({ contactInfo }) => {

  const t = useTranslations("leads.viewPage.contactInformation");
  return (
    // <div className="tabs-content">
    //   {contactInfo.contactName && (
    //     <div className="tabs-forms-group">
    //       <label htmlFor="name" className="t-f-g-label">
    //         {t("contactName")}
    //       </label>
    //       <span className="t-f-g-txt">{contactInfo.contactName}</span>
    //     </div>
    //   )}
    //   {contactInfo.email && (
    //     <div className="tabs-forms-group">
    //       <label htmlFor="email" className="t-f-g-label">
    //         {t("contactEmail")}
    //       </label>
    //       <span className="t-f-g-txt">{contactInfo.email}</span>
    //     </div>
    //   )}
    //   {contactInfo.phoneNo && (
    //     <div className="tabs-forms-group">
    //       <label htmlFor="phoneNo" className="t-f-g-label">
    //         {t("contactPhone")}
    //       </label>
    //       <span className="t-f-g-txt">{contactInfo.phoneNo}</span>
    //     </div>
    //   )}
    //   {contactInfo.jobTitle && (
    //     <div className="tabs-forms-group">
    //       <label htmlFor="jobTitle" className="t-f-g-label">
    //         {t("contactJobTitle")}
    //       </label>
    //       <span className="t-f-g-txt">{contactInfo.jobTitle}</span>
    //     </div>
    //   )}
    // </div>
    <div className="tabs-content">
      {contactInfo.contactName && (
        <div className="tabs-form-group">
          <label htmlFor="name" className="t-f-g-label">
            {t("contactName")}
          </label>
          <span className="t-f-g-txt">{contactInfo.contactName}</span>
        </div>
      )}
      {contactInfo.jobTitle && (
        <div className="tabs-form-group">
          <label htmlFor="Product Category" className="t-f-g-label">
            {t("contactJobTitle")}
          </label>
          <span className="t-f-g-txt">{contactInfo.jobTitle}</span>
        </div>
      )}
      {contactInfo.email && (
        <div className="tabs-form-group">
          <label htmlFor="email" className="t-f-g-label">
            {t("contactEmail")}
          </label>
          <span className="t-f-g-txt">{contactInfo.email}</span>
        </div>
      )}
      {contactInfo.phoneNo && (
        <div className="tabs-form-group">
          <label htmlFor="phoneNo" className="t-f-g-label">
            {t("contactPhone")}
          </label>
          <span className="t-f-g-txt">{contactInfo.phoneNo}</span>
        </div>
      )}
    </div>
  );
};

export default ContactInfoCard;
