"use client";

import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import AdditionalDetails from "./(forms)/AdditionalDetails";
import AttributesVariants from "./(forms)/AttributesVariants";
import DescriptiveSpecification from "./(forms)/DescriptiveSpecification";
import PaymetDelivery from "./(forms)/PaymetDelivery";
import ProductCapacityPricing from "./(forms)/Pricing";
import ProductInformation from "./(forms)/ProductInformation";
import ProductionAndStock from "./(forms)/ProductionAndStock";
import ShippingPackagingDetails from "./(forms)/ShippingPackagingDetails";

const Page = () => {
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );

  const renderProductForm = () => {
    switch (currentProductForm) {
      case ProductStageKey.ProductInformation:
        return <ProductInformation />;
      case ProductStageKey.PricingAndMoq:
        return <ProductCapacityPricing />;
      case ProductStageKey.ProductDescription:
        return <DescriptiveSpecification />;
      case ProductStageKey.Specification:
        return <AttributesVariants />;
      case ProductStageKey.ProductionAndStock:
        return <ProductionAndStock />;
      case ProductStageKey.PaymentTerms:
        return <PaymetDelivery />;
      case ProductStageKey.ShippingDetails:
        return <ShippingPackagingDetails />;
      case ProductStageKey.AdditionalDetails:
        return <AdditionalDetails />;
      default:
        return <ProductInformation />; // Default case
    }
  };
  return <>{renderProductForm()}</>;
};

export default Page;
