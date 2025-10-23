import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import useCookies from "../../_hooks/useCookies";
import { CommonResponseStructure } from "../../_interface/common";
import {
  CreateLead,
  LeadsDetails,
  LeadsListInterface,
  LeadsListResponse,
} from "../../_interface/LeadsInterface";

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

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["leads", "leadsList","logs"],
  endpoints: (build) => {
    return {
      getLeadsList: build.query<
        CommonResponseStructure<LeadsListResponse>,
        LeadsListInterface
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
          url: `/leads/list`,
          method: "GET",
          params: {
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
            limit: limit ?? 10,
            ...(page && { page }),
            ...(searchQuery && { search: searchQuery }),
            ...(isArchived && { isArchived: isArchived.toString() }),
            ...(isDraft && { isDraft: isDraft.toString() }),
          },
        }),
        providesTags: ["leadsList", "leads","logs"],
      }),
      getLeadsDetails: build.query<
        CommonResponseStructure<LeadsDetails>,
        string
      >({
        query: (id) => ({
          url: `/leads/get/${id}`,
          method: "GET",
        }),
        providesTags: ["leads"],
      }),
      createLeads: build.mutation<any, CreateLead>({
        query: (data) => ({
          url: `/leads/create`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["leadsList"],
      }),
      updateLeads: build.mutation<any, any>({
        query: (data) => ({
          url: `/leads/update/${data.id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["leads"],
      }),
      updateLeadStage: build.mutation<any, any>({
        query: (data) => ({
          url: `/leads/status-update`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["leads"],
      }),
      archiveLeads: build.mutation<any, any>({
        query: (data) => ({
          url: `/leads/status-update`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["leadsList"],
      }),
      addLeadLog: build.mutation<any, any>({
        query: ({ data, id }) => ({
          url: `/leads/add-lead-log/${id}`,
          method: "POST",
          body: data,
          providesTags: ["logs"],
        }),
        invalidatesTags: ["leads"],
      }),
    };
  },
});

export const {
  useGetLeadsListQuery,
  useGetLeadsDetailsQuery,
  useCreateLeadsMutation,
  useUpdateLeadsMutation,
  useArchiveLeadsMutation,
  useUpdateLeadStageMutation,
  useAddLeadLogMutation
} = leadsApi;
