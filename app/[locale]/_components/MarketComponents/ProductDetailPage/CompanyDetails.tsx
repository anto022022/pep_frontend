import Typography from "@/app/[locale]/_components/Base/Typography";
import {
  BrochureIcon,
  MoneyIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import {
  BusinessInfoDetail,
  UserInfoAddition,
} from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { NamedImage } from "@/app/[locale]/_interface/BusinessProfile";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import truBasic from "../../../../../public/img/TruBasic.svg";
import verifyImg from "../../../../../public/img/true-verified.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";

export interface ProductDetailPageProps {
  productData: PreviewData & UserInfoAddition & BusinessInfoDetail;
}

const CompanyDetails: React.FC<ProductDetailPageProps> = ({ productData }) => {
  const t = useTranslations("productDetailPage.companyProfile");
  const f = useTranslations("productDetailPage.factoryDetails");
  const [contactSupplier, setContactSupplier] = useState(false);

  const handleSupplierContact = () => {
    if (productData?.businessInfo?.isCatalogPublished) {
      window.open(`/en/${productData?.businessInfo?.subDomain}`, "_blank");
    } else {
      setContactSupplier(true);
    }
  };
  const business = productData?.businessInfo;

  return (
    <div className="detail-box-wrapper company-profile-box">
      <Typography variant="h4" className="d-b-w-title">
        {t("label")}
      </Typography>

      <div className="company-profile-block-box">
        <div className="company-info">
          {/* Company Logo */}
          {business?.companyLogo?.src && (
            <div className="c-i-img">
              <Image
                src={getImageUrl(business.companyLogo.src)}
                width={120}
                height={74}
                sizes="100vw"
                alt={business?.businessName ?? "Company logo"}
              />
            </div>
          )}

          <div className="c-i-details">
            {/* Business Name + State */}
            {business?.businessName && business?.businessAddress?.state && (
              <span
                className="c-i-d-title cursor-pointer"
                onClick={handleSupplierContact}
              >
                {business.businessName}, {business.businessAddress.state}
              </span>
            )}

            {/* Badges */}
            <div className="company-meta-badge">
              {business?.kybVerification && business?.uboVerification ? (
                <div className="c-m-b-item">
                  <Image
                    src={verifyImg}
                    width={78}
                    height={15}
                    alt="Verified"
                  />
                </div>
              ) : (
                business?.kycVerified && (
                  <div className="c-m-b-item">
                    <Image
                      src={truBasic}
                      width={78}
                      height={15}
                      alt="Verified"
                    />
                  </div>
                )
              )}

              {business?.businessLocation && (
                <div className="c-m-b-item">
                  <Image
                    src={`https://flagcdn.com/w320/${business.businessLocation.code.toLowerCase()}.png`}
                    width={19}
                    height={12}
                    alt={business.businessLocation?.name ?? "Country flag"}
                  />
                  <span className="c-m-b-i-country txt-lght-grey-2">
                    {business?.businessAddress?.state},{" "}
                    {business?.businessAddress?.country?.name}
                  </span>
                </div>
              )}

              {business?.years && (
                <div className="c-m-b-item">
                  <span className="c-m-b-i-txt txt-lght-grey-2">
                    {business.years} yrs
                  </span>
                </div>
              )}
            </div>

            {/* Industry + Business Type */}
            {(business?.industry ||
              business?.businessTypeSpecific?.length > 0) && (
              <div className="c-i-category-block">
                {business?.industry?.name && (
                  <Typography variant="span" className="c-i-c-b-txt">
                    {business.industry.name}
                  </Typography>
                )}
                {business?.industry?.name &&
                  business?.businessTypeSpecific?.length > 0 && (
                    <Typography variant="span" className="c-i-c-b-txt">
                      •
                    </Typography>
                  )}
                {business?.businessTypeSpecific?.length > 0 &&
                  business.businessTypeSpecific.map(
                    (item: string, index: number) => (
                      <Typography
                        key={index}
                        variant="span"
                        className="c-i-c-b-txt"
                      >
                        {item}
                      </Typography>
                    )
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Annual Turnover */}
        {business?.annualTurnover && (
          <div className="company-features">
            <div className="c-f-item">
              <Typography variant="span" className="c-f-i-label">
                {t("turnOver")}
              </Typography>
              <Typography variant="h3" className="c-f-i-value">
                {business.annualTurnover}
              </Typography>
              <MoneyIcon />
            </div>
          </div>
        )}
      </div>

      <div className="feature-details-group">
        {/* Factory Details */}
        {(!!business?.totalFactorySize ||
          (business?.contractManufacturing?.length ?? 0) > 0 ||
          (business?.noOfQcStaff ?? 0) > 0 ||
          (business?.noOfRdStaff ?? 0) > 0 ||
          (business?.noOfProductionLines ?? 0) > 0 ||
          (business?.annualProductionCapacity?.length ?? 0) > 0) && (
          <div className="feature-details">
            <Typography variant="h5" className="f-d-title">
              {f("label")}
            </Typography>
            <div className="f-d-group">
              {/* Factory Size */}
              {business?.totalFactorySize && (
                <div className="f-d-g-item">
                  <Typography variant="span" className="f-d-g-i-title">
                    {f("factorySize")}
                  </Typography>
                  <Typography variant="span" className="f-d-g-i-value">
                    {business.totalFactorySize}
                  </Typography>
                </div>
              )}

              {/* Contract Manufacturing */}
              {(business?.contractManufacturing?.length ?? 0) > 0 && (
                <div className="f-d-g-item">
                  <Typography variant="span" className="f-d-g-i-title">
                    {f("contractManufacturing")}
                  </Typography>
                  {business.contractManufacturing!.map(
                    (item: string, index: number) => (
                      <Typography
                        key={index}
                        variant="span"
                        className="c-i-c-b-txt"
                      >
                        {item}
                      </Typography>
                    )
                  )}
                </div>
              )}

              {/* QC Staff */}
              {(business?.noOfQcStaff ?? 0) > 0 && (
                <div className="f-d-g-item">
                  <Typography variant="span" className="f-d-g-i-title">
                    {f("numberOfQCStaff")}
                  </Typography>
                  <Typography variant="span" className="f-d-g-i-value">
                    {business?.noOfQcStaff}
                  </Typography>
                </div>
              )}

              {/* RD Staff */}
              {(business?.noOfRdStaff ?? 0) > 0 && (
                <div className="f-d-g-item">
                  <Typography variant="span" className="f-d-g-i-title">
                    {f("numberOfRDStaff")}
                  </Typography>
                  <Typography variant="span" className="f-d-g-i-value">
                    {business?.noOfRdStaff}
                  </Typography>
                </div>
              )}

              {/* Production Lines */}
              {(business?.noOfProductionLines ?? 0) > 0 && (
                <div className="f-d-g-item">
                  <Typography variant="span" className="f-d-g-i-title">
                    {f("numberOfProductionLines")}
                  </Typography>
                  <Typography variant="span" className="f-d-g-i-value">
                    {business?.noOfProductionLines}
                  </Typography>
                </div>
              )}

              {/* Annual Production Capacity */}
              {(business?.annualProductionCapacity?.length ?? 0) > 0 && (
                <div className="f-d-g-item">
                  <Typography variant="span" className="f-d-g-i-title">
                    {f("annualProductionCapacity")}
                  </Typography>
                  <Typography variant="span" className="f-d-g-i-value">
                    {`${business!.annualProductionCapacity![0].quantity} ${
                      business!.annualProductionCapacity![0].unit
                    }`}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Markets */}
        {business?.mainMarkets?.length > 0 && (
          <div className="feature-details main-markets">
            <Typography variant="h5" className="f-d-title">
              {f("mainMarkets")}
            </Typography>
            <div className="f-d-group">
              {business.mainMarkets.map(
                (item: CountryOfOrigin, index: number) => (
                  <div className="f-d-g-item" key={index}>
                    <Typography variant="span" className="f-d-g-i-value">
                      {item?.name}
                    </Typography>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Certificates */}
        {business?.certificates?.length > 0 && (
          <div className="feature-details quality-certify-box">
            <Typography variant="h5" className="f-d-title">
              {f("qualityCertification")}
            </Typography>
            <div className="quality-certify-group">
              {business.certificates.map((item: NamedImage, index: number) => (
                <div className="q-c-g-item" key={index}>
                  <Link
                    href={getImageUrl(item.image?.src ?? "")}
                    className="brochure-document-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="b-d-b-left">
                      <BrochureIcon />
                      <span className="b-d-b-filename">{item.name}</span>
                    </div>
                  </Link>
                  <Typography variant="span" className="q-c-g-i-txt">
                    {item?.name}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AlertDialog
        visible={contactSupplier}
        subTxt="Catalog of Supplier is not Published Yet"
        continueOnclick={() => {
          setContactSupplier(false);
        }}
      />
    </div>
  );
};

export default CompanyDetails;
