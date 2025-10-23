import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { BuyingRequestDetails } from "../../_interface/RfqInterface";
import Typography from "../Base/Typography";
import { PlaceholderImageIcon } from "../Icons/SVGIcons";
import DatePipe from "../Pipe/DatePipe";

const BrDetailsCard = (brDetails: BuyingRequestDetails) => {
  const t = useTranslations("rfq.buyingRequest");
  const [moreDetails, setMoreDetails] = useState(false);
  return (
    <div className="buyer-request-card-comp">
      <div className="b-r-c-c-head">
        <div className="buyer-product-info-box">
          <div className="b-p-i-b-left">
            <div className="b-p-i-b-img">
              {brDetails?.productImage?.[0]?.src ? (
                <Image
                  src={getImageUrl(brDetails.productImage[0].src)}
                  width={380}
                  height={360}
                  alt={brDetails.productImage[0]?.alt || "Product image"}
                  sizes="100vw"
                />
              ) : (
                <div className="image-placeholder-wrapper">
                  <PlaceholderImageIcon />
                </div>
              )}
            </div>
          </div>

          <div className="b-p-i-b-right">
            <div className="b-p-i-b-info-block">
              <div className="id-date-wrapper">
                <Typography variant="span" className="i-d-w-id">
                  {brDetails.rfqId}
                </Typography>
                <Typography variant="span" className="i-d-w-date">
                  {t('buyingRequestTable.addedOn')}: <DatePipe value={brDetails.createdAt} type="date" />
                </Typography>
              </div>
              <div className="name-breadcrumb-wrapper">
                <Typography variant="h1" className="n-b-w-name">
                  {brDetails.productName}
                </Typography>
                <Typography variant="span" className="n-b-w-breadcrumb">
                  {brDetails.category?.name && `${brDetails.category?.name} >`}
                  {brDetails.subCategory?.name &&
                    `${brDetails.subCategory?.name} >`}
                  {brDetails.productCategory?.name &&
                    `${brDetails.productCategory?.name}`}
                </Typography>
              </div>
            </div>
            <div className="estimate-unit-price-block">
              {brDetails.estOrderQuantity.quantity && (
                <div className="e-u-p-b-item">
                  <Typography variant="span" className="e-u-p-b-label">
                    {t("buyingRequestForm.estimatedOrderQuantity.label")}
                  </Typography>
                  <Typography variant="span" className="e-u-p-b-value">
                    {brDetails.estOrderQuantity.quantity}/
                    <span className="light-txt">
                      {brDetails.estOrderQuantity.unit}
                    </span>
                  </Typography>
                </div>
              )}
              {brDetails?.totalOrderQuantity?.orderedQuantity && (
                <div className="e-u-p-b-item">
                  <Typography variant="span" className="e-u-p-b-label">
                    {t("buyingRequestDetails.orderQty")}
                  </Typography>
                  <Typography variant="span" className="e-u-p-b-value">
                    {brDetails?.totalOrderQuantity?.orderedQuantity}/
                    <span className="light-txt">
                      {brDetails?.totalOrderQuantity?.orderedUnit}
                    </span>
                  </Typography>
                </div>
              )}
              <div className="e-u-p-b-item">
                <Typography variant="span" className="e-u-p-b-label">
                  {t("buyingRequestForm.preferredUnitPrice.label")}
                </Typography>
                <Typography variant="span" className="e-u-p-b-value">
                  {brDetails.preferredUnitPrice?.priceRange && (
                    <PricePipe
                      pricing={{
                        pricingType: PricingType.PRICE_RANGE,
                        minPrice:
                          brDetails.preferredUnitPrice.priceRange.minPrice,
                        maxPrice:
                          brDetails.preferredUnitPrice.priceRange.maxPrice,
                      }}
                      currency={brDetails.preferredUnitPrice.currency.symbol}
                    />
                  )}
                  {brDetails.pricing && (
                    <PricePipe
                      pricing={brDetails.pricing}
                      currency={brDetails?.preferredUnitPrice?.currency?.symbol}
                    />
                  )}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="b-r-c-c-body">
          <div className="b-r-c-c-details">
            <p>{brDetails.productDescription}</p>
          </div>

          {/* More Details Grid */}
          {moreDetails && (
            <div className="b-r-c-c-details">
              <div className="forms-block">
                {/* Requirements Section */}
                <div className="forms-group">
                  <label className="f-g-label">
                    {" "}
                    {t("buyingRequestDetails.requirements")}
                  </label>
                  <div className="f-g-input-horiz">
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {" "}
                        {t("buyingRequestForm.sampleRequired.label")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.sampleRequired ? "Yes" : "No"}
                      </div>
                    </div>
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {t("buyingRequestForm.customisationRequired.label")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.customizationRequired ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sourcing Section */}
                <div className="forms-group">
                  <label className="f-g-label">
                    {t("buyingRequestDetails.sourcingPreference")}
                  </label>
                  <div className="f-g-input-horiz">
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {t("buyingRequestDetails.preferredCountry")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.preferredSourcingCountry || "Not specified"}
                      </div>
                    </div>
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {t("buyingRequestDetails.preferredCity")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.preferredSourcingCity || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="forms-group">
                  <label className="f-g-label">
                    {" "}
                    {t("buyingRequestDetails.deliveryInformation")}
                  </label>
                  <div className="f-g-input-horiz">
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {t("buyingRequestForm.expectedDeliveryTime.label")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.expectedDeliveryTime || "Not specified"}
                      </div>
                    </div>
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {" "}
                        {t("buyingRequestDetails.destinationPort")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.destinationPort || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Section */}
                <div className="forms-group">
                  <label className="f-g-label">
                    {t("buyingRequestDetails.contractDetails")}
                  </label>
                  <div className="f-g-input-horiz">
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {t("buyingRequestForm.supplyContractType.label")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.supplyContractType || "Not specified"}
                      </div>
                    </div>
                    <div className="forms-group f-g-w100">
                      <label className="f-g-label-dim">
                        {" "}
                        {t("buyingRequestDetails.paymentTerms")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.paymentTerms || "Not specified"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                {brDetails.shippingMethod &&
                  brDetails.shippingMethod.length > 0 && (
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("buyingRequestForm.sampleRequired.label")}
                      </label>
                      <div className="f-g-value-display">
                        {brDetails.shippingMethod.join(", ")}
                      </div>
                    </div>
                  )}

                {/* Validity Date */}
                <div className="forms-group">
                  <label className="f-g-label">
                    {t("buyingRequestDetails.validityDate")}
                  </label>
                  <div className="f-g-value-display">
                    {brDetails?.validityDate && (
                      <DatePipe value={brDetails.validityDate} type="date" />
                    )}
                  </div>
                </div>

                {/* Product Images Section */}
                {brDetails.productImage &&
                  brDetails.productImage.length > 0 && (
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("buyingRequestDetails.ProductImages")}
                      </label>
                      <div className="product-images-grid">
                        {brDetails.productImage.map((image, index) => (
                          <div key={index} className="product-image-item">
                            <img
                              src={getImageUrl(image.src)}
                              alt={image.alt || `Product ${index + 1}`}
                              className="product-image"
                            />
                            <span className="image-label">
                              {image.alt || `Product ${index + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
          <Buttons
            text={
              moreDetails
                ? `${t("buyingRequestDetails.lessDetails")}`
                : `${t("buyingRequestDetails.moreDetails")}`
            }
            className={"btn-plain-txt"}
            onClick={() => setMoreDetails(!moreDetails)}
          ></Buttons>
        </div>
      </div>
    </div>
  );
};

export default BrDetailsCard;
