import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import {
  DropdownlistInterface,
  SalesProductListInterface,
  SalesProductListResponse,
} from "../../_interface/SalesProductInterface";
import { CommonResponseStructure } from "../../_interface/common";

const baseQuery = fetchBaseQuery({
  baseUrl: `${
    process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
  }sales`,
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

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["product", "product-group", "ai-category", "production-lead-time"],
  endpoints: (build) => {
    return {
      getProductsList: build.query<
        CommonResponseStructure<SalesProductListResponse>,
        SalesProductListInterface
      >({
        query: ({ sortBy, sortOrder, limit, page, searchQuery, itemStatus }) =>
          `/product/product-list?sort_by=${sortBy ?? ""}&order=${
            sortOrder ? sortOrder : ""
          }&search=${searchQuery ?? ""}&page=${page}&limit=${
            limit ?? 10
          }&status=${itemStatus}`,
        providesTags: ["product"],
      }),

      getProductDropdownList: build.query<any, DropdownlistInterface>({
        query: ({ page, searchQuery }) =>
          `/product/product-dropdown-list?search=${
            searchQuery ?? ""
          }&page=${page}`,
        providesTags: ["product"],
      }),
      getLiveProductDropdownList: build.query<any, DropdownlistInterface>({
        query: ({ page, searchQuery }) =>
          `/product/live-product-dropdown-list?search=${
            searchQuery ?? ""
          }&page=${page}`,
        providesTags: ["product"],
      }),
      getProductDetails: build.query<any, any>({
        query: (id) => `/product/get-product/${id}`,
        providesTags: ["product"],
      }),
      getCategoryAiSuggestions: build.query<
        CommonResponseStructure<any>,
        { product_name: string }
      >({
        query: ({ product_name }) => ({
          url: `/ai/get-ai-category-list`,
          method: "POST",
          body: { product_name },
        }),
        providesTags: ["ai-category"],
      }),
      getProductFormDetails: build.query<any, { id: string; stage?: string }>({
        query: ({ id, stage }) =>
          `/product/get-product-form/${id}?stage=${stage}`,
        providesTags: ["product"],
      }),
      getProductGroupList: build.query<any, any>({
        query: (filters) => {
          const queryString = new URLSearchParams(filters).toString();
          return `/product/get-product-group?${queryString}`;
        },
        providesTags: ["product-group"],
      }),
      getProductionLeadTimeList: build.query<any, void>({
        query: () => `product/get-production-lead-time`,
        providesTags: ["production-lead-time"],
      }),

      addProductionLeadTime: build.mutation<any, any>({
        query: (data) => ({
          url: "product/update-production-lead-time",
          method: "POST",
          body: data?.productionLeadTime,
        }),
      }),
      addProductGroup: build.mutation<any, any>({
        query: (data) => ({
          url: "/product/create-product-group",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["product-group"],
      }),
      getProductPreviewDetails: build.query<any, any>({
        query: (id) => `/product/product-preview/${id}`,
        providesTags: ["product"],
      }),
      addProductInformation: build.mutation<any, any>({
        query: (data) => ({
          url: "/product/product-information",
          method: "POST",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      addProductQuickInsert: build.mutation<any, any>({
        query: (data) => ({
          url: "/product/product-complete-quick-insert",
          method: "POST",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      getAiDescription: build.mutation<
        any,
        { url: string; body: any; skipCacheUpdate?: boolean }
      >({
        query: ({ url, body }) => ({
          url,
          method: "POST",
          body,
        }),
        invalidatesTags: [],
      }),
      updateProductInformation: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-information/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateDescriptiveMedia: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-descriptive-media/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateCapacityPricing: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-pricing-moq/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateDescriptionSpecification: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-description/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateAttributesVariants: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/specification/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateAvailabilityOrigin: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-production-stock/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updatePaymentDelivery: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-payment-terms/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateShippingDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-shipping-details/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateAdditionalDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/product/product-additional-details/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateProductVisibility: build.mutation<any, any>({
        query: (data) => ({
          url: `product/update-product-display/${data.id}`,
          method: "PATCH",
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
      updateProductArchive: build.mutation<any, any>({
        query: (data) => ({
          url: `product/product-archive`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["product"],
      }),
    };
  },
});

export const {
  useGetProductsListQuery,
  //useGetProductDropdownListQuery,
  useLazyGetProductDropdownListQuery,
  useLazyGetLiveProductDropdownListQuery,
  useGetProductDetailsQuery,
  useGetProductFormDetailsQuery,
  useGetProductGroupListQuery,
  useLazyGetCategoryAiSuggestionsQuery,
  useGetCategoryAiSuggestionsQuery,
  useAddProductGroupMutation,
  useAddProductInformationMutation,
  useAddProductQuickInsertMutation,
  useUpdateProductInformationMutation,
  useUpdateDescriptiveMediaMutation,
  useUpdateAttributesVariantsMutation,
  useUpdateDescriptionSpecificationMutation,
  useUpdateAvailabilityOriginMutation,
  useUpdateCapacityPricingMutation,
  useGetProductPreviewDetailsQuery,
  useUpdatePaymentDeliveryMutation,
  useUpdateShippingDetailsMutation,
  useUpdateAdditionalDetailsMutation,
  useGetAiDescriptionMutation,
  useUpdateProductVisibilityMutation,
  useUpdateProductArchiveMutation,
  useGetProductionLeadTimeListQuery,
  useAddProductionLeadTimeMutation,
} = productApi;
