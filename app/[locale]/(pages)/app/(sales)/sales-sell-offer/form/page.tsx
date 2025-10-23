"use client"

import { ProductOfferKey } from '@/app/[locale]/_models/StoreFront';
import { RootState, useAppSelector } from '@/app/[locale]/_store/store';
import OfferDetails from './(forms)/OfferDetails';
import PaymentShipping from './(forms)/PaymentShipping';
import ProductDetails from './(forms)/ProductDetails';


const page = () => {

  const currentSellOfferForm = useAppSelector((state: RootState) => state.stepperStatus.currentForm)
  const renderSellOfferForm = () => {
    switch (currentSellOfferForm) {
      case ProductOfferKey.ProductDetails:
        return <ProductDetails />;
      case ProductOfferKey.OfferDetails:
        return <OfferDetails />;
      case ProductOfferKey.PaymentShipping:
        return <PaymentShipping />;
      default:
        return <ProductDetails />; // Default case
    }
  }

  return (
    <>{renderSellOfferForm()}</>
  )
}

export default page