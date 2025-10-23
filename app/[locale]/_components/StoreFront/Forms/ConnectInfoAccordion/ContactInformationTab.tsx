import { CustomerInfo } from "@/app/[locale]/_interface/ConnectInterface";
import { useTranslations } from "next-intl";

const ContactInformationTab = ({ customer }: { customer: CustomerInfo }) => {
  const t = useTranslations("salesConnect.detailPage");
  return (
    <div className="tabs-content">
      {customer?.contactName && (
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            {t("contactName")}
          </label>
          <span className="t-f-g-txt">{customer?.contactName}</span>
        </div>
      )}
      {customer?.jobTitle && (
        <div className="tabs-form-group">
          <label htmlFor="Product Category" className="t-f-g-label">
            {t("jobTitle")}
          </label>
          <span className="t-f-g-txt">{customer?.jobTitle}</span>
        </div>
      )}
      {customer?.email && (
        <div className="tabs-form-group">
          <label htmlFor="Brand" className="t-f-g-label">
            {t("email")}
          </label>
          <span className="t-f-g-txt">{customer?.email}</span>
        </div>
      )}
      {customer?.phoneNo && (
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {t("phone")}
          </label>

          <span className="t-f-g-txt">
            {" "}
            {`+${customer?.phoneNo?.countryCode ?? ""} ${
              customer?.phoneNo.number ?? "--"
            }`}
          </span>
        </div>
      )}

      {customer?.whatsAppNo && (
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {t("whatsApp")}
          </label>
          <span className="t-f-g-txt">
            {" "}
            {`+${customer?.whatsAppNo?.countryCode ?? ""} ${
              customer?.whatsAppNo.number ?? "--"
            }`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ContactInformationTab;
