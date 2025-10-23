"use client";
import Button from "@/app/[locale]/_components/Buttons/Button";
import ProductImageSlider from "@/app/[locale]/_components/Carousel/ProductImageSlider";
import CountryFlag from "@/app/[locale]/_components/Pipe/CountryFlag";
import DeliveryDatePipe from "@/app/[locale]/_components/Pipe/DeliveryDatePipe";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import StockAvailabilityPipe from "@/app/[locale]/_components/Pipe/StockAvailabilty";
import { ProductListInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import truBasic from "../../../../public/img/TruBasic.svg";
import trueVerified from "../../../../public/img/true-verified.png";
import Typography from "../Base/Typography";
import { TruckIcon } from "../Icons/SVGIcons";

interface RFQProductCardProps {
  className?: string;
  product: ProductListInterface;
}

const RFQProductCard: React.FC<RFQProductCardProps> = ({
  product,
  className = "",
}) => {
  const t = useTranslations("productDetailPage.enquiryCart");

  return (
    <div
      className={`rfq-product-card-comp product-listing-card-comp floating-bottom-hover ${className}`}
    >
      <div className="p-l-c-c-slides">
        <ProductImageSlider
          ProductImageData={product.productImage}
          showWishlist={false}
          showSearchStatus={false}
        />
      </div>
      <div className="p-l-c-c-details">
        <div className="p-l-c-c-d-top">
          <Typography className="product-card-name" variant="h3">
            {product.productName}
          </Typography>
          <div className="product-card-info">
            <Typography className="product-price" variant="h4">
              <PricePipe
                currency={product?.currency?.symbol}
                pricing={product?.pricing}
              />
            </Typography>
            <div className="stock-order-wrap">
              {product?.stockAvailability && (
                <Typography className="stock-status in-stock" variant="h4">
                  <StockAvailabilityPipe value={product?.stockAvailability} />
                </Typography>
              )}
              <Typography className="min-order-txt" variant="h4">
                {t("minOrder")} :{product?.minOrderQuantity} {product?.moqUnit}
              </Typography>
            </div>
            {/* {product?.productionLeadTime &&  product?.dispatchLeadTime &&(

            <div className="expected-delivery-wrapper">
              <TruckIcon />
              <Typography className="e-d-w-txt" variant="h5">
                <Typography className="e-d-w-t-expt-del" variant="span">
                  {t("expectedDelivery")}
                </Typography>{" "}
                <Typography className="e-d-w-t-bold" variant="span">
                  <DeliveryDatePipe
                    production={product?.productionLeadTime}
                    dispatch={product?.dispatchLeadTime}
                  />
                </Typography>
              </Typography>
            </div>
            )} */}
            {/* <div className="c-m-b-item verify-img">
                <Image
                  src={trueVerified}
                  width={78}
                  height={15}
                  alt="Verified"
                  sizes="100vw"
                  className="img-contain"
                />
              </div> */}
          </div>
        </div>
        <div className="p-l-c-c-d-bottom-wrapper floating-bottom-wrapper">
          <div className="p-l-c-c-d-bottom">
            <Typography className="company-name-grey" variant="h6">
              {product?.businessInfo?.businessName ?? "Company Name"}
            </Typography>
            <div className="company-meta-badge">
              {product?.businessInfo?.kybVerification &&
              product?.businessInfo?.uboVerification ? (
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
                product?.businessInfo?.kycVerified && (
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
              {/* <div className="c-m-b-item verify-img">
                  <Image
                    src={trueVerified}
                    width={78}
                    height={15}
                    alt="Verified"
                    sizes="100vw"
                    className="img-contain"
                  />
                </div> */}

              {/* {isRating && (
                <div className="c-m-b-item rating-item">
                  <StarIcon />
                  <span className="c-m-b-i-txt">{"4.8/5"}</span>
                </div>
              )} */}
              {product?.businessInfo?.businessLocation && (
                <div className="c-m-b-item">
                  <CountryFlag
                    countryCode={product?.businessInfo?.businessLocation?.code}
                  />
                  <span className="c-m-b-i-country">
                    {product?.businessInfo?.businessLocation?.name}
                  </span>
                </div>
              )}
              {product?.businessInfo?.years >= 1 && (
                <div className="c-m-b-item">
                  <span className="c-m-b-i-txt txt-grey">
                    {product?.businessInfo?.years != null
                      ? product.businessInfo.years > 1
                        ? `${t("yearsWithSuffix", {
                            count: product.businessInfo.years,
                          })}`
                        : `${t("yearWithSuffix", {
                            count: product.businessInfo.years,
                          })}`
                      : " "}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-l-c-c-d-cta-btns floating-block">
            <Button
              className={"btn-outline bg-outline-dark btn-c-sm wid-100"}
              text={t("addToRfqList")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQProductCard;
