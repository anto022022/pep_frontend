import { useTranslations } from "next-intl";
import React from "react";

interface BusinessDetailsViewPageInterface {
  businessDetailsInfo: any;
}

const BusinessDetailsViewPage: React.FC<BusinessDetailsViewPageInterface> = (
  props
) => {
  const { businessDetailsInfo } = props;
  const businessProfileT = useTranslations(
    "businessProfile.businessInformation"
  );

  return (
    <div className="c-f-b-t-body label-grey-reverse">
      <div className="tabs-content col-2-layout flex-dir-row">
        <div className="tabs-form-group">
          <label htmlFor="Product Name" className="t-f-g-label">
            {businessProfileT("businessDetails.legalBusinessName")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.legalBusinessName ?? "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Category" className="t-f-g-label">
            {businessProfileT("businessDetails.contactInfo.address.mobile")}
          </label>
          <span className="t-f-g-txt">
            {`${
              businessDetailsInfo?.data?.businessPhoneNo?.countryCode ?? ""
            } ${businessDetailsInfo?.data?.businessPhoneNo?.number ?? "--"}`}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Brand" className="t-f-g-label">
            {businessProfileT("businessDetails.legalBusinessNamePlaceholder")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.businessName ?? "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.contactInfo.address.bEmail")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.businessEmail ?? "--"}
          </span>
        </div>

        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.legalOwnerName")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.legalOwnerName ?? "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.Industry.title")}
          </label>
          {/* {businessDetailsInfo?.data?.industry.length > 0
                        ? businessDetailsInfo?.data?.industry?.map(
                            (
                                data: { name: string; uniqueId: string; _id: string },
                                index: number
                            ) => (
                                <span className="t-f-g-txt" key={index}>
                                    {data?.name}
                                </span>
                            )
                        )
                        : "--"} */}
          {businessDetailsInfo?.data?.industry?.name ?? "--"}
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.legalStatus")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.businessType ?? "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.year.title")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.yearOfEstablishment ?? "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.businessType")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.businessTypeSpecific?.length > 0
              ? businessDetailsInfo.data.businessTypeSpecific.join(", ")
              : "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.employee.title")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.noOfEmployees ?? "--"}
          </span>
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.businessAddress")}
          </label>
          {businessDetailsInfo?.data?.businessAddress ? (
            <span className="t-f-g-txt">
              {`${
                businessDetailsInfo?.data?.businessAddress?.addressLine ?? ""
              }, `}
              {`${businessDetailsInfo?.data?.businessAddress?.city ?? ""}, `}
              {`${businessDetailsInfo?.data?.businessAddress?.state ?? ""}, `}
              {`${
                businessDetailsInfo?.data?.businessAddress?.country?.name ?? ""
              }, `}
              {`${businessDetailsInfo?.data?.businessAddress?.pinCode ?? "--"}`}
            </span>
          ) : (
            "--"
          )}
        </div>
        <div className="tabs-form-group">
          <label htmlFor="Product Description" className="t-f-g-label">
            {businessProfileT("businessDetails.mainProduct.title")}
          </label>
          <span className="t-f-g-txt">
            {businessDetailsInfo?.data?.mainProducts?.map(
              (data: string, index: number, arr: string[]) => (
                <span key={index}>
                  {data}
                  {index < arr.length - 1 ? ", " : ""}
                </span>
              )
            ) ?? "--"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsViewPage;
