import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import {
  CategoriesListArrayInterface,
  CategoryHomeArrayInterface,
  CommonResponseStructure,
  ConsentInterface,
  NewsletterSubscribeDto,
} from "../../_interface/common";

const baseQuery = fetchBaseQuery({
  baseUrl: `${
    process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
  }`,
  prepareHeaders: (headers) => {
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

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["commonApi", "categoryHome"],
  endpoints: (build) => {
    return {
      getCategoryList: build.query<
        CommonResponseStructure<CategoriesListArrayInterface>,
        { search: string }
      >({
        query: ({ search }) => `/get-category?search=${search ?? ""}`,
        providesTags: ["commonApi"],
      }),
      getMappedSubCategories: build.query<
        CommonResponseStructure<CategoriesListArrayInterface>,
        any
      >({
        query: ({ id, search }) =>
          `/get-mapped-subcategory/${id}?search=${search ?? ""}`,
        providesTags: ["commonApi"],
      }),
      getMappedProductCategories: build.query<
        CommonResponseStructure<CategoriesListArrayInterface>,
        any
      >({
        query: ({ id, search }) =>
          `/get-mapped-product-category/${id}?search=${search ?? ""}`,
        providesTags: ["commonApi"],
      }),
      getSubCatDetails: build.query<any, string>({
        query: (id) => `get-subcategory-detail/${id}`,
      }),
      getDashboardCardDetails: build.query<any, void>({
        query: () => `account-settings/dashboard-card-details`,
      }),
      getDashboardCompilationPercentage: build.query<any, void>({
        query: () => `business-profile/profile-percentage`,
      }),
      getCategoryHome: build.query<
        CommonResponseStructure<CategoryHomeArrayInterface>,
        void
      >({
        query: () => `get-category-home`,
        providesTags: ["categoryHome"],
      }),
      newsletterSubscribe: build.mutation<any, NewsletterSubscribeDto>({
        query: (payload) => ({
          url: "utility/newsletter-subscribe",
          method: "POST",
          body: payload,
        }),
      }),
      setConsentInfo: build.mutation<any, ConsentInterface>({
        query: (payload) => ({
          url: "set-consent-info",
          method: "POST",
          body: payload,
        }),
      }),
      getConsentInfo: build.query<any, any>({
        query: () => ({
          url: "get-consent-info",
          method: "GET",
        }),
      }),
    };
  },
});

export const {
  useGetCategoryListQuery,
  useLazyGetCategoryListQuery,
  useGetMappedSubCategoriesQuery,
  useLazyGetMappedSubCategoriesQuery,
  useGetMappedProductCategoriesQuery,
  useLazyGetMappedProductCategoriesQuery,
  useGetSubCatDetailsQuery,
  useGetDashboardCardDetailsQuery,
  useGetDashboardCompilationPercentageQuery,
  useGetCategoryHomeQuery,
  useNewsletterSubscribeMutation,
  useSetConsentInfoMutation,
  useLazyGetConsentInfoQuery,
} = commonApi;
