import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import { useTranslations } from "next-intl";
import React from "react";

const ShippingLogisticsTab: React.FC<ProductDetailPageProps> = ({
  productData,
}) => {
  const t = useTranslations("productDetailPage.shipping");
  const shippingMethods = productData?.shippingMethod || [];
  return (
    <div className="tabs-content spec-tab algn-start" id="shippingLogistics">
      <div className="variants-table-responsive bulk-pricing-table-responsive full-wid">
        <table className="variants-table">
          <tbody>
            <tr>
              <td style={{ width: "220px" }}>{t("shippingInternationally")}</td>
              <td className="txt-black">
                {productData?.internationalShipping ? "Yes" : "No"}
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="vertical-top">{t("methods")}</td>
              <td>
                {shippingMethods?.length > 0 ? (
                  <ul className="ul-dots">
                    {shippingMethods.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  "--"
                )}
              </td>
            </tr>
            <tr>
              <td className="vertical-top">{t("incoTerms")}</td>
              <td>
                {productData?.incoTerms ? (
                  <ul className="ul-dots">
                    <li>{productData?.incoTerms ?? "--"}</li>
                  </ul>
                ) : (
                  "--"
                )}
              </td>
              <td></td>
            </tr>
            <tr>
              <td>{t("portOfDispatch")}</td>
              <td className="txt-black">
                {productData?.portOfDispatch ?? "--"}
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="vertical-top">{t("packagingType")}</td>
              <td>
                {productData?.shippingUnit ? (
                  <ul className="ul-dots">
                    <li>{productData?.shippingUnit ?? "--"}</li>
                  </ul>
                ) : (
                  "--"
                )}
              </td>
            </tr>
            <tr>
              <td>{t("unitsPerPackage")}</td>
              <td className="txt-black">{productData?.shippingQty ?? "--"}</td>
              <td></td>
            </tr>
            <tr>
              <td>{t("barcode")}</td>
              <td className="txt-black">
                {productData?.shipmentIdentifier
                  ? `${productData?.shipmentIdentifier} `
                  : "--"}
              </td>
              <td></td>
            </tr>
            <tr>
              <td>{t("dispatchLeadTime")}</td>
              <td className="txt-black">
                {productData?.productionLeadTime?.max_day
                  ? ` ${productData?.productionLeadTime?.min_day}-${productData?.productionLeadTime?.max_day} Days`
                  : "--"}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingLogisticsTab;
