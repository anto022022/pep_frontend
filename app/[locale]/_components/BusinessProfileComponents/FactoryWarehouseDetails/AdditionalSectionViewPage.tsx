import Image from "next/image";
import React from "react";

import Typography from "@/app/[locale]/_components/Base/Typography";
import GoogleMapsShareLink from "@/app/[locale]/_hooks/useGoogleMapsShareLink";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import {
  factoryDivision,
  InfrastructureImgInterface,
} from "@/app/[locale]/_interface/BusinessProfile";
import { useTranslations } from "next-intl";

interface AdditionalSectionInterface {
  AdditionalInformation: any;
}

const AdditionalSectionViewPage: React.FC<AdditionalSectionInterface> = (
  props
) => {
  const { AdditionalInformation } = props;
  const businessProfileT = useTranslations(
    "businessProfile"
  );

  return (
    <div className="c-f-b-t-body label-grey-reverse">
      <div className="accordion-form-block-group">
        <div className="accordion-form-block">
          <Typography variant="span" className="a-f-b-title">
            {businessProfileT("businessInformation.businessDetails.legalBusinessName")}
          </Typography>
          <div className="tabs-content col-2-layout flex-dir-row">
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.factorySize.title")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.totalFactorySize ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.productionLines")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.noOfProductionLines ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.annualOutput")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.annualOutputValue ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.productionFacility")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.productionFacilities ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.qcstaff")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.noOfQcStaff ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.productionCapacity.title")}
              </label>
              {AdditionalInformation?.annualProductionCapacity?.length > 0
                ? AdditionalInformation?.annualProductionCapacity?.map(
                  (data, index: number) => (
                    <span
                      className="t-f-g-txt"
                      key={index}
                    >{`${data?.product} ${data?.quantity} ${data?.unit}`}</span>
                  )
                )
                : "--"}
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.warehouse.title")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.warehouseStorageArea ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.r&dStaff")}
              </label>
              <span className="t-f-g-txt">
                {AdditionalInformation?.noOfRdStaff ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.overview")}
              </label>
              {AdditionalInformation?.infrastructureImg?.map(
                (data: InfrastructureImgInterface, index: number) => (
                  <div className="t-f-g-img" key={index}>
                    {/* <PlaceholderImageIcon /> */}
                    {/* <Image src={'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?cs=srgb&dl=pexels-pixabay-459728.jpg&fm=jpg'} alt='Industry' width={100} height={195} sizes='100vw'></Image> */}
                    {data && (
                      <Image
                        src={getImageUrl(data?.src ?? "")}
                        alt={data?.alt ?? ""}
                        width={100}
                        height={195}
                        sizes={String(data?.size ?? 0)}
                      />
                    )}

                  </div>
                )
              )}
              <span className="t-f-g-txt">
                {AdditionalInformation?.infrastructureOverview}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("businessInformation.factoryDetails.warehouse.certificate")}
              </label>
              <div className="t-f-g-img certification-img">
                {/* <PlaceholderImageIcon /> */}
                {AdditionalInformation?.warehouseCertification && (
                  <Image
                    src={getImageUrl(
                      AdditionalInformation?.warehouseCertification?.src ?? ""
                    )}
                    alt={AdditionalInformation?.warehouseCertification?.alt ?? ""}
                    width={100}
                    height={195}
                    sizes={AdditionalInformation?.warehouseCertification?.size ?? 0}
                  />
                )}

              </div>
              <div className="brochure-document-block remv-bg">
                <div className="b-d-b-left">
                  <span className="b-d-b-filename">
                    {AdditionalInformation?.warehouseCertification?.src
                      ?.split("/")
                      .pop()}
                  </span>
                </div>
                <div className="b-d-b-right">
                  <span className="b-d-b-size">
                    {(
                      AdditionalInformation?.warehouseCertification?.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {AdditionalInformation?.factoryDivision?.map(
          (data: factoryDivision, index: number) => (
            <div className="accordion-form-block" key={index}>
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-title">
                  {businessProfileT("businessProfileStepper.factoryWarehouseDetails.title")}
                </Typography>
                <Typography variant="span" className="a-f-b-subtxt">
                  {data?.divisionName}
                </Typography>
              </div>
              <div className="tabs-content col-2-layout flex-dir-row">
                <div className="tabs-content tabs-split-main">
                  <div className="tabs-form-group">
                    <label htmlFor="Product Name" className="t-f-g-label">
                      {businessProfileT("businessInformation.factoryDetails.officeBranch.company.title")}
                    </label>
                    <span className="t-f-g-txt">
                      {data?.companyName ?? "--"}
                    </span>
                  </div>
                  <div className="tabs-form-group">
                    <label htmlFor="Product Name" className="t-f-g-label">
                      {businessProfileT("businessInformation.factoryDetails.officeBranch.contact.title")}
                    </label>
                    <span className="t-f-g-txt">
                      {data?.contactName ?? "--"}
                    </span>
                  </div>
                  <div className="tabs-form-group">
                    <label htmlFor="Product Name" className="t-f-g-label">
                      {businessProfileT("businessInformation.factoryDetails.officeBranch.phone.title")}
                    </label>
                    <span className="t-f-g-txt">
                      {/* {data?.phoneNumber ?? "--"} */}
                      +91-9876543210
                    </span>
                  </div>
                  <div className="tabs-form-group">
                    <label htmlFor="Product Name" className="t-f-g-label">
                      {businessProfileT("businessDetails.businessAddress")}
                    </label>
                    <span className="t-f-g-txt">{`${data?.address?.addressLine ?? ""
                      },${data?.address?.city ?? ""},
                    ${data?.address?.state ?? ""},${data?.address?.country?.name ?? ""
                      }-
                    ${data?.address?.pinCode ?? "--"}`}</span>
                  </div>
                </div>
                <div className="tabs-split-main">
                  <div className="tabs-form-group">
                    <label htmlFor="Product Name" className="t-f-g-label">
                      {businessProfileT("businessInformation.factoryDetails.officeBranch.googleMap")}
                    </label>
                    {/* <div className='embed-map'>
                            <iframe src={data?.googleMapLink}
                              width="400"
                              height="200"
                              style={{ border: '0' }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"></iframe>
                          </div>
                          <CopyLink textToCopy={shareLink ?? data?.googleMapLink ?? ''} /> */}
                    <GoogleMapsShareLink embedUrl={data?.googleMapLink} />
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdditionalSectionViewPage;
