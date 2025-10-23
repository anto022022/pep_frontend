import Image from "next/image";
import Link from "next/link";
import box from "../../../../../assets/img/boxblack.png";
import breifCaseblack from "../../../../../assets/img/briefcaseblack.png";
import card from "../../../../../assets/img/card-tick.png";
import money from "../../../../../assets/img/moneys.png";
import task from "../../../../../assets/img/task-square.png";
import emp from "../../../../../assets/img/user.png";
import verifyblack from "../../../../../assets/img/verifyblack.png";
// import box from "../../../../../assets/img/verify.png";
import global from "../../../../../assets/img/global.png";
// import vector from "../../../../../assets/img/buildings.png";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clock from "../../../../../assets/img/clock.png";
import shield from "../../../../../assets/img/security-user.png";
import annualOutputValue from "../../../../../public/img/icons/annual-output-value.svg";
import certificateIcon from "../../../../../public/img/icons/certificate-icon.svg";
import exportPercentage from "../../../../../public/img/icons/export-percentage.svg";
import iecNumber from "../../../../../public/img/icons/iecNumber.svg";
import languageSpoken from "../../../../../public/img/icons/language-spoken.svg";
import mainMarkets from "../../../../../public/img/icons/main-markets.svg";
import nearestPort from "../../../../../public/img/icons/nearest-port.svg";
import annualProductionCapacity from "../../../../../public/img/icons/no-of-production-line.svg";
import noProductionLines from "../../../../../public/img/icons/no-production-lines.svg";

export interface businessTaxInfoInterface {
  country: string;
  country_code: string;
  currency: string;
  default_tax_rates: number;
  tax_id_label: string;
  tax_types: string;
}

