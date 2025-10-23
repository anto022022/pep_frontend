"use client";

import BreadCrumbs from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import ProductDetailCard from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailCard";

import ProductDetailGallerySlider from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailGallerySlider";

import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  BreadcrumbItemWithRef,
  updateBreadcrumbTrail,
} from "@/app/[locale]/_utility/breadcrumbTrail";

import { FAQComponent } from "@/app/[locale]/_components/MarketComponents/FAQComponent";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import ProductInformation from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductInformation";

import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import MobileMetaSetter from "@/app/[locale]/_components/Common/MobileMetaSetter";
import SimilarProducts from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/SimilarProducts";
import SupplierProducts from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/SupplierProducts";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import { useLoginRedirect } from "@/app/[locale]/_hooks/useLoginRedirect";
import { useAvailableVariantsWithAttributeCounts } from "@/app/[locale]/_hooks/useVariantAttributes";
import {
  countryCodesInterface,
  IndustryInterface,
  NamedImage,
} from "@/app/[locale]/_interface/BusinessProfile";
import {
  Country,
  ProductImage,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";
import {
  useGetProductDetailByIdQuery,
  useUpdateProductViewMutation,
} from "@/app/[locale]/_store/apiReducer/marketApi";
import {
  setIsReqQuoteShow,
  setSelectVariantSidebarOpen,
} from "@/app/[locale]/_store/reducers/requestQuote_slice";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { getMetaFromBreadcrumbs } from "@/app/[locale]/_utility/getMetaFromBreadcrumbs ";
import { useLocale, useTranslations } from "next-intl";


export interface ProductDetailPageIdProps {
  id: string;
}

export interface UserInfoAddition {
  userInfo: any;
  shippingFee?: number;
}

export interface BusinessInfoDetail {
  businessInfo: {
    years: number;
    subDomain: string;
    isCatalogPublished: boolean;
    companyLogo: ProductImage;
    kycVerified: boolean;
    kybVerification: boolean;
    uboVerification: boolean;
    businessLocation: Country;
    businessName: string;
    businessAddress: {
      addressLine: string;
      city: string;
      state: string;
      pincode: string;
      country: countryCodesInterface;
    };
    businessTypeSpecific: string[];
    industry: IndustryInterface;
    certificates: NamedImage[];
    mainMarkets: CountryOfOrigin[];
    noOfProductionLines: number;
    noOfQcStaff: number;
    noOfRdStaff: number;
    totalFactorySize: string;
    annualProductionCapacity: {
      product?: string;
      quantity?: number;
      unit?: string;
    }[];
    contractManufacturing: string[];
    annualTurnover: string;
  };
}
export interface ProductDetailPageProps {
  productData: PreviewData & UserInfoAddition & BusinessInfoDetail;
}
const ProductDetailPage: React.FC<ProductDetailPageIdProps> = ({ id }) => {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const locale = useLocale();

  const [updateProductView] = useUpdateProductViewMutation();
  const currencyCode = useAppSelector((state) => state.location.currency);
  const dispatch = useAppDispatch();
  const t = useTranslations("productDetailPage");

  const { data, isLoading, isError, isSuccess } = useGetProductDetailByIdQuery(
    { productId: id, currencyCode: currencyCode ?? "" },
    {
      skip: !id || !currencyCode,
    }
  );

  const productData = data?.data || null;

  const [breadCrumpData, setBreadCrumpData] = useState<BreadcrumbItemWithRef[]>(
    []
  );
  const [contactSupplier, setContactSupplier] = useState(false);
  const [refQuery, setRefQuery] = useState<string | undefined>(undefined);
  const { availableAttributes } = useAvailableVariantsWithAttributeCounts(
    productData?.variants ?? []
  );
  const login = useLoginRedirect();
  const [userSessionDialog, setUserSessionDialog] = useState(false);

  const handleReqQuote = () => {
    if (availableAttributes.length === 0) {
      dispatch(setIsReqQuoteShow(true));
    } else {
      dispatch(setSelectVariantSidebarOpen(true));
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    checkUserSessionAndRedirect({
      authenticated: () => handleReqQuote(),
      onUnauthenticated: () => setUserSessionDialog(true),
    });
  };

  const handleSupplierContact = () => {
    if (productData?.businessInfo?.isCatalogPublished) {
      window.open(`/en/${productData?.businessInfo?.subDomain}`, "_blank");
    } else {
      setContactSupplier(true);
    }
  };

  useEffect(() => {
    if (!productData) return;
    const ref = searchParams.get("ref") ?? undefined;
    setRefQuery(ref);
    const { breadCrumpData } = updateBreadcrumbTrail(
      searchParams.get("ref") ?? undefined,
      {
        type: "detail",
        name: productData?.productName ?? "Product Name",
        path: `../products/${productData?.productName}`,
      }
    );
    setBreadCrumpData(breadCrumpData);
  }, [searchParams, productData]);

  useEffect(() => {
    if (productData?.uniqueId) {
      updateProductView({ id: productData?.uniqueId });
    }
  }, [productData]);


  useEffect(() => {
    if (!isLoading && isSuccess && Array.isArray(data?.data) && data?.data.length === 0) {
      redirect(`/${locale}/404`);
    }
  }, [data?.data, isLoading, isSuccess, locale]);

  if (isLoading) return <div style={{ height: "100vh" }}>Loading...</div>;
  if (isError || !productData)
    return <div style={{ height: "100vh" }}>Failed to load product.</div>;

  return (
    <>
      <div className="p-l-m-t-body">
        <div className="page-wrapper">
          <div className="p-w-main page-container product-detail-main">
            {/* Use getMetaFromBreadcrumbs for mobile meta */}
            {breadCrumpData.length > 0 && (
              <MobileMetaSetter {...getMetaFromBreadcrumbs(breadCrumpData)} />
            )}
            <BreadCrumbs data={breadCrumpData} />
            <div className="section-block-group s-b-g-split">
              <div className="s-b-g-left">
                <section className="section-block">
                  <ProductDetailGallerySlider productData={productData} />
                </section>

                {!isMobile && (
                  <>
                    <SimilarProducts
                      productData={productData}
                      refQuery={refQuery ?? ""}
                      productId={id}
                    />
                  </>
                )}

                {isMobile && (
                  <div className="product-detail-mob">
                    <ProductDetailCard productData={productData} />
                  </div>
                )}

                <ProductInformation productData={productData} />
                {/* FAQ component */}
                {productData?.faqs && <FAQComponent faqs={productData.faqs} />}
              </div>
              {!isMobile && (
                <div className="s-b-g-right">
                  <div className="product-detail-card-sticky">
                    <ProductDetailCard productData={productData} />
                  </div>
                </div>
              )}
            </div>
            {!isMobile && (
              <>
                <SupplierProducts
                  productData={productData}
                  refQuery={refQuery ?? ""}
                  productId={id}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {isMobile && (
        <>
          <div className="p-l-m-footer">
            <div className="mob-filter-nav">
              <div className="product-detail-footer">
                <div className="button-group-block">
                  <Buttons
                    onClick={handleSupplierContact}
                    className="btn-outline bg-outline-dark"
                    text={t("productDetailCard.contactSupplier")}
                  />

                  <Buttons
                    className={"btn-c-primary"}
                    text={t("productDetailCard.requestQuote")}
                    onClick={handleClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <AlertDialog
            visible={userSessionDialog}
            subTxt="You have to Login to Quote"
            continueOnclick={() => {
              setUserSessionDialog(false);
              login();
              setTimeout(() => {
                if (availableAttributes.length === 0) {
                  dispatch(setIsReqQuoteShow(true));
                  return;
                } else {
                  dispatch(setSelectVariantSidebarOpen(true));
                }
              }, 1000);
            }}
            cancelOnclick={() => {
              setUserSessionDialog(false);
            }}
          />
          <AlertDialog
            visible={contactSupplier}
            subTxt="Catalog of Supplier is not Published Yet"
            continueOnclick={() => {
              setContactSupplier(false);
            }}
          />
        </>
      )}
      {/* <AllReviewsSidebar />
      <SelectVariantsSidebar />
      <AddReviewDialog /> */}
    </>
  );
};

export default ProductDetailPage;
