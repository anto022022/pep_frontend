import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import { CommonResponseStructure } from "../../_interface/common";
import { attachment } from "../../_interface/ConnectInterface";
import {
  BuyingRequestListResponse,
  CreateBuyingRequest,
  ListInterface,
} from "../../_interface/RfqInterface";

export interface MessageDto {
  threadId?: string;
  subject: string;
  content: string;
  attachment?: attachment[];
  fav?: boolean;
  read?: boolean;
  to?: string[];
  cc?: string[];
  bcc?: string[];
}
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"}source`,
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

export const buyingRequestApi = createApi({
  reducerPath: "buyingRequestApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["buyingRequest", "messages"],
  endpoints: (build) => {
    return {
      createBuyingRequest: build.mutation<any, CreateBuyingRequest>({
        query: (data) => ({
          url: `/buy-request/create`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["buyingRequest"],
      }),
      getBuyingRequestList: build.query<
        CommonResponseStructure<BuyingRequestListResponse>,
        ListInterface
      >({
        query: ({
          sortBy,
          sortOrder,
          limit,
          page,
          searchQuery,
          isArchived,
          isDraft,
        }) => ({
          url: `/buy-request/list`,
          params: {
            ...(sortBy && { sort_by: sortBy }),
            ...(sortOrder && { order: sortOrder }),
            limit: limit ?? 10,
            ...(page && { page }),
            ...(searchQuery && { search: searchQuery }),
            ...(isArchived && { isArchived: isArchived.toString() }),
            ...(isDraft && { isDraft: isDraft.toString() }),
          },
        }),
        providesTags: ["buyingRequest"],
      }),
      getBuyingRequestDetails: build.query<any, any>({
        query: (id) => `/get-buying-request/${id}`,
        providesTags: ["buyingRequest"],
      }),
      updateBuyingRequestArchive: build.mutation<any, any>({
        query: (data) => ({
          url: `/buy-request/status-update`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (_result, _error, { skipCacheUpdate }) =>
          skipCacheUpdate ? [] : ["buyingRequest"],
      }),
      updateBuyingRequest: build.mutation<any, { data: CreateBuyingRequest, id: string }>({
        query: (data) => ({
          url: `/buy-request/update/${data.id}`,
          method: "PATCH",
          body: data.data,
        }),
        invalidatesTags: (_result, _error, { id }) =>
          id ? ["buyingRequest"] : [],
      }),
      sendMessage: build.mutation<MessageDto, any>({
        query: (data) => ({
          url: `/message/create`,
          method: "POST",
          body: data,
        }),
      }),
      getMessageThreads: build.query<any, any>({
        query: ({ page, limit, pageType, threadId }) => ({
          url: `/message/get-thread/${threadId}`,
          method: "GET",
          params: {
            ...(page && { page }),
            ...(limit && { limit }),
            ...(pageType && { pageType }),
          },
        }),
      }),
      updateMessageStatus: build.mutation<any, any>({
        query: (data) => ({
          url: `/message/update-status`,
          method: "PATCH",
          body: data,
        }),
      }),
    };
  },
});

export const {
  useCreateBuyingRequestMutation,
  useGetBuyingRequestListQuery,
  useGetBuyingRequestDetailsQuery,
  useUpdateBuyingRequestArchiveMutation,
  useUpdateBuyingRequestMutation,
  useSendMessageMutation,
  useGetMessageThreadsQuery,
  useUpdateMessageStatusMutation,
} = buyingRequestApi;
