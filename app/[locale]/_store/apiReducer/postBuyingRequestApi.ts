import { encodeQuery } from "@/app/[locale]/_hooks/utility";
import { MarketApiQueryInterface } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
//import { useBaseQuery } from "@/app/[locale]/_hooks/usebaseQuery";
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL_AG||"https://api.sandbox.pepagora.org/"}source`,
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

export const postBuyingRequestApi = createApi({
  reducerPath: "postRequestApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["postRequestApi"],
  endpoints: (build) => {
    return {
      addPostBuyingRequest: build.mutation<any, any>({
        query: (data) => ({
          url: `/buy-request/create`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["postRequestApi"],
      }),
      getBuyingRequestList: build.query<any, MarketApiQueryInterface>({
        query: ({
          category_id = [],
          subCategory_id = [],
          productCategory_id = [],
          specificSort = "",
          filterBy = {},
          page = 1,
          limit = 10,
          currencyCode = "INR",
        }) => {
          const encodedCategory = encodeQuery(category_id);
          const encodedSubCategory = encodeQuery(subCategory_id);
          const encodedProdCategory = encodeQuery(productCategory_id);
          const encodedFilter = encodeQuery(filterBy);

          return `/buy-request/live-rfq-list?category_id=${encodedCategory}&subcategory_id=${encodedSubCategory}&productCategory_id=${encodedProdCategory}&specificSort=${specificSort}&filterBy=${encodedFilter}&page=${page}&limit=${limit}&currencyCode=${currencyCode}`;
        },
        providesTags: ["postRequestApi"],
      }),
      getAiRfqTitle: build.mutation<
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
    };
  },
});

export const {
  useAddPostBuyingRequestMutation,
  useGetBuyingRequestListQuery,
  useLazyGetBuyingRequestListQuery,
} = postBuyingRequestApi;
