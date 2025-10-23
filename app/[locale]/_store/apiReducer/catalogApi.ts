/**
 * @file catalogApi.ts
 * @description Redux Toolkit API slice for catalog-related endpoints.
 * @created  04-07-2025
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import { CommonResponseStructure } from "../../_interface/common";
import {
  SalesProductListInterface,
  SalesProductListResponse,
} from "../../_interface/SalesProductInterface";
const baseQuery = fetchBaseQuery({
  baseUrl: `${
    process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
  }`,
  prepareHeaders: (headers: any) => {
    const cookies = useCookies();
    const token = cookies.getCookie("userSession");

    if (token) {
      headers.set("userSession", token);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    // refresh token logic
  }
  return result;
};

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "All_Products",
    "Product_Groups",
    "Business_Details",
    "Catalog_Details",
    "Catalog_Form_Details",
    "Catalog_Stage",
    "Catalog_Product",
    "Catalog_Subdomain",
    "Catalog enquiry",
    "Other_Suppliers",
  ],
  endpoints: (build) => ({
    // Query
    getCatalogFormDetails: build.query<any, { stage?: string }>({
      query: ({ stage }) => ({
        url: `/catalog/catalog-form-details?stage=${stage}`,
        method: "GET",
      }),
      providesTags: ["Catalog_Form_Details"],
    }),
    getCatalogFormStepStatus: build.query<any, void>({
      query: () => ({
        url: `/catalog/catalog-stage-status`,
        method: "GET",
      }),
      providesTags: ["Catalog_Stage"],
    }),
    getCatalogDetails: build.query<any, void>({
      query: () => ({
        url: `/catalog/catalog-details`,
        method: "GET",
      }),
      providesTags: ["Catalog_Details"],
    }),
    getCatalogStageStatus: build.query<any, void>({
      query: () => ({
        url: `/catalog/catalog-status`,
        method: "GET",
      }),
      providesTags: ["Catalog_Stage"],
    }),
    getCatalogDetailsWithDomain: build.query<any, { subDomain?: string }>({
      query: ({ subDomain }) => ({
        url: `/catalog/catalog-data?subdomain=${subDomain}`,
        method: "GET",
      }),
      providesTags: ["Catalog_Details"],
    }),
    getBusinessDetails: build.query<any, void>({
      query: () => ({
        url: `/sales/catalog/business-details`,
        method: "GET",
      }),
      providesTags: ["Business_Details"],
    }),

    getBusinessDetailsPublic: build.query<any, { subdomain: string }>({
      query: ({ subdomain }) => ({
        url: `/sales/catalog/business-details-subdomain?subdomain=${subdomain}`,
        method: "GET",
      }),
      providesTags: ["Business_Details"],
    }),
    getAllProductsList: build.query<
      CommonResponseStructure<SalesProductListResponse>,
      SalesProductListInterface
    >({
      query: ({ sortBy, sortOrder, limit, page, searchQuery, itemStatus }) =>
        `/catalog/product-list?sort_by=${sortBy ?? ""}&order=${
          sortOrder ? sortOrder : ""
        }&search=${searchQuery ?? ""}&page=${page}&limit=${
          limit ?? 10
        }&status=${itemStatus}`,
      providesTags: ["All_Products"],
    }),
    getCatalogProductsList: build.query<
      CommonResponseStructure<SalesProductListResponse>,
      SalesProductListInterface
    >({
      query: ({ sortBy, sortOrder, limit, page, searchQuery, itemStatus }) =>
        `/sales/catalog/catalog-product-list?sort_by=${sortBy ?? ""}&order=${
          sortOrder ? sortOrder : ""
        }&search=${searchQuery ?? ""}&page=${page}&limit=${
          limit ?? 10
        }&status=${itemStatus}`,
      providesTags: ["Catalog_Product"],
    }),
    getCatalogProductsListPublic: build.query<
      CommonResponseStructure<SalesProductListResponse>,
      any
    >({
      query: ({
        sortBy,
        sortOrder,
        limit,
        page,
        searchQuery,
        itemStatus,
        subdomain,
        groupId,
      }) =>
        `/sales/catalog/catalog-product-list-public?sort_by=${
          sortBy ?? ""
        }&order=${sortOrder ? sortOrder : ""}&search=${
          searchQuery ?? ""
        }&page=${page}&limit=${
          limit ?? 10
        }&status=${itemStatus}&subdomain=${subdomain}&&groupId=${
          groupId ?? ""
        }`,
      providesTags: ["Catalog_Product"],
    }),
    getProductGroupBySubdomain: build.query<any, { subDomain: string }>({
      query: ({ subDomain }) => ({
        url: `/catalog/product-groups?subdomain=${subDomain}`,
        method: "GET",
      }),
      providesTags: ["Product_Groups"],
    }),
    getOtherSuppliersBySubdomain: build.query<
      any,
      { subDomain: string; page: number; limit: number }
    >({
      query: ({ subDomain, page, limit }) => ({
        url: `/catalog/other-suppliers?subdomain=${subDomain}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Other_Suppliers"],
    }),
    getSubdomain: build.query<any, void>({
      query: () => ({
        url: `/catalog/catalog-subdomain`,
        method: "GET",
      }),
      providesTags: ["Catalog_Subdomain"],
    }),
    // Mutation
    createEnquiryForm: build.mutation<any, any>({
      query: ({ payload, id }) => ({
        url: `catalog/create-enquiry?id=${id}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Catalog enquiry"],
    }),
    createNewCatalogForm: build.mutation<any, any>({
      query: ({ payload, stage }) => ({
        url: `/catalog/create?stage=${stage}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Catalog_Form_Details", "Catalog_Stage"],
    }),
    updateCatalogForm: build.mutation<any, any>({
      query: ({ payload, stage }) => ({
        url: `/catalog/update?stage=${stage}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Catalog_Form_Details", "Catalog_Stage"],
    }),

    updatCatalogSelection: build.mutation<any, any>({
      query: (data) => ({
        url: `sales/catalog/update-product-catalog-show/${data.id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
        skipCacheUpdate ? [] : ["Catalog_Product", "All_Products"],
    }),
    updateCatalogDomain: build.mutation<any, any>({
      query: (payload) => ({
        url: `/catalog/update-subdomain`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Catalog_Subdomain"],
    }),
    updateCatalogImpressions: build.mutation<any, any>({
      query: ({ subdomain }) => ({
        url: `/catalog/catalog-impression?subdomain=${subdomain}`,
        method: "PATCH",
        body: {},
      }),
      // invalidatesTags: [],
    }),
  }),
});

export const {
  // Query
  useGetCatalogFormDetailsQuery,
  useGetCatalogFormStepStatusQuery,
  useGetBusinessDetailsQuery,
  useGetBusinessDetailsPublicQuery,
  useGetCatalogDetailsQuery,
  useGetCatalogDetailsWithDomainQuery,
  useGetAllProductsListQuery,
  useGetCatalogProductsListQuery,
  useGetCatalogProductsListPublicQuery,
  useGetProductGroupBySubdomainQuery,
  useGetOtherSuppliersBySubdomainQuery,
  useGetSubdomainQuery,
  // Mutation
  useCreateNewCatalogFormMutation,
  useUpdateCatalogFormMutation,
  useUpdatCatalogSelectionMutation,
  useUpdateCatalogDomainMutation,
  useGetCatalogStageStatusQuery,
  useCreateEnquiryFormMutation,
  useUpdateCatalogImpressionsMutation,
} = catalogApi;
