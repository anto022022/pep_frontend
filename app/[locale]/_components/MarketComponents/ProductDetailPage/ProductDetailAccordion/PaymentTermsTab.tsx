import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import PaymentTermsPipe from "@/app/[locale]/_components/Pipe/PaymentTermsPipe";
import { useTranslations } from "next-intl";
import React from "react";

const PaymentTermsTab: React.FC<ProductDetailPageProps> = ({ productData }) => {
  const t = useTranslations("productDetailPage.paymentTerms");

  return (
    <div className="tabs-content spec-tab algn-start" id="paymentTerms">
      <div className="variants-table-responsive bulk-pricing-table-responsive full-wid">
        <table className="variants-table">
          <tbody>
            {/* Payment Terms */}
            {productData?.paymentTerms && (
              <tr>
                <td style={{ width: "220px" }}>{t("paymentTerms")}</td>
                <td>
                  <ul className="ul-dots">
                    <li key={0}>
                      <PaymentTermsPipe value={productData.paymentTerms} />
                    </li>
                  </ul>
                </td>
              </tr>
            )}

            {/* Payment Methods */}
            {(productData?.paymentMethods?.length ?? 0) > 0 && (
              <tr>
                <td className="vertical-top">{t("paymentMethods")}</td>
                <td>
                  <ul className="ul-dots">
                    {productData.paymentMethods?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTermsTab;
