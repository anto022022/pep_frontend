import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import { useTranslations } from "next-intl";
import React from "react";
import styles from "@/assets/styles-modules/product-details.module.css"; // <-- import CSS module

const SpecificationTab: React.FC<ProductDetailPageProps> = ({
  productData,
}) => {
  const t = useTranslations("productDetailPage.specification");
  const attributes = productData?.attributes || [];

  return (
    <div className="tabs-content spec-tab algn-start" id="specifications">
      {/* Attributes Table */}
      {attributes.length > 0 && (
        <div className="variants-table-responsive bulk-pricing-table-responsive full-wid">
          <table className="variants-table">
            <thead>
              <tr>
                <th colSpan={2}>{t("key")}</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((item, index) =>
                item?.key && item?.values?.length > 0 ? (
                  <tr key={index}>
                    <td className={styles.variantsTableLabel}>{item.key}</td>
                    <td className="txt-black">
                      {item.values.map((val, valIndex) => (
                        <span key={valIndex}>
                          {val?.name}
                          {valIndex < item.values.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Additional Information Table */}
      <div className="variants-table-responsive bulk-pricing-table-responsive full-wid">
        <table className="variants-table">
          <thead>
            <tr>
              <th colSpan={2}>{t("additionalInformation.label")}</th>
            </tr>
          </thead>
          <tbody>
            {productData?.brandName && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("additionalInformation.brand")}
                </td>
                <td className="txt-black">{productData.brandName}</td>
              </tr>
            )}

            {productData?.skuCode && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("additionalInformation.sku")}
                </td>
                <td className="txt-black">{productData.skuCode}</td>
              </tr>
            )}

            {(productData?.countryOfOrigin as { name?: string })?.name && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("additionalInformation.countryOfOrigin")}
                </td>
                <td className="txt-black">
                  {(productData.countryOfOrigin as { name?: string }).name}
                </td>
              </tr>
            )}

            {productData?.isCustomizable !== undefined && (
              <tr>
                <td className={styles.variantsTableLabel}>
                  {t("additionalInformation.customisable")}
                </td>
                <td className="txt-black">
                  {productData.isCustomizable ? "YES" : "No"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationTab;
