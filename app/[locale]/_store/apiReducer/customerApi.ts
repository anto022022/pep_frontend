import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import { CommonResponseStructure } from "../../_interface/common";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CustomerListInterface,
  CustomerListItem,
  CustomerListResponse,
} from "../../_interface/CustomerInterface";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL_AG||"https://api.sandbox.pepagora.org/"}sales/customers`,
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

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["customers"],
  endpoints: (build) => {
    return {
      getCustomersDropdownList: build.query<
        CommonResponseStructure<CustomerListResponse>,
        CustomerListInterface
      >({
        query: ({ search, limit, page }) => ({
          url: `/dropdown-list`,
          method: "GET",
          params: {
            ...(search && { search }),
            limit: limit ?? 7,
            page: page ?? 1,
          },
          providesTags: ["customers"],
        }),
      }),
      createCustomer: build.mutation<
        CommonResponseStructure<CustomerListItem>,
        CustomerListItem
      >({
        query: (data) => ({
          url: `/create`,
          method: "POST",
          body: data,
        }),
      }),
    };
  },
});

export const {
  useCreateCustomerMutation,
  useLazyGetCustomersDropdownListQuery,
} = customerApi;
