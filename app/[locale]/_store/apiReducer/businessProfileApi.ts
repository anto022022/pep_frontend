import { brandingMediaFormValue } from "@/app/[locale]/_components/BusinessProfileComponents/BrandMedia/BrandMediaSection";
import { AdditionalSectionAPIFormat } from "@/app/[locale]/_components/BusinessProfileComponents/BusinessInformation/AdditionalSection";
import { CompanyDetailsInterface } from "@/app/[locale]/_components/BusinessProfileComponents/BusinessInformation/CompanyRegistrationDetailsSection";
import { AdditionalTradeDetails } from "@/app/[locale]/_components/BusinessProfileComponents/TradeInformation/AdditionalTradeDetailsSection";
import { Market } from "@/app/[locale]/_components/BusinessProfileComponents/TradeInformation/MarketLogisticsSection";
import { ShippingPayment } from "@/app/[locale]/_components/BusinessProfileComponents/TradeInformation/ShippingPaymentTermsSection";
import { useBaseQuery } from "@/app/[locale]/_hooks/usebaseQuery";
import {
  FactoryWarehouseAdditionalSectionInterface,
  FactoryWarehouseInterface,
} from "@/app/[locale]/_interface/BusinessProfile";
import { createApi } from "@reduxjs/toolkit/query/react";

export const businessProfileApi = createApi({
  reducerPath: "businessProfileApi",
  baseQuery: useBaseQuery,
  tagTypes: ["businessInformationData", "businessStageKey"],
  endpoints: (build) => {
    return {
      // common
      getBusinessInformation: build.query<any, { stage: string }>({
        query: ({ stage }) => ({
          url: `/business-profile/profile-form-details`,
          method: "GET",
          params: {
            stage: stage,
          },
        }),
        providesTags: ["businessInformationData"],
      }),
      getProfileStageStatus: build.query<any, void>({
        query: () => ({
          url: `/business-profile/profile-stage-status`,
          method: "GET",
        }),
        providesTags: ["businessStageKey"],
      }),
      // Business Information Start
      updateBusinessDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/business-profile/business-details`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      updateCompanyDetails: build.mutation<any, CompanyDetailsInterface>({
        query: (data) => ({
          url: `/business-profile/company-details`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      updateAdditionalDetails: build.mutation<any, AdditionalSectionAPIFormat>({
        query: (data) => ({
          url: `/business-profile/business-additional`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      // Business Information Start
      // Branding and media
      updateBrandingMedia: build.mutation<any, brandingMediaFormValue>({
        query: (data) => ({
          url: `/business-profile/branding-media`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      //Trade Info Start
      updateMarketLogistics: build.mutation<any, Market>({
        query: (data) => ({
          url: `/business-profile/market-logistics`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      updateShippingPaymentTerms: build.mutation<any, ShippingPayment>({
        query: (data) => ({
          url: `business-profile/shipping-payment`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      updateTradeAdditionalDetails: build.mutation<any, AdditionalTradeDetails>(
        {
          query: (data) => ({
            url: `business-profile/profile-additionalDetails`,
            method: "PATCH",
            body: data,
          }),
          invalidatesTags: ["businessInformationData", "businessStageKey"],
        }
      ),
      // Trade Info End

      //Factory & Warehouse Details Start
      updateFactoryWarehouseDetails: build.mutation<
        any,
        FactoryWarehouseInterface
      >({
        query: (data) => ({
          url: `/business-profile/factory-warehouse`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      updateAdditionalInformation: build.mutation<
        any,
        FactoryWarehouseAdditionalSectionInterface
      >({
        query: (data) => ({
          url: `/business-profile/factory-warehouse-additional`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["businessInformationData", "businessStageKey"],
      }),
      //Factory & Warehouse Details End

      //easy step guid
      getEasyStep: build.query<any, void>({
        query: () => ({
          url: `/catalog/catalog-status`,
          method: "GET",
        }),
      }),
    };
  },
});

export const {
  useGetBusinessInformationQuery,
  useGetProfileStageStatusQuery,
  useUpdateBusinessDetailsMutation,
  useUpdateBrandingMediaMutation,
  useUpdateMarketLogisticsMutation,
  useUpdateShippingPaymentTermsMutation,
  useUpdateTradeAdditionalDetailsMutation,
  useUpdateCompanyDetailsMutation,
  useUpdateFactoryWarehouseDetailsMutation,
  useUpdateAdditionalDetailsMutation,
  useUpdateAdditionalInformationMutation,
  useGetEasyStepQuery,
} = businessProfileApi;
