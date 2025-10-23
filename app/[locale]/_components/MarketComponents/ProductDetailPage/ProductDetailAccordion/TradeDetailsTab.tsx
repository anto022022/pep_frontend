"use client";
import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import { StockAvailabilityEnum } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import React from "react";
import styles from "@/assets/styles-modules/product-details.module.css"; // <-- CSS module

const TradeDetailsTab: React.FC<ProductDetailPageProps> = ({ productData }) => {
  const t = useTranslations("productDetailPage.tradeDetails");

  return (
    <div className="tabs-content spec-tab algn-start" id="tradeDetail">
      <div className="variants-table-responsive bulk-pricing-table-responsive full-wid">
        <table className="variants-table">
          <tbody>
            {/* Production Lead Time */}
            {(productData?.productionLeadTime?.max_day ?? 0) > 0 && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("productionLeadTime")}
                </td>
                <td className="txt-black">
                  {`${productData.productionLeadTime?.min_day ?? 0}-${
                    productData.productionLeadTime?.max_day ?? 0
                  }`}
                </td>
              </tr>
            )}

            {/* Stock Availability */}
            {productData?.stockAvailability && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("availableStock")}
                </td>
                <td className="txt-black">
                  {StockAvailabilityEnum[productData.stockAvailability]}
                </td>
              </tr>
            )}

            {/* Production Capacity */}
            {productData?.productionCapacity?.quantity && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("productionCapacity")}
                </td>
                <td className="txt-black">
                  {`${productData.productionCapacity.quantity} ${productData.productionCapacity.unit}/ ${productData.productionCapacity.duration}`}
                </td>
              </tr>
            )}

            {/* Sample Availability */}
            {productData?.samplesAvailability?.availabilityType && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("sampleAvailability")}
                </td>
                <td className="txt-black">
                  {productData.samplesAvailability.availabilityType ===
                  "noSample"
                    ? "No"
                    : `Yes - ${productData.samplesAvailability.availabilityType}`}
                </td>
              </tr>
            )}

            {/* Sample Pricing */}
            {productData?.samplesAvailability?.samplePrice && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("samplePricing")}
                </td>
                <td className="txt-black">
                  {`${productData.samplesAvailability.samplePrice}/${productData.samplesAvailability.sampleUnit}`}
                </td>
              </tr>
            )}

            {/* Sample Lead Time */}
            {(productData?.samplesAvailability?.sampleLeadTime?.max_day ?? 0) >
              0 && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("sampleLeadTime")}
                </td>
                <td className="txt-black">
                  {`${
                    productData.samplesAvailability?.sampleLeadTime?.min_day ??
                    0
                  }/${
                    productData.samplesAvailability?.sampleLeadTime?.max_day ??
                    0
                  }`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeDetailsTab;
