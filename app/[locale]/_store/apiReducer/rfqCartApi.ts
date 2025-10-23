import { useBaseQuery } from "@/app/[locale]/_hooks/usebaseQuery";
import { CommonResponseStructure } from "@/app/[locale]/_interface/common";
import {
  RFQCartItem,
  RFQListQuery,
} from "@/app/[locale]/_interface/RfqCartInterface";
import { createApi } from "@reduxjs/toolkit/query/react";

export const rfqCartApi = createApi({
  reducerPath: "rfqCartApi",
  baseQuery: useBaseQuery,
  tagTypes: ["rfqCartApi"],
  endpoints: (build) => {
    return {
      addToRfqCart: build.mutation<any, any>({
        query: (data) => ({
          url: `/rfq-cart/create`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["rfqCartApi"],
      }),
      postRfqRequest: build.mutation<any, any>({
        query: (data) => ({
          url: `source/buy-request/post-rfq`,
          // url: `source/buy-request/post-rfq-v3`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["rfqCartApi"],
      }),
      getRfqCartList: build.query<
        CommonResponseStructure<RFQCartItem[]>,
        RFQListQuery
      >({
        query: (rfq) =>
          `/rfq-cart/list?rfq=${rfq.rfqType}&currencyCode=${rfq.currencyCode}`,
        providesTags: ["rfqCartApi"],
      }),
      getRfqCartCount: build.query<CommonResponseStructure<any>, void>({
        query: () => `/rfq-cart/count`,
        providesTags: ["rfqCartApi"],
      }),
      updateRfqCart: build.mutation<any, any>({
        query: ({ ...data }) => ({
          url: `rfq-cart/update/${data?.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["rfqCartApi"],
      }),
      removeFromRfqCart: build.mutation<any, string>({
        query: (id) => ({
          url: `rfq-cart/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["rfqCartApi"],
      }),
    };
  },
});

export const {
  useAddToRfqCartMutation,
  useGetRfqCartListQuery,
  useRemoveFromRfqCartMutation,
  useUpdateRfqCartMutation,
  usePostRfqRequestMutation,
  useLazyGetRfqCartListQuery,
  useGetRfqCartCountQuery,
} = rfqCartApi;