const CatalogPreviewCompanySection = ({ catalogCompanyData }) => {
  console.log('catalogCompanyData', catalogCompanyData);
  const t = useTranslations("freeCatalog.catalog");

  const [userCountry, setUserCountry] = useState<string | null>(null);

  const filteredBusinessTaxInfo = catalogCompanyData?.businessTaxInfo?.filter(
    (data: businessTaxInfoInterface) => data?.country_code === userCountry
  );

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      return match ? match[2] : null;
    };

    setUserCountry(getCookie("countryCode"));
  }, []);

  const getCountryNames = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return "-";
    }
    return data.map((c) => c.name).join(", ");
  };

  function arrayToCommaString(
    arr: string[],
    isFirstCharCaps: boolean = false,
    otherPaymentMethod?: string
  ): string {
    if (!Array.isArray(arr) || arr.length === 0) return "";

    const processedArray = arr.map((item) => {
      let trimmed = item.trim();
      if (trimmed.toLowerCase() === "others" && otherPaymentMethod) {
        trimmed = `Other (${otherPaymentMethod.trim()})`;
      }
      if (isFirstCharCaps && trimmed.length > 0) {
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
      console.log('trimmed', arr);
      return trimmed;
    });
    console.log('processedArray', processedArray);


    return processedArray.join(", ");
  }

  // function arrayToCommaStringPayments(
  //   arr: string[],
  //   isFirstCharCaps: boolean = false,
  //   otherPaymentMethod?: string
  // ): string {
  //   alert(1)
  //   if (!Array.isArray(arr) || arr.length === 0) return "";

  //   const processedArray = arr.map((item) => {
  //     let trimmed = item.trim();
  //     if (trimmed.toLowerCase() === "other" && otherPaymentMethod) {
  //       trimmed = `Other (${otherPaymentMethod.trim()})`;
  //     }
  //     if (isFirstCharCaps && trimmed.length > 0) {
  //       return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  //     }

  //     return trimmed;
  //   });
  //   console.log('trimmed payment', processedArray);
  //   return processedArray.join(", ");
  // }
  type AnnualProductionItem = {
    product?: string;
    quantity?: number;
    unit?: string;
  };
  function getTotalAnnualProductionQuantity(
    capacity: AnnualProductionItem[] = []
  ): number {
    if (!Array.isArray(capacity) || capacity.length === 0) return 0;

    return capacity.reduce((sum, item) => {
      const qty = typeof item.quantity === "number" ? item.quantity : 0;
      return sum + qty;
    }, 0);
  }
  const infoData = [
    {
      label: t("companySection.iecNumber"),
      value: catalogCompanyData?.iecNumber || "-",
      icon: iecNumber,
    },
    {
      label: t("companySection.noProductionLines"),
      value: catalogCompanyData?.noOfProductionLines || "-",
      icon: noProductionLines,
    },
    {
      label: t("companySection.annualProductionCapacity"),
      value: `${getTotalAnnualProductionQuantity(
        catalogCompanyData?.annualProductionCapacity
      ) > 0
        ? getTotalAnnualProductionQuantity(
          catalogCompanyData?.annualProductionCapacity
        ) + " Units"
        : "-"
        }`,
      icon: annualProductionCapacity,
    },

    {
      label: t("companySection.annualOutputValue"),
      value: catalogCompanyData?.annualOutputValue || "-",
      icon: annualOutputValue,
    },
    {
      label: t("companySection.exportPercentage"),
      value: `${catalogCompanyData?.exportPercent
        ? catalogCompanyData?.exportPercent + " %"
        : "-"
        }`,

      icon: exportPercentage,
    },
    {
      label: t("companySection.mainMarkets"),
      value: getCountryNames(catalogCompanyData?.mainMarkets),
      icon: mainMarkets,
    },
    {
      label: t("companySection.nearestPort"),
      value: catalogCompanyData?.nearestPort,
      icon: nearestPort,
    },
    {
      label: t("companySection.languageSpoken"),
      value: arrayToCommaString(catalogCompanyData?.languageSpoken) || "-",
      icon: languageSpoken,
    },
  ];

  return (
    <>
      {/* <div className="ct-sub-section">
            <div className="catalog-owners-logo-preview">
              <Image
                src={
                  catalogCompanyData?.companyLogo?.src
                    ? `${process.env.NEXT_PUBLIC_BUCKET_URL}${catalogCompanyData.companyLogo.src}`
                    : Isolation
                }
                alt={t("companySection.catalogOwnerLogoAlt")}
                className="logo-catalog img-fluid"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = Isolation.src;
                }}
                width={100}
                height={100}
              />
            </div>
            <div className="catalog-owners-detail-preview">
              <h5>{catalogCompanyData?.businessName}</h5>
              <label className="verified"></label>
            </div>
          </div> */}
      <div className="ct-sub-section-header">
        <h3 className="form-title">About Company</h3>
      </div>
      <section className="overview-main section-gaps">
        <div className="container-fluid">
          <div className="row gy-5 gx-md-5">
            <div className="col-xl-8 col-md-6">
              <div className="overview-list-items-block">
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={global}
                      alt={t("companySection.verificationStatusAlt")}
                      width="65"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title mb-1">
                        {t("companySection.verificationStatus")}
                      </h3>
                      <div className="o-l-c-flex d-flex gap-2">
                        {/* <label>Verified</label> */}
                        {/* {catalogCompanyData ? (
                          catalogCompanyData?.BusinessVerifyStatus ===
                            "Completed" &&
                          catalogCompanyData?.IdentityVerifyStatus ===
                            "Completed" &&
                          catalogCompanyData?.kycStatus === "Completed" ? (
                            <p className="o-l-c-c-txt">
                              {t("companySection.verified")}
                            </p>
                          ) : (
                            <p className="o-l-c-c-txt">
                              {t("companySection.verifyPending")}
                            </p>
                          )
                        ) : null} */}
                        <p className="o-l-c-c-txt">
                          {t("companySection.verified")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={shield}
                      alt={t("companySection.legalOwnerAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.companyRegistrationNumber")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {/* {catalogCompanyData?.companyRegisterNumber || "-"} */}
                        {catalogCompanyData?.kybVerification
                          ?.businessRegistration?.documentId || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={clock}
                      alt={t("companySection.yearOfEstablishmentAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.yearOfEstablishment")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {catalogCompanyData?.yearOfEstablishment > 0
                          ? catalogCompanyData?.yearOfEstablishment
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={breifCaseblack}
                      alt={t("companySection.businessTypeAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      {/* <h3 className="o-l-c-c-title">
                        {t("companySection.gst")}
                      </h3> */}
                      {filteredBusinessTaxInfo
                        ? filteredBusinessTaxInfo?.map(
                          (
                            business: businessTaxInfoInterface,
                            index: number
                          ) => (
                            <>
                              <h3 className="o-l-c-c-title">
                                {business?.tax_types}
                              </h3>
                              <p className="o-l-c-c-txt" key={index}>
                                {business?.tax_id_label}
                              </p>
                            </>
                          )
                        )
                        : "No Tax document"}
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={emp}
                      alt={t("companySection.noOfEmployeesAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.noOfEmployees")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {catalogCompanyData?.noOfEmployees}{" "}
                        {t("companySection.people")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={card}
                      alt={t("companySection.registeredOfficeSizeAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.paymentMethods")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {catalogCompanyData?.paymentMethods?.length
                          // ? arrayToCommaStringPayments(
                          //   catalogCompanyData?.paymentMethods,
                          //   true,
                          //   catalogCompanyData.otherPaymentMethod
                          // )
                          ? arrayToCommaString(
                            catalogCompanyData?.paymentMethods,
                            true,
                            catalogCompanyData.otherPaymentMethod
                          )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={money}
                      alt={t("companySection.annualTurnoverAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.turnover")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {catalogCompanyData?.annualTurnover || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={task}
                      alt={t("companySection.contractManufacturingAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.contractManufacturing")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {catalogCompanyData?.contractManufacturing?.length > 0
                          ? arrayToCommaString(
                            catalogCompanyData?.contractManufacturing,
                            true
                          )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={verifyblack}
                      alt={t("companySection.certificationAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title mb-1">
                        {t("companySection.certification")}
                      </h3>
                      <div className="certification-block">
                        {catalogCompanyData?.certificates?.length > 0
                          ? catalogCompanyData?.certificates?.map(
                            (item, index) => (
                              <div className="certification-item" key={index}>
                                {item?.image?.src ? (
                                  <Link
                                    href={getImageUrl(item.image.src)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    <Image
                                      src={certificateIcon}
                                      alt={item.name || "Certificate"}
                                      className="certification-img"
                                      width="25"
                                      height="25"
                                    />
                                    <p className="certification-text">
                                      {item.name}
                                    </p>
                                  </Link>
                                ) : (
                                  <>
                                    <Image
                                      src={certificateIcon}
                                      alt={item.name || "Certificate"}
                                      className="certification-img"
                                      width="25"
                                      height="25"
                                    />
                                    <p className="certification-text">
                                      {item.name}
                                    </p>
                                  </>
                                )}
                              </div>
                            )
                          )
                          : "-"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="o-l-i-b-item">
                  <div className="overview-list-comp">
                    <Image
                      src={box}
                      alt={t("companySection.legalStatusAlt")}
                      width="90"
                      height="10"
                      className="o-l-c-img"
                    />
                    <div className="o-l-c-content">
                      <h3 className="o-l-c-c-title">
                        {t("companySection.shippingModes")}
                      </h3>
                      <p className="o-l-c-c-txt">
                        {catalogCompanyData?.shippingMethod?.length > 0
                          ? arrayToCommaString(
                            catalogCompanyData?.shippingMethod,
                            true
                          )
                          : t("companySection.no") || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-xl-4 col-md-6">
                  <div className="overview-info-block">
                    <h2 className="o-i-title">Overview</h2>
                    <h3 className="o-i-subtitle">
                      Protecting Your Profits... Since 1996
                    </h3>
                    <p className="o-i-txt">
                      Essae Digitronics Pvt. Ltd, an ISO 9001:2015 certified
                      company, comprises of FIVE divisions with three
                      manufacturing facilities. Our business focus includes
                      manufacturing and marketing of Truck Scales, Dynamic/In
                      Motion Weighbridge Products, Weighing Solutions, Machined
                      Components, Speedo Hub Drive for Automotive Sector.
                    </p>
                    <Image
                      src="/assets/img/verified-certified.svg"
                      alt="Verified Certified"
                      className="o-i-img"
                       width="90"
                              height="10"
                    />
                    <a
                      href="aboutus.html"
                      className="btn btn-outline-secondary rounded-pill"
                    >
                      Know More
                    </a>
                  </div>
                </div> */}
          </div>
        </div>
      </section>
      <section className="ct-cards">
        <div className="info-grid">
          {infoData.map((item, index) => (
            <div className="info-card" key={index}>
              <div className="label">{item.label}</div>
              <div className="value" style={{ fontWeight: "bold" }}>
                {item.value}
              </div>
              <Image
                src={item.icon}
                alt={item.label}
                width="25"
                height="25"
              // className="o-l-c-img"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default CatalogPreviewCompanySection;
