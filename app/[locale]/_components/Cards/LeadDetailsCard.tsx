"use client";
import React from "react";
import Typography from "../Base/Typography";
import { Accordion, AccordionTab } from "primereact/accordion";
import Image from "next/image";
import Buttons from "../Buttons/Buttons";
import { LeadsDetails } from "../../_interface/LeadsInterface";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { TotalOrderQuantity } from "@/app/[locale]/_interface/RfqInterface";
import { useTranslations } from "next-intl";

const LeadDetailsCard = ({
  previewData,
  totalOrderQuantity,
}: {
  previewData: LeadsDetails;
  totalOrderQuantity: TotalOrderQuantity;
}) => {
  const t = useTranslations("leads.viewPage.productDetails");

  return (
    <div className="lead-detail-card-comp">
      <Typography variant="h5" className="l-d-c-c-title">
        {t("leadDetails")}
      </Typography>
      <Typography variant="h6" className="l-d-c-c-sub-txt">
        {t("interestedProducts")}
      </Typography>
      <div className="lead-detail-accordion-block">
        <Accordion activeIndex={0} className="lead-detail-accrodion">
          {previewData.interestedProducts &&
            previewData.interestedProducts.length > 0 &&
            previewData.interestedProducts.map((product) => (
              <AccordionTab
                header={
                  <>
                    <div className="lead-product-info">
                      <div className="l-p-i-img">
                        {/* <Image
                          src={product.productImage[0].src}
                          width={52}
                          height={52}
                          alt="Product"
                        ></Image> */}
                        {product?.productImage?.length ? (
                          <Image
                            src={getImageUrl(product.productImage[0].src)}
                            width={52}
                            height={52}
                            alt="Product"
                            sizes="100vw"
                          />
                        ) : (
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              backgroundColor: "#eee",
                            }}
                          >
                            {/* fallback */}
                          </div>
                        )}
                      </div>
                      <div className="l-p-i-i-details">
                        <Typography variant="span" className="l-p-i-i-d-txt">
                          {product.productName}
                        </Typography>
                      </div>
                    </div>
                  </>
                }
                key={product.productId}
              >
                <div className="lead-details-group">
                  <div className="l-d-g-item">
                    <Typography variant="span" className="l-d-g-i-label">
                      {t("quantityRequired")}
                    </Typography>
                    <Typography variant="span" className="l-d-g-i-value">
                      {`${totalOrderQuantity?.orderedQuantity} ${totalOrderQuantity?.orderedUnit}`}
                    </Typography>
                  </div>
                  <div className="l-d-g-item">
                    <Typography variant="span" className="l-d-g-i-label">
                      {t("preferredPrice")}
                    </Typography>
                    <Typography variant="span" className="l-d-g-i-value">
                      {/* $10 - $20 */}
                      <PricePipe
                        pricing={product?.pricing ?? {}}
                        key={product._id}
                        currency={
                          product?.currency
                            ? typeof product?.currency === "string"
                              ? product?.currency
                              : product?.currency?.symbol
                            : "₹"
                        }
                      />
                    </Typography>
                  </div>
                  <div className="l-d-g-item">
                    <Typography variant="span" className="l-d-g-i-label">
                      {t("preferredDeliveryTimeline")}
                    </Typography>
                    <Typography variant="span" className="l-d-g-i-value">
                      (
                      {(product.productionLeadTime?.min_day ?? 0) +
                        (product.dispatchLeadTime?.min_day ?? 0)}
                      -
                      {(product.productionLeadTime?.max_day ?? 0) +
                        (product.dispatchLeadTime?.max_day ?? 0)}{" "}
                      {t("days")})
                    </Typography>
                  </div>
                </div>
              </AccordionTab>
            ))}
        </Accordion>
      </div>

      <Buttons  
        className={"btn-c-primary"}
        text={t("sendQuote")}
        onClick={() => {}}
      />
    </div>
  );
};

export default LeadDetailsCard;
