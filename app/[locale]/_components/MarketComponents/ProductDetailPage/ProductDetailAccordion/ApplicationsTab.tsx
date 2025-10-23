import { ProductDetailPageProps } from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import React from "react";

const ApplicationsTab: React.FC<ProductDetailPageProps> = ({ productData }) => {
 return productData?.productApplications ? (
  <pre className="tabs-content spec-tab algn-start" id="applications">
    {productData.productApplications}
  </pre>
) : (
  <pre className="tabs-content spec-tab algn-start" id="applications">
    No Application Available
  </pre>
);
};

export default ApplicationsTab;
