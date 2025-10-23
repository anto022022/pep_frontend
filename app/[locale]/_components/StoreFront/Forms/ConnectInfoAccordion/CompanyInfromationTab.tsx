import { AddressPipe } from "@/app/[locale]/_components/Pipe/AddressPipe";
import {
  CompanyInfo,
  CustomerInfo,
} from "@/app/[locale]/_interface/ConnectInterface";
import { useTranslations } from "next-intl";

const CompanyInformationTab = ({
  company,
  customer,
}: {
  company: CompanyInfo;
  customer: CustomerInfo;
}) => {
  const t = useTranslations("salesConnect.detailPage");
  return (
    <div className="tabs-content">
      {customer?.companyName && (
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            {t("companyName")}{" "}
          </label>
          <span className="t-f-g-txt">{customer?.companyName}</span>
        </div>
      )}

      {company?.businessAddress && (
        <div className="tabs-form-group">
          <label htmlFor="Brand" className="t-f-g-label">
            {t("address")}
          </label>
          <span className="t-f-g-txt">
            <AddressPipe address={company?.businessAddress} />
          </span>
        </div>
      )}
      {company?.email && (
        <div className="tabs-form-group">
          <label htmlFor="Brand" className="t-f-g-label">
            {t("email")}
          </label>
          <span className="t-f-g-txt">{company.email}</span>
        </div>
      )}
      {company?.website && (
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {t("website")}
          </label>
          <span className="t-f-g-txt">{company?.website}</span>
        </div>
      )}
      {company?.industry && (
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {t("industry")}
          </label>
          <span className="t-f-g-txt">{company?.industry}</span>
        </div>
      )}
    </div>
  );
};

export default CompanyInformationTab;
