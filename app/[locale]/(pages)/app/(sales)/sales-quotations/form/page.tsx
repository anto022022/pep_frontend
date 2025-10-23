"use client"

import { ProductStageKey } from '@/app/[locale]/_models/StoreFront'
import { RootState, useAppSelector } from '@/app/[locale]/_store/store'
import BasicDetails from './(forms)/BasicDetails'

const Page = () => {
  const currentProductForm = useAppSelector((state: RootState) => state.stepperStatus.currentForm)

  const renderProductForm = () => {
    switch (currentProductForm) {
      case ProductStageKey.ProductInformation:
        return <BasicDetails />;
      //   case ProductStageKey.DescriptiveMedia:
      //     return <DescriptiveMedia/>;
      //   case ProductStageKey.AttributesBrochure:
      //     return <AttributsBrouchure/>;
      //   case ProductStageKey.DescriptionSpecification:
      //     return <DescriptiveSpecification/>;
      //   case ProductStageKey.AvailableOrigin:
      //     return <AvailabilityOrigin/>;
      //   case ProductStageKey.CapacityPricing:
      //     return <ProductCapacityPricing/>;
      //   case ProductStageKey.PaymentDelivery:
      //     return <PaymetDelivery/>;
      //   case ProductStageKey.ShippingDetails:
      //     return <ShippingPackagingDetails/>;
      //   case ProductStageKey.AdditionalDetails:
      //     return <AdditionalDetails/>;
      default:
        return <div>defaultPage</div>; // Default case
    }
  }
  return (
    <>{renderProductForm()}</>
  )
}

export default Page