"use client";

// ---------------------------------------------
// React
// ---------------------------------------------

// ---------------------------------------------
// Redux Store
// ---------------------------------------------
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";

// ---------------------------------------------
// Models
// ---------------------------------------------
import { FreeCatalogStageKey } from "@/app/[locale]/_models/StoreFront";

// ---------------------------------------------
// Local Components
// ---------------------------------------------
import Homepage from "./(forms)/Homepage";
import Products from "./(forms)/Products";

const Page = () => {
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const renderFreeCatalogForm = () => {
    switch (currentProductForm) {
      case FreeCatalogStageKey.homepage:
        return <Homepage />;
      case FreeCatalogStageKey.products:
        return <Products />;

      default:
        return <Homepage />;
    }
  };
  return <>{renderFreeCatalogForm()}</>;
};

export default Page;
