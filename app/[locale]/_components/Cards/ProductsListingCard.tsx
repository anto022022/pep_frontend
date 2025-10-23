"use client";
import Button from "@/app/[locale]/_components/Buttons/Button";
import { DealCardPrice } from "@/app/[locale]/_components/Common/DealCardPrice";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import StockAvailabilityPipe from "@/app/[locale]/_components/Pipe/StockAvailabilty";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { OfferType } from "@/app/[locale]/_interface/SellOfferInterface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import truBasic from "../../../../public/img/TruBasic.svg";
import trueVerified from "../../../../public/img/true-verified.png";

import "@/app/[locale]/dev_styles.css";
import { ProductListInterface } from "../../_interface/MarketPlaceInterface";
import Typography from "../Base/Typography";
import ProductImageSlider from "../Carousel/ProductImageSlider";
import {
  CollectionIcon,
  EyeIcon,
  FireIcon,
  RankingIcon,
} from "../Icons/SVGIcons";
import { PricePipe } from "../Pipe/PricePipe";

interface ProductListingProps {
  product: ProductListInterface;
  className?: string;
  refQuery?: string;
  link: string;
}

const ProductListingCard: React.FC<ProductListingProps> = ({
  product,
  className,
  link,
  refQuery = "",
}) => {
  const router = useRouter();
  const t = useTranslations("categoryPage.cards.productCardWithOffer");
  const [isOffer, setIsOffer] = useState(false);
  const [userSessionDialog, setUserSessionDialog] = useState(false);
  const login = useLoginRedirect();

  const [daysLeft] = useState<number | null>(() => {
    if (!product?.activeOffer?.expires) return null;

    const expiresAt = new Date(product.activeOffer.expires).getTime();
    const now = Date.now();

    if (expiresAt <= now) {
      return null;
    }

    const diffMs = expiresAt - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  });

  const validTill = product.activeOffer?.expires
    ? product.activeOffer.expires
    : "-";

  useEffect(() => {
    if (
      product?.activeOffer?.validOffer &&
      daysLeft &&
      product?.activeOffer?.offerInfo &&
      product?.activeOffer?.isApproved
    ) {
      setIsOffer(true);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => router.push(`${link}?ref=${refQuery}`),
      onUnauthenticated: () => login(),
    });
  };

  if (!product) {
    return (
      <div className="no-items flex flex-col items-center justify-center p-6 text-gray-500">
        <img
          src="/assets/no-items.svg" // replace with your "no items" illustration
          alt="No items"
          className="w-40 h-40 mb-4 opacity-80"
        />
        <p className="text-lg font-medium">{t("noProduct.title")}</p>
        <p className="text-sm text-gray-400">{t("noProduct.description")}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`product-listing-card-comp floating-bottom-hover ${className}`}
      >
        <Link
          href={{
            pathname: link,
            query: { ref: refQuery },
          }}
          className="p-l-c-c-details"
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

              {!isOffer ? (
                <div className="product-card-info">
                  {
                    product?.pricing?.pricingType!=="requestQuote" && 
                    <Typography className="product-price" variant="h4">
                    <PricePipe
                      currency={product?.currency?.symbol}
                      pricing={product?.pricing}
                    />
                  </Typography>
                  }
                  
                  <div className="stock-order-wrap">
                    <Typography className="stock-status in-stock" variant="h4">
                      {product?.stockAvailability ? (
                        <StockAvailabilityPipe
                          value={product?.stockAvailability}
                        />
                      ) : (
                        "--"
                      )}
                    </Typography>
                    {product?.minOrderQuantity && (
                      <Typography className="min-order-txt" variant="h4">
                        {t("minOrder")} :{product?.minOrderQuantity}{" "}
                        {product?.moqUnit}
                      </Typography>
                    )}
                  </div>
                  {/* <div className="expected-delivery-wrapper">
                    <TruckIcon />
                    <Typography className="e-d-w-txt" variant="h5">
                      {t("expectedDeliveryBy") + " "}
                      <Typography className="e-d-w-t-bold add-space-in-expected-delivery" variant="span">
                        <DeliveryDatePipe
                          production={product?.productionLeadTime}
                          dispatch={product?.dispatchLeadTime}
                        />
                      </Typography>
                    </Typography>
                  </div> */}
                  {product?.businessInfo?.kybVerification &&
                  product?.businessInfo?.uboVerification ? (
                    <div className="verify-img">
                      <Image
                        src={trueVerified}
                        width={78}
                        height={15}
                        alt="Verified"
                        sizes="100vw"
                        className="img-contain"
                      ></Image>
                    </div>
                  ) : (
                    product?.businessInfo?.kycVerified && (
                      <div className="verify-img">
                        <Image
                          src={truBasic}
                          width={78}
                          height={15}
                          alt="Verified"
                          sizes="100vw"
                          className="img-contain"
                        ></Image>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="product-card-info">
                  {product?.activeOffer?.offerInfo?.offerType && (
                    <span className="offer-badge">
                      {t(
                        `offerTypes.${product?.activeOffer?.offerInfo?.offerType}`
                      )}
                    </span>
                  )}

                  {product?.pricing?.pricingType == "fixed" && (
                    <>
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.BUY_MORE && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.LOW_MOQ && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.LIMITED_TIME && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.FIXED_DISCOUNT && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                    </>
                  )}

                  {product?.pricing?.pricingType == "bulk" && (
                    <>
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.LOW_MOQ && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.LIMITED_TIME && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.FIXED_DISCOUNT && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                    </>
                  )}

                  {product?.pricing?.pricingType == "priceRange" && (
                    <>
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.BUY_MORE && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.LOW_MOQ && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.LIMITED_TIME && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                      {product?.activeOffer?.offerInfo?.offerType ==
                        OfferType.FIXED_DISCOUNT && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                    </>
                  )}

                  {product?.pricing?.pricingType == "requestQuote" && (
                    <>
                      {product?.activeOffer?.offerInfo?.offerType && (
                        <DealCardPrice
                          product={product}
                          validTill={validTill}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-l-c-c-d-bottom-wrapper floating-bottom-wrapper">
              <div className="p-l-c-c-d-bottom">
                {!isOffer ? (
                  <>
                    <Typography className="company-name-grey" variant="h6">
                      {product?.businessInfo?.businessName ?? ""}
                    </Typography>
                  </>
                ) : (
                  <>
                    {product?.activeOffer?.offerInfo?.offerType ==
                      OfferType.BUY_MORE && (
                      <div className="deal-badge buy-get">
                        <CollectionIcon />
                        <span className="d-b-txt">
                          {t("buyGetOffer", {
                            buy: product.activeOffer.offerInfo.buyQty,
                            free: product.activeOffer.offerInfo.freeQty,
                          })}
                        </span>
                      </div>
                    )}

                    {product?.activeOffer?.offerInfo?.offerType ==
                      OfferType.LIMITED_TIME &&
                      daysLeft && (
                        <div className="deal-badge">
                          <FireIcon />
                          <span className="d-b-txt">
                            {" "}
                            {t("endsInDays", { days: daysLeft })}
                          </span>
                        </div>
                      )}

                    {(product?.activeOffer?.offerInfo?.offerType ==
                      OfferType.FIXED_DISCOUNT ||
                      product?.activeOffer?.offerInfo?.offerType ===
                        OfferType.LOW_MOQ) && (
                      <div className="deal-badge new-buyer">
                        <RankingIcon />
                        <span className="d-b-txt">{t("newBuyerOffer")}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="p-l-c-c-d-b-footer">
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
                          className="img-contain"
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
                            className="img-contain"
                          ></Image>
                        </div>
                      )
                    )}

                    {/* <div className="c-m-b-item rating-item">
                        <StarIcon />
                        <span className="c-m-b-i-txt">{"4.8/5"}</span>
                      </div> */}
                    {(product?.businessInfo?.businessLocation?.code ||
                      product?.businessInfo?.businessLocation?.name) && (
                      <div className="c-m-b-item">
                        <Image
                          src={`https://flagcdn.com/w320/${product?.businessInfo?.businessLocation?.code.toLowerCase()}.png`}
                          width={19}
                          height={12}
                          alt={
                            product?.businessInfo?.businessLocation?.name ?? ""
                          }
                          sizes="100vw"
                        />
                        <span className="c-m-b-i-country">
                          {product?.businessInfo?.businessLocation?.code ?? " "}
                        </span>
                      </div>
                    )}

                    {(product?.businessInfo?.years ||
                      product?.businessInfo?.years > 0) && (
                      <div className="c-m-b-item">
                        <span className="c-m-b-i-txt txt-grey">
                          {product?.businessInfo?.years > 1
                            ? t("yearsWithSuffix", {
                                count: product?.businessInfo?.years,
                              })
                            : t("yearWithSuffix", {
                                count: product?.businessInfo?.years,
                              })}
                        </span>
                      </div>
                    )}
                  </div>
                  {product?.analytics?.views > 0 && (
                    <div className="views-block">
                      <EyeIcon />
                      <span className="v-b-count-txt">
                        {product?.analytics?.views ?? 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-l-c-c-d-cta-btns floating-block">
                <Button
                  onClick={handleClick}
                  className={"btn-c-primary btn-c-sm"}
                  text={t("requestQuote")}
                />
              </div>
            </div>
          </div>
        </Link>

        <AlertDialog
          visible={userSessionDialog}
          subTxt="You have to Login to Quote"
          continueOnclick={() => {
            setUserSessionDialog(false);
            login();
          }}
          cancelOnclick={() => {
            setUserSessionDialog(false);
          }}
        />
      </div>
    </>
  );
};

export default ProductListingCard;
