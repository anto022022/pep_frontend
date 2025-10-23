import Button from "@/app/[locale]/_components/Buttons/Button";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { Country } from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  Currency,
  ProductPricing,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import truBasic from "../../../../public/img/TruBasic.svg";
import trueVerified from "../../../../public/img/true-verified.png";
import Typography from "../Base/Typography";
import { RequestDetailsValues } from "../OverLay/AddPostBuyingRequest";

export interface BuyingRequestValues extends RequestDetailsValues {
  _id: string;
  status: string;
  isArchived: boolean;
  productImageSrc: string;
  categoryName: string;
  subCategoryName: string;
  createdAt: Date;
  type: string;
  pricing: ProductPricing;
  currency: Currency;
  totalOrderQuantity: {
    orderedQuantity: number;
    orderedUnit: string;
  };
  businessInfo: {
    years: number;
    kycVerified: boolean;
    kybVerification: boolean;
    businessLocation: Country;
    businessName: boolean;
    uboVerification: boolean;
  };
  userInfo: {
    years: number;
    businessName: string;
  };
  liveUrl: string;
}
interface PostNeedsProps {
  reqData: BuyingRequestValues;
  link?: string;
  refQuery?: string;
}
const PostNeedsCard: React.FC<PostNeedsProps> = ({
  reqData,
  link,
  refQuery,
}) => {
  const startDate = new Date(reqData.createdAt);
  const currentDate = new Date();
  const router = useRouter();
  const diffInMs = currentDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const t = useTranslations("categoryPage.cards.postNeedsCard");
  return (
    <Link
      href={{
        pathname: link,
        query: { ref: refQuery },
      }}
      className="post-needs-card-comp floating-bottom-hover"
    >
      <div className="p-n-c-c-info">
        <div className="p-n-c-c-i-posted-info">
          {diffInDays === 0 ? (
            <span className="posted-date">
              {t("posted")} {t("today")}
            </span>
          ) : (
            <span className="posted-date">
              {t("posted")} {diffInDays} {t("days")}
            </span>
          )}

          <div className="content-breadcrumb-wrapper">
            <span className="c-b-w-title">{reqData?.productName}</span>
            <span className="c-b-w-breadcrumb">
              {reqData?.category?.name ? (
                <span className="t-f-g-txt">{` ${reqData?.category?.name} >   ${reqData?.subCategory?.name}`}</span>
              ) : reqData?.categorySuggestion?.suggestedCategory ? (
                <span className="t-f-g-txt">{`Suggest Category: ${reqData?.categorySuggestion?.suggestedCategory}`}</span>
              ) : (
                <span className="t-f-g-txt">{`Category: -`}</span>
              )}
            </span>
          </div>
        </div>
        <div className="p-n-c-c-features">
          <div className="p-n-c-c-f-item">
            <span className="p-n-c-c-f-i-label">{t("priceRange")}</span>
            {reqData?.preferredUnitPrice?.priceRange ? (
              <PricePipe
                pricing={{
                  pricingType: PricingType.PRICE_RANGE,
                  minPrice: reqData?.preferredUnitPrice?.priceRange?.minPrice,
                  maxPrice: reqData?.preferredUnitPrice?.priceRange?.maxPrice,
                }}
                currency={reqData?.preferredUnitPrice?.currency?.symbol}
              />
            ) : (
              reqData?.pricing && (
                <PricePipe
                  pricing={reqData.pricing}
                  currency={reqData?.currency?.symbol}
                />
              )
            )}
          </div>
          <div className="p-n-c-c-f-item">
            <span className="p-n-c-c-f-i-label">{t("reqQuantity")}</span>
            {reqData?.type === "RFQ" && (
              <span className="p-n-c-c-f-i-value">
                {reqData?.totalOrderQuantity?.orderedQuantity
                  ? `${reqData.totalOrderQuantity.orderedQuantity} ${reqData.totalOrderQuantity.orderedUnit}`
                  : "--"}
              </span>
            )}
            {reqData?.type === "BR" && (
              <span className="p-n-c-c-f-i-value">
                {reqData?.estOrderQuantity?.quantity
                  ? `${reqData.estOrderQuantity.quantity} ${reqData.estOrderQuantity.unit}`
                  : "--"}
              </span>
            )}
          </div>
          {/* <div className="p-n-c-c-f-item">
            <span className="p-n-c-c-f-i-label">{t("timeline")}</span>
            <span className="p-n-c-c-f-i-value">Needed within 7 days</span>
          </div> */}
        </div>
      </div>
      <div className="floating-bottom-wrapper">
        {reqData?.businessInfo &&
          (reqData?.businessInfo?.businessName ||
            reqData?.businessInfo?.kycVerified ||
            reqData?.businessInfo?.kybVerification ||
            reqData?.businessInfo?.businessLocation ||
            reqData?.businessInfo?.years) && (
            <div className="p-n-c-c-footer">
              {reqData?.businessInfo?.businessName && (
                <Typography className="company-name-grey" variant="h6">
                  {reqData.businessInfo.businessName}
                </Typography>
              )}
              <div className="company-meta-badge">
                {reqData?.businessInfo?.kybVerification &&
                reqData?.businessInfo?.uboVerification ? (
                  <div className="c-m-b-item verify-img">
                    <Image
                      src={trueVerified}
                      width={78}
                      height={30}
                      alt="Verified"
                      sizes="100vw"
                    ></Image>
                  </div>
                ) : (
                  reqData?.businessInfo?.kycVerified && (
                    <div className="c-m-b-item verify-img">
                      <Image
                        src={truBasic}
                        width={78}
                        height={30}
                        alt="Verified"
                        sizes="100vw"
                      ></Image>
                    </div>
                  )
                )}

                {reqData?.businessInfo?.businessLocation && (
                  <div className="c-m-b-item">
                    <Image
                      src={`https://flagcdn.com/w320/${reqData?.businessInfo?.businessLocation?.code.toLowerCase()}.png`}
                      width={19}
                      height={12}
                      alt={reqData?.businessInfo?.businessLocation?.name}
                      sizes="100vw"
                    />
                    <span className="c-m-b-i-country">
                      {reqData?.businessInfo?.businessLocation?.name}
                    </span>
                  </div>
                )}

                {reqData?.businessInfo?.years != null && (
                  <div className="c-m-b-item">
                    <span className="c-m-b-i-txt txt-grey">
                      {`${reqData.businessInfo.years}yrs`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        <div className="floating-block">
          <Button
            className={"btn-c-primary btn-c-sm"}
            text={t("quoteNow")}
            onClick={() => {
              router.push(`/rfqs/${reqData?._id}`);
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default PostNeedsCard;
