import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import { CommonResponseStructure } from "../../_interface/common";
import { SalesProductListInterface } from "../../_interface/SalesProductInterface";
import { SalesOffersListResponse } from "../../_interface/SellOfferInterface";

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

export const sellOfferApi = createApi({
  reducerPath: "sellOfferApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["productSellOffer"],
  endpoints: (build) => {
    return {
      getOffersList: build.query<
        CommonResponseStructure<SalesOffersListResponse>,
        SalesProductListInterface
      >({
        query: ({ sortBy, sortOrder, limit, page, searchQuery, itemStatus }) =>
          `/sell-offer/offer-list?sort_by=${sortBy ?? ""}&order=${
            sortOrder ? sortOrder : ""
          }&search=${searchQuery ?? ""}&page=${page}&limit=${
            limit ?? 10
          }&status=${itemStatus}`,
        providesTags: ["productSellOffer"],
      }),
      getOfferPreviewDetails: build.query<any, any>({
        query: (id) => `/sell-offer/preview/${id}`,
        providesTags: ["productSellOffer"],
      }),
      getPricingDetailOfOffer: build.query<any, any>({
        query: (id) => `/sell-offer/offer-product-pricing/${id}`,
        providesTags: ["productSellOffer"],
      }),
      getShippingDetailsOfOffer: build.query<any, any>({
        query: (id) => `/sell-offer/offer-product-shipping-details/${id}`,
        providesTags: ["productSellOffer"],
      }),
      updatePaymentShipping: build.mutation<any, any>({
        query: (data) => ({
          url: `/sell-offer/shipping-details/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["productSellOffer"],
      }),
      updateOfferDetails: build.mutation<any, any>({
        query: (data) => ({
          url: `/sell-offer/offer-details/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["productSellOffer"],
      }),
      getSellOfferPreviewDetails: build.query<any, any>({
        query: (id) => `/sell-offer/preview/${id}`,
        providesTags: ["productSellOffer"],
      }),
      getOfferFormDetails: build.query<any, { id: string; stage?: string }>({
        query: ({ id, stage }) =>
          `/sell-offer/get-offer-form/${id}?stage=${stage}`,
        providesTags: ["productSellOffer"],
      }),
      addCreateOffer: build.mutation<any, any>({
        query: (data) => ({
          url: "sell-offer/create-offer",
          method: "POST",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["productSellOffer"],
      }),
      updateOfferArchive: build.mutation<any, any>({
        query: (data) => ({
          url: `sell-offer/offer-archive`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["productSellOffer"],
      }),
      addOfferDuplicate: build.mutation<any, any>({
        query: (id) => ({
          url: `sell-offer/duplicate-offer/${id}`,
          method: "POST",
          body: {},
        }),
        invalidatesTags: ["productSellOffer"],
      }),
      updateOfferVisibility: build.mutation<any, any>({
        query: (data) => ({
          url: `sell-offer/update-offer-display/${data.id}`,
          method: "PATCH",
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["productSellOffer"],
      }),
    };
  },
});

export const {
  useGetOffersListQuery,
  useGetOfferPreviewDetailsQuery,
  useGetPricingDetailOfOfferQuery,
  useGetShippingDetailsOfOfferQuery,
  useUpdatePaymentShippingMutation,
  useUpdateOfferDetailsMutation,
  useGetOfferFormDetailsQuery,
  useAddCreateOfferMutation,
  useAddOfferDuplicateMutation,
  useUpdateOfferArchiveMutation,
  useUpdateOfferVisibilityMutation,
} = sellOfferApi;
