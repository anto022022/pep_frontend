"use client";

import BrandingMedia from "@/app/[locale]/(pages)/app/business-profile/(form)/BrandingMedia";
import BusinessInformation from "@/app/[locale]/(pages)/app/business-profile/(form)/BusinessInformation";
import FactoryWarehouseDetails from "@/app/[locale]/(pages)/app/business-profile/(form)/FactoryWarehouseDetails";
import TradeInformation from "@/app/[locale]/(pages)/app/business-profile/(form)/TradeInformation";
import EasyGuide from "@/app/[locale]/_components/BusinessProfileComponents/EasyGuide";
import KybAndKycVerificationDialog from "@/app/[locale]/_components/dialog/KybAndKycVerification";
import {
  BrandingAndMedia,
  BusinessInformationIcon,
  FactoryWarehouseIcon,
  ProductInfoIcon,
  TradeInformationIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import { useGetEasyStepQuery } from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { useGetDashboardCardDetailsQuery } from "@/app/[locale]/_store/apiReducer/commonApi";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { JSX, useEffect, useState } from "react";

export const formIconMap: Record<string, JSX.Element> = {
  BusinessDetails: <BusinessInformationIcon />,
  CompanyRegistrationDetails: <BusinessInformationIcon />,
  Additional: <BusinessInformationIcon />,
  BrandingMedia: <BrandingAndMedia />,
  MarketLogistics: <TradeInformationIcon />,
  ShippingPaymentTerms: <TradeInformationIcon />,
  AdditionalTradeDetails: <TradeInformationIcon />,
  FactoryWarehouseDetails: <FactoryWarehouseIcon />,
};

const page = () => {
  const currentBusinessForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );
  const isMobile = useIsMobile();
  const businessProfileT = useTranslations("businessProfile");

  const [showKycDialog, setShowKycDialog] = useState<boolean>(false);

  const { data: easyInfo, refetch } = useGetEasyStepQuery();
  const { data: dashboardDetails, refetch: dashboardDetailsRefetch } = useGetDashboardCardDetailsQuery();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    dashboardDetailsRefetch();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowKycDialog(true);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const formTitles: Record<string, string> = {
    BusinessDetails: businessProfileT("businessInformation.businessDetails.title"),
    CompanyRegistrationDetails: businessProfileT("businessProfileStepper.companyRegistrationDetails"),
    BrandingMedia: businessProfileT("businessProfileStepper.brandingAndMedia.title"),
    MarketLogistics: businessProfileT("tradeAdditional.market"),
    ShippingPaymentTerms: businessProfileT("tradeAdditional.shipping"),
    AdditionalTradeDetails: "Additional Trade Details",
    FactoryWarehouseDetails: businessProfileT("businessProfileStepper.factoryWarehouseDetails.title"),
  };

  const renderBusinessForm = () => {
    if (
      currentBusinessForm === BusinessProfileStageKey.BusinessDetails ||
      currentBusinessForm ===
      BusinessProfileStageKey.CompanyRegistrationDetails ||
      currentBusinessForm === BusinessProfileStageKey.Additional
    ) {
      return <BusinessInformation />;
    }
    if (currentBusinessForm === BusinessProfileStageKey.BrandingMedia) {
      return <BrandingMedia />;
    }

    if (
      currentBusinessForm === BusinessProfileStageKey.MarketLogistics ||
      currentBusinessForm === BusinessProfileStageKey.ShippingPaymentTerms ||
      currentBusinessForm === BusinessProfileStageKey.AdditionalTradeDetails
    ) {
      return <TradeInformation />;
    }
    if (
      currentBusinessForm === BusinessProfileStageKey.FactoryWarehouseDetails
    ) {
      return <FactoryWarehouseDetails />;
    }
    return <BusinessInformation />;
  };
  return (
    <>
      {!isMobile ? (
        <>
          <div className="t-c-l-c-head">
            <FormTitle
              variant={"h1"}
              text={formTitles[currentBusinessForm] || currentBusinessForm}
            >
              {formIconMap[currentBusinessForm] ?? <ProductInfoIcon />}
            </FormTitle>
          </div>
          <div className="t-c-l-c-body">
            <div className="t-c-l-c-left">{renderBusinessForm()}</div>
            <div className="t-c-l-c-right align-s-end">
              <EasyGuide />
            </div>
          </div>
        </>
      ) : (
        <>{renderBusinessForm()}</>
      )}
      {showKycDialog && (dashboardDetails?.data?.userType === 'buyer' && !easyInfo?.data?.isKYCCompleted) && (
        <KybAndKycVerificationDialog
          visible={true}
          onClose={() => setShowKycDialog(false)}
          verificationData={easyInfo?.data}
        />
      )}
      {showKycDialog &&
        ((dashboardDetails?.data?.userType === 'both' || dashboardDetails?.data?.userType === 'seller') &&
          (!easyInfo?.data?.isKYCCompleted || !easyInfo?.data?.isKYBCompleted)) && (
          <KybAndKycVerificationDialog
            visible={true}
            onClose={() => setShowKycDialog(false)}
            verificationData={easyInfo?.data}
          />
        )}

      {/* Buyer */}
      {isMobile && showKycDialog && (dashboardDetails?.data?.userType === 'buyer' && !easyInfo?.data?.isKYCCompleted)
        && (
          <KybAndKycVerificationDialog
            visible={true}
            onClose={() => setShowKycDialog(false)}
            verificationData={easyInfo?.data}
          />
        )}
      {/* Seller and Both */}
      {isMobile && showKycDialog && ((dashboardDetails?.data?.userType === 'both' || dashboardDetails?.data?.userType === 'seller') &&
        (!easyInfo?.data?.isKYCCompleted || !easyInfo?.data?.isKYBCompleted))
        && (
          <KybAndKycVerificationDialog
            visible={true}
            onClose={() => setShowKycDialog(false)}
            verificationData={easyInfo?.data}
          />
        )}
    </>
  );
};

export default page;
