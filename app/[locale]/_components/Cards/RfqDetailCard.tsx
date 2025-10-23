import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import Image from "next/image";

import trueVerified from "../../../../public/img/true-verified.png";
import truBasic from "../../../../public/img/TruBasic.svg";

import { FC, useState } from "react";
import { RfqData } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { PricingType } from "@/app/[locale]/_models/StoreFront";

import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";

export interface DetailCardProps {
  data?: RfqData | null;
}

export const RfqDetailCard: FC<DetailCardProps> = ({ data }) => {
  const t = useTranslations("categoryPage.rfq.detailCard");
  const [contactSupplier, setContactSupplier] = useState(false);
    
  const handleSupplierContact = () => {
    if (data?.businessInfo?.isCatalogPublished) {
       window.open(`/en/${data?.businessInfo?.subDomain}`, "_blank");

    } else {
      setContactSupplier(true);
    }
  };
  return (
    <div className="product-detail-Card-comp">
      <div className="p-d-c-c-block shipping-detail-block border-top">
        <div className="shipping-detail-comp">
          <div className="s-d-c-info">
            <Typography variant="h3" className="p-d-c-c-title-sm">
              {t("request")}
            </Typography>
            <Typography variant="p" className="p-d-c-c-subtxt-sm">
              {" "}
            </Typography>
          </div>
          <div className="s-d-c-delivery-info">
            <div className="s-d-c-d-i-item">
              <Typography variant="span" className="s-d-c-d-i-i-label">
                {t("quantity")}
              </Typography>
              {data?.type === "RFQ" && (
                <Typography variant="span" className="s-d-c-d-i-i-value">
                  {data?.totalOrderQuantity?.orderedQuantity
                    ? `${data.totalOrderQuantity.orderedQuantity} ${data.totalOrderQuantity.orderedUnit}`
                    : "--"}
                </Typography>
              )}
              {data?.type === "BR" && (
                <Typography variant="span" className="s-d-c-d-i-i-value">
                  {data?.estOrderQuantity?.quantity
                    ? `${data.estOrderQuantity.quantity} ${data.estOrderQuantity.unit}`
                    : "--"}
                </Typography>
              )}
            </div>
            <div className="s-d-c-d-i-item">
              <Typography variant="span" className="s-d-c-d-i-i-label">
                {t("unitPrice")}
              </Typography>

              {data?.preferredUnitPrice?.priceRange ? (
                <PricePipe
                  pricing={{
                    pricingType: PricingType.PRICE_RANGE,
                    minPrice: data?.preferredUnitPrice?.priceRange?.minPrice,
                    maxPrice: data?.preferredUnitPrice?.priceRange?.maxPrice,
                  }}
                  currency={data?.preferredUnitPrice?.currency?.symbol}
                />
              ) : (
                data?.pricing && (
                  <PricePipe
                    pricing={data?.pricing}
                    currency={data?.currency?.symbol}
                  />
                )
              )}
            </div>
            {/* <div className="s-d-c-d-i-item">
              <Typography variant="span" className="s-d-c-d-i-i-label">
                {t("urgency")}
              </Typography>
              <Typography variant="span" className="s-d-c-d-i-i-value">
                3-7 days{" "}
              </Typography>
            </div> */}
          </div>
          <div className="button-group-block">
            {/* <Button
              className={"btn-outline bg-outline-dark"}
              text={t("chat")}
            /> */}
            <Button disabled className={"btn-c-primary"} text={t("quote")} />
          </div>
        </div>
      </div>
      <div className="p-d-c-c-block company-profile-block border-top">
        <div className="company-info">
          <div className="c-i-details">
            {data?.businessInfo?.businessName && (
              <span className="c-i-d-title cursor-pointer" onClick={handleSupplierContact}>
                {data?.businessInfo?.businessAddress?.state
                  ? `${data.businessInfo.businessName}, ${data.businessInfo.businessAddress.state}`
                  : " "}
              </span>
            )}

            <div className="company-meta-badge">
              {data?.businessInfo?.kybVerification &&
              data?.businessInfo?.uboVerification ? (
                <div className="c-m-b-item">
                  <Image
                    src={trueVerified}
                    width={78}
                    height={15}
                    alt="Verified"
                    sizes="100vw"
                  ></Image>
                </div>
              ) : (
                data?.businessInfo?.kycVerified && (
                  <div className="c-m-b-item">
                    <Image
                      src={truBasic}
                      width={78}
                      height={15}
                      alt="Verified"
                      sizes="100vw"
                    ></Image>
                  </div>
                )
              )}
              {(data?.businessInfo?.businessLocation ||
                data?.businessInfo?.businessAddress) && (
                <div className="c-m-b-item">
                  <Image
                    src={`https://flagcdn.com/w320/${(
                      data?.businessInfo?.businessLocation?.code ??
                      data?.businessInfo?.businessAddress?.country?.code
                    )?.toLowerCase()}.png`}
                    width={19}
                    height={12}
                    alt={data?.businessInfo?.businessLocation?.name}
                    sizes="100vw"
                  ></Image>

                  {data?.businessInfo?.businessAddress && (
                    <span className="c-m-b-i-country">
                      {data?.businessInfo?.businessAddress?.state ?? " "},{" "}
                      {data?.businessInfo?.businessAddress?.country?.name ??
                        " "}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {(data?.businessInfo?.industry ||
          data?.businessInfo?.businessTypeSpecific?.[0]) && (
          <div className="badge-group">
            {data?.businessInfo?.industry && (
              <span className="badge-comp">
                {data?.businessInfo?.industry?.name ?? " "}
              </span>
            )}
            {data?.businessInfo?.businessTypeSpecific?.[0] && (
              <span className="badge-comp">
                {data?.businessInfo?.businessTypeSpecific?.[0]}
              </span>
            )}
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
